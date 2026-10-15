# Blog SEO publishing standard

Use this checklist for every new article:

1. Copy `blog-private-terminal.html` and give the file a permanent, lowercase, hyphen-separated slug. Never change the slug after publishing without a redirect.
2. Give the page a unique `<title>` (about 50–60 characters), a unique meta description, canonical URL, `robots`/`googlebot` `index,follow` directives, Open Graph tags, and Twitter card tags.
3. Keep the article in real HTML text with one visible `<h1>`, useful `<h2>` sections, descriptive links, and no important content hidden behind JavaScript.
4. Update the page's `BlogPosting` JSON-LD with the exact headline, description, canonical URL, author, publisher, `datePublished`, `dateModified`, image, keywords, and breadcrumb JSON-LD. The structured data must match visible page content.
5. Add the article to `blogs.html` with a normal crawlable `<a href="...">` link. Add it to `blog-feed.xml` and `sitemap.xml` using the same absolute canonical URL.
6. Use an original article, not a lightly rewritten duplicate. Keep claims supportable and label opinions or product positioning clearly.
7. After publishing, deploy the files and submit or inspect the sitemap and URL in Google Search Console. Crawling and indexing are controlled by Google and cannot be guaranteed by metadata alone.

The canonical production origin for all new pages is `https://cheatly.pro/`. Keep URLs HTTPS, absolute in metadata and the sitemap, and consistent with the canonical link.
