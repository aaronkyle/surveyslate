# 01 test 2



```js echo
import * as Files from "/components/files.js";
display(Files)
```





```js echo
//import { slider } from "/inputs.js";
```

```js echo
import {FileAttachment} from "@observablehq/stdlib";
display(FileAttachment)
```

```js echo
//import * as Files from "@observablehq/stdlib/files/index.js";
//display(Files)
```




```js echo
import { slider } from "/00-test.js";
```



```js echo
import { DOM } from "/components/DOM.js";
```

---

```js
import {require} from "npm:d3-require";
```

```js
const d3format = require("d3-format@1")
```

```js
import markdownit from "markdown-it";
```

```js
const Markdown = new markdownit({html: true});

function md(strings, ...values) {
  const raw = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
  const template = document.createElement("template");
  template.innerHTML = Markdown.render(raw);
  return template.content.cloneNode(true);
}
```

```js
function input(config) {
  let {
    form,
    type = "text",
    attributes = {},
    action,
    getValue,
    title,
    description,
    format,
    display,
    submit,
    options
  } = config;
  const wrapper = html`<div></div>`;
  if (!form)
    form = html`<form>
	<input name=input type=${type} />
  </form>`;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) form.input.setAttribute(key, val);
  });
  if (submit)
    form.append(
      html`<input name=submit type=submit style="margin: 0 0.75em" value="${
        typeof submit == "string" ? submit : "Submit"
      }" />`
    );
  form.append(
    html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`
  );
  if (title)
    form.prepend(
      html`<div style="font: 700 0.9rem sans-serif; margin-bottom: 3px;">${title}</div>`
    );
  if (description)
    form.append(
      html`<div style="font-size: 0.85rem; font-style: italic; margin-top: 3px;">${description}</div>`
    );
  if (format)
    format = typeof format === "function" ? format : d3format.format(format);
  if (action) {
    action(form);
  } else {
    const verb = submit
      ? "onsubmit"
      : type == "button"
      ? "onclick"
      : type == "checkbox" || type == "radio"
      ? "onchange"
      : "oninput";
    form[verb] = e => {
      e && e.preventDefault();
      const value = getValue ? getValue(form.input) : form.input.value;
      if (form.output) {
        const out = display ? display(value) : format ? format(value) : value;
        if (out instanceof window.Element) {
          while (form.output.hasChildNodes()) {
            form.output.removeChild(form.output.lastChild);
          }
          form.output.append(out);
        } else {
          form.output.value = out;
        }
      }
      form.value = value;
      if (verb !== "oninput")
        form.dispatchEvent(new CustomEvent("input", { bubbles: true }));
    };
    if (verb !== "oninput")
      wrapper.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = e => e && e.preventDefault();
    form[verb]();
  }
  while (form.childNodes.length) {
    wrapper.appendChild(form.childNodes[0]);
  }
  form.append(wrapper);
  return form;
}
```


```js echo
const fileDemo = md`---
## File Upload
*Use the JavaScript [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications) to work with uploaded file contents.*

\`import {file} from "@jashkenas/inputs"\``
```

```js echo
const e = view(file())
```

```js echo
const e1 = view(file({
  title: "Photographs",
  description: "Only .jpg files are allowed in this example. Choose some images, and they’ll appear in the cell below.",
  accept: ".jpg",
  multiple: true,
}))
```



```js echo
async function imageDisplay() {
  const div = html`<div style="display: flex; flex-wrap: wrap; gap: 6px;"></div>`;

  for (const file of e1) {
    const url = await Files.url(file);
    const img = html`<img src="${url}" height="125px" style="margin: 2px;" />`;
    div.appendChild(img);
  }

  return div;
}
```


```js echo
function file(config = {}) {
  const { multiple, accept, title, description, disabled } = config;
  const form = input({
    type: "file",
    title,
    description,
    attributes: { multiple, accept, disabled },
    action: form => {
      form.input.onchange = () => {
        form.value = multiple ? form.input.files : form.input.files[0];
        form.dispatchEvent(new CustomEvent("input"));
      };
    }
  });
  form.output.remove();
  form.input.onchange();
  return form;
}
```