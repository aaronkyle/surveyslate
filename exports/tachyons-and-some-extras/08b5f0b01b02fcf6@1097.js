import define1 from "./3b76f3b1d596b5d5@99.js";
import define2 from "./2f1945146131922e@438.js";
import define3 from "./4ec80ecf24f99183@174.js";

function _1(md){return(
md`# Style Guide for Data Visualizations

- [Why did we create a new colour palette for ADB data visualizations](https://observablehq.com/@adb/why-did-we-need-a-new-colour-palette-for-adb-data-visualizations)`
)}

function _2(toc){return(
toc("h2,h3,h4")
)}

function _3(md){return(
md`---`
)}

function _4(md){return(
md`## Colors`
)}

function _5(md){return(
md`### Main colors`
)}

function _main(){return(
{
  blue: {
    "400": "#a1d3f2",
    "500": "#73beeb",
    "600": "#47a5da",
    "700": "#298abd",
    "800": "#156e9a",
    "900": "#075376"
  },
  green: {
    "400": "#b0da83",
    "500": "#96c45f",
    "600": "#7daa42",
    "700": "#648e2c",
    "800": "#4d7117",
    "900": "#375601"
  },
  red: {
    "400": "#f1c2b5",
    "500": "#eda28e",
    "600": "#e67d62",
    "700": "#d25a3b",
    "800": "#b23f20",
    "900": "#8d290c"
  },
  grey: {
    "100": "#fbfbfc",
    "200": "#eff1f4",
    "300": "#dde1e7",
    "400": "#c5cdd7",
    "500": "#aab5c4",
    "600": "#8e9bad",
    "700": "#728093",
    "800": "#576476",
    "900": "#3e4959",
    "1000": "#28303c",
    // "1100": "#131921",
    // "1200": "#010203"
  }
}
)}

function _7(d3,htl,main,swatch)
{
  const start = 1; // "100"
  const end = 10; // "1000"
  const keys = d3.range(start, end + 1).map((i) => `${i}00`);
  return htl.html`
<div style=${{
    display: "grid",
    gridTemplateColumns: "repeat(4, max-content)",
    gridAutoFlow: "dense",
    gridGap: "0.25rem 0.5rem"
  }}>
  
  ${Object.entries(main).flatMap(([hue, colors], i) => {
    return keys
      .slice()
      .reverse()
      .map((k) => {
        const code = colors[k];
        return htl.html`<div style=${{ gridColumn: i + 1 }}>${
          code
            ? swatch(code, {
                label: `${hue}.${k}`
              })
            : ""
        }`;
      });
  })}
</div>
`;
}


function _8(md){return(
md`### Accent colors

Only reach for accent colors to highlight a data point over main colors.`
)}

function _accent(adbBrandMainColors,adbBrandAccentColors){return(
{
  blue: adbBrandMainColors["700"],
  red: adbBrandAccentColors["300"],
  green: adbBrandAccentColors["600"],
  grey: "#64748b" // TW Slate 500
}
)}

function _10(htl,accent,swatch){return(
htl.html`
<div style=${{
  display: "grid",
  gridTemplateColumns: "repeat(4, max-content)",
  gridAutoFlow: "dense",
  gridGap: "0.25rem 0.5rem"
}}>  
  ${Object.entries(accent).map(
    ([name, code], i) =>
      htl.html`<div style=${{ gridColumn: i + 1}}>
${swatch(code, {
  label: name
})}`
  )}
</div>`
)}

function _11(md){return(
md`### Schemes
#### Categorical
##### \`schemeBuGnReGr\``
)}

function _schemeBuGnReGr(main){return(
[
  main.blue["600"],
  main.green["600"],
  main.red["600"],
  main.grey["600"],
  
  main.blue["800"],
  main.green["800"],
  main.red["800"],
  main.grey["800"],
  
  main.blue["400"],
  main.green["400"], 
  // main.red["400"],
]
)}

function _13(schemeHtml,schemeBuGnReGr){return(
schemeHtml(schemeBuGnReGr)
)}

function _14(md){return(
md`##### \`schemeBuReGnGr\``
)}

