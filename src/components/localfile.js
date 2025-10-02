//# LocalFile
// Code in this notebook derived from https://observablehq.com/@mbostock/localfile

import { FileAttachment } from "@observablehq/stdlib";
import * as htl from "htl";


// ERROR HERE: file 'empty' not found

const AbstractFile = FileAttachment("/data/empty@1").constructor.__proto__

export class LocalFile extends AbstractFile {
  constructor(file) {
    super(file.name);
    Object.defineProperty(this, "_", {value: file});
    Object.defineProperty(this, "_url", {writable: true});
  }
  async url() {
    return this._url || (this._url = URL.createObjectURL(this._));
  }
  async blob() {
    return this._;
  }
  async stream() {
    return this._.stream();
  }
}


export function localFileInput({
  accept, // e.g., ".txt,.md"
  value // set the initial value (typically to a FileAttachment)
} = {}) {
  return Object.assign(htl.html`<form><input type=file ${{accept}} oninput=${(event) => {
    const {currentTarget: input} = event;
    const {form, files: [file]} = input;
    form.value = new LocalFile(file);
  }}>`, {value});
}

//const file = view(localFileInput({accept: ".db"}))
const file = localFileInput({accept: ".db"})

const db = file.sqlite()

db.describe()


