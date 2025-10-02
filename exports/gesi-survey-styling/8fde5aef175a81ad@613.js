import define1 from "./4ec80ecf24f99183@174.js";
import define2 from "./08b5f0b01b02fcf6@1097.js";
import define3 from "./cc93bcc13ba8f21a@50.js";
import define4 from "./9880a091bb9a0991@309.js";

function _1(md){return(
md`# Radar Chart`
)}

function _2(md){return(
md`A [radar chart](https://en.wikipedia.org/wiki/Radar_chart) can show three or more quantitative variables on axes starting from the same point. They are also known as spider chart or star plot. They can be used to plot data among similar groups, people, or objects.`
)}

function _3(md){return(
md`## Usage`
)}

function _4(md){return(
md`You need to have an array of data objects, each having an \`attribute\` (plotted
along each axis) and a numerical value, to create a radar chart. The unique
values in the \`attribute\` should be 3 or more. If you are making a plot with
only one or two unique attributes, it makes more sense with bar charts.

Example:

\`\`\`js
data = [
  { team: "Marketing", budget: 30000},
  { team: "Sales", budget: 25000},
  { team: "Administration", budget: 40000},
  { team: "R&D", budget: 70000},
  { team: "Human Resources", budget: 20000},
]
\`\`\`

Once you have data ready, import \`radarChart\` function into your notebook:

\`\`\`js
import {radarChart} from "@adb/radar-chart"
\`\`\`

In another cell, call the function with data, and provide keys for \`attribute\`,
and \`value\` data points:

\`\`\`js
radarChart(data, {
  attribute: "team",
  value: "budget",
})
\`\`\`

If everything went well, you should see the radar chart!

For more advanced options, see [the \`radarChart\` function code](#radarChart).
`
)}

function _5(md){return(
md`### Example: Multi-group data

*Access to facilities in households of Province 1 and Province 2, Nepal, 2011.*
[Data source](https://observablehq.com/@adb/nepal-cbs-2011-census-household-facilities).
`
)}

function _sampleChart(radarChart,sampleData,d3,curve){return(
radarChart(sampleData, {
  group: "Province",
  attribute: "Attribute",
  value: "Penetration",

  tickFormat: d3.format(".0%"),
  radarCurve: curve
})
)}

function _curve(Inputs,d3){return(
Inputs.radio(
  new Map([
    ["curveLinearClosed (default)", d3.curveLinearClosed],
    ["curveCardinalClosed", d3.curveCardinalClosed],
    ["curveCatmullRomClosed", d3.curveCatmullRomClosed]
  ]),
  { label: "Curve styles", value: d3.curveLinearClosed }
)
)}

function _8(sampleData){return(
sampleData
)}

function _9(md){return(
md`The example radar chart is equivalent to this set of bar charts.`
)}

function _10(Plot,sampleData,schemeBuReGnGr){return(
Plot.plot({
  marginBottom: 120,
  facet: {
    data: sampleData,
    x: "Province"
  },
  color: {
    range: schemeBuReGnGr
  },
  fx: { label: null },
  fy: { label: null },
  x: { tickRotate: -30, label: null },
  y: { grid: true, tickFormat: ".0%", label: null },
  marks: [
    Plot.barY(sampleData, {
      x: "Attribute",
      y: "Penetration",
      fill: "Attribute",
      title: d => `${d.Attribute}\n\$${d.Penetration}`
    })
  ]
})
)}

function _11(md){return(
md`### Example: Single group data

*Access to facilities in households of Province 1, Nepal, 2011.* 
[Data source](https://observablehq.com/@adb/nepal-cbs-2011-census-household-facilities).
`
)}

function _12(radarChart,sampleSingleGroupData,d3,curve){return(
radarChart(sampleSingleGroupData, {
  attribute: "Attribute",
  value: "Penetration",

  tickFormat: d3.format(".0%"),
  radarCurve: curve
})
)}

function _sampleSingleGroupData(sampleData)
{
  const group = sampleData[0].Province;

  return sampleData.filter((p) => p.Province === group);
}


function _14(md){return(
md`## Implementation`
)}

