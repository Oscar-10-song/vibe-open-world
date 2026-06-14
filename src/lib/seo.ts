import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

// ============================================================
// SEO 元数据工厂
// ============================================================

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
}

/**
 * 构造统一的 Metadata 对象
 */
export function constructMetadata({
  title,
  description,
  ogImage,
  ogType = 'website',
  noIndex = false,
}: SEOProps = {}): Metadata {
  const fullTitle = title
    ? `${title} — ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`;

  const fullDescription = description || SITE_CONFIG.description;
  const imageUrl = ogImage || SITE_CONFIG.ogImage;

  return {
    title: fullTitle,
    description: fullDescription,
    ...(noIndex && { robots: { index: false, follow: false } }),

    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type: ogType,
    },

    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [imageUrl],
      creator: SITE_CONFIG.twitter,
    },

    alternates: {
      canonical: SITE_CONFIG.url,
    },
  };
}

/**
 * 项目详情 SEO
 */
export function projectSEO(project: {
  title: string;
  tagline: string;
  screenshot_url: string;
  ai_tools?: { name: string }[];
}): Metadata {
  const tools = project.ai_tools?.map(t => t.name).join(', ') || 'AI';
  return constructMetadata({
    title: project.title,
    description: project.tagline,
    ogImage: project.screenshot_url,
    ogType: 'article',
  });
}

/**
 * 分类页 SEO
 */
export function categorySEO(category: { name: string; description?: string | null }): Metadata {
  return constructMetadata({
    title: `Best ${category.name} Projects Built with AI`,
    description:
      category.description ||
      `Browse ${category.name.toLowerCase()} projects built by AI-powered developers around the world.`,
  });
}