function _schemeBuReGnGr(main){return(
[
  main.blue["600"],
  main.red["600"],
  main.green["600"],
  main.grey["600"],
  
  main.blue["800"],
  main.red["800"],
  main.green["800"],
  main.grey["800"],
  
  main.blue["400"],
  // main.green["400"], 
  main.red["400"],
]
)}

function _16(schemeHtml,schemeBuReGnGr){return(
schemeHtml(schemeBuReGnGr)
)}

function _17(md){return(
md`##### \`schemeBuGnReGrPaired\` `
)}

function _schemeBuGnReGrPaired(main){return(
[
  main.blue["600"],
  main.blue["400"],
  main.green["600"],
  main.green["400"],
  main.red["600"],
  main.red["400"],
  main.grey["600"],
  main.grey["400"],
  main.blue["800"],
  main.green["800"],
]
)}

function _19(schemeHtml,schemeBuGnReGrPaired){return(
schemeHtml(schemeBuGnReGrPaired)
)}

function _20(md){return(
md`##### \`schemeContrasting\``
)}

function _schemeContrasting(main){return(
[
  main.blue["600"],
  main.blue["900"],
]
)}

function _22(schemeHtml,schemeContrasting){return(
schemeHtml(schemeContrasting)
)}

function _23(md){return(
md`##### \`schemeContrastingAlt\`

⚠️ Accessibility warning: not enough contrast between colors. Use sparingly in cases where you need to use mix-blend-modes.`
)}

function _schemeContrastingAlt(main){return(
[main.blue["600"], main.red["600"]]
)}

function _25(schemeHtml,schemeContrastingAlt){return(
schemeHtml(schemeContrastingAlt)
)}

function _26(md){return(
md`##### \`schemeCategory10\` <mark style="background: #89f3f5">Deprecated. Use <code>schemeBuGnReGr</code></mark>`
)}

function _schemeCategory10(schemeBuGnReGr)
{
  console.warn("schemeCategory10 is deprecated. Use schemeBuGnReGr");

  return schemeBuGnReGr;
}


function _28(md){return(
md`##### \`schemePaired\` <mark style="background: #89f3f5">Deprecated. Use <code>schemeBuGnReGrPaired</code></mark>
`
)}

function _schemePaired(schemeBuGnReGrPaired)
{
  console.warn("schemePaired is deprecated. Use schemeBuGnReGrPaired");
  return schemeBuGnReGrPaired
}


function _30(md){return(
md`##### \`schemeAltCategory10\` <mark style="background: #89f3f5">Deprecated. Use <code>schemeBuReGnGr</code></mark>
`
)}

function _schemeAltCategory10(schemeBuReGnGr)
{
  console.warn("schemeAltCategory10 is deprecated. Use schemeBuReGnGr");

  return schemeBuReGnGr;
}


function _32(md){return(
md`#### Diverging
`
)}

function _33(md){return(
md`##### \`schemeReGrBu[k] / interpolateReGrBu(t)\`
`
)}

function _interpolateReGrBu(d3,schemeReGrBu){return(
d3.interpolateRgbBasis(
  schemeReGrBu[schemeReGrBu.length - 1]
)
)}

function _schemeReGrBu(main){return(
[
  ...new Array(3),
  [main.red["500"], main.grey["200"], main.blue["500"]],
  [main.red["500"], main.red["400"], main.blue["400"], main.blue["500"]],
  ,
  [
    main.red["500"],
    main.red["400"],
    main.grey["200"],
    main.blue["400"],
    main.blue["500"]
  ],
  [
    main.red["600"],
    main.red["500"],
    main.red["400"],
    main.blue["400"],
    main.blue["500"],
    main.blue["600"]
  ],
  [
    main.red["600"],
    main.red["500"],
    main.red["400"],
    main.grey["200"],
    main.blue["400"],
    main.blue["500"],
    main.blue["600"]
  ],
  [
    main.red["700"],
    main.red["600"],
    main.red["500"],
    main.red["400"],
    main.blue["400"],
    main.blue["500"],
    main.blue["600"],
    main.blue["700"]
  ],
  [
    main.red["700"],
    main.red["600"],
    main.red["500"],
    main.red["400"],
    main.grey["200"],
    main.blue["400"],
    main.blue["500"],
    main.blue["600"],
    main.blue["700"]
  ],
  [
    main.red["800"],
    main.red["700"],
    main.red["600"],
    main.red["500"],
    main.red["400"],
    main.blue["400"],
    main.blue["500"],
    main.blue["600"],
    main.blue["700"],
    main.blue["800"]
  ],
  [
    main.red["800"],
    main.red["700"],
    main.red["600"],
    main.red["500"],
    main.red["400"],
    main.grey["200"],
    main.blue["400"],
    main.blue["500"],
    main.blue["600"],
    main.blue["700"],
    main.blue["800"]
  ]
]
)}

