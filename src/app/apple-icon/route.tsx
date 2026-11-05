import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/appIcon";

// A plain route, not the `apple-icon.tsx` metadata file convention: that
// convention made every page trace `next/og` and sharp (≈ 23 MB) into its
// function bundle (docs/cost-optimization/vercel/ROOT_CAUSE_ANALYSIS.md).
// The <link rel="apple-touch-icon"> already comes from `rootMetadata()`
// (`icons.apple: "/apple-icon"`), so the URL and the page HTML are unchanged.
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<AppIcon size={180} />, { width: 180, height: 180 });
}
