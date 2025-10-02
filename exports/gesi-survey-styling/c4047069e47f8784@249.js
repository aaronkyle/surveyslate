import define1 from "./09005aca321f8a40@662.js";
import define2 from "./9bed702f80a3797e@402.js";
import define3 from "./3b76f3b1d596b5d5@99.js";
import define4 from "./87e0f7ecc7277316@97.js";
import define5 from "./bad810ff1e80611b@137.js";

function _1(md){return(
md`# GESI Survey | Common Components

Reusable UI components for Survey Slate projects.`
)}

function _2(md,width){return(
md`
<div style="max-width: ${width/1.75}px; margin: 30px 0; padding: 15px 30px; background-color: #e0ffff; font: 700 18px/24px sans-serif;">👋 Welcome!  This notebook has different font definitions than others in the series.  The reason is because these components are styled for a specific survey instance. ✨</div>

<!-- Notification design borrowed from https://observablehq.com/@jashkenas/inputs -->
`
)}

function _3(toc){return(
toc({
  headers: "h2,h3,h4,h5",
  hideStartingFrom: "Imports"
})
)}

function _4(md){return(
md`## TextNodeView

A textNodeView syncs its value to a simple textNode DOM element. Because its a view, it can be added to a view-literal expression in quite a simple way.`
)}

function _textNodeViewExample(textNodeView){return(
textNodeView("hi")
)}

function _6(textNodeViewExample){return(
textNodeViewExample
)}

function _7(Inputs,$0,Event){return(
Inputs.button("Randomize textNodeViewExample", {
  reduce: () => {
    $0.value = Math.random();
    $0.dispatchEvent(new Event('input', {bubbles: true}))
  }
})
)}

function _textNodeView(){return(
(value = '') => {
  const node = document.createTextNode(value)
  return Object.defineProperty(node, 'value', {
    get: () => node.textContent,
    set: (val) => node.textContent = val,
    enumerable: true
  });
}
)}

function _9(md){return(
md`## Logo`
)}

function _10(html,logoSvg){return(
html`${logoSvg()}`
)}

function _logoSvg(){return(
(klasses = "", size = 32) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" role="img" aria-label="Asian Development Bank" class="${klasses}"><g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><g><path fill="#002569" d="M0 0h80v80H0z"/><g fill="#FFF" fill-rule="nonzero" transform="translate(2 33)"><path d="M50.9 6.5c-1.5-2.2-3.6-3.9-6.4-4.8-.7-.2-1.5-.4-2.2-.5-.7-.1-1.5-.2-2.3-.2H26.8v1.2h.2c1.2.1 2.2.2 2.8.5.7.3 1 1.2 1 2.6v17.4c0 1.4-.3 2.3-1 2.6-.5.2-1.2.4-2 .5-.6-.1-1.2-.3-1.6-.6-.5-.4-1-1.1-1.4-1.9L15 .5h-1.4L4.2 23.2c-.4 1-.9 1.7-1.6 2.1-.6.3-1.5.5-2.6.5V27h9v-1.2H7.6c-.4 0-.9-.1-1.2-.4-.4-.2-.6-.6-.6-1.1 0-.2 0-.4.1-.5.1-.2.1-.3.2-.5l2-5.1h10.4l2.1 5.1c.1.2.2.4.3.7.1.2.1.5.1.7 0 .4-.2.7-.4.8-.3.2-.6.3-1 .3h-1.8V27h22.5c3.9 0 7-1.2 9.4-3.5 2.4-2.4 3.6-5.5 3.6-9.3-.1-2.9-.9-5.4-2.4-7.7Zm-42.3 10L12.8 6c0-.1.1-.2.1-.2 0-.1.1-.2.1-.2 0-.1.1-.2.1-.3 0-.1.1-.2.1-.3.1.4.2.8.4 1.3.2.4.3.8.5 1.3 0 .1.1.2.1.3.1.1.1.2.1.3l3.4 8.3H8.6Zm37.9 5.7c-1.3 2.3-3.7 3.5-7.2 3.5-1.8 0-3.1-.2-3.7-.7-.6-.5-.9-1.7-.9-3.6V2.3c.2 0 .5 0 .7-.1H37.5c3.8 0 6.6 1.1 8.4 3.2 1.8 2.1 2.6 5 2.6 8.8.1 2.9-.6 5.6-2 8Z"/><path d="M65.9 12.9c2.1.1 4 .7 5.8 1.8 1.7 1.1 2.6 2.9 2.6 5.2 0 2.2-.8 4-2.3 5.2-1.5 1.3-3.3 1.9-5.4 1.9H53.2v-1.2h.2c1.3-.1 2.2-.2 2.8-.5.6-.3 1-1.2 1-2.6V5.3c0-1.4-.3-2.3-1-2.6-.7-.3-1.6-.5-2.8-.5h-.2V1h12.6c1.8 0 3.4.5 4.8 1.4 1.4.9 2.2 2.4 2.2 4.3 0 2.1-.7 3.6-2.1 4.5-1.4.8-3 1.4-4.8 1.7Zm-4.8.8v9c0 1.3.4 2.1 1.1 2.4.7.4 1.6.5 2.7.5 1.9 0 3.2-.6 3.9-1.9.7-1.2 1.1-2.7 1.1-4.4 0-2.9-.9-4.5-2.7-5-1.9-.4-3.9-.6-6.1-.6Zm0-1.3c2 0 3.8-.2 5.3-.7 1.5-.5 2.2-1.9 2.2-4.4 0-1.6-.3-2.8-.9-3.7-.6-.9-1.8-1.4-3.5-1.4h-3.1v10.2Z"/></g></g></g></svg>`
)}

