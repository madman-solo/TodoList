import React, { useState, useRef, useEffect } from "react";

// 单元格数据类型
export interface CellData {
  value: string;
  rowIndex: number;
  colIndex: number;
}

// 表格数据类型
export interface TableData {
  rows: string[][]; // 二维数组存储单元格数据
  headers: string[]; // 列头
}

interface ExcelTableProps {
  initialData?: TableData;
  onChange?: (data: TableData) => void;
  readOnly?: boolean;
  minRows?: number;
  minCols?: number;
}

const ExcelTable: React.FC<ExcelTableProps> = ({
  initialData,
  onChange,
  readOnly = false,
  minRows = 5,
  minCols = 5,
}) => {
  // 初始化表格数据
  const [tableData, setTableData] = useState<TableData>(() => {
    if (initialData) return initialData;

    // 默认数据：创建空表格
    const headers = Array.from({ length: minCols }, (_, i) =>
      String.fromCharCode(65 + i)
    ); // A, B, C...
    const rows = Array.from({ length: minRows }, () => Array(minCols).fill(""));

    return { headers, rows };
  });

  // 当前编辑的单元格
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // 选中的单元格
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // 输入框引用
  const inputRef = useRef<HTMLInputElement>(null);

  // 添加列对话框状态
  const [showAddColumnDialog, setShowAddColumnDialog] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const columnNameInputRef = useRef<HTMLInputElement>(null);

  // 当编辑单元格改变时，自动聚焦输入框
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  // 当显示添加列对话框时，聚焦输入框
  useEffect(() => {
    if (showAddColumnDialog && columnNameInputRef.current) {
      columnNameInputRef.current.focus();
    }
  }, [showAddColumnDialog]);

  // 更新单元格值
  const updateCell = (row: number, col: number, value: string) => {
    const newRows = tableData.rows.map((r, rowIndex) =>
      rowIndex === row
        ? r.map((c, colIndex) => (colIndex === col ? value : c))
        : r
    );

    const newData = { ...tableData, rows: newRows };
    setTableData(newData);
    onChange?.(newData);
  };

  // 处理单元格点击
  const handleCellClick = (row: number, col: number) => {
    if (readOnly) return;
    setSelectedCell({ row, col });
    setEditingCell({ row, col });
  };

  // 处理单元格双击
  const handleCellDoubleClick = (row: number, col: number) => {
    if (readOnly) return;
    setEditingCell({ row, col });
  };

  // 处理输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCell) return;
    updateCell(editingCell.row, editingCell.col, e.target.value);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        // 向下移动
        if (row < tableData.rows.length - 1) {
          setSelectedCell({ row: row + 1, col });
          setEditingCell(null);
        }
        break;

      case "Tab":
        e.preventDefault();
        // 向右移动
        if (col < tableData.headers.length - 1) {
          setSelectedCell({ row, col: col + 1 });
          setEditingCell(null);
        } else if (row < tableData.rows.length - 1) {
          // 到行尾，移到下一行开头
          setSelectedCell({ row: row + 1, col: 0 });
          setEditingCell(null);
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (row > 0) {
          setSelectedCell({ row: row - 1, col });
          setEditingCell(null);
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        if (row < tableData.rows.length - 1) {
          setSelectedCell({ row: row + 1, col });
          setEditingCell(null);
        }
        break;

      case "ArrowLeft":
        e.preventDefault();
        if (col > 0) {
          setSelectedCell({ row, col: col - 1 });
          setEditingCell(null);
        }
        break;

      case "ArrowRight":
        e.preventDefault();
        if (col < tableData.headers.length - 1) {
          setSelectedCell({ row, col: col + 1 });
          setEditingCell(null);
        }
        break;

      case "Escape":
        setEditingCell(null);
        break;

      default:
        // 其他按键进入编辑模式
        if (!editingCell && e.key.length === 1) {
          setEditingCell({ row, col });
        }
        break;
    }
  };

  // 添加新行
  const addRow = () => {
    const newRow = Array(tableData.headers.length).fill("");
    const newData = {
      ...tableData,
      rows: [...tableData.rows, newRow],
    };
    setTableData(newData);
    onChange?.(newData);
  };

  // 显示添加列对话框
  const showAddColumnPrompt = () => {
    setShowAddColumnDialog(true);
    setNewColumnName("");
  };

  // 确认添加新列
  const confirmAddColumn = () => {
    const columnName =
      newColumnName.trim() || `列${tableData.headers.length + 1}`;
    const newRows = tableData.rows.map((row) => [...row, ""]);
    const newData = {
      headers: [...tableData.headers, columnName],
      rows: newRows,
    };
    setTableData(newData);
    onChange?.(newData);
    setShowAddColumnDialog(false);
    setNewColumnName("");
  };

  // 取消添加列
  const cancelAddColumn = () => {
    setShowAddColumnDialog(false);
    setNewColumnName("");
  };

  // 处理列名输入框的回车键
  const handleColumnNameKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmAddColumn();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelAddColumn();
    }
  };

  // 删除行
  const deleteRow = (rowIndex: number) => {
    if (tableData.rows.length <= minRows) {
      alert(`至少保留 ${minRows} 行`);
      return;
    }
    const newData = {
      ...tableData,
      rows: tableData.rows.filter((_, i) => i !== rowIndex),
    };
    setTableData(newData);
    onChange?.(newData);
    setSelectedCell(null);
    setEditingCell(null);
  };

  // 删除列
  const deleteColumn = (colIndex: number) => {
    if (tableData.headers.length <= minCols) {
      alert(`至少保留 ${minCols} 列`);
      return;
    }
    const newData = {
      headers: tableData.headers.filter((_, i) => i !== colIndex),
      rows: tableData.rows.map((row) => row.filter((_, i) => i !== colIndex)),
    };
    setTableData(newData);
    onChange?.(newData);
    setSelectedCell(null);
    setEditingCell(null);
  };

  return (
    <div
      className="excel-table-container flex flex-col h-screen w-full overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* 工具栏 */}
      {!readOnly && (
        <div className="flex gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 flex-shrink-0">
          <button
            onClick={addRow}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <span>➕</span>
            <span>添加行</span>
          </button>
          <button
            onClick={showAddColumnPrompt}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <span>➕</span>
            <span>添加列</span>
          </button>
          {selectedCell && (
            <>
              <button
                onClick={() => deleteRow(selectedCell.row)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <span>🗑️</span>
                <span>删除行 {selectedCell.row + 1}</span>
              </button>
              <button
                onClick={() => deleteColumn(selectedCell.col)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <span>🗑️</span>
                <span>删除列 {tableData.headers[selectedCell.col]}</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* 表格 */}
      <div className="flex-1 overflow-auto border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg md:overflow-x-auto">
        <table
          className="w-full h-full bg-white dark:bg-gray-800"
          style={{
            borderCollapse: "collapse",
            border: "2px solid #d1d5db",
            minWidth: "100%",
          }}
        >
          <thead>
            <tr>
              {/* 左上角空单元格 */}
              <th
                className="sticky left-0 z-20 bg-gray-200 dark:bg-gray-700 px-4 py-2 text-center font-bold text-gray-700 dark:text-gray-300 min-w-[60px]"
                style={{
                  borderRight: "2px solid #9ca3af",
                  borderBottom: "2px solid #9ca3af",
                  borderLeft: "2px solid #9ca3af",
                  borderTop: "2px solid #9ca3af",
                }}
              >
                #
              </th>
              {/* 列头 */}
              {tableData.headers.map((header, colIndex) => (
                <th
                  key={colIndex}
                  className="bg-gray-200 dark:bg-gray-700 px-4 py-2 text-center font-bold text-gray-700 dark:text-gray-300 min-w-[120px]"
                  style={{
                    borderRight: "2px solid #9ca3af",
                    borderBottom: "2px solid #9ca3af",
                    borderTop: "2px solid #9ca3af",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                {/* 行号 */}
                <td
                  className="sticky left-0 z-10 bg-gray-100 dark:bg-gray-700 px-4 py-2 text-center font-semibold text-gray-600 dark:text-gray-400"
                  style={{
                    borderRight: "2px solid #9ca3af",
                    borderBottom: "1px solid #d1d5db",
                    borderLeft: "2px solid #9ca3af",
                  }}
                >
                  {rowIndex + 1}
                </td>
                {/* 单元格 */}
                {row.map((cell, colIndex) => {
                  const isEditing =
                    editingCell?.row === rowIndex &&
                    editingCell?.col === colIndex;
                  const isSelected =
                    selectedCell?.row === rowIndex &&
                    selectedCell?.col === colIndex;

                  return (
                    <td
                      key={colIndex}
                      className={`px-2 py-1 transition-all duration-150 ${
                        isSelected
                          ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                      style={{
                        borderRight: "2px solid #9ca3af",
                        borderBottom: "1px solid #d1d5db",
                      }}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      onDoubleClick={() =>
                        handleCellDoubleClick(rowIndex, colIndex)
                      }
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={cell}
                          onChange={handleInputChange}
                          onBlur={() => setEditingCell(null)}
                          className="w-full px-2 py-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100"
                        />
                      ) : (
                        <div className="px-2 py-1 min-h-[32px] text-gray-900 dark:text-gray-100">
                          {cell || (
                            <span className="text-gray-400 dark:text-gray-500">
                              {readOnly ? "" : "点击编辑"}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 提示信息 */}
      {!readOnly && (
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">💡</span>
            <div>
              <p className="font-semibold text-blue-700 dark:text-blue-400">
                快捷键提示：
              </p>
              <p>• 点击单元格选中，双击或按任意键进入编辑模式</p>
              <p>
                • Enter: 向下移动 | Tab: 向右移动 | 方向键: 导航 | Esc: 退出编辑
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 添加列对话框 */}
      {showAddColumnDialog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelAddColumn();
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-96 max-w-[90%]">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              ✏️ 添加新列
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              请输入新列的名称（留空则使用默认名称）
            </p>
            <input
              ref={columnNameInputRef}
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              onKeyDown={handleColumnNameKeyDown}
              placeholder={`列${tableData.headers.length + 1}`}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-green-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              maxLength={50}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cancelAddColumn}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-200"
              >
                取消
              </button>
              <button
                onClick={confirmAddColumn}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelTable;
