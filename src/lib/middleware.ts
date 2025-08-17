import { jwtDecode } from "jwt-decode";
import type { Middleware } from "openapi-fetch";
import { auth } from "./auth";

export const middleware: Middleware = {
  onRequest: async ({ request }) => {
    const token = auth.get();
    if (token) {
      let accessToken = token.accessToken;

      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        // console.log("access token expired");
        // masa berlaku token sudah habis
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

          accessToken = body.access_token;
        } else if (status === 401) {
          auth.clear();
        }
      }

      request.headers.set("Authorization", `Bearer ${accessToken}`);
      return request;
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
