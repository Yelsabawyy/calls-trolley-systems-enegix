"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useOnlineNetwork } from "../../hooks/useOnlineNetwork";
import { db } from "../../lib/db";
import { comparePassword, loginUser } from "../../lib/auth";
import OnlineComponent from "../onlineComponent";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, { error: "Username is required" }),
  password: z.string().min(1, { error: "Password is required" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const isOnline: boolean = useOnlineNetwork();
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

const onSubmit = async (data: LoginFormData) => {
  const { username, password } = data;
  setLoading(true);
  setError(""); 
  if (isOnline) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Online login failed");

      loginUser(username, navigate);
      setLoading(false);
      return;
    } catch (error: unknown) {
      console.warn("Online login failed, trying ...", error);
    }
  }

  try {
    const user = await db.users.get({ username });
    if (!user) {
      setError("User not found ");
      setLoading(false);
      return;
    }

    const valid = await comparePassword(password, user.password);
    if (valid) {
      loginUser(username, navigate);
    } else {
      setError("Incorrect password");
    }
  } catch (err: unknown) {
    setError("Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-lg w-full bg-white p-8 rounded-3xl border-grey-900 border mx-2">
      <h2 className="text-2xl font-black mb-2">Login</h2>
      <div className="text-xs font-semibold mb-6">
        Calls trolley systems - Engenix
      </div>
      <OnlineComponent />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-red-500 mt-1 text-sm">{error}</p>
        <div className="text-left">
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="username"
            {...register("username")}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.username && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="text-left">
          <div className="flex flex-row justify-between">
            <label className=" mb-1 font-medium">Password</label>
            <label
              className="text-primary font-semibold text-sm mb-1  cursor-pointer"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              <div className="flex flex-row gap-2 items-center">{showPassword? <Eye size={16}/> : <EyeOff size={16}/>} Show</div>
              
            </label>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-fit px-12 text-white py-2 rounded-2xl bg-primary disabled:bg-[#007b897b]"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
