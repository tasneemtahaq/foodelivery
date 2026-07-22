import AdminSidebar from "../components/AdminSidebar";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Restaurant settings coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}