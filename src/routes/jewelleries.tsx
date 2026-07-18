import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/jewelleries")({
  component: JewelleriesLayout,
});

function JewelleriesLayout() {
  return <Outlet />;
}