function _36(schemeArrayHtml,schemeReGrBu){return(
schemeArrayHtml(schemeReGrBu, 'schemeReGrBu')
)}

function _37(md){return(
md`#### Sequential (Single Hue)
##### \`schemeBlues[k] / interpolateBlues(t)\``
)}

function _schemeBlues(generateSchemes,main){return(
generateSchemes(main.blue)
)}

function _interpolateBlues(d3,schemeBlues){return(
d3.interpolateRgbBasis(schemeBlues[schemeBlues.length - 1])
)}

function _40(schemeArrayHtml,schemeBlues){return(
schemeArrayHtml(schemeBlues, 'schemeBlues')
)}

function _41(md){return(
md`##### \`schemeReds[k]  / interpolateReds(t)\``
)}

function _schemeReds(generateSchemes,main){return(
generateSchemes(main.red)
)}

function _interpolateReds(d3,schemeReds){return(
d3.interpolateRgbBasis(schemeReds[schemeReds.length - 1])
)}

function _44(schemeArrayHtml,schemeReds){return(
schemeArrayHtml(schemeReds, 'schemeReds')
)}

function _45(md){return(
md`##### \`schemeGreens[k] / interpolateGreens(t)\``
)}

function _schemeGreens(generateSchemes,main){return(
generateSchemes(main.green)
)}

function _interpolateGreens(d3,schemeGreens){return(
d3.interpolateRgbBasis(schemeGreens[schemeGreens.length - 1])
)}

function _48(schemeArrayHtml,schemeGreens){return(
schemeArrayHtml(schemeGreens, 'schemeGreens')
)}

function _49(md){return(
md`##### \`schemeGreys[k] / interpolateGreys(t)\``
)}

function _schemeGreys(generateSchemes,main){return(
generateSchemes(main.grey)
)}

function _interpolateGreys(d3,schemeGreys){return(
d3.interpolateRgbBasis(schemeGreys[schemeGreys.length - 1])
)}

function _52(schemeArrayHtml,schemeGreys){return(
schemeArrayHtml(schemeGreys, 'schemeGreys')
)}

function _53(md){return(
md`#### Sequential (Multi-Hue)
##### \`schemeGrBu[k] / interpolateGrBu(t)\``
)}

function _schemeGrBu(main){return(
[
  ...new Array(3),
  [main.grey["200"], main.blue["500"], main.blue["800"]],
  [main.grey["200"], main.blue["400"], main.blue["700"], main.blue["900"]],
  [
    main.grey["200"],
    main.grey["300"],
    main.blue["400"],
    main.blue["700"],
    main.blue["900"]
  ],
  [
    main.grey["200"],
    main.grey["300"],
    main.blue["400"],
    main.blue["600"],
    main.blue["800"],
    main.blue["900"]
  ],
  [
    main.grey["200"],
    main.grey["300"],
    main.grey["400"],
    main.blue["500"],
    main.blue["600"],
    main.blue["800"],
    main.blue["900"]
  ],
  [
    main.grey["200"],
    main.grey["300"],
    main.grey["400"],
    main.blue["500"],
    main.blue["600"],
    main.blue["700"],
    main.blue["800"],
    main.blue["900"]
  ],
  [
    main.grey["100"],
    main.grey["200"],
    main.grey["300"],
    main.blue["400"],
    main.blue["500"],
    main.blue["600"],
    main.blue["700"],
    main.blue["800"],
    main.blue["900"]
  ]
]
)}

function _interpolateGrBu(d3,schemeGrBu){return(
d3.interpolateRgbBasis(schemeGrBu[8])
)}

function _56(schemeArrayHtml,schemeGrBu){return(
schemeArrayHtml(schemeGrBu, 'schemeGrBu')
)}

