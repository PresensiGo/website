import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: Page,
});

function Page() {
  return <></>;
}
