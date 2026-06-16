import {
  LeaderboardList,
  type LeaderboardDisplayEntry,
} from "@/components/leaderboard/LeaderboardList";
import { cn } from "@/lib/utils";

type LeaderboardSidebarProps = {
  compact?: boolean;
  entries: LeaderboardDisplayEntry[];
};

const episodes = [
  {
    id: "T8O-FxgS3_g",
    title: "Stiu ca Stii - episod",
  },
  {
    id: "1H20CVJpzvE",
    title: "Stiu ca Stii - episod",
  },
];

function getYouTubeSrcDoc(videoId: string, title: string) {
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return `
    <style>
      *{box-sizing:border-box}
      body{margin:0;background:#dbeeff;font-family:Arial,sans-serif}
      a{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
      img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
      .shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,135,221,.24),rgba(0,0,0,.18))}
      .play{position:relative;width:64px;height:46px;border-radius:13px;background:#ff1a1a;box-shadow:0 8px 20px rgba(0,0,0,.28)}
      .play:after{content:"";position:absolute;left:25px;top:12px;border-left:18px solid #fff;border-top:11px solid transparent;border-bottom:11px solid transparent}
      .label{position:absolute;left:10px;top:9px;right:10px;color:#fff;font-size:13px;font-weight:700;line-height:1.05;text-shadow:0 2px 8px rgba(0,0,0,.5)}
    </style>
    <a href="${embedUrl}" aria-label="Redă ${title}">
      <img src="${thumbnail}" alt="${title}">
      <span class="shade"></span>
      <span class="label">${title}</span>
      <span class="play"></span>
    </a>
  `;
}

export function LeaderboardSidebar({
  compact = false,
  entries,
}: LeaderboardSidebarProps) {
  return (
    <aside
      className={cn(
        "h-full lg:w-full",
        compact ? "px-0 py-0" : "border-l border-stiucastiiBlue/70 px-6 py-12",
      )}
    >
      <div className={cn("mx-auto flex flex-col", compact ? "max-w-none gap-7" : "max-w-[260px] gap-10")}>
        <section>
          <h2 className="mb-4 text-[23px] font-extrabold leading-tight sm:mb-5 sm:text-[25px]">
            Clasamentul inimilor
          </h2>
          <LeaderboardList compact entries={entries} />
        </section>

        <section>
          <h2 className="mb-4 text-[23px] font-extrabold leading-tight sm:text-[25px]">
            Privește emisiunea
          </h2>
          <div className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "grid-cols-1")}>
            {episodes.map((episode, index) => (
              <div
                className="overflow-hidden rounded-[12px] bg-[#eeeeee] shadow-soft"
                key={episode.id}
              >
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="block aspect-video min-h-[126px] w-full border-0"
                  referrerPolicy="strict-origin-when-cross-origin"
                  src={`https://www.youtube.com/embed/${episode.id}`}
                  srcDoc={getYouTubeSrcDoc(episode.id, episode.title)}
                  title={`${episode.title} ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <a
            className="mt-5 inline-block text-[18px] font-extrabold text-stiucastiiBlue transition hover:text-stiucastiiOrange"
            href="https://www.youtube.com/results?search_query=%C8%98tiu+c%C4%83+%C8%98tii+OWH"
            rel="noreferrer"
            target="_blank"
          >
            Vezi mai multe episoade
          </a>
        </section>
      </div>
    </aside>
  );
}
