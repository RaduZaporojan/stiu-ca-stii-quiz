import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  size?: "hero" | "sidebar" | "footer";
  white?: boolean;
  className?: string;
};

const sizes = {
  hero: { width: 460, height: 550, className: "w-[238px] min-[390px]:w-[260px] sm:w-[380px] lg:w-[460px]" },
  sidebar: { width: 287, height: 344, className: "w-[132px] sm:w-[180px] lg:w-[230px] xl:w-[287px]" },
  footer: { width: 67, height: 79, className: "w-[44px] sm:w-[58px] lg:w-[67px]" },
};

export function BrandLogo({ size = "hero", white = false, className }: BrandLogoProps) {
  const config = sizes[size];

  return (
    <Image
      priority
      alt="Știu că Știi"
      className={cn("h-auto object-contain", config.className, className)}
      height={config.height}
      src={white ? "/assets/logo-stiu-ca-stii-white.png" : "/assets/logo-stiu-ca-stii.png"}
      style={{ height: "auto" }}
      width={config.width}
    />
  );
}
