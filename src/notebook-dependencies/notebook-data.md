# Version Pinning for Notebooks


```js
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
```


Observable supports version pinning by appending the version number to the notebook name or path.

These functions make it easier to look up the most recent version of notebooks, and to use pinned versions in your own documentation. Example:`

```js echo
md`\`\`\`js
import {getCurrentPinnedName} from '${await getCurrentPinnedName()}'
\`\`\``
```

```js
md`---
## Current Notebook
Functions that can be used to obtain information about the currently viewed notebook. Metadata and the pinned name will be available once you have shared or published your notebook. Reload the page after publishing to see the updated version number.

${dataTable([
  ['getCurrentLocalPath', getCurrentLocalPath()],
  ['getCurrentPath', getCurrentPath()],
  ['getCurrentName', getCurrentName()],
  ['getCurrentPinnedName', await getCurrentPinnedName()],
  ['getCurrentMetadata', await getCurrentMetadata()],
  ['getCurrentComparePath', await getCurrentComparePath(299)]
])}

`
```

```js
function getCurrentLocalPath() {
  return html`<a href="#">`.pathname;
}
```

```js
function getCurrentPath() {
  return formatPath(getCurrentName());
}
```

```js
function getCurrentName() {
  return getCurrentLocalPath().replace(/^\/(d\/)?/, '');
}
```

```js
async function getCurrentPinnedName() {
  const data = await getCurrentMetadata();
  if(data && data.version) return formatName(getCurrentName(), data.version);
  return null;
}
```

```js
const getCurrentMetadata = {
  let data;
  return async function getCurrentMetadata(refetch = false) {
    if(data === undefined || refetch) data = await getMetadata(getCurrentName());
    return data;
  }
}
```

```js
async function getCurrentComparePath(version1 = null, version2 = null) {
  const data = await getMetadata(getCurrentName());
  if(data) return formatComparePath(data.id, version1, data.id, version2);
  return null;
}
```

```js
md`---
## Other Notebooks
Functions for retrieving information about any notebooks.
`
```

```js
viewof preview_name = {
  const submit = html`<input type="button" value="Submit">`;
  const input = html`<input type="text" value="@jashkenas/inputs">`;
  const view = html`<form>${input} ${submit}`;
  input.oninput = e => e.stopPropagation();
  submit.onclick = () => { view.value = input.value; view.dispatchEvent(new Event('input')) };
  view.value = input.value;
  return view;
}
```

```js
dataTable([
  ['formatLocalPath', formatLocalPath(preview_name)],
  ['formatPath', formatPath(preview_name)],
  ['formatSourcePath', formatSourcePath(preview_name)],
  ['getPinnedName', await getPinnedName(preview_name)],
  ['getPinnedPath', await getPinnedPath(preview_name)],
  ['getSource', await getSource(preview_name)],
  ['getMetadata', await getMetadata(preview_name)],
])
```

```js
function formatLocalPath(name, version = null) {
  return '/' + (name.match(/^@/) ? name : 'd/' + name) + (version ? '@' + version : '');
}
```

```js
function formatPath(name, version = null) {
  return `https://${domain}${formatLocalPath(name, version)}`;
}
```

```js
function formatSourcePath(name, version = null) {
  return `https://${apiDomain}${formatLocalPath(name, version)}.js`;
}
```

```js
function formatName(name, version = null) {
  return name + (version ? '@' + version : '');
}
```

```js
function formatId(id, version = null) {
  return id + (version ? '@' + version : '');
}
```

```js
function formatComparePath(id1, version1, id2, version2) {
  return `https://${domain}/compare/${formatId(id1, version1)}...${formatId(id2, version2)}`;
}
```

```js
async function getPinnedName(name) {
  const data = await getMetadata(name);
  if(data && data.version) return name + '@' + data.version;
  return null;
}
```

```js
async function getPinnedPath(name) {
  const data = await getMetadata(name);
  if(data && data.version) return formatPath(name, data.version);
  return null;
}
```

```js
async function getComparePath(name, version1 = null, version2 = null) {
  const data = await getMetadata(name);
  if(data) return formatComparePath(data.id, version1, data.id, version2);
  return null;
}
```

```js
async function getSource(name, version = null) {
  const path = formatSourcePath(name, version);
  try {
    const response = await fetch(path, {cache: version ? 'default' : 'no-cache'});
    return await response.text();
  }
  catch(e) { return null; }  
}
```

```js
async function getMetadata(name, version = null) {
  const map = {
    'URL': 'url',
    'Title': 'title',
    'Author': 'author',
    'Version': 'version',
    'Runtime version': 'runtimeVersion'
  };
  const source = await getSource(name, version);
  if(!source) return null;
  
  const frontmatter = source.match(/^(?:\/\/ .+?\n)+/);
  const id = source.match(/^\s+?id:\s+?"([^@"]+)/m);
  if(!frontmatter || !id) return null;
  
  return frontmatter[0].split(/\n/).reduce((data, s) => {
    const m = s.match(/^\/\/ ([^:]+?):\s+?(.+?)$/);
    if(m && map.hasOwnProperty(m[1])) data[map[m[1]]] = m[2];
    return data;
  }, {id: id[1]});
}
```

---

```js
const domain = 'observablehq.com'
```

```js
const apiDomain = 'api.observablehq.com'
```

```js
function dataTable(rows) {
  const style = 'padding:.5em;vertical-align:top';
  const n = rows.map(([l,d]) => {
    const wrap = html`<div style="max-height:10em;overflow:auto;word-break:break-word">`;
    wrap.textContent = JSON.stringify(d);
    return html`<tr><th style="${style}">${l}</th><td style="${style};font-family:monospace">${wrap}</td>`;
  });
  return html`<table>${n}`;
}
```
