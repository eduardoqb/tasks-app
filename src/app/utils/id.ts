const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** Genera un ID alfanumérico corto usando `crypto.getRandomValues`. */
export function shortId(length = 8): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let id = '';
  for (let i = 0; i < length; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return id;
}

/** Genera un ID corto garantizando que no exista entre las tareas actuales. */
export function uniqueId(existing: string[]): string {
  const existingSet = new Set(existing);
  let id = shortId();
  while (existingSet.has(id)) {
    id = shortId();
  }
  return id;
}
