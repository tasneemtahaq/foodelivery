import { prisma } from "@/lib/prisma";
import AdminSidebar from "../components/AdminSidebar";
import { Prisma } from "@prisma/client";

type CustomerWithOrders = Prisma.CustomerGetPayload<{
  include: { _count: { select: { orders: true } } };
}>;

export default async function AdminCustomersPage() {
  let customers: CustomerWithOrders[] = [];

  try {
    customers = await prisma.customer.findMany({
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Customers error:", error);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-10">
        <div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Customers</h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              {customers.length} registered customers
            </p>
          </div>

          {/* Table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#1A1A1A",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {customers.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-4xl mb-3">👥</p>
                <p className="text-white font-bold">No customers yet</p>
                <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                  Customers appear here after placing their first order
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Name", "Phone", "City", "Area", "Orders", "Joined"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: "#6B7280" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer, i) => (
                      <tr
                        key={customer.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.03)",
                          animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
                        }}
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-white">
                            {customer.name}
                          </p>
                          {customer.email && (
                            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                              {customer.email}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm" style={{ color: "#D1D5DB" }}>
                            {customer.phone}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm" style={{ color: "#D1D5DB" }}>
                            {customer.city}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm" style={{ color: "#D1D5DB" }}>
                            {customer.area ?? "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className="px-2 py-1 rounded-lg text-xs font-bold"
                            style={{
                              background: "rgba(249,115,22,0.1)",
                              color:      "#F97316",
                            }}
                          >
                            {customer._count.orders} order{customer._count.orders !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs" style={{ color: "#6B7280" }}>
                            {new Date(customer.createdAt).toLocaleDateString("en-PK")}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}