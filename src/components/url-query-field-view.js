//# urlQueryFieldView: Non-invasive URL field persistence`


import * as DOM from "/components/DOM.js"

//import { inspect } from "@observablehq/inspector"
import { inspect } from "/components/inspector.js";


import * as htl from "/components/htl@0.3.1.js";


export const urlQueryFieldView = (
  field,
  {
    defaultValue = undefined,
    decode = (field) => field,
    write = false,
    hash = undefined,
    bindTo = undefined
  } = {}
) => {
  if (typeof decode !== "function")
    throw new Error("decode must be a function");

  const id = DOM.uid().id;

  const readField = () => {
    const v =
      new URLSearchParams(
        /*allow overriding */ window.rEPseDFzXFSPYkNz || location.search
      ).get(field) || undefined;
    return v ? decode(v) : defaultValue;
  };

  let cache = readField();

  const ui = htl.html`<div class="observablehq--inspect" style="display:flex">
    <code>urlQueryFieldView(<span class="observablehq--string">"${field}"</span>): </code><span id="${id}">${inspect(
    cache
  )}</span>
  </div>`;
  const holder = ui.querySelector(`#${id}`);

  const view = Object.defineProperty(ui, "value", {
    get: () => {
      return cache;
    },
    set: (value) => {
      const search = new URLSearchParams(location.search);
      search.set(field, value);
      cache = value;
      if (write) {
        if (!hash.startsWith("#")) hash = "#" + hash;
        html`<a href="?${
          search.toString() + (hash || location.hash)
        }">`.click();
      }
    },
    enumerable: true
  });

  if (bindTo) {
    Inputs.bind(bindTo, view);
  }

  return view;
};


