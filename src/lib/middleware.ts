import { redirect } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";
import type { Middleware } from "openapi-fetch";
import { auth } from "./auth";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const refreshToken = async (token: { refreshToken: string }) => {
  if (isRefreshing) {
    await refreshPromise;
    return;
  }

  isRefreshing = true;
  refreshPromise = new Promise(async (resolve, reject) => {
    try {
      const refreshTokenResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
        {
          method: "POST",
          body: JSON.stringify({
            refresh_token: token.refreshToken,
          }),
        }
      );
      const status = refreshTokenResponse.status;

      if (status === 200) {
        const body = await refreshTokenResponse.json();
        auth.set({
          accessToken: body.access_token,
          refreshToken: body.refresh_token,
        });
        resolve();
      } else if (status === 401) {
        auth.clear();
        reject(new Error("Refresh token expired or invalid"));
      }
    } catch (e) {
      auth.clear();
      reject(e);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  });

  await refreshPromise;
};

export const middleware: Middleware = {
  onRequest: async ({ request }) => {
    const token = auth.get();
    if (token) {
      let accessToken = token.accessToken;

      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        try {
          await refreshToken(token);
          const newToken = auth.get();
          if (newToken) {
            accessToken = newToken.accessToken;
          } else {
            throw redirect({ to: "/auth/login" });
          }
        } catch (e) {
          throw redirect({ to: "/auth/login" });
        }
      }

      request.headers.set("Authorization", `Bearer ${accessToken}`);
    }
  },
  // onResponse: async ({ response }) => {
  //   if (response.status === 401) {
  //     const token = auth.get();
  //     if (token) {
  //       // token expired
  //       // mendapatkan token baru
  //       try {
  //         const refreshTokenResponse = await fetch(
  //           `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
  //           {
  //             method: "POST",
  //             body: JSON.stringify({
  //               refresh_token: token.refreshToken,
  //             }),
  //           }
  //         );

  //         const status = refreshTokenResponse.status;
  //         if (status === 200) {
  //           const body = await refreshTokenResponse.json();
  //           auth.set({
  //             accessToken: body.access_token,
  //             refreshToken: body.refresh_token,
  //           });
  //         } else if (status === 401) {
  //           auth.clear();
  //         }
  //       } catch (e) {
  //         // refresh token sudah direvoke atau refresh token sudah kadaluarsa
  //         // clear auth untuk memaksa user login kembali
  //         auth.clear();
  //       }
  //     }
  //   }
  // },
};
