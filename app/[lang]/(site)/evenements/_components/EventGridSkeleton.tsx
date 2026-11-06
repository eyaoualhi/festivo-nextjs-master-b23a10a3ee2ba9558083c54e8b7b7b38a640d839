type EventGridSkeletonProps = {
  label: string;
};

export default function EventGridSkeleton({ label }: EventGridSkeletonProps) {
  return (
    <div aria-busy="true" aria-label={label} className="flex flex-col gap-6">
      <div className="h-20 animate-pulse rounded-3xl bg-surface" />
      <div className="flex gap-2.5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="h-11 w-28 animate-pulse rounded-full bg-surface" />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 12 }, (_, index) => (
          <li key={index} className="aspect-3/4 animate-pulse rounded-2xl bg-surface" />
        ))}
      </ul>
    </div>
  );
}
