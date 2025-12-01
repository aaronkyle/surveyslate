//# Version Pinning for Notebooks


import { Generators, Mutable } from "observablehq:stdlib";

import * as htl from "/components/htl@0.3.1.js";


import markdownit from "markdown-it";
const Markdown = new markdownit({html: true});
function md(strings) {
  let string = strings[0];
  for (let i = 1; i < arguments.length; ++i) {
    string += String(arguments[i]);
    string += strings[i];
  }
  const template = document.createElement("template");
  template.innerHTML = Markdown.render(string);
  return template.content.cloneNode(true);
}

const html = htl.html


const domain = 'observablehq.com'

const apiDomain = 'api.observablehq.com'

// Formatters


function formatId(id, version = null) {
  return id + (version ? '@' + version : '');
}

function formatName(name, version = null) {
  return name + (version ? '@' + version : '');
}


function formatLocalPath(name, version = null) {
  return '/' + (name.match(/^@/) ? name : 'd/' + name) + (version ? '@' + version : '');
}

function formatPath(name, version = null) {
  return `https://${domain}${formatLocalPath(name, version)}`;
}


function formatSourcePath(name, version = null) {
  return `https://${apiDomain}${formatLocalPath(name, version)}.js`;
}


function formatComparePath(id1, version1, id2, version2) {
  return `https://${domain}/compare/${formatId(id1, version1)}...${formatId(id2, version2)}`;
}


async function getCurrentComparePath(version1 = null, version2 = null) {
  const data = await getMetadata(getCurrentName());
  if(data) return formatComparePath(data.id, version1, data.id, version2);
  return null;
}


//## Current Notebook


function getCurrentLocalPath() {
  return html`<a href="#">`.pathname;
}

function getCurrentPath() {
  return formatPath(getCurrentName());
}

function getCurrentName() {
  return getCurrentLocalPath().replace(/^\/(d\/)?/, '');
}
async function getCurrentPinnedName() {
  const data = await getCurrentMetadata();
  if(data && data.version) return formatName(getCurrentName(), data.version);
  return null;
}

// Metadata

const getCurrentMetadata = (() => {
  let data;
  return async function getCurrentMetadata(refetch = false) {
    if(data === undefined || refetch) data = await getMetadata(getCurrentName());
    return data;
  }
})()



async function getMetadata(name, version = null) {
  const map = {
    'URL': 'url',
    'Title': 'title',
    'Author': 'author',
    'Version': 'version',
    'Runtime version': 'runtimeVersion'
  };
  const source = await getSource(name, version);
  if(!source) return null;
  
  const frontmatter = source.match(/^(?:\/\/ .+?\n)+/);
  const id = source.match(/^\s+?id:\s+?"([^@"]+)/m);
  if(!frontmatter || !id) return null;
  
  return frontmatter[0].split(/\n/).reduce((data, s) => {
    const m = s.match(/^\/\/ ([^:]+?):\s+?(.+?)$/);
    if(m && map.hasOwnProperty(m[1])) data[map[m[1]]] = m[2];
    return data;
  }, {id: id[1]});
}




async function getSource(name, version = null) {
  const path = formatSourcePath(name, version);
  try {
    const response = await fetch(path, {cache: version ? 'default' : 'no-cache'});
    return await response.text();
  }
  catch(e) { return null; }  
}





//## Other Notebooks



//viewof preview_name = { ... }
const preview_nameElement = (() => {
  const submit = html`<input type="button" value="Submit">`;
  const input = html`<input type="text" value="@jashkenas/inputs">`;
  const view = html`<form>${input} ${submit}`;
  
  input.oninput = e => e.stopPropagation();
  submit.onclick = () => {
    view.value = input.value;
    view.dispatchEvent(new Event("input"));
  };
  
  view.value = input.value;
  return view;
})();

const preview_name = Generators.input(preview_nameElement);



async function getPinnedName(name) {
  const data = await getMetadata(name);
  if(data && data.version) return name + '@' + data.version;
  return null;
}


async function getPinnedPath(name) {
  const data = await getMetadata(name);
  if(data && data.version) return formatPath(name, data.version);
  return null;
}



async function getComparePath(name, version1 = null, version2 = null) {
  const data = await getMetadata(name);
  if(data) return formatComparePath(data.id, version1, data.id, version2);
  return null;
}




function dataTable(rows) {
  const style = 'padding:.5em;vertical-align:top';
  const n = rows.map(([l,d]) => {
    const wrap = html`<div style="max-height:10em;overflow:auto;word-break:break-word">`;
    wrap.textContent = JSON.stringify(d);
    return html`<tr><th style="${style}">${l}</th><td style="${style};font-family:monospace">${wrap}</td>`;
  });
  return html`<table>${n}`;
}

export {
  // markdown
  Markdown,
  md,

  // constants
  apiDomain,

  // formatters
  formatId,
  formatName,
  formatLocalPath,
  formatPath,
  formatSourcePath,
  formatComparePath,

  // “current” helpers
  getCurrentLocalPath,
  getCurrentPath,
  getCurrentName,
  getCurrentComparePath,

  // metadata/network
  getCurrentMetadata,
  getMetadata,
  getSource,

  // pinned/compare
  getPinnedName,
  getPinnedPath,
  getComparePath,
  getCurrentPinnedName,

  // ui
  dataTable
};