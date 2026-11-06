
import { useEffect, useState } from "react";
import api from "../services/api";

export const DEFAULT_HOMEPAGE_SETTINGS = {
  arrivals: {
    eyebrow: "Just arrived",
    title: "New arrivals",
    description: "Fresh finds selected to bring a new perspective to timeless dressing.",
    linkLabel: "View all new arrivals",
  },
  collection: {
    eyebrow: "LOVED CLASSICS",
    title: "Best Sellers",
    description: "Discover timeless pieces from the ADYA collection.",
    linkLabel: "Shop all sarees",
  },
  category: {
    eyebrow: "Find your favourite drape",
    title: "Explore saree traditions",
    description: "Discover textures, techniques and timeless silhouettes for every kind of occasion.",
    linkLabel: "View our collection",
    moreTitle: "More ways to drape",
    moreLinkLabel: "View all",
  },
  brandStory: {
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1300&q=85",
    imageAlt: "Detail of richly textured traditional Indian fabric",
    eyebrow: "The ADYA point of view",
    title: "A story of texture, colour and belonging.",
    paragraphOne: "A saree can hold a memory, mark a new beginning or simply make an ordinary day feel special. ADYA brings together a considered edit of Indian-inspired drapes for the moments you make your own.",
    paragraphTwo: "Our story is still being written. Explore the collection and find the pieces that speak to your personal style.",
    linkLabel: "Discover our story",
  },
  seasonalBanner: {
    image: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1800&q=85",
    imageAlt: "Festive Indian occasion-wear inspiration",
    eyebrow: "The seasonal edit",
    title: "Seasonal elegance, your way.",
    description: "A considered selection of rich colours, delicate textures and celebratory drapes for the season ahead.",
    linkLabel: "Explore the seasonal edit",
  },
  trustBenefits: [
    {
      icon: "PackageCheck",
      title: "International delivery",
      text: "Shipping options for customers across our supported destinations.",
    },
    {
      icon: "ShieldCheck",
      title: "A considered checkout",
      text: "Clear order details and a straightforward shopping experience.",
    },
    {
      icon: "MessageCircle",
      title: "Here to help",
      text: "Support for questions about your order and choosing your saree.",
    },
    {
      icon: "RefreshCw",
      title: "Clear policies",
      text: "Review shipping, returns and exchange information before ordering.",
    },
  ],
  newsletter: {
    eyebrow: "Letters from ADYA",
    title: "A little elegance in your inbox.",
    description: "Be the first to discover new arrivals, pastel edits and styling inspiration.",
    placeholder: "Your email address",
    buttonLabel: "Subscribe",
    invalidMessage: "Please enter a valid email address.",
    successMessage: "Thank you! Your email has been validated locally.",
  },
};

export default function useHomepageSettings() {
  const [settings, setSettings] = useState(DEFAULT_HOMEPAGE_SETTINGS);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const response = await api.get("/settings/site.homepage");
        const saved = response.data?.data?.value;

        if (!active || !saved) return;

        setSettings((current) => ({
          ...current,
          ...saved,
          arrivals: { ...current.arrivals, ...saved.arrivals },
          collection: { ...current.collection, ...saved.collection },
          category: { ...current.category, ...saved.category },
          brandStory: { ...current.brandStory, ...saved.brandStory },
          seasonalBanner: { ...current.seasonalBanner, ...saved.seasonalBanner },
          newsletter: { ...current.newsletter, ...saved.newsletter },
          trustBenefits: Array.isArray(saved.trustBenefits)
            ? saved.trustBenefits
            : current.trustBenefits,
        }));
      } catch (error) {
        console.error("Failed to load homepage settings:", error);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  return settings;
}
