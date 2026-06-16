"use server";

import type { HeartColor } from "@prisma/client";
import { redirect } from "next/navigation";
import { createSessionForPlayer } from "@/lib/game-session";
import {
  createPlayer,
  findPlayerByNickname,
  normalizeNickname,
  validateNickname,
} from "@/lib/players";

function encode(value: string) {
  return encodeURIComponent(value);
}

export async function submitNickname(formData: FormData) {
  const validated = validateNickname(String(formData.get("nickname") ?? ""));

  if (!validated.ok) {
    redirect(`/play/nickname?error=${encode(validated.error)}`);
  }

  const player = await findPlayerByNickname(validated.nickname);

  if (player) {
    const session = await createSessionForPlayer(player);
    redirect(`/play/session/${session.id}`);
  }

  redirect(`/play/heart?nickname=${encode(validated.nickname)}`);
}

export async function chooseHeart(formData: FormData) {
  const nickname = normalizeNickname(String(formData.get("nickname") ?? ""));
  const heartColor = String(formData.get("heartColor") ?? "");
  const validated = validateNickname(nickname);

  if (!validated.ok) {
    redirect(`/play/nickname?error=${encode(validated.error)}`);
  }

  if (heartColor !== "orange" && heartColor !== "blue") {
    redirect(
      `/play/heart?nickname=${encode(validated.nickname)}&error=${encode(
        "Alege o culoare pentru inima.",
      )}`,
    );
  }

  const existing = await findPlayerByNickname(validated.nickname);
  if (existing) {
    const session = await createSessionForPlayer(existing);
    redirect(`/play/session/${session.id}`);
  }

  const player = await createPlayer(validated.nickname, heartColor as HeartColor);
  const session = await createSessionForPlayer(player);
  redirect(`/play/session/${session.id}`);
}
