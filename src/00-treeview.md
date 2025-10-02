# 00 Tree View


<style>
/* Put this in your global Framework CSS (observablehq.config.js -> style: "src/style.css") */
svg.responsive-svg { display:block; width:100%; height:auto; overflow:visible; }
/* If your page/container applies overflow hidden, this makes the figure safe */
.figure:where(:not(.overflow-clip)) { overflow: visible; }
</style>


```js
display(Tree({ data: toTree(surveyslate_dependency_map)}));
```

```js
function dependencyMapToTree(map) {
  function pageToNode(p) {
    const name = p.title || p.notebook || "(untitled)";
    const node = { 
      name, 
      // keep useful bits around for tooltips/clicks if you want
      url: p.url, 
      type: p.type, 
      notebook: p.notebook 
    };
    const kids = (p.dependencies || []).map(pageToNode);
    if (kids.length) node.children = kids;
    return node;
  }
  const children = (map.pages || []).map(pageToNode);
  return { name: map.collection || "root", children };
}
```

```js
function toTree(dataish) {
  if (typeof dataish === "string") return parseIndentedTree(dataish); // your existing function
  if (dataish && dataish.collection && Array.isArray(dataish.pages)) return dependencyMapToTree(dataish);
  if (dataish && (dataish.title || dataish.notebook)) return dependencyMapToTree({ collection: "root", pages: [dataish] });
  return dataish; // assume already {name, children}
}
```


---


```js
display(Tree({ data: parseIndentedTree(treeText_admin)}))
```

```js
display(Tree({ data: treeData}))
```

```js
const treeData = parseIndentedTree(treeText);
```

```js
function parseIndentedTree(text) {
  const parents = [{children: []}]; // virtual root at depth -1
  const lines = String(text ?? "").split(/\r?\n/);
  for (const raw of lines) {
    if (!raw.trim()) continue;                 // skip blank lines
    const depth = raw.match(/^\s*/)[0].length; // number of leading spaces = depth
    const line = raw.slice(depth);

    // CSV-aware split (so commas in the line won't break names outside quotes)
    const cells = d3.csvParseRows(line)[0] ?? [];
    const [name] = cells.map(s => String(s ?? "").trim());
    if (!name) continue;

    // find closest existing ancestor at or above `depth - 1`
    let parent = parents[depth] ?? parents[depth - 1];
    for (let d = depth; !parent && d >= 0; d--) parent = parents[d];

    const node = { name };
    if (!parent.children) parent.children = [];
    parent.children.push(node);
    parents[depth + 1] = node; // this becomes the next depth's parent
  }

  // unwrap if there’s a single top-level node
  const kids = parents[0].children || [];
  return kids.length === 1 ? kids[0] : { name: "root", children: kids };
}
```

```js
function Tree({
  data = treeData,
  containerWidth = width,                         // Observable Framework reactive width
  fontSize = Math.round(Math.max(11, Math.min(14, containerWidth / 80))),
  dx = Math.round(fontSize * 1.8),
  dy: dyInput,
  padding = 16
} = {}) {
  const root = d3.hierarchy(data);

  // First pass: temporary dy=1 to determine depth, then compute dy to fit width.
  d3.tree().nodeSize([dx, 1])(root);
  const levels = Math.max(1, root.height);
  const usable = Math.max(120, containerWidth - padding * 2);
  const dy = Math.max(90, Math.min(260, dyInput ?? usable / levels));

  // Final layout with computed dy.
  d3.tree().nodeSize([dx, dy])(root);

  // Vertical extent for height
  let x0 = Infinity, x1 = -Infinity;
  root.each(d => { x0 = Math.min(x0, d.x); x1 = Math.max(x1, d.x); });
  const vbHeight = Math.ceil(x1 - x0 + dx * 2);

  // Initial horizontal extent without labels — we’ll expand after measuring text.
  const vbWidthBase = Math.ceil(root.height * dy + padding * 2);

  // Create SVG with a provisional viewBox (no explicit height! CSS controls it)
  const svg = d3.create("svg")
    .attr("class", "responsive-svg")
    .attr("viewBox", [ -padding, x0 - dx, vbWidthBase, vbHeight ].join(" "))
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("font-family", "var(--sans-serif, ui-sans-serif, system-ui)")
    .attr("font-size", fontSize)
    .attr("color", "var(--theme-foreground)")
    .style("background", "var(--theme-background, transparent)");

  // Links
  svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.45)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("d", d => {
      const m = (d.source.y + d.target.y) / 2;
      return `M${d.source.y},${d.source.x}C${m},${d.source.x} ${m},${d.target.x} ${d.target.y},${d.target.x}`;
    });

  // Nodes + labels
  const node = svg.append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
    .attr("r", 3)
    .attr("fill", "var(--theme-background)")
    .attr("stroke", "currentColor");

  const labels = node.append("text")
    .attr("dy", "0.32em")
    .attr("x", d => d.children ? -6 : 6)
    .attr("text-anchor", d => d.children ? "end" : "start")
    //.attr("fill", "var(--theme-muted)")
    .attr("fill", "grey")
    .text(d => d.data.name);

  // --- Second pass: measure label extents and expand the viewBox accordingly ---
  // Horizontal positions live on `y`; measure each label’s text length.
  let minX = Infinity;   // leftmost x (i.e., smallest horizontal extent)
  let maxX = -Infinity;  // rightmost x

  labels.each(function(d) {
    const tlen = this.getComputedTextLength?.() ?? 0;
    const anchor = d.children ? "end" : "start";
    const base = d.y; // horizontal position
    const left = anchor === "end" ? base - 6 - tlen : base - 6;          // include small gap
    const right = anchor === "start" ? base + 6 + tlen : base + 6;
    if (left < minX) minX = left;
    if (right > maxX) maxX = right;
  });

  // Fallback if nothing measured (empty tree)
  if (!isFinite(minX) || !isFinite(maxX)) { minX = -padding; maxX = vbWidthBase - padding; }

  const newLeft = Math.floor(minX - padding);
  const newWidth = Math.ceil((maxX - minX) + padding * 2);

  svg.attr("viewBox", [ newLeft, x0 - dx, newWidth, vbHeight ].join(" "));

  return svg.node();
}
```


