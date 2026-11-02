// Validar que el nombre empiece con mayúscula y solo tenga letras
export const validateName = (value: string): boolean => {
  const regex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/;
  return regex.test(value.trim());
};

// Validar email (debe tener @, dominio y extensión .com, .cu, etc.)
export const validateEmail = (value: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return regex.test(value.trim());
};

// Validar teléfono (solo números, guiones y espacios, mínimo 7 dígitos)
export const validatePhone = (value: string): boolean => {
  const regex = /^[\d\s\-+()]{7,20}$/;
  return regex.test(value.trim());
};

// Validar documento de identidad (DNI: 8 números, Pasaporte: alfanumérico)
export const validateDocNumber = (value: string, type: string): boolean => {
  if (type === 'DNI') {
    return /^\d{8}$/.test(value.trim()); // Exactamente 8 números
  }
  return /^[A-Z0-9]{6,15}$/i.test(value.trim()); // Alfanumérico para pasaporte
};

// Validar que sea un número positivo
export const validatePositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};