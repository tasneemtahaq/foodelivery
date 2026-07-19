import AdminSidebar from "../components/AdminSidebar";

export default function AdminSettingsPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 pt-10">
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