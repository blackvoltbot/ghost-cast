import dynamic from "next/dynamic";

const AdminDashboardView = dynamic(() => import("@/components/views/AdminDashboardView"), {
  ssr: false,
});

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}
