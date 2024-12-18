import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://gaemigul-guide.com',
        },
        {
            url: 'https://gaemigul-guide/travel',
        },
    ]
}