import define1 from "./4ec80ecf24f99183@174.js";
import define2 from "./08b5f0b01b02fcf6@1097.js";

function _1(md){return(
md`# Color Legend`
)}

function _2(md){return(
md`## Ordinal Scale

Generates SVG legend. The code is based on
[Color Legend by D3](https://observablehq.com/@d3/color-legend).
`
)}

function _3(swatch,d3,schemeBuReGnGr){return(
swatch(d3.scaleOrdinal(["blueberries", "oranges", "apples"], schemeBuReGnGr))
)}

function _swatch(main,DOM,d3,wrap){return(
function swatch(
  color,
  {
    swatchSize = 15,
    columnWidth = swatchSize + 90,
    maxWidth = 600,
    gap = 10,
    fontFamily = "var(--sans-serif, sans-serif)",
    fontSize = "10px",
    fontFill = main.grey["900"]
  } = {}
) {
  const domain = color.domain();
  const cols = Math.max(
    Math.min(Math.floor(maxWidth / (columnWidth + gap)), domain.length),
    1
  );
  const rows = Math.floor(domain.length / cols);

  const width = Math.min(maxWidth, (columnWidth + gap) * cols);
  const height = (swatchSize + gap) * rows;

  const svg = DOM.svg(width, height);

  const swatches = d3
    .select(svg)
    .selectAll("g")
    .data(domain)
    .join("g")
    .attr("transform", (d, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return `translate(${col * (columnWidth + gap)},${
        row * (swatchSize + gap)
      })`;
    });

  // Add colors swatch
  swatches
    .append("rect")
    .attr("width", swatchSize)
    .attr("height", swatchSize)
    .attr("fill", (d) => color(d));

  setTimeout(() => {
    swatches
      .append("text")
      .style("font-family", fontFamily)
      .style("font-size", fontSize)
      .attr("dominant-baseline", "middle")
      .attr("y", swatchSize / 2)
      .attr("x", swatchSize + gap / 2)
      .attr("dy", "0.15em")
      .text((d) => d)
      .call(wrap, columnWidth - (swatchSize + gap / 2));
  });

  return svg;
}
)}

function _5(md){return(
md`## Utils`
)}

function _wrap(d3){return(
function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.4, // ems
      y = text.attr("y"),
      x = text.attr("x"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em");

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}
)}

function _7(md){return(
md`## Imports`
)}

function _8(substratum,invalidation){return(
substratum({invalidation})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["swatch","d3","schemeBuReGnGr"], _3);
  main.variable(observer("swatch")).define("swatch", ["main","DOM","d3","wrap"], _swatch);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("wrap")).define("wrap", ["d3"], _wrap);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["substratum","invalidation"], _8);
  const child1 = runtime.module(define1);
  main.import("substratum", child1);
  const child2 = runtime.module(define2);
  main.import("main", child2);
  main.import("schemeBuReGnGr", child2);
  return main;
}
