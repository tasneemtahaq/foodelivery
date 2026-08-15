import Link from "next/link";
import { ArrowRight, Soup, MapPin } from "lucide-react";

export const metadata = {
  title: "Best Soups in Karachi | Mama Soups",
  description:
    "Discover hot and freshly prepared soups from Mama Soups in Saddar, Karachi. Explore our chicken corn soup and other delicious soups and order online.",
};

export default function SoupsInKarachiPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#f59e0b18,transparent_45%)]" />

        <div className="relative mx-auto max-w-5xl text-center">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/20">
            <Soup className="h-8 w-8 text-orange-400" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
            Fresh • Hot • Delicious
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Best Soups in{" "}
            <span className="text-orange-400">
              Karachi
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
            Enjoy freshly prepared, hot and delicious soups from Mama Soups
            in Saddar, Karachi. Order your favourite soup online and enjoy
            a comforting meal at home.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">

            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 font-bold text-white transition hover:bg-orange-400"
            >
              Order Soup Online
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/10 px-7 py-3.5 font-semibold text-gray-300 transition hover:border-orange-400 hover:text-orange-400"
            >
              Back to Home
            </Link>

          </div>

        </div>
      </section>

      {/* ABOUT / YAKHNI SOUP */}
<section className="px-4 py-16 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-5xl">

    <h2 className="text-3xl font-bold sm:text-4xl">
      Delicious Yakhni Soup in Karachi
    </h2>

    <p className="mt-5 text-base leading-8 text-gray-300">
      Looking for a warm and comforting soup in Karachi? Mama Soup
      serves freshly prepared Yakhni Soup in Saddar, Karachi. Our
      yakhni is a delicious choice for anyone craving a hot and
      satisfying bowl of soup.
    </p>

    <p className="mt-4 text-base leading-8 text-gray-300">
      You can explore the Mama Soup menu and order online for a
      convenient meal in Karachi.
    </p>

    <Link
      href="/menu"
      className="mt-7 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-400"
    >
      View Yakhni Soup & Menu
      <ArrowRight className="h-5 w-5" />
    </Link>

  </div>
</section>

      {/* LOCATION */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-orange-500/20 bg-orange-500/5 p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-6 w-6 shrink-0 text-orange-400" />

              <div>
                <h2 className="text-xl font-bold">
                  Mama Soups — Saddar, Karachi
                </h2>

                <p className="mt-2 text-gray-400">
                  Hussaini Manzil, D&apos;Cruz Ln, opp. F.T. Sweets
                </p>

                <p className="mt-1 text-gray-400">
                  Monday – Saturday · 5:00 PM – 11:00 PM
                </p>

                <p className="mt-1 text-gray-400">
                  0333-2287497
                </p>
              </div>
            </div>

            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-400"
            >
              View Menu
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}