import Image from "next/image";
import Link from "next/link";
import type { LetterboxdFilm, LetterboxdSocial } from "@/types/socials";

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function filmHref(film: LetterboxdFilm) {
  return `https://letterboxd.com/film/${film.slug ?? slugify(film.title)}/`;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <span className="text-[9px] leading-none text-[#00e054]" aria-label={`${rating} out of 5`}>
      {"★".repeat(full)}
      {half && "½"}
    </span>
  );
}

function Poster({ film }: { film: LetterboxdFilm }) {
  return (
    <li className="min-w-0">
      <Link
        href={filmHref(film)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${film.title}${film.year ? ` (${film.year})` : ""} on Letterboxd`}
        className="group/film block outline-hidden"
      >
        <div className="relative aspect-2/3 overflow-hidden rounded-sm bg-foreground/8 ring-1 ring-foreground/10 group-focus-visible/film:ring-[#00e054]">
          {film.poster ? (
            <Image src={film.poster} alt="" fill sizes="60px" className="object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center p-1 text-center text-[8px] leading-tight text-white/45">
              {film.title}
            </span>
          )}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/95 via-black/75 to-transparent p-1 pt-4 opacity-0 transition-opacity duration-150 group-hover/film:opacity-100 group-focus-visible/film:opacity-100">
            <span className="block text-[8px] font-medium leading-tight text-white">
              {film.title}
            </span>
            {film.year && <span className="block text-[8px] text-white/55">{film.year}</span>}
          </span>
        </div>
      </Link>
      <div className="mt-1 h-3">
        {film.rating !== undefined && <Stars rating={film.rating} />}
      </div>
    </li>
  );
}

export default function LetterboxdCard({ social }: { social: LetterboxdSocial }) {
  const films = (social.films ?? []).slice(0, 4);

  return (
    <div className="w-72 bg-[#14181c]">
      <div className="flex items-center justify-between gap-3 bg-[#14181c] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#00e054]" />
          <span className="size-2 rounded-full bg-[#40bcf4]" />
          <span className="size-2 rounded-full bg-[#ff8000]" />
          <span className="ml-1 text-[11px] text-white/85">{social.handle}</span>
        </div>
        {social.watched !== undefined && (
          <span className="text-[10px] tabular-nums text-white/40">
            {social.watched.toLocaleString()} films
          </span>
        )}
      </div>

      <div className="bg-[#14181c] px-3 pb-3">
        <p className="pb-2 text-[9px] uppercase tracking-wider text-white/35">Recently watched</p>
        {films.length > 0 ? (
          <ul className="grid grid-cols-4 gap-2">
            {films.map((film) => (
              <Poster key={`${film.title}-${film.year ?? ""}`} film={film} />
            ))}
          </ul>
        ) : (
          <p className="pb-1 text-[11px] text-white/40">Nothing logged yet.</p>
        )}
      </div>
    </div>
  );
}
