const textEl = document.getElementById("text");

function convertInputText(direction) {
  textEl.value = self.ZhConverterCore.convertText(textEl.value, direction);
}

async function runTabCommand(command, direction) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  chrome.runtime.sendMessage({ action: "popup-command", command, direction, tabId: tab.id }, (response) => {
    if (chrome.runtime.lastError || !response?.ok) {
      alert("操作失敗，請重試或重新整理頁面後再試。");
    }
  });
}

document.getElementById("s2t").addEventListener("click", () => convertInputText("s2t"));
document.getElementById("t2s").addEventListener("click", () => convertInputText("t2s"));
document.getElementById("page-s2t").addEventListener("click", () => runTabCommand("convert-page", "s2t"));
document.getElementById("page-t2s").addEventListener("click", () => runTabCommand("convert-page", "t2s"));
document.getElementById("input-s2t").addEventListener("click", () => runTabCommand("convert-input", "s2t"));
document.getElementById("input-t2s").addEventListener("click", () => runTabCommand("convert-input", "t2s"));
