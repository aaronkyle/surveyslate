# Survey Slate | Survey Components

_Reusable code components for survey development._

<div style="max-width: ${width/1.75}px; margin: 30px 0; padding: 15px 30px; background-color: #e0ffff; font: 700 18px/24px sans-serif;">👋 Welcome!  This notebook is about **Survey Slate**&mdash;an [assemblage of Observable web-based notebooks](https://observablehq.com/collection/@categorise/survey-slate) allowing organizations to host custom surveys for end users on their own AWS infrastructure.  Check out the [Technical Overview](https://observablehq.com/@categorise/surveyslate-docs) to get started! ✨</div>

<!-- Notification design borrowed from https://observablehq.com/@jashkenas/inputs -->


```js echo
toc()
```

## Config

```js echo
config = ({
  // All artifacts in the PUBLIC bucket are on the internet
  PUBLIC_BUCKET: "public-publicwrfxcsvqwpcgcrpx",
  // The private bucket requires credentials to access, should be for system wide things like user lists
  PRIVATE_BUCKET: "private-mjgvubdpwmdipjsn",
  // The confidential bucket is for customer data, it is encypted and access shoudl be minimized.
  CONFIDENTIAL_BUCKET: "confidential-bspqugxjstgxwjnt",
  // The URL to redirect users to
  FILLER_APP_URL: "https://www.surveyslate.org/survey/index.html",
  // Cloud Front distribution ID
  CLOUD_FRONT_DISTRIBUTION_ID: 'EG13QGKCG6LI9',
  // URL that hosts appplications
  CLOUD_FRONT_URL: 'https://www.surveyslate.org',
})
```

## Questions

Every cell is wrapped so we can apply cross-cutting features like visibility and numbering to all controls

```js
function questionWrapper({
    control,
    hidden = false,
    numbering = ""
  } = {}) {
  const hiddenVariable = variable(undefined, {name: 'hidden'})
  const wrapper = view`<div class="mv3">
    ${['hidden', hiddenVariable]}
    <div class="f3 black-40 b sans-serif">${['numbering', textNodeView()]}</div>
    ${['control', control]}
  </div>`
  hiddenVariable.addEventListener('assign', () => {
    if (hiddenVariable.value === true) {
      wrapper.style.display = 'none'
    } else if (hiddenVariable.value === false) {
      wrapper.style.display = 'block'
    } else {
      debugger;
      throw new Error("Unrecognised value for hidden")
    }
  })
  return wrapper;
}
```

```js echo
// Special arg suffixes like _json, _md, _html are converted to real objects
function reifyAttributes(args) {
  const reifyAttribute = ([k, v]) => {
    k = k.trim()
    if (k.endsWith("_json")) {
      return [k.replace(/_json$/, ''),
              Array.isArray(v) ? v.map(v => reifyAttributes(JSON.parse("(" + v + ")")))
                                       : reifyAttributes(JSON.parse("(" + v + ")"))] 
    }
    if (k.endsWith("_eval")) {
      return [k.replace(/_eval$/, ''),
              Array.isArray(v) ? v.map(v => reifyAttributes(eval("(" + v + ")")))
                                       : reifyAttributes(eval("(" + v + ")"))]    
    }
    if (k.endsWith("_js")) {
      return [k.replace(/_js$/, ''),
              Array.isArray(v) ? v.map(v => reifyAttributes(eval("(" + v + ")")))
                                       : reifyAttributes(eval("(" + v + ")"))]    
    }
    if (k.endsWith("_md")) {
      return [k.replace(/_md$/, ''), md([v])]    
    }
    
    return [k, v]
  }
  if (Array.isArray(args))
    return args.map(arg => reifyAttributes(arg));
  else if (typeof args === 'object')
    return Object.fromEntries(Object.entries(args).map(reifyAttribute))
  else 
    return args
} 
```

```js echo
const createQuestion = (q, index, options) => {
  const args = reifyAttributes(q);
  
  function createControl() {
    try {
      if (Object.keys(args).length == 0
         || (Object.keys(args).length == 1 && args[""] == "")) {
        return htl.html` `
      }


      if (args.content || args.md) {
        return md`${args.content || args.md}`
      }

      if (args.type === 'checkbox') {
        return checkbox({
          options: [args.title],
          ...args
        })
      }

      if (args.type === 'textarea') {
        return textarea({
          ...args
        })
      }

      if (args.type === 'radio') {
        return radio({
          ...args
        })
      }

      if (args.type === 'number') {
        return number({
          ...args
        })
      }

      if (args.type === 'table') {
        return table({
          ...args
        })
      }

      if (args.type === 'file_attachment') {
        return file_attachment({
          ...args,
          putFile: options.putFile,
          getFile: options.getFile,
        })
      }
      
      if (args.type === 'summary') {
        return summary({
          ...args
        })
      }
      
      if (args.type === 'aggregate') {
        return aggregateSummary({
          ...args
        })
      }


    } catch (err) {
      console.log("Error creating question for ", q, index, options)
      console.log(err)
    }


    return htl.html`<div><mark>${index}. ${JSON.stringify(q)}</mark></div>`
  }
  
  const control = createControl();
  const logic = questionWrapper({
    control
  });
  logic.args = args;
  return logic
}
```

```js echo
const example_q = view({
  return createQuestion(JSON.parse(`{"id":"viewof borrower_GESI_support_equal_pay","type":"radio","title":"Do you provide equal pay for work of equal value of women and men?","options":[{"value":"No","label":"No"},{"value":"Yes","label":"Yes"}],"value":"savedFormData.borrower_GESI_support_equal_pay"}`))
})
```

```js echo
example_q.numbering = "34."
```

```js echo
example_q
```

```js echo
const scoreQuestion = (q) => {
  if (!q) return 0;
  if (q.hidden.value === true) return 0;
  if (q.args.type === 'checkbox') {
    // Max score function
    return q.control.value.reduce((max, value) => {
      // find option with higest score
      const option = q.args.options.find(option => option.value === value)
      return Math.max(option.score, max);
    }, 0)
  }
  if (q.args.type === 'radio') {
    const option = q.args.options.find(option => option.value === q.control.value)
    if (option) return option.score;
  };
  
  if (q.args.type === 'summary') {
    return q.control.score.value;
  };
}
```

### TextNodeView

Moved to [Common Components](https://observablehq.com/@categorise/common-components?collection=@categorise/gesi-survey#cell-212)

### Table

```js echo
const id = () => Math.random().toString(36).substr(2, 9); // https://gist.github.com/gordonbrander/2230317
```

```js echo
function table({
  value = {},
  title = undefined,
  user_rows = false,
  columns = [],
  rows = [],
  grandTotalLabel = "units",
  grandTotal,
  caption = undefined
} = {}) {
  const total = textNodeView()
  const subtotals = columns.reduce((acc, c) => {
    acc[c.key] = textNodeView()
    return acc;
  }, {});
  
  const rowBuilder = (row) => {
    const labelInput = Inputs.text({value: row.label, placeholder: row.placeholder});
    
    const removeRow = (key) => {
      console.log("DELETE ROW", table.value)
      table.value = Object.fromEntries(Object.entries(table.value)
                                       .filter(([id, row]) => row.label !== key));
      table.dispatchEvent(new Event('input', {bubbles: true}));
    }

    const deleteBtn = Inputs.button('Delete', {
      reduce: () => removeRow(labelInput.value),
      disabled: !labelInput.value
    });
    const deleteBtnEl = deleteBtn.querySelector('button');
    deleteBtnEl.classList.add('secondary-button');
    
    if (row.onEnterPressed) {
      labelInput.addEventListener('keyup', (evt) => {
        if (evt.keyCode === 13) {
          row.onEnterPressed(evt);
        }
      });
    }
    // if (user_rows) { // If user editable rows
    //   labelInput.addEventListener('keyup', (evt) => {
    //     // BACKSPACE
    //     if (evt.keyCode === 8 && labelInput.value.length == 0) {
    //       removeRow(labelInput.value)
    //     }
    //   });
    // }
    return view`<tr>
          <th>${user_rows ? ['label', labelInput] : md`${row.label}`}</th>
          ${['...', Object.fromEntries(columns.map(
            column => [column.key, view`<td>${['...', htl.html`<input type="number" value="${value?.[row.key]?.[column.key] || 0}" min="0">`]}</td>`]))]}
          ${user_rows ? view`<td>${deleteBtn}</td>` : ''}
        </tr>`
  }
  const newRow = cautious((done) => {
    return rowBuilder({
      placeholder: "add a new row",
      onEnterPressed: (evt) => {
        table.value = {
          ...table.value,
          [id()]: newRow.value
        }
        newRow.value.label = ""
        table.dispatchEvent(new Event('input', {bubbles: true}))
        done(evt);
      }
    });
  }, {nospan: true});
  
  
  let table = view`<div>
    <h2>${title}</h2>
    <div class="table-ui-wrapper">
      <table class="table-ui">
        <thead class="bb bw1 b--light-gray">
          <th></th>
          ${columns.map(column => view`<th>${column.label}</th>`)}
        </thead>
        <tbody>
          ${['...', {}, rowBuilder]}
        </tbody>
        <tfoot class="bt bw1 b--light-gray">
          ${user_rows ? newRow : ''}
          ${columns[0].total ?
            view`<tr>
              <th>Sub-Totals:</th>
              ${columns.map(c => view`<td><div class="subtotal"><strong>${subtotals[c.key]} ${c.total}</strong></div></td>`)}
            </tr>`
          : null}
          ${grandTotal ?
            view`<tr>
              <th><h3>${grandTotal}</h3></th>
              <td colspan="${columns.length}"><h3>${total} ${grandTotalLabel}</h3></td>
            </tr>`
          : null}
        </tfoot>
      </table>
    </div>
    <div class="table-ui-caption">${caption}</div>
  </div>`
  
  // Set rows from static settings
  table.value = Object.fromEntries(rows.map(row => [row.key, row]))
  // Also set rows from dynamic value
  if (Object.keys(value).length > 0 && user_rows) {
    table.value = value
  }
  
  
  function recomputeTotals() {
    let totalSum = 0;
    Object.keys(subtotals).forEach(k => {
      let sum = 0;
      Object.keys(table.value).forEach(key => {
        sum += Number.parseInt(table.value[key][k])
      })
      subtotals[k].value = sum
      totalSum += sum
    })
    total.value = totalSum;
  }
  
  table.addEventListener('input', () => {
    recomputeTotals()
  })
  recomputeTotals()
  return table
}
```

```js echo
exampleTable
```

```js
const tableStyles = html`<style>
form.${ns} {
  width: auto;
}

.table-ui-wrapper {
  overflow-x: auto;
}

.table-ui {
  width: 100%;
  border-collapse: collapse;
}

.table-ui td,
.table-ui th {
  padding: 0.25rem 0.5rem 0.25rem 0;
  vertical-align: middle;
}

.table-ui th {
  text-align: left;
}

.table-ui th > * {
  margin: 0;
}

.table-ui td > input[type=number] {
  width: 60px;
}

.table-ui .subtotal {
  padding: 0.25rem 0;
}

.table-ui th .${ns}-input {
  min-width: 120px;
}

/* Match Observable Input description styles */
.table-ui-caption {
  font-size: 0.85rem;
  font-style: italic;
  margin-top: 3px;
}

/* Don't reduce font size lower than 0.85rem with <small> */
.table-ui-caption small {
  font-size: 0.85rem;
}
</style>`
```

```js echo
const exampleTable = view(table({
  value: {
   board: {
    w: 10,
    m:1, 
    unknown: 3, 
   }
  },
  title: "Workforce Gender Data",
  columns: [
    {key: "w", label:"Women", total: "women"},
    {key: "m", label:"Men", total: "male"},
    {key: "unknown", label: "No Data", total: "no data"}
  ],
  rows: [
    {key: "board", label: "Board"},
    {key: "management", label: "Management"},
    {key: "tech", label: "Technical / Engineering Staff"},
    {key: "staff", label: "Non-Technical Staff"},
    {key: "admin", label: "Administrative / Support Staff"},
    {key: "customerservice", label: "Customer Service Staff"},
    {key: "other", label: "Other Staff"},
    {key: "day", label: "Non-Contractual/Informal Day Workers <br><small>(e.g., for food preparation, laundry, cleaners)</small>"}
  ],
  grandTotal: "Total Workforce:",
  grandTotalLabel: htl.html`<br>people`,
  caption: md`<small>_Please enumerate the sex distribution and number of persons with disabilities in your workforce—ensuring to avoid double counting. If you find that this format does not adequately reflect your organization, please submit your data separately to ADB. If you have information for multiple years, please also submit separately.
._</small>`
}))
```

```js echo
exampleTable
```

```js
const userEditableTableExample = view(createQuestion({
  type: 'table',
  value: {
    "indigenous": {label: "Indigenous Peoples", w: 3, m: 12, unknown: 5, other: 4}
  },
  columns_eval: `[{key: "w", label:"Women / Female", total: "women"}, {key: "m", label:"Men / Male", total: "men"}, {key: "other", label: "Third Gender", total: "third gender"}, {key: "unknown", label: "No Data", total: "no data"}]`,
  rows_eval: `[{key: "indigenous", label:"Indigenous Peoples"}, {key: "disabled", label:"Workers with Disabilities (under Indian law)"},{key: "userdefined1", label:"TODO user editable"}]`,
  user_rows: true,
  table_total_label: '<br>people',
  caption_md: `<small>_**Excluded and Vulnerable Groups** ...._</small>`
}))
```

```js echo
userEditableTableExample
```

```js
const basicTable = view(table({
  
  value: {
    "cool": {label:"very cool", c1: "27"}
  },
  columns: [{key: "c1", label: "c1"}], rows: [{key: "r1", label: "r1"}], user_rows: true}))
```

```js echo
basicTable
```

```js echo
Inputs.button("backwrite", {
  reduce: () => {
    basicTable.value = {"r1": {label: "r1", "c1": "3"}, "r2": {label: "r1", "c1": "2"}};
    basicTable.dispatchEvent(new Event('input', {bubbles: true}))
  }
})
```

### File attachment

```js echo
const file_attachment = (options) => {
  const row = file => view`<li>${['name', textNodeView(file.name)]}
      ${download(async () => {
        return new Blob(
          [await options.getFile(file.name)], 
          {type: "*/*"}
        )
      }, file.name, "Retrieve")}`
  
  let ui = view`<div class="sans-serif">
    <p class="b">Existing files</p>
    <ul class="uploads">
      ${['uploads', [], row]}
    </ul>
    ${viewroutine(async function*() {
      while (true) {
        const filesView = file({
          ...options,
          multiple: true
        });
        yield* ask(filesView);
        // A bug with file means files have to be collected from a nested value, rather than the result of ask.
        const toUpload = filesView.input.files; 
        let uploaded = false;
        const uploads = [...toUpload].map(async file => {
          await options.putFile(file.name, await file.arrayBuffer())
          console.log("push", file.name)
          ui.value.uploads = _.uniqBy(ui.value.uploads.concat({name: file.name}), 'name');
          ui.dispatchEvent(new Event('input', {bubbles: true}))
          return;
        })

        Promise.all(uploads).then(() => uploaded = true);

        while (!uploaded) {
          yield md`uploading .`
          await new Promise(resolve => setTimeout(resolve, 100));
          yield md`uploading ..`
          await new Promise(resolve => setTimeout(resolve, 100));
          yield md`uploading ...`
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    })
  }</div>`;
  
  // Initial list contents
  ui.value.uploads = options?.value?.uploads || [];
  return ui;
}
```

```js echo
viewof exampleFileAttachment = {
  return createQuestion({
    "id":"GESI_national_law_files",
    "type":"file_attachment",
    "title":"File Attachments",
    "placeholder":"No file chosen.",
    "description":"If you would like to share your policy, please upload it here.",
    "value":{"uploads":[{"name":"IMG_20210801_095401.jpg"}]}
  }, 
  0, {
    putFile: () => {},
    getFile: () => {},
  })
}
```

```js echo
exampleFileAttachment
```

```js
md`### Clearable Radio
`
```

```js echo
viewof radioExamples2 = radio({
  title: "A very long non sensical question to check the wrapping and layout of this component? A very long non sensical question.",
  options: [ 
    "cool",
    "Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring"
  ],
  value: "cool",
  description: "A slightly long and meaningless description to go with the options"
})
```

```js
viewof radioExample = radio({
  options: ["cool", "not cool"]
})
```

```js echo
radioExample
```

```js echo
viewof radioExample
```

```js echo
radio = (args) => {
  const base = radioBase(args || {});
  const radios = base.querySelectorAll('input[type=radio]');

  const buttonClass = "[ secondary-button ][ m2 ]";
  const buttonInactiveClass = "dn";
  const button = html`<button class="${args.value ? "" : buttonInactiveClass} ${buttonClass}">Clear selection</button>`;

  base.dataset.formType = "clearable-radio";
  
  const clearHandler = (e) => {
    // Hide clear button
    button.classList.add(buttonInactiveClass);
    
    Array.from(radios).forEach(r => { r.checked = false })
    base.value = undefined;
    base.dispatchEvent(new Event('input', {bubbles: true}))
  }

  const inputChangeHandler = (e) => {
    if (base.value !== undefined) {
      // Show clear button
      button.classList.remove(buttonInactiveClass);
    }
  }
  
  button.addEventListener('click', clearHandler);
  base.addEventListener('input', inputChangeHandler);
  invalidation.then(() => {
    base.removeEventListener('input', inputChangeHandler);
    button.removeEventListener('click',clearHandler)
  });

  const labels = base.querySelectorAll('label');
  const lastLabel = Array.from(labels)[labels.length  - 1];
  if (lastLabel && lastLabel.parentNode) {
    lastLabel.parentNode.insertBefore(button, lastLabel.nextSibling);
  }
  
  return base;
}
```

### textarea

```js echo
viewof exampleTextarea = textarea({
  title: "title",
  description: "description",
  placeholder: "placeholder"
})
```

```js
md`### Checkbox++

Includes a scoring function that has to be accessed through the view
`
```

```js echo
checkbox = (options) => {
  const allValues = options.options.map(o => o.value)
  if (options.includeNoneOption) {
    options.options.unshift({
      value: "NONE",
      label: options.includeNoneOption.label || (typeof options.includeNoneOption === 'string' ? options.includeNoneOption : "None of the below."),
      score: options.includeNoneOption.score
    })
  }
  if (options.includeAllOption) {
    options.options.push({
      value: "ALL",
      label: options.includeAllOption.label || (typeof options.includeAllOption === 'string' ? options.includeAllOption : "All of the above."),
      score: options.includeAllOption.score})
  }
  const base = checkboxBase(options);
  
  const ui = view`<div>
    ${['...', base]}
  </div>`
  
  const form = ui.querySelector("form")
  base.dataset.formType = "checkbox-plus-plus";
  let allSelected = (options.value || []).includes("ALL");
  let noneSelected = (options.value || []).includes("NONE");
  
  base.addEventListener('input', evt => {
    console.log(evt, evt.target.elements, allValues)
    // If all the values are selected ALL should be too
    if (evt.target.value.includes('ALL') && !allSelected) {
      console.log("A")
      // User ticks ALL
      allSelected = true
      allValues.forEach(v => {
        const input = form.querySelector(`input[value='${v}']`)
        input.checked = true
      })
      form.querySelector(`input[value=NONE]`).checked = false;
      form.dispatchEvent(new Event('change', {bubbles:true}))
      evt.stopPropagation()
    } else if (!evt.target.value.includes('ALL') && allSelected) {
      console.log("B")
      // User unticks ALL
      allSelected = false
      allValues.forEach(v => {
        const input = form.querySelector(`input[value='${v}']`)
        input.checked = false
      })
      form.dispatchEvent(new Event('change', {bubbles:true}))
      evt.stopPropagation()
    } else if (evt.target.value.includes('ALL') && allSelected && !allValues.every(v => evt.target.value.includes(v))) {
      console.log("C")
      // An unticked option exists while ALL was ticked (so ALL should untick)
      allSelected = false
      const input = form.querySelector(`input[value=ALL]`)
      input.checked = false
      input.dispatchEvent(new Event('change', {bubbles:true}))
      evt.stopPropagation()
    } else if (!evt.target.value.includes('ALL') && !allSelected && allValues.every(v => evt.target.value.includes(v))) {
      console.log("D")
      // All options are ticked while ALL was unticked (so ALL should tick)
      allSelected = true
      const input = form.querySelector(`input[value=ALL]`)
      input.checked = true
      input.dispatchEvent(new Event('change', {bubbles:true}))
      evt.stopPropagation()
    } else if (evt.target.value.includes('NONE') && !noneSelected) {
      console.log("E")
      // User ticks NONE (=> all options should untick)
      noneSelected = true
      allValues.forEach(v => {
        const input = form.querySelector(`input[value='${v}']`)
        input.checked = false
      })
      form.querySelector(`input[value=ALL]`).checked = false
      form.dispatchEvent(new Event('change', {bubbles:true}))
      evt.stopPropagation()
    } else if (!evt.target.value.includes('NONE') && noneSelected) {
      console.log("F")
      // User unticks NONE
      noneSelected = false
    } else if (evt.target.value.includes('NONE') && noneSelected && allValues.some(v => evt.target.value.includes(v))) {
      console.log("G")
      // An option exists while NONE was ticked (so NONE should untick)
      noneSelected = false
      const input = form.querySelector(`input[value=NONE]`)
      input.checked = false
      input.dispatchEvent(new Event('change', {bubbles:true}))
      evt.stopPropagation()
    } else if (!evt.target.value.includes('NONE') && !noneSelected && allValues.every(v => !evt.target.value.includes(v))) {
      console.log("H")
      // Nothing is ticked and NONE is unticked (so NONE should tick)
      noneSelected = true
      const input = form.querySelector(`input[value=NONE]`)
      input.checked = true
      input.dispatchEvent(new Event('change', {bubbles:true}))
      evt.stopPropagation()
    }
  })
  
  return ui
}
```

```js
viewof exampleCheckboxPlus = checkbox({
  includeNoneOption: {label: "none of the below", score: 0},
  includeAllOption: {label: "all of the above", score: 4},
  options: [
    { 
      value: 'a',
      label: "option A", 
      score: 1},
    {value: 'b', label: "option B", score: 2}
  ], 
  value: ['a', 'ALL', 'b']
})
```

```js echo
exampleCheckboxPlus
```

```js echo
viewof exampleCheckboxWithSpaces = checkbox({
  includeNoneOption: {label: "", score: 0},
  includeAllOption: {label: "YES ALL", score: 4},
  options: [
    {value: 'a b', label: "A", score: 1},
    {value: 'b', label: "B", score: 2}
  ], 
  value: ['a b'],
  description: "A slightly long and meaningless description to go with the options"
})
```

```js echo
exampleCheckboxWithSpaces
```

```js
viewof checkboxTests = createSuite({
  name: "checkbox tests",
  timeout_ms: 1000
})
```

```js echo
viewof testCheckboxAll = checkbox({
    includeAllOption: {label: "ALL"},
    options: [
      {value: 'a', label: "A"},
      {value: 'b', label: "B"}
    ],
  })
```

```js echo
function check(checkbox, value, checked = true) {
  const option = checkbox.querySelector(`input[value=${value}]`);
  if (!option) throw new Error("Could not find " + value + " in options");
  option.checked = checked
  option.dispatchEvent(new Event('change', {bubbles: true}))
}
```

```js
checkboxTests.test("Tick ALL cascades", () => {
  check(viewof testCheckboxAll, "a", false)
  check(viewof testCheckboxAll, "b", false)
  check(viewof testCheckboxAll, "ALL", true)
  expect(viewof testCheckboxAll.value).toEqual(["a", "b", "ALL"])
})
```

```js
checkboxTests.test("Tick a and b cascades to ALL", () => {
  check(viewof testCheckboxAll, "ALL", false)
  check(viewof testCheckboxAll, "a", true)
  check(viewof testCheckboxAll, "b", true)
  expect(viewof testCheckboxAll.value).toEqual(["a", "b", "ALL"])
})
```

```js
checkboxTests.test("Untick ALL cascades", () => {
  check(viewof testCheckboxAll, "a", true)
  check(viewof testCheckboxAll, "b", true)
  check(viewof testCheckboxAll, "ALL", true)
  expect(viewof testCheckboxAll.value).toEqual(["a", "b", "ALL"])
  check(viewof testCheckboxAll, "ALL", false)
  expect(viewof testCheckboxAll.value).toEqual([])
})
```

```js
checkboxTests.test("Untick a cascades to ALL", () => {
  check(viewof testCheckboxAll, "a", true)
  check(viewof testCheckboxAll, "b", true)
  check(viewof testCheckboxAll, "ALL", true)
  expect(viewof testCheckboxAll.value).toEqual(["a", "b", "ALL"])
  check(viewof testCheckboxAll, "a", false)
  expect(viewof testCheckboxAll.value).toEqual(["b"])
})
```

```js echo
viewof testCheckboxAll.querySelector("form").dispatchEvent(new Event('input', {bubbles: true}))
```

```js echo
viewof testCheckboxAll.querySelector("input[value=ALL]")
```

```js
md`### Summary`
```

```js echo
colorBoxStyle = html`<style>
  .color-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background-color: #ccc;
    height: 2rem;
    width: 2rem;
    border-radius: .25rem;
    font-weight: bold;
    color: white;
    border: 1px solid rgba(0,0,0,0.05);
  }

  .color-box--lg {
    height: 2.5rem;
    width: 2.5rem;
  }
</style>`
```

```js echo
summary = ({
  label,
  score,
  counter_group,
  counter_value = undefined
} = {}) => {
  counter_value = counter_value && Number.parseInt(counter_value)
  const counterName = `yiwkmotksl-${counter_group}`;
  if (!window[counterName]) { // Initialize counter if its not been started
      window[counterName] = counter_value || 1;
  }
  counter_value = counter_value || window[counterName]; // Ensure we have a counter value
  window[counterName] = counter_value + 1; // Increment counter now we used it
  
  const colorVar = variable(scoreColor(score));
  const textColorVar = variable(contrastTextColor(colorVar))
  const ui = view`<div class="[ flex items-center mv2 ][ sans-serif ]">
  <div class="[ flex items-center w-100 ]">
    <div class="b mr2">${['numbering', textNodeView((counter_group || '') + (counter_value + ''))]}</div> 
    <div class="[ lh-title mid-gray ][ pr2 mr-auto ]">${['label', textNodeView(label)]}</div>
  </div>
  <div class="color-box f6" style="background-color: ${['color', colorVar]}; color: ${['text-color', textColorVar]}">
    <span>${['score', textNodeView(score)]}<span>
  </div>
</div>
`

  ui.calculate = (scores) => {
    ui.value.score = d3.sum(scores);
    ui.score.dispatchEvent(new Event('input', {bubbles: true}))
  }
  
  bindOneWay(colorVar, ui.score, {
    transform: () => {
      return scoreColor(ui.value.score);
    }
  })
  
  colorVar.addEventListener('assign', () => {
    ui.querySelector(".color-box").style['background-color'] = colorVar.value;
    ui.querySelector(".color-box").style['color'] = contrastTextColor(colorVar.value);
  })
  
  return ui;
}
```

```js echo
exampleSummary
```

```js
viewof exampleSummary = summary({
  color: 'red',
  label: `Accomodate needs for PWQ`,
  score: 2,
  counter_value: 2,
  counter_group: 'AE',
})
```

```js
Inputs.bind(Inputs.range([0, 5], {label: 'score', step: 0.1}), viewof exampleSummary.score)
```

```js
viewof exampleSummaryNext = summary({
  color: 'red',
  label: `Accomodate needs for PWQ and some more very long text to stress test the component`,
  score: 2,
  counter_group: 'AE',
})
```

```js
scoreColor(3)
```

```js echo
contrastTextColor = (color) => d3.lab(color).l < 70 ? "#fff" : "#000"
```

```js echo
contrastTextColor("#eeeeee")
```

```js echo
contrastTextColor("#006837")
```

```js echo
scoreColor = (score) => d3.scaleLinear()
    .domain([0, 0.1, 1, 2, 3, 4, 5])
    // Earlier 0 -> '#EEEEEE', '#0000EA','#7F17D9','#CF2B92','#E577B8','#F6BECB' <- 5
    // Color scale from https://colorbrewer2.org/#type=sequential&scheme=YlGn&n=5
    .range([
  '#0000ff', // '#EEEEEE', // 0
  '#4800ff', // '#ffffcc', // 0.1
  '#5d00ff', // '#ffffcc', // 1
  '#8900e1', // '#c2e699', // 2
  '#e00095', // '#78c679', // 3
  '#f66fbb', // '#31a354', // 4
  '#ffbccb', // '#006837'  // 5
]).clamp(true)(score);
```

```js
md`### Aggregate Summary`
```

```js echo
FileAttachment("image@1.png").image()
```

```js
viewof exampleAggregateSummary = aggregateSummary({
  label: 'Organizational Policies',
  score: 3.08423423423422,
  set: 'org'
})
```

```js
Inputs.bind(Inputs.range([0, 5], {label: 'score', step: 0.1}), viewof exampleAggregateSummary.score)
```

```js
aggregateSummary({
  label: 'Organizational Policies and a very long label to stress test this component',
  set: 'org'
})
```

```js echo
aggregateSummaryStyle = html`<style>
  .aggregate-summary {}  
</style>`
```

```js echo
aggregateSummary = ({
  label,
  score = 0,
  prependScoreLevel = "L"
} = {}) => {
  const scoreLevel = (score) => Math.ceil(score);
  const colorVar = variable(scoreColor(score));
  const textColorVar = variable(contrastTextColor(colorVar))
  const ui = view`<div class="[ aggregate-summary ][ flex items-center mv2 ][ sans-serif ]">
  <div class="flex items-center w-100">
    <div class="[ aggregate-summary__title ][ b lh-title ][ mr-auto pr3 ]">${['label', textNodeView(label)]}</div>
    <div class="[ aggregate-summary__score ][ mid-gray mr3 ]">${['score', textNodeView(+score.toFixed(2))]}</div>
  </div>
  <div class="color-box color-box--lg" style="background-color: ${['color', colorVar]}; color: ${['text-color', textColorVar]}">
    <span>${['prependScoreLevel', textNodeView(prependScoreLevel)]}${['level', textNodeView(scoreLevel(score))]}<span>
  </div>
</div>`
  
  ui.calculate = (scores) => {
    ui.value.score = +d3.mean(scores).toFixed(2);
    ui.value.level = scoreLevel(ui.value.score);
    ui.score.dispatchEvent(new Event('input', {bubbles: true}))
  }
  
  bindOneWay(colorVar, ui.score, {
    transform: () => {
      return scoreColor(ui.value.score);
    }
  });
  
  colorVar.addEventListener('assign', () => {
    ui.querySelector(".color-box--lg").style['background-color'] = colorVar.value;
    ui.querySelector(".color-box").style['color'] = contrastTextColor(colorVar.value);
  })
  
  return ui;
}
```

### Pagination

```js echo
viewof samplePagination1 = pagination({
  previous: 'prev',
  next: 'next',
  hashPrefix: "foo"
})
```

```js echo
viewof samplePagination2 = pagination({
  previous: 'prev',
  previousLabel: "Previous",
  hashPrefix: "foo"
})
```

```js echo
viewof samplePagination3 = pagination({
  next: 'next',
  nextLabel: 'Next',
  hashPrefix: "foo"
})
```

```js echo
viewof samplePagination4 = {
  const p = pagination({
  previous: 'prev',
  next: 'next',
  hashPrefix: "foo"
});

  return html`<div style="overflow-y: auto; height: 300px;">
  <div class="[ bg-light-gray ]">
    <div style="height: 400px"></div>
    <div class="[ bg-white pa2 ][ sticky bottom-0 ]">
      ${p}
    </div>
  </div>
</div>`;
}
```

```js echo
pagination = ({previous, next, hashPrefix = "", previousLabel = "← Go back", nextLabel ="Proceed →"} = {}) => {
  const prevLink = previous ? html`<a class="[ pagination_previous ][ brand no-underline underline-hover ]" href="#${hashPrefix}${previous}">${previousLabel}</a>` : "";
  const nextLink = next ? html`<a class="[ pagination_next ][ ml-auto pv2 ph3 br1 ][ bg-brand text-on-brand hover-bg-accent no-underline ]" href="#${hashPrefix}${next}">${nextLabel}</a>` : "";

  return html`<nav class="[ pagination ][ f5 ][ flex items-center ]">
  ${prevLink} ${nextLink}
</nav>`
}
```

```js
md`## Component Styles`
```

```js echo
ns = Inputs.text().classList[0]
```

```js echo
styles = html`<style>
  ${colorBoxStyle.innerHTML}
  ${aggregateSummaryStyle.innerHTML}
  ${tableStyles.innerHTML}
  ${formInputStyles.innerHTML}
</style>`
```

### Inputs

```js echo
formInputStyles = html`<style>
/* For @jashkenas/inputs */
/* Important seems to be the only way to override inline styles */
form label[style] {
  font-size: 1rem !important;
  display: block !important;
}

form div div,
form label[style] {
  line-height: var(--lh-copy, 1.3) !important; /* .lh-copy */
  margin: 0 !important;
}

form div + label[style], 
form label[style] + label[style], 
form label[style] + button + div,
form label[style] + div { 
  margin-top: var(--spacing-small, .5rem) !important;
} 

form textarea[style] {
  width: 100% !important;
}

form[data-form-type="checkbox-plus-plus"] label[style] ,
form[data-form-type="clearable-radio"] label[style] {
  display: grid !important;
  grid-template-columns: 1em auto;
  gap: var(--spacing-extra-small, .25rem);
  align-items: start;
}

form[data-form-type="clearable-radio"] input[type="radio"],
form[data-form-type="checkbox-plus-plus"] input[type="checkbox"] {
  margin-left: 0 !important;
  margin-top: 0.25rem !important;
}

form[data-form-type="clearable-radio"] div {
  grid-template-columns: 1fr minmax(120px, max-content);
  grid-gap: 0 1rem;
  grid-auto-flow: column;
}

form[data-form-type="clearable-radio"] div > *  {
  grid-column: 1;
}

form[data-form-type="clearable-radio"] div > div:first-child,
form[data-form-type="clearable-radio"] div > div:last-child {
  grid-column: 1/-1;
}

form[data-form-type="clearable-radio"] div > button  {
  grid-column: 2;
  align-self: start;
  justify-self: end;
}

form[data-form-type="clearable-radio"] div > button {
  margin-top: .5rem;
}

@media screen and (min-width: 30em) {
  form[data-form-type="clearable-radio"] > div {
    display: grid;
  }
}

.secondary-button {
  font-size: .875rem; /* .f6 */
  border: 1px solid currentColor;
  padding: var(--spacing-extra-small);
  color: var(--brand) !important;
  background-color: white;
  font-family: var(--brand-font);
  border-radius: var(--border-radius-1);
}

.secondary-button:hover,
.secondary-button:focus,
.secondary-button:active {
  background-color: #f4f4f4; /* near-white */
}

.secondary-button[disabled] {
  color: #999 !important; 
  background-color: white;
  cursor: not-allowed;
}

/* For @observable/inputs */
form.${ns} label {
  display: block;
}
</style>`
```

```js
md`## Logic`
```

```js
md`### Bind logic`
```

```js echo
setTypes = ["", "yes", "yesnomaybe", "ifyes", "ifno"]
```

```js
expandSets = (layout) => layout.reduce((acc, row, index) => {
  const sets = row.set.split(",")
  const roles = row.role.split(",")
  if (sets.length != roles.length) throw new Error(`${row.cell_name} is mismatched in sets and roles: ${JSON.stringify(row)}`)
  sets.forEach((set, i) => acc.push({
    ...row,
    index,
    set: set.trim(),
    role: roles[i].trim()
  }))
  return acc;
}, [])
```

```js echo
 d3.group(expandSets(example_multi_set_layout), d => d['set'], d => d['role']);
```

```js echo
example_multi_set_layout
```

```js echo
example_aggregate_scores_layout
```

```js echo
example_multi_set_questions
```

```js echo
example_aggregate_scores_layout
```

```js echo
function bindLogic(controlsById, layouts) {
  const cellOrder = layouts.reduce((acc, layout, index) => {
    acc[layout.id] = index
    return acc;
  }, {})
  
  const layoutByCodeByType = d3.group(expandSets(layouts), d => d['set'], d => d['role']);
  [...layoutByCodeByType.keys()].forEach(code => {
    const layoutByType = layoutByCodeByType.get(code);
    
    let conditionQuestion = undefined;
    let answer = undefined;
    
    if (layoutByType.has("yes")) {
      if (layoutByType.get("yes").length > 1) throw new Error("Only one yes per set code") 
      const id = layoutByType.get("yes")[0].id;
      conditionQuestion = controlsById.get(id);
      answer = (v) => v ? "yes" : "no"
    }
    
    // detect conditionals questions
    if (layoutByType.has("yesno")) {
      if (conditionQuestion) throw new Error("Only one condition question per set code") 
      const id = layoutByType.get("yes")[0].id;
      conditionQuestion = controlsById.get(id);
      answer = (v) => {
        if (/^yes/i.exec(v)) return "yes";
        if (/^no/i.exec(v)) return "no";
        return "maybe"
      }
    }
    
    if (layoutByType.has("yesnomaybe")) {
      if (conditionQuestion) throw new Error("Only one condition question per set code") 
      const id = layoutByType.get("yesnomaybe")[0].id;
      conditionQuestion = controlsById.get(id);
      answer = (v) => {
        if (/^yes/i.exec(v)) return "yes";
        if (/^no/i.exec(v)) return "no";
        return "maybe"
      }
    }
    // conditionals
    if (conditionQuestion) {
      if (layoutByType.has("ifyes")) {
        layoutByType.get("ifyes").forEach(layout => {
          const question = controlsById.get(layout.id)
          if (question) bindOneWay(question.hidden, conditionQuestion.control, {
            transform: (v) => !(answer(v) === "yes")
          });
        })
      }

      if (layoutByType.has("ifno")) {
        layoutByType.get("ifno").forEach(layout => {
          const question = controlsById.get(layout.id)
          if (question) bindOneWay(question.hidden, conditionQuestion.control, {
            transform: (v) => !(answer(v) === "no")
          });
        })
      }
    }  
    
    
    // wire up calculations
    (layoutByType.get("calculation") || []).forEach(calculationLayout => {
      const calculationQuestion = controlsById.get(calculationLayout.id);
      const scoredQuestions = [...layoutByType.entries()]
        .filter(([type, layouts]) => type !== "calculation") 
        .flatMap(([type, layouts]) => layouts.map(l => {
          const q = controlsById.get(l.id)
          q.args.id = l.id
          return q;
        }));
      
      const calculate = () => {
        const scores = scoredQuestions.map(q => scoreQuestion(q));
        calculationQuestion.control.calculate(scores);
      };
        
      try {
        calculate();
      } catch (err) {
        console.error(`Problem updating calculation '${calculationLayout.id}', reason: ${err.message}`)
        throw err
      }
      // If the calculation is numbered, back write numbering to the inputs
      if (calculationQuestion.control.numbering) {
        try {
          const firstIndex = Math.min(...scoredQuestions.map(q => cellOrder[q.args.id]));
          const firstId = layouts[firstIndex].id;
          const question = controlsById.get(firstId);
          question.numbering.value = calculationQuestion.control.numbering.value;
        } catch (err) {
          debugger;
        }
      }
      
      
      scoredQuestions.forEach(q => {
        q.control.addEventListener('input', calculate);
        invalidation.then(() => q.control.removeEventListener('input', calculate))
      })
    
    })
  })
}
```

```js
function exampleLogic(questions, layout) {
  const controlsById = new Map(questions.map(q => [q.id, createQuestion(q)]))
  bindLogic(controlsById, layout)
  return view`<div>
    ${['questions', [...controlsById.values()]]}
  `
}
```

```js
md`### Example 1: yes, ifyes, ifno`
```

```js
example_yes_ifyes_layout = [{
  id: "open",
  role: "yes",
  set: "a",
}, {
  id: "expand1",
  role: "ifyes",
  set: "a",
}, {
  id: "expand2",
  role: "ifno",
  set: "a",
}] 
```

```js
example_yes_ifyes_questions = [{
  id: "open",
  type: "checkbox",
  options: ["Electricity Generation"]
}, {
  id: "expand1",
  type: "textarea",
  placeholder: "Specifiy type(s) of generation project.",
  rows:  1,
}, {
  id: "expand2",
  type: "textarea",
  placeholder: "Explain why not",
  rows:  1,
}] 
```

```js echo
exampleLogic(example_yes_ifyes_questions, example_yes_ifyes_layout)
```

```js
md`### Example 2: yesnomaybe, ifyes, ifno`
```

```js
example_yesnomaybe_ifyes_layout = [{
  id: "open",
  role: "yesnomaybe",
  set: "a",
}, {
  id: "expand1",
  role: "ifyes",
  set: "a",
}, {
  id: "expand2",
  role: "ifno",
  set: "a",
}] 
```

```js
example_yesnomaybe_ifyes_questions = [{
  id: "open",
  type: "radio",
  options: ["Yes.", "no", "dunno"]
}, {
  id: "expand1",
  type: "textarea",
  placeholder: "Specifiy type(s) of generation project.",
  rows:  1,
}, {
  id: "expand2",
  type: "textarea",
  placeholder: "Explain why not",
  rows:  1,
}] 
```

```js echo
exampleLogic(example_yesnomaybe_ifyes_questions, example_yesnomaybe_ifyes_layout)
```

```js
md`### Example 3: score`
```

```js echo
example_score_layout = [{
  id: "score",
  role: "scored",
  set: "A0.",
}, {
  id: "output",
  role: "calculation",
  set: "A0.",
}] 
```

```js
example_score_questions = [
  JSON.parse(`{"id":"score","type":"radio","title":"If yes:","options_eval":["{value:\\"a\\",score: \\"3\\", label: \\"We have a technical skills training program for our officials and staff.\\"}","{value:\\"b\\",score: \\"4\\", value:\\"b\\",label: \\"We implement a technical skills training program, still less than 60%.\\"}","{value:\\"c\\",score: \\"5\\", label: \\"We implement a technical skills training program for our officials and staff, 60% or more have been trained.\\"}"],"description":"Please select the statement that best describes your organization."}`),
  {
    id: "output",
    type: "summary",
    counter_group: "A",
    counter_value: 0,
    label: "this is the sum of the scores: ",
  }
]
```

```js echo
viewof exampleScoreGroup = exampleLogic(example_score_questions, example_score_layout)
```

```js
md`### Example 3b: scored conditional`
```

```js
example_scored_conditional_questions = [{
  id: "open",
  type: "radio",
  options: ["Yes.", "no", "dunno"]
}, {
  id: "expand1",
  type: "radio",
  options: [
    {score: "5", label: "5", value: 'yes'}, 
    {score: "4", label: "4", value: 'no'},
    {score: 3, label: "3", value: 'unknown'}]

}, {
  id: "expand2",
  type: "radio",
  options: [
    {score: "5.1", label: "5.1", value: 'yes'}, 
    {score: "4.1", label: "4.1", value: 'no'},
    {score: 3.1, label: "3.1", value: 'unknown'}]

},
  {
    id: "output",
    counter_group: "count",
    type: "summary",
    label: "this is the sum of the scores: ",
  }
]
```

```js
example_scored_conditional_layout = [{
  id: "open",
  role: "yesnomaybe",
  set: "a",
}, {
  id: "expand1",
  role: "ifyes",
  set: "a",
}, {
  id: "expand2",
  role: "ifno",
  set: "a",
}, {
  id: "output",
  role: "calculation",
  set: "a",
}] 
```

```js echo
viewof exampleScoredConditionalGroup = exampleLogic(example_scored_conditional_questions, example_scored_conditional_layout)
```

```js
md`### Example 4: multiple sets`
```

```js
example_multi_set_layout = [{
  id: "open",
  role: "yesnomaybe, scored",
  set: "a, A1.",
}, {
  id: "expand1",
  role: "ifyes,scored",
  set: "a, A1.",
}, {
  id: "expand2",
  role: "ifno,scored",
  set: "a, A1.",
}, {
  id: "score",
  role: "calculation",
  set: "A1.",
}] 
```

```js
example_multi_set_questions = [{
  id: "open",
  type: "radio",
  options: [
    {score: "5", label: "Yes.", value: 'yes'}, 
    {score: "4", label: "Nope", value: 'no'},
    {score: 3, label: "Don't know.", value: 'unknown'}]
}, {
  id: "expand1",
  type: "textarea",
  placeholder: "Specifiy type(s) of generation project.",
  rows:  1,
}, {
  id: "expand2",
  type: "textarea",
  placeholder: "Explain why not",
  rows:  1,
}, {
  id: "score",
  type: "summary",
  label:  "overall score: ",
}] 
```

```js echo
viewof exampleMultiSetGroup = exampleLogic(example_multi_set_questions, example_multi_set_layout)
```

```js
md`### Example 5: aggregate scores`
```

```js
example_aggregate_scores_layout = [{
  id: "q1",
  role: "scored",
  set: "1",
}, {
  id: "q2",
  role: "scored,scored",
  set: "2,aggregate",
}, {
  id: "s1",
  role: "calculation,scored",
  set: "1,aggregate",
}, {
  id: "s2",
  role: "calculation",
  set: "2",
}, {
  id: "aggregate",
  role: "calculation",
  set: "aggregate",
}] 
```

```js
example_aggregate_scores_questions = [{
  id: "q1",
  type: "radio",
  options: [
    {score: "5", label: "Yes.", value: 'yes'}, 
    {score: "4", label: "Nope", value: 'no'},
    {score: 3, label: "Don't know.", value: 'unknown'}]
}, {
  id: "q2",
  type: "radio",
  options: [
    {score: "5", label: "Yes.", value: 'yes'}, 
    {score: "4", label: "Nope", value: 'no'},
    {score: 3, label: "Don't know.", value: 'unknown'}]
},{
  id: "s1",
  type: "summary",
  label:  "score 1: ",
},{
  id: "s2",
  type: "summary",
  label:  "score 2: ",
},{
  id: "aggregate",
  type: "aggregate",
  label:  "aggregate of 1 & 2: ",
}] 
```

```js
viewof exampleAggregateScoreGroup = {
  debugger;
  exampleLogic(example_aggregate_scores_questions, example_aggregate_scores_layout)
}
```

```js
md`## Styles for demo

Including Tachyons for the demo here`
```

```js echo
// This config needs to be part of account or survey config
brandConfig = ({
  colors: {
    brand: mainColors[900], // or, provide and color hex code
    accent: accentColors[900], // or, provide and color hex code
    // The color of text which are usually displayed on top of the brand or accent colors.
    "text-on-brand": "#ffffff",
  },
  fonts: {
    "brand-font": `"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`
  }
})
```

```js echo
initializeStyles = () => tachyonsExt(brandConfig)
```

```js echo
initializeStyles()
```

```js echo
stylesForNotebooks = html`<style>
a[href].pagination_next {
  color: var(--text-on-brand) !important;
}

a[href].pagination_next:hover {
  text-decoration: none;
}`
```

```js
md`## Imports`
```

```js
import {checkbox as checkboxBase, textarea, radio as radioBase, text, number, file} from "@jashkenas/inputs"
```

```js
import {view, bindOneWay, variable, cautious} from '@tomlarkworthy/view'
```

```js
import {viewroutine, ask} from '@tomlarkworthy/viewroutine'
```

```js
import {toc} from "@nebrius/indented-toc"
```

```js
import {download} from '@mbostock/lazy-download'
```

```js
import {mainColors, accentColors} from "@categorise/brand"
```

```js
import {tachyonsExt} from "@categorise/tachyons-and-some-extras"
```

```js
import {textNodeView} from "@categorise/surveyslate-common-components"
```

```js

import {createSuite, expect} from '@tomlarkworthy/testing'
```

---

```js
import { substratum } from "@categorise/substratum"
```

```js
substratum({ invalidation })
```
