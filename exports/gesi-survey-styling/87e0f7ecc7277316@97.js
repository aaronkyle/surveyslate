// https://observablehq.com/@saneef/feather-icons@97
function _1(md){return(
md`# Feather Icons

[Feather Icons](https://feathericons.com/) is a open source collection of SVG icons.`
)}

function _2(md,getIconSvg){return(
md`## Usage

### 1. Import
~~~js
     import {getIconSvg} from '@saneef/feather-icons'
~~~

### 2. Show some icon

~~~js
     html\`\${getIconSvg("arrow-up-right")}\`
~~~

This will give you icon at the default size, 24x24: ${getIconSvg(
  "arrow-up-right"
)}

You can provide size as second argument:
~~~js
    html\`\${getIconSvg("arrow-up-right", 16)}\`
~~~
to get icon with 16x16 size: ${getIconSvg("arrow-up-right", 16)}. This will set the \`width\` and \`size\` attributes on the \`<svg>\` tag. You  'll still be able to override using CSS.

You can change color using CSS \`color\` property on parent:
~~~js
    html\`<span style="color: orange">\${getIconSvg("arrow-up-right")}</span>\`
~~~
to get colored icon: <span style="color: orange">${getIconSvg(
  "arrow-up-right"
)}</span>
`
)}

function _3(icons,getIconSvg,md)
{
  let iconRows = "";

  for (const [name, icon] of Object.entries(icons)) {
    const defaultSized = getIconSvg(name);
    const description = icon.tags.join(", ");
    iconRows += `|${defaultSized}|${name}|${description}|\n`;
  }

  return md`## Available Icons

|Icon|Name|Description|
|:--:|:---|:---|
${iconRows}`;
}


function _getIconSvg(icons){return(
(name, size = 24, attrs = {}) => {
  const icon = icons[name];

  if (icon) {
    return icon.toSvg({ ...attrs, width: size, height: size });
  }
}
)}

function _version(){return(
"4.28.0"
)}

function _6(md){return(
md`## Imports`
)}

function _featherIcons(version){return(
import(`https://cdn.skypack.dev/feather-icons@${version}?min`)
)}

function _icons(featherIcons){return(
featherIcons.icons
)}

function _9(md){return(
md`## Credits

This notebook is based on [@nikita-sharov](https://observablehq.com/@nikita-sharov)'s [Feather Icons](https://observablehq.com/@nikita-sharov/feather-icons)`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","getIconSvg"], _2);
  main.variable(observer()).define(["icons","getIconSvg","md"], _3);
  main.variable(observer("getIconSvg")).define("getIconSvg", ["icons"], _getIconSvg);
  main.variable(observer("version")).define("version", _version);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("featherIcons")).define("featherIcons", ["version"], _featherIcons);
  main.variable(observer("icons")).define("icons", ["featherIcons"], _icons);
  main.variable(observer()).define(["md"], _9);
  return main;
}
