```js
md`# Survey Slate | Styling

_Exposing a method to take survey information and wrap it in HTML for display._
`
```

```js
md`
<div style="max-width: ${width/1.75}px; margin: 30px 0; padding: 15px 30px; background-color: #e0ffff; font: 700 18px/24px sans-serif;">👋 Welcome!  This notebook is about **Survey Slate**&mdash;an [assemblage of Observable web-based notebooks](https://observablehq.com/collection/@categorise/survey-slate) allowing organizations to host custom surveys for end users on their own AWS infrastructure.  Check out the [Technical Overview](https://observablehq.com/@categorise/surveyslate-docs) to get started! ✨</div>

<!-- Notification design borrowed from https://observablehq.com/@jashkenas/inputs -->
`
```

```js
md`test credentials for demoEditor
~~~js
{
  "accessKeyId": "AKIAQO7DBPIFDAUBK4SL",
  "secretAccessKey": "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"
}
~~~
`
```

```js
viewof manualCredentials
```

```js
saveCreds
```

```js
md`### Choose Survey Source for demo data`
```

```js
viewof survey
```

```js
import {viewof manualCredentials, viewof survey, saveCreds, questions, layout, viewof surveyConfig, initialQuestionLoader, initialLayoutLoader, load_config, createQuestion, bindLogic} from '@categorise/surveyslate-designer-tools'
```

```js
import {styles as componentStyles, pagination} from '@categorise/survey-components'
```

```js
loaders = initialQuestionLoader, initialLayoutLoader, load_config
```

## Brand

```js
viewof brand = Inputs.color({label: "Brand Color", value: mainColors[900]})
```

```js
viewof accent = Inputs.color({label: "Accent Color", value: accentColors[900]})
```

```js
viewof font = Inputs.textarea({label: "Font Stack", value: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"'})
```

```js echo
// This config needs to be part of account or survey config
brandConfig = ({
  colors: {
    brand: brand, // or, provide and color hex code
    accent: accent, // or, provide and color hex code
    // The color of text which are usually displayed on top of the brand or accent colors.
    "text-on-brand": "#ffffff",
  },
  fonts: {
    "brand-font": font
  }
})
```

```js
md`### Config`
```

```js echo
script = ({
  hashPrefix = ''
} = {}) => html`<script>
  ${updateMenu}
  window.addEventListener('hashchange', () => updateMenu);
  updateMenu();
</script>`
```

### Enable Javascript Snippet

```js
enableJavascriptContent = md`⚠️ Javascript is required to run this application. Please enable Javascript on your browser to continue.`
```

```js echo
enableJavasscriptSnippet = html`<noscript class="noscript">
   ${enableJavascriptContent.outerHTML}
</noscript>`
```

```js
md`## Survey View`
```

```js echo
surveyView = (questions, layout, config, answers, options) => {
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
```

```js
viewof exampleSurvey = surveyView(questions, layout.data, surveyConfig, new Map(), {
  hashPrefix: 'foo|'
})
```

```js echo
exampleSurvey
```

```js
md`#### Custom CSS`
```

```js echo
custom_css = () => html`
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
```

```js echo
navActiveClasses = ["bg-accent", "active"] // 'active' not used for styling. It's retained just in case it is used JS
```

```js
md`## Body Header`
```

```js echo
header(d3.group(layout.data, d => d['menu']), surveyConfig, {
  layout: 'relative',
  hashPrefix: "foo|"
})
```

```js echo
header = (sections, config, {
  hashPrefix = '',
  layout = "sticky-top"
} = {}) => html`<header class="[ ${layout} nav-custom shadow-1 ][ w-100 ]">
${pageHeader([config.pageTitle])}
<!--<span class="[ pl2 dib mr3 mt1 mb2 ][ f4 ][ white ]">${config.pageTitle}</span>-->
${pageMenu(sections, config, {
  hashPrefix
})}
</header>`
```

```js
md`## Menu`
```

```js
pageMenu(d3.group(layout.data, d => d['menu']), surveyConfig)
```

```js echo
pageMenu = (sections, config, {
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
```

```js echo
organizeSections = (sections) => d3.rollup([...sections.keys()].map(path => path.split("/")), (children) => children.map(child => child[1]).filter(_ => _), d => d[0])
```

```js echo
addMenuBehaviour = {
  window.addEventListener('hashchange', updateMenu);
  invalidation.then(() => window.removeEventListener('hashchange', updateMenu));
  updateMenu()

}
```

```js echo
updateMenu = (dom = document) => {
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
```

```js echo
isSurveyStandalone = () => document.body.dataset.standaloneSurvey === "true";
```

```js echo
scrollToTop = () => window.scrollTo(0,0);
```

```js echo
[...d3.group(layout.data, d => d['menu']).keys()]
```

## Images

```js echo
async function resolveObject(obj) {
  return Object.fromEntries(await Promise.all(
    Object.entries(obj).map(async ([k, v]) => [k, await v])
  ));
}
```

```js echo
images = resolveObject({
  "mainstream": FileAttachment("core_mainstream@1.jpg").url(),
  "operation": FileAttachment("core_operation@1.jpg").url(),
  "intro": FileAttachment("intro@3.jpg").url(),
  "default": FileAttachment("core_intro@1.jpg").url(),
})
```

```js echo
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
```

```js
md`## Content

Note you need a menu option selected for the example below to render
`
```

```js echo
viewof sectionViewExample = sectionsView(questions, layout.data, surveyConfig, d3.group(layout.data, d => d['menu']))
```

```js echo
sectionViewExample
```

```js echo
sectionsView = (questions, layout, config, sections, answers = new Map(), {
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
```

```js echo
viewof exampleSectionView = sectionView(surveyConfig, 
  new Map([...questions.entries()].map(([id, q]) => [id, createQuestion(q)])), 
  d3.group(layout.data, d => d['menu']),
  "extended_survey/internal_operations")
```

```js echo
exampleSectionView
```

```js echo
sectionView = (config, cells, sections, sectionKey, {
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
```

```js echo
paginationKeys = (sections, key) => {
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
```

```js echo
questions
```

```js
md`
---
`
```

```js echo
{
  // Initialising styles for demos to work on this notebook
  initializeStyles()
}
```

```js echo
initializeStyles = () => tachyonsExt(brandConfig)
```

## Styles for the demos in this notebook

These styles are to negate Observable styles overriding the component styles.

```js echo
stylesForNotebooks = html`<style>
a[href].nav {
  color: var(--text-on-brand);
}

a[href].nav:hover {
  text-decoration: none;
}

.black-90 {
  color: rgba(0,0,0,.9) !important;
}`
```

```js
function getDownloadUrlForHtml(html) {
  const blob = new Blob([html], { type: 'text/html' });
  return URL.createObjectURL(blob);
}
```

```js
import {button, text} from "@jashkenas/inputs"
```

```js
import {view} from '@tomlarkworthy/view'
```

```js
import {mainColors, accentColors} from "@categorise/brand"
```

```js
import {tachyonsExt} from '@categorise/tachyons-and-some-extras'
```

```js
import {pageHeader, pageFooter} from "@categorise/common-components"
```

---

```js
import { substratum } from "@categorise/substratum"
```

```js
substratum({ invalidation })
```
