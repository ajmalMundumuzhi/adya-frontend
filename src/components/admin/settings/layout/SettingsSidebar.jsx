
import {
  Globe,
  Megaphone,
  Navigation,
  House,
  BookOpen,
  Image,
  ShieldCheck,
  Mail,
  PanelBottom,
  Share2,
  FileText,
  Package,
} from "lucide-react";

const SECTION_ICONS = {
  general: Globe,
  announcement: Megaphone,
  header: Navigation,
  homepage: House,
  brandStory: BookOpen,
  seasonalBanner: Image,
  trustBenefits: ShieldCheck,
  newsletter: Mail,
  ourStory: BookOpen,
  footer: PanelBottom,
  socialMedia: Share2,
  policies: FileText,
  inventory: Package,
};

export default function SettingsSidebar({
  sections,
  activeSection,
  onChange,
}) {
  const groups = ["Website", "Pages", "Store"];

  return (
    <aside className="w-full shrink-0 rounded-xl border border-stone-200 bg-white p-3 xl:sticky xl:top-6 xl:w-64">
      <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
        Settings menu
      </p>

      <nav className="space-y-4">
        {groups.map((group) => {
          const groupSections = sections.filter(
            (section) => section.group === group
          );

          return (
            <div key={group}>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                {group}
              </p>

              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 xl:grid-cols-1">
                {groupSections.map((section) => {
                  const Icon = SECTION_ICONS[section.id];
                  const active = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => onChange(section.id)}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        active
                          ? "bg-stone-900 font-medium text-white"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      {Icon && <Icon size={17} strokeWidth={1.8} />}
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
