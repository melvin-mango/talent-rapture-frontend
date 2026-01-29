"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send reset email");
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Forgot Password?</h1>
          <p className="text-gray-600 text-sm">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">✓ Email sent successfully!</p>
            <p className="text-sm mt-2">
              Check your email for a password reset link. The link will expire in 1 hour.
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF7F00] focus:ring-1 focus:ring-[#FF7F00]"
              disabled={loading || success}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full px-4 py-2.5 bg-[#FF7F00] text-black font-bold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Sending..." : "Send Reset Link"}
            <Mail size={18} />
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link href="/">
            <button className="flex items-center justify-center gap-2 text-[#FF7F00] hover:text-orange-600 font-medium text-sm w-full">
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </Link>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Remember your password?{" "}
          <button
            onClick={() => router.push("/")}
            className="text-[#FF7F00] hover:text-orange-600 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
