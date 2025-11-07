"use client";

import type React from "react";
import { useState } from "react";
import { Mail, User } from "lucide-react";
import {
  validateEmail,
  validateName,
  validatePasswordStrong,
} from "../../lib/validation";
import { FormCard } from "../ui/Form-card";
import { FormInput } from "../ui/Form-input";
import { PasswordInput } from "../ui/Password-input";
import { AuthButton } from "../ui/Button";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePasswordStrong(formData.password);

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      console.log("Inscription avec:", formData);
      alert("Inscription réussie!");
    } else {
      setErrors(validationErrors);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <FormCard title="Inscription">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Nom complet"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon={User}
          placeholder="Jean Dupont"
        />

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

        <PasswordInput
          label="Confirmer le mot de passe"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <AuthButton type="submit">S'inscrire</AuthButton>
      </form>

      <p className="mt-6 text-center text-gray-600 text-sm">
        Déjà un compte?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
        >
          Se connecter
        </button>
      </p>
    </FormCard>
  );
};
