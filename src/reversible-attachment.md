# Reversible attachment

_reversibleAttach_ allows you toggle whether a view is attached to a composite view at runtime. This is useful for development when building views hierarchically, as you can use the _reversibleAttach_ to work on isolated pieces or the whole.

The value remain accessible in both places. Works with both `Inputs.form` and `@tomlarkworthy/view`, the latter supports back-driving values, which only works when the attachment is active.

```js
import {reversibleAttach} from '@tomlarkworthy/reversible-attachment'
```

```js
const attach = view(Inputs.toggle({
  label: "attach"
}))
```

## child view

```js
const child = view(Inputs.text())
```

## parent view ([@tomlarkworthy/view](https://observablehq.com/@tomlarkworthy/view))

```js echo
// CHECK VIEW CONFIG
const parent = view(view`<div>
${["child", reversibleAttach(attach, viewof child)]}
</div>`)
```

Note changes propogate to both

```js echo
child
```

```js echo
parent
```

Backdrivability works 

```js echo
Inputs.button("backdrive parent", {
  reduce: () => {
    viewof parent.value.child = Math.random();
    viewof parent.child.dispatchEvent(new Event("input", { bubbles: true }));
  }
})
```

## grandparent view ([Inputs.form](https://observablehq.com/@observablehq/input-form))

```js
const attach_gp = view(Inputs.toggle({
  label: "attach gradparent"
}))
```

```js echo
const grand_parent = view(Inputs.form({
  parent: reversibleAttach(attach_gp, viewof parent)
}))
```

```js echo
grand_parent
```

```js echo
Inputs.button("backdrive grand_parent", {
  reduce: () => {
    viewof grand_parent.value.parent.child = Math.random();
    viewof grand_parent.dispatchEvent(new Event("input", { bubbles: true }));
  }
})
```

---

```js
const parents = new Map()
```

```js
function reversibleAttach(shouldBind, view, invalidation) {
  if (!parents.has(view) && view.parentElement) {
    parents.set(view, view.parentElement);
  }
  if (shouldBind) {
    return view;
  } else {
    if (parents.has(view)) {
      const parent = parents.get(view);
      if (parent.firstChild !== view) parent.appendChild(view);
    }
    const dummy = document.createTextNode("<detached>");
    return bindOneWay(dummy, view, invalidation);
  }
}
```

```js
import { view, bindOneWay } from "@tomlarkworthy/view"
```

```js echo
//import { footer } from "@tomlarkworthy/footer"
```

```js echo
//footer
```
