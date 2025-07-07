```js
md`# Indented ToC

This notebook can generate a Table of Contents (ToC), with indentations, automatically for your notebook.

Thanks to @mbostock for creating the original version of the library!

_Note:_ Clicking on links in Safari doesn't work because [scrollIntoView in an iFrame doesn't really work correctly](https://www.javaer101.com/en/article/11885549.html)`
```

```js
toc({
  headers: "h2,h3,h4",
  skip: ["Implementation"]
})
```

```js
md`## Usage`
```

```js
md`Import this notebook with:
\`\`\`js
import {toc} from "@nebrius/indented-toc"
\`\`\`
`
```

```js
md`### Basic Example

You can create the table of contents for a notebook with the following call:

\`\`\`JavaScript
toc()
\`\`\`

This call produces the following ToC for this notebook:
`
```

```js
toc()
```

```js
md`### Customizing Included Header Levels
If you don't like which header levels are included in the ToC by default, you can customize which header levels to include:

\`\`\`JavaScript
toc("h2,h3,h4")
\`\`\`

or:

\`\`\`JavaScript
toc({
  headers: "h2,h3,h4"
})
\`\`\`

This call produces the following ToC for this notebook:
`
```

```js
toc({
  headers: "h2,h3,h4"
})
```

```js
toc({
  hideStartingFrom: "Implementation"
})
```

```js
md`### Customizing or Hiding the Title
If you would like to change the title, you can change it with:

\`\`\`JavaScript
toc({
  title: "My Table of Contents"
})
\`\`\`

This call produces the following ToC for this notebook:
`
```

```js
toc({
  title: "My Table of Contents"
})
```

```js
md`
You can also hide the title by passing in \`null\` for the title value:

\`\`\`JavaScript
toc({
  title: null
})
\`\`\`

This call produces the following ToC for this notebook:
`
```

```js
toc({
  title: null
})
```

### Skipping a section
In some cases, you may want to omit a section (for example, if you use `##` to create a subtitle for your notebook). To skip a section, pass a string or array of strings to be omitted:

```js echo
toc({ skip: "API" })
```

```js echo
toc({ skip: ["API", "Usage"] })
```

```js
md`### Bringing it All Together
All of the options can be combined together to create a more highly customized ToC

\`\`\`JavaScript
toc({
  headers: "h2,h3,h4",
  title: "My ToC",
  hideStartingFrom: "Implementation"
})
\`\`\`

This call produces the following ToC for this notebook:
`
```

```js
toc({
  headers: "h2,h3,h4",
  title: "My ToC",
  hideStartingFrom: "Implementation"
})
```

```js
md`## API

The \`toc\` method has the following signature:

\`\`\`TypeScript
function toc(
  options?: string | { headers?: string, title?: string | null, hideStartingFrom?: string }
): MutationObserver
\`\`\`

Note: This signature is written using TypeScript syntax.

Options has the following defaults:
- headers = "h1,h2,h3",
- hideStartingFrom = null,
- title = "Table of Contents"
`
```

```js
md`## Hiding an Appendix (deprecated)
_Suggestion:_ use the \`skip\` option above.

If your notebooks are like mine, you might have a section titled "appendix," "implementation," or similar section to house implementation details. You can hide this section with the following call:

\`\`\`JavaScript
toc({
  hideStartingFrom: "Implementation"
})
\`\`\`

This call produces the following ToC for this notebook:
`
```

```js
md`## Implementation`
```

```js
function toc(options = {}) {
  if (typeof options === "string") {
    options = {
      headers: options
    };
  }
  const {
    headers = "h1,h2,h3",
    hideStartingFrom = null,
    title = "Table of Contents",
    skip = []
  } = options;
  // Allow skip to be specified as a string or an array
  const skipArr = typeof skip === "string" ? [skip] : skip;
  return Generators.observe((notify) => {
    let previousHeadings = [];
    let renderedEmptyToC = false;

    function observed() {
      const currentHeadings = Array.from(
        document.querySelectorAll(headers)
      ).filter((d) => skipArr.indexOf(String(d.textContent)) === -1);

      // CHeck if there's anything to render
      if (!currentHeadings.length) {
        if (!renderedEmptyToC) {
          notify(html`Unable to generate ToC: no headings found`);
          renderedEmptyToC = true;
        }
        return;
      }

      // Check if anything changed from the previous render, and if not, bail
      if (
        currentHeadings.length === previousHeadings.length &&
        !currentHeadings.some((h, i) => previousHeadings[i] !== h)
      ) {
        return;
      }
      renderedEmptyToC = false;

      // The start indentation specifies the top-most header tag that will
      // be "unindented" in the ToC, and is effective the "2" in "h2"
      let startIndentation = headers
        .split(",")
        .map((h) => parseInt(h.replace(/h/g, "")))
        .sort()[0];

      // The current indentation tracks what level of indentation we're at,
      // so we can add <ul> and </ul> tags as needed to get the ToC to
      // indend/unindent properly
      let currentIndentation;
      previousHeadings = currentHeadings;
      const entries = [];
      for (const h of Array.from(previousHeadings)) {
        if (hideStartingFrom && h.textContent === hideStartingFrom) {
          break;
        }
        let nodeIndentiation = parseInt(h.tagName[1], 10);
        if (typeof currentIndentation === "undefined") {
          // Add indentations as needed in case the initial header tag
          // isn't the top-level specified for this ToC
          currentIndentation = startIndentation;
          while (nodeIndentiation > currentIndentation) {
            currentIndentation++;
            entries.push("<ul>");
          }
        } else {
          while (currentIndentation < nodeIndentiation) {
            entries.push("<ul>");
            currentIndentation++;
          }
          while (currentIndentation > nodeIndentiation) {
            entries.push("</ul>");
            currentIndentation--;
          }
        }
        entries.push(
          Object.assign(
            html`<li><a href="#">${DOM.text(h.textContent)}</a></li>`,
            {
              onclick: (e) => {
                e.preventDefault();
                h.scrollIntoView();
              }
            }
          )
        );
      }
      while (currentIndentation > startIndentation) {
        entries.push("</ul>");
        currentIndentation--;
      }
      let content;
      if (title) {
        content = html`<b>${DOM.text(title)}</b><ul>${entries}`;
      } else {
        content = html`<ul>${entries}`;
      }
      notify(content);
    }

    const observer = new MutationObserver(observed);
    observer.observe(document.body, { childList: true, subtree: true });
    observed();
    return () => observer.disconnect();
  });
}
```
