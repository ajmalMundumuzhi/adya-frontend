
import useHeaderSettings from "../../hooks/useHeaderSettings";

export default function HeaderContact() {
  const settings = useHeaderSettings();

  return (
    <div className="hidden items-start gap-8 xl:flex">
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-lg font-semibold leading-tight text-ink">
          {settings.callHeading}
        </span>
        <a
          href={`tel:${settings.phone.replace(/\s/g, "")}`}
          className="text-sm text-ink/70 hover:text-burgundy"
        >
          {settings.phone}
        </a>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="font-display text-lg font-semibold leading-tight text-ink">
          {settings.questionsHeading}
        </span>
        <a
          href={`mailto:${settings.email}`}
          className="text-sm text-ink/70 hover:text-burgundy"
        >
          {settings.email}
        </a>
      </div>
    </div>
  );
}
