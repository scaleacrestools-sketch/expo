// All approved homepage copy lives here so it can be edited without touching layout code.
const img = (file) => `${import.meta.env.BASE_URL}images/${file}`;

export const CONTACT = {
  phones: ['+91 86182 97315', '+91 95130 66007'],
  whatsapp: '+91 86182 97315',
  whatsappLink: 'https://wa.me/918618297315',
  email: '1estateconsultants@gmail.com',
  address: [
    '219, 4th Floor,',
    '3rd D Cross Road,',
    'Doctors Layout,',
    'East of NGEF Layout,',
    'Bennigana Halli,',
    'Bengaluru,',
    'Karnataka – 560043',
  ],
  hours: { days: 'Wednesday – Monday', time: '10:30 AM – 7:30 PM' },
  rera: 'PRM/KA/RERA/1251/309/AG/250917/006195',
  gstin: '29BDOPS6018J1ZV',
};

export const telHref = (phone) => `tel:${phone.replace(/\s/g, '')}`;

export const whatsappHref = (projectName) =>
  `${CONTACT.whatsappLink}?text=${encodeURIComponent(
    projectName
      ? `Hello 1 Estate Consultants, I would like to know more about ${projectName}.`
      : 'Hello 1 Estate Consultants, I would like to know more.'
  )}`;

export const IMAGES = {
  logo: img('logo-gold.png'),
  hero: img('hero-aerial.jpg'),
  interior: img('interior-bedroom.jpg'),
  rajkunjPortrait: img('rajkunj-portrait.jpg'),
  rajkunjSquare: img('rajkunj-square.jpg'),
  rajkunjStreet: img('rajkunj-street.jpg'),
  akruti: img('elv-akruti-ark.jpg'),
  kingslandNight: img('elv-kingsland-night.jpg'),
  kingslandAerial: img('elv-kingsland-aerial.jpg'),
};

export const NAV_LEFT = [
  { label: 'Home', href: '#top' },
  { label: 'About Us', href: '#about' },
  { label: 'Properties', href: '#properties' },
];

export const NAV_RIGHT = [
  { label: 'Blog', href: '#blog' },
  { label: 'Contact Us', href: '#contact' },
];

export const FEATURED = [
  {
    name: 'ELV Akruti Ark',
    location: 'Sarjapur Attibele Road, Bangalore',
    image: IMAGES.akruti,
    alt: 'ELV Akruti Ark row villas illuminated at dusk',
  },
  {
    name: 'ELV Kingsland',
    location: 'Whitefield, Bangalore',
    image: IMAGES.kingslandNight,
    alt: 'ELV Kingsland residential towers at night',
  },
  {
    name: 'ELV Kingsland',
    location: 'Whitefield, Bangalore',
    image: IMAGES.kingslandAerial,
    alt: 'Aerial view of ELV Kingsland surrounded by greenery',
  },
];

export const STATS = [
  { value: 20, suffix: '+', label: ['Prime Bangalore', 'Locations'] },
  { value: 15, suffix: '+', label: ['Curated Projects', 'Across Bangalore'] },
  { value: 500, suffix: '+', label: ['Happy Property', 'Buyers'] },
  { value: 12, suffix: '+', label: ['Leading Developer', 'Associations'] },
];

// Current reference content: six Rajkunj listings (only approved details are shown).
const rajkunjShots = [
  { image: IMAGES.rajkunjSquare, position: 'center 40%' },
  { image: IMAGES.rajkunjStreet, position: 'center 45%' },
  { image: IMAGES.rajkunjPortrait, position: 'center 42%' },
];

export const PROPERTIES = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: 'Rajkunj',
  location: 'Newtown, Bengaluru',
  ...rajkunjShots[i % rajkunjShots.length],
  alt: 'Rajkunj residential building exterior, Newtown, Bengaluru',
}));

export const BLOGS = [
  {
    title: 'A Guide to Buying Property in Bangalore',
    excerpt:
      'Understand the important factors to consider before choosing your next home or investment property.',
    image: IMAGES.rajkunjStreet,
    position: 'center 55%',
  },
  {
    title: 'How to Choose the Right Bangalore Location',
    excerpt:
      'Explore how connectivity, infrastructure, lifestyle and future development can influence your property decision.',
    image: IMAGES.hero,
    position: 'center 60%',
  },
  {
    title: 'Residential vs Commercial Property: What Should You Consider?',
    excerpt:
      'Understand the major differences before selecting a property based on your goals and requirements.',
    image: IMAGES.kingslandNight,
    position: 'center 50%',
  },
  {
    title: 'What to Check Before Booking a Property',
    excerpt:
      'From developer credentials and RERA details to pricing and specifications, know what deserves your attention before booking.',
    image: IMAGES.interior,
    position: 'center 62%',
  },
];

export const FAQS = [
  {
    q: 'What does 1 Estate Consultants do?',
    a: '1 Estate Consultants is a Bangalore-based real estate advisory firm helping buyers, investors and businesses discover suitable residential, commercial and investment properties through personalised and transparent guidance.',
  },
  {
    q: 'Which locations do you operate in?',
    a: 'We currently provide property advisory and project options across Bangalore.',
  },
  {
    q: 'What types of properties do you deal in?',
    a: 'We assist clients with premium residential homes, commercial spaces and investment-focused real estate opportunities across Bangalore.',
  },
  {
    q: 'Can you help me choose between different projects?',
    a: 'Yes. Our advisory approach helps you evaluate suitable projects based on your requirements, location preference, budget and overall objectives.',
  },
  {
    q: 'Can I schedule a site visit through the website?',
    a: 'Yes. Submit the Request a Site Visit form and our team will connect with you to coordinate the visit.',
  },
  {
    q: 'Do you assist first-time property buyers?',
    a: 'Yes. We assist first-time homebuyers as well as experienced investors and businesses looking for their next property.',
  },
  {
    q: 'How can I contact 1 Estate Consultants?',
    a: 'You can contact our team by phone, WhatsApp, email or by submitting an enquiry through the website.',
  },
];

export const FOOTER_LINKS = {
  quick: [
    { label: 'Home', href: '#top' },
    { label: 'About Us', href: '#about' },
    { label: 'Properties', href: '#properties' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact Us', href: '#contact' },
    { label: 'Request A Site Visit', href: '#contact' },
  ],
  property: [
    { label: 'Residential Properties', href: '#properties' },
    { label: 'Commercial Properties', href: '#properties' },
    { label: 'Apartments', href: '#properties' },
    { label: 'Villas', href: '#properties' },
    { label: 'Featured Projects', href: '#featured' },
    { label: 'View All Properties', href: '#properties' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Disclaimer', href: '#disclaimer' },
  ],
};
