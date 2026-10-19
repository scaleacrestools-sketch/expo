/**
 * Navigation and footer links exactly as published on scaleacres.com (header mega-menu and footer,
 * captured 19 Oct 2026). These links are part of the site's internal linking: keep labels and
 * hrefs unchanged (including the live site's own spelling and trailing-slash quirks).
 */
export type NavLink = { label: string; href: string };
export type CountryNav = NavLink & { cities: NavLink[] };

export const liveServiceLinks: NavLink[] = [
  {
    "label": "Lead Generation Agency",
    "href": "/real-estate-lead-generation-agency/"
  },
  {
    "label": "Branding Agency",
    "href": "/real-estate-branding-agency/"
  },
  {
    "label": "Web Development",
    "href": "/real-estate-web-development/"
  },
  {
    "label": "Seo Service",
    "href": "/real-estate-seo-service/"
  },
  {
    "label": "PPC Service",
    "href": "/real-estate-ppc-service/"
  },
  {
    "label": "Facebook Ads Agency",
    "href": "/facebook-ads-agency/"
  },
  {
    "label": "Social Media Marketing Agency",
    "href": "/social-media-marketing-agency/"
  }
];

export const liveIndiaCities: NavLink[] = [
  {
    "label": "Real Estate Digital Marketing Agency in Noida",
    "href": "/real-estate-marketing-noida/"
  },
  {
    "label": "Real Estate Digital Marketing Agency in Delhi",
    "href": "/real-estate-marketing-delhi/"
  },
  {
    "label": "Real Estate Digital Marketing Agency in Gurgaon",
    "href": "/real-estate-marketing-gurgaon/"
  },
  {
    "label": "Real Estate Marketing Agency in Bangalore",
    "href": "/real-estate-marketing-Bangalore/"
  },
  {
    "label": "Real Estate Digital Marketing Agency in Pune",
    "href": "/real-estate-marketing-pune/"
  },
  {
    "label": "Real Estate Marketing Agency in Jaipur",
    "href": "/real-estate-digital-marketing-agency-in-jaipur/"
  },
  {
    "label": "Real Estate Marketing Agency in Indore",
    "href": "/real-estate-digital-marketing-company-in-indore/"
  },
  {
    "label": "Real Estate Digital Marketing Agency in Dholera",
    "href": "/real-estate-digital-marketing-agency-in-dholera"
  },
  {
    "label": "Real Estate Digital Marketing Agency in Faridabad",
    "href": "/real-estate-digital-marketing-agency-in-faridabad/"
  },
  {
    "label": "Real Estate Digital Marketing Agency in Zirakpur",
    "href": "/real-estate-digital-marketing-company-in-zirakpur"
  },
  {
    "label": "Real Estate Marketing Agency in Goa",
    "href": "/real-estate-digital-marketing-agency-in-goa/"
  },
  {
    "label": "Real Estate Marketing Agency in Rishikesh",
    "href": "/real-estate-digital-marketing-agency-in-rishikesh/"
  },
  {
    "label": "Real Estate Marketing Agency in Haridwar",
    "href": "/real-estate-digital-marketing-agency-in-haridwar/"
  },
  {
    "label": "Real Estate Marketing Agency in Nainital",
    "href": "/real-estate-digital-marketing-agency-in-nainital/"
  },
  {
    "label": "Real Estate Marketing Agency in Lucknow",
    "href": "/real-estate-digital-marketing-agency-in-lucknow/"
  },
  {
    "label": "Real Estate Marketing Agency in Kolkata",
    "href": "/real-estate-digital-marketing-company-in-kolkata/"
  },
  {
    "label": "Real Estate Marketing Agency in Kochi",
    "href": "/real-estate-digital-marketing-agency-in-kochi"
  },
  {
    "label": "Real Estate Marketing Agency in Amritsar",
    "href": "/real-estate-digital-marketing-agency-in-amritsar/"
  },
  {
    "label": "Real Estate Marketing Agency in Ghaziabad",
    "href": "/real-estate-digital-marketing-agency-in-ghaziabad"
  },
  {
    "label": "Real Estate Marketing Agency in Ayodhya",
    "href": "/real-estate-digital-marketing-agency-in-ayodhya/"
  },
  {
    "label": "Real Estate Marketing Agency in Manali",
    "href": "/real-estate-digital-marketing-agency-in-manali/"
  },
  {
    "label": "Real Estate Marketing Agency in Ahmedabad",
    "href": "/real-estate-digital-marketing-agency-in-ahmedabad/"
  },
  {
    "label": "Real Estate Marketing Agency in Chandigarh",
    "href": "/real-estate-digital-marketing-agency-in-chandigarh/"
  },
  {
    "label": "Real Estate Marketing Agency in Hyderabad",
    "href": "/real-estate-digital-marketing-agency-in-hyderabad/"
  },
  {
    "label": "Real Estate Marketing Agency in Nagpur",
    "href": "/real-estate-marketing-agency-in-nagpur/"
  },
  {
    "label": "Real Estate Marketing Agency in Coimbatore",
    "href": "/real-estate-marketing-company-in-coimbatore"
  },
  {
    "label": "Real Estate Marketing Agency in Dehradun",
    "href": "/digital-marketing-agency-for-real-estate-in-dehradun/"
  },
  {
    "label": "Real Estate Marketing Agency in Mohali",
    "href": "/digital-marketing-services-for-real-estate-in-mohali"
  }
];

