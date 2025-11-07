# On Version Notebook Hook 

Execute a JS callback function when a notebook version is created (note the code will be executed on a remote machine). Could be useful for wiring up Observable as the front end to a CRM or for a Continuous Delivery process. Publishing a notebook always causes a version bump.

     ~~~js
     import { onVersion } from "@endpointservices/onversion"
     ~~~

A good initial hook is to call a [request logging service](https://observablehq.com/@endpointservices/realtime-request-log) so you can confirm the hook is firing. 

~~~js
onVersion((metadata) => {
  fetch(
    `https://webcode.run/observablehq.com/@endpointservices/realtime-request-log` + 
    `/version-\${metadata?.id}@\${metadata?.version}`
  );
})
~~~

The hook is passed the notebook id and version.

~~~js
{
  "id":"8aac8b2cb06bf434",
  "version":"113",
}
~~~

Inspired by a thread on [Observable Talk](https://talk.observablehq.com/t/triggering-a-build-process-on-publish-notebook-event/5719/4)


${(onVersion, '')}


### Low Latency

With a sample size of 1, I recorded a latency of seven seconds

```html
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/lGYdoCNkdAk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

### How it works

When a notebook is published, Observable's infra loads the notebook to scan for metadata. We can detect this process by looking at the host URL (and a few other ways) 

#### Example - WebHook

In this example we ask the notebook to make an outbound request after a notebook is published.

For our example we called an external [request log](https://observablehq.com/@endpointservices/realtime-request-log) so it can be verified that the custom code was executed. Here is how this demo is logged (note we see the notebook ID and version in the URL suffix)

<img width=500 src=${await FileAttachment("image@1.png").url()}></img>

```js
const nonce = 3
```

```js echo
onVersion((metadata) => {
  fetch(
    `https://webcode.run/observablehq.com/@endpointservices/realtime-request-log/version-${metadata?.id}@${metadata?.version}`
  );
})
```

### Implementation

We check to see if the URL is prefixed with /thumbnail

```js echo
const extractMetadata = (pathname) => {
  const match = /^\/thumbnail\/(\S+)@(\d+)/.exec(pathname);
  if (!match) return undefined;
  return {
    id: match[1],
    version: match[2]
  };
}
```

```js echo
const onVersion = async (work) => {
  const metadata = extractMetadata(html`<a href="#">`.pathname);
  if (metadata) {
    work(metadata);
  }
  return work;
}
```

```js
//import { footer } from "@endpointservices/footer"
```

```js
//footer
```
