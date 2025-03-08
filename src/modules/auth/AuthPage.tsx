// src/modules/auth/AuthPage.tsx
import React from "react";
import LoginForm from "../../components/auth/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm";

const AuthPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      {/* TODO: Toggle between LoginForm and RegisterForm based on user action */}
      <LoginForm />
    </div>
  );
};

export default AuthPage;
