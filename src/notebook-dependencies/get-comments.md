```js
md`# ⛔️ Get Notebook Comments ⚠️

This uses a CORS bypass to read comments for a notebook. This does not use a public API and therefore is risky to depend on.

We use this channel as a component of authentication, critically Observable states the user login of the commentator.
`
```

```js
exampleWithCustomURL = getCommentsAndNamespace(
  "https://observablehq.com/@endpointservices/get-comments"
)
```

```js
exampleById = getCommentsAndNamespace(
  "https://observablehq.com/d/2953e428f445d12f"
)
```

## Change log
- 2022-06-15 Change from sniffing iframe to looking for RSS feed to determine notebook namespace (Bug fix for design change)

```js
testing = {
  const [{ Runtime }, { default: define }] = await Promise.all([
    import(
      "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js"
    ),
    import(`https://api.observablehq.com/@tomlarkworthy/testing.js?v=3`)
  ]);
  const module = new Runtime().module(define);
  return Object.fromEntries(
    await Promise.all(
      ["expect", "createSuite"].map((n) => module.value(n).then((v) => [n, v]))
    )
  );
}
```

```js echo
expect = testing.expect
```

```js
viewof suite = testing.createSuite()
```

```js echo
suite.test("getCommentsAndNamespace with custom URL", async () => {
  expect(exampleWithCustomURL.namespace).toBe("endpointservices");
  expect(exampleWithCustomURL.comments.length).toBeGreaterThanOrEqual(1);
  const lookup = exampleWithCustomURL.comments.find(
    (el) => el.content === "Hi I am leaving a comment"
  );
  expect(lookup).toBeDefined();
  expect(lookup.user.login).toBe("tomlarkworthy");
})
```

```js echo
suite.test("getCommentsAndNamespace with ID URL", async () => {
  expect(exampleById.namespace).toBe("endpointservices");
  expect(exampleById.comments.length).toBeGreaterThanOrEqual(1);
  const lookup = exampleById.comments.find((el) => el.content === "myComment");
  expect(lookup).toBeDefined();
  expect(lookup.user.login).toBe("tomlarkworthy");
})
```

```js echo
getComments = async (notebookURL) => {
  const apiCall = await fetchp(notebookURL);
  if (apiCall.status !== 200) throw new Error(`Error ${apiCall.status}, ${await apiCall.text()}`)
  const content = await (apiCall).text();
  const dom = new DOMParser().parseFromString(content, "text/html")
  const data = JSON.parse(dom.querySelector("#__NEXT_DATA__").innerHTML);
  return findComments(data);
}
```

```js echo
getCommentsAndNamespace = async notebookURL => {
  const apiCall = await fetchp(notebookURL);
  if (apiCall.status == 404)
    return { comments: undefined, namespace: undefined };
  if (apiCall.status !== 200)
    throw new Error(`Error ${apiCall.status}, ${await apiCall.text()}`);
  const content = await apiCall.text();
  const dom = new DOMParser().parseFromString(content, "text/html");
  const data = JSON.parse(dom.querySelector("#__NEXT_DATA__").innerHTML);
  const comments = findComments(data);
  const namespace = findNamespace(dom);
  return { comments, namespace };
}
```

```js echo
function findComments(obj) {
  if (!obj) return;
  if (typeof obj !== "object") return;
  for (let key of Object.keys(obj)) {
    if (key === "comments") {
      return obj[key];
    } else {
      const subfind = findComments(obj[key]);
      if (subfind !== undefined) return subfind;
    }
  }
}
```

```js echo
function findNamespace(dom) {
  if (!dom) return;
  const rssLink = dom.querySelector(
    "link[rel=alternate][type='application/rss+xml']"
  );
  if (rssLink) {
    return /@(.*)\.rss/.exec(rssLink.href)[1];
  }
  // Old way, perhaps does not work anymore
  const iframe = dom.querySelector("iframe[src]");
  if (!iframe) {
    debugger;
    throw new Error("Cannot find iframe");
  }
  return /^https:\/\/([^.]*)\.static\.observableusercontent\.com/.exec(
    iframe.src
  )[1];
}
```

```js echo
fetchp = (url) =>
  fetch(
    "https://webcode.run/observablehq.com/@endpointservices/observable-proxy;proxy_d2d3fe67a2",
    {
      method: "POST",
      body: JSON.stringify({
        options: {},
        url: url
      })
    }
  )
```

```js
import { footer } from "@endpointservices/footer" // cannot work with -backups
```

```js
footer
```