```js
const surveyslate_dependency_map = ({
	"collection":"Survey Slate",
	"pages":[
		{
			"notebook":"@categorise/surveyslate-docs",
			"title":"Survey Slate | Technical Overview",
			"url":"https://observablehq.com/@categorise/surveyslate-docs",
			"dependencies":[
				{
					"notebook":"@categorise/substratum",
					"title":"Substratum / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/substratum",
					"type":"dependency",
					"dependencies":[
						
					]
				}
			]
		},
		{
			"notebook":"Admin Tools",
			"title":"GESI Survey | Admin Tools",
			"url":"https://observablehq.com/@adb/gesi-survey-admin-tools?collection=@adb/gesi-self-assessment",
			"type":"application",
			"dependencies":[
				{
					"notebook":"jshashes",
					"title":"jshashes",
					"url":"",
					"type":"dependency",
					"dependencies":[
						
					]
				},
				{
					"notebook":"@tomlarkworthy/aws",
					"title":"AWS Helpers / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/aws",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/testing",
							"title":"Reactive Unit Testing and Reporting Framework / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/testing",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@tomlarkworthy/randomid",
							"title":"Secure random ID / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/randomid",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@endpointservices/resize",
							"title":"Resize FileAttachments on the fly with serverless-cells / Endpoint Services | Observable",
							"url":"https://observablehq.com/@endpointservices/resize",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@mbostock/safe-local-storage",
							"title":"Safe Local Storage / Mike Bostock | Observable",
							"url":"https://observablehq.com/@mbostock/safe-local-storage",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@mootari/signature",
							"title":"Signature - A Documentation Toolkit / Fabian Iwand | Observable",
							"url":"https://observablehq.com/@mootari/signature",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@bryangingechen/toc",
					"title":"TOC / Bryan Gin-ge Chen | Observable",
					"url":"https://observablehq.com/@bryangingechen/toc",
					"type":"dependency",
					"dependencies":[
						
					]
				},
				{
					"notebook":"@endpointservices/notebook-secret",
					"title":"How to password protect a Notebook secret / Endpoint Services | Observable",
					"url":"https://observablehq.com/@endpointservices/notebook-secret",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@observablehq/htl",
							"title":"Hypertext Literal / Observable | Observable",
							"url":"https://observablehq.com/@observablehq/htl",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@observablehq/inputs",
							"title":"Observable Inputs | Observable documentation",
							"url":"https://observablehq.com/@observablehq/inputs",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@mbostock/pbcopy",
							"title":"Copier / Mike Bostock | Observable",
							"url":"https://observablehq.com/@mbostock/pbcopy",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@endpointservices/footer-with-backups",
							"title":"Endpoint Services Footer / Endpoint Services | Observable",
							"url":"https://observablehq.com/@endpointservices/footer-with-backups",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@endpointservices/sentry",
									"title":"Observablehq.com Notebook Monitoring with sentry.io / Endpoint Services | Observable",
									"url":"https://observablehq.com/@endpointservices/sentry",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@mbostock/safe-local-storage",
									"title":"Safe Local Storage / Mike Bostock | Observable",
									"url":"https://observablehq.com/@mbostock/safe-local-storage",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@tomlarkworthy/github-backups",
									"title":"Automatically Backup Observable notebooks to Github / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/github-backups",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						}
					]
				},
				{
					"notebook":"@tomlarkworthy/randomid",
					"title":"Secure random ID / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/randomid",
					"type":"dependency",
					"dependencies":[
						
					]
				},
				{
					"notebook":"@tomlarkworthy/local-storage-view",
					"title":"localStorageView: Non-invasive local persistance / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/local-storage-view",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/inspector",
							"title":"@observablehq/inspector@5.0.1 / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/inspector",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/gesi-styling",
					"title":"Survey Slate | Styling / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/gesi-styling",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@jashkenas/inputs",
							"title":"Inputs / Jeremy Ashkenas | Observable",
							"url":"https://observablehq.com/@jashkenas/inputs",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@tomlarkworthy/view",
							"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/view",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/exporter",
									"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/exporter",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"@tomlarkworthy/flow-queue",
											"title":"Convert cell computation to a Promise with cell flowQueue / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/flow-queue",
											"type":"dependency",
											"dependencies":[
												
											]
										},
										{
											"notebook":"@tomlarkworthy/cell-map",
											"title":"cellMap / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/cell-map",
											"type":"dependency",
											"dependencies":[
												{
													"notebook":"@jashkenas/url-querystrings-and-hash-parameters",
													"title":"URL querystrings and hash parameters / Jeremy Ashkenas | Observable",
													"url":"https://observablehq.com/@jashkenas/url-querystrings-and-hash-parameters",
													"type":"dependency",
													"dependencies":[
														
													]
												}
											]
										},
										{
											"notebook":"@tomlarkworthy/observablejs-toolchain",
											"title":"Bidirectional Observable JS <=> Runtime Toolchain / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/observablejs-toolchain",
											"type":"dependency",
											"dependencies":[
												{
													"notebook":"acorn-8.11.3.js.gz",
													"title":"acorn-8.11.3.js.gz",
													"url":"",
													"type":"dependency",
													"dependencies":[
														
													]
												},
												{
													"notebook":"@tomlarkworthy/jest-expect-standalone",
													"title":"jest-expect-standalone@24.0.2 / Tom Larkworthy | Observable",
													"url":"https://observablehq.com/@tomlarkworthy/jest-expect-standalone",
													"type":"dependency",
													"dependencies":[
														
													]
												},
												{
													"notebook":"@tomlarkworthy/view",
													"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
													"url":"https://observablehq.com/@tomlarkworthy/view",
													"type":"dependency",
													"ref":true,
													"dependencies":[
														
													]
												},
												{
													"notebook":"@tomlarkworthy/reversible-attachment",
													"title":"Reversible attachment / Tom Larkworthy | Observable",
													"url":"https://observablehq.com/@tomlarkworthy/reversible-attachment",
													"type":"dependency",
													"dependencies":[
														{
															"notebook":"@tomlarkworthy/view",
															"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
															"url":"https://observablehq.com/@tomlarkworthy/view",
															"type":"dependency",
															"ref":true,
															"dependencies":[
																
															]
														},
														{
															"notebook":"@tomlarkworthy/local-storage-view",
															"title":"localStorageView: Non-invasive local persistance / Tom Larkworthy | Observable",
															"url":"https://observablehq.com/@tomlarkworthy/local-storage-view",
															"type":"dependency",
															"dependencies":[
																
															]
														},
														{
															"notebook":"@tomlarkworthy/inspector",
															"title":"@observablehq/inspector@5.0.1 / Tom Larkworthy | Observable",
															"url":"https://observablehq.com/@tomlarkworthy/inspector",
															"type":"dependency",
															"dependencies":[
																
															]
														},
														{
															"notebook":"@tomlarkworthy/aws4fetch",
															"title":"aws4fetch / Tom Larkworthy | Observable",
															"url":"https://observablehq.com/@tomlarkworthy/aws4fetch",
															"type":"dependency",
															"dependencies":[
																
															]
														},
														{
															"notebook":"@tomlarkworthy/dom-view",
															"title":"DOM view / Tom Larkworthy | Observable",
															"url":"https://observablehq.com/@tomlarkworthy/dom-view",
															"type":"dependency",
															"dependencies":[
																
															]
														},
														{
															"notebook":"@tomlarkworthy/module-map",
															"title":"Module map / Tom Larkworthy | Observable",
															"url":"https://observablehq.com/@tomlarkworthy/module-map",
															"type":"dependency",
															"dependencies":[
																{
																	"notebook":"@tomlarkworthy/lopepage-urls",
																	"title":"lopepage urls / Tom Larkworthy | Observable",
																	"url":"https://observablehq.com/@tomlarkworthy/lopepage-urls",
																	"type":"dependency",
																	"dependencies":[
																		
																	]
																},
																{
																	"notebook":"@tomlarkworthy/flow-queue",
																	"title":"Convert cell computation to a Promise with cell flowQueue / Tom Larkworthy | Observable",
																	"url":"https://observablehq.com/@tomlarkworthy/flow-queue",
																	"type":"dependency",
																	"ref":true,
																	"dependencies":[
																		
																	]
																},
																{
																	"notebook":"@tomlarkworthy/observablejs-toolchain",
																	"title":"Bidirectional Observable JS <=> Runtime Toolchain / Tom Larkworthy | Observable",
																	"url":"https://observablehq.com/@tomlarkworthy/observablejs-toolchain",
																	"type":"dependency",
																	"ref":true,
																	"dependencies":[
																		
																	]
																},
																{
																	"notebook":"@tomlarkworthy/runtime-sdk",
																	"title":"Runtime SDK / Tom Larkworthy | Observable",
																	"url":"https://observablehq.com/@tomlarkworthy/runtime-sdk",
																	"type":"dependency",
																	"ref":true,
																	"dependencies":[
																		
																	]
																}
															]
														},
														{
															"notebook":"@tomlarkworthy/runtime-sdk",
															"title":"Runtime SDK / Tom Larkworthy | Observable",
															"url":"https://observablehq.com/@tomlarkworthy/runtime-sdk",
															"type":"dependency",
															"dependencies":[
																
															]
														},
														{
															"notebook":"@tomlarkworthy/jest-expect-standalone",
															"title":"jest-expect-standalone@24.0.2 / Tom Larkworthy | Observable",
															"url":"https://observablehq.com/@tomlarkworthy/jest-expect-standalone",
															"type":"dependency",
															"dependencies":[
																
															]
														}
													]
												}
											]
										}
									]
								}
							]
						},
						{
							"notebook":"@categorise/brand",
							"title":"Brand Colors / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/brand",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@categorise/substratum",
									"title":"Substratum / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/substratum",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/tachyons-and-some-extras",
							"title":"Tachyons CSS and some extras / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@nebrius/indented-toc",
									"title":"Indented ToC / Bryan Hughes | Observable",
									"url":"https://observablehq.com/@nebrius/indented-toc",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@categorise/substratum",
									"title":"Substratum / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/substratum",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/common-components",
							"title":"Survey Slate | Common Components / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/common-components",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@categorise/tachyons-and-some-extras",
									"title":"Tachyons CSS and some extras / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										{
											"notebook":"@nebrius/indented-toc",
											"title":"Indented ToC / Bryan Hughes | Observable",
											"url":"https://observablehq.com/@nebrius/indented-toc",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										},
										{
											"notebook":"@categorise/substratum",
											"title":"Substratum / categori.se | Observable",
											"url":"https://observablehq.com/@categorise/substratum",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@nebrius/indented-toc",
									"title":"Indented ToC / Bryan Hughes | Observable",
									"url":"https://observablehq.com/@nebrius/indented-toc",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@categorise/brand",
									"title":"Brand Colors / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/brand",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@saneef/feather-icons",
									"title":"Feather Icons / Saneef H. Ansari | Observable",
									"url":"https://observablehq.com/@saneef/feather-icons",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"featherIcons",
											"title":"featherIcons",
											"url":"",
											"type":"dependency",
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@categorise/substratum",
									"title":"Substratum / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/substratum",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						}
					]
				},
				{
					"notebook":"@categorise/substratum",
					"title":"Substratum / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/substratum",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						
					]
				}
			]
		},
		{
			"notebook":"@categorise/surveyslate-designer-tools",
			"title":"Survey Slate | Designer Tools",
			"url":"https://observablehq.com/@categorise/surveyslate-designer-tools?collection=@categorise/survey-slate",
			"type":"application",
			"dependencies":[
				{
					"notebook":"@categorise/survey-components",
					"title":"Survey Slate | Survey Components / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/survey-components",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@jashkenas/inputs",
							"title":"Inputs / Jeremy Ashkenas | Observable",
							"url":"https://observablehq.com/@jashkenas/inputs",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@tomlarkworthy/view",
							"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/view",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/exporter",
									"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/exporter",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@tomlarkworthy/viewroutine",
							"title":"Composing views across time: viewroutine / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/viewroutine",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/footer",
									"title":"Tom Services Footer / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/footer",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@nebrius/indented-toc",
							"title":"Indented ToC / Bryan Hughes | Observable",
							"url":"https://observablehq.com/@nebrius/indented-toc",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@mbostock/lazy-download",
							"title":"Lazy Download / Mike Bostock | Observable",
							"url":"https://observablehq.com/@mbostock/lazy-download",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/brand",
							"title":"Brand Colors / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/brand",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@categorise/substratum",
									"title":"Substratum / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/substratum",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/tachyons-and-some-extras",
							"title":"Tachyons CSS and some extras / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@nebrius/indented-toc",
									"title":"Indented ToC / Bryan Hughes | Observable",
									"url":"https://observablehq.com/@nebrius/indented-toc",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@categorise/substratum",
									"title":"Substratum / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/substratum",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/surveyslate-common-components",
							"title":"Survey Slate | Common Components / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/surveyslate-common-components",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@categorise/tachyons-and-some-extras",
									"title":"Tachyons CSS and some extras / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										{
											"notebook":"@nebrius/indented-toc",
											"title":"Indented ToC / Bryan Hughes | Observable",
											"url":"https://observablehq.com/@nebrius/indented-toc",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										},
										{
											"notebook":"@categorise/substratum",
											"title":"Substratum / categori.se | Observable",
											"url":"https://observablehq.com/@categorise/substratum",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@nebrius/indented-toc",
									"title":"Indented ToC / Bryan Hughes | Observable",
									"url":"https://observablehq.com/@nebrius/indented-toc",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@categorise/brand",
									"title":"Brand Colors / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/brand",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@saneef/feather-icons",
									"title":"Feather Icons / Saneef H. Ansari | Observable",
									"url":"https://observablehq.com/@saneef/feather-icons",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"featherIcons",
											"title":"featherIcons",
											"url":"",
											"type":"dependency",
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@categorise/substratum",
									"title":"Substratum / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/substratum",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@tomlarkworthy/testing",
							"title":"Reactive Unit Testing and Reporting Framework / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/testing",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/reconcile-nanomorph",
									"title":"Hypertext literal reconciliation with nanomorph / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/reconcile-nanomorph",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"morph",
											"title":"morph",
											"url":"",
											"type":"dependency",
											"dependencies":[
												
											]
										}
									]
								}
							]
						}
					]
				},
				{
					"notebook":"@bryangingechen/toc",
					"title":"TOC / Bryan Gin-ge Chen | Observable",
					"url":"https://observablehq.com/@bryangingechen/toc",
					"type":"dependency",
					"dependencies":[
						
					]
				},
				{
					"notebook":"@tomlarkworthy/view",
					"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/view",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/exporter",
							"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/exporter",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@tomlarkworthy/fileinput",
					"title":"Draggable LocalFile fileInput / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/fileinput",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@mbostock/localfile",
							"title":"LocalFile / Mike Bostock | Observable",
							"url":"https://observablehq.com/@mbostock/localfile",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@tomlarkworthy/view",
							"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/view",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/exporter",
									"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/exporter",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@tomlarkworthy/footer",
							"title":"Tom Services Footer / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/footer",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/exporter",
									"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/exporter",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						}
					]
				},
				{
					"notebook":"@tomlarkworthy/dataeditor",
					"title":"Data Editor / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/dataeditor",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/view",
							"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/view",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/exporter",
									"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/exporter",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@tomlarkworthy/footer",
							"title":"Tom Services Footer / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/footer",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/exporter",
									"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/exporter",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						}
					]
				},
				{
					"notebook":"@categorise/common-components",
					"title":"Survey Slate | Common Components / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/common-components",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@categorise/tachyons-and-some-extras",
							"title":"Tachyons CSS and some extras / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@nebrius/indented-toc",
							"title":"Indented ToC / Bryan Hughes | Observable",
							"url":"https://observablehq.com/@nebrius/indented-toc",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/brand",
							"title":"Brand Colors / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/brand",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@saneef/feather-icons",
							"title":"Feather Icons / Saneef H. Ansari | Observable",
							"url":"https://observablehq.com/@saneef/feather-icons",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								{
									"notebook":"featherIcons",
									"title":"featherIcons",
									"url":"",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/substratum",
					"title":"Substratum / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/substratum",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						
					]
				}
			]
		},
		{
			"notebook":"Common Components",
			"title":"GESI Survey | Common Components",
			"url":"https://observablehq.com/@categorise/surveyslate-common-components?collection=@categorise/survey-slate",
			"type":"application",
			"dependencies":[
				{
					"notebook":"@categorise/tachyons-and-some-extras",
					"title":"Tachyons CSS and some extras / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@nebrius/indented-toc",
							"title":"Indented ToC / Bryan Hughes | Observable",
							"url":"https://observablehq.com/@nebrius/indented-toc",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@nebrius/indented-toc",
					"title":"Indented ToC / Bryan Hughes | Observable",
					"url":"https://observablehq.com/@nebrius/indented-toc",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						
					]
				},
				{
					"notebook":"@categorise/brand",
					"title":"Brand Colors / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/brand",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@saneef/feather-icons",
					"title":"Feather Icons / Saneef H. Ansari | Observable",
					"url":"https://observablehq.com/@saneef/feather-icons",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"featherIcons",
							"title":"featherIcons",
							"url":"",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/substratum",
					"title":"Substratum / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/substratum",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						
					]
				}
			]
		},
		{
			"notebook":"@categorise/surveyslate-components",
			"title":"Survey Slate | Survey Components",
			"url":"https://observablehq.com/@categorise/surveyslate-components",
			"type":"application",
			"dependencies":[
				{
					"notebook":"@jashkenas/inputs",
					"title":"Inputs / Jeremy Ashkenas | Observable",
					"url":"https://observablehq.com/@jashkenas/inputs",
					"type":"dependency",
					"dependencies":[
						
					]
				},
				{
					"notebook":"@tomlarkworthy/view",
					"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/view",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/exporter",
							"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/exporter",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/flow-queue",
									"title":"Convert cell computation to a Promise with cell flowQueue / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/flow-queue",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@tomlarkworthy/cell-map",
									"title":"cellMap / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/cell-map",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"@jashkenas/url-querystrings-and-hash-parameters",
											"title":"URL querystrings and hash parameters / Jeremy Ashkenas | Observable",
											"url":"https://observablehq.com/@jashkenas/url-querystrings-and-hash-parameters",
											"type":"dependency",
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@tomlarkworthy/observablejs-toolchain",
									"title":"Bidirectional Observable JS <=> Runtime Toolchain / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/observablejs-toolchain",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"acorn-8.11.3.js.gz",
											"title":"acorn-8.11.3.js.gz",
											"url":"",
											"type":"dependency",
											"dependencies":[
												
											]
										},
										{
											"notebook":"@tomlarkworthy/jest-expect-standalone",
											"title":"jest-expect-standalone@24.0.2 / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/jest-expect-standalone",
											"type":"dependency",
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@tomlarkworthy/view",
									"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/view",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@tomlarkworthy/reversible-attachment",
									"title":"Reversible attachment / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/reversible-attachment",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"@tomlarkworthy/view",
											"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/view",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@tomlarkworthy/local-storage-view",
									"title":"localStorageView: Non-invasive local persistance / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/local-storage-view",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"@tomlarkworthy/inspector",
											"title":"@observablehq/inspector@5.0.1 / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/inspector",
											"type":"dependency",
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@tomlarkworthy/aws4fetch",
									"title":"aws4fetch / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/aws4fetch",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@tomlarkworthy/dom-view",
									"title":"DOM view / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/dom-view",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@tomlarkworthy/module-map",
									"title":"Module map / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/module-map",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"@tomlarkworthy/lopepage-urls",
											"title":"lopepage urls / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/lopepage-urls",
											"type":"dependency",
											"dependencies":[
												
											]
										},
										{
											"notebook":"@tomlarkworthy/flow-queue",
											"title":"Convert cell computation to a Promise with cell flowQueue / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/flow-queue",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										},
										{
											"notebook":"@tomlarkworthy/observablejs-toolchain",
											"title":"Bidirectional Observable JS <=> Runtime Toolchain / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/observablejs-toolchain",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										},
										{
											"notebook":"@tomlarkworthy/runtime-sdk",
											"title":"Runtime SDK / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/runtime-sdk",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@tomlarkworthy/runtime-sdk",
									"title":"Runtime SDK / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/runtime-sdk",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@tomlarkworthy/jest-expect-standalone",
									"title":"jest-expect-standalone@24.0.2 / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/jest-expect-standalone",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						}
					]
				},
				{
					"notebook":"@tomlarkworthy/viewroutine",
					"title":"Composing views across time: viewroutine / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/viewroutine",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/footer",
							"title":"Tom Services Footer / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/footer",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@nebrius/indented-toc",
					"title":"Indented ToC / Bryan Hughes | Observable",
					"url":"https://observablehq.com/@nebrius/indented-toc",
					"type":"dependency",
					"dependencies":[
						
					]
				},
				{
					"notebook":"@mbostock/lazy-download",
					"title":"Lazy Download / Mike Bostock | Observable",
					"url":"https://observablehq.com/@mbostock/lazy-download",
					"type":"dependency",
					"dependencies":[
						
					]
				},
				{
					"notebook":"@categorise/brand",
					"title":"Brand Colors / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/brand",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/tachyons-and-some-extras",
					"title":"Tachyons CSS and some extras / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@nebrius/indented-toc",
							"title":"Indented ToC / Bryan Hughes | Observable",
							"url":"https://observablehq.com/@nebrius/indented-toc",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/surveyslate-common-components",
					"title":"Survey Slate | Common Components / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/surveyslate-common-components",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@categorise/tachyons-and-some-extras",
							"title":"Tachyons CSS and some extras / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@nebrius/indented-toc",
							"title":"Indented ToC / Bryan Hughes | Observable",
							"url":"https://observablehq.com/@nebrius/indented-toc",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/brand",
							"title":"Brand Colors / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/brand",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@saneef/feather-icons",
							"title":"Feather Icons / Saneef H. Ansari | Observable",
							"url":"https://observablehq.com/@saneef/feather-icons",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"featherIcons",
									"title":"featherIcons",
									"url":"",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/substratum",
					"title":"Substratum / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/substratum",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						
					]
				},
				{
					"notebook":"@tomlarkworthy/testing",
					"title":"Reactive Unit Testing and Reporting Framework / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/testing",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/reconcile-nanomorph",
							"title":"Hypertext literal reconciliation with nanomorph / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/reconcile-nanomorph",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				}
			]
		},
		{
			"notebook":"@categorise/surveyslate-admin-ui",
			"title":"Survey Slate | Admin UI",
			"url":"https://observablehq.com/@categorise/surveyslate-admin-ui",
			"type":"application",
			"dependencies":[
				{
					"notebook":"@tomlarkworthy/view",
					"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/view",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/exporter",
							"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/exporter",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/brand",
					"title":"Brand Colors / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/brand",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/tachyons-and-some-extras",
					"title":"Tachyons CSS and some extras / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@nebrius/indented-toc",
							"title":"Indented ToC / Bryan Hughes | Observable",
							"url":"https://observablehq.com/@nebrius/indented-toc",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/gesi-survey-common-components",
					"title":"GESI Survey | Common Components / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/gesi-survey-common-components",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@categorise/tachyons-and-some-extras",
							"title":"Tachyons CSS and some extras / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@nebrius/indented-toc",
							"title":"Indented ToC / Bryan Hughes | Observable",
							"url":"https://observablehq.com/@nebrius/indented-toc",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/brand",
							"title":"Brand Colors / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/brand",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@saneef/feather-icons",
							"title":"Feather Icons / Saneef H. Ansari | Observable",
							"url":"https://observablehq.com/@saneef/feather-icons",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"feather-icons",
									"title":"feather-icons",
									"url":"",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/substratum",
					"title":"Substratum / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/substratum",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						
					]
				}
			]
		},
		{
			"notebook":"Designer UI",
			"title":"GESI Survey | Designer UI",
			"url":"https://observablehq.com/@adb/gesi-survey-designer-ui?collection=@adb/gesi-self-assessment",
			"type":"application",
			"dependencies":[
				{
					"notebook":"@tomlarkworthy/view",
					"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/view",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/exporter",
							"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/exporter",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@tomlarkworthy/juice",
					"title":"Squeezing more Juice out of UI libraries / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/juice",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/view",
							"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/view",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@tomlarkworthy/viewroutine",
							"title":"Composing views across time: viewroutine / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/viewroutine",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@nebrius/indented-toc",
					"title":"Indented ToC / Bryan Hughes | Observable",
					"url":"https://observablehq.com/@nebrius/indented-toc",
					"type":"dependency",
					"dependencies":[
						
					]
				},
				{
					"notebook":"@categorise/brand",
					"title":"Brand Colors / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/brand",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/tachyons-and-some-extras",
					"title":"Tachyons CSS and some extras / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@nebrius/indented-toc",
							"title":"Indented ToC / Bryan Hughes | Observable",
							"url":"https://observablehq.com/@nebrius/indented-toc",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/common-components",
					"title":"Survey Slate | Common Components / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/common-components",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@categorise/tachyons-and-some-extras",
							"title":"Tachyons CSS and some extras / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@nebrius/indented-toc",
							"title":"Indented ToC / Bryan Hughes | Observable",
							"url":"https://observablehq.com/@nebrius/indented-toc",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/brand",
							"title":"Brand Colors / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/brand",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								{
									"notebook":"@categorise/substratum",
									"title":"Substratum / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/substratum",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@saneef/feather-icons",
							"title":"Feather Icons / Saneef H. Ansari | Observable",
							"url":"https://observablehq.com/@saneef/feather-icons",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"feather-icons",
									"title":"feather-icons",
									"url":"",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/substratum",
					"title":"Substratum / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/substratum",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						
					]
				}
			]
		},
		{
			"notebook":"@categorise/surveyslate-filler",
			"title":"GESI Survey | Survey Filler UI",
			"url":"https://observablehq.com/@categorise/surveyslate-filler",
			"type":"application",
			"dependencies":[
				{
					"notebook":"jshashes",
					"title":"jshashes",
					"url":"",
					"type":"dependency",
					"dependencies":[
						
					]
				},
				{
					"notebook":"@tomlarkworthy/aws",
					"title":"AWS Helpers / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/aws",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/testing",
							"title":"Reactive Unit Testing and Reporting Framework / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/testing",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@tomlarkworthy/randomid",
							"title":"Secure random ID / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/randomid",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@endpointservices/resize",
							"title":"Resize FileAttachments on the fly with serverless-cells / Endpoint Services | Observable",
							"url":"https://observablehq.com/@endpointservices/resize",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@mbostock/safe-local-storage",
							"title":"Safe Local Storage / Mike Bostock | Observable",
							"url":"https://observablehq.com/@mbostock/safe-local-storage",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@mootari/signature",
							"title":"Signature - A Documentation Toolkit / Fabian Iwand | Observable",
							"url":"https://observablehq.com/@mootari/signature",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@endpointservices/notebook-secret",
					"title":"How to password protect a Notebook secret / Endpoint Services | Observable",
					"url":"https://observablehq.com/@endpointservices/notebook-secret",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@observablehq/htl",
							"title":"Hypertext Literal / Observable | Observable",
							"url":"https://observablehq.com/@observablehq/htl",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@observablehq/inputs",
							"title":"Observable Inputs | Observable documentation",
							"url":"https://observablehq.com/@observablehq/inputs",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@mbostock/pbcopy",
							"title":"Copier / Mike Bostock | Observable",
							"url":"https://observablehq.com/@mbostock/pbcopy",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@endpointservices/footer-with-backups",
							"title":"Endpoint Services Footer / Endpoint Services | Observable",
							"url":"https://observablehq.com/@endpointservices/footer-with-backups",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@endpointservices/sentry",
									"title":"Observablehq.com Notebook Monitoring with sentry.io / Endpoint Services | Observable",
									"url":"https://observablehq.com/@endpointservices/sentry",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@mbostock/safe-local-storage",
									"title":"Safe Local Storage / Mike Bostock | Observable",
									"url":"https://observablehq.com/@mbostock/safe-local-storage",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@tomlarkworthy/github-backups",
									"title":"Automatically Backup Observable notebooks to Github / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/github-backups",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						}
					]
				},
				{
					"notebook":"@tomlarkworthy/local-storage-view",
					"title":"localStorageView: Non-invasive local persistance / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/local-storage-view",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/inspector",
							"title":"@observablehq/inspector@5.0.1 / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/inspector",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@tomlarkworthy/view",
					"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/view",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/exporter",
							"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/exporter",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/surveyslate-components",
					"title":"Survey Slate | Survey Components / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/surveyslate-components",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@jashkenas/inputs",
							"title":"Inputs / Jeremy Ashkenas | Observable",
							"url":"https://observablehq.com/@jashkenas/inputs",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@tomlarkworthy/view",
							"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/view",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/exporter",
									"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/exporter",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@tomlarkworthy/viewroutine",
							"title":"Composing views across time: viewroutine / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/viewroutine",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/footer",
									"title":"Tom Services Footer / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/footer",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@nebrius/indented-toc",
							"title":"Indented ToC / Bryan Hughes | Observable",
							"url":"https://observablehq.com/@nebrius/indented-toc",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@mbostock/lazy-download",
							"title":"Lazy Download / Mike Bostock | Observable",
							"url":"https://observablehq.com/@mbostock/lazy-download",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/brand",
							"title":"Brand Colors / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/brand",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@categorise/substratum",
									"title":"Substratum / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/substratum",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/tachyons-and-some-extras",
							"title":"Tachyons CSS and some extras / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@nebrius/indented-toc",
									"title":"Indented ToC / Bryan Hughes | Observable",
									"url":"https://observablehq.com/@nebrius/indented-toc",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@categorise/substratum",
									"title":"Substratum / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/substratum",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/surveyslate-common-components",
							"title":"Survey Slate | Common Components / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/surveyslate-common-components",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@categorise/tachyons-and-some-extras",
									"title":"Tachyons CSS and some extras / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@nebrius/indented-toc",
									"title":"Indented ToC / Bryan Hughes | Observable",
									"url":"https://observablehq.com/@nebrius/indented-toc",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@categorise/brand",
									"title":"Brand Colors / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/brand",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@saneef/feather-icons",
									"title":"Feather Icons / Saneef H. Ansari | Observable",
									"url":"https://observablehq.com/@saneef/feather-icons",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"featherIcons",
											"title":"featherIcons",
											"url":"",
											"type":"dependency",
											"dependencies":[
												
											]
										}
									]
								}
							]
						},
						{
							"notebook":"@tomlarkworthy/testing",
							"title":"Reactive Unit Testing and Reporting Framework / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/testing",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/reconcile-nanomorph",
									"title":"Hypertext literal reconciliation with nanomorph / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/reconcile-nanomorph",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/surveyslate-styling",
					"title":"Survey Slate | Styling",
					"url":"https://observablehq.com/@categorise/surveyslate-styling",
					"type":"application",
					"dependencies":[
						{
							"notebook":"@categorise/surveyslate-designer-tools",
							"title":"Survey Slate | Designer Tools / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/surveyslate-designer-tools",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@categorise/survey-components",
									"title":"Survey Slate | Survey Components / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/survey-components",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@bryangingechen/toc",
									"title":"TOC / Bryan Gin-ge Chen | Observable",
									"url":"https://observablehq.com/@bryangingechen/toc",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@tomlarkworthy/view",
									"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/view",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@tomlarkworthy/fileinput",
									"title":"Draggable LocalFile fileInput / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/fileinput",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@tomlarkworthy/dataeditor",
									"title":"Data Editor / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/dataeditor",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@categorise/common-components",
									"title":"Survey Slate | Common Components / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/common-components",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@categorise/substratum",
									"title":"Substratum / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/substratum",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/survey-components",
							"title":"Survey Slate | Survey Components / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/survey-components",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@jashkenas/inputs",
									"title":"Inputs / Jeremy Ashkenas | Observable",
									"url":"https://observablehq.com/@jashkenas/inputs",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@tomlarkworthy/view",
									"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/view",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"@tomlarkworthy/exporter",
											"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/exporter",
											"type":"dependency",
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@tomlarkworthy/viewroutine",
									"title":"Composing views across time: viewroutine / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/viewroutine",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"@tomlarkworthy/footer",
											"title":"Tom Services Footer / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/footer",
											"type":"dependency",
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@nebrius/indented-toc",
									"title":"Indented ToC / Bryan Hughes | Observable",
									"url":"https://observablehq.com/@nebrius/indented-toc",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@mbostock/lazy-download",
									"title":"Lazy Download / Mike Bostock | Observable",
									"url":"https://observablehq.com/@mbostock/lazy-download",
									"type":"dependency",
									"dependencies":[
										
									]
								},
								{
									"notebook":"@categorise/brand",
									"title":"Brand Colors / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/brand",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"@categorise/substratum",
											"title":"Substratum / categori.se | Observable",
											"url":"https://observablehq.com/@categorise/substratum",
											"type":"dependency",
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@categorise/tachyons-and-some-extras",
									"title":"Tachyons CSS and some extras / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"@nebrius/indented-toc",
											"title":"Indented ToC / Bryan Hughes | Observable",
											"url":"https://observablehq.com/@nebrius/indented-toc",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										},
										{
											"notebook":"@categorise/substratum",
											"title":"Substratum / categori.se | Observable",
											"url":"https://observablehq.com/@categorise/substratum",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@categorise/surveyslate-common-components",
									"title":"Survey Slate | Common Components / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/surveyslate-common-components",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"@categorise/tachyons-and-some-extras",
											"title":"Tachyons CSS and some extras / categori.se | Observable",
											"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										},
										{
											"notebook":"@nebrius/indented-toc",
											"title":"Indented ToC / Bryan Hughes | Observable",
											"url":"https://observablehq.com/@nebrius/indented-toc",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										},
										{
											"notebook":"@categorise/brand",
											"title":"Brand Colors / categori.se | Observable",
											"url":"https://observablehq.com/@categorise/brand",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										},
										{
											"notebook":"@saneef/feather-icons",
											"title":"Feather Icons / Saneef H. Ansari | Observable",
											"url":"https://observablehq.com/@saneef/feather-icons",
											"type":"dependency",
											"dependencies":[
												{
													"notebook":"featherIcons",
													"title":"featherIcons",
													"url":"",
													"type":"dependency",
													"dependencies":[
														
													]
												}
											]
										},
										{
											"notebook":"@categorise/substratum",
											"title":"Substratum / categori.se | Observable",
											"url":"https://observablehq.com/@categorise/substratum",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@tomlarkworthy/testing",
									"title":"Reactive Unit Testing and Reporting Framework / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/testing",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"@tomlarkworthy/reconcile-nanomorph",
											"title":"Hypertext literal reconciliation with nanomorph / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/reconcile-nanomorph",
											"type":"dependency",
											"dependencies":[
												{
													"notebook":"morph",
													"title":"morph",
													"url":"",
													"type":"dependency",
													"dependencies":[
														
													]
												}
											]
										}
									]
								}
							]
						},
						{
							"notebook":"@jashkenas/inputs",
							"title":"Inputs / Jeremy Ashkenas | Observable",
							"url":"https://observablehq.com/@jashkenas/inputs",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@tomlarkworthy/view",
							"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/view",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/exporter",
									"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/exporter",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/brand",
							"title":"Brand Colors / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/brand",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/tachyons-and-some-extras",
							"title":"Tachyons CSS and some extras / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/common-components",
							"title":"Survey Slate | Common Components / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/common-components",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"@categorise/tachyons-and-some-extras",
									"title":"Tachyons CSS and some extras / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@nebrius/indented-toc",
									"title":"Indented ToC / Bryan Hughes | Observable",
									"url":"https://observablehq.com/@nebrius/indented-toc",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@categorise/brand",
									"title":"Brand Colors / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/brand",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@saneef/feather-icons",
									"title":"Feather Icons / Saneef H. Ansari | Observable",
									"url":"https://observablehq.com/@saneef/feather-icons",
									"type":"dependency",
									"dependencies":[
										{
											"notebook":"featherIcons",
											"title":"featherIcons",
											"url":"",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@categorise/substratum",
									"title":"Substratum / categori.se | Observable",
									"url":"https://observablehq.com/@categorise/substratum",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										{
											"notebook":"@tomlarkworthy/view",
											"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/view",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										}
									]
								}
							]
						},
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/exporter",
									"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/exporter",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										{
											"notebook":"@tomlarkworthy/juice",
											"title":"Squeezing more Juice out of UI libraries / Tom Larkworthy | Observable",
											"url":"https://observablehq.com/@tomlarkworthy/juice",
											"type":"dependency",
											"dependencies":[
												
											]
										}
									]
								},
								{
									"notebook":"@tomlarkworthy/view",
									"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/view",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								},
								{
									"notebook":"@tomlarkworthy/viewroutine",
									"title":"Composing views across time: viewroutine / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/viewroutine",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										{
											"notebook":"@nebrius/indented-toc",
											"title":"Indented ToC / Bryan Hughes | Observable",
											"url":"https://observablehq.com/@nebrius/indented-toc",
											"type":"dependency",
											"ref":true,
											"dependencies":[
												
											]
										}
									]
								}
							]
						}
					]
				},
				{
					"notebook":"@tomlarkworthy/url-query-field-view",
					"title":"url-query-field-view",
					"url":"",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@observablehq/inspector",
							"title":"Observable Inspector",
							"url":"",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@endpointservices/endpoint-services-footer",
							"title":"Endpoint Services Footer / Endpoint Services | Observable",
							"url":"https://observablehq.com/@endpointservices/endpoint-services-footer",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				}
			]
		},
		{
			"notebook":"Common Components",
			"title":"GESI Survey | Common Components",
			"url":"https://observablehq.com/@categorise/surveyslate-common-components?collection=@categorise/survey-slate",
			"type":"application",
			"dependencies":[
				{
					"notebook":"@categorise/tachyons-and-some-extras",
					"title":"Tachyons CSS and some extras / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@nebrius/indented-toc",
							"title":"Indented ToC / Bryan Hughes | Observable",
							"url":"https://observablehq.com/@nebrius/indented-toc",
							"type":"dependency",
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@nebrius/indented-toc",
					"title":"Indented ToC / Bryan Hughes | Observable",
					"url":"https://observablehq.com/@nebrius/indented-toc",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						
					]
				},
				{
					"notebook":"@categorise/brand",
					"title":"Brand Colors / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/brand",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@saneef/feather-icons",
					"title":"Feather Icons / Saneef H. Ansari | Observable",
					"url":"https://observablehq.com/@saneef/feather-icons",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"featherIcons",
							"title":"featherIcons",
							"url":"",
							"type":"dependency",
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/substratum",
					"title":"Substratum / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/substratum",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						
					]
				}
			]
		},
		{
			"notebook":"Styling",
			"title":"Survey Slate | Styling",
			"url":"https://observablehq.com/@categorise/surveyslate-styling",
			"type":"application",
			"dependencies":[
				{
					"notebook":"@jashkenas/inputs",
					"title":"Inputs / Jeremy Ashkenas | Observable",
					"url":"https://observablehq.com/@jashkenas/inputs",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						
					]
				},
				{
					"notebook":"@tomlarkworthy/view",
					"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
					"url":"https://observablehq.com/@tomlarkworthy/view",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/exporter",
							"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/exporter",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						}
					]
				},
				{
					"notebook":"@categorise/brand",
					"title":"Brand Colors / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/brand",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						
					]
				},
				{
					"notebook":"@categorise/tachyons-and-some-extras",
					"title":"Tachyons CSS and some extras / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						
					]
				},
				{
					"notebook":"@categorise/common-components",
					"title":"Survey Slate | Common Components / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/common-components",
					"type":"dependency",
					"dependencies":[
						{
							"notebook":"@categorise/tachyons-and-some-extras",
							"title":"Tachyons CSS and some extras / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/tachyons-and-some-extras",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@nebrius/indented-toc",
							"title":"Indented ToC / Bryan Hughes | Observable",
							"url":"https://observablehq.com/@nebrius/indented-toc",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@categorise/brand",
							"title":"Brand Colors / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/brand",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@saneef/feather-icons",
							"title":"Feather Icons / Saneef H. Ansari | Observable",
							"url":"https://observablehq.com/@saneef/feather-icons",
							"type":"dependency",
							"dependencies":[
								{
									"notebook":"featherIcons",
									"title":"featherIcons",
									"url":"",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@categorise/substratum",
							"title":"Substratum / categori.se | Observable",
							"url":"https://observablehq.com/@categorise/substratum",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/view",
									"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/view",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						}
					]
				},
				{
					"notebook":"@categorise/substratum",
					"title":"Substratum / categori.se | Observable",
					"url":"https://observablehq.com/@categorise/substratum",
					"type":"dependency",
					"ref":true,
					"dependencies":[
						{
							"notebook":"@tomlarkworthy/exporter",
							"title":"Exporter: Single File Serializer / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/exporter",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								{
									"notebook":"@tomlarkworthy/juice",
									"title":"Squeezing more Juice out of UI libraries / Tom Larkworthy | Observable",
									"url":"https://observablehq.com/@tomlarkworthy/juice",
									"type":"dependency",
									"dependencies":[
										
									]
								}
							]
						},
						{
							"notebook":"@tomlarkworthy/view",
							"title":"Composing viewofs with the view literal / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/view",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								
							]
						},
						{
							"notebook":"@tomlarkworthy/viewroutine",
							"title":"Composing views across time: viewroutine / Tom Larkworthy | Observable",
							"url":"https://observablehq.com/@tomlarkworthy/viewroutine",
							"type":"dependency",
							"ref":true,
							"dependencies":[
								{
									"notebook":"@nebrius/indented-toc",
									"title":"Indented ToC / Bryan Hughes | Observable",
									"url":"https://observablehq.com/@nebrius/indented-toc",
									"type":"dependency",
									"ref":true,
									"dependencies":[
										
									]
								}
							]
						}
					]
				}
			]
		}
	]
});
display(surveyslate_dependency_map)
```




