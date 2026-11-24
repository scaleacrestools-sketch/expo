export function validateName(value) {
  const v = value.trim();
  if (!v) return 'Name is required';
  if (/\d/.test(v)) return 'Name cannot contain numbers';
  return /^[a-zA-Z\s'.-]+$/.test(v) ? '' : 'Name can only contain letters';
}

export function validateEmail(value) {
  const v = value.trim();
  if (!v) return 'Email is required';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address';
}

export function validatePhone(value) {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 'Phone number is required';
  return digits.length === 10 ? '' : 'Enter a valid phone number';
}

export const sanitizeName = (v) => v.replace(/[0-9]/g, '');
export const sanitizePhone = (v) => v.replace(/\D/g, '').slice(0, 10);
