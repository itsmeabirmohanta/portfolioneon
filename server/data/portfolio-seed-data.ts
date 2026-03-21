export type FeaturedProjectSeed = {
  slug: string;
  title: string;
  description: string;
  caseStudyUrl: string;
  prototypeUrl: string;
  imageUrl: string;
  displayOrder: number;
};

export type DesignGallerySeed = {
  slug: string;
  title: string;
  year: string;
  imageUrl: string;
  displayOrder: number;
};

export type ChannelVideoSeed = {
  slug: string;
  title: string;
  embedUrl: string;
  displayOrder: number;
};

export const featuredProjectSeedData: FeaturedProjectSeed[] = [
  {
    slug: "yashoda-ai-quiz-platform",
    title: "YASHODA AI Quiz Platform",
    description:
      "Developed an interactive quiz platform to support AI literacy programs, featuring structured assessments and user-friendly navigation. Designed to engage learners while enabling scalable evaluation of participant understanding.",
    caseStudyUrl: "https://quiz.yashoda.live/",
    prototypeUrl: "https://quiz.yashoda.live/",
    imageUrl: "/featured_projects/1.jpeg",
    displayOrder: 1,
  },
  {
    slug: "investment-dashboard",
    title: "Investment Dashboard",
    description:
      "Built a data-driven investment dashboard that visualizes financial insights through an intuitive interface. Integrated key metrics and structured layouts to help users track and interpret investment performance effectively.",
    caseStudyUrl: "https://investmentdashboard.abirmahanta.site/",
    prototypeUrl: "https://investmentdashboard.abirmahanta.site/",
    imageUrl: "/featured_projects/2.jpeg",
    displayOrder: 2,
  },
  {
    slug: "dr-anand-shukla-portfolio-website",
    title: "Dr. Anand Shukla Portfolio Website",
    description:
      "Designed and developed a professional portfolio website showcasing academic, professional, and thought leadership work. Focused on clean UI, structured content hierarchy, and credibility-driven presentation.",
    caseStudyUrl: "https://dranandshukla.netlify.app/",
    prototypeUrl: "https://dranandshukla.netlify.app/",
    imageUrl: "/featured_projects/3.jpeg",
    displayOrder: 3,
  },
  {
    slug: "cpu-simulator",
    title: "CPU Simulator",
    description:
      "Developed an interactive web-based CPU simulator that visualizes core computer architecture concepts such as instruction execution and memory operations. Designed to simplify complex low-level processes for learners through an intuitive UI and real-time simulation.",
    caseStudyUrl: "https://cpusimulator.tech/",
    prototypeUrl: "https://cpusimulator.tech/",
    imageUrl: "/featured_projects/4.jpeg",
    displayOrder: 4,
  },
  {
    slug: "abhaya-indane-website",
    title: "Abhaya Indane Website",
    description:
      "Built a responsive business website for an LPG distribution service, focusing on accessibility, clear service communication, and streamlined user navigation. Optimized for local users with essential information, contact flows, and trust-building design elements.",
    caseStudyUrl: "https://abhayaindane.co.in/",
    prototypeUrl: "https://abhayaindane.co.in/",
    imageUrl: "/featured_projects/5.jpeg",
    displayOrder: 5,
  },
  {
    slug: "yashoda-ai-certificate-platform",
    title: "YASHODA AI Certificate Platform",
    description:
      "Created a dynamic certificate generation platform that automates personalized certificate issuance at scale. Implemented user input handling and real-time rendering to support large-scale digital literacy initiatives.",
    caseStudyUrl: "https://certificate.yashoda.live/",
    prototypeUrl: "https://certificate.yashoda.live/",
    imageUrl: "/featured_projects/6.jpeg",
    displayOrder: 6,
  },
];