```js
const treeText_admin = `Admin Tools
  jshashes
  @tomlarkworthy/aws
   @tomlarkworthy/testing
   @tomlarkworthy/randomid
   @endpointservices/resize
   @mbostock/safe-local-storage
   @mootari/signature
  @bryangingechen/toc
  @endpointservices/notebook-secret
   @observablehq/htl
   @observablehq/inputs
   @mbostock/pbcopy
   @endpointservices/footer-with-backups
    @endpointservices/sentry
    @mbostock/safe-local-storage
   @tomlarkworthy/github-backups
  @tomlarkworthy/randomid
  @tomlarkworthy/local-storage-view
   @tomlarkworthy/inspector
  @categorise/gesi-styling
   @jashkenas/inputs
   @tomlarkworthy/view
    @tomlarkworthy/exporter
     @tomlarkworthy/flow-queue
     @tomlarkworthy/cell-map
      @jashkenas/url-querystrings-and-hash-parameters
     @tomlarkworthy/observablejs-toolchain
      acorn-8.11.3.js.gz
      @tomlarkworthy/jest-expect-standalone
      @tomlarkworthy/view
       @tomlarkworthy/exporter***[circular?]
      @tomlarkworthy/reversible-attachment
       @tomlarkworthy/view
       @tomlarkworthy/local-storage-view
       @tomlarkworthy/inspector
       @tomlarkworthy/aws4fetch
       @tomlarkworthy/dom-view
       @tomlarkworthy/module-map
        @tomlarkworthy/lopepage-urls***
        @tomlarkworthy/flow-queue***
        @tomlarkworthy/observablejs-toolchain***
        @tomlarkworthy/runtime-sdk***
       @tomlarkworthy/runtime-sdk
       @tomlarkworthy/jest-expect-standalone
   @categorise/brand
   @categorise/tachyons-and-some-extras
    @nebrius/indented-toc
    @categorise/substratum
   @categorise/common-components
    @categorise/tachyons-and-some-extras
      @nebrius/indented-toc
      @categorise/substratum
    @nebrius/indented-toc
    @categorise/brand
    @saneef/feather-icons
      featherIcons
    @categorise/substratum
  @categorise/substratum
