import { AppButton } from "@/components/layout/AppButton";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { SimpleScreen } from "@/components/layout/SimpleScreen";

export default function HomePage() {
  return (
    <SimpleScreen>
      <div className="flex flex-1 flex-col items-center justify-start pt-2 sm:pt-0">
        <BrandLogo className="heartbeat-logo" size="hero" />
        <div className="mt-12 flex w-full flex-col items-center gap-4 sm:mt-12">
          <AppButton href="/play/nickname">Start joc</AppButton>
          <AppButton className="text-[22px]" href="/leaderboard" variant="secondary">
            Clasament
          </AppButton>
          <AppButton className="text-[22px]" href="/settings" variant="secondary">
            Setări
          </AppButton>
        </div>
      </div>
    </SimpleScreen>
  );
}
