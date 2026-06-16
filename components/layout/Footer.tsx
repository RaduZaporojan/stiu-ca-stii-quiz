import Image from "next/image";

const projectLogos = [
  {
    alt: "Stiu ca stii",
    className:
      "h-[50px] w-[42px] sm:h-[70px] sm:w-[59px] lg:h-[82px] lg:w-[69px]",
    src: "/assets/logo/logo-stiu-ca-stii-small.png",
  },
  {
    alt: "Cinemateca OWH",
    className:
      "h-[32px] w-[84px] sm:h-[48px] sm:w-[128px] lg:h-[56px] lg:w-[148px]",
    href: "https://cinemateca.owh.md",
    src: "/assets/logo/cinemateca-white-clean.png",
  },
  {
    alt: "Talent",
    className:
      "h-[22px] w-[66px] sm:h-[34px] sm:w-[104px] lg:h-[40px] lg:w-[122px]",
    href: "https://talent.owh.md",
    src: "/assets/logo/talent-logo-white.png",
  },
];

function ProjectLogo({ logo }: { logo: (typeof projectLogos)[number] }) {
  const image = (
    <div className={`relative opacity-95 ${logo.className}`}>
      <Image
        alt={logo.alt}
        className="object-contain"
        fill
        sizes="(max-width: 640px) 90px, 160px"
        src={logo.src}
      />
    </div>
  );

  if (!("href" in logo)) {
    return image;
  }

  return (
    <a
      aria-label={`Deschide ${logo.alt}`}
      className="transition hover:-translate-y-0.5 hover:opacity-85"
      href={logo.href}
      rel="noreferrer"
      target="_blank"
    >
      {image}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto flex min-h-[96px] w-full items-center bg-stiucastiiBlue px-4 py-5 sm:min-h-[140px] sm:px-10 lg:min-h-[170px] lg:px-16">
      <div className="flex max-w-full items-end gap-x-4 sm:gap-x-7 lg:gap-x-10">
        <div className="flex shrink-0 flex-col items-center">
          <span className="flex h-[12px] items-center font-[Inter,Arial,sans-serif] text-[9px] font-normal leading-none text-white/90 sm:h-[17px] sm:text-[13px] lg:h-[19px] lg:text-[15px]">
            Dezvoltat de
          </span>
          <div className="mt-2 flex h-[58px] items-center sm:h-[78px] lg:h-[96px]">
            <div className="relative h-[62px] w-[125px] opacity-95 sm:h-[98px] sm:w-[197px] lg:h-[134px] lg:w-[269px]">
              <Image
                alt="OWH Studio"
                className="object-contain"
                fill
                sizes="(max-width: 640px) 125px, 269px"
                src="/assets/logo/owh-studio-white.png"
              />
            </div>
          </div>
        </div>

        <div className="h-[58px] w-px shrink-0 bg-white/80 sm:h-[78px] lg:h-[96px]" />

        <div className="flex shrink-0 flex-col items-center">
          <span className="flex h-[12px] items-center text-center font-[Inter,Arial,sans-serif] text-[9px] font-normal leading-none text-white/90 sm:h-[17px] sm:text-[13px] lg:h-[19px] lg:text-[15px]">
            Proiectele noastre digitale
          </span>
          <div className="mt-2 flex h-[58px] items-center gap-x-3 sm:h-[78px] sm:gap-x-5 lg:h-[96px] lg:gap-x-7">
            {projectLogos.map((logo) => (
              <ProjectLogo key={logo.src} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