`
```


```js
display(Tree({ data: parseIndentedTree(treeText_designer)}))
```


```js
const treeText_designer = `Designer Tools
  @categorise/survey-components
    @jashkenas/inputs
    @tomlarkworthy/view
      @tomlarkworthy/exporter**
    @tomlarkworthy/viewroutine
      @tomlarkworthy/footer**
    @nebrius/indented-toc
    @mbostock/lazy-download
    @categorise/brand
      @categorise/substratum
    @categorise/tachyons-and-some-extras
      @nebrius/indented-toc
      @categorise/substratum
    @categorise/surveyslate-common-components**
      @categorise/tachyons-and-some-extras
        @nebrius/indented-toc
        @categorise/substratum
      @nebrius/indented-toc
      @categorise/brand
      @saneef/feather-icons
       featherIcons
      @categorise/substratum
    @tomlarkworthy/testing
      @tomlarkworthy/reconcile-nanomorph
        morph
  @bryangingechen/toc
  @tomlarkworthy/view
    @tomlarkworthy/exporter**
  @tomlarkworthy/fileinput
    @mbostock/localfile
    @tomlarkworthy/view
      @tomlarkworthy/exporter**
    @tomlarkworthy/footer**
      @tomlarkworthy/exporter**
  @tomlarkworthy/dataeditor
    @tomlarkworthy/view
      @tomlarkworthy/exporter**
    @tomlarkworthy/footer
      @tomlarkworthy/exporter**
  @categorise/common-components
    @categorise/tachyons-and-some-extras
    @nebrius/indented-toc
    @categorise/brand
    @saneef/feather-icons
      featherIcons
    @categorise/substratum
  @categorise/substratum
