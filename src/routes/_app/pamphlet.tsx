import { createFileRoute, redirect } from "@tanstack/react-router";

/** Public /pamphlet removed from shop — wholesale lives under Lab. */
export const Route = createFileRoute("/_app/pamphlet")({
  beforeLoad: () => {
    throw redirect({ to: "/lab/wholesale" });
  },
});
