# [Observablehq.com](https://observablehq.com) Notebook Monitoring with [sentry.io](sentry.io)

Sick of broken notebooks? Don't be that guy!


With some minor configuration you can have [sentry.io](sentry.io) monitor notebooks for unexpected errors, so you get informed fast when something breaks, and get to the bottom of those tricky to repro issues.

Best thing? For low traffic single developer use cases.... its FREE

```js
import {sentry} from '@endpointservices/sentry'
```

Usage
```js
  sentry({
    DSN: "..." // find in the Client Keys section of Sentry,
    namespaces: ['tomlarkworthy', 'endpointservices'] // Change to your namespace(s)
  })
```

### Change log
- 2022-08-24 Remove preview image as it was 1.7MB of bloat!
- 2022-03-31 Added *catchAll* to report runtime caught error (previously a blind spot)

## Example Sentry error report

Sentry will notify you if an exception is thrown, and tries to group them. It will include

- Error message
- URL of the notebook
- OS, browser, device

Here is a real one my notebooks are throwing occasionally at the moment!

![image@1.png](${await FileAttachment("image-3@1.png").url()})

It will also include the last few requests that occured, and the stack trace. In this report there is a problem loading the Firebase SDK, which I have realised is a rare, but regular occurrence! With that information I can see my users would benefit with an upgrade to the new SDK which is packed in a [modular ESM compatible way](https://firebase.google.com/docs/web/modular-upgrade)

![image@2.png](${await FileAttachment("image-2 (1).png").url()})


### Configuring Sentry

By default Sentry collects IP addresses which is sensitive personal data by GDPR definitions. So I recommend turning this off and turning on various other data scrubbing tools in the settings.

![image@3.png](${await FileAttachment("image-3.png").url()})

### Sentry

We customize Sentry initialization to rewrites the URL, so usage is reported against the top level Observable URL and not the nonsensical content domain of the userspace iframe. Include your Sentry supplied DSN and which Observable NAMESPACEs you wish to report errors for.

```js
  sentry({
    DSN: "..." // find in the Client Keys section of Sentry,
    namespaces: ['tomlarkworthy', 'endpointservices']
  })
```


```js
sentry = ({ DSN, namespaces } = {}) => {
  if (!DSN) throw new Error("You must supply your DSN");
  if (!namespaces)
    throw new Error(
      "You must supply are array of namespaces to active sentry for"
    );
  const selfUrl = html`<a href="?">`.href;
  if (
    !(
      namespaces.find((namespace) => selfUrl.includes(`@${namespace}`)) ||
      namespaces.find((namespace) =>
        location.origin.includes(`https://${namespace}`)
      )
    )
  ) {
    return; // Do not initialize Sentry for unexpected namespaces
  }
  const sentry = Sentry.init({
    dsn: DSN,
    beforeSend: (event) => {
      event.request.url = html`<a href="?">`.href.split("?")[0];
      return event;
    },
    integrations: [new Tracing.Integrations.BrowserTracing()],
    tracesSampleRate: 1.0
  });
  catchAll((cellName, reason) => {
    Sentry.captureException(reason);
  }, invalidation);

  return Sentry;
}
```

```js
Sentry = import("https://cdn.skypack.dev/@sentry/browser?min")
```

```js
Tracing = import("https://cdn.skypack.dev/@sentry/tracing@7.0.0?min")
```

```js
import { catchAll } from "@tomlarkworthy/catch-all"
```

### Works with [WEBCode.run](https://webcode.run)

Because the Observable native, functions-as-a-service runtime [webcode.run](https://webcode.run) is run inside a browser, you get reports of server side errors too!


```js
import { footer } from "@endpointservices/footer"
```

```js
footer
```
