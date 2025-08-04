import type { Middleware } from "openapi-fetch";

export const middleware: Middleware = {
  onRequest: async ({ request }) => {
    console.log({ request });
  },
  onResponse: async ({ response }) => {
    console.log("response", { response });
  },
  onError: async ({ error, options, request }) => {
    console.log("error occurred", { error, options, request });
  },
};