export const designGallerySeedData: DesignGallerySeed[] = [
  {
    slug: "flipkart-axis-credit-card-store",
    title: "Flipkart-Axis Credit Card Store",
    year: "2020",
    imageUrl: "https://framerusercontent.com/images/dl7MLlrL1Ps7e3TQ9jBVmm6Xcc.png?scale-down-to=512",
    displayOrder: 1,
  },
  {
    slug: "insurance-marketplace-on-flipkart",
    title: "End-to-End Insurance Marketplace on Flipkart",
    year: "2021",
    imageUrl: "https://framerusercontent.com/images/8LOLCvqoOQ4waqH6VPqWNQcFs.png?scale-down-to=512",
    displayOrder: 2,
  },
  {
    slug: "one-stop-credit-shop-on-flipkart",
    title: "One-Stop Credit Shop on Flipkart",
    year: "2021",
    imageUrl: "https://framerusercontent.com/images/CSW2F9YojQ5a8yZgqFq21irP2WY.png?scale-down-to=512",
    displayOrder: 3,
  },
  {
    slug: "motor-insurance-simplified-for-flipkart",
    title: "Motor Insurance Simplified for Flipkart",
    year: "2020",
    imageUrl: "https://framerusercontent.com/images/e2kwTmq40715rIVYKOkWj0dHvUE.png?scale-down-to=512",
    displayOrder: 4,
  },
  {
    slug: "lead-management-system-oyo-workspaces",
    title: "Lead Management System for OYO Workspaces",
    year: "2020",
    imageUrl: "https://framerusercontent.com/images/F5OiEyhxnc4SknEatc1Ks27zt2M.png?scale-down-to=512",
    displayOrder: 5,
  },
  {
    slug: "credit-based-upi-buy-now-pay-later",
    title: "Credit-Based UPI: Buy Now, Pay Later on Flipkart",
    year: "2020",
    imageUrl: "https://framerusercontent.com/images/GhnurbPFS7Gr3CqW5XIceVeY.png?scale-down-to=512",
    displayOrder: 6,
  },
  {
    slug: "complaint-management-system-oyo",
    title: "Complaint Management System for OYO",
    year: "2019",
    imageUrl: "https://framerusercontent.com/images/ReOxGXBb7FRiMVBh8sGnXi454o.png?scale-down-to=512",
    displayOrder: 7,
  },
  {
    slug: "cleartrip-desktop-homepage-refresh",
    title: "Cleartrip's Desktop Homepage Refresh",
    year: "2022",
    imageUrl: "https://framerusercontent.com/images/m3zQy5JHqbpLMbZJjWK4DeF6Kc8.png?scale-down-to=512",
    displayOrder: 8,
  },
  {
    slug: "cleartrip-home-and-accounts",
    title: "Cleartrip Home and Accounts",
    year: "2021",
    imageUrl: "https://framerusercontent.com/images/guQ9V5qFnrkrzEI9XQ1DztYdCCc.png?scale-down-to=512",
    displayOrder: 9,
  },
  {
    slug: "flight-listing-page-cleartrip",
    title: "Flight Listing Page Exploration for Cleartrip",
    year: "2023",
    imageUrl: "https://framerusercontent.com/images/PlRys5HhpspLYIcVyyWwuSQiQo4.png?scale-down-to=512",
    displayOrder: 10,
  },
  {
    slug: "upcoming-bookings-cleartrip",
    title: "Upcoming Bookings on Cleartrip",
    year: "2023",
    imageUrl: "https://framerusercontent.com/images/xgAIcSxNaRlNcgYssYNB000kEnA.png?scale-down-to=512",
    displayOrder: 11,
  },
  {
    slug: "airline-fare-families-cleartrip",
    title: "Introducing Airline Fare Families on Cleartrip",
    year: "2023",
    imageUrl: "https://framerusercontent.com/images/f7XxQn2y493zwpVxv1cgHlKp4.png?scale-down-to=512",
    displayOrder: 12,
  },
];

export const channelVideoSeedData: ChannelVideoSeed[] = [
  {
    slug: "video-obc7-u1x7nc",
    title: "Channel Video 01",
    embedUrl: "https://www.youtube.com/embed/OBc7-u1X7Nc",
    displayOrder: 1,
  },
  {
    slug: "video-fe5rg6ebbya",
    title: "Channel Video 02",
    embedUrl: "https://www.youtube.com/embed/fE5rg6EBbYA",
    displayOrder: 2,
  },
  {
    slug: "video-bgzjlawbnuq",
    title: "Channel Video 03",
    embedUrl: "https://www.youtube.com/embed/bGZjlawBnuQ",
    displayOrder: 3,
  },
  {
    slug: "video-xvxc79dssmi",
    title: "Channel Video 04",
    embedUrl: "https://www.youtube.com/embed/xVxC79dSSmI",
    displayOrder: 4,
  },
  {
    slug: "video-7m8cj7ei3s",
    title: "Channel Video 05",
    embedUrl: "https://www.youtube.com/embed/-7M8cJ7EI3s",
    displayOrder: 5,
  },
  {
    slug: "video-dphapjuydvc",
    title: "Channel Video 06",
    embedUrl: "https://www.youtube.com/embed/DPhAPJUYdVc",
    displayOrder: 6,
  },
];
