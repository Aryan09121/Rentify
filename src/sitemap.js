/* eslint-disable no-unused-vars */
const hostname = "http://localhost:5173/";

const urls = [
	{ url: "/", changefreq: "daily", priority: 1 },
	{ url: "/dashboard", changefreq: "daily", priority: 0.8 },
	{ url: "/invoices", changefreq: "daily", priority: 0.8 },
	{ url: "/charges/details", changefreq: "daily", priority: 0.8 },
	{ url: "/bill", changefreq: "daily", priority: 0.8 },
	{ url: "/charges", changefreq: "daily", priority: 0.8 },
	{ url: "/profile/owner", changefreq: "daily", priority: 0.8 },
	{ url: "/profile/owner/edit/:id", changefreq: "daily", priority: 0.8 },
	{ url: "/profile/owner/:id", changefreq: "daily", priority: 0.8 },
	{ url: "/settings", changefreq: "daily", priority: 0.8 },
	{ url: "/search", changefreq: "daily", priority: 0.8 },
	{ url: "/billungs", changefreq: "daily", priority: 0.8 },
	{ url: "/billings/:id", changefreq: "daily", priority: 0.8 },
	{ url: "/add/new", changefreq: "daily", priority: 0.8 },
	{ url: "/add/new/owner", changefreq: "daily", priority: 0.8 },
	{ url: "/add/trip", changefreq: "daily", priority: 0.8 },
];

export { hostname, urls };
