import define1 from "./f92778131fd76559@1208.js";
import define2 from "./653c46ed55693b1f@683.js";
import define3 from "./9bed702f80a3797e@402.js";
import define4 from "./b5327e6e2ddcad75@102.js";
import define5 from "./8d0bf24a1c2d5359@657.js";
import define6 from "./6a35be87fa9e4ba9@291.js";
import define7 from "./bad810ff1e80611b@137.js";

function _1(md){return(
md`# Survey Slate | Designer UI 

_A simple user interface for Survey Slate's [Designer Tools](https://observablehq.com/@categorise/surveyslate-designer-tools).  Also check out the [User Guide for Survey Slate Designer](https://observablehq.com/@categorise/surveyslate-user-guide-for-grouping-questions)._`
)}

function _2(md,width){return(
md`
<div style="max-width: ${width/1.75}px; margin: 30px 0; padding: 15px 30px; background-color: #e0ffff; font: 700 18px/24px sans-serif;">👋 Welcome!  This notebook is about **Survey Slate**&mdash;an [assemblage of Observable web-based notebooks](https://observablehq.com/collection/@categorise/survey-slate) allowing organizations to host custom surveys for end users on their own AWS infrastructure.  Check out the [Technical Overview](https://observablehq.com/@categorise/surveyslate-docs) to get started! ✨</div>

<!-- Notification design borrowed from https://observablehq.com/@jashkenas/inputs -->
`
)}

function _3(toc){return(
toc({
  headers: "h2,h3,h4,h5"
})
)}

function _4(md){return(
md`## Wireframe`
)}

function _5(FileAttachment){return(
FileAttachment("image.png").image()
)}

function _6(md){return(
md`## Config`
)}

function _types(){return(
new Map([
 ["Markdown", "md"],
 ["Text", "textarea"],
 ["Checkbox", "checkbox"],
 ["Radio", "radio"],
 ["Number", "number"],
 ["Number Matrix", "table"],
 ["File", "file_attachment"],
 ["Summary", "summary"],
 ["Aggregate", "aggregate"],
  ["Section", "section"],
 ["Custom", "fallback"],
])
)}

function _roles(){return(
["yes", "yesno", "yesnomaybe", "ifyes", "ifno", "calculation", "scored"]
)}

function _9(md){return(
md`## UI Builders`
)}

function _10(md){return(
md`### surveyEditor`
)}

async function _exampleSurveyEditor(view,surveyEditor,FileAttachment){return(
view`<div class="brand-font bg-near-white">
  <div style="overflow-y: auto; max-height:600px;">
    ${["...", surveyEditor(await FileAttachment("surveyUiInput.json").json())]}
  </div>
</div>`
)}

function _anotherSurveyEditorData(Inputs)
{
  return Inputs.input(({
  metadata: {
    title: "Another Demo Survey"
  },
  pages: [{
    title: "page1",
    cells: [{
      id: "a-md-question-type",
      inner: {
        type: "md",
        result: {
          content: "_Hello world_" 
        }
      },
    }]
  },{
    title: "page2"
  }]
}))
}


function _13(Inputs,$0,$1){return(
Inputs.button("Overwrite suvery editor data", {
  reduce: () => {
    $0.value = $1.value;
    $0.applyValueUpdates();
  }
})
)}

function _surveyEditor(page,Event,view,textNodeView,filterCellsNotOfType,surveyMetadata,Inputs,randomId,summaryCard,html){return(
({metadata, pages = []} = {}) => {
  const pageBuilder = (args) => page({
    ...args,
    onDelete: (id) => {
      const index = ui.value.pages.findIndex(pages => pages.id === id);
      ui.value.pages.splice(index, 1);
      ui.pages.dispatchEvent(new Event('input', {bubbles: true}));
    },
    onDown: (id) => {
      const index = ui.value.pages.findIndex(pages => pages.id === id);
      var element = ui.value.pages[index];
      ui.value.pages.splice(index, 1);
      ui.value.pages.splice(index + 1, 0, element);
      ui.pages.dispatchEvent(new Event('input', {bubbles: true}));
    },
    onUp: (id) => {
      const index = ui.value.pages.findIndex(page => page.id === id);
      var element = ui.value.pages[index];
      ui.value.pages.splice(index, 1);
      ui.value.pages.splice(Math.max(index - 1, 0), 0, element);
      ui.pages.dispatchEvent(new Event('input', {bubbles: true}));
    },
  })

  const summary = view`<p class="ma0">
    ${['questions', textNodeView("0 questions")]} across ${['pages', textNodeView("0 pages")]}.
  </p>`

  const updateSummary = () => {
    // console.log('updateSummary');
    const pages = ui.value?.pages?.length ||  0;
    const questions = ui.value?.pages?.reduce((count, page) => {
      const cells = filterCellsNotOfType(page.cells || [], 'section');
      return count + cells.length
    }, 0);

    summary.value.pages = pages === 1 ? "1 page" : `${pages} pages`;
    summary.value.questions = questions === 1 ? "1 question" : `${questions} questions`;
  }

  const ui = view`<div class="space-y-3">
  ${['metadata', surveyMetadata(metadata)]}
  
  <div class="space-y-3">
    ${['pages', pages.map(pageBuilder), pageBuilder]}
  </div>
  <div>
    ${Inputs.button('Add Page', {
      reduce: () => {
        ui.value.pages.push({
          title: "page " + randomId()
        });
        ui.pages.dispatchEvent(new Event('input', {bubbles: true}));
      }
    })}
  </div>

  <div class="sticky bottom-1">
    ${summaryCard(summary, html`<div class="flex space-x-2">${Inputs.button('Preview')} ${Inputs.button('Save')}`)}
  </div>
</div>`

  ui.addEventListener('input', updateSummary);

  // When values assigned to `viewof surveyEditor().value`, without dispatching `input` event
  // call `viewof surveyEditor().applyValueUpdates()` to update UIs like summary.
  ui.applyValueUpdates = () => {
    updateSummary();
  };
  updateSummary();

  return ui;
}
)}

function _filterCellsNotOfType(){return(
(cells, type) =>  cells.filter(c => c?.inner?.type != type)
)}

function _16(md){return(
md`### surveyMetadata`
)}

function _surveyMetadata(view,Inputs){return(
({title} = {}) => view`<div class="card solid-shadow-1 space-y-3">
  <h2>Survey Metadata</h2>
  ${['title', Inputs.text({value: title, label: "Survey title"})]}
</div>`
)}

function _exampleSurveyMetadata(surveyMetadata){return(
surveyMetadata()
)}

function _19(exampleSurveyMetadata){return(
exampleSurveyMetadata
)}

function _20(md){return(
md`### page`
)}

function _examplePage(page){return(
page({
  title: "intro",
  cells: [{
    id: "md",
    inner: {
      type: "md",
      result: {
        content: "example content"
      }
    }
  }, {
    id: "radio",
    inner: {
      type: "radio",
      result: {
        options: [{
          value: "0",
          label: "Option 0",
          score: "1"
        },{
          value: "1",
          label: "Option 1",
          score: "2"
        },{
          value: "2",
          label: "Option 2",
          score: "3"
        }]
      
      }
    }
  },{
    id: "fallback",
    inner: {
      type: "fallback",
      result: {
        title:	"the title",
        placeholder:	"the placeholder",
        rows:	1
      }
    }
  }]
})
)}

function _22(examplePage){return(
examplePage
)}

function _23(Inputs,examplePage){return(
Inputs.button("test backwritability of a cell", {
  reduce: () => {
    debugger;
    examplePage.cells[0] = ({
      id: "md",
      inner: {
        type: "md",
        result: {
          content: Math.random()
        }
      }
    })
  }
})
)}

