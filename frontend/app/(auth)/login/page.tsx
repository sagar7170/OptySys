"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

import { MdOutlineEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { BiKey } from "react-icons/bi";

import FormWrapper from "@/components/auth/FormWrapper";

import { LoginFormData } from "@/types/auth";
import { login } from "@/http";

import useUserStore from "@/stores/user";

export default function Home() {
  const { setUser } = useUserStore();
  const [formData, setFormData] = useState<LoginFormData>({} as LoginFormData);

  const router = useRouter();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // checks for formdata
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data } = await Promise.resolve(await login(formData));
      setUser(data);
      toast.success("Successfully logged in");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  }

  function setShowPassword(name: string) {
    setFormData({ ...formData, [name]: !formData[name] });
  }

  return (
    <FormWrapper
      title="Login"
      subtitle="Login to manage your account"
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-[10px] w-full">
        <div className="relative w-full h-full">
          <MdOutlineEmail className="absolute text-xl top-[14px] left-2 text-gray-400" />
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            className="outline-none border-[1px] px-9 py-[10px] rounded focus:border-gray-400 w-full h-full text-gray-500 placeholder:text-sm"
            onChange={onChange}
          />
        </div>

        <div className="relative w-full h-full">
          <BiKey className="absolute text-2xl top-[10px] left-2 text-gray-400" />
          <input
            name="password"
            type={formData.showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="outline-none border-[1px] px-9 py-[10px] rounded focus:border-gray-400 w-full h-full text-gray-500 placeholder:text-sm"
            minLength={3}
            onChange={onChange}
          />
          {formData.showPassword ? (
            <MdVisibility
              name="showPassword"
              onClick={() => setShowPassword("showPassword")}
              className="cursor-pointer absolute text-xl top-3 right-2 text-gray-400"
            />
          ) : (
            <MdVisibilityOff
              name="showPassword"
              onClick={() => setShowPassword("showPassword")}
              className="cursor-pointer absolute text-xl top-3 right-2 text-gray-400"
            />
          )}
        </div>
      </div>

      <div className="text-gray-500 absolute -bottom-10 flex flex-col items-center justify-start gap-4 w-full">
        <div className="flex flex-row gap-2  text-sm">
          <span>Don&apos;t have an account?</span>
          <Link
            href="/register"
            className="text-blue-500 underline underline-offset-2"
          >
            Register
          </Link>
        </div>
      </div>
    </FormWrapper>
  );
}
