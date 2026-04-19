document.addEventListener("DOMContentLoaded", () => {
  const textEl = document.getElementById("text");
  const statusEl = document.getElementById("status");

  function setStatus(message, isError = false) {
    statusEl.textContent = message || "";
    statusEl.style.color = isError ? "#b91c1c" : "#4b5563";
  }

  function convertInputText(direction) {
    const core = self.ZhConverterCore;
    if (!core?.convertText) {
      setStatus("轉換核心尚未載入。請確認 converter.js 已正確載入，然後關閉並重新開啟擴充功能視窗。", true);
      return;
    }
    textEl.value = core.convertText(textEl.value, direction);
    setStatus("文字已完成轉換。");
  }

  async function runTabCommand(command, direction) {
    setStatus("");
    chrome.runtime.sendMessage({ action: "popup-command", command, direction }, (response) => {
      if (chrome.runtime.lastError || !response?.ok) {
        const err = chrome.runtime.lastError?.message || response?.error || "未知錯誤";
        setStatus(`操作失敗：${err}。請重試或重新整理頁面後再試。`, true);
        return;
      }
      setStatus("操作已送出。");
    });
  }

  document.getElementById("s2t").addEventListener("click", () => convertInputText("s2t"));
  document.getElementById("t2s").addEventListener("click", () => convertInputText("t2s"));
  document.getElementById("page-s2t").addEventListener("click", () => runTabCommand("convert-page", "s2t"));
  document.getElementById("page-t2s").addEventListener("click", () => runTabCommand("convert-page", "t2s"));
  document.getElementById("input-s2t").addEventListener("click", () => runTabCommand("convert-input", "s2t"));
  document.getElementById("input-t2s").addEventListener("click", () => runTabCommand("convert-input", "t2s"));
});