function _12(md){return(
md`## Page Header`
)}

function _13(pageHeader,md){return(
md`### One title

${pageHeader(['One title'])}

<br>

### Multiple titles

${pageHeader(['Level One', 'Level Two', 'Level Three'])}`
)}

function _pageHeader(html,logoSvg){return(
(titles) => {
  const header = html`<div class="flex bg-text-on-brand">
  <div class="flex-none">${logoSvg("db w3 h3")}</div>
  <div class="[ flex items-end ph3 w-100 ][ f6 f5-ns ]">
    ${titles.reduce((acc,t, i, arr) => {
      const isLast = i === arr.length - 1;
      const commonClasses = "lh-solid ma0 pb3";
      const specialClasses = isLast ? "b" : "dn db-ns mid-gray";
      const seperator = isLast ? "" : `<span aria-hidden="true" class="mv0 mh2 black-20">/<span>`;

      return `${acc}<p class="${commonClasses} ${specialClasses}">${t}${seperator}</p>`;
    }, "")}
  </div>
</div>`

  return header;
}
)}

function _15(pageFooter,md){return(
md`## Page Footer

${pageFooter()}`
)}

function _pageFooter(html){return(
() => {
  const linkClasses = "link brand underline-hover";
  const year = new Date().getFullYear();

  return html`<footer class="[ flex flex-wrap justify-center justify-between-l pa3 pt0 ph2 ph5-ns ][ f6 brand bg-text-on-brand ]">
  <div class="[ mh1 mt3 flex flex-wrap justify-center ][ space-x-2 ]">
    <a class="${linkClasses}" href="https://www.adb.org/terms-use#copyright">© ${year}</a>
    <a class="${linkClasses}" href="https://www.adb.org/"><span class="b ttu tracked-light">Asian Development Bank</span></a>.
    <a class="${linkClasses} tracked-light" href="https://creativecommons.org/licenses/by/3.0/igo/">CC BY 3.0 IGO.</a>
  </div>
  <div class="[ mh1 mt3 flex flex-wrap justify-center ][ space-x-3 ]">
    <a class="${linkClasses}" href="https://www.adb.org/contacts">ADB Contacts</a>
    <a class="${linkClasses}" href="https://www.adb.org/site/disclosure/main">Access to Information</a>
    <a class="${linkClasses}" href="https://www.adb.org/terms-use">Terms of Use</a>
  </div>
</footer>
`
}
)}

