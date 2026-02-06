import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Champagne Stock",
    short_name: "Stock",
    start_url: "/",
    display: "standalone"
  };
}
