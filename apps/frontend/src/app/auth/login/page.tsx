"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import { useGoogleLogin } from "@react-oauth/google";
import api from "@/lib/api";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { login: setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setAuth(form);
      toast.success("Welcome back!");
      router.push(redirect);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await api.post("/auth/google", {
          token: response.access_token,
        });
        const { accessToken, refreshToken, user } = res.data.data;

        // Manual login using tokens returned from backend
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        useAuthStore.setState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });

        toast.success("Login successful with Google!");
        router.push(redirect);
      } catch (err) {
        toast.error("Google login failed. Please try again.");
      }
    },
    onError: () => toast.error("Google login failed."),
  });

  return (
    <div
      className="min-h-screen pt-20 flex items-center justify-center px-4"
      style={{ background: "#0a0907" }}
    >
      <div className="w-full max-w-md animate-scaleIn relative z-10">
        <div className="absolute inset-0 bg-[#c8a96e] blur-[150px] opacity-10 rounded-full -z-10" />

        <div className="text-center mb-10">
          <Link href="/">
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2rem",
                color: "#c8a96e",
                letterSpacing: "0.2em",
              }}
            >
              KAARVAN
            </span>
          </Link>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "3rem",
              color: "#f0e4ce",
            }}
            className="mt-4 mb-2 font-light"
          >
            Welcome Back
          </h1>
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: "#7a6a54" }}
          >
            Sign in to your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-10 rounded-sm"
          style={{
            background: "linear-gradient(145deg, #161412, #1a1815)",
            border: "1px solid rgba(200,169,110,0.1)",
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
          }}
        >
          <div>
            <label
              className="block text-[10px] uppercase tracking-[0.1em] mb-2"
              style={{ color: "#c8a96e" }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-transparent border-b border-[rgba(200,169,110,0.2)] text-[#f0e4ce] py-2 focus:outline-none focus:border-[#c8a96e] transition-colors font-light placeholder:text-[#7a6a54]"
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                className="block text-[10px] uppercase tracking-[0.1em]"
                style={{ color: "#c8a96e" }}
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[10px] uppercase tracking-wider text-[#7a6a54] hover:text-[#c8a96e] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-transparent border-b border-[rgba(200,169,110,0.2)] text-[#f0e4ce] py-2 focus:outline-none focus:border-[#c8a96e] transition-colors font-light placeholder:text-[#7a6a54] pr-10"
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors hover:text-[#c8a96e]"
                style={{ color: "#7a6a54" }}
              >
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300 disabled:opacity-50 hover:-translate-y-1"
            style={{ background: "#c8a96e", color: "#0f0e0c" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="relative py-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(200,169,110,0.1)]"></div>
            </div>
            <div
              className="relative px-4 text-[10px] uppercase tracking-widest"
              style={{ background: "#161412", color: "#7a6a54" }}
            >
              Or continue with
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 border border-[rgba(200,169,110,0.2)] transition-all duration-300 hover:bg-[rgba(200,169,110,0.05)] text-[#f0e4ce] text-sm"
          >
            <FcGoogle size={20} />
            <span className="font-light tracking-wide">Google</span>
          </button>

          <p
            className="text-center text-xs mt-6 uppercase tracking-wider"
            style={{ color: "#7a6a54" }}
          >
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              style={{ color: "#c8a96e" }}
              className="hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}


export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
