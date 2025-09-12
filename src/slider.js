import * as Inputs from "https://cdn.jsdelivr.net/npm/@observablehq/inputs@0.12/+esm";
import markdownit from "markdown-it";
import { DOM } from "/components/DOM.js";
import { html } from "htl";

import {require} from "npm:d3-require";


const d3geo = require("d3-geo@1");

export function slider(config = {}) {
  let {
    min = 0,
    max = 1,
    value = (max + min) / 2,
    step = "any",
    precision = 2,
    title,
    description,
    disabled,
    getValue,
    format,
    display,
    submit
  } = typeof config === "number" ? { value: config } : config;
  precision = Math.pow(10, precision);
  if (!getValue)
    getValue = input => Math.round(input.valueAsNumber * precision) / precision;
  return input({
    type: "range",
    title,
    description,
    submit,
    format,
    display,
    attributes: { min, max, step, disabled, value },
    getValue
  });
};
