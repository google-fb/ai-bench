export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 space-y-2">
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">{title}</h1>
      {description ? (
        <p className="max-w-3xl text-base leading-8 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
