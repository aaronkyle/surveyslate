//# Notebook Deploy to S3

//Reads Notebook code (the tar.gz file from the "Download Code" feature), unpacks, and //uploads the individual files to S3, guesses MIME type based on file extension and invalidates CloudFront cache if applicable.

//For utility notebooks like this one, you can run them directly from AWS, For example, I uploaded *this* notebook to S3, see:-

//http://tomlarkworthy-access-aws.s3-website.eu-central-1.amazonaws.com/notebooks/1/index.html

//For access direct from a bucket, you will need to set you bucket up for public access and serving static websites. Con: only insecure HTTP access

//https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html

//The simplest way to get secure SSL access is to use a CloudFront dsitribution:

//https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-https-requests-s3/

//then you can access it with SSL through an auto provisioned domain:-

//https://d3gckb7a9lekvd.cloudfront.net/notebooks/1/index.html

//If you wish to automate this notebook, simply rewrite the config cells at import time (https://observablehq.com/@observablehq/introduction-to-imports). 



import * as Inputs from "/components/inputs_observable.js";

import { Generators, Mutable } from "observablehq:stdlib";


///!!! NOTE: This may be part of the config issue
///
//import {
//  viewof manualCredentials,
//  saveCreds,
//  putObject,
//  createInvalidation
//} with { REGION } from "@tomlarkworthy/aws"
import {
  manualCredentialsElement,
  manualCredentials,
  saveCredsElement,
  saveCreds,
  putObject,
  createInvalidation
//} with { REGION } from "/components/aws.js"
} from "/components/aws.js"

//import { localStorageView } from '@tomlarkworthy/local-storage-view'
import { localStorageView } from '/components/local-storage-view.js';

//import { getMetadata } from '@mootari/notebook-data'
import { getMetadata } from '/components/notebook-data.js';

//mimetypes = import('https://cdn.skypack.dev/mime-types@2.1.32?min')
import mimetypes from "https://cdn.skypack.dev/mime-types@2.1.32?min";

//jszip = require("jszip@3/dist/jszip.min.js")
import jszip from "jszip/dist/jszip.min.js";

//const pako = require('https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako.es5.min.js')
import * as pako from "https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako.es5.min.js";

//untar = require('js-untar')
import untar from "js-untar";


let REGION = 'eu-central-1'

import markdownit from "markdown-it";


const Markdown = new markdownit({html: true});
function md(strings) {
  let string = strings[0];
  for (let i = 1; i < arguments.length; ++i) {
    string += String(arguments[i]);
    string += strings[i];
  }
  const template = document.createElement("template");
  template.innerHTML = Markdown.render(string);
  return template.content.cloneNode(true);
}



// State (Mutables) and setters


//mutable gzTarBytes = undefined
const gzTarBytes = new Mutable(undefined);

function setGzTarBytes(bytes) {
  gzTarBytes.value = bytes; // triggers reactive dependents
}

//mutable deployed = false
const deployed = new Mutable(false);

function setDeployed(value) {
  deployed.value = value;
}

//mutable index = (files, 0)
const index = Mutable(0);

const setIndex = (x) => (index.value = x);
const incIndex = () => (index.value = index.value + 1);


// UI elements (Inputs.*) and their derived values



//viewof notebookURL = Inputs.bind(
//  Inputs.text({
//    width: "1vu",
//    label: "URL of notebook",
//    placeholder: "https://observablehq.com/@tomlarkworthy/notebook-deploy-to-s3"
//  }),
//  localStorageView(`deploy_to_s3_notebookURL`)
//)
const notebookURLElement = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "URL of notebook",
    placeholder: "https://observablehq.com/@tomlarkworthy/notebook-deploy-to-s3"
  }),
  localStorageView(`deploy_to_s3_notebookURL`)
);
const notebookURL = Generators.input(notebookURLElement);

const notebook = notebookURL.replace('https://observablehq.com/', '');



