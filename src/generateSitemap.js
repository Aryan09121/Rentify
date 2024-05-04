// generateSitemap.js

import { SitemapStream, streamToPromise } from "sitemap";
import fsExtra from "fs-extra";
import { hostname, urls } from "./sitemap.js";

async function generateSitemap() {
	const sitemapStream = new SitemapStream({ hostname });

	urls.forEach((url) => {
		sitemapStream.write(url);
	});

	sitemapStream.end();

	const sitemap = await streamToPromise(sitemapStream);

	// Write sitemap to public directory
	await fsExtra.createWriteStream("./public/sitemap.xml").write(sitemap);
}

generateSitemap().then(() => console.log("Sitemap generated successfully."));
