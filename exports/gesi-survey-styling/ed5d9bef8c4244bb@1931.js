import define1 from "./cc92995ddd7b2fc5@2815.js";
import define2 from "./bb564962578ec29b@2752.js";
import define3 from "./e93997d5089d7165@2303.js";
import define4 from "./f92778131fd76559@1208.js";
import define5 from "./3b76f3b1d596b5d5@99.js";
import define6 from "./09005aca321f8a40@662.js";
import define7 from "./c4047069e47f8784@249.js";
import define8 from "./bad810ff1e80611b@137.js";

function _1(md){return(
md`# Survey Slate | Styling

_Exposing a method to take survey information and wrap it in HTML for display._
`
)}

function _2(md,width){return(
md`
<div style="max-width: ${width/1.75}px; margin: 30px 0; padding: 15px 30px; background-color: #e0ffff; font: 700 18px/24px sans-serif;">👋 Welcome!  This notebook is about **Survey Slate**&mdash;an [assemblage of Observable web-based notebooks](https://observablehq.com/collection/@categorise/survey-slate) allowing organizations to host custom surveys for end users on their own AWS infrastructure.  Check out the [Technical Overview](https://observablehq.com/@categorise/surveyslate-docs) to get started! ✨</div>

<!-- Notification design borrowed from https://observablehq.com/@jashkenas/inputs -->
`
)}

function _3(md){return(
md`test credentials for demoEditor
~~~js
{
  "accessKeyId": "AKIAQO7DBPIFDAUBK4SL",
  "secretAccessKey": "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"
}
~~~
`
)}

function _4($0){return(
$0
)}

function _5(saveCreds){return(
saveCreds
)}

function _6(md){return(
md`### Choose Survey Source for demo data`
)}

function _7($0){return(
$0
)}

function _loaders(initialQuestionLoader,initialLayoutLoader,load_config){return(
initialQuestionLoader, initialLayoutLoader, load_config
)}

function _11(md){return(
md`## Brand`
)}

function _brand(Inputs,mainColors){return(
Inputs.color({label: "Brand Color", value: mainColors[900]})
)}

function _accent(Inputs,accentColors){return(
Inputs.color({label: "Accent Color", value: accentColors[900]})
)}

