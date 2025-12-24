'use client'
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/loginForm";
import { useEffect } from "react";
import { isLoggedIn } from "../lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/users");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
