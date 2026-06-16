import { chooseHeart } from "@/app/play/actions";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { SimpleScreen } from "@/components/layout/SimpleScreen";

type HeartPageProps = {
  searchParams: Promise<{ nickname?: string; error?: string }>;
};

export default async function HeartPage({ searchParams }: HeartPageProps) {
  const { nickname = "", error } = await searchParams;

  return (
    <SimpleScreen>
      <div className="flex flex-1 flex-col items-center gap-3 pt-1 sm:gap-6 sm:pt-4 lg:grid lg:w-full lg:grid-cols-[26.6%_46.8%_26.6%] lg:items-start lg:gap-0 lg:pt-8 xl:pt-10">
        <div className="flex justify-center lg:pt-0">
          <BrandLogo
            className="w-[150px] sm:w-[220px] lg:w-[287px]"
            size="sidebar"
          />
        </div>
        <section className="flex w-full flex-col items-center pt-2 text-center lg:min-h-[520px] lg:justify-start lg:pt-[118px] xl:pt-[122px]">
          <h1 className="text-[28px] font-extrabold leading-tight sm:text-[32px] lg:text-[34px]">
            Ce culoare are inima ta?
          </h1>
          <p className="mt-2 max-w-[460px] text-[16px] leading-snug text-stiucastiiDark/80 sm:mt-3 sm:text-[18px]">
            Această culoare va rămâne legată de numele tău în clasament.
          </p>
          {error ? (
            <p className="mt-3 text-[16px] font-bold text-stiucastiiOrange">
              {error}
            </p>
          ) : null}
          <div className="mt-8 flex w-full max-w-[760px] items-center justify-center gap-8 sm:mt-12 sm:gap-8 lg:mt-10 lg:gap-8 xl:gap-10">
            <form action={chooseHeart}>
              <input name="nickname" type="hidden" value={nickname} />
              <input name="heartColor" type="hidden" value="orange" />
              <button
                aria-label="Alege inima oranj"
                className="group border-0 bg-transparent p-0 transition duration-200 hover:-translate-y-1 hover:scale-110 hover:drop-shadow-[0_12px_14px_rgba(242,107,37,0.28)] active:scale-95"
              >
                <span className="heart-picker-heart heart-picker-heart-orange" />
              </button>
            </form>
            <form action={chooseHeart}>
              <input name="nickname" type="hidden" value={nickname} />
              <input name="heartColor" type="hidden" value="blue" />
              <button
                aria-label="Alege inima albastră"
                className="group border-0 bg-transparent p-0 transition duration-200 hover:-translate-y-1 hover:scale-110 hover:drop-shadow-[0_12px_14px_rgba(10,135,221,0.28)] active:scale-95"
              >
                <span className="heart-picker-heart heart-picker-heart-blue" />
              </button>
            </form>
          </div>
        </section>
      </div>
    </SimpleScreen>
  );
}
