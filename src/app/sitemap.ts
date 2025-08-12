import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://gaemigul-guide.hyno.kr',
        },
        {
            url: 'https://gaemigul-guide.hyno.kr/travel',
        },
    ]
}