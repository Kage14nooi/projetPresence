export const validateEmail = (email: string): string => {
  if (!email) return "L'email est requis";
  if (!/\S+@\S+\.\S+/.test(email)) return "Format d'email invalide";
  return "";
};

export const validatePassword = (password: string, minLength = 6): string => {
  if (!password) return "Le mot de passe est requis";
  if (password.length < minLength)
    return `Le mot de passe doit contenir au moins ${minLength} caractères`;
  return "";
};

export const validatePasswordStrong = (password: string): string => {
  const basicError = validatePassword(password, 8);
  if (basicError) return basicError;
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
    return "Le mot de passe doit contenir majuscule, minuscule et chiffre";
  return "";
};

export const validateName = (name: string): string => {
  if (!name) return "Le nom est requis";
  if (name.length < 2) return "Le nom doit contenir au moins 2 caractères";
  return "";
};