function _17(md){return(
md`## Spinner (Loader)`
)}

function _18(spinner){return(
spinner()
)}

function _spinner(html,getIconHtml){return(
() => { 
  return html`<span class="spinner">${getIconHtml("loader")}</span>`
}
)}

function _20(md){return(
md`## Button Label

Use \`buttonLabel()\` to generate HTML to populate label element in \`Inputs.button\`. This label generator supports icons. `
)}

function _21(html,Inputs,buttonLabel){return(
html`<div class="space-y-2">
${Inputs.button(buttonLabel({label: 'Text only label'}))}
${Inputs.button(buttonLabel({ariaLabel: 'Button with only Icon', iconLeft: 'circle'}))}
${Inputs.button(buttonLabel({label: 'Left label', iconLeft: 'circle'}))}
${Inputs.button(buttonLabel({label: 'Right label', iconLeft: 'circle'}))}
</div>`
)}

function _buttonLabel(getIconHtml,html){return(
({label, iconLeft, iconRight, iconRightClass, iconLeftClass, ariaLabel}) => {
  let labelHtml = "";
  if (iconLeft) {
    labelHtml += `${getIconHtml(iconLeft, `icon--sm ${iconLeftClass || ""}`)} `;
  }

  if(label) {
    labelHtml += `<span class="button-label__text">${label}</span>`;
  }

  if (iconRight) {
    labelHtml += `${getIconHtml(iconRight, `icon--sm ${iconRightClass || ""}`)} `;
  }

  if (ariaLabel) {
    labelHtml += `<span class="clip">${ariaLabel}</span>`;
  }
  
  return html`<span class="button-label">${labelHtml}</span>`
}
)}

function _getIconHtml(getIconSvg){return(
(name, klasses = "") => `<span class="icon ${klasses}">${getIconSvg(name, 24, {role: 'img'})}</span>`
)}

function _24(md){return(
md`## Styles`
)}

function _ns(Inputs){return(
Inputs.text().classList[0]
)}

function _styles(html,ns){return(
html`<style>
  :root {
    --button-border-radius: var(--border-radius-2, 0.25rem);
    --border-color: #aaa; /* tachyons's light-silver */
    --border-color-light: #eee; /* tachyons's light-gray */
  }

  /* https://observablehq.com/@saneef/is-observable-inputs-style-able */
  form.${ns} {
    width: auto;
  }

  .${ns} input,
  .${ns} textarea,
  .${ns} select,
  .${ns} button {
    font-family: var(--brand-font);
  }

  .${ns} input[type="text"],
  .${ns} textarea,
  .${ns} select,
  .${ns} button {
    background-color: white;
    border: 1px solid var(--border-color);
    border-radius: var(--button-border-radius);
  }

  .${ns} input[type="text"],
  .${ns} textarea,
  .${ns} button {
    padding: var(--spacing-extra-small) var(--spacing-small);
  }

  .${ns} select {
    padding-top: var(--spacing-extra-small);
    padding-bottom: var(--spacing-extra-small);
  }

  .${ns} button:hover,
  .${ns} button:focus,
  .${ns} button:active {
    background-color: var(--light-gray, #eee);
  }

  /* Icon */

  .icon {
    display: inline-block;
    position: relative;
    vertical-align: middle;
    width: 1.5rem;
    height: 1.5rem;
    color: var(--gray, #777)
  }

  .icon svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .icon--sm {
    width: 1rem;
    height: 1rem;
  }
  
  .icon--danger {
    color: var(--red, #ff4136)
  }

  .icon--success {
    color: var(--green, #19a974)
  }

  /* Button Group*/

  .button-group {
    display: flex;
  }

  .button-group form.${ns} + form.${ns} {
    margin-left: -1px;
  }

  .button-group form.${ns} button {
      border-radius: 0;
    }

  .button-group form.${ns}:first-child button {
    border-top-left-radius: var(--button-border-radius);
    border-bottom-left-radius: var(--button-border-radius);
  }

  .button-group form.${ns}:last-child button {
    border-top-right-radius: var(--button-border-radius);
    border-bottom-right-radius: var(--button-border-radius);
  }

  /* Button Label */
  .button-label {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
  }

  .button-label > * + * {
    margin-left: var(--spacing-extra-small, 0.25rem);
  }
  .button-label__text {}

  /* Card */

  .card {
    display: block;
    background: white;
    padding: 1rem; /* pa3 or --spacing-medium */
    border: 1px solid var(--border-color-light);
    border-radius: var(--border-radius-3);
  }

  .card--compact {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  /* Loader */
  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
  .spinner .icon {
    color: var(--brand);
  }
  .spinner svg {
    animation: rotate ease-out 1.2s infinite;
  }
</style>`
)}

