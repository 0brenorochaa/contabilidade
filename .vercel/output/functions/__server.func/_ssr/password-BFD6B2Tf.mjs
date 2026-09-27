//#region node_modules/.nitro/vite/services/ssr/assets/password-BFD6B2Tf.js
function passwordIssues(password) {
	const issues = [];
	if (password.length < 8) issues.push("min");
	if (!/[A-ZÀ-Ý]/.test(password)) issues.push("upper");
	if (!/[a-zà-ÿ]/.test(password)) issues.push("lower");
	if (!/\d/.test(password)) issues.push("number");
	if (!/[^A-Za-z0-9]/.test(password)) issues.push("special");
	return issues;
}
function isStrongPassword(password) {
	return passwordIssues(password).length === 0;
}
var PASSWORD_HINTS = {
	min: "pelo menos 8 caracteres",
	upper: "uma letra maiúscula",
	lower: "uma letra minúscula",
	number: "um número",
	special: "um caractere especial"
};
function passwordHintText(password) {
	const issues = passwordIssues(password);
	if (issues.length === 0) return "Senha forte";
	return `A senha precisa ter ${issues.map((i) => PASSWORD_HINTS[i]).join(", ")}.`;
}
function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function normalizePhone(phone) {
	return phone.replace(/\D/g, "");
}
function isValidPhone(phone) {
	const digits = normalizePhone(phone);
	return digits.length >= 10 && digits.length <= 13;
}
//#endregion
export { passwordHintText as a, normalizePhone as i, isValidEmail as n, isValidPhone as r, isStrongPassword as t };
