import define1 from "./e93997d5089d7165@2303.js";
import define2 from "./f92778131fd76559@1208.js";
import define3 from "./4a1fa3c167b752e5@324.js";
import define4 from "./9bed702f80a3797e@402.js";
import define5 from "./92c1d80f07680c57@78.js";
import define6 from "./b5327e6e2ddcad75@102.js";
import define7 from "./8d0bf24a1c2d5359@657.js";
import define8 from "./6a35be87fa9e4ba9@291.js";
import define9 from "./c7a3b20cec5d4dd9@730.js";
import define10 from "./bad810ff1e80611b@137.js";

function _1(md){return(
md`# Survey Slate | Survey Components

_Reusable code components for survey development._
`
)}

function _2(md,width){return(
md`
<div style="max-width: ${width/1.75}px; margin: 30px 0; padding: 15px 30px; background-color: #e0ffff; font: 700 18px/24px sans-serif;">👋 Welcome!  This notebook is about **Survey Slate**&mdash;an [assemblage of Observable web-based notebooks](https://observablehq.com/collection/@categorise/survey-slate) allowing organizations to host custom surveys for end users on their own AWS infrastructure.  Check out the [Technical Overview](https://observablehq.com/@categorise/surveyslate-docs) to get started! ✨</div>

<!-- Notification design borrowed from https://observablehq.com/@jashkenas/inputs -->
`
)}

function _3(toc){return(
toc()
)}

function _4(md){return(
md`## Config`
)}

function _config(){return(
{
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
}
)}

function _6(md){return(
md`## Questions`
)}

function _7(md){return(
md`Every cell is wrapped so we can apply cross-cutting features like visibility and numbering to all controls`
)}

function _questionWrapper(variable,view,textNodeView){return(
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
)}

function _reifyAttributes(md){return(
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
)}

