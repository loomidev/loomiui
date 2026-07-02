import type { LoomiColor } from "@loomidev/core";

export const PARTICIPANT_COLORS = [
  "primary",
  "blue",
  "purple",
  "pink",
  "success",
  "warning",
  "cyan",
  "secondary",
] as const satisfies readonly LoomiColor[];

export type LoomiChatParticipantColor = (typeof PARTICIPANT_COLORS)[number];

export interface LoomiChatParticipant {
  id: string;
  name: string;
  image?: string;
  /** Initials shown when `image` is absent. Defaults to the first letters of `name`. */
  label?: string;
  color?: LoomiChatParticipantColor | string;
}

export interface LoomiChatMessageData {
  id: string;
  text: string;
  senderId: string;
  /** @deprecated Prefer `senderId`. Kept for simple user/assistant demos. */
  role?: "user" | "assistant";
}

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export function colorForParticipant(
  id: string,
  explicit?: LoomiChatParticipantColor | string,
): LoomiChatParticipantColor {
  if (explicit && PARTICIPANT_COLORS.includes(explicit as LoomiChatParticipantColor)) {
    return explicit as LoomiChatParticipantColor;
  }
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % PARTICIPANT_COLORS.length;
  }
  return PARTICIPANT_COLORS[hash]!;
}

export function bubbleVars(color: LoomiChatParticipantColor | string): string {
  const resolved = PARTICIPANT_COLORS.includes(color as LoomiChatParticipantColor)
    ? (color as LoomiChatParticipantColor)
    : colorForParticipant(String(color));
  return [
    `--loomi-chat-bubble-bg: var(--loomi-${resolved}-50, var(--_loomi-${resolved}-50-default))`,
    `--loomi-chat-bubble-border: var(--loomi-${resolved}-200, var(--_loomi-${resolved}-200-default))`,
    // The 50-scale background stays light in dark mode too, so pin the text to the
    // dark end of the same hue instead of the theme's (possibly light) text color.
    `--loomi-chat-bubble-text: var(--loomi-${resolved}-950, var(--_loomi-${resolved}-950-default))`,
  ].join("; ");
}

export function resolveParticipant(
  participants: LoomiChatParticipant[],
  senderId: string,
): LoomiChatParticipant {
  const found = participants.find((entry) => entry.id === senderId);
  if (found) return found;
  return {
    id: senderId,
    name: senderId,
    label: initialsFor(senderId),
    color: colorForParticipant(senderId),
  };
}

export function resolveSenderId(
  message: Pick<LoomiChatMessageData, "senderId" | "role">,
  currentUserId: string,
): string {
  if (message.senderId) return message.senderId;
  if (message.role === "user") return currentUserId;
  if (message.role === "assistant") return "assistant";
  return currentUserId;
}
