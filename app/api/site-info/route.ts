/**
 * 网站信息抓取 API
 * GET /api/site-info?url=https://example.com
 * 从指定 URL 抓取网站元信息
 * 返回网站名称、描述、图标等信息
 * 用于友链页面自动获取网站信息
 */
import { NextRequest, NextResponse } from "next/server";

/**
 * 解码 HTML 实体
 * 将 &amp; &lt; &gt; 等实体转换为对应字符
 * @param text - 包含 HTML 实体的文本
 * @returns 解码后的文本
 */
function decodeHtmlEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&#x27;': "'",
    '&#39;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&nbsp;': ' ',
  };
  
  let decoded = text;
  // 替换常见实体
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.split(entity).join(char);
  }
  
  // 替换十六进制实体 &#xHH;
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/gi, (_, hex) => 
    String.fromCharCode(parseInt(hex, 16))
  );
  // 替换十进制实体 &#DDD;
  decoded = decoded.replace(/&#(\d+);/g, (_, num) => 
    String.fromCharCode(parseInt(num, 10))
  );
  
  return decoded;
}

/**
 * 获取网站信息
 * @param request - 包含 url 查询参数的请求
 * @returns 网站名称、描述、头像、图标等信息
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  // 验证 URL 参数
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const urlObj = new URL(url);
    
    // 抓取网页内容
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch page");
    }

    const html = await response.text();
    
    // 提取标题
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // 提取 Open Graph 标题
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    const ogTitle = ogTitleMatch ? ogTitleMatch[1] : "";

    // 提取描述
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1] : "";

    // 提取 Open Graph 描述
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    const ogDescription = ogDescMatch ? ogDescMatch[1] : "";

    // 提取图标
    const iconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i);
    const icon = iconMatch ? iconMatch[1] : "";

    // 提取 Open Graph 图片
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    const ogImage = ogImageMatch ? ogImageMatch[1] : "";

    // 处理图标 URL
    let faviconUrl = "";
    if (icon) {
      if (icon.startsWith("//")) {
        faviconUrl = `https:${icon}`;
      } else if (icon.startsWith("/")) {
        faviconUrl = `${urlObj.origin}${icon}`;
      } else if (icon.startsWith("http")) {
        faviconUrl = icon;
      } else {
        faviconUrl = `${urlObj.origin}/${icon}`;
      }
    } else {
      // 使用默认 favicon
      faviconUrl = `${urlObj.origin}/favicon.ico`;
    }

    // 组装结果
    const siteName = decodeHtmlEntities(ogTitle || title || urlObj.hostname);
    const siteDescription = decodeHtmlEntities(ogDescription || description || "");
    const siteAvatar = ogImage || faviconUrl;

    return NextResponse.json({
      success: true,
      data: {
        name: siteName,
        description: siteDescription,
        avatar: siteAvatar,
        favicon: faviconUrl,
      },
    });
  } catch (error) {
    console.error("Failed to fetch site info:", error);
    
    // 抓取失败时返回基本信息
    try {
      const urlObj = new URL(url);
      return NextResponse.json({
        success: true,
        data: {
          name: urlObj.hostname.replace("www.", ""),
          description: "",
          avatar: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`,
          favicon: `${urlObj.origin}/favicon.ico`,
        },
      });
    } catch {
      return NextResponse.json({ 
        success: false, 
        error: "Failed to fetch site info" 
      }, { status: 500 });
    }
  }
}
