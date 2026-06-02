"use client";

import AdminRoomView from "@/components/views/AdminRoomView";

/**
 * Admin Room Page - Client Component
 * This page serves as the entry point for monitoring a remote session.
 * Hydration is handled within the view component to ensure browser APIs 
 * like WebRTC are only accessed after mounting.
 */
export default function AdminRoomPage() {
  return <AdminRoomView />;
}