function _57(md){return(
md`##### \`schemeGrRe[k] / interpolateGrRe(t)\``
)}

function _schemeGrRe(main){return(
[
  ...new Array(3),
  [main.grey["200"], main.red["500"], main.red["800"]],
  [main.grey["200"], main.red["400"], main.red["700"], main.red["900"]],
  [
    main.grey["200"],
    main.grey["300"],
    main.red["400"],
    main.red["700"],
    main.red["900"]
  ],
  [
    main.grey["200"],
    main.grey["300"],
    main.red["400"],
    main.red["600"],
    main.red["800"],
    main.red["900"]
  ],
  [
    main.grey["100"],
    main.grey["200"],
    main.grey["300"],
    main.red["500"],
    main.red["600"],
    main.red["800"],
    main.red["900"]
  ],
  [
    main.grey["100"],
    main.grey["200"],
    main.grey["300"],
    main.red["500"],
    main.red["600"],
    main.red["700"],
    main.red["800"],
    main.red["900"]
  ],
  [
    main.grey["100"],
    main.grey["200"],
    main.grey["300"],
    main.red["400"],
    main.red["500"],
    main.red["600"],
    main.red["700"],
    main.red["800"],
    main.red["900"]
  ]
]
)}

function _interpolateGrRe(d3,schemeGrRe){return(
d3.interpolateRgbBasis(schemeGrRe[8])
)}

function _60(schemeArrayHtml,schemeGrRe){return(
schemeArrayHtml(schemeGrRe, 'schemeGrRe')
)}

function _61(md){return(
md`##### \`schemeGrGn[k] / interpolateGrGn(t)\``
)}

function _schemeGrGn(main){return(
[
  ...new Array(3),
  [main.grey["200"], main.green["500"], main.green["800"]],
  [main.grey["200"], main.green["400"], main.green["700"], main.green["900"]],
  [
    main.grey["200"],
    main.grey["300"],
    main.green["400"],
    main.green["700"],
    main.green["900"]
  ],
  [
    main.grey["200"],
    main.grey["300"],
    main.green["400"],
    main.green["600"],
    main.green["800"],
    main.green["900"]
  ],
  [
    main.grey["100"],
    main.grey["200"],
    main.grey["300"],
    main.green["500"],
    main.green["600"],
    main.green["800"],
    main.green["900"]
  ],
  [
    main.grey["100"],
    main.grey["200"],
    main.grey["300"],
    main.green["500"],
    main.green["600"],
    main.green["700"],
    main.green["800"],
    main.green["900"]
  ],
  [
    main.grey["100"],
    main.grey["200"],
    main.grey["300"],
    main.green["400"],
    main.green["500"],
    main.green["600"],
    main.green["700"],
    main.green["800"],
    main.green["900"]
  ]
]
)}

function _interpolateGrGn(d3,schemeGrGn){return(
d3.interpolateRgbBasis(schemeGrGn[8])
)}

function _64(schemeArrayHtml,schemeGrGn){return(
schemeArrayHtml(schemeGrGn, 'schemeGrGn')
)}

function _65(md){return(
md`### Reference colors

The colors are made based on these colors from [ADB branding toolkit](https://observablehq.com/@adb/brand).`
)}

function _66(htl,refColors,swatch){return(
htl.html`<div style=${{ display: "flex", gap: "1rem" }}>
  ${Object.entries(refColors).map(([k, v]) => swatch(v, { label: k }))}
</div>`
)}

function _67(md){return(
md`A suitable grey is picked.`
)}

function _68(htl,swatch){return(
htl.html`
<div style=${{ display: "flex", gap: "1rem" }}>${swatch("#64748b", {
  label: "TW Slate 500"
})}</div>`
)}

function _refColors(adbBrandMainColors,adbBrandAccentColors){return(
{
  "main 700": adbBrandMainColors["700"],
  "accent 600": adbBrandAccentColors["600"],
  "accent 300": adbBrandAccentColors["300"]
}
)}

function _70(md){return(
md`## Typography
`
)}

function _71(md){return(
md`### Font Family

The font stack is ‘SF Pro, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif.’`
)}

function _fontFamily(){return(
`-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,sans-serif,apple c emoji,segoe ui emoji,segoe ui symbol`
)}