`
```


```js
display(Tree({ data: parseIndentedTree(treeText_filler)}))
```


```js
const treeText_filler = `GESI Survey | Survey Filler
  jshashes
  @tomlarkworthy/aws
   @tomlarkworthy/testing
   @tomlarkworthy/randomid
   @endpointservices/resize
   @mbostock/safe-local-storage
   @mootari/signature
  @endpointservices/notebook-secret
    @observablehq/htl
    @observablehq/inputs
    @mbostock/pbcopy
    @endpointservices/footer-with-backups
     @endpointservices/sentry
     @mbostock/safe-local-storage
     @tomlarkworthy/github-backups
  @tomlarkworthy/local-storage-view
   @tomlarkworthy/inspector
  @tomlarkworthy/view
   @tomlarkworthy/exporter**
  @categorise/surveyslate-components
   @jashkenas/inputs
   @tomlarkworthy/view
    @tomlarkworthy/exporter**
   @tomlarkworthy/viewroutine
    @tomlarkworthy/footer**
   @nebrius/indented-toc
   @mbostock/lazy-download
   @categorise/brand
    @categorise/substratum
   @categorise/tachyons-and-some-extras
    @nebrius/indented-toc
    @categorise/substratum
   @categorise/surveyslate-common-components**
    @categorise/tachyons-and-some-extras
    @nebrius/indented-toc
    @categorise/brand
    @saneef/feather-icons
     featherIcons
   @tomlarkworthy/testing
    @tomlarkworthy/reconcile-nanomorph
   @categorise/substratum
  @tomlarkworthy/url-query-field-view
   @observablehq/inspector
   @endpointservices/endpoint-services-footer**
