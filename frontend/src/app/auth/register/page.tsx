"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useGoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const router = useRouter();
  const { login: setAuth } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!/^03\d{9}$/.test(form.phone)) {
      toast.error("Phone must be Pakistani format: 03XXXXXXXXX");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      await setAuth({ email: form.email, password: form.password });
      toast.success(
        "Account created! Please check your email to verify your account.",
      );
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
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

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        useAuthStore.setState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });

        toast.success("Account created with Google!");
        router.push("/");
      } catch (err) {
        toast.error("Google registration failed.");
      }
    },
    onError: () => toast.error("Google registration failed."),
  });

  return (
    <div
      className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4"
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
            Create Account
          </h1>
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: "#7a6a54" }}
          >
            Join our exclusive community
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
          {[
            {
              label: "Full Name",
              key: "name",
              type: "text",
              placeholder: "Muhammad Ali",
            },
            {
              label: "Email Address",
              key: "email",
              type: "email",
              placeholder: "your@email.com",
            },
            {
              label: "Phone Number",
              key: "phone",
              type: "tel",
              placeholder: "03001234567",
            },
          ].map((f) => (
            <div key={f.key}>
              <label
                className="block text-[10px] uppercase tracking-[0.1em] mb-2"
                style={{ color: "#c8a96e" }}
              >
                {f.label}
              </label>
              <input
                type={f.type}
                value={(form as any)[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full bg-transparent border-b border-[rgba(200,169,110,0.2)] text-[#f0e4ce] py-2 focus:outline-none focus:border-[#c8a96e] transition-colors font-light placeholder:text-[#7a6a54]"
                placeholder={f.placeholder}
                required
              />
            </div>
          ))}

          {[
            { label: "Password", key: "password" },
            { label: "Confirm Password", key: "confirmPassword" },
          ].map((f) => (
            <div key={f.key}>
              <label
                className="block text-[10px] uppercase tracking-[0.1em] mb-2"
                style={{ color: "#c8a96e" }}
              >
                {f.label}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={(form as any)[f.key]}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-[rgba(200,169,110,0.2)] text-[#f0e4ce] py-2 focus:outline-none focus:border-[#c8a96e] transition-colors font-light placeholder:text-[#7a6a54] pr-10"
                  placeholder="••••••••"
                  required
                />
                {f.key === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors hover:text-[#c8a96e]"
                    style={{ color: "#7a6a54" }}
                  >
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300 disabled:opacity-50 hover:-translate-y-1"
            style={{ background: "#c8a96e", color: "#0f0e0c" }}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <div className="relative py-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(200,169,110,0.1)]"></div>
            </div>
            <div
              className="relative px-4 text-[10px] uppercase tracking-widest"
              style={{ background: "#161412", color: "#7a6a54" }}
            >
              Or sign up with
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
            Already have an account?{" "}
            <Link
              href="/auth/login"
              style={{ color: "#c8a96e" }}
              className="hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
