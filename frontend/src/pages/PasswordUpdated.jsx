import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

export default function PasswordUpdated() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      leftTag="WELCOME TO"
      leftTitle="Vijetha Digital"
      leftSubtitle="Where ideas turn into powerful print."
    >
      <div className="w-full max-w-md text-center">

        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[#DFF3EC] flex items-center justify-center">
            <span className="material-symbols-outlined text-green-600 text-3xl">
              check
            </span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-text-dark mb-4">
          Password <span className="relative inline-block">
            Updated
            <span className="absolute left-0 bottom-[-3px] w-full h-[3px] bg-coral-accent"></span>
          </span>
        </h2>

        <p className="text-text-muted mb-8">
          Your password has been successfully reset. You can now log in securely with your new credentials.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-[#3B2F63] text-white py-4 rounded-lg font-bold shadow-lg hover:bg-[#2D244C]"

        >
          Back to Sign In
        </button>

      </div>
    </AuthLayout>
  );
}
