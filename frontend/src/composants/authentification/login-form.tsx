"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
import axios from "axios";
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
  const [formData, setFormData] = useState({
    admin_email: "",
    admin_mdp: "",
  });
  const [errors, setErrors] = useState<{
    admin_email?: string;
    admin_mdp?: string;
  }>({});
  const [message, setMessage] = useState("");

  // ✅ Validation des champs
  const validate = () => {
    const newErrors: typeof errors = {};
    const emailError = validateEmail(formData.admin_email);
    const passwordError = validatePassword(formData.admin_mdp);

    if (emailError) newErrors.admin_email = emailError;
    if (passwordError) newErrors.admin_mdp = passwordError;

    return newErrors;
  };

  // // ✅ Connexion
  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const validationErrors = validate();

  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }

  //   try {
  //     const res = await axios.post(
  //       "http://localhost:3001/api/admins/login",
  //       formData,
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );

  //     // ✅ Stocker le token JWT
  //     localStorage.setItem("token", res.data.token);
  //     setMessage("Connexion réussie ✅");

  //     // Optionnel : redirection
  //     window.location.href = "/dashboard";
  //   } catch (err: any) {
  //     console.error("Erreur de connexion:", err);
  //     setMessage(err.response?.data?.message || "Erreur de connexion");
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3001/api/admins/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // ✅ Stocker le token JWT
      localStorage.setItem("token", res.data.token);

      // ✅ Stocker les informations de l'utilisateur
      localStorage.setItem(
        "user",
        JSON.stringify({
          nom: res.data.admin.nom,
          prenom: res.data.admin.prenom,
          email: res.data.admin.email,
        })
      );

      setMessage("Connexion réussie ✅");

      // 🔹 Redirection vers le dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setMessage(err.response?.data?.message || "Erreur de connexion");
    }
  };

  // ✅ Mise à jour des champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <FormCard title="Connexion">
      <form onSubmit={handleLogin}>
        <FormInput
          label="Email"
          type="email"
          name="admin_email"
          value={formData.admin_email}
          onChange={handleChange}
          error={errors.admin_email}
          icon={Mail}
          placeholder="exemple@email.com"
        />

        <PasswordInput
          label="Mot de passe"
          name="admin_mdp"
          value={formData.admin_mdp}
          onChange={handleChange}
          error={errors.admin_mdp}
        />

        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={onSwitchToForgot}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </div>

        <AuthButton type="submit">Se connecter</AuthButton>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}

      <p className="mt-6 text-center text-gray-600 text-sm">
        Pas encore de compte ?{" "}
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
