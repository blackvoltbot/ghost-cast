import dynamic from "next/dynamic";

const UserRoomView = dynamic(() => import("@/components/views/UserRoomView"), {
  ssr: false,
});

export default function UserRoomPage() {
  return <UserRoomView />;
}