function _font(Inputs){return(
Inputs.textarea({label: "Font Stack", value: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"'})
)}

function _brandConfig(brand,accent,font){return(
{
  colors: {
    brand: brand, // or, provide and color hex code
    accent: accent, // or, provide and color hex code
    // The color of text which are usually displayed on top of the brand or accent colors.
    "text-on-brand": "#ffffff",
  },
  fonts: {
    "brand-font": font
  }
}
)}

function _16(loadStyles,brandConfig,md)
{
  loadStyles(brandConfig)
  return md`*Install CSS styles for use within Observable even if \`surveyView\` is not executed*`
}


function _17(md){return(
md`### Config`
)}

function _script(html,updateMenu){return(
({
  hashPrefix = ''
} = {}) => html`<script>
  ${updateMenu}
  window.addEventListener('hashchange', () => updateMenu);
  updateMenu();
</script>`
)}

function _19(md){return(
md`### Enable Javascript Snippet`
)}

function _enableJavascriptContent(md){return(
md`⚠️ Javascript is required to run this application. Please enable Javascript on your browser to continue.`
)}

function _enableJavasscriptSnippet(html,enableJavascriptContent){return(
html`<noscript class="noscript">
   ${enableJavascriptContent.outerHTML}
</noscript>`
)}

function _22(md){return(
md`## Survey View`
)}

function _surveyView(addMenuBehaviour,loadStyles,brandConfig,d3,view,custom_css,header,sectionsView,pageFooter){return(
(questions, layout, config, answers, options) => {
  addMenuBehaviour
  loadStyles(brandConfig)
  const sections = d3.group(layout, d => d['menu'])
  const survey = view`
    ${custom_css()}
    ${header(sections, config, options)}
    <main id="main-content" class="bg-near-white">
      <article data-name="article-full-bleed-background">
      ${['...', sectionsView(questions, layout, config, sections, answers, options)]}
      </article>
    </main>
    ${pageFooter()}
  `
  return survey;
}
)}

function _exampleSurvey(surveyView,questions,layout,surveyConfig){return(
surveyView(questions, layout.data, surveyConfig, new Map(), {
  hashPrefix: 'foo|'
})
)}

function _25(exampleSurvey){return(
exampleSurvey
)}

function _26(md){return(
md`#### Custom CSS`
)}

function _custom_css(html,brandConfig,componentStyles){return(
() => html`
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400&display=swap');
  body {
    font-family: ${brandConfig.fonts['brand-font']}
  }
  :root {
    --lh-copy: 1.3;
  }
  .nav {}

  .hide { display: none;}

  .sticky-top {
    position: sticky;
    top: 0;
  }
  .sticky-bottom {
    bottom: 0;
  }
  .lh-copy {
      line-height: var(--lh-copy);
  }

  a:not(class) {
    text-decoration: none;
    color: var(--brand);
  }

  a:not(class):hover,
  a:not(class):focus,
  a:not(class):active {
    text-decoration: underline;
  }

  ${componentStyles.innerHTML}
</style>
`
)}

function _navActiveClasses(){return(
["bg-accent", "active"]
)}

function _29(md){return(
md`## Body Header`
)}

function _30(header,d3,layout,surveyConfig){return(
header(d3.group(layout.data, d => d['menu']), surveyConfig, {
  layout: 'relative',
  hashPrefix: "foo|"
})
)}

function _header(html,pageHeader,pageMenu){return(
(sections, config, {
  hashPrefix = '',
  layout = "sticky-top"
} = {}) => html`<header class="[ ${layout} nav-custom shadow-1 ][ w-100 ]">
${pageHeader([config.pageTitle])}
<!--<span class="[ pl2 dib mr3 mt1 mb2 ][ f4 ][ white ]">${config.pageTitle}</span>-->
${pageMenu(sections, config, {
  hashPrefix
})}
</header>`
)}

function _32(md){return(
md`## Menu`
)}

function _33(pageMenu,d3,layout,surveyConfig){return(
pageMenu(d3.group(layout.data, d => d['menu']), surveyConfig)
)}

function _pageMenu(organizeSections,html,htl,navActiveClasses,updateMenu){return(
(sections, config, {
  hashPrefix = ''
} = {}) => {
  // organize
  const tree = organizeSections(sections); 
  const menuDOM = html`
  <nav class="f6 fw6 tracked-light">
    <div class="[ flex pl5-ns overflow-x-auto no-scrollbar ][ bg-brand ]">
    ${[...tree.keys()].map(code => {
        if (code === 'hidden') return '';
        // if the menu has children  
        const link = `#${hashPrefix}${tree.get(code).length > 0 ? `${code}/${tree.get(code)[0]}` : `${code}`}`
        const label = config.menuSegmentLabels?.[code] || code;
        return htl.html.fragment`<a
          class="[ nav nav-1 dib ph3 pv2 nowrap ][ no-underline text-on-brand hover-text-on-brand hover-bg-accent ] ${window.location.hash.startsWith(link) ? navActiveClasses.join(' ') : ''}"
          href="${link}">${label}</a>`
      }
    )}
    </div>
    <div class="[ flex pl5-ns overflow-x-auto no-scrollbar ][ bg-text-on-brand ]">
      ${[...tree.keys()].map(parent => {
        return htl.html.fragment`${
          tree.get(parent).map(code => {
            const link = `#${hashPrefix}${`${parent}/${code}`}`;
            const label = config.menuSegmentLabels?.[code] || code;
            const topLayerNav = link.split("/")[0];
            return html`<a
              class="[ nav nav-2 dib nowrap pa2 ph3 ][ no-underline tc black-90 hover-text-on-brand hover-bg-accent ]"
              href="${link}">${label}</a>`;
          })}`;
        })  
      }
    </div>
  </nav>
`
  updateMenu(menuDOM);
  return menuDOM;
}
)}

function _organizeSections(d3){return(
(sections) => d3.rollup([...sections.keys()].map(path => path.split("/")), (children) => children.map(child => child[1]).filter(_ => _), d => d[0])
)}

