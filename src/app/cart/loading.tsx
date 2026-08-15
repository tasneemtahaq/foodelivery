export default function CartLoading() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#f9fafb", paddingTop: "80px" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="w-32 h-8 rounded animate-pulse mb-8"
             style={{ background: "#fed7aa" }} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {[1,2,3].map((i) => (
              <div key={i} className="h-24 rounded-2xl animate-pulse"
                   style={{ background: "white" }} />
            ))}
          </div>
          <div className="h-64 rounded-2xl animate-pulse"
               style={{ background: "white" }} />
        </div>
      </div>
    </div>
  );
}