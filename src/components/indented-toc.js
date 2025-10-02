//# Indented ToC


import * as DOM from "/components/DOM.js"


import {Generators} from "observablehq:stdlib";

import { html } from "htl";

export function toc(options = {}) {
  if (typeof options === "string") options = { headers: options };

  const {
    headers = "h1,h2,h3",
    hideStartingFrom = null,
    title = "Table of Contents",
    exclude
  } = options;

  return Generators.observe((notify) => {
    let previousHeadings = [];
    let renderedEmptyToC = false;

    const ensureId = (el) => {
      if (el.id) return el.id;
      const base = (el.textContent || "").trim().toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")
        .replace(/\-+/g, "-")
        .replace(/^\-|\-$/g, "") || "section";
      let id = base, i = 1;
      while (document.getElementById(id)) id = `${base}-${i++}`;
      el.id = id;
      return id;
    };

    function observed() {
      let currentHeadings = Array.from(document.querySelectorAll(headers));

      if (exclude) {
        currentHeadings = currentHeadings.filter((h) => !h.closest(exclude));
      }

      // Nothing to render
      if (!currentHeadings.length) {
        if (!renderedEmptyToC) {
          notify(html`<div>Unable to generate ToC: no headings found</div>`);
          renderedEmptyToC = true;
        }
        return;
      }

      // Bail if unchanged
      if (
        currentHeadings.length === previousHeadings.length &&
        !currentHeadings.some((h, i) => previousHeadings[i] !== h)
      ) return;

      renderedEmptyToC = false;
      previousHeadings = currentHeadings.slice();

      // Determine the leftmost level (e.g., 2 for h2)
      const startIndentation = headers
        .split(",")
        .map((h) => parseInt(h.replace(/h/gi, ""), 10))
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => a - b)[0] ?? 1;

      // Build the nested list
      const container = document.createElement("div");
      const frag = document.createDocumentFragment();

      if (title) frag.append(html`<b>${DOM.text(title)}</b>`);

      let currentIndentation;
      let ulStack = [];

      const openUl = () => {
        const ul = document.createElement("ul");
        (ulStack[ulStack.length - 1] ?? frag).appendChild(ul);
        ulStack.push(ul);
      };
      const closeUl = () => { ulStack.pop(); };

      for (const h of currentHeadings) {
        if (hideStartingFrom && h.textContent === hideStartingFrom) break;

        const nodeIndentation = parseInt(h.tagName[1], 10);

        if (typeof currentIndentation === "undefined") {
          currentIndentation = startIndentation;
          // open lists until we reach the first heading level
          while (nodeIndentation > currentIndentation) {
            openUl();
            currentIndentation++;
          }
          if (ulStack.length === 0) openUl(); // at least one UL
        } else {
          while (currentIndentation < nodeIndentation) {
            openUl();
            currentIndentation++;
          }
          while (currentIndentation > nodeIndentation) {
            closeUl();
            currentIndentation--;
          }
          if (ulStack.length === 0) openUl(); // safety
        }

        const id = ensureId(h);
        const li = html`<li><a href="#${id}">${DOM.text(h.textContent)}</a></li>`;
        li.onclick = (e) => {
          // preserve anchor while making scrolling smooth
          // (browser default jump works too if you prefer)
          e.preventDefault();
          document.getElementById(id)?.scrollIntoView();
          history.replaceState(null, "", `#${id}`);
        };
        ulStack[ulStack.length - 1].append(li);
      }

      // Close down to the start level
      while ((currentIndentation ?? startIndentation) > startIndentation) {
        closeUl();
        currentIndentation--;
      }

      container.append(frag);
      notify(container);
    }

    const observer = new MutationObserver(observed);
    observer.observe(document.body, { childList: true, subtree: true });
    observed();
    return () => observer.disconnect();
  });
}
