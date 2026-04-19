(() => {
  const converter = self.ZhConverterCore;

  function convertTextNode(node, direction) {
    if (!node || !node.nodeValue) return;
    node.nodeValue = converter.convertText(node.nodeValue, direction);
  }

  function shouldSkipNode(node) {
    if (!node || !node.parentElement) return true;
    const tag = node.parentElement.tagName;
    return ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(tag);
  }

  function convertPage(direction) {
    const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return shouldSkipNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const n of nodes) convertTextNode(n, direction);

    const editableEls = document.querySelectorAll("input[type='text'], input[type='search'], input:not([type]), textarea, [contenteditable='true']");
    editableEls.forEach((el) => {
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        el.value = converter.convertText(el.value, direction);
        if (el.placeholder) el.placeholder = converter.convertText(el.placeholder, direction);
      } else if (el.isContentEditable) {
        el.innerText = converter.convertText(el.innerText, direction);
      }
    });
  }

  function convertSelectionInInput(el, direction) {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start === null || end === null || start === end) return false;
    const value = el.value;
    const converted = converter.convertText(value.slice(start, end), direction);
    el.value = value.slice(0, start) + converted + value.slice(end);
    el.setSelectionRange(start, start + converted.length);
    return true;
  }

  function convertSelection(direction) {
    const active = document.activeElement;
    if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
      if (convertSelectionInInput(active, direction)) return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    const selectedText = selection.toString();
    if (!selectedText) return;
    const converted = converter.convertText(selectedText, direction);

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(converted));
    selection.removeAllRanges();
  }

  function convertInput(direction) {
    const active = document.activeElement;
    if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
      if (!convertSelectionInInput(active, direction)) {
        active.value = converter.convertText(active.value, direction);
      }
      return true;
    }
    if (active && active.isContentEditable) {
      active.innerText = converter.convertText(active.innerText, direction);
      return true;
    }
    return false;
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    try {
      const { action, direction } = message || {};
      if (!["s2t", "t2s"].includes(direction)) {
        sendResponse({ ok: false, error: "invalid direction" });
        return;
      }

      if (action === "convert-selection") convertSelection(direction);
      else if (action === "convert-page") convertPage(direction);
      else if (action === "convert-input") convertInput(direction);
      else {
        sendResponse({ ok: false, error: "invalid action" });
        return;
      }

      sendResponse({ ok: true });
    } catch (err) {
      sendResponse({ ok: false, error: String(err) });
    }
  });
})();
