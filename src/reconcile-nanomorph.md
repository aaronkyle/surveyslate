```js
md`
# Hypertext literal reconciliation with nanomorph


I love the [hypertext literal](https://observablehq.com/@observablehq/htl). It is intuitive. However, naive application of it tends to invalidate state between renders leading to poor UX.

React solved this problem with a [reconciliation](https://reactjs.org/docs/reconciliation.html) algorithm. However, React is very complicated and does not gel with Observable.

This notebook is an idea to try and get a React-like reconciliation algorithm applied to the hypertext literal in an Observable native way. We exploit the \`this\` variable to retrieve the previous DOM state allowing us to diff from the previous cell UI state. 

~~~js
import {reconcile, html} from '@tomlarkworthy/reconcile-nanomorph'
~~~

This library was used to build a [reactive unit testing framework](https://observablehq.com/@tomlarkworthy/testing).
`
```

```js
md`
## Demo of problem

If we have some state defined elsewhere, say a list of messages:-

`
```

```js
mutable msgs = ["How are you?", "I am great!, loving Observable"]
```

```js
md`
We can create a very simple chat UI using the hypertext literal to change this external state. I love this construction as it can hold its own state and helper functions. 
`
```

```js echo
{
  async function sendMsg(evt) {
    if (evt.keyCode === 13) {
      console.log(msgs);
      mutable msgs = msgs.concat([evt.target.value]);
    }
  }
  return htl.html`
    ${msgs.map((msg) => htl.html`<p>${msg}</p>`)}
    <input class="text" onkeydown=${sendMsg}></input>
    <button onclick=${() => (mutable msgs = [])}>clear</button>
  `;
}
```

```js
md`
This is very simple to understand, but there are some problems with the UX. After sending a message, the focus of the cursor is lost. This is because when the list changes, the HTML is rebuilt from scratch, and all DOM state is lost, including the focus. So its impossible to send lots of messages in a row, you keep having to click back into the text area!
`
```

```js
md`
## Solution Attempt

Create a custom \`reconcile\` function for DOM state diffing. Unlike React and Preact, we do not use a virtual DOM. Instead we compare the previous DOM state to the new hypertext literal HTMLElement. You can get the previous state of a cell with the keyword [\`this\`](https://talk.observablehq.com/t/get-the-previous-value-of-a-cell-when-its-edited-and-saved/792).

To reuse the previous state and apply a diff we add 

         reconcile(this, <HTMLElement>)

where we previously just did

         <HTMLElement>

to the implementation. Reconcile changes DOM node at \`this\` to look like \`<HTMLElement>\` and returns it, if possible, otherwise it just returns the target. 

The reconciliation algorithm will use the "id" attribute to guide matching.
`
```

```js echo
{
  function sendMsg(evt) {
    if (evt.keyCode === 13) {
      console.log(msgs);
      mutable msgs = msgs.concat([evt.target.value]);
    }
  }
  return reconcile(
    this,
    htl.html`
    ${msgs.map((msg) => htl.html`<p>${msg}</p>`)}
    <input id="chat" class="text" onkeydown=${sendMsg}></input>
    <button onclick=${() => (mutable msgs = [])}>clear</button> 
  `
  );
}
```

```js
md`
## It works!
Now state is not lost, the focus remains on the text component, __though the text is cleared__ (a slight difference to the original [reconcile prototype](https://observablehq.com/@tomlarkworthy/reconcile))
`
```

```js
md`
### Implementation Notes

- Unlike React the "id" attribute is used to guide element matching.

- event handlers like onclick are implemented by hypertext literal as assignment to node properties (not HTML attributes), which is why existing DOM diffs won't work (they work at HTMLElement level).

- If you try to reconcile with a live DOM element, you have to make sure the types match (e.g. DIV to DIV) so the element can be updated in place.
`
```

```js echo
morph = require('https://bundle.run/nanomorph@5.4.2')
```

```js
function reconcile(current, target, options) {
  if (
    !current ||
    !target ||
    current.nodeType != target.nodeType ||
    current.nodeName != target.nodeName ||
    current.namespaceURI != target.namespaceURI
  ) {
    if (current && target && current.nodeName != target.nodeName) {
      console.log("Cannot reconcile", current.nodeName, target.nodeName);
    }
    return target;
  }
  return morph(current, target, options);
}
```

```js
md `# Tests`
```

```js
attributeCreate = {
  const current = htl.html`<div></div>`;
  const target = htl.html`<div foo="1"></div>`;
  const reconciled = reconcile(current, target);
  console.log(reconciled);
  return reconciled.getAttribute("foo") == "1";
}
```

```js
attributeRemoved = {
  const current = htl.html`<div foo="1"></div>`;
  const target = htl.html`<div></div>`;
  const reconciled = reconcile(current, target);
  return reconciled.getAttribute("foo") === null;
}
```

```js
attributeUpdate = {
  const current = htl.html`<div foo="2"></div>`;
  const target = htl.html`<div foo="1"></div>`;
  const reconciled = reconcile(current, target);
  return reconciled.getAttribute("foo") == "1";
}
```

```js
attributesCRUD = {
  const current = htl.html`<div foo="2" bar="1"></div>`;
  const target = htl.html`<div bar="2" baz="3"></div>`;
  const reconciled = reconcile(current, target);
  return (
    reconciled.getAttribute("foo") == null &&
    reconciled.getAttribute("bar") == "2" &&
    reconciled.getAttribute("baz") == "3"
  );
}
```

```js
childUpdateInPlace = {
  const current = htl.html`<ul><li id="t1"> </li></ul>`;
  const target = htl.html`<ul><li id="t1">1</li></ul>`;
  const beforeReconciliation = current.firstChild;
  const reconciled = reconcile(current, target);
  return (
    reconciled.firstChild === beforeReconciliation &&
    reconciled.firstChild.firstChild.wholeText === "1"
  );
}
```

```js
childAdded = {
  const current = htl.html`<ul></ul>`;
  const target = htl.html`<ul><li id="t1">1</li></ul>`;
  const reconciled = reconcile(current, target);
  return reconciled.firstChild.firstChild.wholeText === "1";
}
```

```js
childRemoved = {
  const current = htl.html`<ul><li id="t1">1</li></ul>`;
  const target = htl.html`<ul></ul>`;
  const reconciled = reconcile(current, target);
  return reconciled.firstChild == null;
}
```

```js
keyedChildUpdateInPlace = {
  const current = htl.html`<ul><li id="t1"></li></ul>`;
  const target = htl.html`<ul><li></li><li id="t1"></li></ul>`;
  const beforeReconciliation = current.firstChild;
  const reconciled = reconcile(current, target);
  return reconciled.firstChild.nextSibling === beforeReconciliation;
}
```

```js
DOMUpdateInPlaceDOM = htl.html`
<div id="DOMUpdateInPlace"> 
</div>
`
```

```js
DOMUpdateInPlace = {
  DOMUpdateInPlaceDOM
  
  const current = document.getElementById("DOMUpdateInPlace")
  const target = html`<div id="DOMUpdateInPlace"><p>1</p></div>`
  const reconciled = reconcile(current, target);
  return current ===  reconciled
}
```

```js echo
NestedDOMUpdateInPlaceDOM = html`
<div id="NestedDOMUpdateInPlace"><p>
    <b>raw</b>
</p></div>`
```

```js
NestedDOMUpdateInPlace = {
  NestedDOMUpdateInPlaceDOM
  
  const current = document.getElementById("NestedDOMUpdateInPlace")
  const target = html`<div id="NestedDOMUpdateInPlace"><p>
    <b>new</b>
  </p></div>`
  reconcile(current, target);
  return current.textContent.includes("new")
}
```