`
```

```js
const treeText_common = `Common Components
  @categorise/tachyons-and-some-extras
    @nebrius/indented-toc
    @categorise/substratum
  @categorise/brand
    @categorise/substratum
  @categorise/substratum
  @nebrius/indented-toc
  @saneef/feather-icons
    featherIcons
`
```

```js
const treeText_survey_components = `Survey Components
  @jashkenas/inputs
  @tomlarkworthy/view
    @tomlarkworthy/exporter
      @tomlarkworthy/flow-queue
      @tomlarkworthy/cell-map
        @jashkenas/url-querystrings-and-hash-parameters
      @tomlarkworthy/observablejs-toolchain
        acorn-8.11.3.js.gz
        @tomlarkworthy/jest-expect-standalone
      @tomlarkworthy/view
        @tomlarkworthy/exporter***[circular?]
      @tomlarkworthy/reversible-attachment
        @tomlarkworthy/view
      @tomlarkworthy/local-storage-view
        @tomlarkworthy/inspector
      @tomlarkworthy/aws4fetch
      @tomlarkworthy/dom-view
      @tomlarkworthy/module-map
        @tomlarkworthy/lopepage-urls***
        @tomlarkworthy/flow-queue***
        @tomlarkworthy/observablejs-toolchain***
        @tomlarkworthy/runtime-sdk***
      @tomlarkworthy/runtime-sdk
      @tomlarkworthy/jest-expect-standalone
  @tomlarkworthy/viewroutine
    @tomlarkworthy/footer
  @nebrius/indented-toc
  @mbostock/lazy-download
  @categorise/brand
    @categorise/substratum
  @categorise/tachyons-and-some-extras
    @nebrius/indented-toc
    @categorise/substratum
  @categorise/surveyslate-common-components
    @categorise/tachyons-and-some-extras
    @nebrius/indented-toc
    @categorise/brand
    @saneef/feather-icons
     featherIcons
    @categorise/substratum
  @categorise/substratum
  @tomlarkworthy/testing
    @tomlarkworthy/reconcile-nanomorph
