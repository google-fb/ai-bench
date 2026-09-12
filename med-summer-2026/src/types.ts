export type Tag = "vaccine" | "gene" | "cancer" | "brain";

export type Stage = "approved" | "phase3" | "early";

export type Copy = {
  zh: string;
  en: string;
};

export type Section = {
  label: Copy;
  body: Copy;
};

export type Source = {
  label: string;
  href: string;
};

export type LabHotspot = {
  id: string;
  label: Copy;
  body: Copy;
};

export type LabStep = {
  id: string;
  title: Copy;
  how: Copy;
};

export type Lab = {
  kind: string;
  title: Copy;
  lesson: Copy;
  how: Copy;
  hint: Copy;
  steps: LabStep[];
  hotspots: LabHotspot[];
};

export type Article = {
  slug: string;
  rank: number;
  date: string;
  dateLabel: Copy;
  tag: Tag;
  stage: Stage;
  title: Copy;
  dek: Copy;
  images: Array<{ src: string; alt: Copy }>;
  sections: Section[];
  sources: Source[];
  lab: Lab;
};

export type Prefs = {
  theme: "light" | "dark";
  size: "sm" | "md" | "lg";
  lang: "both" | "zh" | "en";
};
