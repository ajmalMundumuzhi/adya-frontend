
import { useEffect, useState } from "react";
import api from "../services/api";
import { SITE } from "../config/site";

export const DEFAULT_HEADER_SETTINGS = {
  callHeading: "Call Us",
  questionsHeading: "Any questions",
  phone: SITE.phone,
  email: SITE.email,
  navigation: {
    home: "Home",
    shop: "Shop All",
    sarees: "Sarees",
    story: "Our Story",
  },
  accountLabel: "Login / Register",
  wishlistLabel: "Wishlist",
  cartLabel: "Shopping cart",
};

export default function useHeaderSettings() {
  const [settings, setSettings] = useState(DEFAULT_HEADER_SETTINGS);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const response = await api.get("/settings/site.header");
        const saved = response.data?.data?.value;

        if (active && saved) {
          setSettings({
            ...DEFAULT_HEADER_SETTINGS,
            ...saved,
            navigation: {
              ...DEFAULT_HEADER_SETTINGS.navigation,
              ...saved.navigation,
            },
          });
        }
      } catch (error) {
        console.error("Failed to load header settings:", error);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  return settings;
}