function _addMenuBehaviour(updateMenu,invalidation)
{
  window.addEventListener('hashchange', updateMenu);
  invalidation.then(() => window.removeEventListener('hashchange', updateMenu));
  updateMenu()

}


function _updateMenu(navActiveClasses,isSurveyStandalone,scrollToTop){return(
(dom = document) => {
  if (!dom.querySelectorAll) dom = document;
  
  // The top layer of the menu is always visible, but only one tab is highlighted
  [...dom.querySelectorAll(".nav-1")].forEach(nav => {
    const navHash = "#" + nav.href.split("#")[1].split("/")[0]
    if (window.location.hash.startsWith(navHash)) {
      nav.classList.add(...navActiveClasses);
    } else {
      nav.classList.remove(...navActiveClasses)
    }
  });
  // The 2nd layer of menu only has the options relevant to the top layer
  // And then the specific section within that layer is highlighted
  [...dom.querySelectorAll(".nav-2")].forEach(nav => {
    const navHash = nav.href.split("#")?.[1]
    const topLayerNav = navHash.split("/")?.[0];
    if (window.location.hash.length < 1) return;
    const topLayerWindow = window.location.hash.split('#')[1].split("/")[0];
    console.log(topLayerNav, topLayerWindow)

    const nav2ActiveClasses = [...navActiveClasses, "text-on-brand"];
    if (topLayerNav !== topLayerWindow) {
      nav.classList.add("hide")
    } else {
      nav.classList.remove("hide")
      if ("#" + navHash === window.location.hash) {
        nav.classList.add(...nav2ActiveClasses)
      } else {
        nav.classList.remove(...nav2ActiveClasses)
      }
    }
  });
  // Due to Observablehq framing, the CSS :target selector for show/hide sections based on hash does not
  // work properly. So we manually toggle it.
  [...dom.querySelectorAll("[data-survey-section]")].forEach(section => {
    if (`#${section.id}` === window.location.hash) {
      section.style.display = "block";
    } else {
      section.style.display = "none";
    }
  });

  if (isSurveyStandalone()) {
    scrollToTop();
  }
}
)}

function _isSurveyStandalone(){return(
() => document.body.dataset.standaloneSurvey === "true"
)}

function _scrollToTop(){return(
() => window.scrollTo(0,0)
)}

function _40(d3,layout){return(
[...d3.group(layout.data, d => d['menu']).keys()]
)}

function _41(md){return(
md`## Images`
)}

function _resolveObject(){return(
async function resolveObject(obj) {
  return Object.fromEntries(await Promise.all(
    Object.entries(obj).map(async ([k, v]) => [k, await v])
  ));
}
)}

function _images(resolveObject,FileAttachment){return(
resolveObject({
  "mainstream": FileAttachment("core_mainstream@1.jpg").url(),
  "operation": FileAttachment("core_operation@1.jpg").url(),
  "intro": FileAttachment("intro@3.jpg").url(),
  "default": FileAttachment("core_intro@1.jpg").url(),
})
)}

function _imageFor(images){return(
function imageFor(section) {
  if (section.includes("mainstream")) {
    return images.mainstream;
  } else if (section.includes("operation")) {
    return images.operation;
  } else if (section.includes("intro")) {
    return images.intro;
  } else {
    return images['default']
  }
}
)}

function _45(md){return(
md`## Content

Note you need a menu option selected for the example below to render
`
)}

function _sectionViewExample(sectionsView,questions,layout,surveyConfig,d3){return(
sectionsView(questions, layout.data, surveyConfig, d3.group(layout.data, d => d['menu']))
)}

function _47(sectionViewExample){return(
sectionViewExample
)}

