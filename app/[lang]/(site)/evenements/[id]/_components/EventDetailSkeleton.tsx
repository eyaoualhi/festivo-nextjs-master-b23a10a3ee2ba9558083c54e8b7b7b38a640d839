type EventDetailSkeletonProps = {
  label: string;
};

export default function EventDetailSkeleton({ label }: EventDetailSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label={label}
      className="mx-auto flex w-full max-w-360 flex-col gap-4 px-4 pt-6 pb-16 md:px-10 md:pt-8 lg:pb-24"
    >
      <div className="h-11 w-44 animate-pulse rounded-xl bg-surface" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-16">
        <div className="flex min-w-0 flex-col gap-10">
          <div className="aspect-video animate-pulse rounded-3xl bg-surface xl:aspect-[2/1]" />
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="h-6 w-24 animate-pulse rounded-full bg-surface" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-surface" />
            </div>
            <div className="h-10 w-4/5 animate-pulse rounded-xl bg-surface md:h-14" />
          </div>
          <div className="flex max-w-3xl flex-col gap-3">
            <div className="h-7 w-56 animate-pulse rounded-lg bg-surface" />
            <div className="h-4 w-full animate-pulse rounded-lg bg-surface" />
            <div className="h-4 w-full animate-pulse rounded-lg bg-surface" />
            <div className="h-4 w-2/3 animate-pulse rounded-lg bg-surface" />
          </div>
        </div>
        <div className="hidden h-[28rem] animate-pulse rounded-3xl border border-line bg-surface lg:block" />
      </div>
    </div>
  );
}
