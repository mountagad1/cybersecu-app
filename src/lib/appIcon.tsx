/**
 * Shared JSX for generated app icons (PWA manifest icons, apple-touch-icon).
 * Rendered via `next/og`'s ImageResponse (satori) — kept to simple
 * flexbox/div shapes rather than arbitrary SVG paths for reliable
 * rendering, but visually matches public/logo.svg (shield + padlock,
 * navy/blue/teal gradient).
 *
 * `maskable` adds the ~20% safe-zone padding Android/adaptive icons
 * require: the background must fill the full square, but the padlock
 * glyph itself must stay inside the centered "safe circle" or OS masking
 * (circle/squircle/rounded-square) can crop it.
 */
export function AppIcon({ size, maskable = false }: { size: number; maskable?: boolean }) {
  const contentScale = maskable ? 0.62 : 0.86;
  const content = size * contentScale;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2563eb 0%, #1c4ed8 55%, #0fb5ae 100%)",
        borderRadius: maskable ? 0 : size * 0.22,
      }}
    >
      <div
        style={{
          width: content,
          height: content,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* padlock shackle */}
        <div
          style={{
            position: "absolute",
            width: content * 0.42,
            height: content * 0.34,
            border: `${Math.max(2, content * 0.09)}px solid #ffffff`,
            borderBottom: "none",
            borderRadius: `${content * 0.21}px ${content * 0.21}px 0 0`,
            top: content * 0.08,
          }}
        />
        {/* padlock body */}
        <div
          style={{
            position: "absolute",
            width: content * 0.62,
            height: content * 0.46,
            background: "#ffffff",
            borderRadius: content * 0.09,
            top: content * 0.36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: content * 0.12,
              height: content * 0.12,
              borderRadius: content * 0.06,
              background: "#0b1220",
            }}
          />
        </div>
      </div>
    </div>
  );
}
