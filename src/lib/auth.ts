interface Token {
  accessToken: string;
  refreshToken: string;
}

const set = (token: Token) => {
  localStorage.setItem("token", JSON.stringify(token));
};

const get = (): Token | undefined => {
  const tokenStr = localStorage.getItem("token");
  if (!tokenStr) {
    return undefined;
  }

  return JSON.parse(tokenStr);
};

const clear = () => {
  localStorage.removeItem("token");
};

export const auth = {
  set,
  get,
  clear,
};
