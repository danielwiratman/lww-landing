// Decap CMS is now loaded from the CDN in site/static/admin/index.html.
// This entry point is kept so the webpack build doesn't break (it expects
// a "cms" entry), but the actual CMS code lives in the browser-side script.
//
// If you ever want to bundle Decap locally (e.g. for offline / air-gapped
// deployments), restore the original CMS app import here and make sure
// decap-cms-app, react, react-dom, etc. are still in package.json.
export {};
