# Notebook Deploy to S3

Reads Notebook code (the tar.gz file from the "Download Code" feature), unpacks, and uploads the individual files to S3, guesses MIME type based on file extension and invalidates CloudFront cache if applicable.

For utility notebooks like this one, you can run them directly from AWS, For example, I uploaded *this* notebook to S3, see:-

http://tomlarkworthy-access-aws.s3-website.eu-central-1.amazonaws.com/notebooks/1/index.html

For access direct from a bucket, you will need to set you bucket up for public access and serving static websites. Con: only insecure HTTP access

https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html

The simplest way to get secure SSL access is to use a CloudFront dsitribution:

https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-https-requests-s3/

then you can access it with SSL through an auto provisioned domain:-

https://d3gckb7a9lekvd.cloudfront.net/notebooks/1/index.html

If you wish to automate this notebook, simply rewrite the config cells at import time (https://observablehq.com/@observablehq/introduction-to-imports). 


```js echo
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
display(notebookURLElement)

```

```js echo
const notebook = notebookURL.replace('https://observablehq.com/', '')
```

```js echo
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
display(cellsElement)
```

```js echo
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
display(s3TargetElement)
```

```js echo
const bucket = s3Target.split("/")[0]
```

```js echo
const path = s3Target.substring(bucket.length).replace(/^\//, '')
```

```js echo
//viewof manualCredentials
manualCredentialsElement
viewof manualCredentials
```

```js echo
saveCreds
```

```js echo
//viewof API_KEY = Inputs.bind(
const API_KEYElement = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "[Optional] Observablehq API key"
  }),
  localStorageView(`deploy_to_s3_apikey`)
);
const API_KEY = Generators.input(API_KEYElement);
display(API_KEYElement)
```

```js echo
//viewof CLOUD_FRONT_DISTRIBUTION_ID = Inputs.bind(
const INVALIDATION_PATHElement = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "[Optional] Cloud Front paths",
    placeholder: "/notebooks/1/index.*"
  }),
  localStorageView(`deploy_to_s3_cf_path`)
);
const INVALIDATION_PATH = Generators.input(INVALIDATION_PATHElement);
display(INVALIDATION_PATHElement)
```

```js echo
//viewof INVALIDATION_PATH = Inputs.bind(
const INVALIDATION_PATHElement = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "[Optional] Cloud Front paths",
    placeholder: "/notebooks/1/index.*"
  }),
  localStorageView(`deploy_to_s3_cf_path`)
)
```

```js echo
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
display(indexHtmlElement)
```

```js echo
//viewof uploadButton = Inputs.button("Deploy", {
const uploadButtonElement = Inputs.button("Deploy", {
  reduce: async () => {
    const url = `https://api.observablehq.com/${notebook}.tgz?v=3${
      API_KEY.length > 0 ? `&api_key=${API_KEY}` : ""
    }`;
    const response = await fetch(url);
    if (response.status !== 200)
      throw new Error(`${response.status} ${await response.text()}`);
    mutable gzTarBytes = response.arrayBuffer();
    mutable deployed = false;
  }
});
const uploadButton = Generators.input(uploadButtonElement);
display(uploadButtonElement)
```

```js echo
mutable gzTarBytes = undefined
```

```js echo
const tarBytes = () => {
  const buffer = new Uint8Array(gzTarBytes);
  return await pako.ungzip(buffer);
};
display(tarBytes)
```

```js echo
files = await untar(tarBytes.buffer);
display(files)
```

```js echo
mutable deployed = false
```

```js echo
md`Current: ${files[index].name}`
```

```js echo
mutable index = (files, 0)
```

```js echo
const currentFile = files[index];
display(currentFile )
```

```js echo
const uploader = {
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
    mutable index = mutable index + 1;
  } else {
    // done!
    // Invalidate cloud front cache if needed.
    if (CLOUD_FRONT_DISTRIBUTION_ID.length > 0) {
      await createInvalidation(CLOUD_FRONT_DISTRIBUTION_ID, [
        INVALIDATION_PATH
      ]);
    }
    mutable deployed = true;
  }
}
```

```js echo
let REGION = 'eu-central-1'
```

```js echo
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
```

```js echo
//import { localStorageView } from '@tomlarkworthy/local-storage-view'
import { localStorageView } from '/components/local-storage-view.js'
```

```js echo
import { getMetadata } from '@mootari/notebook-data'
```

```js echo
//mimetypes = import('https://cdn.skypack.dev/mime-types@2.1.32?min')
import mimetypes from "https://cdn.skypack.dev/mime-types@2.1.32?min";

```

```js echo
//jszip = require("jszip@3/dist/jszip.min.js")
import jszip from "jszip/dist/jszip.min.js";
```

```js echo
//const pako = require('https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako.es5.min.js')
import * as pako from "https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako.es5.min.js";
```

```js echo
//untar = require('js-untar')
import untar from "js-untar";
```