function _page(randomId,cell,Event,view,Inputs,buttonLabel){return(
({
    id = randomId(),
    title,
    cells = [],
    onDelete = (id) => {},
    onUp = (id) => {},
    onDown = (id) => {},
  } = {}) => {
  const cellBuilder = (args) => cell({
    ...args,
    onDelete: (id) => {
      const index = ui.value.cells.findIndex(cell => cell.id === id);
      ui.value.cells.splice(index, 1);
      ui.cells.dispatchEvent(new Event('input', {bubbles: true}));
    },
    onDown: (id) => {
      const index = ui.value.cells.findIndex(cell => cell.id === id);
      const element = ui.value.cells[index];
      ui.value.cells.splice(index, 1);
      ui.value.cells.splice(index + 1, 0, element);
      ui.cells.dispatchEvent(new Event('input', {bubbles: true}));
    },
    onUp: (id) => {
      const index = ui.value.cells.findIndex(cell => cell.id === id);
      const element = ui.value.cells[index];
      ui.value.cells.splice(index, 1);
      ui.value.cells.splice(Math.max(index - 1, 0), 0, element);
      ui.cells.dispatchEvent(new Event('input', {bubbles: true}));
    }
  });
  

  const ui = view`<div class="[ page card ][ solid-shadow-1 space-y-3 ]">
    ${['_id', Inputs.input(id)]}
    <div class="flex justify-between">
      <div class="w-100 pr4">${['title', Inputs.text({label: "Page title", value: title})]}</div>
      
      <div class="flex space-x-2">
        ${Inputs.button(buttonLabel({ariaLabel: "Delete", iconLeft: "trash-2", iconLeftClass: "icon--danger"}), {reduce: () => onDelete(id)})}
        <div class="button-group">
          ${Inputs.button(buttonLabel({ariaLabel: "Move up", iconLeft: "arrow-up"}), {reduce: () => onUp(id)})}
          ${Inputs.button(buttonLabel({ariaLabel: "Move down", iconLeft: "arrow-down"}), {reduce: () => onDown(id)})}
        </div>
      </div>
    </div>
    <div class="box space-y-3">
      ${['cells', cells.map(cellData => cellBuilder(cellData)), cellBuilder]}
    </div>
    <div class="flex space-x-3">
      <div class="button-group">
        ${Inputs.button('Add Question', {
          reduce: () => {
            ui.value.cells.push({inner: {type: "textarea"}})
            ui.cells.dispatchEvent(new Event('input', {bubbles: true}));
          }
        })}
        ${Inputs.button('Add Text', {
          reduce: () => {
            ui.value.cells.push({inner: {type: "md"}});
            ui.cells.dispatchEvent(new Event('input', {bubbles: true}));
          }
        })}
      </div>
      ${Inputs.button('Add Section', {
          reduce: () => {
            ui.value.cells.push({inner: {type: "section"}});
            ui.cells.dispatchEvent(new Event('input', {bubbles: true}));
          }
        })}
    </div>
  </div>`

  return ui;
}
)}

function _25(md){return(
md`### cell`
)}

function _exampleCell(cell){return(
cell({
  id: "cell1",
  inner: {
    type: "md",
    result: {
      content: "hi!"
    }
  },
  connections: {  // Ugly double nesting (simplest implementation)
    connections: [{
      set: "g1",
      role: "ifyes"
    }]  
  }
})
)}

function _27(exampleCell){return(
exampleCell
)}

function _28(Inputs,$0){return(
Inputs.button("test backwritability", {
  reduce: () => {
    $0.value = ({
      id: "cellTest",
      inner: {
        type: "md",
        result: {
          content: Math.random()
        }
      },
      connections: {  // Ugly double nesting (simplest implementation)
        connections: [{
          set: "test2",
          role: "scored"
        }]  
      }
    })
  }
})
)}

function _cell(randomId,Inputs,types,typeUI,view,buttonLabel,connectionsUI){return(
({
  id = randomId(),
  inner = {
    type: "radio",
    result: {
      
    }
  },
  connections,
  onDelete = (id) => {},
  onDown = (id) => {},
  onUp = (id) => {}
} = {}) => {
  const typeSelector = Inputs.select(types, {value: inner?.type, label: "Question Type"});
  const innerTypeUI = typeUI(inner);
  Inputs.bind(innerTypeUI.type, typeSelector);

  const ui = view`<section class="[ cell ]" data-cell-type="${typeSelector.value}">
    <div class="[ cell__section ][ flex ]">
      <div>
        ${typeSelector}
      </div>

      <div class="ml-auto">
        <div class="flex space-x-2">
          ${Inputs.button(buttonLabel({ariaLabel: "Delete", iconLeft: "trash-2", iconLeftClass: "icon--danger"}), {reduce: () => onDelete(id)})}
        <div class="button-group">
          ${Inputs.button(buttonLabel({ariaLabel: "Move up", iconLeft: "arrow-up"}), {reduce: () => onUp(id)})}
          ${Inputs.button(buttonLabel({ariaLabel: "Move down", iconLeft: "arrow-down"}), {reduce: () => onDown(id)})}
        </div>
        </div>
      </div>
    </div>
    <div class="[ cell__section ][ space-y-3 ]">
      <div class="flex">${['id', Inputs.text({value: id, "label": "Question ID"})]}</div>
    </div>
    <div>${['inner', innerTypeUI]}</div>
    <div class="[ cell__section cell__section--separated ][ space-y-3 ]">
      <details>
        <summary>Connections</summary>
        <div class="pv2">${['connections', connectionsUI(connections)]}</div>
      </details>
    </div>
</section>`
  typeSelector.addEventListener('input', () => {
    ui.dataset.cellType = typeSelector.value;
  });
  return ui;
}
)}

function _30(md){return(
md`### typeUi`
)}

function _exampleType(Inputs,types){return(
Inputs.select(types, {value: "fallback"})
)}

function _exampleTypeUI(typeUI,Inputs,$0)
{
  const view = typeUI({
    result: {
      content: "foo"
    }
  })
  Inputs.bind(view.type, $0); // type is backwriteable
  return view;
}


function _33(typeUI){return(
typeUI({
  type: "md",
    result: {
      content: "foo"
    }
  })
)}

function _34(exampleTypeUI){return(
exampleTypeUI
)}

function _exampleTypeUIRadio(typeUI){return(
typeUI({
  type: "radio",
  result: {
    options: [{
      id: "my id",
      label: "a label",
      score: 10000,
    }]
  }
})
)}

function _36(exampleTypeUIRadio){return(
exampleTypeUIRadio
)}

function _typeUIFactories(radioUI,checkboxUI,tableUI,mdUI,textUI,numberUI,textareaUI,fileAttachmentUI,summaryUI,sectionUI,aggregateSummaryUI){return(
{
  "radio": radioUI,
  "checkbox": checkboxUI,
  "table": tableUI,
  "md": mdUI,
  "text": textUI,
  "number": numberUI,
  "textarea": textareaUI,
  "file_attachment": fileAttachmentUI,
  "summary": summaryUI,
  "section": sectionUI,
  "aggregate": aggregateSummaryUI
}
)}

function _typeUI(juice,typeUIFactories,fallbackUI){return(
juice((arg0) => {
  const factory = typeUIFactories[arg0?.type];
  if (factory) {
    return factory(arg0?.result)
  }
  return fallbackUI(arg0?.result)
}, {
  "type": "[0].type"
})
)}

function _39(md){return(
md`#### Fallback UI

If we encounter a cell type we don't know, we will use a generic UI to allow the user to get/set questions 
attributes arbitrarily.

It is slightly awkward because we only have lists available in UI representation, so we need to pivot that into a \`{type, results<map>}\` format. This is the step between *fallbackUIEntries* and *fallbackUI*`
)}

function _40(){return(
typeof "" === 'string'
)}

function _fallbackUI(fallbackUIEntries,bindOneWay,Inputs,view,ns){return(
(args = {}) => { // Main purpose is to convert into <map>format. Main UI is in fallbackUIEntries
  const entriesUI = fallbackUIEntries({
    entries: Object.entries(args).map(([k, v]) => {
      if (!v) {
        return {key: k, value_: undefined};
      } if (v.outerHTML) {
        return {key: k + "_md", value_: v.outerHTML};
      } else if (typeof v === 'object') {
        return {key: k + "_js", value_: JSON.stringify(v)};
      } else {
        return {key: k, value_: v};
      }
    })
  });
  const result = bindOneWay(Inputs.input(undefined), entriesUI, {
    transform: (entriesUi) => Object.fromEntries(entriesUi.entries.map(e => {
      return [e.key, e.value_]
    }))
  })
  const ui = view`<div class="[ cell__section ][ pb3 ]">
    <form class="${ns}"><label>Attributes</label>
    ${entriesUI}
    ${['_...', result]}
    </form>
  </div>`

  return ui;
}
)}

function _42(md){return(
md``.outerHTML
)}

function _exampleFallbackUI(fallbackUI,md){return(
fallbackUI({
  key1: "v2",
  key2: md`<mark>we need to convert to string</mark>`,
  key3: {object: true}
})
)}

function _44(exampleFallbackUI){return(
exampleFallbackUI
)}

