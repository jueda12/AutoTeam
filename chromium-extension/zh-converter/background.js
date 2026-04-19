const MENUS = [
  { id: "selection-s2t", title: "選取文字 → 轉為繁體", action: "convert-selection", direction: "s2t", contexts: ["selection", "editable"] },
  { id: "selection-t2s", title: "選取文字 → 轉為簡體", action: "convert-selection", direction: "t2s", contexts: ["selection", "editable"] },
  { id: "page-s2t", title: "整個網頁 → 轉為繁體", action: "convert-page", direction: "s2t", contexts: ["page"] },
  { id: "page-t2s", title: "整個網頁 → 轉為簡體", action: "convert-page", direction: "t2s", contexts: ["page"] },
  { id: "input-s2t", title: "輸入內容 → 轉為繁體", action: "convert-input", direction: "s2t", contexts: ["editable"] },
  { id: "input-t2s", title: "輸入內容 → 轉為簡體", action: "convert-input", direction: "t2s", contexts: ["editable"] }
];

chrome.runtime.onInstalled.addListener(() => {
  for (const menu of MENUS) {
    chrome.contextMenus.create({
      id: menu.id,
      title: menu.title,
      contexts: menu.contexts
    });
  }
});

function sendToTab(tabId, action, direction) {
  chrome.tabs.sendMessage(tabId, { action, direction }, () => {
    void chrome.runtime.lastError;
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;
  const menu = MENUS.find((m) => m.id === info.menuItemId);
  if (!menu) return;
  sendToTab(tab.id, menu.action, menu.direction);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.action !== "popup-command") return;
  const tabId = sender.tab?.id ?? message.tabId;
  if (!tabId) {
    sendResponse({ ok: false, error: "no tab id" });
    return;
  }
  sendToTab(tabId, message.command, message.direction);
  sendResponse({ ok: true });
});
