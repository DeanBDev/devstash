import Link from "next/link";

interface DashboardSectionProps {
  title: string;
  description: string;
  viewAllHref?: string;
  children: React.ReactNode;
}

export default function DashboardSection({
  title,
  description,
  viewAllHref,
  children,
}: DashboardSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="shrink-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
