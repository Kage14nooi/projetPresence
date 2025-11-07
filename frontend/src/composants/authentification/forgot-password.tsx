"use client";

import type React from "react";
import { useState } from "react";
import { Mail } from "lucide-react";
import { FormCard } from "../ui/Form-card";
import { FormInput } from "../ui/Form-input";
import { AuthButton } from "../ui/Button";
import { validateEmail } from "../../lib/validation";

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ForgotPasswordForm = ({
  onSwitchToLogin,
}: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);

    if (!validationError) {
      console.log("Réinitialisation pour:", email);
      setSuccess(true);
      setError("");
    } else {
      setError(validationError);
      setSuccess(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  return (
    <FormCard
      title="Mot de passe oublié"
      subtitle="Entrez votre email pour recevoir un lien de réinitialisation"
    >
      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            Un email de réinitialisation a été envoyé à <strong>{email}</strong>
            . Vérifiez votre boîte de réception.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            error={error}
            icon={Mail}
            placeholder="exemple@email.com"
          />

          <AuthButton type="submit">Envoyer le lien</AuthButton>
        </form>
      )}

      <p className="mt-6 text-center text-gray-600 text-sm">
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
        >
          ← Retour à la connexion
        </button>
      </p>
    </FormCard>
  );
};
