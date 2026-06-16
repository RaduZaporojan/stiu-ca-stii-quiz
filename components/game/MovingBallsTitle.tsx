function MovingBalls() {
  return (
    <span aria-hidden="true" className="moving-balls">
      <span className="moving-ball moving-ball-orange" />
      <span className="moving-ball moving-ball-gradient" />
      <span className="moving-ball moving-ball-blue" />
    </span>
  );
}

export function MovingBallsTitle({ title }: { title: string }) {
  return (
    <div className="flex max-w-full items-center justify-center gap-2 sm:gap-4 lg:gap-5">
      <MovingBalls />
      <h1 className="min-w-0 bg-gameGradient bg-clip-text text-center text-[28px] font-extrabold uppercase leading-none text-transparent sm:text-[34px]">
        {title}
      </h1>
      <MovingBalls />
    </div>
  );
}
