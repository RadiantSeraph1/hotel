import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Menu, Phone } from "lucide-react";
import { hotel } from "@/lib/content/hotel-content";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/gallery", label: "Gallery" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand-link focus-ring" href="/" aria-label="Luxury Touch Hotel home">
          <Image src={hotel.logo.src} alt={hotel.logo.alt} width={138} height={56} priority />
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link className="nav-link focus-ring" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="button button-primary header-cta focus-ring" href="/booking">
          <CalendarDays size={18} aria-hidden="true" />
          Book
        </Link>

        <details className="mobile-menu">
          <summary className="icon-button focus-ring" aria-label="Open navigation">
            <Menu size={22} aria-hidden="true" />
          </summary>
          <div className="mobile-menu-panel">
            {navItems.map((item) => (
              <Link className="mobile-nav-link focus-ring" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="button button-primary focus-ring" href="/booking">
              <CalendarDays size={18} aria-hidden="true" />
              Request booking
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Image src={hotel.logo.src} alt={hotel.logo.alt} width={150} height={61} />
          <p className="footer-copy">{hotel.description}</p>
        </div>
        <div>
          <h2 className="footer-heading">Visit</h2>
          <p className="footer-line">
            <MapPin size={17} aria-hidden="true" />
            {hotel.address}
          </p>
          <p className="footer-line">
            <Phone size={17} aria-hidden="true" />
            {hotel.phone}
          </p>
        </div>
        <div>
          <h2 className="footer-heading">Explore</h2>
          <div className="footer-links">
            {navItems.map((item) => (
              <Link className="focus-ring" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{hotel.name}</span>
        <span>Check-in {hotel.checkIn} · Check-out {hotel.checkOut}</span>
      </div>
    </footer>
  );
}

export function PublicShell({
  children,
  showFloatingBooking = true,
}: Readonly<{ children: React.ReactNode; showFloatingBooking?: boolean }>) {
  return (
    <>
      <SiteHeader />
      {children}
      {showFloatingBooking && (
        <Link className="floating-booking focus-ring" href="/booking">
          <CalendarDays size={18} aria-hidden="true" />
          Request booking
        </Link>
      )}
      <SiteFooter />
    </>
  );
}
