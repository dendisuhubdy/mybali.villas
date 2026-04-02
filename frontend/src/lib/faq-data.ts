export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  slug: string;
  items: FAQItem[];
}

export const FAQ_DATA: FAQCategory[] = [
  {
    title: 'Buying Property in Bali',
    slug: 'buying',
    items: [
      {
        question: 'Can foreigners buy property in Bali?',
        answer:
          'Foreigners cannot hold freehold (Hak Milik) title directly. However, there are several legal pathways: Leasehold agreements (Hak Sewa) for 25-30 years with extensions, Right to Use (Hak Pakai) for up to 80 years, or setting up a PMA (foreign investment company) to hold Right to Build (HGB) title. Each option has different implications for cost, control, and duration.',
      },
      {
        question: 'What is the difference between freehold and leasehold?',
        answer:
          'Freehold (Hak Milik) grants permanent ownership of the land and is only available to Indonesian citizens or through a PMA company structure. Leasehold (Hak Sewa) is a lease agreement for a fixed period, typically 25-30 years, where you pay upfront for the right to use the land and property. Freehold costs more but builds permanent equity; leasehold is simpler and offers higher rental yield percentages.',
      },
      {
        question: 'What are the typical costs involved in buying property?',
        answer:
          'Beyond the purchase price, expect: Notary fees (1-2.5% of transaction value), Transfer tax/BPHTB (5% of government-assessed value), Agent commission (3-5%, usually paid by seller), Legal fees ($1,000-3,000 for independent review), PMA setup costs if applicable ($3,000-5,000), and annual property tax (PBB) which is relatively low in Bali.',
      },
      {
        question: 'How long does the buying process take?',
        answer:
          'A typical property purchase takes 4-8 weeks from signing the initial agreement to completion. This includes due diligence (1-2 weeks), document preparation (1-2 weeks), and the actual transfer process (2-4 weeks). Setting up a PMA company adds 4-6 weeks. Leasehold transactions are generally faster than freehold.',
      },
      {
        question: 'Do I need a lawyer to buy property in Bali?',
        answer:
          'While not legally required, we strongly recommend engaging an independent lawyer (not just the seller\'s notary). A lawyer will verify land certificates, check for disputes or liens, review contracts, and ensure your interests are protected. Budget $1,000-3,000 for legal services.',
      },
    ],
  },
  {
    title: 'Rental & Investment',
    slug: 'rental',
    items: [
      {
        question: 'What rental yields can I expect from a Bali villa?',
        answer:
          'Rental yields vary by area and property type. Typically: Canggu/Seminyak villas achieve 8-12% gross yield, Uluwatu luxury villas 6-10%, Ubud retreats 7-11%. Net yields after management, maintenance, and taxes are typically 5-8%. A well-managed 3BR villa in Canggu can gross $50,000-100,000+ annually.',
      },
      {
        question: 'How do I manage my villa if I don\'t live in Bali?',
        answer:
          'Most villa owners use professional villa management companies. They handle guest bookings, staff management, maintenance, cleaning, marketing (Airbnb, Booking.com), and financial reporting. Management fees typically range from 15-25% of rental revenue. Alternatively, you can hire a villa manager directly for IDR 5-8M/month.',
      },
      {
        question: 'What licenses do I need to rent out my villa?',
        answer:
          'To legally rent your property, you need: a Pondok Wisata (tourism accommodation) license, a tax registration number (NPWP), and compliance with local regulations including guest registration. Your villa management company or a local agent can help obtain these licenses.',
      },
      {
        question: 'When is peak rental season in Bali?',
        answer:
          'High season runs from June to September (European/Australian summer holidays) and mid-December to mid-January (Christmas/New Year). Mid-season covers April-May and October. Low season is February-March and November. A diversified marketing strategy targeting different source markets can help maintain year-round occupancy.',
      },
    ],
  },
  {
    title: 'Living in Bali',
    slug: 'living',
    items: [
      {
        question: 'What visa options are available for living in Bali?',
        answer:
          'Key visa options include: Tourist Visa on Arrival (30 days, extendable to 60), B211A Social/Cultural Visa (60 days, extendable to 180), Digital Nomad Visa/B317 (1 year for remote workers), Retirement KITAS (for those 55+ with pension proof), Investor KITAS (through PMA investment), and Spouse KITAS (married to Indonesian citizen).',
      },
      {
        question: 'What is the cost of living in Bali?',
        answer:
          'A comfortable expat lifestyle costs approximately $1,750-4,150/month, including: Villa rent ($800-2,000), groceries ($300-600), dining out ($200-500), transportation ($50-100), utilities ($100-250), health insurance ($100-300), and entertainment ($200-400). Living more modestly or outside tourist areas can reduce this significantly.',
      },
      {
        question: 'Are there international schools in Bali?',
        answer:
          'Yes, several quality options exist: Bali Island School (Sanur) with American curriculum, Green School (Ubud) famous for its sustainability-focused education and bamboo campus, Canggu Community School, and Australian Independent School Bali. Fees range from $5,000-20,000/year depending on the school and grade level.',
      },
      {
        question: 'How is healthcare in Bali?',
        answer:
          'Bali has several international-standard hospitals including BIMC Hospital (Kuta and Nusa Dua) with English-speaking staff, Siloam Hospital (Denpasar), and Kasih Ibu Hospital. For serious conditions, medical evacuation to Singapore is common. International health insurance is strongly recommended, costing $1,200-3,600/year.',
      },
    ],
  },
  {
    title: 'Property Types & Areas',
    slug: 'areas',
    items: [
      {
        question: 'Which area of Bali is best for property investment?',
        answer:
          'It depends on your goals. Canggu offers the highest rental yields (8-12%) but higher entry prices. Seminyak provides the most reliable returns in a mature market. Uluwatu is the luxury play with premium nightly rates. Ubud suits wellness/retreat investments. Tabanan offers the lowest entry prices with growth potential. Sanur is ideal for families seeking calm beaches and long-term living.',
      },
      {
        question: 'What types of properties are available?',
        answer:
          'Bali\'s property market includes: Villas (most popular for investment, 1-6+ bedrooms), Houses (traditional or modern, often for long-term living), Apartments (growing market, especially in Seminyak/Canggu), Land (for custom builds or development), and Commercial properties (restaurants, retail, co-working spaces). Each type suits different investment strategies.',
      },
      {
        question: 'What is a typical villa in Bali like?',
        answer:
          'A typical Bali villa features: private swimming pool, open-plan tropical living areas, lush garden landscaping, modern kitchen and bathrooms, air-conditioned bedrooms, outdoor dining/BBQ area, and often a rooftop terrace or yoga deck. Staff quarters for housekeeping are common. Architectural styles range from traditional Balinese (alang-alang roofs, natural materials) to ultra-modern minimalist.',
      },
    ],
  },
  {
    title: 'Concierge & Services',
    slug: 'concierge',
    items: [
      {
        question: 'What concierge services do you offer?',
        answer:
          'We offer complimentary concierge services with every booking, including: airport transfers, in-villa chef and catering, spa and massage arrangements, yoga instructors, babysitting services, restaurant reservations, tour and activity bookings, car and driver hire, grocery pre-stocking, and special occasion arrangements (birthdays, proposals, weddings).',
      },
      {
        question: 'How do I list my property with MyBaliVilla?',
        answer:
          'Listing your property is simple: Create an account, click "List Property", fill in your property details including photos, amenities, and pricing, and submit for review. Our team will verify your listing within 48 hours. There are no upfront listing fees - we operate on a commission basis for successful bookings or sales.',
      },
      {
        question: 'Do you help with property management?',
        answer:
          'Yes, we can connect you with vetted villa management companies in Bali. Our partners offer comprehensive management including guest handling, staff management, maintenance, marketing, and financial reporting. Management fees typically range from 15-25% of rental revenue depending on the service level.',
      },
    ],
  },
];