function _radarChart(schemeBuReGnGr,d3,main,formatTick,generateAccessor,DOM,getCoordinatesForAngle,wrap,swatch){return(
function radarChart(
  data,
  {
    // Required
    attribute = "attribute",
    value = "value",
    group,

    // Optionals
    maxValue = undefined, // will calculate it
    scheme = schemeBuReGnGr,

    width = 600,
    height = width,
    margin,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,

    fontFamily = "var(--sans-serif, sans-serif)",

    angleOffset = -Math.PI / 2,
    ticks = 3,

    radarStrokeWidth = 2.5,
    radarDotRadius = radarStrokeWidth * 1.25,
    radarFillOpacity = 0.1,
    radarCurve = d3.curveLinearClosed,

    sortGroups,
    sortAttributes,

    gridStroke = main.grey["300"],
    gridStrokeWidth = 1.5,
    tickFontSize = "0.75rem",
    tickFill = main.grey["700"],
    tickFormat = formatTick,

    axisLabelFill = main.grey["1000"],
    axisLabelFontSize = "0.8rem",
    axisLabelFontWeight = "normal",
    axisLabelMaxWidth = 120,

    showLegend = true
  } = {}
) {
  // Access data
  const getGroup = group === null ? null : generateAccessor(group);
  const getValue = generateAccessor(value);
  const getAttribute = generateAccessor(attribute);

  // Compute values
  let G = getGroup ? [...new Set(data.map(getGroup))] : null;
  let A = [...new Set(data.map(getAttribute))];

  G = typeof sortGroups === "function" ? G.slice().sort(sortGroups) : G;
  A = typeof sortAttributes === "function" ? A.slice().sort(sortGroups) : A;

  let V = [];
  G.forEach((g, i) => {
    V[i] = [];
    A.forEach((a, j) => {
      const obj = data.find((d) => g === getGroup(d) && a === getAttribute(d));
      const v = getValue(obj);
      V[i][j] = v == null ? NaN : +v;
    });
  });

  // Construct scales
  marginTop = margin ?? marginTop ?? 0;
  marginRight = margin ?? marginRight ?? 0;
  marginBottom = margin ?? marginBottom ?? 0;
  marginLeft = margin ?? marginLeft ?? 0;

  const w = width - marginLeft - marginRight;
  const h = height - marginTop - marginBottom;
  const maxR = (Math.min(w, h) * 0.5 * 2) / 3;
  maxValue = maxValue || d3.max(data, getValue);
  const radialGridStrokeWidth = Math.max(1.5, gridStrokeWidth / 2);

  const radius = d3.scaleLinear().domain([0, maxValue]).range([0, maxR]);
  const angle = d3
    .scaleBand()
    .domain(A)
    .range([0 + angleOffset, Math.PI * 2 + angleOffset]);

  const color = d3.scaleOrdinal().domain(G).range(scheme);

  // Construct generator
  const radarLine = d3
    .lineRadial()
    .curve(radarCurve)
    .radius((d) => radius(d))
    .angle((_, i) => angle(A[i]) - angleOffset);

  // Draw canvas
  const svg = DOM.svg(width, height);
  const canvas = d3
    .select(svg)
    .style("background", "white")
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const peripherals = canvas.append("g").attr("class", "peripherals");

  // Add axes
  peripherals
    .selectAll(".axis")
    .data(A)
    .join("line")
    .attr("class", "axis")
    .attr("stroke", gridStroke)
    .attr("stroke-width", gridStrokeWidth)
    .each(function (d, i) {
      const theta = angle(d);
      const [x, y] = getCoordinatesForAngle(
        theta,
        maxR + radialGridStrokeWidth / 2
      );
      d3.select(this).attr("x2", x).attr("y2", y);
    });

  // Add axis labels
  setTimeout(() => {
    // Running within timeout since wrap(), to wrap labels needs to be in DOM to measure width
    peripherals
      .selectAll(".axis-label")
      .data(A)
      .join("text")
      .attr("class", "axis-label")
      .text((d) => d)
      .attr("dominant-baseline", "middle")
      .attr("fill", axisLabelFill)
      .attr("fill-opacity", 1)
      .attr("font-size", axisLabelFontSize)
      .attr("font-weight", axisLabelFontWeight)
      .style("font-family", fontFamily)
      .each(function (d, i) {
        const theta = angle(d);
        const [x, y] = getCoordinatesForAngle(theta, maxR * 1.125);
        d3.select(this)
          .attr("x", x)
          .attr("y", y)
          .style(
            "text-anchor",
            Math.abs(x) < 5 ? "middle" : x > 0 ? "start" : "end"
          );
      })
      .attr("dy", "0em")
      .call(wrap, axisLabelMaxWidth);
  });

  // Add radial ticks
  const radialTicks = radius.ticks(ticks);
  peripherals
    .selectAll(".radial-grid")
    .data(radialTicks)
    .join("circle")
    .attr("class", "radial-grid")
    .attr("r", radius)
    .attr("fill", "none")
    .attr("stroke", gridStroke)
    .attr("stroke-width", radialGridStrokeWidth)
    .attr(
      "stroke-dasharray",
      `${radialGridStrokeWidth} ${radialGridStrokeWidth * 2}`
    );

  peripherals
    .selectAll(".radial-tick")
    .data(radialTicks.slice(1)) // Ignore the zero tick
    .join("text")
    .attr("class", "radial-tick")
    .style("font-size", tickFontSize)
    .style("fill", tickFill)
    .style("font-family", fontFamily)
    .attr("dy", "16px")
    .attr("dx", "4px")
    .attr("y", (d) => -radius(d))
    .text((d) => tickFormat(d));

  // Draw data
  const plot = canvas.append("g").attr("class", "plot");
  const groups = plot
    .selectAll(".group")
    .data(G)
    .join("g")
    .attr("class", "group");

  groups.each(function (group, groupIndex) {
    const groupData = V[groupIndex];
    const positions = groupData.map((value, attrIndex) => {
      const theta = angle(A[attrIndex]);
      return getCoordinatesForAngle(theta, radius(value));
    });

    const g = d3.select(this);

    const radarTitle = `${group ? `${group}\n\n` : ""}${groupData
      .map((v, i) => `${A[i]}: ${tickFormat(v)}`)
      .join("\n")}`;

    // Add radarLine
    g.selectAll(".radar")
      .data([group])
      .join("path")
      .attr("class", "radar")
      .attr("fill", () => color(group))
      .attr("fill-opacity", radarFillOpacity)
      .attr("stroke", () => color(group))
      .attr("d", radarLine(groupData))
      .append("title")
      .text(radarTitle);

    // Add dots
    g.selectAll(".dot")
      .data(positions)
      .join("circle")
      .attr("class", "dot")
      .attr("r", radarDotRadius)
      .attr("fill", () => color(group))
      .attr("cx", (d) => d[0])
      .attr("cy", (d) => d[1])
      .append("title")
      .text(
        (d, i) =>
          `${group ? `${group}\n` : ""}${A[i]}: ${tickFormat(groupData[i])}`
      );
  });

  // Set up interactions
  const radars = plot
    .selectAll(".radar")
    .on("mouseover", function (d, i) {
      d3.selectAll(".radar")
        .transition()
        .duration(200)
        .attr("stroke-opacity", 1 / 2)
        .attr("fill-opacity", 1 / 50);

      d3.select(this)
        .transition()
        .duration(200)
        .attr("stroke-opacity", 1)
        .attr("fill-opacity", 1 / 3);
    })
    .on("mouseout", function (d, u) {
      d3.selectAll(".radar")
        .transition()
        .duration(200)
        .attr("stroke-opacity", 1)
        .attr("fill-opacity", radarFillOpacity);
    });

  if (showLegend && G.length > 1) {
    const key = swatch(color);
    d3.select(svg)
      .append("g")
      .attr("transform", `translate(${marginLeft},${marginTop})`)
      .node()
      .appendChild(key);
  }

  return svg;
}
)}

