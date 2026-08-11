import { createFileRoute, redirect } from "@tanstack/react-router";

/** Public pamphlet / wholesale sheet removed from the storefront. */
export const Route = createFileRoute("/_app/pamphlet")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
