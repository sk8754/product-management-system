"use client";
import { Stored, stored_status } from "@/app/generated/prisma/client";

import {
  Column,
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { useState } from "react";
import { Button } from "./button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RowOrderForm } from "./RowOrderForm";
import { useCurrentStoredData } from "@/hooks/useCurrentStoredData";

const AllStoredItemsTable = () => {
  const { currentStoredData } = useCurrentStoredData();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const formatDateTime = (value: Date) => {
    const date = new Date(value);
    return date.toISOString().replace("T", " ").slice(0, 19);
  };

  const STATUS_LABEL: Record<stored_status, string> = {
    normal: "正常",
    caution: "低在庫",
    alert: "緊急",
  };

  const STATUS_COLOR: Record<stored_status, string> = {
    normal: "text-green-600 bg-green-100",
    caution: "text-yellow-400 bg-yellow-100",
    alert: "text-red-500 bg-red-200",
  };

  const columns: ColumnDef<Stored>[] = [
    { accessorKey: "product_id", header: "商品ID" },
    { accessorKey: "product_name", header: "商品名" },
    { accessorKey: "category", header: "カテゴリー" },
    { accessorKey: "current_stored", header: "現在庫数" },
    { accessorKey: "minimum_stored", header: "最低在庫" },
    {
      accessorKey: "status",
      header: "ステータス",
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <span
            className={`${STATUS_COLOR[status]} font-medium px-3 py-2 rounded-sm`}
          >
            {STATUS_LABEL[status]}
          </span>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: "最終更新",
      cell: ({ getValue }) => formatDateTime(getValue<Date>()),
    },
  ];

  const table = useReactTable({
    data: currentStoredData,
    columns: columns,
    state: {
      sorting: sorting,
      globalFilter: globalFilter,
      pagination: pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="py-8 px-8 mb-8 border rounded-xl">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="font-bold text-[1.2rem]">商品在庫一覧</h2>
            <p>全商品の在庫状況と詳細情報</p>
          </div>

          <div>
            <input
              type="text"
              placeholder="商品を検索..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="py-2 pl-8 w-[16rem] border rounded-md"
            />
          </div>
        </div>

        {/* テーブル */}

        <table className="w-full text-center">
          <colgroup>
            <col className="w-[5%]"></col>
            <col className="w-[25%]"></col>
            <col className="w-[15%]"></col>
            <col className="w-[10%]"></col>
            <col className="w-[10%]"></col>
            <col className="w-[10%]"></col>
            <col className="w-[15%]"></col>
            <col className="w-[10%]"></col>
          </colgroup>
          <thead className="border-b">
            {table.getHeaderGroups().map((headerGroups) => (
              <tr key={headerGroups.id}>
                {headerGroups.headers.map((header) => (
                  <th
                    key={header.id}
                    className="pb-4"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      {/* ソートアイコン */}
                      {{
                        asc: "▲",
                        desc: "▼",
                      }[header.column.getIsSorted() as string] ?? "↕"}
                    </div>
                  </th>
                ))}

                <th className="pb-4">編集</th>
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className="hover:opacity-85 hover:bg-gray-100 transition duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-4 border-b">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}

                  {/* 編集ボタン列（React Table 管理外） */}

                  {/* モーダルメニュー */}
                  <td className="flex justify-center gap-4 py-4 border-b">
                    <Dialog>
                      <DialogTrigger className="px-2 py-2 rounded-sm cursor-pointer text-white bg-[#2d2b2b]">
                        発注
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>商品発注メニュー</DialogTitle>
                          <DialogDescription>
                            発注する商品の数量を入力してください。
                          </DialogDescription>
                        </DialogHeader>
                        <div>
                          <h2>商品名:{row.original.product_name}</h2>
                          <h2>最低在庫数:{row.original.minimum_stored}</h2>
                          <h2>現在個数:{row.original.current_stored}</h2>
                          <h2>
                            最低推奨発注量:
                            <span
                              className={`${row.original.current_stored >= row.original.minimum_stored ? "text-[green]" : "text-[red] font-bold"}`}
                            >
                              {row.original.current_stored >=
                              row.original.minimum_stored
                                ? "最低在庫量は満たしています"
                                : row.original.minimum_stored -
                                  row.original.current_stored}
                            </span>
                          </h2>

                          <RowOrderForm
                            row={row.original}
                            onSubmit={async (data, productId) => {
                              try {
                                const res = await fetch(
                                  "http://localhost:3000/api/orders",
                                  {
                                    method: "post",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      productId: productId,
                                      quantity: data.quantity,
                                    }),
                                  },
                                );
                                const result = await res.json();
                                if (!res.ok) {
                                  alert(result.message);
                                  return;
                                }

                                alert("発注完了");
                              } catch (error) {
                                console.error(error);
                              }
                            }}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <button className="px-2 py-2 rounded-sm cursor-pointer text-white bg-[#5ed712]">
                      詳細
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ページネーション */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            {table.getFilteredRowModel().rows.length} 件中{" "}
            {pagination.pageIndex * pagination.pageSize + 1}–
            {Math.min(
              (pagination.pageIndex + 1) * pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}
            件を表示
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 border rounded disabled:opacity-40"
            >
              ⏮
            </button>

            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 border rounded disabled:opacity-40"
            >
              ◀
            </button>

            <span className="text-sm">
              {pagination.pageIndex + 1} / {table.getPageCount()}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1 border rounded disabled:opacity-40"
            >
              ▶
            </button>

            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1 border rounded disabled:opacity-40"
            >
              ⏭
            </button>
          </div>
        </div>

        <select
          value={pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size} 件
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default AllStoredItemsTable;
