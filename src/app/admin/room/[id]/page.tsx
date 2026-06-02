import dynamic from "next/dynamic";

const AdminRoomView = dynamic(() => import("@/components/views/AdminRoomView"), {
  ssr: false,
});

export default function AdminRoomPage() {
  return <AdminRoomView />;
}
