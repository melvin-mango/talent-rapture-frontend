"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
      setTokenValid(false);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Invalid Reset Link</p>
            <p className="text-sm mt-2">
              This reset link is invalid or has expired. Please request a new one.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/forgot-password")}
              className="w-full px-4 py-2.5 bg-[#FF7F00] text-black font-bold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Request New Link
            </button>
            <Link href="/">
              <button className="w-full flex items-center justify-center gap-2 text-[#FF7F00] hover:text-orange-600 font-medium">
                <ArrowLeft size={16} />
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Reset Password</h1>
          <p className="text-gray-600 text-sm">
            Enter your new password below.
          </p>
        </div>

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">✓ Password reset successfully!</p>
            <p className="text-sm mt-2">
              You can now log in with your new password.
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : null}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF7F00] focus:ring-1 focus:ring-[#FF7F00]"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF7F00] focus:ring-1 focus:ring-[#FF7F00]"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-[#FF7F00] text-black font-bold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Resetting..." : "Reset Password"}
              <Lock size={18} />
            </button>
          </form>
        )}

        {/* Back to Login */}
        {success && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-4">
              Redirecting to login in 2 seconds...
            </p>
            <Link href="/">
              <button className="flex items-center justify-center gap-2 text-[#FF7F00] hover:text-orange-600 font-medium w-full">
                <ArrowLeft size={16} />
                Go to Home Now
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