export const liveCountries: CountryNav[] = [
  {
    "label": "Real Estate Digital Marketing Agency in United Arab Emirates (UAE)",
    "href": "/uae/",
    "cities": [
      {
        "label": "Real Estate Digital Marketing Agency in Dubai",
        "href": "/uae/real-estate-digital-marketing-agency-in-dubai/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in Abu Dhabi",
        "href": "/uae/digital-marketing-company-for-real-estate-in-abu-dhabi/"
      }
    ]
  },
  {
    "label": "Real Estate Digital Marketing Agency in Saudi Arabia",
    "href": "/sa/",
    "cities": [
      {
        "label": "Real Estate Digital Marketing Agency in Riyadh",
        "href": "/sa/digital-marketing-company-for-real-estate-in-riyadh/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in Jeddah",
        "href": "/sa/digital-marketing-company-for-real-estate-in-jeddah/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in NEOM",
        "href": "/sa/digital-marketing-company-for-real-estate-in-neom/"
      }
    ]
  },
  {
    "label": "Real Estate Digital Marketing Agency in Qatar",
    "href": "/qa/",
    "cities": [
      {
        "label": "Real Estate Digital Marketing Agency in Doha",
        "href": "/qa/digital-marketing-company-for-real-estate-in-doha/"
      }
    ]
  },
  {
    "label": "Real Estate Digital Marketing Agency in Singapore",
    "href": "/sg/",
    "cities": []
  },
  {
    "label": "Real Estate Digital Marketing Agency in Malaysia",
    "href": "/my/",
    "cities": [
      {
        "label": "Real Estate Digital Marketing Agency in Johor",
        "href": "/my/digital-marketing-company-for-real-estate-in-johor/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in KL",
        "href": "/my/digital-marketing-company-for-real-estate-in-kuala-lumpur-kl/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in Penang",
        "href": "/my/digital-marketing-company-for-real-estate-in-penang/"
      }
    ]
  },
  {
    "label": "Real Estate Digital Marketing Agency in Thailand",
    "href": "/th/",
    "cities": [
      {
        "label": "Real Estate Digital Marketing Agency in Bangkok",
        "href": "/th/digital-marketing-company-for-real-estate-in-bangkok/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in Phuket",
        "href": "/th/digital-marketing-company-for-real-estate-in-phuket/"
      }
    ]
  },
  {
    "label": "Real Estate Digital Marketing Agency in Indonesia",
    "href": "/id",
    "cities": [
      {
        "label": "Real Estate Digital Marketing Agency in Jakarta",
        "href": "/id/digital-marketing-company-for-real-estate-in-jakarta/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in Bali",
        "href": "/id/digital-marketing-company-for-real-estate-in-bali/"
      }
    ]
  },
  {
    "label": "Real Estate Digital Marketing Agency in Philippines",
    "href": "/ph/",
    "cities": []
  },
  {
    "label": "Real Estate Digital Marketing Agency in Vietnam",
    "href": "/vn/",
    "cities": [
      {
        "label": "Real Estate Digital Marketing Agency in HCMC",
        "href": "/vn/digital-marketing-company-for-real-estate-in-ho-chi-minh-city/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in Hanoi",
        "href": "/vn/digital-marketing-company-for-real-estate-in-hanoi/"
      }
    ]
  },
  {
    "label": "Real Estate Digital Marketing Agency in United States (USA)",
    "href": "/us/",
    "cities": [
      {
        "label": "Real Estate Digital Marketing Agency in Texas",
        "href": "/us/digital-marketing-company-for-real-estate-in-texas/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in New York",
        "href": "/us/digital-marketing-company-for-real-estate-in-new-york/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in Miami",
        "href": "/us/digital-marketing-company-for-real-estate-in-miami/"
      }
    ]
  },
  {
    "label": "Real Estate Digital Marketing Agency in United Kingdom (UK)",
    "href": "/uk/",
    "cities": [
      {
        "label": "Real Estate Digital Marketing Agency in London",
        "href": "/uk/digital-marketing-company-for-real-estate-in-london/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in Manchester",
        "href": "/uk/digital-marketing-company-for-real-estate-in-manchester/"
      }
    ]
  },
  {
    "label": "Real Estate Digital Marketing Agency in Canada",
    "href": "/ca/",
    "cities": [
      {
        "label": "Real Estate Digital Marketing Agency in Toronto",
        "href": "/ca/digital-marketing-company-for-real-estate-in-toronto/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in Vancouver",
        "href": "/ca/digital-marketing-company-for-real-estate-in-vancouver/"
      }
    ]
  },
  {
    "label": "Real Estate Digital Marketing Agency in Australia",
    "href": "/au/",
    "cities": [
      {
        "label": "Real Estate Digital Marketing Agency in Sydney",
        "href": "/au/digital-marketing-company-for-real-estate-in-sydney/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in Melbourne",
        "href": "/au/digital-marketing-company-for-real-estate-in-melbourne/"
      }
    ]
  },
  {
    "label": "Real Estate Digital Marketing Agency in New Zealand",
    "href": "/nz/",
    "cities": [
      {
        "label": "Real Estate Digital Marketing Agency in Auckland",
        "href": "/nz/digital-marketing-company-for-real-estate-in-auckland/"
      },
      {
        "label": "Real Estate Digital Marketing Agency in Wellington",
        "href": "/nz/digital-marketing-company-for-real-estate-in-wellington/"
      }
    ]
  }
];

