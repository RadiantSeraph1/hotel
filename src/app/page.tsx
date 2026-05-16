import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="container" style={{ padding: "96px 0" }}>
        <p
          style={{
            margin: "0 0 12px",
            color: "var(--accent)",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 0,
            textTransform: "uppercase",
          }}
        >
          Tarkwa, Ghana
        </p>
        <h1
          style={{
            margin: 0,
            maxWidth: 760,
            color: "var(--brand-dark)",
            fontSize: "clamp(44px, 8vw, 84px)",
            lineHeight: 0.95,
            letterSpacing: 0,
          }}
        >
          Luxury Touch Hotel
        </h1>
        <p
          style={{
            maxWidth: 640,
            margin: "24px 0 32px",
            color: "var(--muted)",
            fontSize: 20,
            lineHeight: 1.55,
          }}
        >
          A refreshed hotel website and CMS is being built here, with imported
          hotel assets, room pages, booking requests, and staff admin tools.
        </p>
        <Link
          className="focus-ring"
          href="/booking"
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 48,
            padding: "0 22px",
            borderRadius: 8,
            background: "var(--accent)",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          Request a booking
        </Link>
      </section>
    </main>
  );
}
