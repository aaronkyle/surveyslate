# Catch-all TESTING

```js echo
const errorTriggerInput = Inputs.button(html`throw an error`, { required: true })

const errorTrigger = Generators.input(errorTriggerInput);
```

```js
display(errorTriggerInput)
```


```js echo
const errorCell = (() => {
  errorTrigger;
  // Errors thrown here are picked up by catchAll
  throw new Error("An error " + Math.random().toString(16).substring(3));
})();
display(errorCell)
```


```js echo
display(errorLog)
view(Inputs.table(errorLog))
```





<!--
LOOK HERE TO CORRECT THE MUTABLE!!!!!!
-->

```js echo
// --- Mutable + setter functions ---
const errorLog = Mutable([]);

const catchAll = (handler, invalidation) => {
  const listener = () => handler("unknown", error.value);
  error.addEventListener("input", listener);
  if (invalidation)
    invalidation.then(() => {
      error.removeEventListener(listener);
    });
};

///ensure this block runs when 'error' is invoked.
error;

// update the mutable using .value
catchAll((cellName, reason) => {
  errorLog.value = errorLog.value.concat({
    cellName,
    reason
  });
}, invalidation);
```

```js
display(catchAll);
```

```js echo
display(errorLog);
```

```js echo
display(errorLog.value);
```

```js echo
view(Inputs.table(errorLog));
```



```js echo
// IMPLEMENTATION: expose an input whose value is the latest error string
const errorElement = (() => {
  const view = Inputs.input();

  const notify = (event) => {
    view.value = event.detail.error;
    view.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const processInspectorNode = (el) => {
    el.addEventListener("error", notify);
  };

  // Attach to current cells
  [...document.querySelectorAll(".observablehq").values()].forEach(
    processInspectorNode
  );
  // Watch for new cells
  const root = document.querySelector(".observablehq-root");
  if (root) {
    const observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        [...mutation.addedNodes].forEach(processInspectorNode);
      }
    });
    observer.observe(root, {
      childList: true
    });
    invalidation.then(observer.disconnect);
  }
  return view;
})();

let error = Generators.input(errorElement)
```

```js echo
display(errorElement);
```

```js echo
display(error);
```



```js echo
//const catchAll = (handler, invalidation) => {
////  const listener = () => handler("unknown", error);
//const listener = () => handler("unknown", error.value);
//  error.addEventListener("input", listener);
//  if (invalidation)
//    invalidation.then(() => {
//      error.removeEventListener(listener);
//      error.removeEventListener("input", listener);
//    });
//};

// catchAll: call a handler whenever the latest error changes
//const catchAll((cellName, reason) => {
//  errorLog = errorLog.concat({
//    cellName,
//    reason
//  });
//}, invalidation)
//display(catchAll);

```
