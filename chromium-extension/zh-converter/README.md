# 簡繁中文轉換 Chromium Extension

## 功能
- 簡體 ↔ 繁體互轉
- 右鍵選單支援：
  - 選取文字轉換
  - 整個網頁轉換
  - 輸入內容轉換（input/textarea/contenteditable）
- Popup 支援手動輸入文字並轉換

## 安裝
1. 開啟 Chromium/Chrome
2. 前往 `chrome://extensions`
3. 開啟「開發人員模式」
4. 點選「載入未封裝項目」
5. 選擇本資料夾：
   - `chromium-extension/zh-converter`

## 使用
- 在網頁中選取文字後右鍵，選「選取文字 → 轉為繁體/簡體」
- 在網頁空白處右鍵，選「整個網頁 → 轉為繁體/簡體」
- 在輸入框右鍵，選「輸入內容 → 轉為繁體/簡體」
- 點擊 extension 圖示，在 popup 內可直接貼上文字轉換

## 注意
- 此版本使用內建字詞映射，覆蓋常見簡繁轉換場景。
- 少數一簡對多繁（或反向）語境詞仍可能需要人工校正。
