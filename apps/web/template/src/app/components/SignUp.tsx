"use client"; // Necessary for Next.js if using client-side navigation
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Logo from "./Logo";
import Footer from "./Footer";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3001/SignUp", { // ✅ Fixed API URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Server returned an error");
      }

      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Error connecting to server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F6F6EB]">
      <Logo />
      <p className="text-3xl font-normal mb-6">Make the most of your professional life</p>

      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-400 rounded mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-400 rounded mt-1 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="mb-4 flex items-center">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-gray-700">Remember me</label>
          </div>

          {/* Error & Success Messages */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Agree & Join
          </button>
        </form>

        {/* Separator */}
        <div className="my-4 text-center text-gray-500">or</div>

        {/* Continue with Google */}
        <button className="w-full flex items-center justify-center border py-2 rounded mb-2 hover:bg-gray-200">
          <img src="/google.jpg" alt="Google" className="w-5 h-5 mr-2" />
          Continue with Google
        </button>

        {/* Continue with Microsoft */}
        <button className="w-full flex items-center justify-center border py-2 rounded hover:bg-gray-200">
          <img src="/microsoft.png" alt="Microsoft" className="w-5 h-5 mr-2" />
          Continue with Microsoft
        </button>

        {/* Already have an account? */}
        <p className="mt-4 text-center text-sm">
          Already on LinkedIn? <a href="#" className="text-blue-600 hover:underline">Sign in</a>
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default SignUp;
