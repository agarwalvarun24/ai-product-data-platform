interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6">
      <div>
        {eyebrow && (
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-600">
            {eyebrow}
          </div>
        )}

        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-gray-950">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}