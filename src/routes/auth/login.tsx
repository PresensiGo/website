import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  component: Page,
});

function Page() {
  return (
    <>
      <p>login page</p>
    </>
  );
}
