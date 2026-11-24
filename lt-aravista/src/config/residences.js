/*
 * Residence collections. Areas are from the unit-plan tables in the official
 * brochure (Phase 1, Towers 1-3). Prices are indicative starting prices.
 * Tower 3 also has slightly larger Royale (2,035.47 sq ft) and Luxuria
 * (2,322.01 sq ft) units, so the figures below are starting areas.
 */
import { IMAGES } from './images';

export const RESIDENCES = [
  {
    id: 'majesta',
    bhk: '3 BHK',
    name: 'Majesta',
    towers: 'Towers 1 & 2',
    carpet: '1,423',
    balcony: '316',
    total: '1,739',
    price: '₹4.75 Cr*',
    plan: IMAGES.Plans.Majesta,
    typical: { image: IMAGES.Plans.Tower1, short: 'Tower 1', label: 'Tower 1 typical floor plan (1st to 16th floor)' },
  },
  {
    id: 'regalia',
    bhk: '3 BHK',
    name: 'Regalia',
    towers: 'Towers 1 & 2',
    carpet: '1,542',
    balcony: '370',
    total: '1,912',
    price: '₹5.23 Cr*',
    plan: IMAGES.Plans.Regalia,
    typical: { image: IMAGES.Plans.Tower2, short: 'Tower 2', label: 'Tower 2 typical floor plan (1st to 16th floor)' },
  },
  {
    id: 'royale',
    bhk: '4 BHK',
    name: 'Royale',
    towers: 'Tower 3',
    carpet: '2,007',
    balcony: '421',
    total: '2,428',
    price: '₹6.73 Cr*',
    plan: IMAGES.Plans.Royale,
    typical: { image: IMAGES.Plans.Tower3, short: 'Tower 3', label: 'Tower 3 typical floor plan (1st to 16th floor)' },
  },
  {
    id: 'luxuria',
    bhk: '4 BHK',
    name: 'Luxuria',
    towers: 'Tower 3',
    carpet: '2,293',
    balcony: '516',
    total: '2,809',
    price: '₹7.64 Cr*',
    plan: IMAGES.Plans.Luxuria,
    typical: { image: IMAGES.Plans.Tower3, short: 'Tower 3', label: 'Tower 3 typical floor plan (1st to 16th floor)' },
  },
];