//viewof cells = Inputs.bind(
const cellsElement = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "[Optional] cells (comma seperated)",
    placeholder: "viewof notebookURL, viewof cells"
  }),
  localStorageView(`deploy_to_s3_notebookURL`)
);
const cells = Generators.input(cellsElement);




//viewof s3Target = Inputs.bind(
const s3TargetElement = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "S3 bucket + path",
    placeholder: "tomlarkworthy-access-aws/notebooks/1"
  }),
  localStorageView(`deploy_to_s3_s3target`)
);
const s3Target = Generators.input(s3TargetElement);




const bucket = s3Target.split("/")[0]

const path = s3Target.substring(bucket.length).replace(/^\//, '')



//viewof API_KEY = Inputs.bind(
const API_KEYElement = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "[Optional] Observablehq API key"
  }),
  localStorageView(`deploy_to_s3_apikey`)
);
const API_KEY = Generators.input(API_KEYElement);




//viewof CLOUD_FRONT_DISTRIBUTION_ID = Inputs.bind(
const CLOUD_FRONT_DISTRIBUTION_IDElement = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "[Optional] Cloud Front distribution ID"
  }),
  localStorageView(`deploy_to_s3_cf_d_id`)
);
const CLOUD_FRONT_DISTRIBUTION_ID = Generators.input(CLOUD_FRONT_DISTRIBUTION_IDElement);




//viewof INVALIDATION_PATH = Inputs.bind(
const INVALIDATION_PATHElement = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "[Optional] Cloud Front paths",
    placeholder: "/notebooks/1/index.*"
  }),
  localStorageView(`deploy_to_s3_cf_path`)
)
const INVALIDATION_PATH = Generators.input(INVALIDATION_PATHElement);





//viewof indexHtml = Inputs.bind(
const indexHtmlElement = Inputs.bind(
  Inputs.textarea({
    width: "1vu",
    rows: 50,
    label: "[Optional] Optional index.html"
  }),
  localStorageView(`deploy_to_s3_index.html`)
);
const indexHtml = Generators.input(indexHtmlElement);



//viewof uploadButton = Inputs.button("Deploy", {
const uploadButtonElement = Inputs.button("Deploy", {
  reduce: async () => {
    const url = `https://api.observablehq.com/${notebook}.tgz?v=3${
      API_KEY.length > 0 ? `&api_key=${API_KEY}` : ""
    }`;
    const response = await fetch(url);
    if (response.status !== 200)
      throw new Error(`${response.status} ${await response.text()}`);
    //mutable gzTarBytes = response.arrayBuffer();
    setGzTarBytes(await response.arrayBuffer());
    //mutable deployed = false;
    setDeployed(false);
  }
});
const uploadButton = Generators.input(uploadButtonElement);



const tarBytes = (async() => {
  const buffer = new Uint8Array(gzTarBytes);
  return await pako.ungzip(buffer);
})();



const files = await untar(tarBytes.buffer);



/// adding in dependency-reset behavior from original mutable definition
{ files; setIndex(0) }



const currentFile = files[index];



const uploader = (async () => {
  // upload current file
  const filename = files[index].name.replace("./", "");
  if (filename === "index.html" && indexHtml.length > 0) {
    files[index].buffer = indexHtml; // Not really a buffer but putObject accepts both
  }
  await putObject(bucket, path + "/" + filename, files[index].buffer, {
    ContentType: mimetypes.contentType(filename)
  });

  if (index < files.length - 1) {
    // next file
    //mutable index = mutable index + 1;
    incIndex();
  } else {
    // done!
    // Invalidate cloud front cache if needed.
    if (CLOUD_FRONT_DISTRIBUTION_ID.length > 0) {
      await createInvalidation(CLOUD_FRONT_DISTRIBUTION_ID, [
        INVALIDATION_PATH
      ]);
    }
    //mutable deployed = true;
    setDeployed(true);
  }
})()


export {
  notebookURLElement,
  s3TargetElement,
  indexHtmlElement,
  API_KEYElement,
  CLOUD_FRONT_DISTRIBUTION_IDElement,
  INVALIDATION_PATHElement,
  uploadButtonElement,
  files,
  deployed
};