function _fallbackUIEntries(kvRowBuilder,Event,view){return(
({entries = []}) => {
  const newAttributeInput = kvRowBuilder({
    placeholder: "Add attribute",
    onEnter: () => {
      ui.entries.value.push(newAttributeInput.value)
      newAttributeInput.value = {key: "", value_: ""};
      ui.dispatchEvent(new Event('input', {bubbles: true}))
    }
  });
  const kvRowBuilderWithDelete = (args) => kvRowBuilder({...args, onDelete: (id) => {
    const index = ui.entries.value.find(option => option.id === id)
    ui.entries.value.splice(index, 1); // delete in-place
    ui.dispatchEvent(new Event('input', {bubbles: true}));
  }})
  const ui = view`<table class="ma0">
  <tr>
    <th>Attribute</th>
    <th>Value</th>
  </tr>
  ${['entries', entries.map(kvRowBuilderWithDelete), kvRowBuilderWithDelete]}
  <tfoot>
    ${newAttributeInput}
  </tfoot>
</table>`
  return ui;
}
)}

function _exampleFallbackUIEntries(fallbackUIEntries){return(
fallbackUIEntries({
  entries: [{key: "type", value_: "random"}]
})
)}

function _47(exampleFallbackUIEntries){return(
exampleFallbackUIEntries
)}

function _kvRowBuilder(Inputs,view){return(
({
  placeholder,
  key, value_,
  onEnter, onDelete
}) => {
  const keyInput = Inputs.text({placeholder, value: key});
  const valueInput = Inputs.text({value: value_});
  
  if (onEnter) {
    keyInput.addEventListener('keyup', (evt) => {
      if (evt.keyCode === 13) {
        onEnter(evt);
      }
    });
    valueInput.addEventListener('keyup', (evt) => {
      if (evt.keyCode === 13) {
        onEnter(evt);
      }
    });
  }
  if (onDelete) { // If user editable rows
    keyInput.addEventListener('keyup', (evt) => {
      // BACKSPACE
      if (evt.keyCode === 8 && keyInput.value.length == 0) {
        onDelete(keyInput.value);
      }
    });
  }
  
  const ui = view`<tr>
    <td>${['key', keyInput]}</td>
    <td>${['value_', valueInput]}</td>
  </tr>`
  return ui;
}
)}

function _exampleKvRow(kvRowBuilder){return(
kvRowBuilder ({
  key: "k1",
  value: "val"
})
)}

function _50(md){return(
md`#### Markdown Text`
)}

function _sampleMdUI(mdUI){return(
mdUI({
  content: "## content"
})
)}

function _52(sampleMdUI){return(
sampleMdUI
)}

function _mdUI(view,Inputs){return(
({content, rows = 20} = {}) => {
  return view`<div class="[ cell__section ][ pb3 ]">
  ${['content', Inputs.textarea({value: content, label: "Content", rows})]}
</div>`
}
)}

function _54(md){return(
md`#### Text Question (Deprecated)`
)}

function _55(FileAttachment){return(
FileAttachment("image@2.png").image()
)}

function _sampleTextUI(textUI){return(
textUI()
)}

function _57(sampleTextUI){return(
sampleTextUI
)}

function _textUI(view,Inputs){return(
({title,description} = {}) => {
  return view`<div class="[ cell__section ][ pb2 ]">
  ${['title', Inputs.text({value: title, label: "Question"})]}
</div>
<div class="[ cell__section cell__section--separated ]">
  <details>
    <summary>Options</summary>
    <div class="pv2">${['description', Inputs.text({label: "Description", value: description})]}</div>
  </details>
</div>`
}
)}

async function _59(FileAttachment,md){return(
md`#### Radio Question

![image@3.png](${await FileAttachment("image@3.png").url()})`
)}

function _exampleRadioUI(radioUI){return(
radioUI({
  title: "How far along is your process?",
  options: [{
    id: "dsds",
    label: "We are planning a process",
    score: 4
  },{
    id: "asdas",
    label: "Do you have process in place?",
    score: 10
  }],
  includeAllOption: {
    score: 5,
    label: "All of the above"
  },
  description: "Select the statements that best describes your case"
})
)}

function _61(exampleRadioUI){return(
exampleRadioUI
)}

function _radioUI(optionsRowBuilder,randomId,Event,view,Inputs,ns,includeOptionalAttributesUI,descriptionUI){return(
({title, options = [], connections = [], description,includeAllOption} = {}) => {
  const newOptionInput = optionsRowBuilder({
    placeholder: "Add new row",
    id: randomId(),
    onEnter: () => {
      ui.value = {
        ...ui.value,
        options: [...ui.value.options, newOptionInput.value]
      }
      newOptionInput.value.label = "";
      newOptionInput.value.id = randomId();
      ui.dispatchEvent(new Event('input', {bubbles: true}))
    }
  });
  const radioOptionBuilderWithDelete = (args) => optionsRowBuilder({...args, onDelete: (id) => {
    ui.value = {
      ...ui.value,
      options: ui.value.options.filter(option => option.id !== id)
    }
    ui.dispatchEvent(new Event('input', {bubbles: true}));
  }})
  const ui = view`<div class="[ cell__section ][ space-y-3 ph2 pb3 ]">
  ${['title', Inputs.text({label: "Question", value: title})]}
  <form class="${ns}">
    <label>Radio Options</label>
    <table class="ma0">
      <tr>
        <th>Label</th>
        <th>Score</th>
        <th>ID</th>
      </tr>
      ${['options', options.map(radioOptionBuilderWithDelete), radioOptionBuilderWithDelete]}
      <tfoot>
        ${newOptionInput}
      </tfoot>
    </table>
  </form>
</div>
<div class="[ cell__section cell__section--separated ]">
  <details>
    <summary>Options</summary>
    <div class="pv2 space-y-2">
      ${['includeAllOption', includeOptionalAttributesUI(includeAllOption)]}
      ${['description', descriptionUI(description)]}  
    </div>
  </details>
</div>`

  return ui;

}
)}

function _optionsRowBuilder(Inputs,view){return(
({
  label,
  score,
  id,
  placeholder,
  onEnter,
  onDelete,
} = {}) => {
  const labelInput = Inputs.text({value: label, placeholder})
  if (onEnter) {
    labelInput.addEventListener('keyup', (evt) => {
      if (evt.keyCode === 13) {
        onEnter(evt);
      }
    });
  }
  if (onDelete) { // If user editable rows
    labelInput.addEventListener('keyup', (evt) => {
      // BACKSPACE
      if (evt.keyCode === 8 && labelInput.value.length == 0) {
        onDelete(id);
      }
    });
  }
  return view`<tr>
    <td>${['label', labelInput]}</td>
    <td>${['score', Inputs.text({value: score})]}</td>
    <td>${['id', Inputs.text({value: id})]}</td>
  </tr>`
}
)}

function _64(md){return(
md`#### Checkbox Question`
)}

function _65(FileAttachment){return(
FileAttachment("checkboxes.png").image()
)}

function _exampleCheckboxUI(checkboxUI){return(
checkboxUI({
  title: "Your business focus",
  options: [{
    id: "eg",
    label: "Electricity Generation",
    score: 10
  },{
    id: "et",
    label: "Electricity Transmission",
    score: 8
  },{
    id: "ed",
    label: "Electricity Distribution",
    score: 7
  },{
    id: "other",
    label: "Other",
    score: 3
  }],
  includeAllOption: {
    score: 5,
    label: "All of the above"
  },
  description: "Select a statement that best describes your case",
})
)}

function _67(exampleCheckboxUI){return(
exampleCheckboxUI
)}