function _createQuestion(reifyAttributes,htl,md,checkbox,textarea,radio,number,table,file_attachment,summary,aggregateSummary,questionWrapper){return(
(q, index, options) => {
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
)}

function _example_q(createQuestion)
{
  return createQuestion(JSON.parse(`{"id":"viewof borrower_GESI_support_equal_pay","type":"radio","title":"Do you provide equal pay for work of equal value of women and men?","options":[{"value":"No","label":"No"},{"value":"Yes","label":"Yes"}],"value":"savedFormData.borrower_GESI_support_equal_pay"}`))
}


function _12(example_q){return(
example_q.numbering = "34."
)}

function _13($0){return(
$0
)}

function _scoreQuestion(){return(
(q) => {
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
)}

function _15(md){return(
md`### TextNodeView

Moved to [Common Components](https://observablehq.com/@categorise/common-components?collection=@categorise/gesi-survey#cell-212)`
)}

function _16(md){return(
md`### Table`
)}

function _id(){return(
() => Math.random().toString(36).substr(2, 9)
)}

function _table(textNodeView,Inputs,Event,view,md,htl,cautious,id){return(
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
)}

function _19(exampleTable){return(
exampleTable
)}

function _tableStyles(html,ns){return(
html`<style>
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
)}

function _exampleTable(table,htl,md){return(
table({
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
})
)}

function _22(exampleTable){return(
exampleTable
)}

function _userEditableTableExample(createQuestion){return(
createQuestion({
  type: 'table',
  value: {
    "indigenous": {label: "Indigenous Peoples", w: 3, m: 12, unknown: 5, other: 4}
  },
  columns_eval: `[{key: "w", label:"Women / Female", total: "women"}, {key: "m", label:"Men / Male", total: "men"}, {key: "other", label: "Third Gender", total: "third gender"}, {key: "unknown", label: "No Data", total: "no data"}]`,
  rows_eval: `[{key: "indigenous", label:"Indigenous Peoples"}, {key: "disabled", label:"Workers with Disabilities (under Indian law)"},{key: "userdefined1", label:"TODO user editable"}]`,
  user_rows: true,
  table_total_label: '<br>people',
  caption_md: `<small>_**Excluded and Vulnerable Groups** ...._</small>`
})
)}

function _24(userEditableTableExample){return(
userEditableTableExample
)}

function _basicTable(table){return(
table({
  
  value: {
    "cool": {label:"very cool", c1: "27"}
  },
  columns: [{key: "c1", label: "c1"}], rows: [{key: "r1", label: "r1"}], user_rows: true})
)}

function _26(basicTable){return(
basicTable
)}

function _27(Inputs,$0,Event){return(
Inputs.button("backwrite", {
  reduce: () => {
    $0.value = {"r1": {label: "r1", "c1": "3"}, "r2": {label: "r1", "c1": "2"}};
    $0.dispatchEvent(new Event('input', {bubbles: true}))
  }
})
)}

function _28(md){return(
md`### File attachment`
)}

function _file_attachment(view,textNodeView,download,viewroutine,file,ask,_,Event,md){return(
(options) => {
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
)}

function _exampleFileAttachment(createQuestion)
{
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


function _31(exampleFileAttachment){return(
exampleFileAttachment
)}

function _32(md){return(
md`### Clearable Radio
`
)}

function _radioExamples2(radio){return(
radio({
  title: "A very long non sensical question to check the wrapping and layout of this component? A very long non sensical question.",
  options: [ 
    "cool",
    "Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring"
  ],
  value: "cool",
  description: "A slightly long and meaningless description to go with the options"
})
)}

function _radioExample(radio){return(
radio({
  options: ["cool", "not cool"]
})
)}

function _35(radioExample){return(
radioExample
)}

function _36($0){return(
$0
)}

function _radio(radioBase,html,Event,invalidation){return(
(args) => {
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
)}

function _38(md){return(
md`### textarea`
)}

function _exampleTextarea(textarea){return(
textarea({
  title: "title",
  description: "description",
  placeholder: "placeholder"
})
)}

function _40(md){return(
md`### Checkbox++

Includes a scoring function that has to be accessed through the view
`
)}

function _checkbox(checkboxBase,view,Event){return(
(options) => {
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
)}

function _exampleCheckboxPlus(checkbox){return(
checkbox({
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
)}

function _43(exampleCheckboxPlus){return(
exampleCheckboxPlus
)}

function _exampleCheckboxWithSpaces(checkbox){return(
checkbox({
  includeNoneOption: {label: "", score: 0},
  includeAllOption: {label: "YES ALL", score: 4},
  options: [
    {value: 'a b', label: "A", score: 1},
    {value: 'b', label: "B", score: 2}
  ], 
  value: ['a b'],
  description: "A slightly long and meaningless description to go with the options"
})
)}

function _45(exampleCheckboxWithSpaces){return(
exampleCheckboxWithSpaces
)}

function _checkboxTests(createSuite){return(
createSuite({
  name: "checkbox tests",
  timeout_ms: 1000
})
)}

function _testCheckboxAll(checkbox){return(
checkbox({
    includeAllOption: {label: "ALL"},
    options: [
      {value: 'a', label: "A"},
      {value: 'b', label: "B"}
    ],
  })
)}

function _check(Event){return(
function check(checkbox, value, checked = true) {
  const option = checkbox.querySelector(`input[value=${value}]`);
  if (!option) throw new Error("Could not find " + value + " in options");
  option.checked = checked
  option.dispatchEvent(new Event('change', {bubbles: true}))
}
)}

function _49(checkboxTests,check,$0,expect){return(
checkboxTests.test("Tick ALL cascades", () => {
  check($0, "a", false)
  check($0, "b", false)
  check($0, "ALL", true)
  expect($0.value).toEqual(["a", "b", "ALL"])
})
)}

function _50(checkboxTests,check,$0,expect){return(
checkboxTests.test("Tick a and b cascades to ALL", () => {
  check($0, "ALL", false)
  check($0, "a", true)
  check($0, "b", true)
  expect($0.value).toEqual(["a", "b", "ALL"])
})
)}

function _51(checkboxTests,check,$0,expect){return(
checkboxTests.test("Untick ALL cascades", () => {
  check($0, "a", true)
  check($0, "b", true)
  check($0, "ALL", true)
  expect($0.value).toEqual(["a", "b", "ALL"])
  check($0, "ALL", false)
  expect($0.value).toEqual([])
})
)}

function _52(checkboxTests,check,$0,expect){return(
checkboxTests.test("Untick a cascades to ALL", () => {
  check($0, "a", true)
  check($0, "b", true)
  check($0, "ALL", true)
  expect($0.value).toEqual(["a", "b", "ALL"])
  check($0, "a", false)
  expect($0.value).toEqual(["b"])
})
)}

function _53($0,Event){return(
$0.querySelector("form").dispatchEvent(new Event('input', {bubbles: true}))
)}

function _54($0){return(
$0.querySelector("input[value=ALL]")
)}

function _55(md){return(
md`### Summary`
)}

function _colorBoxStyle(html){return(
html`<style>
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
)}

function _summary(variable,scoreColor,contrastTextColor,view,textNodeView,d3,Event,bindOneWay){return(
({
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
)}

function _58(exampleSummary){return(
exampleSummary
)}

function _exampleSummary(summary){return(
summary({
  color: 'red',
  label: `Accomodate needs for PWQ`,
  score: 2,
  counter_value: 2,
  counter_group: 'AE',
})
)}

function _60(Inputs,$0){return(
Inputs.bind(Inputs.range([0, 5], {label: 'score', step: 0.1}), $0.score)
)}

function _exampleSummaryNext(summary){return(
summary({
  color: 'red',
  label: `Accomodate needs for PWQ and some more very long text to stress test the component`,
  score: 2,
  counter_group: 'AE',
})
)}

function _62(scoreColor){return(
scoreColor(3)
)}

function _contrastTextColor(d3){return(
(color) => d3.lab(color).l < 70 ? "#fff" : "#000"
)}

function _64(contrastTextColor){return(
contrastTextColor("#eeeeee")
)}

function _65(contrastTextColor){return(
contrastTextColor("#006837")
)}

function _scoreColor(d3){return(
(score) => d3.scaleLinear()
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
]).clamp(true)(score)
)}

function _67(md){return(
md`### Aggregate Summary`
)}

function _68(FileAttachment){return(
FileAttachment("image@1.png").image()
)}

function _exampleAggregateSummary(aggregateSummary){return(
aggregateSummary({
  label: 'Organizational Policies',
  score: 3.08423423423422,
  set: 'org'
})
)}

function _70(Inputs,$0){return(
Inputs.bind(Inputs.range([0, 5], {label: 'score', step: 0.1}), $0.score)
)}

function _71(aggregateSummary){return(
aggregateSummary({
  label: 'Organizational Policies and a very long label to stress test this component',
  set: 'org'
})
)}

function _aggregateSummaryStyle(html){return(
html`<style>
  .aggregate-summary {}  
</style>`
)}

function _aggregateSummary(variable,scoreColor,contrastTextColor,view,textNodeView,d3,Event,bindOneWay){return(
({
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
)}

function _74(md){return(
md`### Pagination`
)}

function _samplePagination1(pagination){return(
pagination({
  previous: 'prev',
  next: 'next',
  hashPrefix: "foo"
})
)}

function _samplePagination2(pagination){return(
pagination({
  previous: 'prev',
  previousLabel: "Previous",
  hashPrefix: "foo"
})
)}

function _samplePagination3(pagination){return(
pagination({
  next: 'next',
  nextLabel: 'Next',
  hashPrefix: "foo"
})
)}

function _samplePagination4(pagination,html)
{
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


function _pagination(html){return(
({previous, next, hashPrefix = "", previousLabel = "← Go back", nextLabel ="Proceed →"} = {}) => {
  const prevLink = previous ? html`<a class="[ pagination_previous ][ brand no-underline underline-hover ]" href="#${hashPrefix}${previous}">${previousLabel}</a>` : "";
  const nextLink = next ? html`<a class="[ pagination_next ][ ml-auto pv2 ph3 br1 ][ bg-brand text-on-brand hover-bg-accent no-underline ]" href="#${hashPrefix}${next}">${nextLabel}</a>` : "";

  return html`<nav class="[ pagination ][ f5 ][ flex items-center ]">
  ${prevLink} ${nextLink}
</nav>`
}
)}

function _80(md){return(
md`## Component Styles`
)}

function _ns(Inputs){return(
Inputs.text().classList[0]
)}

function _styles(html,colorBoxStyle,aggregateSummaryStyle,tableStyles,formInputStyles){return(
html`<style>
  ${colorBoxStyle.innerHTML}
  ${aggregateSummaryStyle.innerHTML}
  ${tableStyles.innerHTML}
  ${formInputStyles.innerHTML}
</style>`
)}

function _83(md){return(
md`### Inputs`
)}

function _formInputStyles(html,ns){return(
html`<style>
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
)}

function _85(md){return(
md`## Logic`
)}

function _86(md){return(
md`### Bind logic`
)}

function _setTypes(){return(
["", "yes", "yesnomaybe", "ifyes", "ifno"]
)}

function _expandSets(){return(
(layout) => layout.reduce((acc, row, index) => {
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
)}

function _89(d3,expandSets,example_multi_set_layout){return(
d3.group(expandSets(example_multi_set_layout), d => d['set'], d => d['role'])
)}

function _90(example_multi_set_layout){return(
example_multi_set_layout
)}

function _91(example_aggregate_scores_layout){return(
example_aggregate_scores_layout
)}

function _92(example_multi_set_questions){return(
example_multi_set_questions
)}

function _93(example_aggregate_scores_layout){return(
example_aggregate_scores_layout
)}

function _bindLogic(d3,expandSets,bindOneWay,scoreQuestion,invalidation){return(
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
)}

function _exampleLogic(createQuestion,bindLogic,view){return(
function exampleLogic(questions, layout) {
  const controlsById = new Map(questions.map(q => [q.id, createQuestion(q)]))
  bindLogic(controlsById, layout)
  return view`<div>
    ${['questions', [...controlsById.values()]]}
  `
}
)}

function _96(md){return(
md`### Example 1: yes, ifyes, ifno`
)}

function _example_yes_ifyes_layout(){return(
[{
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
)}

function _example_yes_ifyes_questions(){return(
[{
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
)}

function _99(exampleLogic,example_yes_ifyes_questions,example_yes_ifyes_layout){return(
exampleLogic(example_yes_ifyes_questions, example_yes_ifyes_layout)
)}

function _100(md){return(
md`### Example 2: yesnomaybe, ifyes, ifno`
)}

function _example_yesnomaybe_ifyes_layout(){return(
[{
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
)}

function _example_yesnomaybe_ifyes_questions(){return(
[{
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
)}

function _103(exampleLogic,example_yesnomaybe_ifyes_questions,example_yesnomaybe_ifyes_layout){return(
exampleLogic(example_yesnomaybe_ifyes_questions, example_yesnomaybe_ifyes_layout)
)}

function _104(md){return(
md`### Example 3: score`
)}

function _example_score_layout(){return(
[{
  id: "score",
  role: "scored",
  set: "A0.",
}, {
  id: "output",
  role: "calculation",
  set: "A0.",
}]
)}

function _example_score_questions(){return(
[
  JSON.parse(`{"id":"score","type":"radio","title":"If yes:","options_eval":["{value:\\"a\\",score: \\"3\\", label: \\"We have a technical skills training program for our officials and staff.\\"}","{value:\\"b\\",score: \\"4\\", value:\\"b\\",label: \\"We implement a technical skills training program, still less than 60%.\\"}","{value:\\"c\\",score: \\"5\\", label: \\"We implement a technical skills training program for our officials and staff, 60% or more have been trained.\\"}"],"description":"Please select the statement that best describes your organization."}`),
  {
    id: "output",
    type: "summary",
    counter_group: "A",
    counter_value: 0,
    label: "this is the sum of the scores: ",
  }
]
)}

function _exampleScoreGroup(exampleLogic,example_score_questions,example_score_layout){return(
exampleLogic(example_score_questions, example_score_layout)
)}

function _108(md){return(
md`### Example 3b: scored conditional`
)}

function _example_scored_conditional_questions(){return(
[{
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
)}

function _example_scored_conditional_layout(){return(
[{
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
)}

function _exampleScoredConditionalGroup(exampleLogic,example_scored_conditional_questions,example_scored_conditional_layout){return(
exampleLogic(example_scored_conditional_questions, example_scored_conditional_layout)
)}

function _112(md){return(
md`### Example 4: multiple sets`
)}

function _example_multi_set_layout(){return(
[{
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
)}

function _example_multi_set_questions(){return(
[{
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
)}

function _exampleMultiSetGroup(exampleLogic,example_multi_set_questions,example_multi_set_layout){return(
exampleLogic(example_multi_set_questions, example_multi_set_layout)
)}

function _116(md){return(
md`### Example 5: aggregate scores`
)}

function _example_aggregate_scores_layout(){return(
[{
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
)}

function _example_aggregate_scores_questions(){return(
[{
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
)}

function _exampleAggregateScoreGroup(exampleLogic,example_aggregate_scores_questions,example_aggregate_scores_layout)
{
  debugger;
  exampleLogic(example_aggregate_scores_questions, example_aggregate_scores_layout)
}


function _120(md){return(
md`## Styles for demo

Including Tachyons for the demo here`
)}

function _brandConfig(mainColors,accentColors){return(
{
  colors: {
    brand: mainColors[900], // or, provide and color hex code
    accent: accentColors[900], // or, provide and color hex code
    // The color of text which are usually displayed on top of the brand or accent colors.
    "text-on-brand": "#ffffff",
  },
  fonts: {
    "brand-font": `"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`
  }
}
)}

function _initializeStyles(tachyonsExt,brandConfig){return(
() => tachyonsExt(brandConfig)
)}

function _123(initializeStyles){return(
initializeStyles()
)}

function _stylesForNotebooks(html){return(
html`<style>
a[href].pagination_next {
  color: var(--text-on-brand) !important;
}

a[href].pagination_next:hover {
  text-decoration: none;
}`
)}

function _125(md){return(
md`## Imports`
)}

function _135(md){return(
md`---`
)}

function _137(substratum,invalidation){return(
substratum({ invalidation })
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["image@1.png", {url: new URL("./files/7a3035b2a05fc30a5acc43ea8c44b1712b02fa76b9094db3758d9c893ec6fc2f0c6c644550951d5b08fd0c8cff4b133e345703c22e02a5ea0cbb36d38a3675fd.png", import.meta.url), mimeType: "image/png", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","width"], _2);
  main.variable(observer()).define(["toc"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("config")).define("config", _config);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("questionWrapper")).define("questionWrapper", ["variable","view","textNodeView"], _questionWrapper);
  main.variable(observer("reifyAttributes")).define("reifyAttributes", ["md"], _reifyAttributes);
  main.variable(observer("createQuestion")).define("createQuestion", ["reifyAttributes","htl","md","checkbox","textarea","radio","number","table","file_attachment","summary","aggregateSummary","questionWrapper"], _createQuestion);
  main.variable(observer("viewof example_q")).define("viewof example_q", ["createQuestion"], _example_q);
  main.variable(observer("example_q")).define("example_q", ["Generators", "viewof example_q"], (G, _) => G.input(_));
  main.variable(observer()).define(["example_q"], _12);
  main.variable(observer()).define(["viewof example_q"], _13);
  main.variable(observer("scoreQuestion")).define("scoreQuestion", _scoreQuestion);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("id")).define("id", _id);
  main.variable(observer("table")).define("table", ["textNodeView","Inputs","Event","view","md","htl","cautious","id"], _table);
  main.variable(observer()).define(["exampleTable"], _19);
  main.variable(observer("tableStyles")).define("tableStyles", ["html","ns"], _tableStyles);
  main.variable(observer("viewof exampleTable")).define("viewof exampleTable", ["table","htl","md"], _exampleTable);
  main.variable(observer("exampleTable")).define("exampleTable", ["Generators", "viewof exampleTable"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleTable"], _22);
  main.variable(observer("viewof userEditableTableExample")).define("viewof userEditableTableExample", ["createQuestion"], _userEditableTableExample);
  main.variable(observer("userEditableTableExample")).define("userEditableTableExample", ["Generators", "viewof userEditableTableExample"], (G, _) => G.input(_));
  main.variable(observer()).define(["userEditableTableExample"], _24);
  main.variable(observer("viewof basicTable")).define("viewof basicTable", ["table"], _basicTable);
  main.variable(observer("basicTable")).define("basicTable", ["Generators", "viewof basicTable"], (G, _) => G.input(_));
  main.variable(observer()).define(["basicTable"], _26);
  main.variable(observer()).define(["Inputs","viewof basicTable","Event"], _27);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("file_attachment")).define("file_attachment", ["view","textNodeView","download","viewroutine","file","ask","_","Event","md"], _file_attachment);
  main.variable(observer("viewof exampleFileAttachment")).define("viewof exampleFileAttachment", ["createQuestion"], _exampleFileAttachment);
  main.variable(observer("exampleFileAttachment")).define("exampleFileAttachment", ["Generators", "viewof exampleFileAttachment"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleFileAttachment"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("viewof radioExamples2")).define("viewof radioExamples2", ["radio"], _radioExamples2);
  main.variable(observer("radioExamples2")).define("radioExamples2", ["Generators", "viewof radioExamples2"], (G, _) => G.input(_));
  main.variable(observer("viewof radioExample")).define("viewof radioExample", ["radio"], _radioExample);
  main.variable(observer("radioExample")).define("radioExample", ["Generators", "viewof radioExample"], (G, _) => G.input(_));
  main.variable(observer()).define(["radioExample"], _35);
  main.variable(observer()).define(["viewof radioExample"], _36);
  main.variable(observer("radio")).define("radio", ["radioBase","html","Event","invalidation"], _radio);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer("viewof exampleTextarea")).define("viewof exampleTextarea", ["textarea"], _exampleTextarea);
  main.variable(observer("exampleTextarea")).define("exampleTextarea", ["Generators", "viewof exampleTextarea"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _40);
  main.variable(observer("checkbox")).define("checkbox", ["checkboxBase","view","Event"], _checkbox);
  main.variable(observer("viewof exampleCheckboxPlus")).define("viewof exampleCheckboxPlus", ["checkbox"], _exampleCheckboxPlus);
  main.variable(observer("exampleCheckboxPlus")).define("exampleCheckboxPlus", ["Generators", "viewof exampleCheckboxPlus"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleCheckboxPlus"], _43);
  main.variable(observer("viewof exampleCheckboxWithSpaces")).define("viewof exampleCheckboxWithSpaces", ["checkbox"], _exampleCheckboxWithSpaces);
  main.variable(observer("exampleCheckboxWithSpaces")).define("exampleCheckboxWithSpaces", ["Generators", "viewof exampleCheckboxWithSpaces"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleCheckboxWithSpaces"], _45);
  main.variable(observer("viewof checkboxTests")).define("viewof checkboxTests", ["createSuite"], _checkboxTests);
  main.variable(observer("checkboxTests")).define("checkboxTests", ["Generators", "viewof checkboxTests"], (G, _) => G.input(_));
  main.variable(observer("viewof testCheckboxAll")).define("viewof testCheckboxAll", ["checkbox"], _testCheckboxAll);
  main.variable(observer("testCheckboxAll")).define("testCheckboxAll", ["Generators", "viewof testCheckboxAll"], (G, _) => G.input(_));
  main.variable(observer("check")).define("check", ["Event"], _check);
  main.variable(observer()).define(["checkboxTests","check","viewof testCheckboxAll","expect"], _49);
  main.variable(observer()).define(["checkboxTests","check","viewof testCheckboxAll","expect"], _50);
  main.variable(observer()).define(["checkboxTests","check","viewof testCheckboxAll","expect"], _51);
  main.variable(observer()).define(["checkboxTests","check","viewof testCheckboxAll","expect"], _52);
  main.variable(observer()).define(["viewof testCheckboxAll","Event"], _53);
  main.variable(observer()).define(["viewof testCheckboxAll"], _54);
  main.variable(observer()).define(["md"], _55);
  main.variable(observer("colorBoxStyle")).define("colorBoxStyle", ["html"], _colorBoxStyle);
  main.variable(observer("summary")).define("summary", ["variable","scoreColor","contrastTextColor","view","textNodeView","d3","Event","bindOneWay"], _summary);
  main.variable(observer()).define(["exampleSummary"], _58);
  main.variable(observer("viewof exampleSummary")).define("viewof exampleSummary", ["summary"], _exampleSummary);
  main.variable(observer("exampleSummary")).define("exampleSummary", ["Generators", "viewof exampleSummary"], (G, _) => G.input(_));
  main.variable(observer()).define(["Inputs","viewof exampleSummary"], _60);
  main.variable(observer("viewof exampleSummaryNext")).define("viewof exampleSummaryNext", ["summary"], _exampleSummaryNext);
  main.variable(observer("exampleSummaryNext")).define("exampleSummaryNext", ["Generators", "viewof exampleSummaryNext"], (G, _) => G.input(_));
  main.variable(observer()).define(["scoreColor"], _62);
  main.variable(observer("contrastTextColor")).define("contrastTextColor", ["d3"], _contrastTextColor);
  main.variable(observer()).define(["contrastTextColor"], _64);
  main.variable(observer()).define(["contrastTextColor"], _65);
  main.variable(observer("scoreColor")).define("scoreColor", ["d3"], _scoreColor);
  main.variable(observer()).define(["md"], _67);
  main.variable(observer()).define(["FileAttachment"], _68);
  main.variable(observer("viewof exampleAggregateSummary")).define("viewof exampleAggregateSummary", ["aggregateSummary"], _exampleAggregateSummary);
  main.variable(observer("exampleAggregateSummary")).define("exampleAggregateSummary", ["Generators", "viewof exampleAggregateSummary"], (G, _) => G.input(_));
  main.variable(observer()).define(["Inputs","viewof exampleAggregateSummary"], _70);
  main.variable(observer()).define(["aggregateSummary"], _71);
  main.variable(observer("aggregateSummaryStyle")).define("aggregateSummaryStyle", ["html"], _aggregateSummaryStyle);
  main.variable(observer("aggregateSummary")).define("aggregateSummary", ["variable","scoreColor","contrastTextColor","view","textNodeView","d3","Event","bindOneWay"], _aggregateSummary);
  main.variable(observer()).define(["md"], _74);
  main.variable(observer("viewof samplePagination1")).define("viewof samplePagination1", ["pagination"], _samplePagination1);
  main.variable(observer("samplePagination1")).define("samplePagination1", ["Generators", "viewof samplePagination1"], (G, _) => G.input(_));
  main.variable(observer("viewof samplePagination2")).define("viewof samplePagination2", ["pagination"], _samplePagination2);
  main.variable(observer("samplePagination2")).define("samplePagination2", ["Generators", "viewof samplePagination2"], (G, _) => G.input(_));
  main.variable(observer("viewof samplePagination3")).define("viewof samplePagination3", ["pagination"], _samplePagination3);
  main.variable(observer("samplePagination3")).define("samplePagination3", ["Generators", "viewof samplePagination3"], (G, _) => G.input(_));
  main.variable(observer("viewof samplePagination4")).define("viewof samplePagination4", ["pagination","html"], _samplePagination4);
  main.variable(observer("samplePagination4")).define("samplePagination4", ["Generators", "viewof samplePagination4"], (G, _) => G.input(_));
  main.variable(observer("pagination")).define("pagination", ["html"], _pagination);
  main.variable(observer()).define(["md"], _80);
  main.variable(observer("ns")).define("ns", ["Inputs"], _ns);
  main.variable(observer("styles")).define("styles", ["html","colorBoxStyle","aggregateSummaryStyle","tableStyles","formInputStyles"], _styles);
  main.variable(observer()).define(["md"], _83);
  main.variable(observer("formInputStyles")).define("formInputStyles", ["html","ns"], _formInputStyles);
  main.variable(observer()).define(["md"], _85);
  main.variable(observer()).define(["md"], _86);
  main.variable(observer("setTypes")).define("setTypes", _setTypes);
  main.variable(observer("expandSets")).define("expandSets", _expandSets);
  main.variable(observer()).define(["d3","expandSets","example_multi_set_layout"], _89);
  main.variable(observer()).define(["example_multi_set_layout"], _90);
  main.variable(observer()).define(["example_aggregate_scores_layout"], _91);
  main.variable(observer()).define(["example_multi_set_questions"], _92);
  main.variable(observer()).define(["example_aggregate_scores_layout"], _93);
  main.variable(observer("bindLogic")).define("bindLogic", ["d3","expandSets","bindOneWay","scoreQuestion","invalidation"], _bindLogic);
  main.variable(observer("exampleLogic")).define("exampleLogic", ["createQuestion","bindLogic","view"], _exampleLogic);
  main.variable(observer()).define(["md"], _96);
  main.variable(observer("example_yes_ifyes_layout")).define("example_yes_ifyes_layout", _example_yes_ifyes_layout);
  main.variable(observer("example_yes_ifyes_questions")).define("example_yes_ifyes_questions", _example_yes_ifyes_questions);
  main.variable(observer()).define(["exampleLogic","example_yes_ifyes_questions","example_yes_ifyes_layout"], _99);
  main.variable(observer()).define(["md"], _100);
  main.variable(observer("example_yesnomaybe_ifyes_layout")).define("example_yesnomaybe_ifyes_layout", _example_yesnomaybe_ifyes_layout);
  main.variable(observer("example_yesnomaybe_ifyes_questions")).define("example_yesnomaybe_ifyes_questions", _example_yesnomaybe_ifyes_questions);
  main.variable(observer()).define(["exampleLogic","example_yesnomaybe_ifyes_questions","example_yesnomaybe_ifyes_layout"], _103);
  main.variable(observer()).define(["md"], _104);
  main.variable(observer("example_score_layout")).define("example_score_layout", _example_score_layout);
  main.variable(observer("example_score_questions")).define("example_score_questions", _example_score_questions);
  main.variable(observer("viewof exampleScoreGroup")).define("viewof exampleScoreGroup", ["exampleLogic","example_score_questions","example_score_layout"], _exampleScoreGroup);
  main.variable(observer("exampleScoreGroup")).define("exampleScoreGroup", ["Generators", "viewof exampleScoreGroup"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _108);
  main.variable(observer("example_scored_conditional_questions")).define("example_scored_conditional_questions", _example_scored_conditional_questions);
  main.variable(observer("example_scored_conditional_layout")).define("example_scored_conditional_layout", _example_scored_conditional_layout);
  main.variable(observer("viewof exampleScoredConditionalGroup")).define("viewof exampleScoredConditionalGroup", ["exampleLogic","example_scored_conditional_questions","example_scored_conditional_layout"], _exampleScoredConditionalGroup);
  main.variable(observer("exampleScoredConditionalGroup")).define("exampleScoredConditionalGroup", ["Generators", "viewof exampleScoredConditionalGroup"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _112);
  main.variable(observer("example_multi_set_layout")).define("example_multi_set_layout", _example_multi_set_layout);
  main.variable(observer("example_multi_set_questions")).define("example_multi_set_questions", _example_multi_set_questions);
  main.variable(observer("viewof exampleMultiSetGroup")).define("viewof exampleMultiSetGroup", ["exampleLogic","example_multi_set_questions","example_multi_set_layout"], _exampleMultiSetGroup);
  main.variable(observer("exampleMultiSetGroup")).define("exampleMultiSetGroup", ["Generators", "viewof exampleMultiSetGroup"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _116);
  main.variable(observer("example_aggregate_scores_layout")).define("example_aggregate_scores_layout", _example_aggregate_scores_layout);
  main.variable(observer("example_aggregate_scores_questions")).define("example_aggregate_scores_questions", _example_aggregate_scores_questions);
  main.variable(observer("viewof exampleAggregateScoreGroup")).define("viewof exampleAggregateScoreGroup", ["exampleLogic","example_aggregate_scores_questions","example_aggregate_scores_layout"], _exampleAggregateScoreGroup);
  main.variable(observer("exampleAggregateScoreGroup")).define("exampleAggregateScoreGroup", ["Generators", "viewof exampleAggregateScoreGroup"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _120);
  main.variable(observer("brandConfig")).define("brandConfig", ["mainColors","accentColors"], _brandConfig);
  main.variable(observer("initializeStyles")).define("initializeStyles", ["tachyonsExt","brandConfig"], _initializeStyles);
  main.variable(observer()).define(["initializeStyles"], _123);
  main.variable(observer("stylesForNotebooks")).define("stylesForNotebooks", ["html"], _stylesForNotebooks);
  main.variable(observer()).define(["md"], _125);
  const child1 = runtime.module(define1);
  main.import("checkbox", "checkboxBase", child1);
  main.import("textarea", child1);
  main.import("radio", "radioBase", child1);
  main.import("text", child1);
  main.import("number", child1);
  main.import("file", child1);
  const child2 = runtime.module(define2);
  main.import("view", child2);
  main.import("bindOneWay", child2);
  main.import("variable", child2);
  main.import("cautious", child2);
  const child3 = runtime.module(define3);
  main.import("viewroutine", child3);
  main.import("ask", child3);
  const child4 = runtime.module(define4);
  main.import("toc", child4);
  const child5 = runtime.module(define5);
  main.import("download", child5);
  const child6 = runtime.module(define6);
  main.import("mainColors", child6);
  main.import("accentColors", child6);
  const child7 = runtime.module(define7);
  main.import("tachyonsExt", child7);
  const child8 = runtime.module(define8);
  main.import("textNodeView", child8);
  const child9 = runtime.module(define9);
  main.import("createSuite", child9);
  main.import("expect", child9);
  main.variable(observer()).define(["md"], _135);
  const child10 = runtime.module(define10);
  main.import("substratum", child10);
  main.variable(observer()).define(["substratum","invalidation"], _137);
  return main;
}
