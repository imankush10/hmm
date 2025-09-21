"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// Swapped Leaf for Atom for a more technical/scientific feel
import { Eye, EyeOff, Lock, Mail, Atom } from "lucide-react";
import Image from "next/image";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        const session = await getSession();
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { role: "Admin", email: "admin@lcaplatform.com", password: "admin123" },
    { role: "User", email: "user@lcaplatform.com", password: "user123" },
    {
      role: "Analyst",
      email: "analyst@lcaplatform.com",
      password: "analyst123",
    },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      <Image
        src="https://raw.githubusercontent.com/imankush10/taki-taki-thon/refs/heads/master/public/frames/frame_0001.jpg"
        alt="Background"
        fill
        className="absolute inset-0 w-full h-full object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/70" />
      {/* MODIFICATION: Combined form and demo credentials into one "glassmorphism" card */}
      <div className="relative max-w-md w-full space-y-8 bg-neutral-900/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-neutral-700">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Dhatu Chakra</h1>
          <p className="text-gray-400 mt-2">
            Advanced Life Cycle Assessment for metal industries.
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
              {/* MODIFICATION: Subtler input field styling */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-800/60 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-neutral-800/60 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* MODIFICATION: More subtle error styling */}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* MODIFICATION: Button color and style updated to match the landing page's sophisticated feel */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-600/40"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* MODIFICATION: Integrated demo credentials into the same card */}
        <div>
          <hr className="my-6 border-neutral-700" />
          <h3 className="text-center text-sm font-medium text-gray-400 mb-4">
            Or use a demo account
          </h3>
          <div className="space-y-3">
            {demoCredentials.map((cred, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-neutral-800/70 rounded-lg"
              >
                <div>
                  <div className="font-medium text-white">{cred.role}</div>
                  <div className="text-sm text-gray-400">{cred.email}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(cred.password);
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
