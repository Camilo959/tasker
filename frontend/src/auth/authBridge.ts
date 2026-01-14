// auth/authBridge.ts
let globalLogout: (() => void) | null = null;

export const setGlobalLogout = (fn: () => void) => {
  globalLogout = fn;
};

export const getGlobalLogout = () => globalLogout;