function _sectionsView(createQuestion,bindLogic,sectionView,view){return(
(questions, layout, config, sections, answers = new Map(), {
    hashPrefix = '',
    putFile,
    getFile
  } = {}) => {
  const cells = new Map([...questions.entries()].map(([id, q], index) => [id, createQuestion({
    ...q,
    value: answers.get(id)
  }, index, {
    putFile, getFile
  })]));
  
  bindLogic(cells, layout)
  
  // We inject the views as just pure presentation
  const sectionViews = [...sections.keys()].map(sectionKey => sectionView(config, cells, sections, sectionKey, {
    hashPrefix
  }))
  // But we also want the questions inside the sections bound as a single flat list of questions.
  // It should be flat as we don't want layout information leaking into data access model, e.g. we don't want
  // moving a question to a different section to invalide persisted answers.
  let questionViews = sectionViews.reduce(
    (questions, section) => {
      // Copy over section propties (which are views of questions) into growing mega object of views)
      return Object.assign(questions, section)
    }, {}
  )
  // Some questions are undefined if they cannot be looked up, we need to filter those out
  questionViews = Object.fromEntries(Object.entries(questionViews).filter(([k , v]) => v));
  
  const container = view`<div class="black-80">
        ${sectionViews}
      ${/* put our questions as hidden view*/ ['_...', questionViews]}
    </div>`
  return container;
}
)}

function _exampleSectionView(d3,layout,sectionView,surveyConfig,questions,createQuestion)
{
  const sections = d3.group(layout.data, d => d['menu']);
  return sectionView(surveyConfig, 
  new Map([...questions.entries()].map(([id, q]) => [id, createQuestion(q)])), 
  sections,
  layout.data[0].menu)
}


function _50(exampleSectionView){return(
exampleSectionView
)}

