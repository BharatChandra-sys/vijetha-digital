import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

export default function ResetLinkSent() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      leftTag="ACCOUNT RECOVERY"
      leftTitle="Check Your Email"
      leftSubtitle="We’ve sent a secure password reset link to your registered email address."
    >
      <div className="w-full max-w-md text-center">

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[#EDE9FE] flex items-center justify-center">
            <span className="material-symbols-outlined text-plum-deep text-3xl">
              mail
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-text-dark mb-4">
          Reset <span className="relative inline-block">
            Link Sent
            <span className="absolute left-0 bottom-[-3px] w-full h-[3px] bg-coral-accent"></span>
          </span>
        </h2>

        {/* Description */}
        <p className="text-text-muted mb-8">
          Please check your inbox and follow the instructions to reset your password.
          If you don’t see the email, check your spam folder.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-plum-deep text-white py-4 rounded-lg font-bold shadow-soft-plum hover:bg-[#2D244C] transition-all"
        >
          Back to Sign In
        </button>

      </div>
    </AuthLayout>
  );
}
