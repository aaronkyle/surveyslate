# Hello json-editor
Ref.: https://github.com/json-editor/json-editor`


```js echo
//viewof example = editor(exampleSchema, {
const exampleElement = editor(exampleSchema, {
  theme: "spectre",
  disable_edit_json: true,
  disable_properties: true,
  iconlib: "spectre",
  show_errors: "always",
  prompt_before_delete: "false"
});
const example = Generators.input(exampleElement);
display(exampleElement)
```

```js echo
example
```

```js echo
const exampleSchema = ({
  title: "Person",
  type: "object",
  required: [
    "name",
    "age",
    "date",
    "favorite_color",
    "gender",
    "location",
    "pets"
  ],
  properties: {
    name: {
      type: "string",
      description: "First and Last name",
      minLength: 3,
      default: "Alok Pepakayala"
    },
    age: {
      type: "integer",
      default: 25,
      minimum: 18,
      maximum: 130
    },
    favorite_color: {
      type: "string",
      format: "color",
      title: "favorite color",
      default: "#4263FA"
    },
    gender: {
      type: "string",
      enum: ["male", "female", "other"]
    },
    date: {
      type: "string",
      format: "date",
      options: {
        flatpickr: {}
      }
    },
    location: {
      type: "object",
      title: "Location",
      properties: {
        city: {
          type: "string",
          default: "Bengalore"
        },
        state: {
          type: "string",
          default: "KA"
        },
        citystate: {
          type: "string",
          description:
            "This is generated automatically from the previous two fields",
          template: "{{city}}, {{state}}",
          watch: {
            city: "location.city",
            state: "location.state"
          }
        }
      }
    },
    pets: {
      type: "array",
      format: "table",
      title: "Pets",
      uniqueItems: true,
      items: {
        type: "object",
        title: "Pet",
        properties: {
          type: {
            type: "string",
            enum: ["cat", "dog", "bird", "reptile", "other"],
            default: "dog"
          },
          name: {
            type: "string"
          }
        }
      },
      default: [
        {
          type: "dog",
          name: "Bunty"
        }
      ]
    }
  }
});
display(exampleSchema)
```

### Dependencies

```js echo
function editor(schema, options) {
  const dom = html`<div style="max-width:600px;">`;
  const shadow = dom.attachShadow({ mode: 'open' });
  const styles = html`
  <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre-icons.min.css">
  <link rel="stylesheet" href="https://unpkg.com/spectre.css">
  <style>
  *{
    font-size:13px;
    font-family: -apple-system,BlinkMacSystemFont,"avenir next",avenir,helvetica,"helvetica neue",ubuntu,roboto,noto,"segoe ui",arial,sans-serif;
    box-sizing: border-box;
  }
  :host div[data-theme="spectre"] *{
    --primary-color: #4263FA;
  }
  .btn.btn-primary{
    background: var(--primary-color);
  }
  .column .je-panel {
    margin-left: 24px !important;
  }
  </style>`;
  const holder = html`<div></div>`;
  shadow.appendChild(styles);
  shadow.appendChild(holder);
  const props = Object.assign({ schema }, options || {});
  const editor = new JSONEditor(holder, props);

  // Allow for updating via `viewof car.value = {....}` (thank you, @jbouecke!)
  let __list = [];
  Object.defineProperty(dom, "value", {
    get: function() {
      return editor.getValue();
    },
    set: function(value) {
      const nos = JSON.stringify(value);
      const cos = JSON.stringify(editor.getValue());
      //console.log(cos+"\n"+nos);
      if (cos == nos) return;
      let no = JSON.parse(nos);
      editor.setValue(no);
      dom.dispatchEvent({ type: "input", value: no });
    }
  });
  dom.addEventListener = function(type, listener) {
    if (type != "input" || __list.includes(listener)) return;
    __list = [listener].concat(__list);
  };
  dom.removeEventListener = function(type, listener) {
    if (type != "input") return;
    __list = __list.filter(l => l !== listener);
  };
  dom.dispatchEvent = function(event) {
    console.log("place dispatch event");
    const p = Promise.resolve(event);
    __list.forEach(l => p.then(l));
  };

  editor.on("change", function() {
    dom.value = editor.getValue();
    dom.dispatchEvent(new CustomEvent("input"));
  });
  return dom;
};
display(editor)
```

```js echo
//const JSONEditor = (await require("@json-editor/json-editor@2.5.4")).JSONEditor
//import JSONEditor from "@json-editor/json-editor";
const { JSONEditor } = await import("npm:@json-editor/json-editor@2.5.4")
display(JSONEditor)
```
