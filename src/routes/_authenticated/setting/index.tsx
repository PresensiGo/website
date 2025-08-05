import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";

export const Route = createFileRoute("/_authenticated/setting/")({
  component: RouteComponent,
});

function RouteComponent() {
  const testExpiryAccessToken = useCallback(() => {
    const token = auth.get();
    if (token) {
      auth.set({ accessToken: "hehe", refreshToken: token.refreshToken });
    }
  }, []);

  return (
    <>
      <div>
        <p>Hello "/_authenticated/setting/"!</p>
        <Button onClick={() => testExpiryAccessToken()}>expiry</Button>
      </div>
    </>
  );
}
