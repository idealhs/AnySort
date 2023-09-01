// document.getElementById('highlight-tables').addEventListener('click', function () {
//     // 向内容脚本发送消息，告诉它高亮表格
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.scripting.executeScript({
//             target: { tabId: tabs[0].id },
//             files: ['content.js']
//         }, function () {
//             chrome.tabs.sendMessage(tabs[0].id, { action: "highlightTables" });
//         });
//     });
// });