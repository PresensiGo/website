import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// import Header from '../components/Header'

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";

import { Toaster } from "@/components/ui/sonner.tsx";
import type { QueryClient } from "@tanstack/react-query";

import { IntlProvider } from "react-intl";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      {/* <Header /> */}
      <IntlProvider locale="id" defaultLocale="id">
        <Outlet />
      </IntlProvider>

      <TanStackRouterDevtools />
      <TanStackQueryLayout />

      <Toaster richColors theme="light" />
    </>
  ),
});
