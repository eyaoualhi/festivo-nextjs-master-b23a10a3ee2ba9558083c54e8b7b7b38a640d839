type SpaceSkeletonProps = {
  label: string;
};

export default function SpaceSkeleton({ label }: SpaceSkeletonProps) {
  return (
    <div aria-busy="true" aria-label={label} className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="h-5 w-28 animate-pulse rounded-full bg-surface" />
        <div className="h-10 w-2/3 max-w-md animate-pulse rounded-xl bg-surface" />
        <div className="h-5 w-full max-w-lg animate-pulse rounded-lg bg-surface" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="h-64 animate-pulse rounded-3xl bg-surface" />
        <div className="h-64 animate-pulse rounded-3xl bg-surface" />
      </div>
    </div>
  );
}
