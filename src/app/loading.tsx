export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#fff7ed" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "#F97316", borderTopColor: "transparent" }}
        />
        <p className="text-sm font-medium" style={{ color: "#F97316" }}>
          Loading...
        </p>
      </div>
    </div>
  );
}