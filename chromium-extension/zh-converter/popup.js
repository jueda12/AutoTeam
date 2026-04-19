document.addEventListener("DOMContentLoaded", () => {
  const textEl = document.getElementById("text");

  function convertInputText(direction) {
    const core = self.ZhConverterCore;
    if (!core?.convertText) {
      alert("轉換核心尚未載入。請確認 converter.js 已正確載入，然後關閉並重新開啟擴充功能視窗。");
      return;
    }
    textEl.value = core.convertText(textEl.value, direction);
  }

  async function runTabCommand(command, direction) {
    chrome.runtime.sendMessage({ action: "popup-command", command, direction }, (response) => {
      if (chrome.runtime.lastError || !response?.ok) {
        const err = chrome.runtime.lastError?.message || response?.error || "未知錯誤";
        alert(`操作失敗：${err}。請重試或重新整理頁面後再試。`);
      }
    });
  }

  document.getElementById("s2t").addEventListener("click", () => convertInputText("s2t"));
  document.getElementById("t2s").addEventListener("click", () => convertInputText("t2s"));
  document.getElementById("page-s2t").addEventListener("click", () => runTabCommand("convert-page", "s2t"));
  document.getElementById("page-t2s").addEventListener("click", () => runTabCommand("convert-page", "t2s"));
  document.getElementById("input-s2t").addEventListener("click", () => runTabCommand("convert-input", "s2t"));
  document.getElementById("input-t2s").addEventListener("click", () => runTabCommand("convert-input", "t2s"));
});
