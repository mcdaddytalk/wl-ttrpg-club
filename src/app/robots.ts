import { SERVER_ENVS as ENVS } from "@/utils/constants/envs"
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/private/",
        },
        sitemap: `${ENVS.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    };
}