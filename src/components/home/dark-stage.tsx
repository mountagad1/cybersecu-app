import { ParticleDrift } from "@/components/ui/particle-drift";
import { cn } from "@/lib/utils";

/**
 * The hero's night-sky backdrop — navy, faint grid, blue/teal glow and the
 * drifting particles — for sections further down the home page. Several
 * adjacent sections go inside one stage, so they share a single canvas and
 * read as one continuous dark band.
 *
 * Children are expected to use light-on-dark styles.
 */
export function DarkStage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-clip bg-(--brand-navy) text-white",
        className,
      )}
    >
      <div aria-hidden className="hero-grid absolute inset-0 -z-10" />
      <div aria-hidden className="stage-glow absolute inset-0 -z-10" />
      <ParticleDrift className="stage-particles -z-10" />
      {children}
    </div>
  );
}
