import define1 from "./4ec80ecf24f99183@174.js";

function _1(md){return(
md`# ADB Brand Colors

_Brand attributes are based on ADB Branding Toolkit._`
)}

function _2(md,generateSwatchHTML,mainColors){return(
md`### Main Palette

${generateSwatchHTML(mainColors)}
`
)}

function _mainColors(){return(
{
  "900": "#007DB7", //rgb(0,125,183)
  "800": "#0088C7", //rgb(0,136,199)
  "700": "#0099D8", //rgb(0,153,216)
  "600": "#00A1CB", //rgb(0,161,203)
  "500": "#009FD6", //rgb(0,159,214)
  "400": "#41BEE8", //rgb(65,190,232)
  "300": "#68C5EA", //rgb(104,197,234)
  "200": "#6DBCE3", //rgb(109,188,227)
  "100": "#6DCFF6", //rgb(109,207,246)
}
)}

function _4(md,generateSwatchHTML,accentColors){return(
md`### Accent Palette

${generateSwatchHTML(accentColors)}`
)}

function _accentColors(){return(
{
  "900": "#00A5D2", // rgb(0,165,210)
  "800": "#00B6C9", // rgb(0,182,201)
  "700": "#63CCEC", // rgb(99,204,236)
  "600": "#8DC63F", // rgb(141,198,63)
  "500": "#C8DA2B", // rgb(200,218,43)
  "400": "#F2E600", // rgb(242,230,0)
  "300": "#E9532B", // rgb(233,83,43)
  "200": "#F57F29", // rgb(245,127,41)
  "100": "#FDB515", // rgb(253,181,21)
}
)}

function _generateSwatchHTML(){return(
(palette) => {
  const listStyles = "display: inline-block; width: 4rem; height: 4rem; padding: 0.25rem;color:white";
  const swatches = Object.keys(palette).reduce((acc, key)=> `<li style="background-color: ${palette[key]};${listStyles}">${key}</li>${acc}`,"");
  return `<ul style="list-style: none;padding-left: 0; display: flex;">${swatches}</ul>`
}
)}

function _7(substratum,invalidation){return(
substratum({invalidation})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","generateSwatchHTML","mainColors"], _2);
  main.variable(observer("mainColors")).define("mainColors", _mainColors);
  main.variable(observer()).define(["md","generateSwatchHTML","accentColors"], _4);
  main.variable(observer("accentColors")).define("accentColors", _accentColors);
  main.variable(observer("generateSwatchHTML")).define("generateSwatchHTML", _generateSwatchHTML);
  main.variable(observer()).define(["substratum","invalidation"], _7);
  const child1 = runtime.module(define1);
  main.import("substratum", child1);
  return main;
}