function _sectionView(md,paginationKeys,pagination,view,imageFor,location){return(
(config, cells, sections, sectionKey, {
    hashPrefix = ''
  } = {}) => {
  const suffix = sectionKey.split("/").pop();
  const subtitle = config.menuSegmentLabels?.[suffix] || suffix;
  
  const orderedQuestions = sections.get(sectionKey).map(layoutRow => {
    let cell = cells.get(layoutRow.id)
    if (cell === undefined) {
      cell = md`<mark>Error question not-found for ${layoutRow.id}</mark>`
    }
    cell.id = layoutRow.id
    return cell;
  });
  
  const pageKeys = paginationKeys(sections, sectionKey);
  const paginationEl = pagination({...pageKeys, hashPrefix});
                        
  // background-position-x is set to 4rem, which is approximate height of the header
  return view`<section id="${hashPrefix}${sectionKey}" 
                       data-survey-section="${hashPrefix}${sectionKey}"
                       class="pa2 pa4-ns pl5-l"
                       style="background: #f4f4f4 url(${imageFor(sectionKey)});
                              background-size: cover;
                              background-attachment: fixed;
                              background-position: center 4rem;
                              background-repeat: no-repeat;
                              display: ${location.hash === `#${hashPrefix}${sectionKey}`? 'block' : 'none'};
                             ">
  <div class="bg-white shadow-2 f4 measure-wide mr-auto">
    <div class="ph4 pt3 pb0 f5 lh-copy">
      <!-- <h1 class="mt0 mb4">${subtitle}</h1> -->
      <div class="db">
        ${['...', orderedQuestions.reduce((acc, q) => Object.defineProperty(acc, q.id, {value: q, enumerable: true}), {})]}
      </div>
    </div>
    
    <div class="sticky bottom-0">
      <div class="ph4 pv3 bt b--black-10 bg-near-white">
      ${paginationEl}
      </div>
    </div>
  </div>
</section>`
}
)}

function _paginationKeys(organizeSections){return(
(sections, key) => {
  const tree = organizeSections(sections);
  const keys = [...tree.keys()].reduce((acc, parent) => {
    const subsections = tree.get(parent);
    if (subsections.length > 0) {
      return [
        ...acc,
        ...(subsections.map(sb => `${parent}/${sb}`))
      ]
    }
    return [...acc, parent];
  }, []);

  let previous;
  let next;

  const currentIndex = keys.findIndex(k => k === key);
  if (currentIndex > 0) {
    previous = keys[currentIndex - 1];
  }

  if (currentIndex < (keys.length - 1)) {
    next = keys[currentIndex + 1];
  }

  return {
    previous, next,
  }
}
)}

function _53(questions){return(
questions
)}

function _54(md){return(
md`
---
`
)}

function _55(md){return(
md`## Styles for the demos in this notebook

These styles are to negate Observable styles overriding the component styles.`
)}

function _stylesForNotebooks(html){return(
html`<style>
a[href].nav {
  color: var(--text-on-brand);
}

a[href].nav:hover {
  text-decoration: none;
}

.black-90 {
  color: rgba(0,0,0,.9) !important;
}`
)}

function _getDownloadUrlForHtml(){return(
function getDownloadUrlForHtml(html) {
  const blob = new Blob([html], { type: 'text/html' });
  return URL.createObjectURL(blob);
}
)}

function _63(md){return(
md`---`
)}

function _65(substratum,invalidation){return(
substratum({ invalidation })
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["core_intro@1.jpg", {url: new URL("./files/33cebc3bcc6c8598494ca08a90b80e7a2526ad85db05c3a269bf70fe037780dce7b5be9b4bc01074fd658daf96acc41879befe5f54936d31b34cd1e84b8b0915.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["core_mainstream@1.jpg", {url: new URL("./files/390c5d7c0d71733d1e63aa9c38d3ee3c68369f8ce17e265675ec13fd9b202001b3c38436a05c670719db7f7d592d18d1c8c43ab474256ba4196b918c9357e9d4.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["core_operation@1.jpg", {url: new URL("./files/ee654aa3599162a8e97b92e233bf315e692d20e36de269fc814ec1e973b8f9f630a588b6a41955ec7b97635ec992ccdc87b607c235535a8b0ec8647cba36d482.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["intro@3.jpg", {url: new URL("./files/4a26433a3f2093cc51c4fbb4e58654accad20264701f61a42e69aa0ff5641cfded0676e595f3817a9160aea0be3775003ade6acb8a52e802172292df1bfb5def.jpeg", import.meta.url), mimeType: "image/jpeg", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","width"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["viewof manualCredentials"], _4);
  main.variable(observer()).define(["saveCreds"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["viewof survey"], _7);
  const child1 = runtime.module(define1);
  main.import("viewof manualCredentials", child1);
  main.import("manualCredentials", child1);
  main.import("viewof survey", child1);
  main.import("survey", child1);
  main.import("saveCreds", child1);
  main.import("questions", child1);
  main.import("layout", child1);
  main.import("viewof surveyConfig", child1);
  main.import("surveyConfig", child1);
  main.import("initialQuestionLoader", child1);
  main.import("initialLayoutLoader", child1);
  main.import("load_config", child1);
  main.import("createQuestion", child1);
  main.import("bindLogic", child1);
  const child2 = runtime.module(define2);
  main.import("styles", "componentStyles", child2);
  main.import("pagination", child2);
  main.variable(observer("loaders")).define("loaders", ["initialQuestionLoader","initialLayoutLoader","load_config"], _loaders);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("viewof brand")).define("viewof brand", ["Inputs","mainColors"], _brand);
  main.variable(observer("brand")).define("brand", ["Generators", "viewof brand"], (G, _) => G.input(_));
  main.variable(observer("viewof accent")).define("viewof accent", ["Inputs","accentColors"], _accent);
  main.variable(observer("accent")).define("accent", ["Generators", "viewof accent"], (G, _) => G.input(_));
  main.variable(observer("viewof font")).define("viewof font", ["Inputs"], _font);
  main.variable(observer("font")).define("font", ["Generators", "viewof font"], (G, _) => G.input(_));
  main.variable(observer("brandConfig")).define("brandConfig", ["brand","accent","font"], _brandConfig);
  main.variable(observer()).define(["loadStyles","brandConfig","md"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("script")).define("script", ["html","updateMenu"], _script);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer("enableJavascriptContent")).define("enableJavascriptContent", ["md"], _enableJavascriptContent);
  main.variable(observer("enableJavasscriptSnippet")).define("enableJavasscriptSnippet", ["html","enableJavascriptContent"], _enableJavasscriptSnippet);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("surveyView")).define("surveyView", ["addMenuBehaviour","loadStyles","brandConfig","d3","view","custom_css","header","sectionsView","pageFooter"], _surveyView);
  main.variable(observer("viewof exampleSurvey")).define("viewof exampleSurvey", ["surveyView","questions","layout","surveyConfig"], _exampleSurvey);
  main.variable(observer("exampleSurvey")).define("exampleSurvey", ["Generators", "viewof exampleSurvey"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleSurvey"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("custom_css")).define("custom_css", ["html","brandConfig","componentStyles"], _custom_css);
  main.variable(observer("navActiveClasses")).define("navActiveClasses", _navActiveClasses);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer()).define(["header","d3","layout","surveyConfig"], _30);
  main.variable(observer("header")).define("header", ["html","pageHeader","pageMenu"], _header);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer()).define(["pageMenu","d3","layout","surveyConfig"], _33);
  main.variable(observer("pageMenu")).define("pageMenu", ["organizeSections","html","htl","navActiveClasses","updateMenu"], _pageMenu);
  main.variable(observer("organizeSections")).define("organizeSections", ["d3"], _organizeSections);
  main.variable(observer("addMenuBehaviour")).define("addMenuBehaviour", ["updateMenu","invalidation"], _addMenuBehaviour);
  main.variable(observer("updateMenu")).define("updateMenu", ["navActiveClasses","isSurveyStandalone","scrollToTop"], _updateMenu);
  main.variable(observer("isSurveyStandalone")).define("isSurveyStandalone", _isSurveyStandalone);
  main.variable(observer("scrollToTop")).define("scrollToTop", _scrollToTop);
  main.variable(observer()).define(["d3","layout"], _40);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer("resolveObject")).define("resolveObject", _resolveObject);
  main.variable(observer("images")).define("images", ["resolveObject","FileAttachment"], _images);
  main.variable(observer("imageFor")).define("imageFor", ["images"], _imageFor);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer("viewof sectionViewExample")).define("viewof sectionViewExample", ["sectionsView","questions","layout","surveyConfig","d3"], _sectionViewExample);
  main.variable(observer("sectionViewExample")).define("sectionViewExample", ["Generators", "viewof sectionViewExample"], (G, _) => G.input(_));
  main.variable(observer()).define(["sectionViewExample"], _47);
  main.variable(observer("sectionsView")).define("sectionsView", ["createQuestion","bindLogic","sectionView","view"], _sectionsView);
  main.variable(observer("viewof exampleSectionView")).define("viewof exampleSectionView", ["d3","layout","sectionView","surveyConfig","questions","createQuestion"], _exampleSectionView);
  main.variable(observer("exampleSectionView")).define("exampleSectionView", ["Generators", "viewof exampleSectionView"], (G, _) => G.input(_));
  main.variable(observer()).define(["exampleSectionView"], _50);
  main.variable(observer("sectionView")).define("sectionView", ["md","paginationKeys","pagination","view","imageFor","location"], _sectionView);
  main.variable(observer("paginationKeys")).define("paginationKeys", ["organizeSections"], _paginationKeys);
  main.variable(observer()).define(["questions"], _53);
  main.variable(observer()).define(["md"], _54);
  main.variable(observer()).define(["md"], _55);
  main.variable(observer("stylesForNotebooks")).define("stylesForNotebooks", ["html"], _stylesForNotebooks);
  main.variable(observer("getDownloadUrlForHtml")).define("getDownloadUrlForHtml", _getDownloadUrlForHtml);
  const child3 = runtime.module(define3);
  main.import("button", child3);
  main.import("text", child3);
  const child4 = runtime.module(define4);
  main.import("view", child4);
  const child5 = runtime.module(define5);
  main.import("mainColors", child5);
  main.import("accentColors", child5);
  const child6 = runtime.module(define6);
  main.import("loadStyles", child6);
  const child7 = runtime.module(define7);
  main.import("pageHeader", child7);
  main.import("pageFooter", child7);
  main.variable(observer()).define(["md"], _63);
  const child8 = runtime.module(define8);
  main.import("substratum", child8);
  main.variable(observer()).define(["substratum","invalidation"], _65);
  return main;
}