function _checkboxUI(optionsRowBuilder,randomId,Event,includeOptionalAttributesUI,view,Inputs,ns,descriptionUI){return(
({title, options = [], includeAllOption, includeNoneOption, description} = {}) => {
  const newOptionInput = optionsRowBuilder({
    placeholder: "Add new row",
    id: randomId(),
    onEnter: () => {
      ui.value = {
        ...ui.value,
        options: [...ui.value.options, newOptionInput.value]
      }
      newOptionInput.value.label = "";
      newOptionInput.value.id = randomId();
      ui.dispatchEvent(new Event('input', {bubbles: true}))
    }
  });
  const radioOptionBuilderWithDelete = (args) => optionsRowBuilder({...args, onDelete: (id) => {
    ui.value = {
      ...ui.value,
      options: ui.value.options.filter(option => option.id !== id)
    }
    ui.dispatchEvent(new Event('input', {bubbles: true}));
  }})

  const selectNoneUI = includeOptionalAttributesUI(includeNoneOption, "Add option to select none", "None of the above");

  const ui = view`<div class="[ cell__section ][ space-y-3 ph2 pb3 ]">
  ${['title', Inputs.text({label: "Question", value: title})]}
  <form class="${ns}">
    <label>Checkbox Options</label>
    <table class="ma0">
      <tr>
        <th>Label</th>
        <th>Score</th>
        <th>ID</th>
      </tr>
      ${['options', options.map(radioOptionBuilderWithDelete), radioOptionBuilderWithDelete]}
      <tfoot>
        ${newOptionInput}
      </tfoot>
    </table>
  </form>
</div>
<div class="[ cell__section cell__section--separated ]">
  <details>
    <summary>Options</summary>
    <div class="pv2 space-y-2">
      ${['includeAllOption', includeOptionalAttributesUI(includeAllOption)]}
      ${['includeNoneOption', selectNoneUI]}
      ${['description', descriptionUI(description)]}
    </div>
    </div>
  </details>
</div>`

  return ui;

}
)}

function _69(typeUI){return(
typeUI({
  type: "checkbox",
    result: {
      title: "Your business focus",
      options: [{
        id: "a",
        label: "a_label",
        score: 10
      },{
        id: "b",
        label: "b_label",
        score: 8
      }],
      includeAllOption: {
        score: 5,
        label: "all"
      },
    }
  })
)}

function _70(md){return(
md`#### Number Question`
)}

function _exampleNumberUI(numberUI){return(
numberUI({
  title: "How old is your company?",
  description: "In years",
  min: 1,
  // max: 21, 
  step: 2
})
)}

function _72(exampleNumberUI){return(
exampleNumberUI
)}

function _numberUI(view,Inputs,descriptionUI){return(
({title, description, min = 0, max, step = 1} = {}) => {
  const attributes =  [
    {
      id: "min",
      label: "Minimum",
      value: min,
    },
    {
      id: "max",
      label: "Maximum",
      value: max
    },
    {
      id: "steps",
      label: "Steps",
      value: step
    }
  ];

  return view`<div class="[ cell__section ][ space-y-3 ph2 pb3 ]">
  ${['title', Inputs.text({label: "Question", value: title})]}
</div>
<div class="[ cell__section cell__section--separated ]">
  <details>
    <summary>Options</summary>
    <div class="pv2 space-y-2">
      ${['description', descriptionUI(description)]}
      <div class="space-y-2 w-25-ns">
        ${['...', {
          ...attributes.reduce((acc,{id, label, value}) => {
            return {...acc, [id]: Inputs.number([-Infinity, Infinity], {label, value}) }
          }, {})
        }]}
      </div>
    </div>
  </details>
</div>`;
}
)}

function _74(md){return(
md`#### Textarea Question`
)}

function _exampleTextareaUI(textareaUI){return(
textareaUI({
  title: "Tell us about the work your company does?",
  description: "Include you primary and secondary revenue streams",
  placeholder: "Please be elaborate",
  rows: 6
})
)}

function _76(exampleTextareaUI){return(
exampleTextareaUI
)}

function _textareaUI(view,Inputs,descriptionUI){return(
({title, placeholder, description, rows = 4} = {}) => {
  const attributes =  [
    {
      id: "rows",
      label: "Rows",
      value: rows,
    }
  ];

  return view`<div class="[ cell__section ][ ph2 pb3 ]">
  ${['title', Inputs.text({label: "Question", value: title})]}
</div>
<div class="[ cell__section cell__section--separated ]">
  <details>
    <summary>Options</summary>
    <div class="pv2 space-y-2">
      ${['description', descriptionUI(description)]}
      ${['placeholder', Inputs.text({label: "Placeholder", value: placeholder})]}
      <div class="space-y-2 w-25-ns">
      ${['...', {
            ...attributes.reduce((acc,{id, label, value}) => {
              return {...acc, [id]: Inputs.number([-Infinity, Infinity], {label, value}) }
            }, {})
          }]}
      </div>
    </div>
  </details>
</div>`
}
)}

function _78(md){return(
md`#### File Attachment Question`
)}

function _exampleFileAttachmentUI(fileAttachmentUI){return(
fileAttachmentUI({
  title: "File attachments",
  description: "You can provide documents such as policies, brochure, etc.",
  placeholder: "No file chosen" 
})
)}

function _80(exampleFileAttachmentUI){return(
exampleFileAttachmentUI
)}

function _fileAttachmentUI(view,Inputs){return(
({title, description, placeholder} = {}) => {
  return view`
<div class="[ cell__section ][ space-y-3 ph2 pb3 ]">
  ${['title', Inputs.text({label: "Question", value: title})]}
</div>
<div class="[ cell__section cell__section--separated ]">
  <details>
    <summary>Options</summary>
    <div class="pv2 space-y-2">
      ${['description', Inputs.text({label: "Description", value: description})]}
    ${['placeholder', Inputs.text({label: "Placeholder", value: placeholder})]}
    </div>
  </details>
</div>`
}
)}

function _82(md){return(
md`#### Table Question`
)}

function _exampleTableUI(tableUI){return(
tableUI({
  title: "Gender distribution across teams",
  columns: [
    { key: "w", label: "Women", total: "women" },
    { key: "m", label: "Men", total: "men" },
    { key: "unknown", label: "No Data", total: "no data" },
  ],
  rows: [
    { key: "board", label: "Board" },
    { key: "management", label: "Management" },
    { key: "tech", label: "Technical / Engineering Staff" },
    { key: "staff", label: "Non-Technical Staff" },
    { key: "admin", label: "Administrative / Support Staff" },
    { key: "customerservice", label: "Customer Service Staff" },
    { key: "other", label: "Other Staff" },
    { key: "day", label: "Non-Contractual/Informal Day Workers" },
  ],
  caption: "_Some caption_",
  user_rows: true,
  table_total: "Total workforce",
  table_total_label: "people",
})
)}

function _exampleTableUI2(tableUI){return(
tableUI()
)}

function _85(exampleTableUI2){return(
exampleTableUI2
)}

function _tableUI(tableHeaderRowBuilder,randomId,Event,view,Inputs,ns,descriptionUI){return(
({title, rows = [], columns = [], caption, user_rows, table_total, table_total_label} = {}) => {
  const newRowInputBuilder = (valueKey, hideTotal) => {
    const newRowInput = tableHeaderRowBuilder({
      placeholder: "Add new row",
      key: randomId(),
      hideTotal,
      onEnter: () => {
        ui.value = {
          ...ui.value,
          [valueKey]: [...ui.value[valueKey], newRowInput.value]
        }
        newRowInput.value.label = "";
        newRowInput.value.key = randomId();
        ui.dispatchEvent(new Event('input', {bubbles: true}))
      }
    })
    return newRowInput;
  };

  const tableHeaderRowBuilderWithDelete = (valueKey, hideTotal) => (args) => tableHeaderRowBuilder({...args, hideTotal, onDelete: (key) => {
    console.log("ui.value", ui.value);
    ui.value = {
      ...ui.value,
      [valueKey]: ui.value[valueKey].filter(option => option.key !== key)
    }
    ui.dispatchEvent(new Event('input', {bubbles: true}));
  }})

  const ui =  view`
<div class="[ cell__section ][ space-y-3 ph2 pb3 ]">
  ${['title', Inputs.text({label: "Question", value: title})]}
  <form class="${ns}">
    <label>Columns</label>
    <table class="ma0">
      <tr>
        <th>Label</th>
        <th>Key</th>
        <th>Total</th>
      </tr>
      ${['columns', columns.map(tableHeaderRowBuilderWithDelete("columns")), tableHeaderRowBuilderWithDelete("columns")]}
      <tfoot>
        ${newRowInputBuilder("columns")}
      </tfoot>
    </table>
  </form>
  <form class="${ns}">
    <label>Rows</label>
    <table class="ma0">
       <tr>
          <th>Label</th>
          <th>Key</th>
        </tr>
        ${['rows', rows.map(tableHeaderRowBuilderWithDelete("rows", true)), tableHeaderRowBuilderWithDelete("rows", true)]}
        <tfoot>
          ${newRowInputBuilder("rows", true)}
        </tfoot>
    </table>
  </form>
</div>

<div class="[ cell__section cell__section--separated ]">
  <details>
    <summary>Options</summary>
    <div class="pv2 space-y-2">
      ${['user_rows', Inputs.toggle({label: "Allow to edit row labels", value: user_rows})]}
      ${['table_total', Inputs.text({label: "Label for total", value: table_total})]}
      ${['table_total_label', Inputs.text({label: "Unit for total", value: table_total_label})]}
      ${['caption', descriptionUI(caption)]}
    </div>
  </details>
</div>`

  return ui;
}
)}

