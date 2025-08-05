import type { Middleware } from "openapi-fetch";
import { auth } from "./auth";

export const middleware: Middleware = {
  onRequest: async ({ request }) => {
    const token = auth.get();
    if (token) {
      request.headers.set("Authorization", `Bearer ${token.accessToken}`);
    }
  },
  onResponse: async ({ response }) => {
    if (response.status === 401) {
      const token = auth.get();
      if (token) {
        // token expired
        // mendapatkan token baru
        try {
          const response2 = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
            {
              method: "POST",
              body: JSON.stringify({
                refresh_token: token.refreshToken,
              }),
            }
          );

          const body = await response2.json();
          auth.set({
            accessToken: body.access_token,
            refreshToken: body.refresh_token,
          });
        } catch (e) {
          auth.clear();
        }
      }
    }
  },
};
