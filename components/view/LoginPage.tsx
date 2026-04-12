"use client";
import AuthButton from "@/components/ui/AuthButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const session = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/");
    }
  }, [session.status, router]);
  return (
    <>
      <div className="pt-16">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>ログインフォーム</CardTitle>
            <CardDescription>
              アプリを使用するにはユーザーログインが必要です
            </CardDescription>
            <CardAction>
              <Link href="/signup" className="font-bold">
                ユーザー登録はこちら
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">パスワード</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      パスワードを忘れた方はこちら
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-[70%]"
              onClick={() =>
                signIn("credentials", {
                  email: email,
                  password: password,
                  redirect: false,
                })
              }
            >
              ログイン
            </Button>
            <Button
              className="w-[70%] bg-green-300 hover:bg-green-300/80 text-black"
              onClick={() => signIn("google")}
            >
              Googleでログイン
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