function _tableHeaderRowBuilder(Inputs,view){return(
({
  label,
  key,
  total,
  placeholder,
  onEnter,
  onDelete,
  hideTotal
} = {}) => {
  const labelInput = Inputs.text({value: label, placeholder})
  if (onEnter) {
    labelInput.addEventListener('keyup', (evt) => {
      if (evt.keyCode === 13) {
        onEnter(evt);
      }
    });
  }
  if (onDelete) { // If user editable rows
    labelInput.addEventListener('keyup', (evt) => {
      // BACKSPACE
      if (evt.keyCode === 8 && labelInput.value.length == 0) {
        onDelete(key);
      }
    });
  }

  const row = {
    label: view`<td>${['...', labelInput]}</td>`,
    key: view`<td>${['...', Inputs.text({value: key})]}</td>`
  }

  if (!hideTotal) {
    row.total = view`<td>${['...', Inputs.text({value: total})]}</td>`
  }

  return view`<tr>
    ${['...', row]}
  </tr>`
}
)}

function _88(md){return(
md`#### Summary`
)}

function _sampleSummaryUI(summaryUI){return(
summaryUI({
  label: "Policy/commitment to promoting gender equality and women's empowerment",
  counter_group: "A",
  counter_value: "4"
})
)}

function _summaryUI(view,Inputs){return(
({label, counter_group, counter_value} = {}) => {
  return view`<div class="[ cell__section ][ space-y-3 ph2 pb3 ]">
  ${['label', Inputs.text({value: label, label: "Label"})]}
  ${['counter_group', Inputs.text({label: "Group", value: counter_group})]}
  ${['counter_value', Inputs.text({label: "Value", value: counter_value})]}
</div>`
}
)}

function _91(md){return(
md`#### Aggregate Summary`
)}

function _exampleAggregateSummaryUI(aggregateSummaryUI){return(
aggregateSummaryUI({
  label: "Organizational Policies"
})
)}

function _aggregateSummaryUI(view,Inputs){return(
({label, counter_group} = {}) => {
  return view`<div class="[ cell__section ][ space-y-3 ph2 pb3 ]">
  ${['label', Inputs.text({value: label, label: "Label"})]}
  ${['counter_group', Inputs.text({label: "Group", value: counter_group})]}
</div>`
}
)}

function _94(md){return(
md`#### Section`
)}

function _sampleSectionUI(sectionUI){return(
sectionUI({
  title: "External operations"
})
)}

function _sectionUI(view,Inputs){return(
({title} = {}) => {
  // class="[ pa3 mh-3 ][ bt bw1 b--light-silver" ]"
  return view`<div class="[ cell__section pb3 ]">
  ${['title', Inputs.text({value: title, label: "Title"})]}
</div>`
}
)}

function _97(md){return(
md`#### Include Optional Attributes`
)}

function _98(md){return(
md`Used to include extra checkbox or radio option like 'Select all' or 'Select none'`
)}

function _sampleIncludeOptionalAttributesUI(includeOptionalAttributesUI){return(
includeOptionalAttributesUI({
    score: 5,
    label: "Everything"
  })
)}

function _sampleIncludeOptionalAttributesUINoLabel(includeOptionalAttributesUI){return(
includeOptionalAttributesUI({
  score: 2
})
)}

function _101(sampleIncludeOptionalAttributesUINoLabel){return(
sampleIncludeOptionalAttributesUINoLabel
)}

function _102(sampleIncludeOptionalAttributesUI){return(
sampleIncludeOptionalAttributesUI
)}

function _sampleIncludeOptionalAttributesUI3(includeOptionalAttributesUI){return(
includeOptionalAttributesUI({
  label: "This is included in our regulations, internal policies/strategies, guidelines, and/or mechanisms; we are planning to implement.",
  score: 3,
  id: "planning"
}, "Add option to select none", "None", true)
)}

function _104(sampleIncludeOptionalAttributesUI3){return(
sampleIncludeOptionalAttributesUI3
)}

function _sampleIncludeOptionalAttributesUI4(includeOptionalAttributesUI){return(
includeOptionalAttributesUI({
  score: 3,
  id: "planning"
}, "Add option to select none", "None of the above", true)
)}

function _includeOptionalAttributesUI(Inputs,view,html,bindOneWay){return(
(option = {}, toggleLabel = "Add option to select all", defaultOptionLabel = "All of the above", showId = false) =>  {   
  const {score, label, id} = option;
  
  const showUI = Boolean(score || label);
  const toggleUI = Inputs.toggle({label: toggleLabel, value: showUI});

  let optionRow  = {
    label: view`<td>${['...', Inputs.text({value: label})]}</td>`,
    score: view`<td>${['...', Inputs.text({value: score})]}</td>`
  }

  if (showId) {
    optionRow.id = view`<td>${['...', Inputs.text({value: id})]}</td>`
  }
  
  const table = view`<table class="mt0 dn">
  <tr>
    <th>Label</th>
    <th>Score</th>
    ${showId ? html`<th>ID</th>` : ""}
  </tr>
  <tr>
    ${['...', optionRow]}
  </tr>`;

  const handler = (val) => {
    if (val) {
      table.classList.remove('dn')
      table.value.label = table.value.label || label || defaultOptionLabel;
      table.value.score = table.value.score || score;
      table.value.id = table.value.id || id;
    } else {
      table.classList.add('dn');
      table.value.label = undefined;
      table.value.score = undefined;
      table.value.id = undefined;
    }
  }
  
  bindOneWay(Inputs.input(undefined), toggleUI, {
    transform: handler
  })

  handler(showUI);
  
  return view`<div>
  ${toggleUI}
  ${['...', table]}
</div>`;
}
)}

function _107(md){return(
md`### connectionsUI

Connections are the lower part of the UI that allows cells to communicate. It is reused across a few different components`
)}

function _108(FileAttachment){return(
FileAttachment("image@4.png").image()
)}

function _exampleInitializedConnectionsUI(connectionsUI){return(
connectionsUI({connections: [
  {set:"g1", role:"r1"},
  {set:"g2", role:"r2"}
]})
)}

function _exampleConnectionsUI(connectionsUI){return(
connectionsUI()
)}

function _111(exampleConnectionsUI){return(
exampleConnectionsUI
)}

function _exampleConnectionsUIBackwritingExample($0,Event)
{
  $0.value = {connections: [
    {set:"g1", role:"r1"},
    {set:"g2", role:"r2"}
  ]}
  $0.dispatchEvent(new Event('input', {bubbles: true}))
}


function _connectionsUI(connectionRowBuilder,randomId,Event,view){return(
({connections = []} = {}) => {
  const newRoleInput = connectionRowBuilder({
    placeholder: "Add new connection",
    id: randomId(),
    role: "scored",
    onEnter: () => {
      ui.value = {
        ...ui.value,
        connections: [...ui.value.connections, newRoleInput.value]
      }
      newRoleInput.value.group = "";
      newRoleInput.value.role = "scored";
      ui.dispatchEvent(new Event('input', {bubbles: true}))
    }
  });
  const connectionRowBuilderWithDelete = (args) => connectionRowBuilder({...args, onDelete: (group) => {
    console.log("deleting", group, ui.value.connections.filter(option => option.group !== group))
    ui.value = {
      ...ui.value,
      connections: ui.value.connections.filter(option => option.group !== group)
    }
    ui.dispatchEvent(new Event('input', {bubbles: true}))
  }})
  const ui = view`<table class="ma0">
      <tr>
        <th>Group</th>
        <th>Role</th>
      </tr>
      ${['connections', connections.map(connectionRowBuilderWithDelete), connectionRowBuilderWithDelete]}
      <tfoot>
        ${newRoleInput}
      </tfoot>
    </table>`

  return ui;

}
)}

