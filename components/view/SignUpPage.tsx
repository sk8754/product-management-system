"use client";
import React, { FormEvent, useState } from "react";
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
import Link from "next/link";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUpPage = () => {
  const signUpSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z
      .string()
      .min(8, "最低8文字以上にしてください")
      .regex(/[A-Z]/, "大文字を1文字以上含めてください")
      .regex(/[a-z]/, "小文字を1文字以上含めてください")
      .regex(/[0-9]/, "数字を1文字以上含めてください")
      .regex(/[\W_]/, "記号を1文字以上含めてください"),
  });

  type formData = z.infer<typeof signUpSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<formData>({
    resolver: zodResolver(signUpSchema),
  });

  const submitHandler = async (data: formData) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="pt-16">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>ユーザー登録</CardTitle>
            <CardDescription>
              アプリを利用するにはユーザー登録が必要です
            </CardDescription>
            <CardAction>
              <Link href="/login" className="font-bold">
                ログインページはこちら
              </Link>
            </CardAction>
          </CardHeader>
          <form onSubmit={handleSubmit(submitHandler)}>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">名前</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="山田太郎"
                    {...register("name")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">パスワード</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 mt-4">
              <Button type="submit" className="w-[60%]">
                登録
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
};

export default SignUpPage;
