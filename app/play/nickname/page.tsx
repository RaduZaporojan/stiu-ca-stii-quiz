import { submitNickname } from "@/app/play/actions";
import { AppButton } from "@/components/layout/AppButton";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { SimpleScreen } from "@/components/layout/SimpleScreen";

type NicknamePageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NicknamePage({ searchParams }: NicknamePageProps) {
  const { error } = await searchParams;

  return (
    <SimpleScreen>
      <div className="flex flex-1 flex-col items-center pt-2 sm:pt-0">
        <BrandLogo className="heartbeat-logo" size="hero" />
        <form
          action={submitNickname}
          className="mt-2 flex w-full max-w-[286px] flex-col items-center gap-3 sm:-mt-2"
        >
          <label
            className="text-[31px] font-extrabold leading-tight text-[#00518f] sm:text-[34px]"
            htmlFor="nickname"
          >
            Numele tău?
          </label>
          <input
            className="h-[58px] w-full rounded-[14px] border border-stiucastiiBlue px-5 text-center text-[24px] font-semibold text-stiucastiiDark shadow-game outline-none transition focus:ring-4 focus:ring-stiucastiiBlue/15"
            id="nickname"
            maxLength={24}
            minLength={2}
            name="nickname"
            required
          />
          {error ? (
            <p className="text-center text-[15px] font-bold leading-tight text-stiucastiiOrange">
              {error}
            </p>
          ) : null}
          <AppButton className="mt-3 min-w-full text-[22px]">Continuă</AppButton>
        </form>
      </div>
    </SimpleScreen>
  );
}
