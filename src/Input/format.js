export function email(value) {
  return value.replace(/[^-_a-zA-Z0-9@\.]/g, '');
}

export function number(value) {
  return value.replace(/[^\d]/g, '');
}
