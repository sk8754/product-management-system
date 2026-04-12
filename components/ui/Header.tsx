"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Header = () => {
  const { data: session } = useSession();
  const url = usePathname();
  return (
    <>
      <header className="mb-32 ">
        {/* ヘッダーコンテナ */}
        <div className="fixed w-[85%] flex justify-between items-center px-8 bg-[#07c49e]">
          {/* ヘッダー左側の要素 */}
          <div className="flex gap-22">
            {/* タイトル */}
            <div className="py-2">
              {url === "/" && (
                <div>
                  <h1 className="font-bold text-[1.8rem]">在庫状況</h1>
                  <p className="font-light text-[1.2rem]">
                    リアルタイム在庫状況
                  </p>
                </div>
              )}

              {url === "/product" && (
                <div>
                  <h1 className="font-bold text-[1.8rem]">商品管理</h1>
                  <p className="font-light text-[1.2rem]">商品の詳細</p>
                </div>
              )}

              {url === "/order" && (
                <div>
                  <h1 className="font-bold text-[1.8rem]">発注管理</h1>
                  <p className="font-light text-[1.2rem]">商品の発注</p>
                </div>
              )}

              {url === "/trail" && (
                <div>
                  <h1 className="font-bold text-[1.8rem]">入出庫履歴</h1>
                  <p className="font-light text-[1.2rem]">商品の入出庫履歴</p>
                </div>
              )}

              {url === "/report" && (
                <div>
                  <h1 className="font-bold text-[1.8rem]">レポート</h1>
                  <p className="font-light text-[1.2rem]">売上データ</p>
                </div>
              )}

              {url === "/setting" && (
                <div>
                  <h1 className="font-bold text-[1.8rem]">設定</h1>
                  <p className="font-light text-[1.2rem]">各種設定</p>
                </div>
              )}

              {url === "/login" && (
                <div>
                  <h1 className="font-bold text-[1.8rem]">ログインページ</h1>
                  <p className="font-light text-[1.2rem]">
                    ログインしてください
                  </p>
                </div>
              )}

              {url === "/signup" && (
                <div>
                  <h1 className="font-bold text-[1.8rem]">ユーザー登録</h1>
                  <p className="font-light text-[1.2rem]">
                    アプリを利用するにはユーザー登録が必要です
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* ヘッダー右側の要素 */}
          <div className="flex gap-6">
            {/* アイコン2個 */}
            <div className="flex">
              {/* ベルアイコン */}
              <div>
                <a href="">
                  <img alt="ベル" />
                </a>
              </div>
            </div>

            {/* ボタン2個 */}
            <div className="flex gap-2">
              <div>
                <button className="py-2 px-4  rounded-xl cursor-pointer text-white bg-[#abe0e7d0]">
                  エクスポート
                </button>
              </div>

              {session ? (
                <div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="py-2 px-4 rounded-xl cursor-pointer text-white bg-linear-to-r from-[#ef5604] to-[#01ab75] block"
                  >
                    ログアウト
                  </button>
                </div>
              ) : (
                <div>
                  <Link
                    href={"/login"}
                    className="py-2 px-4 rounded-xl cursor-pointer text-white bg-linear-to-r from-[#ef5604] to-[#01ab75] block"
                  >
                    ログイン
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
