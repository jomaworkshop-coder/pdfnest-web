export function PrivacyBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs font-medium">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
      Processed in your browser — verify in DevTools Network tab
    </div>
  );
}
