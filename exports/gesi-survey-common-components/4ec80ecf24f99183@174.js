import define1 from "./08b5f0b01b02fcf6@1097.js";

function _1(md){return(
md`# Substratum

An opinionated set of base styles for exported Observable Notebooks. The styles are only applied when the notebook is run from downloaded (or exported) files. This is built on top of [modern-css-reset](https://github.com/hankchizljaw/modern-css-reset).`
)}

function _2(md){return(
md`## Usage

Import \`substatum\` into your notebook:

\`\`\`js
import { substratum } from "@adb/substratum"
\`\`\`

... in another cell, call the function with option,
[\`invalidation\`](https://github.com/observablehq/stdlib/#invalidation) promise.

\`\`\`js
substratum({ invalidation })
\`\`\`

You should see the base styles applied when the notebook is run using downloaded code.`
)}

function _3(md){return(
md`## Implementation`
)}

function _substratum(md,isRunningStandalone,installStyles){return(
function substratum({
  debug = false,
  invalidation,
  messageWhenInactive = md`⏸️ _Substratum styles are not loaded._`,
  messageWhenActive = md`✅ _Substratum styles are loaded._`
} = {}) {
  if (invalidation == null) {
    throw new Error(
      "invalidation is not provided. See: https://github.com/observablehq/stdlib/#invalidation"
    );
  }

  if (!isRunningStandalone && !debug) return messageWhenInactive;

  installStyles({ invalidation });

  return messageWhenActive;
}
)}

function _installStyles(html,resetStyles,primaryStyles){return(
function installStyles({ invalidation }) {
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

  detach(elements);

  const newStyleElements = new Set(
    [html`<style>${resetStyles}`, html`<style>${primaryStyles}`].reverse()
  );

  attach(newStyleElements);
}
)}

function _isRunningStandalone()
{
  const baseURL = new URL(document.baseURI);
  return !(
    document.location.hostname.endsWith(".observableusercontent.com") ||
    baseURL.hostname.endsWith(".observableusercontent.com")
  );
}


function _resetStyles(){return(
`/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
}

/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role="list"],
ol[role="list"] {
  list-style: none;
}

/* Set core root defaults */
html:focus-within {
  scroll-behavior: smooth;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}

/* Remove all animations and transitions for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
   scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`
)}

function _primaryStyles(accent,main){return(
`:root {
	/* From Observable */
	--max-width-page: 76rem;

	/* Spacing and Colors from Tachyons */
	--spacing-medium: 1rem;
  --spacing-large: 2rem;
  --spacing-extra-large: 4rem;

  --color-accent: ${accent.blue};
  --color-accent-dark: ${main.blue["800"]};
	--color-text: ${main.grey["1000"]};
	--color-border: rgba(0, 0, 0, 0.1);
}

:root {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
		sans-serif, "Apple Color Emoji", "Segoe UI Emoji";

	color: var(--color-text);
}

body {
	max-width: var(--max-width-page);
	padding: 0 var(--spacing-medium);
	margin: var(--spacing-extra-large) auto;
}

p,
table,
figure,
figcaption,
h1,
h2,
h3,
h4,
h5,
h6,
.katex-display {
	max-width: 640px;
}

ul,
ol {
	padding-left: 28px;
}
blockquote,
ol,
ul {
	max-width: 600px;
}

hr {
	border: 0;
	border-top: 1px solid var(--color-border);
}

a {
	color: var(--color-accent);
}

a:hover,
a:focus,
a:active {
	color: var(--color-accent-dark);
}

.observablehq + .observablehq {
	margin-top: var(--spacing-medium);
}

/* .observablehq--inspect {
	display: none;
}
 */
`
)}

function _9(md){return(
md`### Testing`
)}

function _10(substratum,debug,invalidation){return(
substratum({ debug, invalidation })
)}

function _debug(Inputs){return(
Inputs.toggle({ label: "Debug", value: false })
)}

function _12(md){return(
md`## Imports`
)}

function _14(md){return(
md`## Changelog

- **2022-11-13**
  - Use ADB colours.
  - Increases body top and bottom margin.`
)}

function _15(md){return(
md`## Attributions

- The environment detection code is based on [@mootari’s Environment notebook](https://observablehq.com/@mootari/environment).`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("substratum")).define("substratum", ["md","isRunningStandalone","installStyles"], _substratum);
  main.variable(observer("installStyles")).define("installStyles", ["html","resetStyles","primaryStyles"], _installStyles);
  main.variable(observer("isRunningStandalone")).define("isRunningStandalone", _isRunningStandalone);
  main.variable(observer("resetStyles")).define("resetStyles", _resetStyles);
  main.variable(observer("primaryStyles")).define("primaryStyles", ["accent","main"], _primaryStyles);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["substratum","debug","invalidation"], _10);
  main.variable(observer("viewof debug")).define("viewof debug", ["Inputs"], _debug);
  main.variable(observer("debug")).define("debug", ["Generators", "viewof debug"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _12);
  const child1 = runtime.module(define1);
  main.import("main", child1);
  main.import("accent", child1);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["md"], _15);
  return main;
}