function _27(md){return(
md`### Styles for the demo`
)}

function _28(html){return(
html`
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style type="text/css" media="screen, print">
  body {
    font-family: var(--brand-font);
  }
</style>
`
)}

function _29(tachyonsExt,mainColors,accentColors){return(
tachyonsExt({
  colors: {
    brand: mainColors[900], // or, provide and color hex code
    accent: accentColors[900], // or, provide and color hex code
    // The color of text which are usually displayed on top of the brand or accent colors.
    "text-on-brand": "#ffffff",
  },
  fonts: {
    "brand-font": `"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`
  }
})
)}

function _30(md){return(
md`## Imports`
)}

function _35(md){return(
md`---`
)}

function _37(substratum,invalidation){return(
substratum({ invalidation })
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","width"], _2);
  main.variable(observer()).define(["toc"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("viewof textNodeViewExample")).define("viewof textNodeViewExample", ["textNodeView"], _textNodeViewExample);
  main.variable(observer("textNodeViewExample")).define("textNodeViewExample", ["Generators", "viewof textNodeViewExample"], (G, _) => G.input(_));
  main.variable(observer()).define(["textNodeViewExample"], _6);
  main.variable(observer()).define(["Inputs","viewof textNodeViewExample","Event"], _7);
  main.variable(observer("textNodeView")).define("textNodeView", _textNodeView);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["html","logoSvg"], _10);
  main.variable(observer("logoSvg")).define("logoSvg", _logoSvg);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["pageHeader","md"], _13);
  main.variable(observer("pageHeader")).define("pageHeader", ["html","logoSvg"], _pageHeader);
  main.variable(observer()).define(["pageFooter","md"], _15);
  main.variable(observer("pageFooter")).define("pageFooter", ["html"], _pageFooter);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["spinner"], _18);
  main.variable(observer("spinner")).define("spinner", ["html","getIconHtml"], _spinner);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["html","Inputs","buttonLabel"], _21);
  main.variable(observer("buttonLabel")).define("buttonLabel", ["getIconHtml","html"], _buttonLabel);
  main.variable(observer("getIconHtml")).define("getIconHtml", ["getIconSvg"], _getIconHtml);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("ns")).define("ns", ["Inputs"], _ns);
  main.variable(observer("styles")).define("styles", ["html","ns"], _styles);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer()).define(["html"], _28);
  main.variable(observer()).define(["tachyonsExt","mainColors","accentColors"], _29);
  main.variable(observer()).define(["md"], _30);
  const child1 = runtime.module(define1);
  main.import("tachyonsExt", child1);
  const child2 = runtime.module(define2);
  main.import("toc", child2);
  const child3 = runtime.module(define3);
  main.import("mainColors", child3);
  main.import("accentColors", child3);
  const child4 = runtime.module(define4);
  main.import("getIconSvg", child4);
  main.variable(observer()).define(["md"], _35);
  const child5 = runtime.module(define5);
  main.import("substratum", child5);
  main.variable(observer()).define(["substratum","invalidation"], _37);
  return main;
}
