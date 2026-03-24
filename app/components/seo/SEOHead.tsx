/**
 * SEO 头部组件
 * 设置页面标题、描述、URL 等元信息
 * 标题格式：页面名 | 站点名
 * 支持多语言
 */
"use client";

import { useTranslation } from "../../stores/language-store";

interface SEOHeadProps {
  title?: string;
  description?: string;
  url?: string;
}

export default function SEOHead({ title, description, url }: SEOHeadProps) {
  const { t } = useTranslation();
  
  // 获取站点名称（支持多语言）
  const siteName = t("siteTitle");
  
  // 格式化标题：页面名 | 站点名
  const formattedTitle = title ? `${title} | ${siteName}` : siteName;
  
  return (
    <>
      <meta name="baidu-site-verification" content="codeva-uFVjOFk9OW" />
      <meta name="google-site-verification" content="l7PKYeoA46P9gOynxJ_7ls2joAm5ZECVy55WBCeOgU8" />
      <title>{formattedTitle}</title>
      {description && <meta name="description" content={description} />}
      {url && <link rel="canonical" href={url} />}
      <meta property="og:title" content={formattedTitle} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
    </>
  );
}
