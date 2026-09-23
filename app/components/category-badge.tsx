import { CATEGORY_META, type FileCategory } from "@/app/lib/share";

/** Small pill showing a file's auto-detected category. */
export default function CategoryBadge({
  category,
}: {
  category: FileCategory;
}) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.pill}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
        aria-hidden="true"
      />
      {meta.label}
    </span>
  );
}
