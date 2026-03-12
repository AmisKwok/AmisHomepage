export default function sitemap() {
  const baseUrl = "https://www.amisweb.cn";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
