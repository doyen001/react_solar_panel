export type MessageThreadContact = {
  id: string;
  /** Shown in the switcher and thread header */
  displayName: string;
};

export type DemoChatMessage = {
  id: string;
  /** Logged-in user vs selected contact */
  role: "user" | "contact";
  body: string;
  timeLabel: string;
};
