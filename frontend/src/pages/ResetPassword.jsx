import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const portals = [
    {
      id: "admin",
      title: "Admin Account",
      description: "Request a new admin account password reset link",
      icon: "admin_panel_settings",
      path: "/admin/forgot-password",
      accentColor: "#FF6B5E",
    },
    {
      id: "staff",
      title: "Staff Account",
      description: "Request a new staff workspace password reset link",
      icon: "work",
      path: "/staff/forgot-password",
      accentColor: "#3B2F63",
    },
    {
      id: "customer",
      title: "Customer Account",
      description: "Request a new customer account password reset link",
      icon: "person",
      path: "/forgot-password",
      accentColor: "#6B7280",
    },
  ];

  // If no token, show portal selector to choose which reset link they need
  if (!token) {
    return (
      <AuthLayout
        leftTag="ACCOUNT RECOVERY"
        leftTitle="Select Your Portal"
        leftSubtitle="Choose which account type you'd like to reset."
      >
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-2">
            Reset{" "}
            <span className="relative inline-block">
              Password
              <span className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-[#FF6B5E]" />
            </span>
          </h2>

          <p className="text-sm text-[#6E6E73] mb-8">
            Lost your reset link? Select your account type to request a new one.
          </p>

          {/* Portal Cards */}
          <div className="space-y-4">
            {portals.map((portal) => (
              <button
                key={portal.id}
                onClick={() => navigate(portal.path)}
                className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#F8F7F4] to-[#F0EEEB] border-2 border-[#E6E3DD] hover:border-[#FF6B5E] p-6 transition-all hover:shadow-lg hover:scale-[1.01]"
              >
                {/* Corner accent line */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#FF6B5E]/10 to-transparent rounded-br-2xl" />

                <div className="relative flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                    style={{
                      backgroundColor: portal.accentColor + "15",
                      border: `2px solid ${portal.accentColor}`,
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ color: portal.accentColor }}
                    >
                      {portal.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="font-bold text-[#1C1C1C] text-lg mb-1 group-hover:text-[#FF6B5E] transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-sm text-[#6E6E73] mb-3">{portal.description}</p>

                    {/* CTA */}
                    <div className="inline-flex items-center gap-1 text-sm font-semibold text-[#3B2F63] group-hover:text-[#FF6B5E] transition-colors">
                      <span>Request New Link</span>
                      <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Security Note */}
          <div className="mt-8 p-4 rounded-lg bg-[#F0EEEB] border border-[#E6E3DD]">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-[#3B2F63] flex-shrink-0">security</span>
              <p className="text-xs text-[#6E6E73]">
                Password reset links expire after 1 hour for security. Your email address will be verified before processing.
              </p>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // If token is provided, redirect to the new reset password page with token as query param
  // This handles old reset links gracefully by converting :token to ?token=...
  navigate(`/reset-password?token=${encodeURIComponent(token)}`);
  
  return null;
}
