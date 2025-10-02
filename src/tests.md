# Tests

```js
tests()
```

## Low Boiler-plate

Any *cell*, that starts with `test_` is considered a test, whether in the main notebook or in a dependancy. The cell is considered "passing" if it evaluates to a non-error. Inspired by pytest auto-discovery.


The runner makes no assumption on how you actually test. You could use programatic tests or something more sophisticated like `expect`. Just throw something to indicate failure.

You can filter the tests to lower the quantity

```js
import {tests} from "@tomlarkworthy/tests"
```

## Interactive Examples

Demo of the test state is reactive, even with active dataflow.

```js
viewof example_type = Inputs.radio(
  ["success", "error", "pending", "changing"],
  {
    label: "case"
  }
)
```

```js echo
test_tests_example = {
  switch (example_type) {
    case "error":
      throw "Error";
    case "success":
      yield "Ok";
    case "pending":
      yield new Promise(() => {});
    case "changing":
      while (true) {
        yield Math.random();
        await new Promise((r) => setTimeout(r, 1000));
      }
  }
  yield new Promise(() => {});
}
```

## Testing variables

variables that start with "`test_`", sniffed from the runtime, updated reactively

```js
modules = moduleMap(runtime)
```

```js
viewof testing_variables = scan({
  view: viewof runtime_variables,
  scan: (acc, value) => {
    const test_vars = [...value]
      .filter((v) => typeof v._name == "string" && v._name.startsWith("test_"))
      .map((v) => ({
        name: (modules.get(v._module)?.name || "") + "#" + v._name,
        running: v._reachable,
        variable: v
      }));
    return _.isEqual(acc, test_vars) ? undefined : test_vars;
  },
  invalidation
})
```

```js
Inputs.table(testing_variables)
```

## UI

```js echo
isObservable = isOnObservableCom() &&
  !document.baseURI.startsWith(
    "https://observablehq.com/@tomlarkworthy/lopepage"
  ) // for testing on Observble lopepage notebook
```

```js
tests = ({ filter = () => true } = {}) => {
  background_task;
  return Inputs.table(current.filter(filter), {
    rows: Infinity,
    columns: ["name", "state", "value"],
    reverse: true,
    format: {
      state: (state) =>
        state === "fulfilled"
          ? "✅"
          : state === "rejected"
          ? "❌"
          : state === "pending"
          ? "⌛️"
          : "⏸️",
      name: url,
      value: inspect
    },
    width: {
      state: "5%"
    },
    layout: "auto"
  });
}
```

```js
current = testing_variables
  .map((testing_variable) => ({
    name: testing_variable.name,
    state: "paused",
    ...latest_state.get(testing_variable.name),
    computed: testing_variable.running,
    variable: testing_variable.variable
  }))
  .sort((b, a) => {
    // 1) errors first
    if (a.error !== b.error) return a.error ? -1 : 1;
    // 2) “local” names (starting with ‘#’) next
    const aLocal = a.name.startsWith("#");
    const bLocal = b.name.startsWith("#");
    if (aLocal !== bLocal) return aLocal ? -1 : 1;
    // 3) finally, lexicographic by name
    return a.name.localeCompare(b.name);
  })
```

```js
import { linkTo } from "@tomlarkworthy/lopepage-urls"
```

```js echo
url = (name) => {
  if (isObservable) {
    return html`<a href="/${name}" target="_blank">${name}</a>`;
  } else {
    return html`<a href="${linkTo(name)}">${name}</a>`;
  }
}
```

## Latest State

Variables update reactively, so observers are registered for running testing variables and update the latest state as information arrives. Only applied to running variables.

```js
Inputs.table(
  [...latest_state.entries()].map(([name, state]) => ({
    name,
    ...state
  }))
)
```

```js
viewof latest_state = Inputs.input(new Map())
```

```js
observers = new Map()
```

### Observer syncronization

```js
changes = testing_variables &&
  unorderedSync(
    testing_variables.filter((v) => v.running),
    [...observers.keys()],
    (a, b) => a.name == b
  )
```

```js
on_add = changes.add.forEach((testing_variable) => {
  observers.set(
    testing_variable.name,
    observe(testing_variable.variable, {
      fulfilled: (value) => {
        viewof latest_state.value.set(testing_variable.name, {
          state: "fulfilled",
          value: value
        });
        viewof latest_state.dispatchEvent(new Event("input"));
      },
      pending: (value) => {
        viewof latest_state.value.set(testing_variable.name, {
          state: "pending"
        });
        viewof latest_state.dispatchEvent(new Event("input"));
      },
      rejected: (error) => {
        viewof latest_state.value.set(testing_variable.name, {
          state: "rejected",
          value: error
        });
        viewof latest_state.dispatchEvent(new Event("input"));
      }
    })
  );
})
```

```js
on_remove = {
  testing_variables;
  changes.remove.forEach((name) => {
    const current = observers.get(name);
    if (current) {
      current(); // deregister listener
      observers.delete(name);
    }
    viewof latest_state.value.delete(name);
  });
  viewof latest_state.dispatchEvent(new Event("input"));
}
```

## Background Tasks

```js echo
tasks = {
  on_add;
  on_remove;
  submit_summary;
}
```

```js echo
background_task = keepalive(testsModule, "tasks")
```

```js
viewof testsModule = thisModule()
```

```js
import { moduleMap, submit_summary } from "@tomlarkworthy/module-map"
```

```js
import {
  isOnObservableCom,
  viewof runtime_variables,
  runtime,
  unorderedSync,
  observe,
  thisModule,
  keepalive
} from "@tomlarkworthy/runtime-sdk"
```

```js
import { scan } from "@tomlarkworthy/stream-operators"
```

```js
import { inspect, Inspector } from "@tomlarkworthy/inspector"
```
