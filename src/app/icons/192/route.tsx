import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/appIcon";

// Same bytes on every request: rendered once at build time, like `/og/[locale]`,
// instead of running a function (and shipping its image renderer) per request.
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<AppIcon size={192} />, { width: 192, height: 192 });
}
