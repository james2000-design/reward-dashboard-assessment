import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState("");

  const signIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const signUp = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setError("Check your email for the confirmation link!");
      // Optionally switch back to login view after successful signup
      // setIsLoginView(true);
    }
    setLoading(false);
  };

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12">
        {/* Header section - changes based on view */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">
            {isLoginView ? "Log in to flowva" : "Create Your Account"}
          </h1>
          <p className="text-gray-600 text-base">
            {isLoginView
              ? "Log in to receive personalized recommendations"
              : "Sign up to manage your tools"}
          </p>
        </div>

        {/* Form section */}
        <div className="">
          {error && (
            <div
              className={`mb-6 p-3 rounded-lg text-center text-sm font-medium ${
                error.includes("Check your email")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Email input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  isLoginView ? "user@example.com" : "your@email.com"
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-gray-50"
                disabled={loading}
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-16 border border-gray-200 rounded-lg
                 focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                 outline-none transition bg-gray-50"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                 text-sm text-purple-600 font-medium
                 hover:text-purple-800 transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {!isLoginView && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-16 border border-gray-200 rounded-lg
                 focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                 outline-none transition bg-gray-50"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                 text-sm text-purple-600 font-medium
                 hover:text-purple-800 transition"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            {isLoginView && (
              <div className="text-right -mt-2">
                <a
                  href="#"
                  className="text-sm text-purple-600 hover:text-purple-800 transition font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Forgot password clicked");
                  }}
                >
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              onClick={isLoginView ? signIn : signUp}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 px-4 rounded-full transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading
                ? isLoginView
                  ? "Signing In..."
                  : "Creating Account..."
                : isLoginView
                ? "Sign in"
                : "Sign up Account"}
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-200 w-full"></div>
              <span className="absolute bg-white px-4 text-gray-500 text-sm">
                or
              </span>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleSignInWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            <div className="text-center pt-2">
              <p className="text-gray-600">
                {isLoginView
                  ? "Don't have an account?"
                  : "Already have an account"}{" "}
                <button
                  onClick={() => {
                    resetForm();
                    setIsLoginView(!isLoginView);
                  }}
                  disabled={loading}
                  className="text-purple-600 hover:text-purple-800 font-semibold transition"
                >
                  {isLoginView ? "Sign up" : "Log In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
