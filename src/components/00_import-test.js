//# AWS Helpers

import * as htl from "/components/htl@0.3.1.js";
import * as Inputs from "/components/inputs_observable.js";
import { Generators } from "observablehq:stdlib";

export const textareaElement = Inputs.textarea()

export const textarea = Generators.input(textareaElement)