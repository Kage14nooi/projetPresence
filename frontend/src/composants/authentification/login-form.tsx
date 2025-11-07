"use client";

import type React from "react";
import { useState } from "react";
import { Mail } from "lucide-react";
import { validateEmail, validatePassword } from "../../lib/validation";
import { FormCard } from "../ui/Form-card";
import { FormInput } from "../ui/Form-input";
import { PasswordInput } from "../ui/Password-input";
import { AuthButton } from "../ui/Button";

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onSwitchToForgot: () => void;
}

export const LoginForm = ({
  onSwitchToSignup,
  onSwitchToForgot,
}: LoginFormProps) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: typeof errors = {};
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      console.log("Connexion avec:", formData);
      alert("Connexion réussie!");
    } else {
      setErrors(validationErrors);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <FormCard title="Connexion">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          placeholder="exemple@email.com"
        />

        <PasswordInput
          label="Mot de passe"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={onSwitchToForgot}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Mot de passe oublié?
          </button>
        </div>

        <AuthButton type="submit">Se connecter</AuthButton>
      </form>

      <p className="mt-6 text-center text-gray-600 text-sm">
        Pas encore de compte?{" "}
        <button
          onClick={onSwitchToSignup}
          className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
        >
          S'inscrire
        </button>
      </p>
    </FormCard>
  );
};
