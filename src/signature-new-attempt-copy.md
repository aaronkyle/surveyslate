# Signature - A Documentation Toolkit


```js
import {html} from "npm:htl";
import markdownit from "npm:markdown-it";
```

```js echo
// Markdown helper (Framework-safe, preserves \${...} via strings.raw)
const Markdown = new markdownit({html: true});

function md(strings, ...values) {
  const hasRaw = !!(strings && typeof strings.raw !== "undefined");
  const raws = hasRaw ? strings.raw : [String(strings ?? "")];
  let s = raws && raws[0] ? raws[0] : "";
  for (let i = 0; i < values.length; ++i) {
    const tail = raws && raws[i + 1] ? raws[i + 1] : "";
    s += String(values[i]) + tail;
  }
  const t = document.createElement("template");
  t.innerHTML = Markdown.render(s);
  return t.content.cloneNode(true);
}
```

```js echo
// Code block helper
function code(text, { language = "javascript", type, trim = true, className = "code" } = {}) {
  const lang = type ?? language;
  const body = !trim ? String(text) : String(text).replace(/^\s*\n|\s+?$/g, "");
  const fragment = md`\`\`\`${lang}\n${body}\n\`\`\``;
  const out = document.createElement("div");
  out.appendChild(fragment);
  if (className) out.classList.add(className);
  return out;
}
```

```js echo
// Utilities
function uid(prefix = "css-scope") {
  const id = `${prefix}-${Math.random().toString(36).slice(2)}`;
  return { id };
}

const signature_theme = `
:scope { --line-color: #eee; border: 1px solid var(--line-color); padding: .5em 1em; margin-bottom: 1em; }
:scope > div { border-top: 1px solid var(--line-color); }
:scope > summary { padding-left: 1.2em; padding-top: 1em; position: relative; }
:scope > summary::-webkit-details-marker { display: none; }
:scope > summary:before { position: absolute; left: 0; content: "►"; }
:scope[open] > summary:before { content: "▼"; }
:scope .signature { display: flex; align-items: start; }
:scope .signature pre { margin-top: 0; }
:scope .examples .code { background: #f5f5f5; padding: .5rem; }
:scope .link:before { content: ""; display: block; width: 1rem; height: 1.3rem;
  background: url(https://raw.githubusercontent.com/encharm/Font-Awesome-SVG-PNG/master/black/png/32/link.png) center 100%/contain no-repeat;
  margin-left: .5rem; opacity: .3; }
:scope .signature:hover .link:hover:before { opacity: 1 }
:scope .tests .cta { font-style: italic; }
:scope .tests th, :scope .tests td { padding: .25em .5em }
:scope .tests tr[data-status="pending"] { background: hsl(40,90%,90%); opacity: .5 }
:scope .tests tr[data-status="error"]   { background: hsl( 0,90%,90%) }
:scope .tests tr[data-status="success"] { background: hsl(90,90%,90%) }
`;

