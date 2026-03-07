import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

const GOOGLE_LOGO = (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const SPINNER = (
  <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/**
 * Must only be rendered when GoogleOAuthProvider is present in the tree.
 * Wrap usage in a conditional: {GOOGLE_CONFIGURED && <GoogleSignInButton ... />}
 */
export default function GoogleSignInButton({ onSuccess, onError, label = "Sign in with Google", className = "" }) {
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        await onSuccess(tokenResponse.access_token);
      } catch (err) {
        onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    onError: (err) => {
      setLoading(false);
      onError?.(err);
    },
  });

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-3 bg-white border py-4 rounded-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? SPINNER : GOOGLE_LOGO}
      <span className="font-medium">{loading ? "Signing in…" : label}</span>
    </button>
  );
}
