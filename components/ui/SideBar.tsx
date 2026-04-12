"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const SideBar = () => {
  const { data: session } = useSession();
  return (
    <>
      <div className="fixed w-[15%] flex flex-col justify-between h-screen bg-sky-900">
        <div>
          {/* ロゴとタイトル */}
          <div className="flex gap-4 items-center py-[1.8rem] border-b pl-4 bg-[#1c9999]">
            <img alt="ロゴ" />
            <h1 className="font-bold text-[1.2rem]">在庫管理アプリ</h1>
          </div>

          {/* サイドバーメニュー */}
          <ul className="pl-4">
            <li className="py-4">
              <Link
                href={"/"}
                className="flex items-center gap-4 cursor-pointer"
              >
                <img alt="icon" />
                <p className="text-[1.2rem] text-white">在庫状況</p>
              </Link>
            </li>
            <li className="py-4">
              <Link
                href={"/product"}
                className="flex items-center gap-4 cursor-pointer"
              >
                <img alt="icon" />
                <p className="text-[1.2rem] text-white">商品管理</p>
              </Link>
            </li>
            <li className="py-4">
              <Link
                href={"/order"}
                className="flex items-center gap-4 cursor-pointer"
              >
                <img alt="icon" />
                <p className="text-[1.2rem] text-white">発注管理</p>
              </Link>
            </li>
            <li className="py-4">
              <Link
                href={"/trail"}
                className="flex items-center gap-4 cursor-pointer"
              >
                <img alt="icon" />
                <p className="text-[1.2rem] text-white">入出庫履歴</p>
              </Link>
            </li>
            <li className="py-4">
              <Link
                href={"/report"}
                className="flex items-center gap-4 cursor-pointer"
              >
                <img alt="icon" />
                <p className="text-[1.2rem] text-white">レポート</p>
              </Link>
            </li>
            <li className="py-4">
              <Link
                href={"/setting"}
                className="flex items-center gap-4 cursor-pointer"
              >
                <img alt="icon" />
                <p className="text-[1.2rem] text-white">設定</p>
              </Link>
            </li>
          </ul>
        </div>

        {/* ログインユーザー */}
        {session ? (
          <div className="py-8 border-t border-t-white">
            <ul className="pl-4">
              <li className="flex items-center gap-4">
                <div>
                  <img alt="ユーザー画像" />
                </div>
                <div>
                  <p className="text-white">{session.user?.name}</p>
                  <p className="text-white">
                    {session.user.role === "ADMIN" ? "管理者" : "ゲスト"}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default SideBar;
