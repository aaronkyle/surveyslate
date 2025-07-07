# Substratum

An opinionated set of base styles for exported Observable Notebooks. The styles are only applied when the notebook is run from downloaded (or exported) files. This is built on top of [modern-css-reset](https://github.com/hankchizljaw/modern-css-reset).

## Usage

Import `substratum` into your notebook:

```js
import { substratum } from "@categorise/substratum"
```

... in another cell, call the function with option,
[`invalidation`](https://github.com/observablehq/stdlib/#invalidation) promise.

```js
substratum({ invalidation })
```

You should see the base styles applied when the notebook is run using downloaded code.

## Implementation

```js echo
function substratum({
  debug = false,
  invalidation,
  messageWhenInactive = md`⏸️ _Substratum styles are not loaded._`,
  messageWhenActive = md`✅ _Substratum styles are loaded._`
} = {}) {
  if (invalidation == null) {
    throw new Error(
      "invalidation is not provided. See: https://github.com/observablehq/stdlib/#invalidation"
    );
  }

  if (!isRunningStandalone && !debug) return messageWhenInactive;

  installStyles({ invalidation });

  return messageWhenActive;
}
```

```js echo
function installStyles({ invalidation }) {
  let elements = new Set();

  function detach(elements) {
    for (let n of elements) {
      n.remove();
      elements.delete(n);
    }
  }

  function attach(nodes) {
    for (let n of nodes) {
      document.head.prepend(n);
      elements.add(n);
    }
  }

  invalidation.then(() => detach(elements));

  detach(elements);

  const newStyleElements = new Set(
    [html`<style>${reset}`, html`<style>${main}`].reverse()
  );

  attach(newStyleElements);
}
```

```js
// Checks whether the notebook is running outside Observable or Observable Embedded Preview iFrame.
// Usually the case when running an exported notebook.

// The code is base on @mootar's https://observablehq.com/@mootari/environment#isHosted

isRunningStandalone = {
  const baseURL = new URL(document.baseURI);
  return !(
    document.location.hostname.endsWith(".observableusercontent.com") ||
    baseURL.hostname.endsWith(".observableusercontent.com")
  );
}
```

```js
// From https://github.com/hankchizljaw/modern-css-reset/blob/master/dist/reset.css
reset = `/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
}

/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role="list"],
ol[role="list"] {
  list-style: none;
}

/* Set core root defaults */
html:focus-within {
  scroll-behavior: smooth;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}

/* Remove all animations and transitions for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
   scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`
```

```js
main = `:root {
	/* From Observable */
	--max-width-page: 76rem;

	/* Spacing and Colors from Tachyons */
	--spacing-medium: 1rem;

	--near-black: #111;

	--black-10: rgba(0, 0, 0, 0.1);

	--dark-blue: #00449e;
	--blue: #357edd;
	
}

:root {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
		sans-serif, "Apple Color Emoji", "Segoe UI Emoji";

	color: var(--near-black);
}

body {
	max-width: var(--max-width-page);
	padding: var(--spacing-medium);
	margin: 0 auto;
}

p,
table,
figure,
figcaption,
h1,
h2,
h3,
h4,
h5,
h6,
.katex-display {
	max-width: 640px;
}

ul,
ol {
	padding-left: 28px;
}
blockquote,
ol,
ul {
	max-width: 600px;
}

hr {
	border: 0;
	border-top: 1px solid var(--black-10);
}

a {
	color: var(--blue);
}

a:hover,
a:focus,
a:active {
	color: var(--dark-blue);
}

.observablehq + .observablehq {
	margin-top: var(--spacing-medium);
}

/* .observablehq--inspect {
	display: none;
}
 */
`
```

### Testing

```js echo
substratum({ debug, invalidation })
```

```js
viewof debug = Inputs.toggle({ label: "Debug", value: false })
```

## Attributions

- The environment detection code is based on [@mootari’s Environment notebook](https://observablehq.com/@mootari/environment).
