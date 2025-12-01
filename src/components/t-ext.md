# Tachyons CSS and some extras

```js echo
import {html} from "htl";
```

```js
const invalidation = { then: () => {} };
```

```js echo
const tokens = ({
  spaces: {
    '0': '0', // none
    '1': '0.25rem', // extra-small
    '2': '0.5rem', // small
    '3': '1rem', // medium
    '4': '2rem', // large
    '5': '4rem', // extra-large
    '6': '8rem', // extra-extra-large
    '7': '16rem', // extra-extra-extra-large
  }
})
```

```js echo
const colorUtils = ({colors}) => {
  const keys = Object.keys(colors || {})

  if (keys.length === 0) return "";
}
```

```js echo
const fontUtils = ({fonts}) => {
  const keys = Object.keys(fonts || {})

  if (keys.length === 0) return "";

  const cssVariables = `:root {
${keys.reduce((acc,k) => `${acc}--${k}: ${fonts[k]};`, "")}
}`

  const utilClasses = keys.reduce((acc, k) => {
    return `${acc}
.${k} { font-family: ${fonts[k]}; }
`}, "")

  return cssVariables + "\n" +utilClasses;
}
```

```js echo
const spaceBetweenUtils = () => Object.keys(tokens.spaces).reduce((acc, k) => {
  const v = tokens.spaces[k];
  return `${acc}
.space-x-${k} > * + * {
  margin-left: ${v}
}
.space-y-${k} > * + * {
  margin-top: ${v};
}

.space-${k} {
  margin: calc(-0.5 * ${v});
}

.space-${k} > * {
  margin: calc(0.5 * ${v});
}`
}, "")
```

```js echo
const boxShadowUtils = () => `
.solid-shadow-1 {
  box-shadow: 0.125rem 0.125rem rgba(0,0,0,0.08);
}

.solid-shadow-y-1 {
  box-shadow: 0 0.125rem rgba(0,0,0,0.08);
}

.solid-shadow-2 {
  box-shadow: 0.25rem 0.25rem rgba(0,0,0,0.06);
}

.solid-shadow-y-2 {
  box-shadow: 0 0.25rem rgba(0,0,0,0.06);
}

.solid-shadow-3 {
  box-shadow: 0.5rem 0.5rem rgba(0,0,0,0.06);
}

.solid-shadow-y-3 {
  box-shadow: 0 0.5rem rgba(0,0,0,0.06);
}
`
```

```js echo
const trackedUtils = () => `.tracked-light { letter-spacing: .025em; }`
```

```js echo
const positionUtils = () => `.sticky { position: sticky }`
```

```js echo
const scrollUtils = () =>`.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none; // Safari and Chrome
}`;
```

```js echo
const tachyonsVersion = "4.12.0"
```

```js echo
const defaultOptions = ({})
```

```js echo
const cssVariables = `:root {
${keys.reduce((acc,k) => `${acc}--${k}: ${colors[k]};`, "")}
}`
```

```js echo
const utilClasses = keys.reduce((acc, k) => {
    return `${acc}
.${k} { color: var(--${k}); }
.hover-${k}:hover, .hover-${k}:focus { color: var(--${k}); }
.bg-${k} { background-color: var(--${k}); }
.hover-bg-${k}:hover, .hover-bg-${k}:focus { background-color: var(--${k}); }
.b--${k} { border-color: var(--${k}); }
`}, "")

  return cssVariables + "\n" + utilClasses;
}
```

```js echo
const loadStyles = (() => {
  let elements = new Set();

  function detach(elements) {
    for (let n of elements) {
      n.remove();
      elements.delete(n);
    }
  }

  function attach(nodes) {
    for (let n of nodes) {
      document.head.prepend(n);
      elements.add(n);
    }
  }

  invalidation.then(() => detach(elements));
    
  return (userOptions) => {
    const options = Object.assign({}, defaultOptions, userOptions);
    const src = `https://unpkg.com/tachyons@${tachyonsVersion}/css/tachyons.min.css`;

    detach(elements);
  
    const newStyleElements = new Set([
      html`<link rel=stylesheet href="${src}">`,
      html`<style>
  ${cssVariables()}
  ${scrollUtils()}
  ${spaceBetweenUtils()}
  ${trackedUtils()}
  ${positionUtils()}
  ${boxShadowUtils()}
  ${colorUtils(options)}
  ${fontUtils(options)}`,
    ].reverse());
  
    attach(newStyleElements);
  }
})();
```

```js echo
const tachyons = loadStyles // Original name, deprecated
```

```js echo
//export const tachyonsExt = loadStyles
const tachyonsExt = loadStyles
```

```js echo
loadStyles({
  colors: {
    brand: "#007DB7",
    accent: "#FDB515"
  },
  fonts: {
    roboto: `"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`
  },
})
```

```js echo
const addElementsToDOM = (elements) => elements.forEach(n => document.querySelector("head").prepend(n));
```

```js echo
const removeElementsFromDOM = (elements) => elements.forEach(n => n.parentNode && n.parentNode.removeChild(n))
```

```js echo
const demoStyles = html`<style>.box {
  background-color: var(--brand);
  color: white;
  padding: 0.5rem;
  font-family: system-ui, sans-serif;
}

.box--light {
  color: var(--brand);
  background-color: white;
}

.box--expand {
  flex: 1;
}
</style>`
```