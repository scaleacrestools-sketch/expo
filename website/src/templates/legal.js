const { esc } = require('./helpers');

const PAGES = {
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'How this website collects, uses and protects the personal information you share with us.',
    body: (site) => `
<p>This Privacy Policy explains how ${esc(site.legalEntity)} ("we", "us") collects, uses and protects personal information submitted through this website. It is published in line with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.</p>
<h2>Information we collect</h2>
<ul><li><strong>Information you provide:</strong> your name, mobile number, email address, project interest, property purpose, preferred contact time, enquiry type and any message you send through our forms.</li><li><strong>Attribution data:</strong> the page you submitted from, campaign parameters (UTM) present in the link you followed, and the time of submission.</li><li><strong>Usage data:</strong> with your consent, analytics cookies that help us understand how the website is used. You can decline analytics cookies in the notice shown on your first visit.</li></ul>
<h2>How we use it</h2>
<ul><li>To respond to your enquiry, share brochures, guides and project information, and arrange site visits.</li><li>To contact you by phone, email, SMS or WhatsApp about the project you enquired about and related Assetz developments, where you have consented.</li><li>To measure the performance of our marketing campaigns and improve the website.</li></ul>
<h2>Sharing</h2>
<p>Enquiries are stored in our customer relationship management system and shared only with our sales advisory team and authorised channel partners who assist with your enquiry. We do not sell personal information.</p>
<h2>Retention and your rights</h2>
<p>We retain enquiry records for as long as needed to serve your request and to meet legal obligations. You may ask us to access, correct or delete your information, or to stop contacting you, by writing to <a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a>.</p>
<h2>Security</h2>
<p>Form submissions are transmitted over HTTPS and validated and rate-limited on our servers. Integration credentials are never exposed in the browser.</p>
<h2>Contact</h2>
<p>${esc(site.legalEntity)}, ${esc(site.contact.address)}. Email: <a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a>.</p>
<p><em>Last updated: 21 November 2026.</em></p>`,
  },
  'terms-and-conditions': {
    title: 'Terms and Conditions',
    description: 'Terms governing the use of this website and the information it presents.',
    body: (site) => `
<p>By accessing this website you agree to the following terms. If you do not agree, please do not use the website.</p>
<h2>Nature of information</h2>
<p>The website presents general information about residential developments by Assetz. Plans, specifications, images, areas, prices, amenities and timelines are indicative, are sourced from the developer's published material and are subject to change in line with statutory approvals. Nothing on this website constitutes an offer, an invitation to offer or a legally binding agreement.</p>
<h2>RERA</h2>
<p>Registration details for each project, where published by the developer, appear on the respective project page. Buyers should verify registration on the Karnataka RERA portal and rely only on the agreement for sale and documents executed with the developer.</p>
<h2>Use of the website</h2>
<ul><li>You may not copy, reproduce or distribute website content without permission.</li><li>You agree to submit accurate information through enquiry forms and not to misuse them.</li><li>We may change, suspend or discontinue any part of the website without notice.</li></ul>
<h2>Limitation of liability</h2>
<p>To the fullest extent permitted by law, ${esc(site.legalEntity)} is not liable for any loss arising from reliance on website content or from the use of third-party links.</p>
<h2>Governing law</h2>
<p>These terms are governed by the laws of India. Courts at Bengaluru have exclusive jurisdiction.</p>
<p><em>Last updated: 21 November 2026.</em></p>`,
  },
  'disclaimer': {
    title: 'Disclaimer',
    description: 'Disclaimer regarding project information, imagery and pricing on this website.',
    body: (site) => `
<p>${esc(site.partnerNotice)}</p>
<h2>Project information</h2>
<ul><li>Areas, configurations, prices and possession timelines are shown only where published by the developer. Fields the developer has not published are marked "Not Mentioned" or "Price on Request".</li><li>Images, walkthroughs and plans are artist's impressions or renders published by the developer and are for representation only.</li><li>Where official sources are inconsistent, this website records the discrepancy on the relevant project page instead of selecting a value.</li></ul>
<h2>No investment advice</h2>
<p>Content on this website, including the downloadable homebuyer's guide and blog articles, is general information and not legal, financial or investment advice. No returns, appreciation or rental yields are promised or implied.</p>
<h2>Third-party links</h2>
<p>Links to maps, social networks and other websites are provided for convenience; we are not responsible for their content.</p>
<p>For project-specific documents, please contact <a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a> or call ${esc(site.contact.phone)}.</p>
<p><em>Last updated: 21 November 2026.</em></p>`,
  },
};

const meta = ({ site }, key) => ({ title: `${PAGES[key].title} | Assetz`, description: PAGES[key].description, solidHeader: true, noindex: false });
function render({ site }, key) {
  const p = PAGES[key];
  return `<section class="band" style="padding-top:calc(var(--header-h) + 3rem)"><div class="container"><nav class="crumbs" aria-label="Breadcrumb" style="color:var(--stone)"><a href="/">Home</a><span>${esc(p.title)}</span></nav><h1 style="margin-bottom:2rem">${esc(p.title)}</h1><div class="prose-page">${p.body(site)}</div></div></section>`;
}
module.exports = { meta, render };