`
```

```js
const treeText_admin_ui = `Admin UI
  @tomlarkworthy/view
    @tomlarkworthy/exporter**
  @categorise/brand
    @categorise/substratum
  @categorise/tachyons-and-some-extras
    @nebrius/indented-toc
    @categorise/substratum
  @categorise/gesi-survey-common-components
    @categorise/tachyons-and-some-extras
      @nebrius/indented-toc
      @categorise/substratum
    @nebrius/indented-toc
    @categorise/brand
      @categorise/substratum
    @saneef/feather-icons
      feather-icons
    @categorise/substratum
  @categorise/substratum
`
```

```js
const treeText_styling = `Styling
  @categorise/surveyslate-designer-tools**
    @categorise/survey-components
    @bryangingechen/toc
    @tomlarkworthy/view
    @tomlarkworthy/fileinput
    @tomlarkworthy/dataeditor
    @categorise/common-components
    @categorise/substratum
  @categorise/survey-components
    @jashkenas/inputs
    @tomlarkworthy/view
      @tomlarkworthy/exporter**
    @tomlarkworthy/viewroutine
      @tomlarkworthy/footer**
    @nebrius/indented-toc
    @mbostock/lazy-download
    @categorise/brand
      @categorise/substratum
    @categorise/tachyons-and-some-extras
      @nebrius/indented-toc
      @categorise/substratum
    @categorise/surveyslate-common-components**
      @categorise/tachyons-and-some-extras
        @nebrius/indented-toc
        @categorise/substratum
      @nebrius/indented-toc
      @categorise/brand
      @saneef/feather-icons
       featherIcons
      @categorise/substratum
    @tomlarkworthy/testing
      @tomlarkworthy/reconcile-nanomorph
        morph
  @jashkenas/inputs
  @tomlarkworthy/view
    @tomlarkworthy/exporter**
  @categorise/brand
    @categorise/substratum
  @categorise/tachyons-and-some-extras
    @nebrius/indented-toc
    @categorise/substratum
  @categorise/common-components
    @categorise/tachyons-and-some-extras
      @nebrius/indented-toc
      @categorise/substratum
    @nebrius/indented-toc
    @categorise/brand
      @categorise/substratum
    @saneef/feather-icons
      feather-icons
    @categorise/substratum
  @categorise/substratum
  `
```

```js
const treeText_designer_ui = `Designer UI
    @tomlarkworthy/view
			@tomlarkworthy/exporter**
    @tomlarkworthy/juice
			@tomlarkworthy/view
			@tomlarkworthy/viewroutine
    @nebrius/indented-toc
		@categorise/brand
			@categorise/substratum
		@categorise/tachyons-and-some-extras
			@nebrius/indented-toc
			@categorise/substratum
		@categorise/common-components
			@categorise/tachyons-and-some-extras
				@nebrius/indented-toc
				@categorise/substratum
			@nebrius/indented-toc
			@categorise/brand
				@categorise/substratum
			@saneef/feather-icons
				feather-icons
			@categorise/substratum
		@categorise/substratum
`
```

<!--
Check if below is missing fetchp
-->

```js
const treeText_filler_ui = `	Survey Filler UI
  		@endpointservices/notebook-secret
  			@observablehq/htl
  			@observablehq/inputs
  			@mbostock/pbcopy
  			@endpointservices/footer-with-backups
  				@endpointservices/sentry
  				@mbostock/safe-local-storage
  				@tomlarkworthy/github-backups
			@tomlarkworthy/local-storage-view
				@tomlarkworthy/inspector
			@tomlarkworthy/view
				@tomlarkworthy/exporter**
		@categorise/survey-components
			@jashkenas/inputs
			@tomlarkworthy/view
				@tomlarkworthy/exporter**
			@tomlarkworthy/viewroutine
				@tomlarkworthy/footer**
			@nebrius/indented-toc
			@mbostock/lazy-download
			@categorise/brand
				@categorise/substratum
			@categorise/tachyons-and-some-extras
				@nebrius/indented-toc
				@categorise/substratum
			@categorise/surveyslate-common-components**
				@categorise/tachyons-and-some-extras
					@nebrius/indented-toc
					@categorise/substratum
				@nebrius/indented-toc
				@categorise/brand
				@saneef/feather-icons
					featherIcons
				@categorise/substratum
			@tomlarkworthy/testing
				@tomlarkworthy/reconcile-nanomorph
					morph
		@categorise/gesi-styling
			@jashkenas/inputs
			@tomlarkworthy/view
				@tomlarkworthy/exporter
					@tomlarkworthy/flow-queue
					@tomlarkworthy/cell-map
						@jashkenas/url-querystrings-and-hash-parameters
					@tomlarkworthy/observablejs-toolchain
						acorn-8.11.3.js.gz
						@tomlarkworthy/jest-expect-standalone
						@tomlarkworthy/view
							@tomlarkworthy/exporter***[circular?]
						@tomlarkworthy/reversible-attachment
							@tomlarkworthy/view
							@tomlarkworthy/local-storage-view
							@tomlarkworthy/inspector
							@tomlarkworthy/aws4fetch
							@tomlarkworthy/dom-view
							@tomlarkworthy/module-map
								@tomlarkworthy/lopepage-urls***
								@tomlarkworthy/flow-queue***
								@tomlarkworthy/observablejs-toolchain***
								@tomlarkworthy/runtime-sdk***
							@tomlarkworthy/runtime-sdk
							@tomlarkworthy/jest-expect-standalone
		@categorise/substratum
`
```


