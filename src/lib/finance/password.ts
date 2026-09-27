export type PasswordIssue =
  | "min"
  | "upper"
  | "lower"
  | "number"
  | "special";

export function passwordIssues(password: string): PasswordIssue[] {
  const issues: PasswordIssue[] = [];
  if (password.length < 8) issues.push("min");
  if (!/[A-ZÀ-Ý]/.test(password)) issues.push("upper");
  if (!/[a-zà-ÿ]/.test(password)) issues.push("lower");
  if (!/\d/.test(password)) issues.push("number");
  if (!/[^A-Za-z0-9]/.test(password)) issues.push("special");
  return issues;
}

export function isStrongPassword(password: string): boolean {
  return passwordIssues(password).length === 0;
}

export const PASSWORD_HINTS: Record<PasswordIssue, string> = {
  min: "pelo menos 8 caracteres",
  upper: "uma letra maiúscula",
  lower: "uma letra minúscula",
  number: "um número",
  special: "um caractere especial",
};

export function passwordHintText(password: string): string {
  const issues = passwordIssues(password);
  if (issues.length === 0) return "Senha forte";
  return `A senha precisa ter ${issues.map((i) => PASSWORD_HINTS[i]).join(", ")}.`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isValidPhone(phone: string): boolean {
  const digits = normalizePhone(phone);
  return digits.length >= 10 && digits.length <= 13;
}
