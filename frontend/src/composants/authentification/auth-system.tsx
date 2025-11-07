"use client";

import { useState } from "react";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { ForgotPasswordForm } from "./forgot-password";

type AuthView = "login" | "signup" | "forgot";

export const AuthSystem = () => {
  const [currentView, setCurrentView] = useState<AuthView>("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {currentView === "login" && (
        <LoginForm
          onSwitchToSignup={() => setCurrentView("signup")}
          onSwitchToForgot={() => setCurrentView("forgot")}
        />
      )}
      {currentView === "signup" && (
        <SignupForm onSwitchToLogin={() => setCurrentView("login")} />
      )}
      {currentView === "forgot" && (
        <ForgotPasswordForm onSwitchToLogin={() => setCurrentView("login")} />
      )}
    </div>
  );
};
