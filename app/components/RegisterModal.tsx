"use client";
import { useState } from "react";
import { X, Chrome } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError("");
      // Show success toast immediately before redirect
      toast.success("Signing up with Google...");
      const result = await signIn("google", { 
        redirect: true,
        callbackUrl: "/"
      });
      
      if (result?.error) {
        const errorMsg = result.error || "Google sign-up failed";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMessage = "An error occurred during Google sign-up";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Google sign-up error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      const errorMsg = "All fields are required";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = "Passwords do not match";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (formData.password.length < 6) {
      const errorMsg = "Password must be at least 6 characters";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || result.message || "Registration failed";
        console.error("Registration error:", {
          status: response.status,
          error: errorMsg,
        });
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Auto login after registration using NextAuth
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (!signInResult?.ok) {
        const errorMsg = "Registration successful but login failed. Please sign in manually.";
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success("Registration successful! Welcome to Talent Rapture");
      onClose();
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });

      // Redirect to home page
      router.push("/");
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during registration";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-xl my-8 sm:my-0 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X size={24} className="text-gray-600" />
        </button>

        {/* Header */}
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">Join Us</h2>
          <p className="text-gray-600 text-xs sm:text-sm">Create your account to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-black mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF7F00] focus:ring-1 focus:ring-[#FF7F00]"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-black mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF7F00] focus:ring-1 focus:ring-[#FF7F00]"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-black mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF7F00] focus:ring-1 focus:ring-[#FF7F00]"
              placeholder="john@example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-black mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF7F00] focus:ring-1 focus:ring-[#FF7F00]"
              placeholder="••••••"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs sm:text-sm font-medium text-black mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF7F00] focus:ring-1 focus:ring-[#FF7F00]"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#FF7F00] text-black font-bold text-sm sm:text-base rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button type="button" className="text-[#FF7F00] font-semibold hover:underline">
              Sign In
            </button>
          </p>
        </form>

        {/* Divider */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 flex-shrink-0">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-xs sm:text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Sign In */}
        <div className="px-4 sm:px-6 pb-6 flex-shrink-0">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:border-[#FF7F00] hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome size={18} className="text-gray-700" />
            <span className="text-gray-700 font-medium">
              {loading ? "Connecting..." : "Continue with Google"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