function _73(md){return(
md`---`
)}

function _74(md){return(
md`## Helpers`
)}

function _swatch(html){return(
function swatch(color, { label = color, width = '90px', element = 'div' } = {}) {
  return html`<${element} style="width: ${width}; padding-bottom: 0.5rem;">
  <div style="flex: 1; background-color: ${color}; aspect-ratio: 4 / 3; border-radius: 0.25rem"></div>
  <p style="margin: 0"><code style="">${label}</code></p>
  ${color !== label ? html`<p style="margin: -0.25rem 0 0;"><code style="font-size: 0.75em; color: rgb(110, 110, 110);">${color}</code></p>`: ""}
</${element}>`;
}
)}

function _76(swatch){return(
swatch("#0099D8")
)}

function _77(swatch){return(
swatch("#0099D8", {label: "main 700"})
)}

function _generateSchemes(){return(
function generateSchemes(colorObj) {
  return [
    ...new Array(3),
    [colorObj["400"], colorObj["700"], colorObj["900"]],
    [colorObj["400"], colorObj["600"], colorObj["800"], colorObj["900"]],
    [
      colorObj["400"],
      colorObj["500"],
      colorObj["700"],
      colorObj["800"],
      colorObj["900"]
    ],
    [
      colorObj["400"],
      colorObj["500"],
      colorObj["600"],
      colorObj["700"],
      colorObj["800"],
      colorObj["900"]
    ]
  ];
}
)}

function _schemeArrayHtml(htl,schemeHtml){return(
(arr, variableName) =>
  htl.html`${arr.map((o, i) =>
    o !== undefined
      ? htl.html`<h6><code>${variableName}[${i}]</code></h6>${schemeHtml(o)}`
      : ""
  )}`
)}

function _schemeHtml(htl,swatch){return(
(arr) => {
  if (arr === undefined) return;

  return htl.html`<div style=${{ display: "flex", gap: "0.125rem" }}>${arr.map(
    swatch
  )}`;
}
)}

function _interpolateColorFn(d3){return(
(fn, n = 50) => d3.range(n).map(i => d3.rgb(fn(i / (n - 1))).hex())
)}

function _82(allColorCodes,md){return(
md`### All colors
\`\`\`
${allColorCodes.map(x => `${x}\n`)}
\`\`\``
)}

function _allColorCodes(main,accent,getStringsFromObject){return(
[main, accent].flatMap(getStringsFromObject)
)}

function _getStringsFromObject(){return(
function getStringsFromObject (x) {
  if (typeof x === 'string') return x;

  if (typeof x === 'object') {
    return Object.entries(x).flatMap(([k, v]) => getStringsFromObject(v))
  }
}
)}

function _85(htl){return(
htl.html`<style>
  h5 > code {
    font-weight: bold;
  }
</style>`
)}

function _86(md){return(
md`## Imports`
)}

function _89(md){return(
md`## Credits and references`
)}

function _90(ccUrls,md){return(
md`- Main colors are generated using [colorcolor.in](${ccUrls[0]})
- [A detailed guide to colors in data vis style guides - Datawrapper Blog](https://blog.datawrapper.de/colors-for-data-vis-style-guides/)`
)}

