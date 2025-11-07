/**
 * Bundled by jsDelivr using Rollup v2.79.2 and Terser v5.39.0.
 * Original file: /npm/@observablehq/stdlib@5.8.8/src/html.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
const e=(n=function(e){var n=document.createElement("template");return n.innerHTML=e.trim(),document.importNode(n.content,!0)},t=function(){return document.createElement("span")},function(e){var r,o,l,d,a,c,u,i,f=e[0],m=[],p=null,s=-1;for(a=1,c=arguments.length;a<c;++a){if((r=arguments[a])instanceof Node)m[++s]=r,f+="\x3c!--o:"+s+"--\x3e";else if(Array.isArray(r)){for(u=0,i=r.length;u<i;++u)(o=r[u])instanceof Node?(null===p&&(m[++s]=p=document.createDocumentFragment(),f+="\x3c!--o:"+s+"--\x3e"),p.appendChild(o)):(p=null,f+=o);p=null}else f+=r;f+=e[a]}if(p=n(f),++s>0){for(l=new Array(s),d=document.createTreeWalker(p,NodeFilter.SHOW_COMMENT,null,!1);d.nextNode();)o=d.currentNode,/^o:/.test(o.nodeValue)&&(l[+o.nodeValue.slice(2)]=o);for(a=0;a<s;++a)(o=l[a])&&o.parentNode.replaceChild(m[a],o)}return 1===p.childNodes.length?p.removeChild(p.firstChild):11===p.nodeType?((o=t()).appendChild(p),o):p});var n,t;export{e as html};export default null;
