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
    console.log("response", { response });
  },
  onError: async ({ error, options, request }) => {
    console.log("error occurred", { error, options, request });
  },
};
