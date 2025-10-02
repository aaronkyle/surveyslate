import define1 from "./54c12f1c72158d05@2685.js";
import define2 from "./e3c0dcb49fca94d3@288.js";
import define3 from "./0169646fe703ec69@1883.js";
import define4 from "./e2cca0a7645d62fa@764.js";
import define5 from "./bb564962578ec29b@2752.js";
import define6 from "./64641700df65baed@91.js";
import define7 from "./f92778131fd76559@1208.js";
import define8 from "./3d321b3f7d398726@482.js";
import define9 from "./0b16aaecf59cca0a@803.js";
import define10 from "./6a35be87fa9e4ba9@291.js";
import define11 from "./bad810ff1e80611b@137.js";

function _1(md){return(
md`# Survey Slate | Designer Tools

_Create, edit, and connect questions for both simple and complex surveys using a variety of input types. Also check out the [User Guide for Survey Slate Designer](https://observablehq.com/@categorise/surveyslate-user-guide-for-grouping-questions)._`
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

function _loginTitle(md){return(
md`## Login`
)}

function _5(md){return(
md`test credentials for demoEditor
~~~js
{
  "accessKeyId": "AKIAQO7DBPIFDAUBK4SL",
  "secretAccessKey": "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"
}

~~~
`
)}

function _login($0){return(
$0
)}

function _credStore(saveCreds){return(
saveCreds
)}

function _surveyChooserTitle(md){return(
md`## Survey Chooser`
)}

function _survey(Inputs,surveys){return(
Inputs.select(surveys)
)}

function _surveys(myTags){return(
myTags['designer'].split(" ")
)}

function _11(md){return(
md`## Designer UI`
)}

function _loadStyles(tachyons,designUiStyles){return(
tachyons, designUiStyles
)}

function _surveyUi(initialLoadQuestions,initialLoadLayout,load_config,view,pageHeader,Inputs,buttonLabel,importUi,exportUi,surveyEditor,pageFooter)
{
  (initialLoadQuestions, initialLoadLayout, load_config)

  console.log("Executing surveyUi")

  const updateEditorState = (state) => {
    ui.dataset.surveyEditorState = state;
    console.log(ui.dataset.surveyEditorState);
  };
  const resetEditorState = () => updateEditorState('editor');

  const ui = view`<div
  class="[ survey-ui ][ brand-font bg-near-white ba b--light-gray ]"
  data-survey-editor-state="editor">
  <div class="solid-shadow-y-1">${pageHeader(['Survey Designer'])}</div>
  <main class="[ mr-auto mw9 ][ space-y-3 pa3 ]">
    <div class="toolbar flex items-center">
      <!-- <div class=""><a class="brand hover-underline" href="#">← Back</a></div> -->
      <div class="ml-auto button-group">
        ${Inputs.button(buttonLabel({label: "Import", iconLeft: "download"}), {reduce: () => updateEditorState('import')})}
      ${Inputs.button(buttonLabel({label: "Export", iconLeft: "upload"}), {reduce: () => updateEditorState('export')})}
      </div>
    </div>

    <div class="[ survey-editor__import ][ space-y-3 ]">
      <div class="card space-y-3">
        <div class="flex">
          <h2 class="mr-auto">Import</h2>
          ${Inputs.button("Close", { reduce: resetEditorState})}
        </div>
        <div class="space-y-3">
          <div>${importUi(resetEditorState)}</div>
        </div>
      </div>
    </div>
    <div class="[ survey-editor__export ][ space-y-3 ]">
      <div class="card space-y-3">
        <div class="flex">
          <h2 class="mr-auto">Export</h2>
          ${Inputs.button("Close", { reduce: resetEditorState})}
        </div>
        <!-- Exports UI -->
        <div>${exportUi()}</div>
      </div>
    </div>
    <div class="[ survey-editor__editor ][ space-y-3 ]">
      ${['...', surveyEditor()]}      
    </div>
  </main>
  ${pageFooter()}
</div>`

  return ui;
}


function _questionToUiCell(){return(
function questionToUiCell(source) {
  const questionAttribute = ([k, v]) => {
    k = k.trim()
    if (k.endsWith("_json")) {
      return [k.replace(/_json$/, ''),
              Array.isArray(v) ? v.map(v => questionToUiCell(JSON.parse("(" + v + ")")))
                                       : questionToUiCell(JSON.parse("(" + v + ")"))] 
    }
    if (k.endsWith("_eval")) {
      return [k.replace(/_eval$/, ''),
              Array.isArray(v) ? v.map(v => questionToUiCell(eval("(" + v + ")")))
                                       : questionToUiCell(eval("(" + v + ")"))]    
    }
    if (k.endsWith("_js")) {
      return [k.replace(/_js$/, ''),
              Array.isArray(v) ? v.map(v => questionToUiCell(eval("(" + v + ")")))
                                       : questionToUiCell(eval("(" + v + ")"))]    
    }
    if (k.endsWith("_md")) {
      return [k.replace(/_md$/, ''), v]    
    }
    if (!k || !v) return undefined;
    
    return [k, v]
  }
  if (Array.isArray(source))
    return source.map(arg => questionToUiCell(arg));
  else if (typeof source === 'object')
    return Object.fromEntries(Object.entries(source).map(questionAttribute).filter(e => e))
  else 
    return source
}
)}

function _uiCellToQuestion(_){return(
function uiCellToQuestion(args) {
  const uiAttribute = ([k, v]) => {
    if (v == "") return undefined;
    if (k == "connections") return undefined;
    if (k == "id") k = "value";

    const arrays = ["options", "rows", "columns"]
    if (arrays.includes(k) && Array.isArray(v)) {
      return [k + "_js", uiCellToQuestion(v).map(e => JSON.stringify(e))];
    } 

    v = uiCellToQuestion(v);

    if (_.isEqual(v, {})) return undefined;
    if (v === undefined) return undefined;

    if (["description"].includes(k)) return [k + "_md", v];
    
    return [k, v]
  }
  if (Array.isArray(args))
    return args.map(arg => uiCellToQuestion(arg));
  else if (typeof args === 'object')
    return Object.fromEntries(Object.entries(args).map(uiAttribute).filter(a => a !== undefined))
  else if (typeof args === 'number')
    return String(args)
  else 
    return args
}
)}

function _17(questionsNoLayout){return(
questionsNoLayout
)}

function _surveyUiInput(questionsNoLayout,layout,questions,questionToUiCell,Inputs,surveyConfig)
{
  console.log("Executing viewof surveyUiInput")
  // Go through the layout *in order* and build up pages with cells *in order*
  const pagesByMenu = {};

  const layoutUi = [...questionsNoLayout.entries()].map(([id, q]) => ({
    menu: "nolayout",
    id, set:"", role:""
  })).concat(layout.data);
  
  layoutUi.forEach(l => {
    const connections = [];
    // set and role are comma deliminated lists
    // zip them into an array
    const sets = l.set.split(",");
    const roles = l.role.split(",");
    for (let i = 0; i < Math.max(sets.length, roles.length); i++) {
      connections.push({
        set: sets[i],
        role: roles[i],
      })
    }
    const source = questions.get(l.id);
    if (!source) return;
    const question = questionToUiCell(source);
    
    pagesByMenu[l.menu] = pagesByMenu[l.menu] || {
      title: l.menu,
      cells: []
    };
    pagesByMenu[l.menu].cells.push({
      id: l.id,
      inner: {
        type: question.type,
        result: {
          ...question,
          ...(question.options && {options: question.options.map(
            (option, index) => ({...option, id: option.value})
          )})
        }
      },
      connections: {
        connections: connections 
      }
    })
  })

  return Inputs.input(({
    metadata: {
      ...surveyConfig,
      title: surveyConfig.pageTitle
    },
    pages: Object.entries(pagesByMenu).map(([menu, page]) => page)
  }))  
}


function _syncSurveyUiInputToSurveyUi(_,$0,$1,Event)
{
  console.log("syncSurveyUiInputToSurveyUi");
  if (!_.isEqual($0.value, $1.value)) {
    console.log("syncSurveyUiInputToSurveyUi: change detected");
    $0.value = $1.value;
    // Manually updating the UI state
    // viewof surveyUi.applyValueUpdates();
    $0.dispatchEvent(new Event('input', {bubbles: true}))
  }
}


function _syncSurveyUIToSurveyUiOutput(_,$0,surveyUi,Event)
{
  console.log("syncSurveyUIToSurveyUiOutput")
  // Reactive to UI changes (i.e. surveyUi)
  if (!_.isEqual($0.value, surveyUi)) {
    console.log("syncSurveyUIToSurveyUiOutput: change detected");
    $0.value = _.cloneDeep(surveyUi);
    $0.dispatchEvent(new Event('input', {bubbles: true}))
  }
}


function _surveyUiOutput(Inputs){return(
Inputs.input(undefined)
)}

function _syncSurveyOutput(surveyUiOutput,invalidation,uiCellToQuestion,$0,$1,Event)
{
  console.log("surveyOutput")
  // convert ui representation (pages -> cells) to {questions, layout, config} for storage.

  if (surveyUiOutput.pages.length === 0) return invalidation;
  // Extract questions
  const questions = new Map();
  surveyUiOutput.pages.forEach(page => {
    page.cells.forEach(cell => {
      questions.set(cell.id, uiCellToQuestion({
        ...cell.inner.result,
        type: cell.inner.type,
      }))
    })
  });

  // Extract layout
  const layout = [];
  surveyUiOutput.pages.forEach(page => {
    page.cells.forEach(cell => {
      const connections = cell?.connections?.connections || []
      const set = connections.map(c => c.set).join(",");
      layout.push({
        id: cell.id,
        menu: page.title,
        set,
        role: set === "" ? "" : connections.map(c => c.role).join(","),
      })
    })
  });

  // Extract config
  const config = {
    ...$0.value, // carry over initial state
    pageTitle: surveyUiOutput.metadata.title
  };
  
  $1.value = {
    questions,
    layout,
    config
  };
  $1.dispatchEvent(new Event('input', {bubbles: true}))
}


function _surveyOutput(Inputs){return(
Inputs.input(undefined)
)}

function _diff(require){return(
require('https://bundle.run/json-diff@0.5.4')
)}

function _selectedQuestionDiff(Inputs,logicalQuestionDiff){return(
Inputs.select(Object.keys(logicalQuestionDiff).map(k => k.replace("__deleted", '').replace("__added", '')), {label: "Select question diff"})
)}

function _26(md,selectedQuestionDiff,questions,surveyOutput){return(
md`
question: <b>${selectedQuestionDiff}</b>

Question Input to UI questions
~~~js
${JSON.stringify(questions.get(selectedQuestionDiff), null, 2)}
~~~

Question Output to UI
~~~js
${JSON.stringify(surveyOutput.questions.get(selectedQuestionDiff), null, 2)}
~~~
`
)}

function _normalizedQuestions(csvToQuestions,questionsToCSV,questions,reifyAttributes){return(
Object.fromEntries([...csvToQuestions(questionsToCSV(questions)).entries()].map(reifyAttributes))
)}

function _normalizedQuestionsOutput(csvToQuestions,questionsToCSV,surveyOutput,reifyAttributes){return(
Object.fromEntries([...csvToQuestions(questionsToCSV(surveyOutput.questions)).entries()]
                     .map(reifyAttributes).filter(e => e[0] !== " "))
)}

function _logicalQuestionDiff(diff,normalizedQuestions,normalizedQuestionsOutput){return(
Object.fromEntries(Object.entries(
  diff.diff(normalizedQuestions, normalizedQuestionsOutput) || []
))
)}

function _30(md){return(
md`## Autosave UI`
)}

function _autosave(saveQuestions,$0,saveLayout,saveConfig,files,$1,invalidation,Generators)
{
  async function saveState() {
    console.log("saveState")
    await Promise.all([
      saveQuestions($0.value.questions),
      saveLayout($0.value.layout),
      saveConfig($0.value.config)
    ]);
    await files.save("settings.json", $1.value);
    return "Saved " + new Date()
  }
  console.log("Initializing autosave");
  function debounce(func, timeout = 2000){ // 2 seconds
    let timer;
    let hasRun = true; // Only one of setTimeout OR visibility change should run
    let args;
    const runTask = async () => {
      if (!hasRun) {
        console.log("auto_save")
        hasRun = true;
        await func.apply(this, args);
      }
    };
    
    window.addEventListener('beforeunload', function (e) {
      if (!hasRun) {
        // Cancel the event
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = "Please wait for your latest changes to be saved. Try again in a few seconds";
      }
    });
    
    return (...latestArgs) => {
      args = latestArgs;
      hasRun = false;
      
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", runTask)
      
      timer = setTimeout(runTask, timeout);
      document.addEventListener("visibilitychange", runTask);
      
      invalidation.then(() => document.removeEventListener("visibilitychange", runTask))
    };
  }
  
  let first = true;
  
  return Generators.observe(next => {
    const autosave = debounce(async () => {
      if (first) {
        console.log("Skipping first save as its from page load not human interaction")
        first = false; // Skip first save as it's from page load
      } else {
        console.log("saving")
        const answers = await saveState()
        next(answers);
      }
    });
    $0.addEventListener('input', autosave);
    invalidation.then(() => $0.removeEventListener('input', autosave))
    
    next("Autosave initialized")
  })
  
}


function _32(md){return(
md`## Export`
)}

function _exportDataUri(surveyOutput){return(
URL.createObjectURL(new Blob([ JSON.stringify({
  ...surveyOutput,
  questions: Object.fromEntries(surveyOutput.questions.entries())
}) ], { type: 'application/json' }))
)}

function _34(htl,exportDataUri){return(
htl.html`<a href=${exportDataUri} download="survey_${Date.now()}.json">
  download survey.json
</a>`
)}

function _35(md){return(
md`## Persistence`
)}

async function _settings(Inputs,files){return(
Inputs.input(await files.load('settings.json'))
)}

function _files(putObject,config,survey,getObject){return(
{
  save: async (key, object) => {
    await putObject(config.PRIVATE_BUCKET, `surveys/${survey}/${key}`, JSON.stringify(object), {
      tags: {
        "survey": survey
      },
      ...(key === "settings.json" && {'CacheControl': "no-cache"})
    })
  },
  load: async (key, object) => {
    return JSON.parse(await getObject(config.PRIVATE_BUCKET, `surveys/${survey}/${key}`))
  }
}
)}

function _saveQuestions(files,$0){return(
async (questions) => {
  const name = `questions_${Date.now()}.json`
  await files.save(name, Array.from(questions.entries()))
  $0.value = {
    ...$0.value,
    questions: [
      ...($0.value.questions || []),
      name
    ]
  }
  return name;
}
)}

function _loadQuestions(files){return(
async (name) => {
  const entries = await files.load(name)
  return new Map(entries);
}
)}

function _saveLayout(files,$0){return(
async (layout) => {
  const name = `layout_${Date.now()}.json`
  await files.save(name, layout);
  $0.value = {
    ...$0.value,
    layout: [
      ...($0.value.layout || []),
      name
    ]
  };
  return name;
}
)}

function _loadLayout(files){return(
async (name) => await files.load(name)
)}

function _saveConfig(files,$0){return(
async (config) => {
  const name = `config_${Date.now()}.json`
  await files.save(name, config)
  $0.value = {
    ...$0.value,
    configs: [
      ...($0.value.configs || []),
      name
    ]
  };
  return name;
}
)}

function _loadConfig(files){return(
async (name) => await files.load(name)
)}

function _saveVersion($0,files){return(
async function saveVersion() {
  const name = `version_${Date.now()}.json`
  
  const version = ({
    layout: $0.value.layout.at(-1),
    questions: $0.value.questions.at(-1),
    config: $0.value.configs.at(-1)
  });
  
  await files.save(name, version)
  
  $0.value = {
    ...$0.value,
    versions: [
      ...($0.value.versions || []),
      name
    ]
  };
  
  await files.save("settings.json", $0.value);
  
  return name;
}
)}

function _45($0){return(
$0.value.versions.at(-1)
)}

function _revertChanges(files,$0){return(
async function() {
  const version = await files.load($0.value.versions.at(-1))
  $0.value = {
    ...$0.value,
    configs: [
      ...($0.value.configs || []),
      version.config
    ],
    questions: [
      ...($0.value.questions || []),
      version.questions
    ],
    layout: [
      ...($0.value.layout || []),
      version.layout
    ]
  };
  
  await files.save("settings.json", $0.value);
}
)}

function _47(md){return(
md`## Questions`
)}

function _questions(Inputs){return(
Inputs.input(new Map())
)}

function _initialLoadQuestions(survey){return(
survey, false
)}

async function _initialQuestionLoader(initialLoadQuestions,$0,$1,loadQuestions,settings,Event)
{
  if (!initialLoadQuestions) {
    $0.value = true;
    $1.value = await loadQuestions(settings.questions[settings.questions.length - 1])
    $1.dispatchEvent(new Event('input', {bubbles: true}));
  }
  return "Initial Question Loader"
}


function _51(md){return(
md`### Import external CSV of questions`
)}

function _questionUpload(fileInput){return(
fileInput({prompt: "Drop questions as a CSV file here"})
)}

async function _onQuestionUpload($0,csvToQuestions,questionUpload,Event)
{
  $0.value = csvToQuestions(await questionUpload.csv());
  $0.dispatchEvent(new Event('input', {bubbles: true}));
}


function _csvToQuestions(sanitizeValue){return(
function csvToQuestions(csv) {
  return csv.reduce(
    (acc, row) => {
      

      // Now append the rows question attributes and values to the current question being processed
      const attribute = row['key'];
      const value = row['value'];
      const id = row['id'] || acc.previous?.id;

      let current = acc.previous;
      
      if (id != acc.previous?.id) {
        current = {
          id: id
        }
        acc.questions.push(current)
      }

      const arrays = ['options', 'rows', 'columns'];
      if (arrays.some(arr => attribute.startsWith(arr))) {
        // But if the element is packed as an array we don't unwind
        let packed = false;
        try {
          if (Array.isArray(eval(value))) {
            packed = true;
            current[attribute] = value;
          }
        } catch (err) {}

        if (attribute === 'rows' && !Number.isNaN(+value)) {
          // When rows is in a textarea is it not in an array
          current[attribute] = value;
        } else if (!packed) {
          // Arrays come in a list of elements
          const array = current[attribute] || [];
          if (arrays.includes(attribute)) {
            array.push({
              value: value,
              label: value
            });
          } else {
            array.push(value);
          }
  
          current[attribute] = array; 
        }
      } else {
        current[attribute] = sanitizeValue(value);
      }

      return {
        questions: acc.questions,
        previous: current
      }
    }
    , {
      questions: [],
      previous: null
    }
  ).questions.reduce( // Index by id
    (map, q) => {
      const {id, ...value} = q
      map.set(id, value)
      return map;
    },
    new Map() // Map remembers insertion order which is useful
  )
}
)}

function _questionsToCSV(){return(
(questions) =>
  [...questions.entries()].reduce(
    (acc, row) => {
      Object.entries(row[1] || row[0]).forEach(([k,v]) => {
        if (k == 'id') return;
        if (Array.isArray(v)) {
          v.forEach(e => {
            if (typeof e === 'string') {
              acc.push({
                'id': row[0],
                'key': k,
                'value': e
              })
            } else if (typeof e === 'object' && typeof e.label === 'string' && e.label === e.value) {
              acc.push({
                'id': row[0],
                'key': k,
                'value': e.label
              })
            } else {
              throw new Error(Object.keys(e))
            } 
          })
        } else if (typeof v === 'string'){
          acc.push({
            'id': row[0],
            'key': k,
            'value':v
          })
        } else if (typeof v === 'boolean') {
          acc.push({
            'id': row[0],
            'key': k,
            'value': v ? "TRUE" : "FALSE"
          })
        } else if (typeof v === 'object') {
          acc.push({
            'id': row[0],
            'key': k + "_js",
            'value': JSON.stringify(v)
          })
        }else {
          throw new Error(v)
        }
      });
      
      return acc;
    },[])
)}

function _56(md){return(
md`### Export questions to CSV`
)}

function _questionsCsvDataUri(d3,exportQuestionsCSV){return(
URL.createObjectURL(new Blob([ d3.csvFormat(exportQuestionsCSV) ], { type: 'text/csv' }))
)}

function _questionsCsvDataUriView(Inputs){return(
Inputs.input(undefined)
)}

function _updateQuestionsCsvDataUriView($0,questionsCsvDataUri,Event)
{
  $0.value = questionsCsvDataUri /* sync questionsCsvDataUri changes to the view */
  $0.dispatchEvent(new Event('input', {bubbles: true}))
}


function _downloadQuestionsCsv(htl,$0,exportQuestionsProblems,md){return(
htl.html`<a href=${$0.value} download="questions_${Date.now()}.csv">
  Download questions.csv
</a>
${exportQuestionsProblems.length > 0 ? md`<mark> Warning, some questions are not exporting properly, you may lose data in export` : null}
`
)}

function _exportQuestionsCSV(questionsToCSV,questions){return(
questionsToCSV(questions)
)}

function _exportQuestionsProblems(csvToQuestions,exportQuestionsCSV,questions,_)
{
  const exportedQuestions = csvToQuestions(exportQuestionsCSV);
  const qProblems = [...questions.keys()].reduce((acc, q) => {
    const question = questions.get(q);
    const exported = exportedQuestions.get(q);
    if (!_.isEqual(question, exported)) {
      acc.push({
        q, question, exported
      })
    }
    return acc
  }, [])
  
  const eProblems = [...exportedQuestions.keys()].reduce((acc, q) => {
    const question = questions.get(q);
    const exported = exportedQuestions.get(q);
    if (!_.isEqual(question, exported)) {
      acc.push({
        q, question, exported
      })
    }
    return acc
  }, qProblems)
  
  return eProblems;
  
}


function _63(md){return(
md`## Layout`
)}

function _layoutData(Inputs){return(
Inputs.input([])
)}

function _65(md){return(
md`### Import layout from CSV`
)}

function _layoutUpload(fileInput){return(
fileInput({prompt: "Drop layout as a CSV file here"})
)}

async function _onLayoutUpload($0,csvToLayout,layoutUpload,Event)
{
  $0.value = {data: csvToLayout(await layoutUpload.csv())}
  $0.dispatchEvent(new Event('input', {bubbles: true}))
}


function _csvToLayout(){return(
function csvToLayout(csv) {
  return csv.reduce(
    (acc, row) => {
      acc.push(row)
      return acc
    }, []
  )
}
)}

function _69(md){return(
md`### Export layout to CSV`
)}

function _layoutCsvDataUri(d3,exportLayoutCSV){return(
URL.createObjectURL(new Blob([ d3.csvFormat(exportLayoutCSV) ], { type: 'text/csv' }))
)}

function _layoutCsvDataUriView(Inputs){return(
Inputs.input(undefined)
)}

function _updateLayoutCsvDataUriView($0,layoutCsvDataUri,Event)
{
  $0.value = layoutCsvDataUri
  $0.dispatchEvent(new Event('input', {bubbles: true}))
}


function _downloadLayoutCsv(htl,$0,exportLayoutProblems,md){return(
htl.html`<a href=${$0.value} download="layout_${Date.now()}.csv">
  Download layout.csv
</a>
${exportLayoutProblems.length > 0 ? md`<mark> Warning, some layouts are not exporting properly, you may lose data in export` : null}
`
)}

function _initialLoadLayout(){return(
false
)}

async function _initialLayoutLoader(initialLoadLayout,$0,setLayout,loadLayout,settings)
{
  if (!initialLoadLayout) {
    $0.value = true;
    setLayout([...await loadLayout(settings.layout[settings.layout.length - 1])])
  }
  return "Initial Layout Loader"
}


function _setLayout(learnChoices,menuOptions,setOptions,$0,Event,$1,layoutData,$2){return(
function setLayout(data) {
  const choices = learnChoices(data);
  
  menuOptions.data = choices["menu"]
  setOptions.data = choices["set"]
  $0.dispatchEvent(new Event('input', {bubbles: true}))
  $1.dispatchEvent(new Event('input', {bubbles: true}))
  
  
  layoutData.data = data;
  $2.dispatchEvent(new Event('input', {bubbles: true}))
}
)}

function _learnChoices(){return(
(data) => {
  const columns = ["menu", "set"]
  const counts = data.reduce(
    (arr, l) => {
      columns.forEach(c => { 
        arr[c] = arr[c] || {};
        arr[c][l[c]] = (arr[c][l[c]] || 0) + 1 
      })
      return arr;
    }, {})
  return Object.fromEntries(Object.entries(counts).map(([key, counts]) => {
    return [key, Object.keys(counts).map(k => ({[key]: k}))]
  }))
}
)}

function _78(md){return(
md`### Export UI`
)}

function _sampleExportUi(exportUi){return(
exportUi()
)}

function _exportUi(view,$0,$1){return(
() => {
  const now = Date.now();

  return view`<div class="space-y-3">
  <div>
    <a href=${$0.value} download="questions_${Date.now()}.csv">Download Questions</a>
  </div>

  <div>
    <a href=${$1.value} download="layout_${Date.now()}.csv">Download Layout</a>
  </div>
</div>`
}
)}

function _81(md){return(
md`### Import UI`
)}

function _sampleImportUi(importUi){return(
importUi()
)}

function _83(sampleImportUi){return(
sampleImportUi
)}

function _importUi($0,csvToQuestions,$1,csvToLayout,Event,Inputs,buttonLabel,view,fileInput){return(
(afterSave) => {
  const submitFiles = async ()  => {
    if (ui.value.questionsCsv) {
      console.log('Updating questions CSV')
      $0.value = csvToQuestions(await ui.value.questionsCsv.csv());
    }

    if (ui.value.layoutCsv) {
      console.log('Updating layout CSV')
      $1.value = {data: csvToLayout(await ui.value.layoutCsv.csv())}
    }

    if (ui.value.questionsCsv || ui.value.layoutCsv) {
      $0.dispatchEvent(new Event('input', {bubbles: true}));
      $1.dispatchEvent(new Event('input', {bubbles: true}))
    }

    if (typeof afterSave === 'function') {
      afterSave();
    }
  }
  const submit = Inputs.button(buttonLabel({label: "Save"}), {reduce: submitFiles});
  
  const ui = view`<div class="space-y-3">
  <h3 class="f5">Questions CSV file</h3>
  ${['questionsCsv', fileInput({prompt: "Drop questions as a CSV file here"})]}
  <h3 class="f5">Layout CSV file</h3>
  ${['layoutCsv', fileInput({prompt: "Drop layout as a CSV file here"})]}
  <div>
    ${submit}
  </div>`
  
  return ui;
}
)}

function _85(md){return(
md`### Edit user choices within the layout Editors`
)}

function _selection(dataEditor,Inputs,view,Event,cautious){return(
function selection(title) {
  const choices = dataEditor([], {
    columns: [title],
    width: {
      [title]: "400px"
    },
    format: {
      [title]: (d) => Inputs.text({value: d, width: "400px", disabled: true}),
    },
  })
  const addForm = view`<div style="display: flex;">
    ${[title, Inputs.text({
      label: `Add ${title}`
    })]}
    ${Inputs.button("add", {
      reduce: () => {
        choices.value.data = [...choices.value.data, addForm.value]
        addForm[title].value = '';
        choices.dispatchEvent(new Event('input', {bubbles: true}));
      }
    })}
  `

  return view`<div><details>
      <summary>Edit choices for <b>${title}</b></summary>
      ${['...', choices]}${cautious(() => addForm)}
  `
}
)}

function _menuOptions(selection){return(
selection("menu")
)}

function _setOptions(selection){return(
selection("set")
)}

function _89(md){return(
md`### Layout Data`
)}

function _layout(Inputs,layoutData){return(
Inputs.input(layoutData)
)}

function _91(md){return(
md`## Data Quality Checks`
)}

function _92(md){return(
md`### Questions that have no layout`
)}

function _93(questionsNoLayout,dataEditor,md)
{
  const results = [...questionsNoLayout.entries()].map(([k, v]) => ({id: k, ...v}));
  if (results.length > 0) {
    return dataEditor(results, {
      columns: ["id", "type"]
    })
  } else {
    return md`✅ The are no questions with no layout`
  }
}


function _94(questionsNoLayout){return(
questionsNoLayout.values().next()
)}

function _95(md){return(
md`### Layouts with no question`
)}

function _96(layoutsNoQuestion,dataEditor,md)
{
  const results = layoutsNoQuestion.map(([name, layoutArray]) => layoutArray[0]);
  if (results.length > 0) {
    return dataEditor(results)
  } else {
    return md`✅ The are no layouts with no questions`
  }
}


function _97(md){return(
md`### Questions with options but some of the options do not have a 'value'

All options need value's defined, this is the key used to ensure updates to question text do not affect the endusers pre-existing answers.
`
)}

function _98(optionsWithoutValue,md)
{
  if (optionsWithoutValue.length > 0) {
    return md`⚠️ There are ${optionsWithoutValue.length} mistakes
  ${optionsWithoutValue.map(mistake => `\n- ${mistake[1].cell_name}`)}`
  } else {
    return md`✅ All options have a value defined`
  }
}


function _optionsWithoutValue(surveyOutput,reifyAttributes){return(
[...surveyOutput.questions.entries()].map(([k, q]) => [k, reifyAttributes(q)]).filter(([name, question]) => question.options &&  !question.options.some(option => option.value))
)}

function _layoutById(d3,layout){return(
d3.group(layout.data, d => d.id)
)}

function _duplicateLayouts(layoutById){return(
Object.fromEntries([...layoutById.entries()].filter(([name, layoutArr]) => layoutArr.length  > 1))
)}

function _questionsNoLayout(questions,layoutById){return(
new Map([...questions.entries()].filter(([name, q]) => !layoutById.has(name)))
)}

function _layoutsNoQuestion(layoutById,surveyOutput){return(
([...layoutById.keys()].filter(name => !surveyOutput.questions.has(name))).map(k => [k, layoutById.get(k)])
)}

function _exportLayoutCSV(surveyOutput){return(
surveyOutput.layout
)}

function _exportLayoutProblems(csvToLayout,exportLayoutCSV,surveyOutput,_,layout)
{
  const exportedLayout = csvToLayout(exportLayoutCSV);
  
  const problems = [];
  for (var i = 0; i < Math.max(surveyOutput.layout.length, exportedLayout.length); i++) {
    if (!_.isEqual(layout.data[i], exportedLayout[i])) {
      problems.push({
        row: i,
        layout: layout.data[i],
        exportedLayout: exportedLayout[1]
      })
    }
  }
  return problems;
}


function _106(md){return(
md`## Config

Config is additional data that might be useful such as the menu display titles.`
)}

function _latestConfig(editor){return(
editor({
  type: "object",
  title: "Config",
  properties: {
    pageTitle: {
      type: "string"
    },
    menuSegmentLabels: {
      type: "object",
      additionalProperties: { "type": "string" }
    }
  }
}, {
  theme: "spectre",
  disable_edit_json: true,
  disable_properties: false,
  iconlib: "spectre",
  show_errors: "always",
  prompt_before_delete: "false"
})
)}

async function* _save_config($0,_,latestConfig,md,saveConfig)
{
  
  if ($0.value && !_.isEqual(latestConfig, $0.value)) {
    yield md`Saving...`
    $0.value = latestConfig;
    await saveConfig(latestConfig);
    yield md`saved`
  } else {
    yield md`no changes`
  }
}


function _surveyConfig(Inputs){return(
Inputs.input()
)}

function _sync_ui($0,surveyConfig)
{
  $0.value = surveyConfig
}


async function _load_config($0,settings,loadConfig,Event)
{
  $0.value = settings.configs?.length > 0 
                                ? await loadConfig(settings.configs[settings.configs.length - 1])
                                : {};
  $0.dispatchEvent(new Event('input', {bubbles: true}))
}


function _113(md){return(
md`## Styles`
)}

function _styles(html){return(
html`<style>
/* Survey Editor */

.survey-editor__import,
.survey-editor__export,
.survey-editor__editor {
  display: none;
}

[data-survey-editor-state="import"] .survey-editor__import,
[data-survey-editor-state="export"] .survey-editor__export,
[data-survey-editor-state="editor"] .survey-editor__editor {
  display: block;
}

/* Styles when displayed as a stand alone notebook */
[data-standalone-designer-notebook] .observablehq > h2 {
  padding-top: var(--spacing-medium); 
  border-top: 1px solid;
  border-color: #eee; /* .b--light-gray */
}
</style>`
)}

function _115(md){return(
md`### Styles for the in notebook demo`
)}

function _116(htl){return(
htl.html`<style>
  .survey-ui {
    overflow-y: auto;
    max-height: 600px;
    overscroll-behavior-y: contain;
  }
</style>`
)}

function _surveyPreviewTitle(md){return(
md`## Survey Preview`
)}

function _responses(addMenuBehaviour,surveyView,surveyOutput)
{
  addMenuBehaviour
  const view = surveyView(surveyOutput.questions, surveyOutput.layout, surveyOutput.config, new Map(), {
    putFile: (name) => console.log("mock save " + name),
    getFile: (name) => console.log("mock get " + name),
  })
  
  return view
}


function _119(responses){return(
responses
)}

function _121(md){return(
md`## Preview Answers`
)}

function _122(responses){return(
responses
)}

function _revertTitle(md){return(
md`## Revert changes

Rollback survey to last deployed version`
)}

function _reollbackButton(Inputs,revertChanges){return(
Inputs.button("revert", {
  reduce: async () => {
    await revertChanges(); 
  }
})
)}

function _deployTitle(md){return(
md`## Deploy Survey Version`
)}

function _lastDeployed($0,deployButton,md){return(
md`Last deployed: ${new Date(Number.parseInt($0.value.versions.at(-1).replace("version_", "").replace(".json", "")))}

${/*force update on deploy*/ (deployButton, '')}`
)}

function _deployButton(Inputs,saveVersion){return(
Inputs.button("deploy", {
  reduce: async () => {
    await saveVersion(); 
  }
})
)}

function _128(md){return(
md`---
## Cloud Configuration`
)}

function _me(getUser){return(
getUser()
)}

function _myTags(listUserTags,me){return(
listUserTags(me.UserName)
)}

function _REGION(){return(
'us-east-2'
)}

function _133(md){return(
md`---

## Helpers`
)}

function _sanitizeValue(){return(
(text) => {
  text = text.trim()
  if (text === "TRUE") return true;
  if (text === "FALSE") return false;
  return text
}
)}

function _135(md){return(
md`### Dependancies`
)}

function _142(md){return(
md`---`
)}

function _144(substratum,invalidation){return(
substratum({ invalidation })
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","width"], _2);
  main.variable(observer()).define(["toc"], _3);
  main.variable(observer("loginTitle")).define("loginTitle", ["md"], _loginTitle);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("viewof login")).define("viewof login", ["viewof manualCredentials"], _login);
  main.variable(observer("login")).define("login", ["Generators", "viewof login"], (G, _) => G.input(_));
  main.variable(observer("credStore")).define("credStore", ["saveCreds"], _credStore);
  main.variable(observer("surveyChooserTitle")).define("surveyChooserTitle", ["md"], _surveyChooserTitle);
  main.variable(observer("viewof survey")).define("viewof survey", ["Inputs","surveys"], _survey);
  main.variable(observer("survey")).define("survey", ["Generators", "viewof survey"], (G, _) => G.input(_));
  main.variable(observer("surveys")).define("surveys", ["myTags"], _surveys);
  main.variable(observer()).define(["md"], _11);
  const child1 = runtime.module(define1);
  main.import("surveyEditor", child1);
  main.import("styles", "designUiStyles", child1);
  main.import("tachyons", child1);
  main.variable(observer("loadStyles")).define("loadStyles", ["tachyons","designUiStyles"], _loadStyles);
  main.variable(observer("viewof surveyUi")).define("viewof surveyUi", ["initialLoadQuestions","initialLoadLayout","load_config","view","pageHeader","Inputs","buttonLabel","importUi","exportUi","surveyEditor","pageFooter"], _surveyUi);
  main.variable(observer("surveyUi")).define("surveyUi", ["Generators", "viewof surveyUi"], (G, _) => G.input(_));
  main.variable(observer("questionToUiCell")).define("questionToUiCell", _questionToUiCell);
  main.variable(observer("uiCellToQuestion")).define("uiCellToQuestion", ["_"], _uiCellToQuestion);
  main.variable(observer()).define(["questionsNoLayout"], _17);
  main.variable(observer("viewof surveyUiInput")).define("viewof surveyUiInput", ["questionsNoLayout","layout","questions","questionToUiCell","Inputs","surveyConfig"], _surveyUiInput);
  main.variable(observer("surveyUiInput")).define("surveyUiInput", ["Generators", "viewof surveyUiInput"], (G, _) => G.input(_));
  main.variable(observer("syncSurveyUiInputToSurveyUi")).define("syncSurveyUiInputToSurveyUi", ["_","viewof surveyUi","viewof surveyUiInput","Event"], _syncSurveyUiInputToSurveyUi);
  main.variable(observer("syncSurveyUIToSurveyUiOutput")).define("syncSurveyUIToSurveyUiOutput", ["_","viewof surveyUiOutput","surveyUi","Event"], _syncSurveyUIToSurveyUiOutput);
  main.variable(observer("viewof surveyUiOutput")).define("viewof surveyUiOutput", ["Inputs"], _surveyUiOutput);
  main.variable(observer("surveyUiOutput")).define("surveyUiOutput", ["Generators", "viewof surveyUiOutput"], (G, _) => G.input(_));
  main.variable(observer("syncSurveyOutput")).define("syncSurveyOutput", ["surveyUiOutput","invalidation","uiCellToQuestion","viewof surveyConfig","viewof surveyOutput","Event"], _syncSurveyOutput);
  main.variable(observer("viewof surveyOutput")).define("viewof surveyOutput", ["Inputs"], _surveyOutput);
  main.variable(observer("surveyOutput")).define("surveyOutput", ["Generators", "viewof surveyOutput"], (G, _) => G.input(_));
  main.variable(observer("diff")).define("diff", ["require"], _diff);
  main.variable(observer("viewof selectedQuestionDiff")).define("viewof selectedQuestionDiff", ["Inputs","logicalQuestionDiff"], _selectedQuestionDiff);
  main.variable(observer("selectedQuestionDiff")).define("selectedQuestionDiff", ["Generators", "viewof selectedQuestionDiff"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","selectedQuestionDiff","questions","surveyOutput"], _26);
  main.variable(observer("normalizedQuestions")).define("normalizedQuestions", ["csvToQuestions","questionsToCSV","questions","reifyAttributes"], _normalizedQuestions);
  main.variable(observer("normalizedQuestionsOutput")).define("normalizedQuestionsOutput", ["csvToQuestions","questionsToCSV","surveyOutput","reifyAttributes"], _normalizedQuestionsOutput);
  main.variable(observer("logicalQuestionDiff")).define("logicalQuestionDiff", ["diff","normalizedQuestions","normalizedQuestionsOutput"], _logicalQuestionDiff);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer("autosave")).define("autosave", ["saveQuestions","viewof surveyOutput","saveLayout","saveConfig","files","viewof settings","invalidation","Generators"], _autosave);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("exportDataUri")).define("exportDataUri", ["surveyOutput"], _exportDataUri);
  main.variable(observer()).define(["htl","exportDataUri"], _34);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer("viewof settings")).define("viewof settings", ["Inputs","files"], _settings);
  main.variable(observer("settings")).define("settings", ["Generators", "viewof settings"], (G, _) => G.input(_));
  main.variable(observer("files")).define("files", ["putObject","config","survey","getObject"], _files);
  main.variable(observer("saveQuestions")).define("saveQuestions", ["files","viewof settings"], _saveQuestions);
  main.variable(observer("loadQuestions")).define("loadQuestions", ["files"], _loadQuestions);
  main.variable(observer("saveLayout")).define("saveLayout", ["files","viewof settings"], _saveLayout);
  main.variable(observer("loadLayout")).define("loadLayout", ["files"], _loadLayout);
  main.variable(observer("saveConfig")).define("saveConfig", ["files","viewof settings"], _saveConfig);
  main.variable(observer("loadConfig")).define("loadConfig", ["files"], _loadConfig);
  main.variable(observer("saveVersion")).define("saveVersion", ["viewof settings","files"], _saveVersion);
  main.variable(observer()).define(["viewof settings"], _45);
  main.variable(observer("revertChanges")).define("revertChanges", ["files","viewof settings"], _revertChanges);
  main.variable(observer()).define(["md"], _47);
  main.variable(observer("viewof questions")).define("viewof questions", ["Inputs"], _questions);
  main.variable(observer("questions")).define("questions", ["Generators", "viewof questions"], (G, _) => G.input(_));
  main.define("initial initialLoadQuestions", ["survey"], _initialLoadQuestions);
  main.variable(observer("mutable initialLoadQuestions")).define("mutable initialLoadQuestions", ["Mutable", "initial initialLoadQuestions"], (M, _) => new M(_));
  main.variable(observer("initialLoadQuestions")).define("initialLoadQuestions", ["mutable initialLoadQuestions"], _ => _.generator);
  main.variable(observer("initialQuestionLoader")).define("initialQuestionLoader", ["initialLoadQuestions","mutable initialLoadQuestions","viewof questions","loadQuestions","settings","Event"], _initialQuestionLoader);
  main.variable(observer()).define(["md"], _51);
  main.variable(observer("viewof questionUpload")).define("viewof questionUpload", ["fileInput"], _questionUpload);
  main.variable(observer("questionUpload")).define("questionUpload", ["Generators", "viewof questionUpload"], (G, _) => G.input(_));
  main.variable(observer("onQuestionUpload")).define("onQuestionUpload", ["viewof questions","csvToQuestions","questionUpload","Event"], _onQuestionUpload);
  main.variable(observer("csvToQuestions")).define("csvToQuestions", ["sanitizeValue"], _csvToQuestions);
  main.variable(observer("questionsToCSV")).define("questionsToCSV", _questionsToCSV);
  main.variable(observer()).define(["md"], _56);
  main.variable(observer("questionsCsvDataUri")).define("questionsCsvDataUri", ["d3","exportQuestionsCSV"], _questionsCsvDataUri);
  main.variable(observer("viewof questionsCsvDataUriView")).define("viewof questionsCsvDataUriView", ["Inputs"], _questionsCsvDataUriView);
  main.variable(observer("questionsCsvDataUriView")).define("questionsCsvDataUriView", ["Generators", "viewof questionsCsvDataUriView"], (G, _) => G.input(_));
  main.variable(observer("updateQuestionsCsvDataUriView")).define("updateQuestionsCsvDataUriView", ["viewof questionsCsvDataUriView","questionsCsvDataUri","Event"], _updateQuestionsCsvDataUriView);
  main.variable(observer("downloadQuestionsCsv")).define("downloadQuestionsCsv", ["htl","viewof questionsCsvDataUriView","exportQuestionsProblems","md"], _downloadQuestionsCsv);
  main.variable(observer("exportQuestionsCSV")).define("exportQuestionsCSV", ["questionsToCSV","questions"], _exportQuestionsCSV);
  main.variable(observer("exportQuestionsProblems")).define("exportQuestionsProblems", ["csvToQuestions","exportQuestionsCSV","questions","_"], _exportQuestionsProblems);
  main.variable(observer()).define(["md"], _63);
  main.variable(observer("viewof layoutData")).define("viewof layoutData", ["Inputs"], _layoutData);
  main.variable(observer("layoutData")).define("layoutData", ["Generators", "viewof layoutData"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _65);
  main.variable(observer("viewof layoutUpload")).define("viewof layoutUpload", ["fileInput"], _layoutUpload);
  main.variable(observer("layoutUpload")).define("layoutUpload", ["Generators", "viewof layoutUpload"], (G, _) => G.input(_));
  main.variable(observer("onLayoutUpload")).define("onLayoutUpload", ["viewof layoutData","csvToLayout","layoutUpload","Event"], _onLayoutUpload);
  main.variable(observer("csvToLayout")).define("csvToLayout", _csvToLayout);
  main.variable(observer()).define(["md"], _69);
  main.variable(observer("layoutCsvDataUri")).define("layoutCsvDataUri", ["d3","exportLayoutCSV"], _layoutCsvDataUri);
  main.variable(observer("viewof layoutCsvDataUriView")).define("viewof layoutCsvDataUriView", ["Inputs"], _layoutCsvDataUriView);
  main.variable(observer("layoutCsvDataUriView")).define("layoutCsvDataUriView", ["Generators", "viewof layoutCsvDataUriView"], (G, _) => G.input(_));
  main.variable(observer("updateLayoutCsvDataUriView")).define("updateLayoutCsvDataUriView", ["viewof layoutCsvDataUriView","layoutCsvDataUri","Event"], _updateLayoutCsvDataUriView);
  main.variable(observer("downloadLayoutCsv")).define("downloadLayoutCsv", ["htl","viewof layoutCsvDataUriView","exportLayoutProblems","md"], _downloadLayoutCsv);
  main.define("initial initialLoadLayout", _initialLoadLayout);
  main.variable(observer("mutable initialLoadLayout")).define("mutable initialLoadLayout", ["Mutable", "initial initialLoadLayout"], (M, _) => new M(_));
  main.variable(observer("initialLoadLayout")).define("initialLoadLayout", ["mutable initialLoadLayout"], _ => _.generator);
  main.variable(observer("initialLayoutLoader")).define("initialLayoutLoader", ["initialLoadLayout","mutable initialLoadLayout","setLayout","loadLayout","settings"], _initialLayoutLoader);
  main.variable(observer("setLayout")).define("setLayout", ["learnChoices","menuOptions","setOptions","viewof menuOptions","Event","viewof setOptions","layoutData","viewof layoutData"], _setLayout);
  main.variable(observer("learnChoices")).define("learnChoices", _learnChoices);
  main.variable(observer()).define(["md"], _78);
  main.variable(observer("sampleExportUi")).define("sampleExportUi", ["exportUi"], _sampleExportUi);
  main.variable(observer("exportUi")).define("exportUi", ["view","viewof questionsCsvDataUriView","viewof layoutCsvDataUriView"], _exportUi);
  main.variable(observer()).define(["md"], _81);
  main.variable(observer("viewof sampleImportUi")).define("viewof sampleImportUi", ["importUi"], _sampleImportUi);
  main.variable(observer("sampleImportUi")).define("sampleImportUi", ["Generators", "viewof sampleImportUi"], (G, _) => G.input(_));
  main.variable(observer()).define(["sampleImportUi"], _83);
  main.variable(observer("importUi")).define("importUi", ["viewof questions","csvToQuestions","viewof layoutData","csvToLayout","Event","Inputs","buttonLabel","view","fileInput"], _importUi);
  main.variable(observer()).define(["md"], _85);
  main.variable(observer("selection")).define("selection", ["dataEditor","Inputs","view","Event","cautious"], _selection);
  main.variable(observer("viewof menuOptions")).define("viewof menuOptions", ["selection"], _menuOptions);
  main.variable(observer("menuOptions")).define("menuOptions", ["Generators", "viewof menuOptions"], (G, _) => G.input(_));
  main.variable(observer("viewof setOptions")).define("viewof setOptions", ["selection"], _setOptions);
  main.variable(observer("setOptions")).define("setOptions", ["Generators", "viewof setOptions"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _89);
  main.variable(observer("viewof layout")).define("viewof layout", ["Inputs","layoutData"], _layout);
  main.variable(observer("layout")).define("layout", ["Generators", "viewof layout"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _91);
  main.variable(observer()).define(["md"], _92);
  main.variable(observer()).define(["questionsNoLayout","dataEditor","md"], _93);
  main.variable(observer()).define(["questionsNoLayout"], _94);
  main.variable(observer()).define(["md"], _95);
  main.variable(observer()).define(["layoutsNoQuestion","dataEditor","md"], _96);
  main.variable(observer()).define(["md"], _97);
  main.variable(observer()).define(["optionsWithoutValue","md"], _98);
  main.variable(observer("optionsWithoutValue")).define("optionsWithoutValue", ["surveyOutput","reifyAttributes"], _optionsWithoutValue);
  main.variable(observer("layoutById")).define("layoutById", ["d3","layout"], _layoutById);
  main.variable(observer("duplicateLayouts")).define("duplicateLayouts", ["layoutById"], _duplicateLayouts);
  main.variable(observer("questionsNoLayout")).define("questionsNoLayout", ["questions","layoutById"], _questionsNoLayout);
  main.variable(observer("layoutsNoQuestion")).define("layoutsNoQuestion", ["layoutById","surveyOutput"], _layoutsNoQuestion);
  main.variable(observer("exportLayoutCSV")).define("exportLayoutCSV", ["surveyOutput"], _exportLayoutCSV);
  main.variable(observer("exportLayoutProblems")).define("exportLayoutProblems", ["csvToLayout","exportLayoutCSV","surveyOutput","_","layout"], _exportLayoutProblems);
  main.variable(observer()).define(["md"], _106);
  main.variable(observer("viewof latestConfig")).define("viewof latestConfig", ["editor"], _latestConfig);
  main.variable(observer("latestConfig")).define("latestConfig", ["Generators", "viewof latestConfig"], (G, _) => G.input(_));
  main.variable(observer("save_config")).define("save_config", ["viewof surveyConfig","_","latestConfig","md","saveConfig"], _save_config);
  main.variable(observer("viewof surveyConfig")).define("viewof surveyConfig", ["Inputs"], _surveyConfig);
  main.variable(observer("surveyConfig")).define("surveyConfig", ["Generators", "viewof surveyConfig"], (G, _) => G.input(_));
  main.variable(observer("sync_ui")).define("sync_ui", ["viewof latestConfig","surveyConfig"], _sync_ui);
  main.variable(observer("load_config")).define("load_config", ["viewof surveyConfig","settings","loadConfig","Event"], _load_config);
  const child2 = runtime.module(define2);
  main.import("editor", child2);
  main.variable(observer()).define(["md"], _113);
  main.variable(observer("styles")).define("styles", ["html"], _styles);
  main.variable(observer()).define(["md"], _115);
  main.variable(observer()).define(["htl"], _116);
  main.variable(observer("surveyPreviewTitle")).define("surveyPreviewTitle", ["md"], _surveyPreviewTitle);
  main.variable(observer("viewof responses")).define("viewof responses", ["addMenuBehaviour","surveyView","surveyOutput"], _responses);
  main.variable(observer("responses")).define("responses", ["Generators", "viewof responses"], (G, _) => G.input(_));
  main.variable(observer()).define(["responses"], _119);
  const child3 = runtime.module(define3);
  main.import("surveyView", child3);
  main.import("addMenuBehaviour", child3);
  main.variable(observer()).define(["md"], _121);
  main.variable(observer()).define(["responses"], _122);
  main.variable(observer("revertTitle")).define("revertTitle", ["md"], _revertTitle);
  main.variable(observer("viewof reollbackButton")).define("viewof reollbackButton", ["Inputs","revertChanges"], _reollbackButton);
  main.variable(observer("reollbackButton")).define("reollbackButton", ["Generators", "viewof reollbackButton"], (G, _) => G.input(_));
  main.variable(observer("deployTitle")).define("deployTitle", ["md"], _deployTitle);
  main.variable(observer("lastDeployed")).define("lastDeployed", ["viewof settings","deployButton","md"], _lastDeployed);
  main.variable(observer("viewof deployButton")).define("viewof deployButton", ["Inputs","saveVersion"], _deployButton);
  main.variable(observer("deployButton")).define("deployButton", ["Generators", "viewof deployButton"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _128);
  main.variable(observer("me")).define("me", ["getUser"], _me);
  main.variable(observer("myTags")).define("myTags", ["listUserTags","me"], _myTags);
  main.variable(observer("REGION")).define("REGION", _REGION);
  const child4 = runtime.module(define4).derive(["REGION"], main);
  main.import("listObjects", child4);
  main.import("getObject", child4);
  main.import("putObject", child4);
  main.import("listUsers", child4);
  main.import("createUser", child4);
  main.import("deleteUser", child4);
  main.import("getUser", child4);
  main.import("listAccessKeys", child4);
  main.import("createAccessKey", child4);
  main.import("deleteAccessKey", child4);
  main.import("viewof manualCredentials", child4);
  main.import("manualCredentials", child4);
  main.import("viewof mfaCode", child4);
  main.import("mfaCode", child4);
  main.import("saveCreds", child4);
  main.import("listUserTags", child4);
  main.import("tagUser", child4);
  main.import("untagUser", child4);
  main.import("iam", child4);
  main.import("s3", child4);
  main.import("listGroups", child4);
  main.import("listGroupsForUser", child4);
  main.import("addUserToGroup", child4);
  main.import("removeUserFromGroup", child4);
  main.variable(observer()).define(["md"], _133);
  main.variable(observer("sanitizeValue")).define("sanitizeValue", _sanitizeValue);
  main.variable(observer()).define(["md"], _135);
  const child5 = runtime.module(define5);
  main.import("createQuestion", child5);
  main.import("reifyAttributes", child5);
  main.import("bindLogic", child5);
  main.import("setTypes", child5);
  main.import("config", child5);
  const child6 = runtime.module(define6);
  main.import("toc", child6);
  const child7 = runtime.module(define7);
  main.import("view", child7);
  main.import("cautious", child7);
  const child8 = runtime.module(define8);
  main.import("fileInput", child8);
  const child9 = runtime.module(define9);
  main.import("dataEditor", child9);
  const child10 = runtime.module(define10);
  main.import("pageHeader", child10);
  main.import("pageFooter", child10);
  main.import("buttonLabel", child10);
  main.variable(observer()).define(["md"], _142);
  const child11 = runtime.module(define11);
  main.import("substratum", child11);
  main.variable(observer()).define(["substratum","invalidation"], _144);
  return main;
}
