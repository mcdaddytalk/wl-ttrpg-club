import { SERVER_ENVS as ENVS } from "@/utils/constants/envs"
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${ENVS.NEXT_PUBLIC_SITE_URL}/`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1
        },
        {
            url: `${ENVS.NEXT_PUBLIC_SITE_URL}/games`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1
        },
        {
            url: `${ENVS.NEXT_PUBLIC_SITE_URL}/games/calendar`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1
        },
        {
            url: `${ENVS.NEXT_PUBLIC_SITE_URL}/signup`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1
        },
        {
            url: `${ENVS.NEXT_PUBLIC_SITE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1
        },
        {
            url: `${ENVS.NEXT_PUBLIC_SITE_URL}/terms-of-service`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1
        }
    ];
}