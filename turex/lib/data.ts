export type Destination = {
  name: string;
  location: string;
  image: string;
  alt: string;
  price: string;
  duration: string;
  rating: number;
  tagline: string;
};

export const destinations: Destination[] = [
  {
    name: 'Taj Mahal',
    location: 'Agra, Uttar Pradesh',
    image:
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80&auto=format&fit=crop',
    alt: 'The Taj Mahal glowing at sunrise in Agra',
    price: '₹18,500',
    duration: '3 days',
    rating: 4.9,
    tagline: 'An eternal monument to love, best met at first light.',
  },
  {
    name: 'Jaipur',
    location: 'Rajasthan',
    image:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80&auto=format&fit=crop',
    alt: 'The pink facade of Hawa Mahal in Jaipur',
    price: '₹24,900',
    duration: '4 days',
    rating: 4.8,
    tagline: 'Palaces, bazaars, and the amber glow of the Pink City.',
  },
  {
    name: 'Kerala Backwaters',
    location: 'Alleppey, Kerala',
    image:
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80&auto=format&fit=crop',
    alt: 'A traditional houseboat drifting through the Kerala backwaters',
    price: '₹32,000',
    duration: '5 days',
    rating: 4.9,
    tagline: 'Drift past coconut groves on a private houseboat.',
  },
  {
    name: 'Leh–Ladakh',
    location: 'Ladakh',
    image:
      'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&q=80&auto=format&fit=crop',
    alt: 'High-altitude lake and mountains in Ladakh',
    price: '₹45,500',
    duration: '7 days',
    rating: 4.9,
    tagline: 'Lunar landscapes and monasteries above the clouds.',
  },
  {
    name: 'Goa',
    location: 'Konkan Coast',
    image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80&auto=format&fit=crop',
    alt: 'Palm trees leaning over a golden Goa beach',
    price: '₹21,900',
    duration: '4 days',
    rating: 4.7,
    tagline: 'Golden sand, susegad afternoons, Portuguese lanes.',
  },
  {
    name: 'Varanasi',
    location: 'Uttar Pradesh',
    image:
      'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=1200&q=80&auto=format&fit=crop',
    alt: 'Boats on the Ganges in front of the Varanasi ghats',
    price: '₹16,800',
    duration: '3 days',
    rating: 4.8,
    tagline: 'Dawn on the Ganges, where time moves differently.',
  },
];

export type TravelPackage = {
  name: string;
  route: string;
  image: string;
  alt: string;
  price: string;
  duration: string;
  rating: number;
  highlights: string[];
  featured?: boolean;
};

export const packages: TravelPackage[] = [
  {
    name: 'The Golden Triangle',
    route: 'Delhi · Agra · Jaipur',
    image:
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80&auto=format&fit=crop',
    alt: 'The Taj Mahal reflected in water',
    price: '₹42,900',
    duration: '6 days · 5 nights',
    rating: 4.9,
    highlights: ['Sunrise Taj Mahal entry', 'Amber Fort by jeep', 'Old Delhi food walk'],
  },
  {
    name: 'Himalayan Horizons',
    route: 'Leh · Nubra · Pangong',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop',
    alt: 'Snow-capped Himalayan peaks under a clear sky',
    price: '₹58,500',
    duration: '8 days · 7 nights',
    rating: 4.9,
    highlights: ['Khardung La pass', 'Camping at Pangong Tso', 'Monastery mornings'],
    featured: true,
  },
  {
    name: 'Kerala, Slowly',
    route: 'Kochi · Munnar · Alleppey',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80&auto=format&fit=crop',
    alt: 'Rolling green tea plantations in Munnar',
    price: '₹38,900',
    duration: '7 days · 6 nights',
    rating: 4.8,
    highlights: ['Private houseboat night', 'Tea estate stay', 'Kathakali evening'],
  },
];

export type Testimonial = {
  name: string;
  place: string;
  quote: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    name: 'Ananya Sharma',
    place: 'Bengaluru',
    quote:
      'Turex planned our Ladakh trip down to the acclimatisation days. It felt effortless — we just showed up and lived it.',
    rating: 5,
  },
  {
    name: 'Rohan Mehta',
    place: 'Mumbai',
    quote:
      'The Golden Triangle with a private guide who actually loved history. Best anniversary trip we have taken.',
    rating: 5,
  },
  {
    name: 'Sarah Whitfield',
    place: 'London',
    quote:
      'As a first-time visitor to India I was nervous. Turex made it feel like travelling with a well-connected friend.',
    rating: 5,
  },
  {
    name: 'Kabir & Meera',
    place: 'Delhi',
    quote:
      'The Kerala houseboat sunset alone was worth it. Every stay they picked had real character.',
    rating: 5,
  },
  {
    name: 'Dev Patel',
    place: 'Ahmedabad',
    quote:
      'Solo trek through Himachal, flawlessly organised. The local hosts were the highlight.',
    rating: 4,
  },
];

export const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=80&auto=format&fit=crop',
    alt: 'Ornate palace architecture in India',
    tall: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80&auto=format&fit=crop',
    alt: 'India Gate in New Delhi at dusk',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=80&auto=format&fit=crop',
    alt: 'Gateway of India by the Mumbai harbour',
    tall: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1532664189809-02133fee698d?w=900&q=80&auto=format&fit=crop',
    alt: 'Himalayan temple beneath towering peaks',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=80&auto=format&fit=crop',
    alt: 'Tea gardens draped over Munnar hills',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80&auto=format&fit=crop',
    alt: 'Snowbound ridgeline in the high Himalaya',
    tall: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=900&q=80&auto=format&fit=crop',
    alt: 'Rowing boats moored at the Varanasi ghats',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80&auto=format&fit=crop',
    alt: 'A quiet palm-lined beach in Goa',
    tall: true,
  },
];

export const faqs = [
  {
    q: 'How are Turex journeys different from a standard tour package?',
    a: 'Every journey is built by a regional specialist, not pulled from a catalogue. We cap group sizes, hand-pick independent stays with character, and pace itineraries so you experience places rather than tick them off.',
  },
  {
    q: 'Can I customise an itinerary?',
    a: 'Yes — every published journey is a starting point. Add days, swap cities, upgrade stays, or start from a blank page with one of our travel designers. Customisation is free; you only pay for the trip itself.',
  },
  {
    q: 'Is it safe for solo and first-time travellers to India?',
    a: 'Absolutely. Our itineraries include vetted drivers, 24/7 on-trip support in your time zone, and local hosts in every city. A large share of our guests are solo travellers, many visiting India for the first time.',
  },
  {
    q: 'What is included in the price?',
    a: 'Stays, internal transport, guided experiences, and listed activities are always included. International flights are excluded so you can use points or preferred carriers. No hidden fees — the price you see is the price you pay.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Free cancellation up to 30 days before departure and flexible date changes up to 14 days before, on every journey. Monsoon and high-altitude trips include weather-disruption cover by default.',
  },
];
