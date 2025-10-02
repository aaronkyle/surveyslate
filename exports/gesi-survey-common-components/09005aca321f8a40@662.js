import define1 from "./4ec80ecf24f99183@174.js";
import define2 from "./a1d9854aaa40098c@407.js";

function _1(md,tachyonsVersion){return(
md`# Tachyons CSS and some extras

[Tachyons CSS](http://tachyons.io/) is handy for quickly style some HTML elements. This notebook extends the default Tachyons CSS with additional utility functions

Tachyons version: **${tachyonsVersion}**
`
)}

function _2(toc){return(
toc({
  headers: "h2,h3,h4,h5",
  hideStartingFrom: "Demo Styles"
})
)}

function _3(md){return(
md`## Usage

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
     html\`<h1 class="sans-serif f1 f-headline-l fw9 tracked-tight light-purple hover-accent">Hey!</h1>\`
~~~

...and, get this

<h1 class="sans-serif f1 f-headline-l fw9 tracked-tight light-purple hover-accent">Hey!</h1>`
)}

function _4(md){return(
md`## Extras`
)}

function _5(md){return(
md`### Tachyon CSS variables

Tachyons currently don't expose values used within its utility classes as CSS variables. Here, we are exposing some common values as CSS variables. These can be used with any custom CSS styles.`
)}

function _cssVariables(){return(
() => `:root {
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
)}

function _7(md){return(
md`### Colors

Provide extra colors like brand or accent as options to \`loadStyles()\`. This notebook will generate all color related Tachyon classes like color, background-color, and border-color.

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
~~~`
)}