function _ccUrls(){return(
[
  /*
   * Keep latest first
   */
  // 2022-07-18: Tweaks hues of main colors, and rate of red
  "https://colorcolor.in/?s=eJyNksFSwjAQht8lve50krZpE46Cjl6U0aPjYYUUGEvbSVLBYXh3U2hLFZTeNpv99_-y2R0pMVPWqilqXBsy2hFjVekCFkB795DP1ZaMXMJs0M6WzTkGssbtY7V-SqfHQnNIlk2r1x1ZVurYErV1DcLYTzgQlc97BzSuhviMAQWfAyV754O2p4uiRiPYqZ4DA19IYASIRutyLKROmq0WPamUjZRfUu738JuRBdJvEdv4OmEoTw-TVyDZOaToLCM_GEoa8k7VhAMmyTqNvOjTYTJxhskobbTJQMSA9z-cJwMp69U7fsCP-V-ijP6hDP6c5Vtt6RZ2lS8OK198Kp3h17jIrUbjmqSYGQVt_r7edqsrl9EqHRdZoc0zblxX71byMLgBT0zGcXgHHqVSTgR4cZRE4t2BzurqlxJnNUTxsTSZ8_8GJWf4Ow",
  // 2022-07-18: Increased saturation to match ADB brand colors
  "https://colorcolor.in/?s=eJyNkk1PwzAMhv9LerWifDRtsyMdCC4wwRFxCFv2Ibp2SjI2NO2_49J2m2BsvTm2X_vJK-_IyhQ2BDsyziw9GeyID3aFARfQ1R7Kid2SASb8xoTxvH1LIEuzfVwvn6ajphFlSa1qRr3uyHxtm5HGBRwgFRBbTjBSDCPjsUoo58CAKmBkjxtMOFHEcSvI-LFfAQeaaeAEiDMBc1wylBaL2YlU61aqzin3e_hNx0WnaKLrdFLTtPuRvgLI_wJmtBPHVPSlPFgoVT8H-WGLPrvjkoecsVabNj_tQyhUcrRFqJT2A63vrXFf08ugPL4AKv618q1eiVe6KGc_d159WleYr7wqgzMeh0xN4S10-fv6xINbY8bZaV4VlfPPZoNTo1utpLiBKBvmibyDiDGthxlESZzG2TuCjuvul5UZ1xDVx9wXuP8btYL2Bw",
  // 2022-07-07: Made the darker shades lighter
  "https://colorcolor.in/?s=eJyVkk9vwjAMxb9LerWiJG1KwnGwabtsaDtOO3gQ_milRUkYTIjvPnelgCbG4OY6fu_9annDFli4GN0APc4D625YiG5BhVTQvj2UI7dmXQEsrDAOp7tvA2yO68fl_Gk8aAZJlteqxup1w6ZL11iij6yrUg3MlSOqNJk5DPTKuJQggGsQbEsJGI8UWbYTGHmY1yCBGwuSAfMYqSeFIGkxmxxJrd1J9Snldgu_6aRqFU31P11qeaf9I3s9oOGtOOPqUsr9ClN92QblPsWezDiHSL3rCZXOD2tRusMvA63vrdm-5edBZXYGVP0J-lZH0pXOysnPnVefzhf41avK6DGQyRiL4KDt39cnHv2SOt6Ne1VR-fCMK3JNbq1O1Q0kpt_L0ztIhLC2byDJs05m3gl0WE-_LHBYQ1Qf01BQ_jegyvX4",
  // 2022-07-07: Tweaked hues
  "https://colorcolor.in/?s=eJyNk01TgzAQhv9LuO4w-SBAerSV0Yt29Oh4iDT9GCl0ktTW6fS_u0gp1drKjWzy7PuwhB1Z6cJ4b8ba6qUjgx1x3qzwQUG7dV9OzJYMKBC30T6fH9YSyFJvH9bLx-m4OYhUXFNNp5cdma9N01FbTwZc8BAhU07qZxXyeqEdHiEhY0ABdynZY4z2J1jEw6TFUtYhEhiEqQJGgFjtscaoRLpYzE5opdrEuGlzRu_38NuU8fhAMcH6euIbHT3VP5703DPtZpP8iLxqKjpMiLDnQNmRUX_mXPPEWptH-2vyKO6Gw2XSd6acn2IXPuBRl0VXdHkaXrB9rWPx_i7K2fcPUH0YW-jPYVV6qx02merCGWjrd_Xl93aNFWumw6qorHvSG-wa3Cop-A0E6WgYiwwCSpUapRDEURKlbxBkLJOZgkCIiEmJ4nlNP690XktV73NXoM8Xe8P-MQ",
  // Reduced saturation of greens and reds
  "https://colorcolor.in/?s=eJyVkk9PwzAMxb9LerWiJG3aZkc2EFxggiPiYLbsj-jaKcnY0NTvjkvpNk3TKDfH8fP76cl7tsbChmDH6HDl2WDPfLBrKgx0Xw_l1O7YIAbmtxgmi-N7hbvHzeppNm4HSZU2qnbT654tNrbdiC6wgYo1MFtOqdKCKvT0y7iUIIBrEKwmBwwniiT5FeTyOK9BAs8NSAbMYaCeFIKkxXJ-IjWm80p5pi-p6xrOCaXqVG31N2Fs2u2NxvwfMueHSDKu-mIecox1vxjlwcZc9LjGSL3OTfRHVDo9BqN0xvuRStXlb_h1UplcIVX5ZXVdvzWWdKvLcv5z7NWndQV-DasyOPS0ZIaFt9D175tDD25DHWdnw6qonH_GLW2Nbo2O1Q1E-WiYxncQCWHMKIcoTbIkfyfQSTP9ssZJA1F9LHxB_t_NqPcD",
  // First draft
  "https://colorcolor.in/?s=eJylkt9PwjAQx_-X7vXStN26rTwKGn1Roo_GhxPKjzg20hbBkP3v3hgDYohgfLu197nvZ81t2RILG4IdosOFZ70t88EuqTDQXT2UY7thvRiYX2MYzfbfGtgCN4-rxdNk2DYSlTZUO-l1y2Yr205EF1hPxYTYckyVFlShp1vGpQQBXINgNSVgOCGSZA_k8tivQQLPDUgGzGGgMykEocV8eoIa02WlPNPn6LqGn4ZSdVRbXTbUup2-Y4T4s2XGD2-ScXWt5-EhY32dZfIvyxbZ5YnrJZVOj6lKt3962VWqTtTws1EHU5n8Yqry83RdvzWRtK7zcrrb9-rTugK_-lUZHHoaMsHCW-jO75tdD25FJ85O-lVROf-Ma5oa3RodqxuI8kE_je8gEsKYQQ5RmmRJ_k6io6b7ZYmjRqL6mPmC8r8BJeT3hw"
]
)}

