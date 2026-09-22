/**
 * Original isometric-style illustration in GuestFlow's own solid-color palette —
 * inspired by the layered-floors mood of the reference screenshots, not a copy
 * of their specific artwork. No gradients; teal/coral/ink only.
 */
export function HeroIllustration({ className }) {
  return (
    <svg viewBox="0 0 480 420" fill="none" className={className} role="img" aria-label="Illustration of building floors with visitors checking in">
      {/* Top floor */}
      <polygon points="120,20 300,20 380,65 200,65" fill="var(--gf-teal)" />
      <polygon points="120,20 120,50 200,95 200,65" fill="var(--gf-teal-dark)" />
      <polygon points="200,65 200,95 380,95 380,65" fill="var(--gf-teal-mid)" />
      <circle cx="230" cy="52" r="6" fill="var(--gf-ink)" />
      <rect x="224" y="58" width="12" height="14" rx="3" fill="var(--gf-ink)" />
      <rect x="300" y="35" width="10" height="24" fill="var(--gf-coral)" />

      {/* Middle floor */}
      <polygon points="60,120 240,120 320,165 140,165" fill="var(--gf-card)" />
      <polygon points="60,120 60,150 140,195 140,165" fill="var(--gf-card-dark)" />
      <polygon points="140,165 140,195 320,195 320,165" fill="var(--gf-card-mid)" />
      <circle cx="110" cy="152" r="6" fill="var(--gf-coral)" />
      <rect x="104" y="158" width="12" height="14" rx="3" fill="var(--gf-coral)" />
      <circle cx="180" cy="145" r="6" fill="var(--gf-ink)" />
      <rect x="174" y="151" width="12" height="14" rx="3" fill="var(--gf-ink)" />
      <rect x="220" y="130" width="10" height="24" fill="var(--gf-teal)" />

      {/* Bottom floor — offset like a floating lower level */}
      <polygon points="100,230 280,230 360,275 180,275" fill="var(--gf-teal)" />
      <polygon points="100,230 100,260 180,305 180,275" fill="var(--gf-teal-dark)" />
      <polygon points="180,275 180,305 360,305 360,275" fill="var(--gf-teal-mid)" />
      <circle cx="150" cy="262" r="6" fill="var(--gf-ink)" />
      <rect x="144" y="268" width="12" height="14" rx="3" fill="var(--gf-ink)" />
      <circle cx="300" cy="255" r="6" fill="var(--gf-coral)" />
      <rect x="294" y="261" width="12" height="14" rx="3" fill="var(--gf-coral)" />
      <rect x="250" y="240" width="10" height="24" fill="var(--gf-coral)" />

      {/* connecting stem */}
      <rect x="188" y="95" width="8" height="30" fill="var(--gf-line)" />
      <rect x="128" y="195" width="8" height="30" fill="var(--gf-line)" />

      {/* ground-level cars, echoing the reference's parking row */}
      <rect x="40" y="360" width="70" height="26" rx="6" fill="var(--gf-ink)" />
      <rect x="130" y="368" width="60" height="22" rx="6" fill="var(--gf-coral)" />
    </svg>
  )
}
