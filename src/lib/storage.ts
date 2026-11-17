// localStorage throws where storage is blocked, like some sandboxed iframes.
// The admin then keeps its choices for the session only.
const memory = new Map<string, string>();

function readStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function writeStorage(key: string, value: string) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {
    // Kept in memory above.
  }
}

export { readStorage, writeStorage };