function _connectionRowBuilder(Inputs,view,roles){return(
({
  set,
  role,
  placeholder,
  onEnter,
  onDelete
} = {}) => {
  const setInput = Inputs.text({value: set, placeholder})
  if (onEnter) {
    setInput.addEventListener('keyup', (evt) => {
      if (evt.keyCode === 13) {
        onEnter(evt);
      }
    });
  }
  if (onDelete) { // If user editable rows
    setInput.addEventListener('keyup', (evt) => {
      // BACKSPACE
      if (evt.keyCode === 8 && setInput.value.length == 0) {
        onDelete(setInput.value);
      }
    });
  }
  return view`<tr>
    <td>${['set', setInput]}</td>
    <td>${['role', Inputs.select(roles, {value: role})]}</td>
  </tr>`
}
)}

function _exampleConnectionRowBuilder(connectionRowBuilder){return(
connectionRowBuilder()
)}

function _116(exampleConnectionRowBuilder){return(
exampleConnectionRowBuilder
)}

function _117(md){return(
md`### Description UI`
)}

function _118(descriptionUI){return(
descriptionUI("Some description")
)}

function _descriptionUI(view,Inputs,ns){return(
(description, rows = 2) => view`<div>
  ${['...', Inputs.textarea({label: "Description", value: description, rows})]}
  <form class="${ns}"><p class="[ align-observable-inputs ][ ma0 ][ mid-gray ]">Supports Markdown</p></form>
</div>`
)}

function _120(md){return(
md`## Settings Card`
)}

function _exampleSettingsCard(settingsCard){return(
settingsCard()
)}

function _122(exampleSettingsCard){return(
exampleSettingsCard
)}

function _settingsCard(view,Inputs){return(
() => {
  return view`<div class="[ card card--compact ][ solid-shadow-1 ]">
  <div class="[ space-y-3 ]">
    <h2 class="mt0 f4">Settings</h2>
    ${['showResults', Inputs.toggle({label: "Show results to respondents"})]}
  </div>
`
}
)}

function _125(md){return(
md`## Summary Bar`
)}

function _126(summaryCard){return(
summaryCard('30 questions across 4 pages')
)}

function _127(summaryCard,html,Inputs){return(
summaryCard('30 questions across 4 pages', html`<div class="flex space-x-2">${Inputs.button('Preview')} ${Inputs.button('Save')}`)
)}

function _summaryCard(html){return(
(title, actionsHtml) => {
  const actions = actionsHtml ? html`<div>${actionsHtml}` : "";

  return html`<div class="[ card card--compact ][ b--light-blue solid-shadow-1 ]">
  <div class="[ flex flex-wrap justify-between items-center ][ f6 mid-gray ]">
    <p class="ma0">${title}</p>
    ${actions}
  </div>
`
}
)}

function _129(md){return(
md`## Input Label`
)}

function _130(inputLabel){return(
inputLabel("A sample label")
)}

function _131(inputLabel){return(
inputLabel("A sample label", true)
)}

function _inputLabel(html){return(
(label, optional) => html`<span>${label}${ optional ? ` <span class="mid-gray">Optional</span` : "" }</span>`
)}

function _133(md){return(
md`## Styles`
)}

function _styles(html,commonComponentStyles){return(
html`${commonComponentStyles}
<style>
.mh-3 {
  margin-right: calc(-1 * var(--spacing-medium));
  margin-left: calc(-1 * var(--spacing-medium));
}

tr:not(:last-child) {
  border: 0;
}

.cell {
  border: 1px solid var(--border-color-light);
  border-radius: var(--border-radius-2);
}

.cell[data-cell-type="section"] {
  margin-left: -1rem;
  margin-right: -1rem;
  border-top-width: 0.25rem;
  border-left-width: 0;
  border-right-width: 0;
  border-radius: 0;
}

.cell__section {
  padding-top: var(--spacing-medium);
  padding-left: var(--spacing-medium); 
  padding-right: var(--spacing-medium); 
}

.cell__section--separated {
  padding-top: var(--spacing-extra-small);
  padding-bottom: var(--spacing-extra-small);
  border-top: 1px solid var(--border-color-light);
}

.cell__section summary {
  color: #555; /* mid-gray */
  cursor: pointer;
  font-size: .875rem; /* .f6 */
}

.align-observable-inputs {}

@media screen and (min-width: 30em) {
  .align-observable-inputs {
    margin-left: calc(var(--label-width) + var(--length2));
  }
}
</style>`
)}

function _135(md){return(
md`### Styles for the demo`
)}

function _136(html){return(
html`
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style type="text/css" media="screen, print">
  body {
    font-family: var(--brand-font);
  }
</style>
`
)}

