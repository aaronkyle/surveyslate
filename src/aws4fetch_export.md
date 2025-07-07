# [aws4fetch](https://github.com/mhart/aws4fetch) (export)

```
    ~~~js
        import {AwsClient, AwsV4Signer} from '@tomlarkworthy/aws4fetch'
    ~~~
```

```js echo
export const aws4fetch = async () => {
  const response = await new Response(
    (
      await FileAttachment("aws4fetch.esm.js.gz").stream()
    ).pipeThrough(new DecompressionStream("gzip"))
  );

  const blob = await response.blob();
  const objectURL = URL.createObjectURL(
    new Blob([blob], { type: "application/javascript" })
  );

  try {
    return await import(objectURL);
  } finally {
    URL.revokeObjectURL(objectURL); // Ensure URL is revoked after import
  }
}
```

```js echo
export const AwsClient = aws4fetch.AwsClient
```

```js echo
export const AwsV4Signer = aws4fetch.AwsV4Signer
```