function _colorUtils(){return(
({colors}) => {
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
)}

function _9(md){return(
md`### Font family

**Example:**
~~~js
loadStyles({
  fonts: {
    roboto: \`"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"\`
  }
})
~~~

... will generate classname like:

~~~css
.roboto { font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; } 
~~~`
)}

function _fontUtils(){return(
({fonts}) => {
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
)}

function _11(md){return(
md`### Space between`
)}

function _12(md){return(
md`#### Horizontal spacing

Use \`space-x-<num>\` to add horizontal space between elements within a \`flex\` parent.

Example:
~~~html
<div class="flex space-x-3 ...">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
~~~`
)}

function _13(html){return(
html`<div class="flex space-x-3 bg-accent">
  ${Array.from({length: 3}).reduce((acc, _, i) => `${acc}<div class="[ box box--expand ][ h4 ]">${i + 1}</div>`, "")}
</div>`
)}

function _14(md){return(
md`#### Vertical spacing

Use \`space-y-<num>\` to add vertical space between elements.

Example:
~~~html
<div class="space-y-3 ...">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
~~~`
)}

function _15(html){return(
html`<div class="space-y-3 bg-accent">
  ${Array.from({length: 3}).reduce((acc, _, i) => `${acc}<div class="box w-100">${i + 1}
</div>`, "")}`
)}

function _16(md){return(
md`#### Horizontal & Vertical Spacing

Use \`space-<num>\` to add vertical space between elements within a \`flex\` parent..

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
~~~`
)}

function _17(html){return(
html`<div class="overflow-hidden bg-accent">
  <div class="flex flex-wrap space-3">
    ${Array.from({length: 8}).reduce((acc, _, i) => `${acc}<div class="[ box box--expand ][ w-25 h4 ]" style="flex-basis: 20%;">${i + 1}</div>`, "")}
  </div>
</div>`
)}

function _spaceBetweenUtils(tokens){return(
() => Object.keys(tokens.spaces).reduce((acc, k) => {
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
)}

function _19(md){return(
md`### Box Shadows`
)}

function _20(html){return(
html`<div class="flex pa2">
  ${Array.from({length: 3}).map((_,i) => {
    const n= i + 1;
    return `<div class="[ box box--light ][ ba b--near-white flex-none ma2 f6 w4 h4 ][ solid-shadow-${n} ]">.solid-shadow-${n}</div>
<div class="[ box box--light ][ ba b--near-white flex-none ma2 f6 w4 h4 ][ solid-shadow-y-${n} ]">.solid-shadow-y-${n}</div>`
  })}
</div>`
)}

function _boxShadowUtils(){return(
() => `
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
)}

function _22(md){return(
md`### Tracking`
)}

function _trackedUtils(){return(
() => `.tracked-light { letter-spacing: .025em; }`
)}

function _24(md){return(
md`### Sticky`
)}

function _positionUtils(){return(
() => `.sticky { position: sticky }`
)}

function _26(md){return(
md`### No scrollbars`
)}

function _scrollUtils(){return(
() =>`.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none; // Safari and Chrome
}`
)}

function _28(md){return(
md`## Code`
)}

function _tachyonsVersion(){return(
"4.12.0"
)}

function _defaultOptions(){return(
{}
)}

function _addElementsToDOM(){return(
(elements) => elements.forEach(n => document.querySelector("head").prepend(n))
)}

function _removeElementsFromDOM(){return(
(elements) => elements.forEach(n => n.parentNode && n.parentNode.removeChild(n))
)}

function _loadStyles(installStyles){return(
installStyles
)}

function _installStyles(invalidation,defaultOptions,tachyonsVersion,html,cssVariables,scrollUtils,spaceBetweenUtils,trackedUtils,positionUtils,boxShadowUtils,colorUtils,fontUtils)
{
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


function _tokens(){return(
{
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
}
)}

function _36(loadStyles){return(
loadStyles({
  colors: {
    brand: "#007DB7",
    accent: "#FDB515"
  },
  fonts: {
    roboto: `"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`
  },
})
)}

function _37(md){return(
md`## Deprecations

\`tachyonsExt\` is deprecated. Use \`loadStyles\``
)}

function _tachyonsExt(loadStyles){return(
loadStyles
)}

function _39(md){return(
md`## Demo Styles

These styles are only to render the examples in this notebook.`
)}

function _demoStyles(html){return(
html`<style>.box {
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
)}

function _41(md){return(
md`## Imports`
)}

function _42(substratum,invalidation){return(
substratum({invalidation})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md","tachyonsVersion"], _1);
  main.variable(observer()).define(["toc"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("cssVariables")).define("cssVariables", _cssVariables);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("colorUtils")).define("colorUtils", _colorUtils);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("fontUtils")).define("fontUtils", _fontUtils);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["html"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["html"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["html"], _17);
  main.variable(observer("spaceBetweenUtils")).define("spaceBetweenUtils", ["tokens"], _spaceBetweenUtils);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["html"], _20);
  main.variable(observer("boxShadowUtils")).define("boxShadowUtils", _boxShadowUtils);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("trackedUtils")).define("trackedUtils", _trackedUtils);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("positionUtils")).define("positionUtils", _positionUtils);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("scrollUtils")).define("scrollUtils", _scrollUtils);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("tachyonsVersion")).define("tachyonsVersion", _tachyonsVersion);
  main.variable(observer("defaultOptions")).define("defaultOptions", _defaultOptions);
  main.variable(observer("addElementsToDOM")).define("addElementsToDOM", _addElementsToDOM);
  main.variable(observer("removeElementsFromDOM")).define("removeElementsFromDOM", _removeElementsFromDOM);
  main.variable(observer("loadStyles")).define("loadStyles", ["installStyles"], _loadStyles);
  main.variable(observer("installStyles")).define("installStyles", ["invalidation","defaultOptions","tachyonsVersion","html","cssVariables","scrollUtils","spaceBetweenUtils","trackedUtils","positionUtils","boxShadowUtils","colorUtils","fontUtils"], _installStyles);
  main.variable(observer("tokens")).define("tokens", _tokens);
  main.variable(observer()).define(["loadStyles"], _36);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("tachyonsExt")).define("tachyonsExt", ["loadStyles"], _tachyonsExt);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer("demoStyles")).define("demoStyles", ["html"], _demoStyles);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer()).define(["substratum","invalidation"], _42);
  const child1 = runtime.module(define1);
  main.import("substratum", child1);
  const child2 = runtime.module(define2);
  main.import("toc", child2);
  return main;
}
