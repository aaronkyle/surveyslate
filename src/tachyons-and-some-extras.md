```js
md`# Tachyons CSS and some extras

[Tachyons CSS](http://tachyons.io/) is handy for quickly style some HTML elements. This notebook extends the default Tachyons CSS with additional utility functions

Tachyons version: **${tachyonsVersion}**
`
```

```js
toc({
  headers: "h2,h3,h4,h5",
  hideStartingFrom: "Demo Styles"
})
```

## Usage

### 1. Import
~~~js
     import {loadStyles} from '@categorise/tachyons-and-some-extras'
~~~

### 2. Initialize

~~~js
     loadStyles({ /* options */})
~~~

### 3. 💅 Style some stuff

~~~js
     html`<h1 class="sans-serif f1 f-headline-l fw9 tracked-tight light-purple hover-accent">Hey!</h1>`
~~~

...and, get this

<h1 class="sans-serif f1 f-headline-l fw9 tracked-tight light-purple hover-accent">Hey!</h1>

## Extras

### Tachyon CSS variables

Tachyons currently don't expose values used within its utility classes as CSS variables. Here, we are exposing some common values as CSS variables. These can be used with any custom CSS styles.

```js echo
cssVariables = () => `:root {
  --spacing-none: 0;
  --spacing-extra-small: .25rem;
  --spacing-small: .5rem;
  --spacing-medium: 1rem;
  --spacing-large: 2rem;
  --spacing-extra-large: 4rem;
  --spacing-extra-extra-large: 8rem;
  --spacing-extra-extra-extra-large: 16rem;

  --border-radius-0: 0;
  --border-radius-1: .125rem;
  --border-radius-2: .25rem;
  --border-radius-3: .5rem;
  --border-radius-4: 1rem;
}
`
```

### Colors

Provide extra colors like brand or accent as options to `loadStyles()`. This notebook will generate all color related Tachyon classes like color, background-color, and border-color.

**Example:**
~~~js
loadStyles({
  colors: {
    brand: "#0099D8",
    accent: "#8DC63F"
  }
})
~~~

... will generate classnames like:

~~~css
.brand { /* ... */ } 
.hover-brand:hover { /* ... */ } 
.bg-brand { /* ... */ }
.b--brand { /* ... */ }

.accent { /* ... */ } 
.hover-accent:hover { /* ... */ } 
.bg-accent { /* ... */ }
.b--accent { /* ... */ }
~~~

```js echo
colorUtils = ({colors}) => {
  const keys = Object.keys(colors || {})

  if (keys.length === 0) return "";

  const cssVariables = `:root {
${keys.reduce((acc,k) => `${acc}--${k}: ${colors[k]};`, "")}
}`
    
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

### Font family

**Example:**
~~~js
loadStyles({
  fonts: {
    roboto: `"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`
  }
})
~~~

... will generate classname like:

~~~css
.roboto { font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; } 
~~~

```js echo
fontUtils = ({fonts}) => {
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

### Space between

#### Horizontal spacing

Use `space-x-<num>` to add horizontal space between elements within a `flex` parent.

Example:
~~~html
<div class="flex space-x-3 ...">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
~~~

```js
html`<div class="flex space-x-3 bg-accent">
  ${Array.from({length: 3}).reduce((acc, _, i) => `${acc}<div class="[ box box--expand ][ h4 ]">${i + 1}</div>`, "")}
</div>`
```

#### Vertical spacing

Use `space-y-<num>` to add vertical space between elements.

Example:
~~~html
<div class="space-y-3 ...">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
~~~

```js
html`<div class="space-y-3 bg-accent">
  ${Array.from({length: 3}).reduce((acc, _, i) => `${acc}<div class="box w-100">${i + 1}
</div>`, "")}`
```

#### Horizontal & Vertical Spacing

Use `space-<num>` to add vertical space between elements within a `flex` parent..

Example:
~~~html
<div class="flex flex-wrap space-3 ...">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
</div>
~~~

```js
html`<div class="overflow-hidden bg-accent">
  <div class="flex flex-wrap space-3">
    ${Array.from({length: 8}).reduce((acc, _, i) => `${acc}<div class="[ box box--expand ][ w-25 h4 ]" style="flex-basis: 20%;">${i + 1}</div>`, "")}
  </div>
</div>`
```

```js echo
spaceBetweenUtils = () => Object.keys(tokens.spaces).reduce((acc, k) => {
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

### Box Shadows

```js echo
html`<div class="flex pa2">
  ${Array.from({length: 3}).map((_,i) => {
    const n= i + 1;
    return `<div class="[ box box--light ][ ba b--near-white flex-none ma2 f6 w4 h4 ][ solid-shadow-${n} ]">.solid-shadow-${n}</div>
<div class="[ box box--light ][ ba b--near-white flex-none ma2 f6 w4 h4 ][ solid-shadow-y-${n} ]">.solid-shadow-y-${n}</div>`
  })}
</div>`
```

```js echo
boxShadowUtils = () => `
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

### Tracking

```js echo
trackedUtils = () => `.tracked-light { letter-spacing: .025em; }`
```

### Sticky

```js echo
positionUtils = () => `.sticky { position: sticky }`
```

### No scrollbars

```js echo
scrollUtils = () =>`.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none; // Safari and Chrome
}`;
```

## Code

```js echo
tachyonsVersion = "4.12.0"
```

```js echo
defaultOptions = ({})
```

```js echo
addElementsToDOM = (elements) => elements.forEach(n => document.querySelector("head").prepend(n));
```

```js echo
removeElementsFromDOM = (elements) => elements.forEach(n => n.parentNode && n.parentNode.removeChild(n))
```

```js echo
tachyons = loadStyles // Original name, deprecated
```

```js echo
loadStyles = {
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
}
```

```js echo
tokens = ({
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

## Deprecations

`tachyonsExt` is deprecated. Use `loadStyles`

```js
tachyonsExt = loadStyles
```

## Demo Styles

These styles are only to render the examples in this notebook.

```js echo
demoStyles = html`<style>.box {
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

## Imports

```js
import {toc} from "@nebrius/indented-toc"
```

---

```js
import { substratum } from "@categorise/substratum"
```

```js
substratum({ invalidation })
```
