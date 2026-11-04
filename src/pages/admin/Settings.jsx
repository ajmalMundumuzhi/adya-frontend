
import { useState } from "react";
import SettingsLayout from "../../components/admin/settings/layout/SettingsLayout";
import SettingsSidebar from "../../components/admin/settings/layout/SettingsSidebar";
import SettingsHeader from "../../components/admin/settings/layout/SettingsHeader";
import GeneralSettings from "../../components/admin/settings/sections/GeneralSettings";
import AnnouncementSettings from "../../components/admin/settings/sections/AnnouncementSettings";
import HeaderSettings from "../../components/admin/settings/sections/HeaderSettings";
import HomepageSettings from "../../components/admin/settings/sections/HomepageSettings";
import BrandStorySettings from "../../components/admin/settings/sections/BrandStorySettings";
import SeasonalBannerSettings from "../../components/admin/settings/sections/SeasonalBannerSettings";
import TrustBenefitsSettings from "../../components/admin/settings/sections/TrustBenifitsSettings";
import NewsletterSettings from "../../components/admin/settings/sections/NewsletterSettings";
import OurStorySettings from "../../components/admin/settings/sections/OurStorySettings";
import FooterSettings from "../../components/admin/settings/sections/FooterSettings";
import SocialMediaSettings from "../../components/admin/settings/sections/SocialMediaSettings";
import PoliciesSettings from "../../components/admin/settings/sections/PoliciesSettings";
import InventorySettings from "../../components/admin/settings/sections/InventorySettings";

const SETTINGS_SECTIONS = [
  { id: "general", label: "General Settings", group: "Website" },
  { id: "announcement", label: "Announcement Bar", group: "Website" },
  { id: "header", label: "Header & Navigation", group: "Website" },
  { id: "homepage", label: "Homepage", group: "Website" },
  { id: "brandStory", label: "Brand Story", group: "Website" },
  { id: "seasonalBanner", label: "Seasonal Banner", group: "Website" },
  { id: "trustBenefits", label: "Trust Benefits", group: "Website" },
  { id: "newsletter", label: "Newsletter", group: "Website" },
  { id: "ourStory", label: "Our Story Page", group: "Pages" },
  { id: "footer", label: "Footer", group: "Website" },
  { id: "socialMedia", label: "Social Media", group: "Website" },
  { id: "policies", label: "Policies", group: "Pages" },
  { id: "inventory", label: "Inventory", group: "Store" },
];

const SECTION_DESCRIPTIONS = {
  general: "Manage your store identity and contact information.",
  announcement: "Control the messages displayed in your announcement bar.",
  header: "Manage your contact information and navigation labels.",
  homepage: "Edit your homepage section headings and introductory content.",
  brandStory: "Manage your homepage brand story section.",
  seasonalBanner: "Edit your seasonal promotional banner.",
  trustBenefits: "Manage the benefits displayed on your homepage.",
  newsletter: "Manage your newsletter section content.",
  ourStory: "Edit the content displayed on your Our Story page.",
  footer: "Manage your website footer content and links.",
  socialMedia: "Manage your social media profiles and links.",
  policies: "Edit your Privacy Policy, Terms & Conditions, and Returns & Refunds Policy.",
  inventory: "Configure your store inventory settings.",
};

export default function Settings() {
  const [activeSection, setActiveSection] = useState("general");

  const currentSection = SETTINGS_SECTIONS.find(
    (section) => section.id === activeSection
  );

  function renderSection() {
    switch (activeSection) {
      case "general":
        return <GeneralSettings />;

      case "announcement":
        return <AnnouncementSettings />;

      case "header":
        return <HeaderSettings />;

      case "homepage":
        return <HomepageSettings />;

      case "brandStory":
        return <BrandStorySettings />;

      case "seasonalBanner":
        return <SeasonalBannerSettings />;

      case "trustBenefits":
        return <TrustBenefitsSettings />;

      case "newsletter":
        return <NewsletterSettings />;

      case "ourStory":
        return <OurStorySettings />;

      case "footer":
        return <FooterSettings />;

      case "socialMedia":
        return <SocialMediaSettings />;

      case "policies":
        return <PoliciesSettings />;

      case "inventory":
        return <InventorySettings />;

      default:
        return (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <h3 className="text-base font-semibold text-gray-800">
              {currentSection?.label}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              This section will be implemented in the next stage.
            </p>
          </div>
        );
    }
  }

  return (
    <SettingsLayout>
      <SettingsSidebar
        sections={SETTINGS_SECTIONS}
        activeSection={activeSection}
        onChange={setActiveSection}
      />

      <main className="min-w-0 flex-1">
        <SettingsHeader
          title={currentSection?.label || "Settings"}
          description={SECTION_DESCRIPTIONS[activeSection]}
        />

        {renderSection()}
      </main>
    </SettingsLayout>
  );
}