function _formatTick(d3){return(
d3.format(".2s")
)}

function _generateAccessor(){return(
function generateAccessor(accessor) {
  return function (obj) {
    if (typeof accessor === "function") return accessor(obj);
    return obj[accessor];
  };
}
)}

function _getCoordinatesForAngle(){return(
function getCoordinatesForAngle(angle, r = 1, offset = 1) {
  return [Math.cos(angle) * r * offset, Math.sin(angle) * r * offset];
}
)}

function _sampleData(byProvince){return(
byProvince
  .flatMap((p) => {
    const selectKeys = [
      "Radio",
      "Television",
      "Computer",
      "Internet",
      "Mobile Phone"
    ];

    const { Province, Total } = p;

    return selectKeys.map((Attribute) => ({
      Province,
      Attribute,
      Penetration: p[Attribute] / Total
    }));
  })
  .filter((p) => ["Province 1", "Province 2"].includes(p.Province))
)}

function _20(md){return(
md`## Imports`
)}

function _21(substratum,invalidation){return(
substratum({invalidation})
)}

function _26(md){return(
md`---

## Credits and Attributions

By [Saneef H. Ansari](https://observablehq.com/@saneef). Compare implementations from [Radar Chart by Rayraegah](https://observablehq.com/@rayraegah/radar-chart) and [Radar Chart by Saneef](https://observablehq.com/@saneef/radar-chart).`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("sampleChart")).define("sampleChart", ["radarChart","sampleData","d3","curve"], _sampleChart);
  main.variable(observer("viewof curve")).define("viewof curve", ["Inputs","d3"], _curve);
  main.variable(observer("curve")).define("curve", ["Generators", "viewof curve"], (G, _) => G.input(_));
  main.variable(observer()).define(["sampleData"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["Plot","sampleData","schemeBuReGnGr"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["radarChart","sampleSingleGroupData","d3","curve"], _12);
  main.variable(observer("sampleSingleGroupData")).define("sampleSingleGroupData", ["sampleData"], _sampleSingleGroupData);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("radarChart")).define("radarChart", ["schemeBuReGnGr","d3","main","formatTick","generateAccessor","DOM","getCoordinatesForAngle","wrap","swatch"], _radarChart);
  main.variable(observer("formatTick")).define("formatTick", ["d3"], _formatTick);
  main.variable(observer("generateAccessor")).define("generateAccessor", _generateAccessor);
  main.variable(observer("getCoordinatesForAngle")).define("getCoordinatesForAngle", _getCoordinatesForAngle);
  main.variable(observer("sampleData")).define("sampleData", ["byProvince"], _sampleData);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["substratum","invalidation"], _21);
  const child1 = runtime.module(define1);
  main.import("substratum", child1);
  const child2 = runtime.module(define2);
  main.import("schemeBuReGnGr", child2);
  main.import("main", child2);
  const child3 = runtime.module(define3);
  main.import("swatch", child3);
  main.import("wrap", child3);
  const child4 = runtime.module(define4);
  main.import("byProvince", child4);
  main.variable(observer()).define(["md"], _26);
  return main;
}
