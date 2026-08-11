import { createFileRoute, redirect } from "@tanstack/react-router";

/** Wholesale partner sheet removed from public production site. */
export const Route = createFileRoute("/_app/lab/wholesale")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
