import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/appIcon";

// Same bytes on every request: rendered once at build time, like `/og/[locale]`.
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<AppIcon size={512} />, { width: 512, height: 512 });
}