export const liveFooter = {
  "quickLinks": [
    {
      "label": "About Us",
      "href": "/about-us/"
    },
    {
      "label": "Our Team",
      "href": "/our-team/"
    },
    {
      "label": "Contact us",
      "href": "/contact-us/"
    },
    {
      "label": "Our Services",
      "href": "/our-services/"
    },
    {
      "label": "Blog",
      "href": "/blog"
    }
  ],
  "solutions": [
    {
      "label": "Our Work",
      "href": "/our-work/"
    },
    {
      "label": "Career",
      "href": "/careers/"
    }
  ],
  "topCities": [
    {
      "label": "Real Estate Digital Marketing Agency in Noida",
      "href": "/real-estate-marketing-noida/"
    },
    {
      "label": "Real Estate Digital Marketing Agency in Delhi",
      "href": "/real-estate-marketing-delhi/"
    },
    {
      "label": "Real Estate Digital Marketing Agency in Gurgaon",
      "href": "/real-estate-marketing-gurgaon/"
    },
    {
      "label": "Real Estate Marketing Agency in Bangalore",
      "href": "/real-estate-marketing-Bangalore/"
    },
    {
      "label": "Real Estate Digital Marketing Agency in Pune",
      "href": "/real-estate-marketing-pune/"
    },
    {
      "label": "Real Estate Marketing Agency in Jaipur",
      "href": "/real-estate-digital-marketing-agency-in-jaipur/"
    },
    {
      "label": "Real Estate Marketing Agency in Ayodhya",
      "href": "/real-estate-digital-marketing-agency-in-ayodhya/"
    },
    {
      "label": "Real Estate Marketing Agency in Manali",
      "href": "/real-estate-digital-marketing-agency-in-manali/"
    },
    {
      "label": "Real Estate Marketing Agency in Ahmedabad",
      "href": "/real-estate-digital-marketing-agency-in-ahmedabad/"
    },
    {
      "label": "Real Estate Marketing Agency in Goa",
      "href": "/real-estate-digital-marketing-agency-in-goa/"
    },
    {
      "label": "Real Estate Marketing Agency in Rishikesh",
      "href": "/real-estate-digital-marketing-agency-in-rishikesh/"
    },
    {
      "label": "Real Estate Marketing Agency in Haridwar",
      "href": "/real-estate-digital-marketing-agency-in-haridwar/"
    },
    {
      "label": "Real Estate Marketing Agency in Nainital",
      "href": "/real-estate-digital-marketing-agency-in-nainital/"
    },
    {
      "label": "Real Estate Marketing Agency in Lucknow",
      "href": "/real-estate-digital-marketing-agency-in-lucknow/"
    },
    {
      "label": "Real Estate Marketing Agency in Kolkata",
      "href": "/real-estate-digital-marketing-company-in-kolkata/"
    },
    {
      "label": "Real Estate Marketing Agency in Chandigarh",
      "href": "/real-estate-digital-marketing-agency-in-chandigarh/"
    },
    {
      "label": "Real Estate Marketing Agency in Hyderabad",
      "href": "/real-estate-digital-marketing-agency-in-hyderabad/"
    }
  ],
  "countries": [
    {
      "label": "Real Estate Marketing Agency in Dubai",
      "href": "/real-estate-digital-marketing-agency-in-dubai/"
    }
  ]
} satisfies Record<string, NavLink[]>;

export const liveLegalLinks: NavLink[] = [
  { label: "Terms & Conditions", href: "/terms-conditions/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Contact Us", href: "/contact-us/" },
];

/** Footer company line and GST number as shown on the live footer. */
export const liveFooterFacts = {
  intro:
    "At ScaleAcres Promotech, we specialize in innovative marketing strategies tailored for the real estate industry. From lead generation to branding, we help builders, developers, and property professionals maximize their reach and sales.",
  address: "Plot No. 5, 2nd Floor, Left Side, Kehar Singh Estate, Westend Marg, Lane No. 2, Saidulajab, New Delhi - 110030",
  gst: "GST No: - 07AEZFS9808K1ZW",
};
