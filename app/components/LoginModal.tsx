"use client";
import { useState } from "react";
import { X, Chrome, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      // Use NextAuth signIn with credentials
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (!signInResult?.ok) {
        setError("Login failed. Please check your credentials.");
        toast.error("Login failed. Please check your credentials.");
        return;
      }

      toast.success("Login successful! Welcome back");
      onClose();
      setFormData({
        email: "",
        password: "",
      });

      // Redirect to home page
      router.push("/");
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during login";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      // Show success toast immediately before redirect
      toast.success("Logging in with Google...");
      const result = await signIn("google", {
        redirect: true,
        callbackUrl: "/"
      });
      
      if (result?.error) {
        const errorMsg = result.error || "Google sign-in failed";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMessage = "An error occurred during Google sign-in";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Google sign-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-xl my-8 sm:my-0 flex flex-col max-h-[90vh] text-black">
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
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">Sign In</h2>
          <p className="text-gray-600 text-xs sm:text-sm">Welcome back to Talent Rapture</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

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
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs sm:text-sm font-medium text-black mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF7F00] focus:ring-1 focus:ring-[#FF7F00]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 text-xs sm:text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
              />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-[#FF7F00] hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#FF7F00] text-black font-bold text-sm sm:text-base rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <button type="button" className="text-[#FF7F00] font-semibold hover:underline">
              Join Us
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
            onClick={handleGoogleSignIn}
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