function scopedStyle(scope, css) {
  const style = html`<style>`;
  style.textContent = String(css).replace(/\:scope\b/g, scope);
  return style;
}
```

```js echo
// HTL-safe formatter
function defaultFormatter({signature, description, examples, testList}, {name, open, scope, css}) {
  const globalStyle = !css ? "" : (scope == null ? html`<style>${css}</style>` : scopedStyle("." + scope, css));

  const header = (open == null)
    ? html`<div class="signature">
        ${signature}
        ${!name || !name.length ? "" : html`<a class="link" href="#${name}"></a>`}
      </div>`
    : html`<summary class="signature">
        ${signature}
        ${!name || !name.length ? "" : html`<a class="link" href="#${name}"></a>`}
      </summary>`;

  const body = html.fragment(
    globalStyle,
    header,
    description == null ? "" : html`<div class="description">${description}</div>`,
    !examples.length ? "" : html`<div class="examples">${[
      examples.length < 2 ? md`Example:` : md`Examples:`,
      ...examples
    ]}</div>`,
    testList || ""
  );

  return (open == null)
    ? html`<div class=${scope ?? undefined}>${body}</div>`
    : html`<details class=${scope ?? undefined} open=${open ? true : undefined}>${body}</details>`;
}
```

```js echo
// Test runner
function defaultTestRunner(tests, options = {}) {
  const {
    assert = (cond, msg = "error") => { if (!cond) throw msg; },
    formatList = items => html`<table>
      <thead><tr><th>Name</th><th>Result</th></tr></thead>
      <tbody>${items}</tbody>
    </table>`,
    formatItem = (name, status, msg) => {
      const state = status == null ? "pending" : status ? "success" : "error";
      const icon = { pending: "⌛", success: "✅", error: "❗" }[state];
      return html`<tr data-status=${state}>
        <td>${document.createTextNode(name)}</td>
        <td><span title=${state}>${icon}</span> ${msg || ""}</td>
      </tr>`;
    },
    run = (fn, name) => fn.call(null, assert),
  } = options;

  const entries = Object.entries(tests || {});
  const runners = entries.map(([k, v]) => ({
    name: String(k),
    node: formatItem(String(k)),
    run: async () => { try { await run(v, String(k)); } catch (e) { return e; } }
  }));

  return {
    list: formatList(runners.map(r => r.node)),
    run: () => Promise.all(
      runners.map(({name, node, run}) => run().then(msg => node.replaceWith(formatItem(name, msg === undefined, msg))))
    )
  };
}
```

```js echo
// Signature parser (no numeric indexing at all)
function defaultSignatureParser(fn, name = null) {
  let src = "";
  try { src = Function.prototype.toString.call(fn).trim(); }
  catch { return `function${name ? ` ${name}` : ""}()`; }

  const isAsync = /^\s*async\b/.test(src);

  const reClassic = /^\s*(?<async>async\s*)?function(?<star>\s*\*)?\s*(?<fname>[^(]*)\s*(?<params>\([^)]*\))/;
  const mFunc = src.match(reClassic);
  if (mFunc && mFunc.groups) {
    const g = mFunc.groups;
    const asyncStr = g.async ? "async " : (isAsync ? "async " : "");
    const star = g.star ? "*" : "";
    const parsedName = (g.fname || "").trim();
    const finalName = (name ?? parsedName).trim();
    const params = g.params || "()";
    return `${asyncStr}function${star}${finalName ? ` ${finalName}` : ""}${params}`;
  }

  // Arrow function fallback
  const arrow = src.replace(/^\s*async\s*/, "");
  let params = "()";
  if (arrow.startsWith("(")) {
    let depth = 0, i = 0;
    while (i < arrow.length) {
      const c = arrow.charAt(i);
      if (c === "(") depth++;
      else if (c === ")") { depth--; if (depth === 0) { i++; break; } }
      i++;
    }
    params = arrow.slice(0, i) || "()";
  } else {
    const mId = arrow.match(/^(?<id>[A-Za-z_$][\w$]*)/);
    const id = (mId && mId.groups && mId.groups.id) ? mId.groups.id : "";
    params = id ? `(${id})` : "()";
  }

  const asyncStr = isAsync ? "async " : "";
  const finalName = (name ?? "").trim();
  return `${asyncStr}function${finalName ? ` ${finalName}` : ""}${params}`;
}
```

```js echo
// Main API
function signature(fn, options = {}) {
  const {
    name = typeof fn === "function" && fn.name ? fn.name : null,
    description = null,
    example = null,
    open = true,
    tests = {},
    runTests = false,
    testRunner = defaultTestRunner,
    scope = uid("css-scope").id,
    css = signature_theme,
    formatter = defaultFormatter,
    signatureParser = defaultSignatureParser,
  } = options;

  const sig = (typeof fn !== "function") ? fn : signatureParser(fn, name);
  let testList = null;

  if (runTests && tests && Object.keys(tests).length) {
    const {list, run} = testRunner(tests);
    const button = html`<button>Run tests</button>`;
    const cta = html`<p class="cta">${button} to view results</p>`;
    testList = html`<div class="tests">${[md`Test results:`, cta]}</div>`;
    Promise.race([Promise.resolve(runTests), new Promise(r => { button.onclick = r; })])
      .then(() => (cta.replaceWith(list), run()));
  }

  return formatter({
    signature: (typeof sig === "string") ? code(sig) : sig,
    description: (typeof description === "string") ? md`${description}` : description,
    examples: (example == null ? [] : Array.isArray(example) ? example : [example])
      .map(v => (typeof v === "string") ? code(v) : v),
    testList,
  }, {name, open, css, scope});
}
```

```js echo
// parseFrontmatter and getPinnedSlug hardened
const regIdentifier = new RegExp('^'
  + '(?:(?:https:\\/\\/(next\\.)?observablehq\\.com)?\\/)?'
  + '(?:'
  + '(?:d\\/)?(?<id>[a-f0-9]{16})'
  + '|'
  + '@(?<user>[0-9a-z-_]{2,})\\/(?<slug>[0-9a-z-_]{1,}(?:\\/\\d+)?)'
  + ')'
  + '(?:@(?<version>\\d+))?'
  + '([?#]|$)');

const parseFrontmatter = (v1Source) => {
  if (!v1Source) return null;
  const m = v1Source.match(/^(?:[^\n]+\n){4}/);
  if (!m) return null;
  const head = m[0] ?? "";
  const lines = head ? head.slice(0, -1).split(/\n/) : [];
  return Object.fromEntries(
    lines.map((s) => {
      const mm = s.match(/\/\/ ([^:]+):\s+(.+)$/);
      if (!mm) return null;
      const key = (mm[1] ?? "").toLowerCase();
      const value = mm[2] ?? "";
      return key ? [key, value] : null;
    }).filter(Boolean)
  );
};

async function getPinnedSlug(identifier) {
  const match = String(identifier).match(regIdentifier);
  const groups = match && match.groups;
  if (!groups) return null;
  const {id, user, slug, version} = groups;
  const name = id || `@${user}/${slug}`;
  const path = `${id ? `d/${id}` : name}${version ? `@${version}` : ''}`;
  try {
    const t = await fetch(`https://api.observablehq.com/${path}.js?v=1`).then(r => r.text());
    const fm = parseFrontmatter(t) || {};
    const v = fm.version;
    return name + (v ? `@${v}` : "");
  } catch {
    return name; // conservative fallback
  }
}
```

```js echo
// Demo usage
signature(signature, {
  description: md`Framework-safe signature renderer.`,
  example: [`
// Basic
signature(myFunc, { description: "Works great." })
`, `
// With tests
signature(myTestedFunc, {
  tests: { 'works': async (assert) => { assert(true, "ok"); } },
  runTests: false
})`]
});

async function exampleFetch(a){ return a; }
signature(exampleFetch, { name: "exampleFetch" });
```