function _92(substratum,invalidation){return(
substratum({invalidation})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["toc"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("main")).define("main", _main);
  main.variable(observer()).define(["d3","htl","main","swatch"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("accent")).define("accent", ["adbBrandMainColors","adbBrandAccentColors"], _accent);
  main.variable(observer()).define(["htl","accent","swatch"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("schemeBuGnReGr")).define("schemeBuGnReGr", ["main"], _schemeBuGnReGr);
  main.variable(observer()).define(["schemeHtml","schemeBuGnReGr"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("schemeBuReGnGr")).define("schemeBuReGnGr", ["main"], _schemeBuReGnGr);
  main.variable(observer()).define(["schemeHtml","schemeBuReGnGr"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("schemeBuGnReGrPaired")).define("schemeBuGnReGrPaired", ["main"], _schemeBuGnReGrPaired);
  main.variable(observer()).define(["schemeHtml","schemeBuGnReGrPaired"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("schemeContrasting")).define("schemeContrasting", ["main"], _schemeContrasting);
  main.variable(observer()).define(["schemeHtml","schemeContrasting"], _22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("schemeContrastingAlt")).define("schemeContrastingAlt", ["main"], _schemeContrastingAlt);
  main.variable(observer()).define(["schemeHtml","schemeContrastingAlt"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("schemeCategory10")).define("schemeCategory10", ["schemeBuGnReGr"], _schemeCategory10);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("schemePaired")).define("schemePaired", ["schemeBuGnReGrPaired"], _schemePaired);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer("schemeAltCategory10")).define("schemeAltCategory10", ["schemeBuReGnGr"], _schemeAltCategory10);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer("interpolateReGrBu")).define("interpolateReGrBu", ["d3","schemeReGrBu"], _interpolateReGrBu);
  main.variable(observer("schemeReGrBu")).define("schemeReGrBu", ["main"], _schemeReGrBu);
  main.variable(observer()).define(["schemeArrayHtml","schemeReGrBu"], _36);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("schemeBlues")).define("schemeBlues", ["generateSchemes","main"], _schemeBlues);
  main.variable(observer("interpolateBlues")).define("interpolateBlues", ["d3","schemeBlues"], _interpolateBlues);
  main.variable(observer()).define(["schemeArrayHtml","schemeBlues"], _40);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer("schemeReds")).define("schemeReds", ["generateSchemes","main"], _schemeReds);
  main.variable(observer("interpolateReds")).define("interpolateReds", ["d3","schemeReds"], _interpolateReds);
  main.variable(observer()).define(["schemeArrayHtml","schemeReds"], _44);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer("schemeGreens")).define("schemeGreens", ["generateSchemes","main"], _schemeGreens);
  main.variable(observer("interpolateGreens")).define("interpolateGreens", ["d3","schemeGreens"], _interpolateGreens);
  main.variable(observer()).define(["schemeArrayHtml","schemeGreens"], _48);
  main.variable(observer()).define(["md"], _49);
  main.variable(observer("schemeGreys")).define("schemeGreys", ["generateSchemes","main"], _schemeGreys);
  main.variable(observer("interpolateGreys")).define("interpolateGreys", ["d3","schemeGreys"], _interpolateGreys);
  main.variable(observer()).define(["schemeArrayHtml","schemeGreys"], _52);
  main.variable(observer()).define(["md"], _53);
  main.variable(observer("schemeGrBu")).define("schemeGrBu", ["main"], _schemeGrBu);
  main.variable(observer("interpolateGrBu")).define("interpolateGrBu", ["d3","schemeGrBu"], _interpolateGrBu);
  main.variable(observer()).define(["schemeArrayHtml","schemeGrBu"], _56);
  main.variable(observer()).define(["md"], _57);
  main.variable(observer("schemeGrRe")).define("schemeGrRe", ["main"], _schemeGrRe);
  main.variable(observer("interpolateGrRe")).define("interpolateGrRe", ["d3","schemeGrRe"], _interpolateGrRe);
  main.variable(observer()).define(["schemeArrayHtml","schemeGrRe"], _60);
  main.variable(observer()).define(["md"], _61);
  main.variable(observer("schemeGrGn")).define("schemeGrGn", ["main"], _schemeGrGn);
  main.variable(observer("interpolateGrGn")).define("interpolateGrGn", ["d3","schemeGrGn"], _interpolateGrGn);
  main.variable(observer()).define(["schemeArrayHtml","schemeGrGn"], _64);
  main.variable(observer()).define(["md"], _65);
  main.variable(observer()).define(["htl","refColors","swatch"], _66);
  main.variable(observer()).define(["md"], _67);
  main.variable(observer()).define(["htl","swatch"], _68);
  main.variable(observer("refColors")).define("refColors", ["adbBrandMainColors","adbBrandAccentColors"], _refColors);
  main.variable(observer()).define(["md"], _70);
  main.variable(observer()).define(["md"], _71);
  main.variable(observer("fontFamily")).define("fontFamily", _fontFamily);
  main.variable(observer()).define(["md"], _73);
  main.variable(observer()).define(["md"], _74);
  main.variable(observer("swatch")).define("swatch", ["html"], _swatch);
  main.variable(observer()).define(["swatch"], _76);
  main.variable(observer()).define(["swatch"], _77);
  main.variable(observer("generateSchemes")).define("generateSchemes", _generateSchemes);
  main.variable(observer("schemeArrayHtml")).define("schemeArrayHtml", ["htl","schemeHtml"], _schemeArrayHtml);
  main.variable(observer("schemeHtml")).define("schemeHtml", ["htl","swatch"], _schemeHtml);
  main.variable(observer("interpolateColorFn")).define("interpolateColorFn", ["d3"], _interpolateColorFn);
  main.variable(observer()).define(["allColorCodes","md"], _82);
  main.variable(observer("allColorCodes")).define("allColorCodes", ["main","accent","getStringsFromObject"], _allColorCodes);
  main.variable(observer("getStringsFromObject")).define("getStringsFromObject", _getStringsFromObject);
  main.variable(observer()).define(["htl"], _85);
  main.variable(observer()).define(["md"], _86);
  const child1 = runtime.module(define1);
  main.import("mainColors", "adbBrandMainColors", child1);
  main.import("accentColors", "adbBrandAccentColors", child1);
  const child2 = runtime.module(define2);
  main.import("toc", child2);
  main.variable(observer()).define(["md"], _89);
  main.variable(observer()).define(["ccUrls","md"], _90);
  main.variable(observer("ccUrls")).define("ccUrls", _ccUrls);
  main.variable(observer()).define(["substratum","invalidation"], _92);
  const child3 = runtime.module(define3);
  main.import("substratum", child3);
  return main;
}
