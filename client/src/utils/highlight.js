import "../css/highlight.css";
import hljs from "highlight.js/lib/common";

export function highlightAllCode(container = document) {
  if (typeof document === "undefined" || !container || typeof container.querySelectorAll !== "function") {
    return;
  }
  const blocks = container.querySelectorAll("pre code");
  blocks.forEach((block) => {
    hljs.highlightElement(block);
  });
}