```js
const treeText = `Survey Slate
	Technical Overview
		@categorise/substratum

	Configuration

	Admin Tools
		jshashes
		@tomlarkworthy/aws
			@tomlarkworthy/testing
			@tomlarkworthy/randomid
			@endpointservices/resize
			@mbostock/safe-local-storage
			@mootari/signature
		@bryangingechen/toc
		@endpointservices/notebook-secret
			@observablehq/htl
			@observablehq/inputs
			@mbostock/pbcopy
			@endpointservices/footer-with-backups
				@endpointservices/sentry
				@mbostock/safe-local-storage
			@tomlarkworthy/github-backups
		@tomlarkworthy/randomid
		@tomlarkworthy/local-storage-view
			@tomlarkworthy/inspector
		@categorise/gesi-styling
			@jashkenas/inputs
			@tomlarkworthy/view
				@tomlarkworthy/exporter
					@tomlarkworthy/flow-queue
					@tomlarkworthy/cell-map
						@jashkenas/url-querystrings-and-hash-parameters
					@tomlarkworthy/observablejs-toolchain
						acorn-8.11.3.js.gz
						@tomlarkworthy/jest-expect-standalone
						@tomlarkworthy/view
							@tomlarkworthy/exporter***[circular?]
						@tomlarkworthy/reversible-attachment
							@tomlarkworthy/view
							@tomlarkworthy/local-storage-view
							@tomlarkworthy/inspector
							@tomlarkworthy/aws4fetch
							@tomlarkworthy/dom-view
							@tomlarkworthy/module-map
								@tomlarkworthy/lopepage-urls***
								@tomlarkworthy/flow-queue***
								@tomlarkworthy/observablejs-toolchain***
								@tomlarkworthy/runtime-sdk***
							@tomlarkworthy/runtime-sdk
							@tomlarkworthy/jest-expect-standalone
		  @categorise/brand
		  @categorise/tachyons-and-some-extras
			 @nebrius/indented-toc
			 @categorise/substratum
		  @categorise/common-components
			 @categorise/tachyons-and-some-extras
				@nebrius/indented-toc
				@categorise/substratum
			@nebrius/indented-toc
			@categorise/brand
			@saneef/feather-icons
				featherIcons
			@categorise/substratum
		@categorise/substratum

	Designer Tools
		@categorise/survey-components
			@jashkenas/inputs
			@tomlarkworthy/view
				@tomlarkworthy/exporter**
			@tomlarkworthy/viewroutine
				@tomlarkworthy/footer**
			@nebrius/indented-toc
			@mbostock/lazy-download
			@categorise/brand
				@categorise/substratum
			@categorise/tachyons-and-some-extras
				@nebrius/indented-toc
				@categorise/substratum
			@categorise/surveyslate-common-components**
				@categorise/tachyons-and-some-extras
					@nebrius/indented-toc
					@categorise/substratum
				@nebrius/indented-toc
				@categorise/brand
				@saneef/feather-icons
					featherIcons
				@categorise/substratum
			@tomlarkworthy/testing
				@tomlarkworthy/reconcile-nanomorph
					morph
		@bryangingechen/toc
		@tomlarkworthy/view
			@tomlarkworthy/exporter**
		@tomlarkworthy/fileinput
			@mbostock/localfile
			@tomlarkworthy/view
				@tomlarkworthy/exporter**
			@tomlarkworthy/footer**
				@tomlarkworthy/exporter**
		@tomlarkworthy/dataeditor
			@tomlarkworthy/view
				@tomlarkworthy/exporter**
			@tomlarkworthy/footer
				@tomlarkworthy/exporter**
		@categorise/common-components
			@categorise/tachyons-and-some-extras
			@nebrius/indented-toc
			@categorise/brand
			@saneef/feather-icons
				featherIcons
			@categorise/substratum
		@categorise/substratum

	GESI Survey | Survey Filler
		jshashes
		@tomlarkworthy/aws
			@tomlarkworthy/testing
			@tomlarkworthy/randomid
			@endpointservices/resize
			@mbostock/safe-local-storage
			@mootari/signature
		@endpointservices/notebook-secret
			@observablehq/htl
			@observablehq/inputs
			@mbostock/pbcopy
			@endpointservices/footer-with-backups
				@endpointservices/sentry
				@mbostock/safe-local-storage
				@tomlarkworthy/github-backups
		@tomlarkworthy/local-storage-view
			@tomlarkworthy/inspector
		@tomlarkworthy/view
			@tomlarkworthy/exporter**
		@categorise/surveyslate-components
			@jashkenas/inputs
			@tomlarkworthy/view
				@tomlarkworthy/exporter**
			@tomlarkworthy/viewroutine
				@tomlarkworthy/footer**
			@nebrius/indented-toc
			@mbostock/lazy-download
			@categorise/brand
				@categorise/substratum
			@categorise/tachyons-and-some-extras
				@nebrius/indented-toc
				@categorise/substratum
			@categorise/surveyslate-common-components**
				@categorise/tachyons-and-some-extras
				@nebrius/indented-toc
				@categorise/brand
				@saneef/feather-icons
					featherIcons
			@tomlarkworthy/testing
				@tomlarkworthy/reconcile-nanomorph
			@categorise/substratum
		@tomlarkworthy/url-query-field-view
			@observablehq/inspector
			@endpointservices/endpoint-services-footer**

	Common Components
		@categorise/tachyons-and-some-extras
			@nebrius/indented-toc
			@categorise/substratum
		@categorise/brand
			@categorise/substratum
		@categorise/substratum
		@nebrius/indented-toc
		@saneef/feather-icons
			featherIcons

	Survey Components
		@jashkenas/inputs
		@tomlarkworthy/view
			@tomlarkworthy/exporter
				@tomlarkworthy/flow-queue
				@tomlarkworthy/cell-map
					@jashkenas/url-querystrings-and-hash-parameters
				@tomlarkworthy/observablejs-toolchain
					acorn-8.11.3.js.gz
					@tomlarkworthy/jest-expect-standalone
				@tomlarkworthy/view
					@tomlarkworthy/exporter***[circular?]
				@tomlarkworthy/reversible-attachment
					@tomlarkworthy/view
				@tomlarkworthy/local-storage-view
					@tomlarkworthy/inspector
				@tomlarkworthy/aws4fetch
				@tomlarkworthy/dom-view
				@tomlarkworthy/module-map
					@tomlarkworthy/lopepage-urls***
					@tomlarkworthy/flow-queue***
					@tomlarkworthy/observablejs-toolchain***
					@tomlarkworthy/runtime-sdk***
				@tomlarkworthy/runtime-sdk
				@tomlarkworthy/jest-expect-standalone
		@tomlarkworthy/viewroutine
			@tomlarkworthy/footer
		@nebrius/indented-toc
		@mbostock/lazy-download
		@categorise/brand
			@categorise/substratum
		@categorise/tachyons-and-some-extras
			@nebrius/indented-toc
			@categorise/substratum
		@categorise/surveyslate-common-components
			@categorise/tachyons-and-some-extras
			@nebrius/indented-toc
			@categorise/brand
			@saneef/feather-icons
				featherIcons
			@categorise/substratum
		@categorise/substratum
		@tomlarkworthy/testing
			@tomlarkworthy/reconcile-nanomorph

	Admin UI
		@tomlarkworthy/view
			@tomlarkworthy/exporter**
		@categorise/brand
			@categorise/substratum
		@categorise/tachyons-and-some-extras
			@nebrius/indented-toc
			@categorise/substratum
		@categorise/gesi-survey-common-components
			@categorise/tachyons-and-some-extras
				@nebrius/indented-toc
				@categorise/substratum
			@nebrius/indented-toc
			@categorise/brand
				@categorise/substratum
			@saneef/feather-icons
				feather-icons
			@categorise/substratum
		@categorise/substratum

	Styling
		@categorise/surveyslate-designer-tools**
			@categorise/survey-components
			@bryangingechen/toc
			@tomlarkworthy/view
			@tomlarkworthy/fileinput
			@tomlarkworthy/dataeditor
			@categorise/common-components
			@categorise/substratum
		@categorise/survey-components
			@jashkenas/inputs
			@tomlarkworthy/view
				@tomlarkworthy/exporter**
			@tomlarkworthy/viewroutine
				@tomlarkworthy/footer**
			@nebrius/indented-toc
			@mbostock/lazy-download
			@categorise/brand
				@categorise/substratum
			@categorise/tachyons-and-some-extras
				@nebrius/indented-toc
				@categorise/substratum
			@categorise/surveyslate-common-components**
				@categorise/tachyons-and-some-extras
					@nebrius/indented-toc
					@categorise/substratum
				@nebrius/indented-toc
				@categorise/brand
				@saneef/feather-icons
					featherIcons
				@categorise/substratum
			@tomlarkworthy/testing
				@tomlarkworthy/reconcile-nanomorph
					morph
		@jashkenas/inputs
		@tomlarkworthy/view
			@tomlarkworthy/exporter**
		@categorise/brand
			@categorise/substratum
		@categorise/tachyons-and-some-extras
			@nebrius/indented-toc
			@categorise/substratum
		@categorise/common-components
			@categorise/tachyons-and-some-extras
				@nebrius/indented-toc
				@categorise/substratum
			@nebrius/indented-toc
			@categorise/brand
				@categorise/substratum
			@saneef/feather-icons
				feather-icons
			@categorise/substratum
		@categorise/substratum

	Designer UI
    @tomlarkworthy/view
			@tomlarkworthy/exporter**
    @tomlarkworthy/juice
			@tomlarkworthy/view
			@tomlarkworthy/viewroutine
    @nebrius/indented-toc
		@categorise/brand
			@categorise/substratum
		@categorise/tachyons-and-some-extras
			@nebrius/indented-toc
			@categorise/substratum
		@categorise/common-components
			@categorise/tachyons-and-some-extras
				@nebrius/indented-toc
				@categorise/substratum
			@nebrius/indented-toc
			@categorise/brand
				@categorise/substratum
			@saneef/feather-icons
				feather-icons
			@categorise/substratum
		@categorise/substratum

	Survey Filler UI
  		@endpointservices/notebook-secret
  			@observablehq/htl
  			@observablehq/inputs
  			@mbostock/pbcopy
  			@endpointservices/footer-with-backups
  				@endpointservices/sentry
  				@mbostock/safe-local-storage
  				@tomlarkworthy/github-backups
			@tomlarkworthy/local-storage-view
				@tomlarkworthy/inspector
			@tomlarkworthy/view
				@tomlarkworthy/exporter**
		@categorise/survey-components
			@jashkenas/inputs
			@tomlarkworthy/view
				@tomlarkworthy/exporter**
			@tomlarkworthy/viewroutine
				@tomlarkworthy/footer**
			@nebrius/indented-toc
			@mbostock/lazy-download
			@categorise/brand
				@categorise/substratum
			@categorise/tachyons-and-some-extras
				@nebrius/indented-toc
				@categorise/substratum
			@categorise/surveyslate-common-components**
				@categorise/tachyons-and-some-extras
					@nebrius/indented-toc
					@categorise/substratum
				@nebrius/indented-toc
				@categorise/brand
				@saneef/feather-icons
					featherIcons
				@categorise/substratum
			@tomlarkworthy/testing
				@tomlarkworthy/reconcile-nanomorph
					morph
		@categorise/gesi-styling
			@jashkenas/inputs
			@tomlarkworthy/view
				@tomlarkworthy/exporter
					@tomlarkworthy/flow-queue
					@tomlarkworthy/cell-map
						@jashkenas/url-querystrings-and-hash-parameters
					@tomlarkworthy/observablejs-toolchain
						acorn-8.11.3.js.gz
						@tomlarkworthy/jest-expect-standalone
						@tomlarkworthy/view
							@tomlarkworthy/exporter***[circular?]
						@tomlarkworthy/reversible-attachment
							@tomlarkworthy/view
							@tomlarkworthy/local-storage-view
							@tomlarkworthy/inspector
							@tomlarkworthy/aws4fetch
							@tomlarkworthy/dom-view
							@tomlarkworthy/module-map
								@tomlarkworthy/lopepage-urls***
								@tomlarkworthy/flow-queue***
								@tomlarkworthy/observablejs-toolchain***
								@tomlarkworthy/runtime-sdk***
							@tomlarkworthy/runtime-sdk
							@tomlarkworthy/jest-expect-standalone
		@categorise/substratum
`
```
