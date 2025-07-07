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


```js
viewof notebookURL = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "URL of notebook",
    placeholder: "https://observablehq.com/@tomlarkworthy/notebook-deploy-to-s3"
  }),
  localStorageView(`deploy_to_s3_notebookURL`)
)
```

```js
notebook = notebookURL.replace('https://observablehq.com/', '')
```

```js
viewof cells = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "[Optional] cells (comma seperated)",
    placeholder: "viewof notebookURL, viewof cells"
  }),
  localStorageView(`deploy_to_s3_notebookURL`)
)
```

```js
viewof s3Target = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "S3 bucket + path",
    placeholder: 'tomlarkworthy-access-aws/notebooks/1'
  }),
  localStorageView(`deploy_to_s3_s3target`)
)
```

```js
bucket = s3Target.split("/")[0]
```

```js
path = s3Target.substring(bucket.length).replace(/^\//, '')
```

```js
viewof manualCredentials
```

```js
saveCreds
```

```js
viewof API_KEY = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "[Optional] Observablehq API key"
  }),
  localStorageView(`deploy_to_s3_apikey`)
)
```

```js
viewof CLOUD_FRONT_DISTRIBUTION_ID = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "[Optional] Cloud Front distribution ID"
  }),
  localStorageView(`deploy_to_s3_cf_d_id`)
)
```

```js
viewof INVALIDATION_PATH = Inputs.bind(
  Inputs.text({
    width: "1vu",
    label: "[Optional] Cloud Front paths",
    placeholder: "/notebooks/1/index.*"
  }),
  localStorageView(`deploy_to_s3_cf_path`)
)
```

```js echo
viewof indexHtml = Inputs.bind(
  Inputs.textarea({
    width: "1vu",
    rows: 50,
    label: "[Optional] Optional index.html"
  }),
  localStorageView(`deploy_to_s3_index.html`)
)
```

```js
viewof uploadButton = Inputs.button("Deploy", {
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
})
```

```js
mutable gzTarBytes = undefined
```

```js
tarBytes = {
  const buffer = new Uint8Array(gzTarBytes);
  return await pako.ungzip(buffer);
}
```

```js
files = await untar(tarBytes.buffer)
```

```js
mutable deployed = false
```

```js
md`Current: ${files[index].name}`
```

```js
mutable index = (files, 0)
```

```js
currentFile = files[index]
```

```js echo
uploader = {
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

```js
REGION = 'eu-central-1'
```

```js
import {
  viewof manualCredentials,
  saveCreds,
  putObject,
  createInvalidation
} with { REGION } from "@tomlarkworthy/aws"
```

```js
import { localStorageView } from '@tomlarkworthy/local-storage-view'
```

```js
import { getMetadata } from '@mootari/notebook-data'
```

```js
mimetypes = import('https://cdn.skypack.dev/mime-types@2.1.32?min')
```

```js
jszip = require("jszip@3/dist/jszip.min.js")
```

```js
pako = require('https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako.es5.min.js')
```

```js
untar = require('js-untar')
```
