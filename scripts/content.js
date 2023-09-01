console.log('Content script is loaded.');

// Get all the tables on the current page
let tables = document.querySelectorAll('table');
console.log('Tables : ' + tables);
if (tables.length === 0) {
    console.log('No tables found.');
} else {
    console.log(`Found ${tables.length} tables.`);
    tables.forEach(table => {
        let headers = table.querySelectorAll('th');
        if (headers.length === 0) {
            addTableHeaders(table);
        }
        setupHeaderSorting(table);
    });
}

function getTableRows(table) {
    const tbody = table.querySelector('tbody');
    return tbody ? Array.from(tbody.rows) : Array.from(table.rows);
}

//implement sortTable function
function sortTable(table, colIndex, order) {
    const tbody = table.querySelector('tbody') || table;
    const rows = Array.from(tbody.rows);
    // rows.forEach((row, index) => {
    //     row.setAttribute('data-original-order', index);
    // });

    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[colIndex].innerText;
        const cellB = rowB.cells[colIndex].innerText;
        if (!isNaN(cellA) && !isNaN(cellB)) {
            return order === 'asc' ? cellA - cellB : cellB - cellA;
        } else {
            return order === 'asc' ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        }
    });

    if (order === 'original') {
        rows.sort((rowA, rowB) => {
            return rowA.dataset.originalOrder - rowB.dataset.originalOrder;
        });
    }

    rows.forEach(row => tbody.appendChild(row));
}

function addTableHeaders(table) {
    // 确定列数
    const tbody = table.querySelector('tbody');
    const rows = tbody ? tbody.querySelectorAll('tr') : table.querySelectorAll('tr');
    const firstRow = rows[0];
    const columnCount = firstRow ? firstRow.children.length : 0;

    // 创建表头
    const thead = document.createElement('thead');
    if (table.children[0].tagName.toLowerCase() === 'tbody') {
        table.insertBefore(thead, table.children[0]);
    } else {
        table.appendChild(thead);
    }

    const headerRow = document.createElement('tr');
    thead.appendChild(headerRow);

    for (let i = 0; i < columnCount; i++) {
        const th = document.createElement('th');
        th.innerHTML = `Header ${i + 1}`;
        headerRow.appendChild(th);
    }
}

function setupHeaderSorting(table) {
    const thead = table.querySelector('thead');
    if (!thead) return;
    const rows = getTableRows(table);

    // 给表格中的每一行分配一个原始的排序顺序
    Array.from(rows).forEach((row, index) => {
        row.setAttribute('data-original-order', index);
    });

    // 在每个th内添加一个用于显示排序箭头的span
    Array.from(rows[0].querySelector('th')).forEach((th) => {
        const span = document.createElement('span');
        th.appendChild(span);
    });

    thead.addEventListener('click', function (e) {
        const th = e.target.closest('th'); // 确保我们总是得到<th>元素，即使我们点击的是内部的<span>
        if (!th) return;

        const colIndex = Array.from(th.parentNode.children).indexOf(th);
        const currentOrder = th.getAttribute('data-sort-order') || 'original';
        const arrowSpan = th.querySelector('span'); // 获取用于显示箭头的<span>

        let newOrder = 'asc';

        if (currentOrder === 'original') {
            newOrder = 'asc';
            arrowSpan.innerHTML = ' ↑';
        } else if (currentOrder === 'asc') {
            newOrder = 'desc';
            arrowSpan.innerHTML = ' ↓';
        } else {
            newOrder = 'original';
            arrowSpan.innerHTML = ''; // 清除排序箭头
        }

        sortTable(table, colIndex, newOrder);
        th.setAttribute('data-sort-order', newOrder);
    });
}

// let highlightedTable = null;

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     console.log('Message received:', message);
//     if (message.action === "highlightTables") {
//         let tables = document.querySelectorAll('table');
//         tables.forEach(table => {
//             table.style.border = '2px solid red';

//             table.addEventListener('click', function () {
//                 if (highlightedTable) {
//                     // 移除之前表格的高亮
//                     highlightedTable.style.border = 'none';
//                 }
//                 highlightedTable = table;
//                 table.style.border = '3px solid blue';

//                 // 为每列添加排序按钮
//                 let headers = table.querySelectorAll('th');
//                 headers.forEach(header => {
//                     let sortButton = document.createElement('button');
//                     sortButton.innerText = 'Sort';
//                     header.appendChild(sortButton);
//                     // TODO: 添加排序逻辑
//                 });
//             });
//         });
//     }
// });
