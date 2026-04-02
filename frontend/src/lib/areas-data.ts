export interface AreaDetail {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  idealFor: string[];
  thingsToDo: string[];
  image: string;
  propertyCount: number;
}

export const AREAS: AreaDetail[] = [
  {
    slug: 'canggu',
    name: 'Canggu',
    tagline: 'Surf town with vibrant cafes & beach clubs',
    description:
      'Canggu has evolved from a sleepy surf village into one of Bali\'s most sought-after areas for property investment. Known for its world-class surf breaks, trendy cafes, and buzzing beach clubs, Canggu attracts digital nomads, young families, and investors alike. The area offers a perfect blend of laid-back Balinese culture and modern amenities, with neighborhoods like Berawa, Batu Bolong, and Echo Beach each offering their own distinct character. Property prices have appreciated significantly in recent years, making early investment particularly rewarding.',
    highlights: [
      'World-class surf breaks at Echo Beach and Batu Bolong',
      'Thriving cafe and restaurant scene',
      'Popular beach clubs like Finns and Atlas',
      'Growing co-working and digital nomad community',
      'Strong rental yield potential (8-12% annually)',
      'Close proximity to Seminyak and Tanah Lot',
    ],
    idealFor: ['Digital nomads', 'Surfers', 'Young families', 'Investors seeking rental yield'],
    thingsToDo: ['Surfing at Echo Beach', 'Sunday markets', 'Beach club hopping', 'Rice paddy cycling', 'Yoga and wellness retreats'],
    image: '/images/areas/canggu.jpg',
    propertyCount: 312,
  },
  {
    slug: 'ubud',
    name: 'Ubud',
    tagline: 'Cultural heart with jungles & yoga retreats',
    description:
      'Ubud is the spiritual and cultural center of Bali, nestled among lush rice terraces, ancient temples, and tropical rainforests. This area is renowned for its thriving arts scene, world-class yoga studios, and organic dining. Properties in Ubud offer unparalleled natural beauty, from jungle-view villas to rice field retreats. The area has seen growing interest from wellness-focused travelers and those seeking a more authentic Balinese experience, making it an excellent choice for boutique holiday rental investments.',
    highlights: [
      'UNESCO-listed Tegallalang rice terraces nearby',
      'World-renowned yoga and wellness centers',
      'Vibrant arts, crafts, and gallery scene',
      'Sacred Monkey Forest Sanctuary',
      'Organic farm-to-table dining',
      'Peaceful, nature-immersed lifestyle',
    ],
    idealFor: ['Wellness enthusiasts', 'Artists and creatives', 'Retirees', 'Eco-tourism investors'],
    thingsToDo: ['Yoga retreats', 'Rice terrace trekking', 'Art gallery hopping', 'Cooking classes', 'Temple visits', 'Waterfall exploration'],
    image: '/images/areas/ubud.jpg',
    propertyCount: 189,
  },
  {
    slug: 'uluwatu',
    name: 'Uluwatu',
    tagline: 'Clifftop villas & world-class surf breaks',
    description:
      'Uluwatu sits on Bali\'s dramatic southern cliffs, offering some of the island\'s most spectacular ocean views and world-class surf breaks. This area has transformed from a surfers\' haven into a luxury destination, home to stunning clifftop villas, upscale beach clubs, and fine dining restaurants. The Bukit Peninsula\'s unique geography means properties here command premium views and exclusivity. With the development of new beach clubs and restaurants, Uluwatu is one of Bali\'s fastest-growing luxury property markets.',
    highlights: [
      'Dramatic clifftop ocean views',
      'World-class surf at Padang Padang, Bingin, and Dreamland',
      'Iconic Uluwatu Temple with Kecak fire dance',
      'Luxury beach clubs like Sundays and Ulu Cliffhouse',
      'Premium villa developments',
      'Less crowded than Seminyak/Canggu',
    ],
    idealFor: ['Luxury seekers', 'Surfers', 'Couples', 'Premium investment buyers'],
    thingsToDo: ['Surfing', 'Clifftop dining', 'Uluwatu Temple visit', 'Beach club relaxation', 'Sunset watching'],
    image: '/images/areas/uluwatu.jpg',
    propertyCount: 156,
  },
  {
    slug: 'seminyak',
    name: 'Seminyak',
    tagline: 'Upscale dining, nightlife & beach clubs',
    description:
      'Seminyak is Bali\'s most established upscale area, known for its high-end boutiques, world-class restaurants, and vibrant nightlife. This mature market offers excellent rental returns due to its consistent popularity with international tourists. Properties here range from contemporary villas in quiet gang (lanes) to beachfront compounds. Seminyak\'s central location, proximity to the airport, and well-developed infrastructure make it a reliable choice for both lifestyle buyers and serious investors.',
    highlights: [
      'Bali\'s premier dining and nightlife district',
      'High-end boutique shopping on Jl. Kayu Aya',
      'Famous Potato Head and Ku De Ta beach clubs',
      'Consistent high occupancy rates for rentals',
      'Mature infrastructure and services',
      'Walking distance to beach',
    ],
    idealFor: ['Luxury lifestyle buyers', 'Rental income investors', 'Expats', 'Nightlife enthusiasts'],
    thingsToDo: ['Fine dining', 'Boutique shopping', 'Beach clubs', 'Spa treatments', 'Art galleries'],
    image: '/images/areas/seminyak.jpg',
    propertyCount: 245,
  },
  {
    slug: 'sanur',
    name: 'Sanur',
    tagline: 'Relaxed coastal village with calm beaches',
    description:
      'Sanur is one of Bali\'s most established coastal communities, beloved by families and long-term expats for its calm beaches, tree-lined streets, and relaxed pace of life. The area offers a more traditional Balinese atmosphere while still providing modern amenities, international schools, and quality healthcare. Properties in Sanur tend to offer more space for the price compared to Seminyak or Canggu, making it popular with families seeking long-term living arrangements.',
    highlights: [
      'Calm, reef-protected swimming beaches',
      'Beautiful beachfront boardwalk for cycling',
      'Proximity to international schools (Bali Island School)',
      'Established expat community',
      'Gateway to Nusa Lembongan and Nusa Penida',
      'More affordable than Seminyak/Canggu',
    ],
    idealFor: ['Families with children', 'Retirees', 'Long-term expats', 'Budget-conscious investors'],
    thingsToDo: ['Beach cycling', 'Morning markets', 'Snorkeling', 'Kitesurfing', 'Day trips to Nusa islands'],
    image: '/images/areas/sanur.jpg',
    propertyCount: 134,
  },
  {
    slug: 'nusa-dua',
    name: 'Nusa Dua',
    tagline: 'Premium resorts & pristine white sand',
    description:
      'Nusa Dua is Bali\'s purpose-built luxury resort enclave, featuring pristine white-sand beaches, five-star hotels, and manicured landscapes. This gated tourism complex offers unparalleled security, cleanliness, and world-class amenities. Properties in Nusa Dua attract premium buyers seeking the highest standards of luxury and exclusivity. The area is also home to the Bali International Convention Centre, attracting business travelers and ensuring year-round demand.',
    highlights: [
      'Pristine white-sand beaches',
      'Five-star international hotel brands',
      'Bali\'s premier golf course',
      'Gated, secure tourism complex',
      'Water sports and marine activities',
      'Bali International Convention Centre',
    ],
    idealFor: ['Luxury buyers', 'Resort-style living', 'Golf enthusiasts', 'Families'],
    thingsToDo: ['Water sports', 'Golf', 'Spa retreats', 'Cultural performances', 'Fine dining'],
    image: '/images/areas/nusa-dua.jpg',
    propertyCount: 98,
  },
  {
    slug: 'jimbaran',
    name: 'Jimbaran',
    tagline: 'Famous seafood bay & sunset views',
    description:
      'Jimbaran is a former fishing village that has become one of Bali\'s most charming residential areas. Famous for its seafood restaurants lining the bay and spectacular sunsets, Jimbaran offers a quieter, more authentic Balinese lifestyle while remaining close to the airport and Uluwatu. The area attracts families and couples who appreciate its peaceful atmosphere, beautiful bay views, and proximity to Four Seasons and other luxury resorts.',
    highlights: [
      'Iconic beachfront seafood dining',
      'Spectacular sunset views over the bay',
      'Close to Ngurah Rai International Airport',
      'Home to Four Seasons and InterContinental',
      'Quiet, family-friendly atmosphere',
      'Fresh fish market',
    ],
    idealFor: ['Families', 'Food lovers', 'Airport proximity seekers', 'Romantic getaways'],
    thingsToDo: ['Sunset seafood dinners', 'Beach walks', 'Fish market visit', 'Surfing at Balangan', 'Temple visits'],
    image: '/images/areas/jimbaran.jpg',
    propertyCount: 87,
  },
  {
    slug: 'kuta',
    name: 'Kuta',
    tagline: 'Bustling surf hub near the airport',
    description:
      'Kuta is Bali\'s original tourist hub and remains one of the island\'s most accessible areas, located just minutes from Ngurah Rai International Airport. While known primarily for budget tourism and nightlife, Kuta and neighboring Legian offer some of the most affordable property options in southern Bali. The area\'s excellent infrastructure, abundant shopping (Discovery Mall, Beachwalk), and wide sandy beach continue to attract steady tourist numbers.',
    highlights: [
      'Closest beach area to the airport',
      'Wide, sandy beach perfect for beginners',
      'Major shopping centers and entertainment',
      'Affordable property prices',
      'Excellent public infrastructure',
      'Vibrant nightlife in Legian',
    ],
    idealFor: ['Budget investors', 'First-time buyers', 'Nightlife seekers', 'Commercial property'],
    thingsToDo: ['Surfing lessons', 'Shopping', 'Waterbom Bali', 'Nightlife', 'Beach sunset walks'],
    image: '/images/areas/kuta.jpg',
    propertyCount: 176,
  },
  {
    slug: 'tabanan',
    name: 'Tabanan',
    tagline: 'UNESCO rice terraces & black sand beaches',
    description:
      'Tabanan is the rice bowl of Bali, home to the UNESCO World Heritage-listed Jatiluwih rice terraces and the iconic Tanah Lot temple. This regency offers some of Bali\'s most affordable land prices with spectacular natural beauty. As development pushes west from Canggu, Tabanan is increasingly recognized as Bali\'s next frontier for property investment, offering large plots of land and authentic Balinese landscapes at a fraction of the price of southern Bali.',
    highlights: [
      'UNESCO World Heritage Jatiluwih rice terraces',
      'Iconic Tanah Lot temple',
      'Most affordable land prices in south-west Bali',
      'Dramatic black sand beaches',
      'Authentic Balinese rural lifestyle',
      'Next frontier for property development',
    ],
    idealFor: ['Land investors', 'Nature lovers', 'Eco-resort developers', 'Budget-conscious buyers'],
    thingsToDo: ['Rice terrace trekking', 'Tanah Lot temple visit', 'Black sand beach walks', 'Butterfly park', 'River rafting'],
    image: '/images/areas/tabanan.jpg',
    propertyCount: 65,
  },
  {
    slug: 'pererenan',
    name: 'Pererenan',
    tagline: 'Stunning sunsets & growing villa scene',
    description:
      'Pererenan is the quieter, more authentic neighbor of Canggu, rapidly gaining popularity for its stunning sunset views, emerging cafe scene, and more spacious villa plots. Still retaining much of its rice field charm, Pererenan offers the Canggu lifestyle without the crowds. Property investors are increasingly drawn here for better value per square meter and the area\'s trajectory of growth.',
    highlights: [
      'Spectacular sunset views',
      'Quieter alternative to busy Canggu',
      'Rice field views still abundant',
      'Growing cafe and dining scene',
      'Better value than central Canggu',
      'Emerging surf spots',
    ],
    idealFor: ['Couples', 'Remote workers', 'Early investors', 'Those seeking tranquility near action'],
    thingsToDo: ['Sunset watching', 'Surfing', 'Rice paddy walks', 'Cafe hopping', 'Yoga'],
    image: '/images/areas/pererenan.jpg',
    propertyCount: 78,
  },
  {
    slug: 'mengwi',
    name: 'Mengwi',
    tagline: 'Historic temples & affordable villas',
    description:
      'Mengwi is a regency in central-south Bali known for its historic royal temple, Taman Ayun, and increasingly affordable villa developments. Located between Canggu and Ubud, Mengwi offers easy access to both areas while maintaining significantly lower property prices. The area is popular with local families and expats seeking more space and value.',
    highlights: [
      'Historic Taman Ayun royal temple',
      'Significantly lower property prices',
      'Central location between coast and highlands',
      'Growing residential developments',
      'Large plot sizes available',
      'Easy access to Canggu and Denpasar',
    ],
    idealFor: ['Budget buyers', 'Families needing space', 'Long-term residents', 'Development investors'],
    thingsToDo: ['Temple visits', 'Local market exploration', 'Rice field walks', 'Cultural events'],
    image: '/images/areas/mengwi.jpg',
    propertyCount: 45,
  },
  {
    slug: 'denpasar',
    name: 'Denpasar',
    tagline: 'Capital city with markets & culture',
    description:
      'Denpasar is Bali\'s capital city and commercial center, offering a uniquely Balinese urban experience. While not a typical tourist destination, Denpasar provides the most affordable property prices in southern Bali along with excellent infrastructure, schools, hospitals, and government services. The city\'s central location makes it ideal for those who need to commute across the island.',
    highlights: [
      'Most affordable property in southern Bali',
      'Best hospitals and healthcare facilities',
      'Major shopping centers and traditional markets',
      'Government services and offices',
      'Central location for island-wide commuting',
      'Authentic Balinese city life',
    ],
    idealFor: ['Local workers', 'Families needing services', 'Commercial investors', 'Budget buyers'],
    thingsToDo: ['Badung Market visit', 'Bajra Sandhi Monument', 'Museum exploration', 'Local food tours'],
    image: '/images/areas/denpasar.jpg',
    propertyCount: 92,
  },
  {
    slug: 'lovina',
    name: 'Lovina',
    tagline: 'North Bali dolphins & black sand beach',
    description:
      'Lovina is North Bali\'s premier beach destination, famous for its wild dolphin watching tours and peaceful black sand beaches. Far from the crowds of the south, Lovina offers incredibly affordable property with a slow-paced, authentic Balinese lifestyle. The area attracts retirees and those seeking solitude, with property prices at a fraction of what you\'d pay in Canggu or Seminyak.',
    highlights: [
      'Famous wild dolphin watching',
      'Tranquil black sand beaches',
      'Extremely affordable property prices',
      'Hot springs nearby (Banjar)',
      'Snorkeling and diving',
      'Authentic, uncrowded Bali experience',
    ],
    idealFor: ['Retirees', 'Budget investors', 'Nature lovers', 'Those escaping crowds'],
    thingsToDo: ['Dolphin watching', 'Snorkeling', 'Hot springs visit', 'Waterfall trekking', 'Buddhist temple visits'],
    image: '/images/areas/lovina.jpg',
    propertyCount: 34,
  },
  {
    slug: 'amed',
    name: 'Amed',
    tagline: 'Diving paradise with volcanic coastline',
    description:
      'Amed is East Bali\'s diving and snorkeling paradise, set against the dramatic backdrop of Mount Agung. This remote coastal strip offers crystal-clear waters, vibrant coral reefs, and the iconic USAT Liberty shipwreck dive site at nearby Tulamben. Property in Amed is extremely affordable, attracting divers, adventurers, and those seeking Bali\'s most untouched landscapes.',
    highlights: [
      'World-class diving and snorkeling',
      'Views of Mount Agung',
      'USAT Liberty shipwreck nearby',
      'Traditional salt farming villages',
      'Very affordable property',
      'Dramatic volcanic coastline',
    ],
    idealFor: ['Divers', 'Adventure seekers', 'Remote living enthusiasts', 'Eco-tourism investors'],
    thingsToDo: ['Scuba diving', 'Snorkeling', 'Freediving', 'Traditional salt farm tours', 'Sunrise watching over Lombok'],
    image: '/images/areas/amed.jpg',
    propertyCount: 23,
  },
  {
    slug: 'candidasa',
    name: 'Candidasa',
    tagline: 'Tranquil east coast with lotus lagoon',
    description:
      'Candidasa is a peaceful east coast town built around a beautiful lotus lagoon, offering a gateway to some of Bali\'s most important cultural sites including Tenganan traditional village and Tirta Gangga water palace. This area provides a tranquil alternative to Bali\'s busy south, with affordable properties and genuine Balinese hospitality.',
    highlights: [
      'Beautiful lotus lagoon',
      'Gateway to Tenganan traditional village',
      'Tirta Gangga water palace nearby',
      'Peaceful, uncrowded atmosphere',
      'Affordable beachfront options',
      'Excellent snorkeling at Blue Lagoon',
    ],
    idealFor: ['Culture enthusiasts', 'Retirees', 'Budget buyers', 'Eco-tourism developers'],
    thingsToDo: ['Snorkeling at Blue Lagoon', 'Tenganan village visit', 'Tirta Gangga exploration', 'Lotus lagoon walks'],
    image: '/images/areas/candidasa.jpg',
    propertyCount: 18,
  },
  {
    slug: 'tegallalang',
    name: 'Tegallalang',
    tagline: 'Iconic terraced rice paddies',
    description:
      'Tegallalang is world-famous for its stunning terraced rice paddies, located just north of Ubud. This area offers some of Bali\'s most photogenic landscapes and attracts visitors year-round. Properties here provide unmatched rice terrace views and a deep connection to Bali\'s agricultural heritage, making them popular for boutique accommodation and retreat centers.',
    highlights: [
      'World-famous rice terrace views',
      'Traditional Subak irrigation system (UNESCO)',
      'Artisan craft villages',
      'Close proximity to Ubud',
      'Stunning photography locations',
      'Emerging boutique hospitality scene',
    ],
    idealFor: ['Boutique hotel developers', 'Retreat center operators', 'Nature lovers', 'Instagram-worthy investments'],
    thingsToDo: ['Rice terrace walks', 'Swing attractions', 'Coffee plantation tours', 'Craft shopping', 'Cycling tours'],
    image: '/images/areas/tegallalang.jpg',
    propertyCount: 29,
  },
];

export function getAreaBySlug(slug: string): AreaDetail | undefined {
  return AREAS.find((a) => a.slug === slug);
}
