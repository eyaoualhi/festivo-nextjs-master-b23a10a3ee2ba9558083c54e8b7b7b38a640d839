type HomeSkeletonProps = {
  label: string;
};

/** Forme du haut de l'accueil, affichée le temps de lire les événements (D-33). */
export default function HomeSkeleton({ label }: HomeSkeletonProps) {
  return (
    <div aria-busy="true" aria-label={label} className="bg-canvas">
      <div className="mx-auto grid max-w-360 gap-12 px-4 pt-10 pb-16 md:px-8 md:pt-16 md:pb-24 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="flex flex-col gap-7 lg:col-span-7">
          <div className="flex flex-col gap-3">
            <div className="h-14 w-11/12 animate-pulse bg-surface md:h-20" />
            <div className="h-14 w-3/4 animate-pulse bg-surface md:h-20" />
          </div>
          <div className="h-6 w-full max-w-xl animate-pulse bg-surface" />
          <div className="h-14 w-56 animate-pulse bg-surface" />
          <div className="flex gap-10">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-16 w-24 animate-pulse bg-surface" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 grid-rows-[16rem_12rem] gap-2 md:h-[34rem] md:grid-cols-5 md:grid-rows-2 lg:col-span-5 lg:h-[38rem]">
          <div className="col-span-2 animate-pulse bg-surface md:col-span-3 md:row-span-2" />
          <div className="animate-pulse bg-surface md:col-span-2" />
          <div className="animate-pulse bg-surface md:col-span-2" />
        </div>
      </div>
    </div>
  );
}