function _tachyons(tachyonsExt,mainColors,accentColors){return(
tachyonsExt({
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
)}

function _138(md){return(
md`## Dependencies`
)}

function _randomId(){return(
() => Math.random().toString(16).substring(2)
)}

function _146(md){return(
md`---`
)}

function _148(substratum,invalidation){return(
substratum({ invalidation })
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["image.png", {url: new URL("./files/daecc7ca2df49d6b07a0bf0e76a3219f1ac49bf96ef8e2ee30b9ab8a0e96063c5cdc3d112cf695ebaf67c965cb4613d1c778b0687cf4c88f7bf51d5544ba4d74.png", import.meta.url), mimeType: "image/png", toString}],
    ["image@2.png", {url: new URL("./files/9e19947f8c15b9a22ffb8452bd86283923fc725d28a5e7fcd5220656442ee653933d1e1a34c749b3e9a6fceb57c9ff0e94ae74d7625c954af814a9069d9e78ed.png", import.meta.url), mimeType: "image/png", toString}],
    ["image@3.png", {url: new URL("./files/7856fb27bb7aabae103c36bcf78a4d805fdfd48fa4427dec294beed027c5da413bb633dbac19b44a036f183f79cee69c81b5224498a5e93c4cd39321eb4cb3ae.png", import.meta.url), mimeType: "image/png", toString}],
    ["image@4.png", {url: new URL("./files/c37e7eb2eaf6f6fe636167743486f1ac7a4adf54c87d6791558414b0ff23cee5d042c478fa1b75663f5c63be98fd900f5fef284f429e52c8c6102e2627efd3b0.png", import.meta.url), mimeType: "image/png", toString}],
    ["checkboxes.png", {url: new URL("./files/d20656625d026c6404f32e93036268b82dc0819bbef1e1d73d3b034bc5a0388dc928519e7a3608ce653258c883196de9b66aa85473e5067c7882f4df258f6ef8.png", import.meta.url), mimeType: "image/png", toString}],
    ["surveyUiInput.json", {url: new URL("./files/069367d9b8f0af82667907fc4ef604f82ba2ed7fea3865af5fa727d4671cd86a4e32cd3064cf6b93deb305fcd45d9f5e37b11b2ce4d272fe0316de09ebed6be8.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","width"], _2);
  main.variable(observer()).define(["toc"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["FileAttachment"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("types")).define("types", _types);
  main.variable(observer("roles")).define("roles", _roles);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("viewof exampleSurveyEditor")).define("viewof exampleSurveyEditor", ["view","surveyEditor","FileAttachment"], _exampleSurveyEditor);
  main.variable(observer("exampleSurveyEditor")).define("exampleSurveyEditor", ["Generators", "viewof exampleSurveyEditor"], (G, _) => G.input(_));
  main.variable(observer("viewof anotherSurveyEditorData")).define("viewof anotherSurveyEditorData", ["Inputs"], _anotherSurveyEditorData);
  main.variable(observer("anotherSurveyEditorData")).define("anotherSurveyEditorData", ["Generators", "viewof anotherSurveyEditorData"], (G, _) => G.input(_));
  main.variable(observer()).define(["Inputs","viewof exampleSurveyEditor","viewof anotherSurveyEditorData"], _13);
  main.variable(observer("surveyEditor")).define("surveyEditor", ["page","Event","view","textNodeView","filterCellsNotOfType","surveyMetadata","Inputs","randomId","summaryCard","html"], _surveyEditor);
  main.variable(observer("filterCellsNotOfType")).define("filterCellsNotOfType", _filterCellsNotOfType);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("surveyMetadata")).define("surveyMetadata", ["view","Inputs"], _surveyMetadata);
  main.variable(observer("viewof exampleSurveyMetadata")).define("viewof exampleSurveyMetadata", ["surveyMetadata"], _exampleSurveyMetadata);
  main.variable(observer("exampleSurveyMetadata")).define("exampleSurveyMetadata", ["Generators", "viewof exampleSurveyMetadata"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleSurveyMetadata"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("viewof examplePage")).define("viewof examplePage", ["page"], _examplePage);
  main.variable(observer("examplePage")).define("examplePage", ["Generators", "viewof examplePage"], (G, _) => G.input(_));
  main.variable(observer()).define(["examplePage"], _22);
  main.variable(observer()).define(["Inputs","examplePage"], _23);
  main.variable(observer("page")).define("page", ["randomId","cell","Event","view","Inputs","buttonLabel"], _page);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer("viewof exampleCell")).define("viewof exampleCell", ["cell"], _exampleCell);
  main.variable(observer("exampleCell")).define("exampleCell", ["Generators", "viewof exampleCell"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleCell"], _27);
  main.variable(observer()).define(["Inputs","viewof exampleCell"], _28);
  main.variable(observer("cell")).define("cell", ["randomId","Inputs","types","typeUI","view","buttonLabel","connectionsUI"], _cell);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer("viewof exampleType")).define("viewof exampleType", ["Inputs","types"], _exampleType);
  main.variable(observer("exampleType")).define("exampleType", ["Generators", "viewof exampleType"], (G, _) => G.input(_));
  main.variable(observer("viewof exampleTypeUI")).define("viewof exampleTypeUI", ["typeUI","Inputs","viewof exampleType"], _exampleTypeUI);
  main.variable(observer("exampleTypeUI")).define("exampleTypeUI", ["Generators", "viewof exampleTypeUI"], (G, _) => G.input(_));
  main.variable(observer()).define(["typeUI"], _33);
  main.variable(observer()).define(["exampleTypeUI"], _34);
  main.variable(observer("viewof exampleTypeUIRadio")).define("viewof exampleTypeUIRadio", ["typeUI"], _exampleTypeUIRadio);
  main.variable(observer("exampleTypeUIRadio")).define("exampleTypeUIRadio", ["Generators", "viewof exampleTypeUIRadio"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleTypeUIRadio"], _36);
  main.variable(observer("typeUIFactories")).define("typeUIFactories", ["radioUI","checkboxUI","tableUI","mdUI","textUI","numberUI","textareaUI","fileAttachmentUI","summaryUI","sectionUI","aggregateSummaryUI"], _typeUIFactories);
  main.variable(observer("typeUI")).define("typeUI", ["juice","typeUIFactories","fallbackUI"], _typeUI);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer()).define(_40);
  main.variable(observer("fallbackUI")).define("fallbackUI", ["fallbackUIEntries","bindOneWay","Inputs","view","ns"], _fallbackUI);
  main.variable(observer()).define(["md"], _42);
  main.variable(observer("viewof exampleFallbackUI")).define("viewof exampleFallbackUI", ["fallbackUI","md"], _exampleFallbackUI);
  main.variable(observer("exampleFallbackUI")).define("exampleFallbackUI", ["Generators", "viewof exampleFallbackUI"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleFallbackUI"], _44);
  main.variable(observer("fallbackUIEntries")).define("fallbackUIEntries", ["kvRowBuilder","Event","view"], _fallbackUIEntries);
  main.variable(observer("viewof exampleFallbackUIEntries")).define("viewof exampleFallbackUIEntries", ["fallbackUIEntries"], _exampleFallbackUIEntries);
  main.variable(observer("exampleFallbackUIEntries")).define("exampleFallbackUIEntries", ["Generators", "viewof exampleFallbackUIEntries"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleFallbackUIEntries"], _47);
  main.variable(observer("kvRowBuilder")).define("kvRowBuilder", ["Inputs","view"], _kvRowBuilder);
  main.variable(observer("viewof exampleKvRow")).define("viewof exampleKvRow", ["kvRowBuilder"], _exampleKvRow);
  main.variable(observer("exampleKvRow")).define("exampleKvRow", ["Generators", "viewof exampleKvRow"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _50);
  main.variable(observer("viewof sampleMdUI")).define("viewof sampleMdUI", ["mdUI"], _sampleMdUI);
  main.variable(observer("sampleMdUI")).define("sampleMdUI", ["Generators", "viewof sampleMdUI"], (G, _) => G.input(_));
  main.variable(observer()).define(["sampleMdUI"], _52);
  main.variable(observer("mdUI")).define("mdUI", ["view","Inputs"], _mdUI);
  main.variable(observer()).define(["md"], _54);
  main.variable(observer()).define(["FileAttachment"], _55);
  main.variable(observer("viewof sampleTextUI")).define("viewof sampleTextUI", ["textUI"], _sampleTextUI);
  main.variable(observer("sampleTextUI")).define("sampleTextUI", ["Generators", "viewof sampleTextUI"], (G, _) => G.input(_));
  main.variable(observer()).define(["sampleTextUI"], _57);
  main.variable(observer("textUI")).define("textUI", ["view","Inputs"], _textUI);
  main.variable(observer()).define(["FileAttachment","md"], _59);
  main.variable(observer("viewof exampleRadioUI")).define("viewof exampleRadioUI", ["radioUI"], _exampleRadioUI);
  main.variable(observer("exampleRadioUI")).define("exampleRadioUI", ["Generators", "viewof exampleRadioUI"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleRadioUI"], _61);
  main.variable(observer("radioUI")).define("radioUI", ["optionsRowBuilder","randomId","Event","view","Inputs","ns","includeOptionalAttributesUI","descriptionUI"], _radioUI);
  main.variable(observer("optionsRowBuilder")).define("optionsRowBuilder", ["Inputs","view"], _optionsRowBuilder);
  main.variable(observer()).define(["md"], _64);
  main.variable(observer()).define(["FileAttachment"], _65);
  main.variable(observer("viewof exampleCheckboxUI")).define("viewof exampleCheckboxUI", ["checkboxUI"], _exampleCheckboxUI);
  main.variable(observer("exampleCheckboxUI")).define("exampleCheckboxUI", ["Generators", "viewof exampleCheckboxUI"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleCheckboxUI"], _67);
  main.variable(observer("checkboxUI")).define("checkboxUI", ["optionsRowBuilder","randomId","Event","includeOptionalAttributesUI","view","Inputs","ns","descriptionUI"], _checkboxUI);
  main.variable(observer()).define(["typeUI"], _69);
  main.variable(observer()).define(["md"], _70);
  main.variable(observer("viewof exampleNumberUI")).define("viewof exampleNumberUI", ["numberUI"], _exampleNumberUI);
  main.variable(observer("exampleNumberUI")).define("exampleNumberUI", ["Generators", "viewof exampleNumberUI"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleNumberUI"], _72);
  main.variable(observer("numberUI")).define("numberUI", ["view","Inputs","descriptionUI"], _numberUI);
  main.variable(observer()).define(["md"], _74);
  main.variable(observer("viewof exampleTextareaUI")).define("viewof exampleTextareaUI", ["textareaUI"], _exampleTextareaUI);
  main.variable(observer("exampleTextareaUI")).define("exampleTextareaUI", ["Generators", "viewof exampleTextareaUI"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleTextareaUI"], _76);
  main.variable(observer("textareaUI")).define("textareaUI", ["view","Inputs","descriptionUI"], _textareaUI);
  main.variable(observer()).define(["md"], _78);
  main.variable(observer("viewof exampleFileAttachmentUI")).define("viewof exampleFileAttachmentUI", ["fileAttachmentUI"], _exampleFileAttachmentUI);
  main.variable(observer("exampleFileAttachmentUI")).define("exampleFileAttachmentUI", ["Generators", "viewof exampleFileAttachmentUI"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleFileAttachmentUI"], _80);
  main.variable(observer("fileAttachmentUI")).define("fileAttachmentUI", ["view","Inputs"], _fileAttachmentUI);
  main.variable(observer()).define(["md"], _82);
  main.variable(observer("viewof exampleTableUI")).define("viewof exampleTableUI", ["tableUI"], _exampleTableUI);
  main.variable(observer("exampleTableUI")).define("exampleTableUI", ["Generators", "viewof exampleTableUI"], (G, _) => G.input(_));
  main.variable(observer("viewof exampleTableUI2")).define("viewof exampleTableUI2", ["tableUI"], _exampleTableUI2);
  main.variable(observer("exampleTableUI2")).define("exampleTableUI2", ["Generators", "viewof exampleTableUI2"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleTableUI2"], _85);
  main.variable(observer("tableUI")).define("tableUI", ["tableHeaderRowBuilder","randomId","Event","view","Inputs","ns","descriptionUI"], _tableUI);
  main.variable(observer("tableHeaderRowBuilder")).define("tableHeaderRowBuilder", ["Inputs","view"], _tableHeaderRowBuilder);
  main.variable(observer()).define(["md"], _88);
  main.variable(observer("viewof sampleSummaryUI")).define("viewof sampleSummaryUI", ["summaryUI"], _sampleSummaryUI);
  main.variable(observer("sampleSummaryUI")).define("sampleSummaryUI", ["Generators", "viewof sampleSummaryUI"], (G, _) => G.input(_));
  main.variable(observer("summaryUI")).define("summaryUI", ["view","Inputs"], _summaryUI);
  main.variable(observer()).define(["md"], _91);
  main.variable(observer("viewof exampleAggregateSummaryUI")).define("viewof exampleAggregateSummaryUI", ["aggregateSummaryUI"], _exampleAggregateSummaryUI);
  main.variable(observer("exampleAggregateSummaryUI")).define("exampleAggregateSummaryUI", ["Generators", "viewof exampleAggregateSummaryUI"], (G, _) => G.input(_));
  main.variable(observer("aggregateSummaryUI")).define("aggregateSummaryUI", ["view","Inputs"], _aggregateSummaryUI);
  main.variable(observer()).define(["md"], _94);
  main.variable(observer("viewof sampleSectionUI")).define("viewof sampleSectionUI", ["sectionUI"], _sampleSectionUI);
  main.variable(observer("sampleSectionUI")).define("sampleSectionUI", ["Generators", "viewof sampleSectionUI"], (G, _) => G.input(_));
  main.variable(observer("sectionUI")).define("sectionUI", ["view","Inputs"], _sectionUI);
  main.variable(observer()).define(["md"], _97);
  main.variable(observer()).define(["md"], _98);
  main.variable(observer("viewof sampleIncludeOptionalAttributesUI")).define("viewof sampleIncludeOptionalAttributesUI", ["includeOptionalAttributesUI"], _sampleIncludeOptionalAttributesUI);
  main.variable(observer("sampleIncludeOptionalAttributesUI")).define("sampleIncludeOptionalAttributesUI", ["Generators", "viewof sampleIncludeOptionalAttributesUI"], (G, _) => G.input(_));
  main.variable(observer("viewof sampleIncludeOptionalAttributesUINoLabel")).define("viewof sampleIncludeOptionalAttributesUINoLabel", ["includeOptionalAttributesUI"], _sampleIncludeOptionalAttributesUINoLabel);
  main.variable(observer("sampleIncludeOptionalAttributesUINoLabel")).define("sampleIncludeOptionalAttributesUINoLabel", ["Generators", "viewof sampleIncludeOptionalAttributesUINoLabel"], (G, _) => G.input(_));
  main.variable(observer()).define(["sampleIncludeOptionalAttributesUINoLabel"], _101);
  main.variable(observer()).define(["sampleIncludeOptionalAttributesUI"], _102);
  main.variable(observer("viewof sampleIncludeOptionalAttributesUI3")).define("viewof sampleIncludeOptionalAttributesUI3", ["includeOptionalAttributesUI"], _sampleIncludeOptionalAttributesUI3);
  main.variable(observer("sampleIncludeOptionalAttributesUI3")).define("sampleIncludeOptionalAttributesUI3", ["Generators", "viewof sampleIncludeOptionalAttributesUI3"], (G, _) => G.input(_));
  main.variable(observer()).define(["sampleIncludeOptionalAttributesUI3"], _104);
  main.variable(observer("viewof sampleIncludeOptionalAttributesUI4")).define("viewof sampleIncludeOptionalAttributesUI4", ["includeOptionalAttributesUI"], _sampleIncludeOptionalAttributesUI4);
  main.variable(observer("sampleIncludeOptionalAttributesUI4")).define("sampleIncludeOptionalAttributesUI4", ["Generators", "viewof sampleIncludeOptionalAttributesUI4"], (G, _) => G.input(_));
  main.variable(observer("includeOptionalAttributesUI")).define("includeOptionalAttributesUI", ["Inputs","view","html","bindOneWay"], _includeOptionalAttributesUI);
  main.variable(observer()).define(["md"], _107);
  main.variable(observer()).define(["FileAttachment"], _108);
  main.variable(observer("viewof exampleInitializedConnectionsUI")).define("viewof exampleInitializedConnectionsUI", ["connectionsUI"], _exampleInitializedConnectionsUI);
  main.variable(observer("exampleInitializedConnectionsUI")).define("exampleInitializedConnectionsUI", ["Generators", "viewof exampleInitializedConnectionsUI"], (G, _) => G.input(_));
  main.variable(observer("viewof exampleConnectionsUI")).define("viewof exampleConnectionsUI", ["connectionsUI"], _exampleConnectionsUI);
  main.variable(observer("exampleConnectionsUI")).define("exampleConnectionsUI", ["Generators", "viewof exampleConnectionsUI"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleConnectionsUI"], _111);
  main.variable(observer("exampleConnectionsUIBackwritingExample")).define("exampleConnectionsUIBackwritingExample", ["viewof exampleConnectionsUI","Event"], _exampleConnectionsUIBackwritingExample);
  main.variable(observer("connectionsUI")).define("connectionsUI", ["connectionRowBuilder","randomId","Event","view"], _connectionsUI);
  main.variable(observer("connectionRowBuilder")).define("connectionRowBuilder", ["Inputs","view","roles"], _connectionRowBuilder);
  main.variable(observer("viewof exampleConnectionRowBuilder")).define("viewof exampleConnectionRowBuilder", ["connectionRowBuilder"], _exampleConnectionRowBuilder);
  main.variable(observer("exampleConnectionRowBuilder")).define("exampleConnectionRowBuilder", ["Generators", "viewof exampleConnectionRowBuilder"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleConnectionRowBuilder"], _116);
  main.variable(observer()).define(["md"], _117);
  main.variable(observer()).define(["descriptionUI"], _118);
  main.variable(observer("descriptionUI")).define("descriptionUI", ["view","Inputs","ns"], _descriptionUI);
  main.variable(observer()).define(["md"], _120);
  main.variable(observer("viewof exampleSettingsCard")).define("viewof exampleSettingsCard", ["settingsCard"], _exampleSettingsCard);
  main.variable(observer("exampleSettingsCard")).define("exampleSettingsCard", ["Generators", "viewof exampleSettingsCard"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleSettingsCard"], _122);
  main.variable(observer("settingsCard")).define("settingsCard", ["view","Inputs"], _settingsCard);
  main.variable(observer()).define(["md"], _125);
  main.variable(observer()).define(["summaryCard"], _126);
  main.variable(observer()).define(["summaryCard","html","Inputs"], _127);
  main.variable(observer("summaryCard")).define("summaryCard", ["html"], _summaryCard);
  main.variable(observer()).define(["md"], _129);
  main.variable(observer()).define(["inputLabel"], _130);
  main.variable(observer()).define(["inputLabel"], _131);
  main.variable(observer("inputLabel")).define("inputLabel", ["html"], _inputLabel);
  main.variable(observer()).define(["md"], _133);
  main.variable(observer("styles")).define("styles", ["html","commonComponentStyles"], _styles);
  main.variable(observer()).define(["md"], _135);
  main.variable(observer()).define(["html"], _136);
  main.variable(observer("tachyons")).define("tachyons", ["tachyonsExt","mainColors","accentColors"], _tachyons);
  main.variable(observer()).define(["md"], _138);
  main.variable(observer("randomId")).define("randomId", _randomId);
  const child1 = runtime.module(define1);
  main.import("view", child1);
  main.import("bindOneWay", child1);
  const child2 = runtime.module(define2);
  main.import("juice", child2);
  const child3 = runtime.module(define3);
  main.import("toc", child3);
  const child4 = runtime.module(define4);
  main.import("mainColors", child4);
  main.import("accentColors", child4);
  const child5 = runtime.module(define5);
  main.import("tachyonsExt", child5);
  const child6 = runtime.module(define6);
  main.import("pageHeader", child6);
  main.import("pageFooter", child6);
  main.import("buttonLabel", child6);
  main.import("styles", "commonComponentStyles", child6);
  main.import("ns", child6);
  main.import("textNodeView", child6);
  main.variable(observer()).define(["md"], _146);
  const child7 = runtime.module(define7);
  main.import("substratum", child7);
  main.variable(observer()).define(["substratum","invalidation"], _148);
  return main;
}
