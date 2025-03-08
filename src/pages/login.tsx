// src/pages/login.tsx
import React from "react";
import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

const Login: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
