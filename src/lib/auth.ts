import { jwtDecode } from "jwt-decode";

interface Token {
  accessToken: string;
  refreshToken: string;
}

const set = (token: Token) => {
  localStorage.setItem("token", JSON.stringify(token));
};

const get = (): Token | undefined => {
  try {
    const tokenStr = localStorage.getItem("token");
    if (!tokenStr) {
      return undefined;
    }

    const token = JSON.parse(tokenStr) as Token;
    const { accessToken, refreshToken } = token;
    if (!accessToken || !refreshToken) {
      return undefined;
    }

    return token;
  } catch (e) {
    return undefined;
  }
};

const clear = () => {
  localStorage.removeItem("token");
};

const isAdmin = (): boolean => {
  try {
    const token = get();
    if (!token) return false;

    const decoded = jwtDecode<{ role: string }>(token.accessToken);
    return decoded.role === "admin";
  } catch (e) {
    return false;
  }
};

export const auth = {
  set,
  get,
  clear,
  isAdmin,
};
