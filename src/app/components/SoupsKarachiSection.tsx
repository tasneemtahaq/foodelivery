import Link from "next/link";

export default function SoupsKarachiSection() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl rounded-2xl bg-gray-100 p-8 text-center">
        <h2 className="text-3xl font-bold">
          Looking for Soups in Karachi?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Discover hot and freshly prepared soups from Mama Soup in Saddar,
          Karachi. Explore our soup options and order online.
        </p>

        <Link
          href="/soups-in-karachi"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Explore Soups in Karachi
        </Link>
      </div>
    </section>
  );
}