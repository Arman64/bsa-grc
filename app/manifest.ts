import type { MetadataRoute } from "next";
import { COMPANY_INFO } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${COMPANY_INFO.name} - ${COMPANY_INFO.tagline}`,
    short_name: COMPANY_INFO.name,
    description: COMPANY_INFO.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#7A0C10",
    icons: [
      {
        src: "https://bsagrc.co.id/wp-content/uploads/2023/10/Favicon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
