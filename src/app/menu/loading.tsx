export default function MenuLoading() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#f9fafb", paddingTop: "80px" }}
    >
      {/* Header skeleton */}
      <div
        className="py-12 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)" }}
      >
        <div className="w-48 h-8 rounded-lg mx-auto mb-3 animate-pulse"
             style={{ background: "#fed7aa" }} />
        <div className="w-64 h-10 rounded-lg mx-auto animate-pulse"
             style={{ background: "#fed7aa" }} />
      </div>

      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden animate-pulse"
              style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)" }}
            >
              <div className="h-48" style={{ background: "#fed7aa" }} />
              <div className="p-4 flex flex-col gap-3">
                <div className="h-3 w-16 rounded" style={{ background: "#fee2e2" }} />
                <div className="h-5 w-full rounded" style={{ background: "#fee2e2" }} />
                <div className="h-3 w-3/4 rounded" style={{ background: "#fee2e2" }} />
                <div className="flex justify-between mt-2">
                  <div className="h-6 w-16 rounded" style={{ background: "#fed7aa" }} />
                  <div className="h-9 w-9 rounded-xl" style={{ background: "#fed7aa" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}