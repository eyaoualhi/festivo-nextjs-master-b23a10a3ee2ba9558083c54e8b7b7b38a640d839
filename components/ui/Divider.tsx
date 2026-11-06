type DividerProps = {
  label: string;
};

export default function Divider({ label }: DividerProps) {
  return (
    <div className="flex items-center gap-3" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-line" />
      <span className="text-xs font-medium text-muted">{label}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
