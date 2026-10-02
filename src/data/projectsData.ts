export interface ShowcaseVideo {
  src: string;
  poster?: string;
  title: string;
  aspectRatio: "reel" | "landscape" | "square";
  sectionTitle?: string;
  sectionSubtitle?: string;
  vimeoId?: string;
  vimeoUrl?: string;
}

export interface Project {
  id: string;
  slug?: string;
  title: string;
  department: string;
  category: string;
  brandName: string;
  client: string;
  year?: string;
  duration?: string;
  thumbnail?: string;
  description: string;
  paragraph2?: string;
  industry?: string;
  genre?: string;
  deliverablesText?: string;
  executionModel?: string;
  fullOverview?: string;
  challenge?: string;
  solution?: string;
  videoId?: string;
  videoUrl?: string;
  vimeoId?: string;
  vimeoUrl?: string;
  aspectRatio?: "reel" | "landscape" | "square";
  showcaseVideos?: ShowcaseVideo[];
  metrics?: { label: string; value: string }[];
  deliverables?: string[];
  systemPillars?: { pillar: string; detail: string }[];
}

export function getProjectSlug(project: Project): string {
  if (!project) return "";
  if (project.slug) return project.slug;
  const name = project.brandName || project.title || project.id;
  return name
    .toLowerCase()
    .split("/")[0]
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProjectBySlugOrId(slugOrId: string): Project | undefined {
  if (!slugOrId) return undefined;
  
  // Direct ID match
  if (projectsData[slugOrId]) return projectsData[slugOrId];
  
  const target = slugOrId.toLowerCase().trim();
  return Object.values(projectsData).find((p) => {
    return getProjectSlug(p) === target || p.id.toLowerCase() === target;
  });
}

export const projectsData: Record<string, Project> = {
  // --- WHOLE PRODUCTION ---
  "fp-1": {
    id: "fp-1",
    title: "CONSCIOUS FOOD",
    department: "Whole Content System",
    category: "Whole Content System",
    brandName: "CONSCIOUS FOOD",
    client: "Conscious Food",
    industry: "Food",
    thumbnail: "https://i.ytimg.com/vi/cG4g0ogEA1A/maxresdefault.jpg",
    description: "We produced a high-quality talking head video campaign for Conscious Food India, which played a key role in shaping the brand's image and style. Alongside this, we managed multiple post-production projects, including several engaging reels and a YouTube video.",
    paragraph2: "Our creative approach gave the brand a distinctive style and identity, helping it stand out in the digital space and enhancing its overall brand-building efforts. The content was well-received, reflecting our commitment to delivering unique, impactful results.",
    deliverablesText: "6 Instagram Reels, 1 YouTube Video",
    executionModel: "Whole Production, Post Production",
    showcaseVideos: [
      // Whole Production (the first three videos)
      {
        src: "https://youtube.com/shorts/xvukKULSKUI",
        title: "Whole Production — Video 01",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/ZDn2S2KOu-E?feature=share",
        title: "Whole Production — Video 02",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/vPhJmW52xQ0",
        title: "Whole Production — Video 03",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      // Post Production (Instagram): (the second three videos)
      {
        src: "https://youtube.com/shorts/L1hsaaQOf_s",
        title: "Post Production: Instagram — Video 01",
        aspectRatio: "reel",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/ImWc3Ap8s4w",
        title: "Post Production: Instagram — Video 02",
        aspectRatio: "reel",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/Hrme5hdxLks",
        title: "Post Production: Instagram — Video 03",
        aspectRatio: "reel",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      // Post Production (YouTube): (the last video horizontal)
      {
        src: "https://youtu.be/cG4g0ogEA1A",
        title: "Post Production: YouTube Master",
        aspectRatio: "landscape",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/cG4g0ogEA1A",
    videoId: "cG4g0ogEA1A",
    metrics: [
      { label: "Sales Lift", value: "+145%" },
      { label: "Video Completion", value: "88%" },
      { label: "Brand Sentiment", value: "99.4%" },
    ],
    deliverables: [
      "1x Master 60s Cinema Commercial",
      "12x Social Performance Cutdowns",
      "High-Resolution Print Key Art",
    ],
    systemPillars: [
      { pillar: "Strategy", detail: "Organic brand story blueprint and audience segment positioning." },
      { pillar: "Production", detail: "4K cinema multi-cam shoot with natural lighting setups." },
      { pillar: "Post-Production", detail: "Color grading, organic foley sound design, and master edit." },
    ],
  },
  "fp-2": {
    id: "fp-2",
    title: "NATURAL VENEERS",
    department: "Whole Content System",
    category: "Whole Content System",
    brandName: "NATURAL VENEERS",
    client: "Natural Veneers",
    industry: "Interior Decor Panels",
    description: "In 2024, we partnered with Natural Veneers, one of India’s leading brands in the veneer industry, to elevate their brand identity through a series of high-impact content. Our team produced a range of short-form videos, including documentary-style product features, a creative campaign, dynamic 3D visuals, and sleek B-roll footage.",
    paragraph2: "These videos showcased the brand’s craftsmanship and innovation, giving them a distinctive voice in the market. The fresh, creative approach not only highlighted their products but also strengthened their brand positioning, contributing significantly to their ongoing brand-building efforts. The project helped Natural Veneers stand out in a competitive industry, driving engagement and growth.",
    deliverablesText: "6 Reel Ad Campaign",
    executionModel: "Whole Production",
    thumbnail: "https://i.ytimg.com/vi/WIiHSmqSqHg/hqdefault.jpg",
    challenge: "Capturing delicate wood textures and metallic inlay reflections under complex interior lighting setups.",
    solution: "Deployed specialized macro cinema lenses, motorized slider camera rigs, and high-dynamic-range color grading.",
    showcaseVideos: [
      {
        src: "https://youtube.com/shorts/WIiHSmqSqHg",
        poster: "https://i.ytimg.com/vi/WIiHSmqSqHg/hqdefault.jpg",
        title: "Whole Production — Video 01",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/6UubOhdA0yw",
        poster: "https://i.ytimg.com/vi/6UubOhdA0yw/hqdefault.jpg",
        title: "Whole Production — Video 02",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/-YMHVeKep4I",
        poster: "https://i.ytimg.com/vi/-YMHVeKep4I/hqdefault.jpg",
        title: "Whole Production — Video 03",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/07IoJKgFuq0",
        poster: "https://i.ytimg.com/vi/07IoJKgFuq0/hqdefault.jpg",
        title: "Whole Production — Video 04",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/togp7fP0OfQ",
        poster: "https://i.ytimg.com/vi/togp7fP0OfQ/hqdefault.jpg",
        title: "Whole Production — Video 05",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/iE9zhXEY3ig",
        poster: "https://i.ytimg.com/vi/iE9zhXEY3ig/hqdefault.jpg",
        title: "Whole Production — Video 06",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      }
    ],
    videoUrl: "https://youtube.com/shorts/WIiHSmqSqHg",
    videoId: "WIiHSmqSqHg",
    metrics: [
      { label: "Architect Lead Rate", value: "+210%" },
      { label: "Global Views", value: "4.2M" },
      { label: "Design Award", value: "Featured" },
    ],
    deliverables: [
      "1x 75-Second Architectural Cinema Film",
      "8x Design Showcase Short Cutdowns",
      "Lookbook Photography Suite",
    ],
    systemPillars: [
      { pillar: "Production", detail: "Precision slider motion control, macro lens detail capture, and 4K filming." },
      { pillar: "Post-Production", detail: "HDR color grading and ambient architectural audio scoring." },
    ],
  },

  // --- WHOLE CONTENT SYSTEMS ---
  "wcs-1": {
    id: "wcs-1",
    title: "HUMMING BIRD",
    department: "Content Production",
    category: "Content Production",
    brandName: "HUMMING BIRD",
    client: "Humming Bird",
    industry: "Clothing & Fashion",
    thumbnail: "https://i.ytimg.com/vi/eRuZm1WGz4E/hqdefault.jpg",
    description: "Humming Bird is an Indo-Western fashion label out of Siliguri, West Bengal, and we built their content system from the ground up planning, production, and execution, all under one roof. The brief was simple: give their new collection a campaign that felt premium and cinematic, not like another feed post. We stayed on for their next campaign too, this time carrying it through post-production, keeping the same standard consistent across both.",
    deliverablesText: "9 Reels Ad Campaign, 3 Reels",
    executionModel: "Whole Production, Post Production",
    showcaseVideos: [
      // Whole Production (9 Videos)
      {
        src: "https://youtube.com/shorts/eRuZm1WGz4E",
        poster: "https://i.ytimg.com/vi/eRuZm1WGz4E/hqdefault.jpg",
        title: "Whole Production — Video 01",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/zHnkPp-zH74",
        poster: "https://i.ytimg.com/vi/zHnkPp-zH74/hqdefault.jpg",
        title: "Whole Production — Video 02",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/5BjycWRInQk",
        poster: "https://i.ytimg.com/vi/5BjycWRInQk/hqdefault.jpg",
        title: "Whole Production — Video 03",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/-7RrpSRXhWE",
        poster: "https://i.ytimg.com/vi/-7RrpSRXhWE/hqdefault.jpg",
        title: "Whole Production — Video 04",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/RcHHh8VRK4Y",
        poster: "https://i.ytimg.com/vi/RcHHh8VRK4Y/hqdefault.jpg",
        title: "Whole Production — Video 05",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/s-91kpFtigE",
        poster: "https://i.ytimg.com/vi/s-91kpFtigE/hqdefault.jpg",
        title: "Whole Production — Video 06",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/nV4qqSGcq8g",
        poster: "https://i.ytimg.com/vi/nV4qqSGcq8g/hqdefault.jpg",
        title: "Whole Production — Video 07",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/QNIWEMyMwms",
        poster: "https://i.ytimg.com/vi/QNIWEMyMwms/hqdefault.jpg",
        title: "Whole Production — Video 08",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/UdmxY56Me6o",
        poster: "https://i.ytimg.com/vi/UdmxY56Me6o/hqdefault.jpg",
        title: "Whole Production — Video 09",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      // Post Production (3 Videos)
      {
        src: "https://youtube.com/shorts/H3p5d2AdpIE",
        poster: "https://i.ytimg.com/vi/H3p5d2AdpIE/hqdefault.jpg",
        title: "Post Production — Video 01",
        aspectRatio: "reel",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/di9cTKTs7Sk",
        poster: "https://i.ytimg.com/vi/di9cTKTs7Sk/hqdefault.jpg",
        title: "Post Production — Video 02",
        aspectRatio: "reel",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/Kf9w4Y86aoo",
        poster: "https://i.ytimg.com/vi/Kf9w4Y86aoo/hqdefault.jpg",
        title: "Post Production — Video 03",
        aspectRatio: "reel",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "Instagram"
      }
    ],
    videoUrl: "https://youtube.com/shorts/eRuZm1WGz4E",
    videoId: "eRuZm1WGz4E",
    metrics: [
      { label: "Reel Ad Campaign", value: "9 Videos" },
      { label: "Post Production", value: "3 Reels" },
      { label: "Brand Positioning", value: "Premium" },
    ],
    deliverables: [
      "9x Premium Campaign Reel Ads",
      "3x Post-Production Social Cutdowns",
      "Cinematic Fashion Lookbook",
    ],
    systemPillars: [
      { pillar: "Strategy & Production", detail: "End-to-end planning, production, and execution under one roof." },
      { pillar: "Post-Production", detail: "Consistent high-standard color grading and edit pacing across campaigns." },
    ],
  },
  "wcs-2": {
    id: "wcs-2",
    title: "SAKSHISAYYS",
    department: "Whole Content System",
    category: "Whole Content System",
    brandName: "SAKSHISAYYS",
    client: "Sakshisayys",
    industry: "Astrology",
    thumbnail: "https://i.ytimg.com/vi/SOlgWB8gfbE/hqdefault.jpg",
    description: "Sakshi Parab is an astrologer, and we built the full campaign around the launch of her new product, Super Dhanyogg Rakhi — content production carried end-to-end, from concept through delivery. The goal was simple: give a product launch in a category that rarely gets premium treatment the same commercial polish a major brand would expect, and put it in front of her audience at that standard.",
    deliverablesText: "6 Reel Ad Campaign",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtube.com/shorts/SOlgWB8gfbE",
        poster: "https://i.ytimg.com/vi/SOlgWB8gfbE/hqdefault.jpg",
        title: "Whole Production — Video 01",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/YBsC88yCO0M",
        poster: "https://i.ytimg.com/vi/YBsC88yCO0M/hqdefault.jpg",
        title: "Whole Production — Video 02",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/p7uQcjR-dAI",
        poster: "https://i.ytimg.com/vi/p7uQcjR-dAI/hqdefault.jpg",
        title: "Whole Production — Video 03",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/wow0yFhRma8",
        poster: "https://i.ytimg.com/vi/wow0yFhRma8/hqdefault.jpg",
        title: "Whole Production — Video 04",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/qNmvJggIzhQ",
        poster: "https://i.ytimg.com/vi/qNmvJggIzhQ/hqdefault.jpg",
        title: "Whole Production — Video 05",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/60Cau_XIDs4",
        poster: "https://i.ytimg.com/vi/60Cau_XIDs4/hqdefault.jpg",
        title: "Whole Production — Video 06",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      }
    ],
    videoUrl: "https://youtube.com/shorts/SOlgWB8gfbE",
    videoId: "SOlgWB8gfbE",
    metrics: [
      { label: "Reel Ad Campaign", value: "6 Videos" },
      { label: "Execution", value: "End-to-End" },
      { label: "Category Polish", value: "Commercial" },
    ],
    deliverables: [
      "6x Premium Launch Campaign Reel Ads",
      "Product Concept & Creative Direction",
      "High-Retention Edit Suite",
    ],
    systemPillars: [
      { pillar: "End-to-End Production", detail: "Carried from initial product launch concept through to final delivery." },
      { pillar: "Commercial Polish", detail: "Elevating astrology category content to commercial brand standard." },
    ],
  },
  "wcs-3": {
    id: "wcs-3",
    title: "MYSTIC MANN",
    department: "Whole Content System",
    category: "Whole Content System",
    brandName: "MYSTIC MANN",
    client: "Mystic Mann",
    industry: "Astrology",
    thumbnail: "https://i.ytimg.com/vi/JRLXtBRLtiA/hqdefault.jpg",
    description: "We began an exciting collaboration with Mystic Panels, delivering a variety of creative content that set new trends in the market. Our work included producing engaging podcast setup reels, dynamic B-roll reels, trendy reels, talking head reels, and innovative concept posts. Each piece was crafted with a fresh and creative approach, pushing boundaries and establishing new trends for the brand.",
    paragraph2: "The market responded exceptionally well, with our content creation significantly boosting the brand's visibility and overall growth. Our efforts helped solidify Mystic Panels' position as a forward-thinking and dynamic brand in the industry.",
    deliverablesText: "15 Reel AD Campaign, 4 Creative Posts",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtube.com/shorts/JRLXtBRLtiA",
        poster: "https://i.ytimg.com/vi/JRLXtBRLtiA/hqdefault.jpg",
        title: "Whole Production — Video 01",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/Vh4oUNGGryY",
        poster: "https://i.ytimg.com/vi/Vh4oUNGGryY/hqdefault.jpg",
        title: "Whole Production — Video 02",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/oWreyF-HhAI",
        poster: "https://i.ytimg.com/vi/oWreyF-HhAI/hqdefault.jpg",
        title: "Whole Production — Video 03",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/V7TBnlqaGT0",
        poster: "https://i.ytimg.com/vi/V7TBnlqaGT0/hqdefault.jpg",
        title: "Whole Production — Video 04",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/qG7bdm-QtNw",
        poster: "https://i.ytimg.com/vi/qG7bdm-QtNw/hqdefault.jpg",
        title: "Whole Production — Video 05",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/iBmGrx3lhhA",
        poster: "https://i.ytimg.com/vi/iBmGrx3lhhA/hqdefault.jpg",
        title: "Whole Production — Video 06",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/z3_qsrwFlrU",
        poster: "https://i.ytimg.com/vi/z3_qsrwFlrU/hqdefault.jpg",
        title: "Whole Production — Video 07",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/n92tFZaOIIg",
        poster: "https://i.ytimg.com/vi/n92tFZaOIIg/hqdefault.jpg",
        title: "Whole Production — Video 08",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/VYMOZFzlPfQ",
        poster: "https://i.ytimg.com/vi/VYMOZFzlPfQ/hqdefault.jpg",
        title: "Whole Production — Video 09",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/tBnvNihIl8o",
        poster: "https://i.ytimg.com/vi/tBnvNihIl8o/hqdefault.jpg",
        title: "Whole Production — Video 10",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/7_aTyZPycds",
        poster: "https://i.ytimg.com/vi/7_aTyZPycds/hqdefault.jpg",
        title: "Whole Production — Video 11",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/PVoNDB7jYio",
        poster: "https://i.ytimg.com/vi/PVoNDB7jYio/hqdefault.jpg",
        title: "Whole Production — Video 12",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/VRU2oq3wfqY",
        poster: "https://i.ytimg.com/vi/VRU2oq3wfqY/hqdefault.jpg",
        title: "Whole Production — Video 13",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/iV7HfM5GDrM",
        poster: "https://i.ytimg.com/vi/iV7HfM5GDrM/hqdefault.jpg",
        title: "Whole Production — Video 14",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "",
        poster: "/creatives/mystic-mann/Creative - Post 01.png",
        title: "Creative Concept — Post 01",
        aspectRatio: "square",
        sectionTitle: "CREATIVE DESIGNS",
        sectionSubtitle: "Instagram"
      },
      {
        src: "",
        poster: "/creatives/mystic-mann/Creative - Post 02.png",
        title: "Creative Concept — Post 02",
        aspectRatio: "square",
        sectionTitle: "CREATIVE DESIGNS",
        sectionSubtitle: "Instagram"
      },
      {
        src: "",
        poster: "/creatives/mystic-mann/Creative - Post 03.png",
        title: "Creative Concept — Post 03",
        aspectRatio: "square",
        sectionTitle: "CREATIVE DESIGNS",
        sectionSubtitle: "Instagram"
      },
      {
        src: "",
        poster: "/creatives/mystic-mann/Creative - Post 04.png",
        title: "Creative Concept — Post 04",
        aspectRatio: "square",
        sectionTitle: "CREATIVE DESIGNS",
        sectionSubtitle: "Instagram"
      }
    ],
    videoUrl: "https://youtube.com/shorts/JRLXtBRLtiA",
    videoId: "JRLXtBRLtiA",
    metrics: [
      { label: "Reel Ad Campaign", value: "15 Videos" },
      { label: "Creative Posts", value: "4 Designs" },
      { label: "Brand Growth", value: "Significant" },
    ],
    deliverables: [
      "15x Reel Ad Campaign Videos",
      "4x Creative Concept Posts & Designs",
      "Podcast Setup & Talking Head Reels",
      "Dynamic B-Roll & Concept Posts",
    ],
    systemPillars: [
      { pillar: "Content Production", detail: "Podcast setup reels, dynamic B-roll, talking head reels, and 4 creative concept posts." },
      { pillar: "Brand Building", detail: "Boosting visibility and solidifying market position through trend-setting designs." },
    ],
  },
  "wcs-4": {
    id: "wcs-4",
    title: "EUROTREND",
    department: "Whole Content System",
    category: "Whole Content System",
    brandName: "EUROTREND",
    client: "Eurotrend Luxury",
    industry: "Interior Decor Panels",
    thumbnail: "https://i.ytimg.com/vi/JJ7R08ByXxg/hqdefault.jpg",
    description: "We developed a comprehensive social media campaign for Eurotrend Luxury, featuring a captivating showroom showcase video series along with multiple product videos. These visual assets established a strong digital presence for the brand, transforming its image and extending its reach beyond the offline market where it had previously thrived.",
    paragraph2: "The engaging content resonated well with the audience, enhancing brand recognition and appreciation. Eurotrend Luxury consistently expressed gratitude for our work, recognizing its positive impact on their overall brand strategy.",
    deliverablesText: "6 Reel AD Campaign",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtube.com/shorts/JJ7R08ByXxg",
        poster: "https://i.ytimg.com/vi/JJ7R08ByXxg/hqdefault.jpg",
        title: "Whole Production — Video 01",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/GGAD8IqYlas",
        poster: "https://i.ytimg.com/vi/GGAD8IqYlas/hqdefault.jpg",
        title: "Whole Production — Video 02",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/cIe4d711IKk",
        poster: "https://i.ytimg.com/vi/cIe4d711IKk/hqdefault.jpg",
        title: "Whole Production — Video 03",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/adTdNv3cLQY",
        poster: "https://i.ytimg.com/vi/adTdNv3cLQY/hqdefault.jpg",
        title: "Whole Production — Video 04",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/_AziyXUJYBY",
        poster: "https://i.ytimg.com/vi/_AziyXUJYBY/hqdefault.jpg",
        title: "Whole Production — Video 05",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/PthnPM4jLi8",
        poster: "https://i.ytimg.com/vi/PthnPM4jLi8/hqdefault.jpg",
        title: "Whole Production — Video 06",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      }
    ],
    videoUrl: "https://youtube.com/shorts/JJ7R08ByXxg",
    videoId: "JJ7R08ByXxg",
    metrics: [
      { label: "Reel Ad Campaign", value: "6 Videos" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Digital Reach", value: "Expanded" },
    ],
    deliverables: [
      "6x Showroom & Product Showcase Reel Ads",
      "Digital Brand Transformation Suite",
      "High-Resolution Product Visuals",
    ],
    systemPillars: [
      { pillar: "Digital Transformation", detail: "Extending brand presence beyond offline markets into digital social channels." },
      { pillar: "Showcase Production", detail: "Captivating showroom featurettes and product showcase videos." },
    ],
  },
  "wcs-5": {
    id: "wcs-5",
    title: "SHALINA GUPTA",
    department: "Content Production",
    category: "Content Production",
    brandName: "SHALINA GUPTA",
    client: "Shalina Gupta",
    industry: "Wellness Coach",
    thumbnail: "https://i.ytimg.com/vi/uC-omiCduLY/hqdefault.jpg",
    description: "Shalina Gupta is a wellness coach, and we took on her content production entirely — a six-video campaign built to feel less like marketing and more like a real conversation. No overproduced wellness-brand gloss; the goal was authenticity that actually grows an audience, so we leaned into interactive formats and a raw, unfiltered look that matches how she actually shows up for her community. It's the kind of content that earns trust because it doesn't try too hard to look like content.",
    deliverablesText: "6 Reel Campaign",
    executionModel: "Content Production",
    showcaseVideos: [
      {
        src: "https://youtube.com/shorts/uC-omiCduLY",
        poster: "https://i.ytimg.com/vi/uC-omiCduLY/hqdefault.jpg",
        title: "Whole Production — Video 01",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/DPXkhKHI3XA",
        poster: "https://i.ytimg.com/vi/DPXkhKHI3XA/hqdefault.jpg",
        title: "Whole Production — Video 02",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/xxx7RtRizjM",
        poster: "https://i.ytimg.com/vi/xxx7RtRizjM/hqdefault.jpg",
        title: "Whole Production — Video 03",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/iYI2D7RRwsI",
        poster: "https://i.ytimg.com/vi/iYI2D7RRwsI/hqdefault.jpg",
        title: "Whole Production — Video 04",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/Nn0XqjVM5TM",
        poster: "https://i.ytimg.com/vi/Nn0XqjVM5TM/hqdefault.jpg",
        title: "Whole Production — Video 05",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/sejTp75O_88",
        poster: "https://i.ytimg.com/vi/sejTp75O_88/hqdefault.jpg",
        title: "Whole Production — Video 06",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      }
    ],
    videoUrl: "https://youtube.com/shorts/uC-omiCduLY",
    videoId: "uC-omiCduLY",
    metrics: [
      { label: "Reel Campaign", value: "6 Videos" },
      { label: "Execution", value: "Content Prod" },
      { label: "Audience Trust", value: "Authentic" },
    ],
    deliverables: [
      "6x Authentic Wellness Coach Reel Videos",
      "Interactive Community Video Formats",
      "Raw & Unfiltered Aesthetic Edit Suite",
    ],
    systemPillars: [
      { pillar: "Authentic Production", detail: "Leaning into interactive formats and a raw, unfiltered look matching community presence." },
      { pillar: "Trust Building", detail: "Conversational content that earns audience trust without overproduced gloss." },
    ],
  },

  // --- COMMERCIALS / CAMPAIGNS ---
  /* TEMPORARILY REMOVED HERO MOTORS TILE AS REQUESTED
  "cc-1": {
    id: "cc-1",
    title: "HERO MOTORS",
    department: "Commercials/Campaigns",
    category: "Commercials/Campaigns",
    brandName: "HERO MOTORS",
    client: "Hero Motors",
    industry: "Automobile",
    thumbnail: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
    description: "The Gravity Studios created a dynamic commercial for Hero Motors, handling everything from concept development to final production. Our goal was to capture the spirit of innovation and reliability that defines the brand, delivering a high-energy visual experience that resonated with viewers.",
    paragraph2: "The final commercial received high praise, especially from the Hero Motors showroom owner, who was impressed by the quality and impact of our work. It was broadcast widely, reinforcing Hero Motors' brand presence and highlighting our commitment to delivering top-tier content.",
    deliverablesText: "Advertisement",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "",
        poster: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
        title: "Whole Production Commercial Master",
        aspectRatio: "landscape",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Television & Broadcast"
      }
    ],
    videoUrl: "",
    videoId: "3KAgsO0guuM",
    metrics: [
      { label: "Commercial AD", value: "Broadcast" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Showroom Feedback", value: "High Praise" },
    ],
    deliverables: [
      "1x Flagship Dynamic Broadcast Commercial",
      "Concept Development & Scripting Suite",
      "Full Cinema Post-Production & Color Grade",
    ],
    systemPillars: [
      { pillar: "Concept to Delivery", detail: "Handling everything from initial concept development through to final high-energy production." },
      { pillar: "Brand Reinforcement", detail: "Capturing innovation and reliability to reinforce nationwide brand presence." },
    ],
  },
  */
  "cc-2": {
    id: "cc-2",
    title: "ULTIMO",
    department: "Commercials/Campaigns",
    category: "Commercials/Campaigns",
    brandName: "ULTIMO",
    client: "Ultimo",
    industry: "Interior Decor Panels",
    thumbnail: "https://i.ytimg.com/vi/VHvxKgrdmuA/hqdefault.jpg",
    description: "In 2024, we crafted a remarkable campaign for Ultimo, overseeing everything from creative design to strategic execution. Our team meticulously planned each element, ensuring the visuals and messaging resonated with the target audience. The campaign’s success was undeniable, generating a surge in leads and elevating Ultimo’s brand presence.",
    paragraph2: "With increased engagement and market growth, this campaign became a shining example of how our work helps brands thrive, showcasing our ability to blend creativity with impactful results.",
    deliverablesText: "3 AD Campaign",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtube.com/shorts/VHvxKgrdmuA",
        poster: "https://i.ytimg.com/vi/VHvxKgrdmuA/hqdefault.jpg",
        title: "Whole Production — Video 01",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/1C77m1X8xDQ",
        poster: "https://i.ytimg.com/vi/1C77m1X8xDQ/hqdefault.jpg",
        title: "Whole Production — Video 02",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/PCtAyZPPwo0",
        poster: "https://i.ytimg.com/vi/PCtAyZPPwo0/hqdefault.jpg",
        title: "Whole Production — Video 03",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      },
      {
        src: "https://youtube.com/shorts/RtUPqnuWYAA",
        poster: "https://i.ytimg.com/vi/RtUPqnuWYAA/hqdefault.jpg",
        title: "Behind The Scenes (Campaign)",
        aspectRatio: "reel",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "Instagram"
      }
    ],
    videoUrl: "https://youtube.com/shorts/VHvxKgrdmuA",
    videoId: "VHvxKgrdmuA",
    metrics: [
      { label: "AD Campaign", value: "3 Videos" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Lead Generation", value: "Surge" },
    ],
    deliverables: [
      "3x Premium Commercial Ad Campaign",
      "Strategic Visual Messaging Architecture",
      "Behind-The-Scenes Featurette",
    ],
    systemPillars: [
      { pillar: "Strategic Planning", detail: "Meticulously planning visual and messaging resonance for target audience." },
      { pillar: "Brand Elevation", detail: "Generating lead surges and establishing elevated market presence." },
    ],
  },
  "cc-3": {
    id: "cc-3",
    title: "TATA CLIQ LUXURY",
    department: "Commercials/Campaigns",
    category: "Commercials/Campaigns",
    brandName: "TATA CLIQ LUXURY",
    client: "Tata CLIQ Luxury",
    industry: "Travel",
    thumbnail: "https://i.ytimg.com/vi/X7f06TOu7ro/hqdefault.jpg",
    description: "We collaborated with influencers Ramona Arena and Zoyebb Khan for the post-production of a creative campaign with Tata Cliq Luxury. This brand partnership required a keen understanding of both influencers' styles and the brand's aesthetic. Working with the provided rushes, we delivered high-quality results that resonated with the project’s vision.",
    paragraph2: "Both Ramona and Zoyebb appreciated our creative approach and professionalism throughout the process. The final reel generated significant engagement, boosting the brand’s reach and enhancing its presence on social media. This collaboration proved to be a success for all parties involved.",
    deliverablesText: "1 AD Campaign",
    executionModel: "Post Production",
    showcaseVideos: [
      {
        src: "https://youtube.com/shorts/X7f06TOu7ro",
        poster: "https://i.ytimg.com/vi/X7f06TOu7ro/hqdefault.jpg",
        title: "Post Production — Video 01",
        aspectRatio: "reel",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "Instagram"
      }
    ],
    videoUrl: "https://youtube.com/shorts/X7f06TOu7ro",
    videoId: "X7f06TOu7ro",
    metrics: [
      { label: "AD Campaign", value: "1 Video" },
      { label: "Execution", value: "Post Prod" },
      { label: "Brand Reach", value: "Significant" },
    ],
    deliverables: [
      "1x High-Fashion Travel Campaign Reel",
      "Influencer Brand Style Alignment",
      "Post-Production Rushes Edit & Color Grade",
    ],
    systemPillars: [
      { pillar: "Post-Production", detail: "Expert editing of provided rushes aligning with influencer styles and brand aesthetic." },
      { pillar: "Brand Synergy", detail: "Enhancing social media presence and engagement for luxury travel collaboration." },
    ],
  },
  "cc-4": {
    id: "cc-4",
    title: "RIDDHI KHOSLA JALAN",
    department: "Content Production",
    category: "Content Production",
    brandName: "RIDDHI KHOSLA JALAN",
    client: "Riddhi Khosla Jalan",
    year: "2026",
    duration: "0:50 Campaign Spot",
    thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    description: "Interior design campaign highlighting luxury home transformations and spatial elegance.",
    fullOverview: "A visually rich brand campaign for interior designer Riddhi Khosla Jalan, showcasing high-end residential projects.",
    challenge: "Translating tactile interior materials and spatial depth into engaging video formats.",
    solution: "Smooth camera motion, warm ambient lighting, and insightful designer commentary.",
    showcaseVideos: [
      {
        src: "https://youtube.com/shorts/9Gd0OZ7bzsM",
        poster: "https://i.ytimg.com/vi/9Gd0OZ7bzsM/hqdefault.jpg",
        title: "Commercials / Campaigns — Video 01",
        aspectRatio: "reel",
        sectionTitle: "COMMERCIALS / CAMPAIGNS",
        sectionSubtitle: "Instagram"
      }
    ],
    videoUrl: "https://youtube.com/shorts/9Gd0OZ7bzsM",
    videoId: "9Gd0OZ7bzsM",
    metrics: [
      { label: "High-Net-Worth Leads", value: "+230%" },
      { label: "Video Engagement", value: "9.2%" },
      { label: "Press Features", value: "15 Outlets" },
    ],
    deliverables: [
      "1x Master Interior Design Campaign Film",
      "8x Project Walkthrough Reels",
      "High-Resolution Portfolio Stills",
    ],
    systemPillars: [
      { pillar: "Strategy", detail: "Luxury interior brand positioning and lead generation funnel." },
      { pillar: "Production", detail: "Gimbal architectural camera motion and lighting capture." },
    ],
  },
  "cc-5": {
    id: "cc-5",
    title: "15REPMAX",
    department: "Commercials/Campaigns",
    category: "Commercials/Campaigns",
    brandName: "15REPMAX",
    client: "15repmax Gym",
    industry: "Fitness",
    thumbnail: "https://i.ytimg.com/vi/6Zek78Ptx_Y/hqdefault.jpg",
    description: "We produced a dynamic commercial for 15repmax Gym, meticulously crafting it to reflect the gym's unique brand identity. From the visuals to the tone, every element was designed to deliver a specific look and feel that truly represented their core values.",
    paragraph2: "The commercial not only set the gym apart from its competitors but also gave it a fresh and distinctive presence in the fitness industry. The campaign successfully increased the gym’s engagement, attracting attention and boosting visibility. The team at 15repmax Gym appreciated our creative vision and expressed their satisfaction with the final result, marking the collaboration as a success.",
    deliverablesText: "1 Advertisement Campaign",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtu.be/6Zek78Ptx_Y",
        poster: "https://i.ytimg.com/vi/6Zek78Ptx_Y/hqdefault.jpg",
        title: "Whole Production Commercial Master",
        aspectRatio: "landscape",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/6Zek78Ptx_Y",
    videoId: "6Zek78Ptx_Y",
    metrics: [
      { label: "AD Campaign", value: "1 Commercial" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Brand Presence", value: "Distinctive" },
    ],
    deliverables: [
      "1x Flagship Produced Fitness Commercial",
      "Custom Brand Identity Visual Suite",
      "Dynamic Kinetic Gym Editing & Audio Mix",
    ],
    systemPillars: [
      { pillar: "Brand Identity Crafting", detail: "Meticulously designing visuals and tone to reflect 15repmax Gym's core values." },
      { pillar: "Industry Differentiation", detail: "Creating a fresh and distinctive fitness presence that boosts engagement and visibility." },
    ],
  },
  "cc-6": {
    id: "cc-6",
    title: "PSA - EVERY BITE MATTERS",
    department: "Commercials/Campaigns",
    category: "Commercials/Campaigns",
    brandName: "EVERY BITE MATTERS",
    client: "Baithack India",
    industry: "Food",
    thumbnail: "https://i.ytimg.com/vi/chTtXY6R5dA/hqdefault.jpg",
    description: "The Gravity Studios collaborated with Baithack India to produce a PSA on the importance of reducing food waste. Through impactful visuals and heartfelt storytelling, we emphasized the value of every meal, contrasting abundance with scarcity to highlight the urgency of the issue. The campaign connected emotionally with viewers, encouraging small but meaningful actions. By showcasing how mindful choices can reduce waste and support those in need, we reinforced a simple yet powerful message: real change begins at home one plate at a time.",
    deliverablesText: "1 Advertisement Campaign",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtu.be/chTtXY6R5dA",
        poster: "https://i.ytimg.com/vi/chTtXY6R5dA/hqdefault.jpg",
        title: "Whole Production PSA Master Film",
        aspectRatio: "landscape",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/chTtXY6R5dA",
    videoId: "chTtXY6R5dA",
    metrics: [
      { label: "AD Campaign", value: "1 PSA" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Impact", value: "Emotional" },
    ],
    deliverables: [
      "1x Flagship Produced Food Waste PSA Commercial",
      "Heartfelt Storytelling & Scarcity Contrast Edit",
      "Social Impact Call-to-Action Audio Mix",
    ],
    systemPillars: [
      { pillar: "Impactful Visuals", detail: "Contrasting abundance with scarcity to highlight the urgency of reducing food waste." },
      { pillar: "Emotional Connection", detail: "Encouraging mindful choices and reinforcing that real change begins at home." },
    ],
  },
  "cc-7": {
    id: "cc-7",
    title: "WINGMAN",
    department: "Commercials/Campaigns",
    category: "Commercials/Campaigns",
    brandName: "WINGMAN",
    client: "Wingman OTT Film",
    genre: "Drama",
    industry: "Film & OTT Release",
    thumbnail: "/posters/wingman/Wingman Poster - Draft 01.png",
    description: "We designed the movie poster for the film WINGMAN, directed by Anuj Gulati, which was set to release on OTT platforms. After discussing the creative vision with Anuj in several meetings, we gained a clear understanding of his vision for the poster. Through numerous revisions and brainstorming sessions, we created three distinct looks, each capturing a unique aspect of the film. Anuj greatly appreciated our attention to detail and the final outcome. The collaborative process ensured that the poster not only aligned with his vision but also resonated with the intended audience.",
    deliverablesText: "Poster Design Campaign",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "",
        poster: "/posters/wingman/Wingman Poster - Draft 01.png",
        title: "Poster Design — Look 01",
        aspectRatio: "reel",
        sectionTitle: "POSTER CAMPAIGN",
        sectionSubtitle: "OTT Release"
      },
      {
        src: "",
        poster: "/posters/wingman/Wingman Poster - Draft 02.png",
        title: "Poster Design — Look 02",
        aspectRatio: "reel",
        sectionTitle: "POSTER CAMPAIGN",
        sectionSubtitle: "OTT Release"
      },
      {
        src: "",
        poster: "/posters/wingman/Wingman Poster - Draft 03.png",
        title: "Poster Design — Look 03",
        aspectRatio: "reel",
        sectionTitle: "POSTER CAMPAIGN",
        sectionSubtitle: "OTT Release"
      }
    ],
    metrics: [
      { label: "Genre", value: "Drama" },
      { label: "Design Variants", value: "3 Distinct Looks" },
      { label: "Release Platform", value: "OTT Channels" },
    ],
    deliverables: [
      "3x Distinct Key Art OTT Movie Poster Looks",
      "Director Creative Vision Alignment & Iteration",
      "High-Resolution Print & Digital OTT Art Package",
    ],
    systemPillars: [
      { pillar: "Collaborative Vision", detail: "Partnering closely with director Anuj Gulati across brainstorming and key art iterations." },
      { pillar: "OTT Key Art", detail: "Designing 3 distinct visual treatments tailored for streaming audience resonance." },
    ],
  },

  // --- MUSIC VIDEOS ---
  "mv-1": {
    id: "mv-1",
    title: "BEFORE THE FALL",
    department: "Music Videos",
    category: "Music Videos",
    brandName: "PRMT 1.O",
    client: "PRMT",
    genre: "Hip Hop",
    industry: "Music & Entertainment",
    thumbnail: "https://i.ytimg.com/vi/ZuGB79aNpaw/hqdefault.jpg",
    description: "Before We Fall isn’t just a song it’s the opening scene of a universe. Written, performed, and directed by Prameet Patani, the track launches PRMT 1.O, where hip-hop, cinema, and character collide in one surreal vision. Set entirely in a black void, it strips away all familiarity no sky, no city, no ground only rhythm, people, and control. Those people move within PRMT’s influence, orbiting a figure who commands the frame with silence as much as sound. Blending gritty hip-hop with Indian textures, the song delivers unapologetic, self-obsessed verses against poetic minimalism a creator building his own mythology, a performer ruling his own world, capturing that electrifying moment before chaos, when control feels eternal.",
    deliverablesText: "A Whole Music Video",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtu.be/ZuGB79aNpaw",
        poster: "https://i.ytimg.com/vi/ZuGB79aNpaw/hqdefault.jpg",
        title: "Whole Production Music Video Master",
        aspectRatio: "landscape",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/ZuGB79aNpaw",
    videoId: "ZuGB79aNpaw",
    metrics: [
      { label: "Genre", value: "Hip Hop" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Universe", value: "PRMT 1.O" },
    ],
    deliverables: [
      "1x Official Flagship Music Video Master",
      "Creative Direction, Script & Performance",
      "Minimalist Black Void Set Production & Scoring",
    ],
    systemPillars: [
      { pillar: "Written & Directed", detail: "Written, performed, and directed by Prameet Patani launching the PRMT 1.O universe." },
      { pillar: "Poetic Minimalism", detail: "Set in a black void blending gritty hip-hop with Indian textures and controlled silence." },
    ],
  },
  "mv-2": {
    id: "mv-2",
    title: "GARDISH",
    department: "Music Videos",
    category: "Music Videos",
    brandName: "GARDISH",
    client: "Gardish",
    genre: "Hip Hop",
    industry: "Music & Entertainment",
    thumbnail: "https://i.ytimg.com/vi/9pY4jowwmeo/hqdefault.jpg",
    description: "In this classically crafted music video, we present a tale of friendship, love, and the trials we face along the way. Prameet takes center stage, sharing intimate moments and relatable experiences with his closest companions. As the song unfolds, the seamless fusion of heartfelt lyrics and an elegant melody will tug at your heartstrings.",
    deliverablesText: "A Whole Music Video",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtu.be/9pY4jowwmeo",
        poster: "https://i.ytimg.com/vi/9pY4jowwmeo/hqdefault.jpg",
        title: "Whole Production Music Video Master",
        aspectRatio: "landscape",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/9pY4jowwmeo",
    videoId: "9pY4jowwmeo",
    metrics: [
      { label: "Genre", value: "Hip Hop" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Storytelling", value: "Heartfelt" },
    ],
    deliverables: [
      "1x Official Flagship Narrative Music Video",
      "Cinematic Lighting & Location Production",
      "Heartfelt Lyric & Melody Sound Master",
    ],
    systemPillars: [
      { pillar: "Relatable Narrative", detail: "Classically crafted story of friendship, love, and life's trials featuring Prameet." },
      { pillar: "Heartfelt Fusion", detail: "Seamless blending of evocative lyrics and elegant musical melody." },
    ],
  },
  "mv-3": {
    id: "mv-3",
    title: "BIRTHDAY FREESTYLE 24",
    department: "Music Videos",
    category: "Music Videos",
    brandName: "BIRTHDAY FREESTYLE",
    client: "Prameet Patani",
    genre: "Hip Hop",
    industry: "Music & Entertainment",
    thumbnail: "https://i.ytimg.com/vi/KxYxseeRHc4/hqdefault.jpg",
    description: "\"Birthday Freestyle 24\" is Prameet Patani’s long-awaited return, dropping on his birthday to mark a fresh chapter after a year away. This track is more than just music it’s a glimpse into his life, his growth, and his ambition to make a mark. With every line, Prameet brings you closer to his world, capturing the highs, the hustle, and what’s next. Tap in and join the journey; this is just the beginning.",
    deliverablesText: "A Whole Music Video",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtu.be/KxYxseeRHc4",
        poster: "https://i.ytimg.com/vi/KxYxseeRHc4/hqdefault.jpg",
        title: "Whole Production Music Video Master",
        aspectRatio: "landscape",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/KxYxseeRHc4",
    videoId: "KxYxseeRHc4",
    metrics: [
      { label: "Genre", value: "Hip Hop" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Milestone", value: "Return Single" },
    ],
    deliverables: [
      "1x Official Flagship Freestyle Music Video",
      "Dynamic Handheld Cinema Camera Production",
      "Fresh Chapter Audio Master & Kinetic Edit",
    ],
    systemPillars: [
      { pillar: "Personal Journey", detail: "Long-awaited return track dropping on birthday capturing life, growth, and hustle." },
      { pillar: "Kinetic Performance", detail: "Relentless vocal cadence paired with high-energy camera motion and fast pacing." },
    ],
  },
  "mv-4": {
    id: "mv-4",
    title: "SUPERSTAR",
    department: "Music Videos",
    category: "Music Videos",
    brandName: "SUPERSTAR",
    client: "Prameet Patani",
    genre: "Hip Hop",
    industry: "Music & Entertainment",
    thumbnail: "https://i.ytimg.com/vi/T3i3aXbgL3U/hqdefault.jpg",
    description: "Superstar by Prameet Patani is more than just a track it's a raw and personal reflection of his journey. From day one to where he dreams to be, this song captures the hunger, ambition, and self-belief that fuel his grind. The contrast between the unpolished audio complete with a “purchase your tracks today” watermark and the high-end studio visuals isn’t a flaw; it’s the message. This is the mindset of a dreamer who already sees himself at the top, even when the world doesn’t. Watch, listen, and step into Prameet’s vision.",
    deliverablesText: "A Whole Music Video",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtu.be/T3i3aXbgL3U",
        poster: "https://i.ytimg.com/vi/T3i3aXbgL3U/hqdefault.jpg",
        title: "Whole Production Music Video Master",
        aspectRatio: "landscape",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/T3i3aXbgL3U",
    videoId: "T3i3aXbgL3U",
    metrics: [
      { label: "Genre", value: "Hip Hop" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Vision", value: "Dreamer Mindset" },
    ],
    deliverables: [
      "1x Official Flagship Music Video Master",
      "High-End Studio Visual Production",
      "Raw Audio Watermark Contrast Concept",
    ],
    systemPillars: [
      { pillar: "Raw Reflection", detail: "Capturing hunger, ambition, and self-belief from day one to future vision." },
      { pillar: "Conceptual Contrast", detail: "Juxtaposing unpolished audio watermark with high-end studio visuals as the core message." },
    ],
  },
  "mv-5": {
    id: "mv-5",
    title: "MUSAAFIR",
    department: "Music Videos",
    category: "Music Videos",
    brandName: "MUSAAFIR",
    client: "Musaafir",
    genre: "Hip Hop",
    industry: "Music & Entertainment",
    thumbnail: "https://i.ytimg.com/vi/QV6LzN1cZe8/hqdefault.jpg",
    description: "The song is based on the thoughts of a young person who is trying to find his way out of the lowest point in his life. He wanders around here in his head, talking about his love, trying to find his path.",
    deliverablesText: "A Whole Music Visualiser",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtu.be/QV6LzN1cZe8",
        poster: "https://i.ytimg.com/vi/QV6LzN1cZe8/hqdefault.jpg",
        title: "Whole Production Music Visualiser Master",
        aspectRatio: "landscape",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/QV6LzN1cZe8",
    videoId: "QV6LzN1cZe8",
    metrics: [
      { label: "Genre", value: "Hip Hop" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Deliverables", value: "Visualiser" },
    ],
    deliverables: [
      "1x Official Music Visualiser Master",
      "Conceptual Mindscape Visual Art",
      "Immersive Atmospheric Audio Mix",
    ],
    systemPillars: [
      { pillar: "Internal Journey", detail: "Exploring the thoughts of a young person navigating out of life's lowest point." },
      { pillar: "Atmospheric Visualiser", detail: "Wandering mindscape visuals and emotional narrative flow." },
    ],
  },

  // --- FILMS ---
  "flm-1": {
    id: "flm-1",
    title: "OUTFLOW",
    department: "Films",
    category: "Films",
    brandName: "OUTFLOW",
    client: "Outflow",
    genre: "Drama & Psychology",
    industry: "Film & Entertainment",
    thumbnail: "https://i.ytimg.com/vi/Go7UNJQUww0/hqdefault.jpg",
    description: "Some projects aren't ready to be talked about yet this is one of them. A film currently in process, still taking shape, not something we're revealing in full just yet. What we can offer instead is an early look a sneak peek before it's ready for everyone else.",
    deliverablesText: "In Association with",
    executionModel: "In Association with",
    showcaseVideos: [
      {
        src: "https://youtu.be/Go7UNJQUww0",
        poster: "https://i.ytimg.com/vi/Go7UNJQUww0/hqdefault.jpg",
        title: "In Association With — Official Sneak Peek",
        aspectRatio: "landscape",
        sectionTitle: "IN ASSOCIATION WITH",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/Go7UNJQUww0",
    videoId: "Go7UNJQUww0",
    metrics: [
      { label: "Genre", value: "Drama & Psychology" },
      { label: "Execution", value: "In Association" },
      { label: "Status", value: "Early Look Sneak Peek" },
    ],
    deliverables: [
      "1x Official Film Sneak Peek Master",
      "In Association With Co-Production & Post",
      "Cinematic Drama & Psychological Score",
    ],
    systemPillars: [
      { pillar: "Work in Progress", detail: "A film currently in process, taking shape behind closed doors." },
      { pillar: "Early Look Sneak Peek", detail: "Exclusive preview before official nationwide release." },
    ],
  },
  "flm-2": {
    id: "flm-2",
    title: "THE TESTING ACADEMY",
    department: "Content Production",
    category: "Content Production",
    brandName: "THE TESTING ACADEMY",
    client: "The Testing Academy",
    industry: "YouTube Tech Creator",
    thumbnail: "https://i.ytimg.com/vi/TaNC7KiOR2s/hqdefault.jpg",
    description: "We handled the post-production for multiple YouTube videos for The Testing Academy (TTA), which had a strong social media presence and aimed for fast-paced editing to boost audience retention. We carefully analyzed their requirements and crafted an engaging look and feel in the edits to meet their vision.",
    paragraph2: "The brand's team appreciated our work and creative approach, which contributed to enhancing their content quality. Our edits successfully expanded the brand’s reach across social platforms, resonating well with their audience and driving higher engagement.",
    deliverablesText: "6 Long format YouTube Videos",
    executionModel: "Post Production",
    showcaseVideos: [
      {
        src: "https://youtu.be/TaNC7KiOR2s",
        poster: "https://i.ytimg.com/vi/TaNC7KiOR2s/hqdefault.jpg",
        title: "Post Production — Video 01",
        aspectRatio: "landscape",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "YouTube"
      },
      {
        src: "https://youtu.be/AkMCBS0MWw8",
        poster: "https://i.ytimg.com/vi/AkMCBS0MWw8/hqdefault.jpg",
        title: "Post Production — Video 02",
        aspectRatio: "landscape",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "YouTube"
      },
      {
        src: "https://youtu.be/KReFBIGNrRA",
        poster: "https://i.ytimg.com/vi/KReFBIGNrRA/hqdefault.jpg",
        title: "Post Production — Video 03",
        aspectRatio: "landscape",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "YouTube"
      },
      {
        src: "https://youtu.be/FznMMGfVM0E",
        poster: "https://i.ytimg.com/vi/FznMMGfVM0E/hqdefault.jpg",
        title: "Post Production — Video 04",
        aspectRatio: "landscape",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "YouTube"
      },
      {
        src: "https://youtu.be/6zCBTbxchEI",
        poster: "https://i.ytimg.com/vi/6zCBTbxchEI/hqdefault.jpg",
        title: "Post Production — Video 05",
        aspectRatio: "landscape",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "YouTube"
      },
      {
        src: "https://youtu.be/zSXdOfeo4Go",
        poster: "https://i.ytimg.com/vi/zSXdOfeo4Go/hqdefault.jpg",
        title: "Post Production — Video 06",
        aspectRatio: "landscape",
        sectionTitle: "POST PRODUCTION",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/TaNC7KiOR2s",
    videoId: "TaNC7KiOR2s",
    metrics: [
      { label: "YouTube Videos", value: "6 Long Format" },
      { label: "Execution", value: "Post Prod" },
      { label: "Retention Impact", value: "High Engagement" },
    ],
    deliverables: [
      "6x Long Format YouTube Master Edits",
      "Fast-Paced High-Retention Tech Edit Suite",
      "Custom Graphic Motion Overlays & Lower Thirds",
    ],
    systemPillars: [
      { pillar: "Fast-Paced Post-Production", detail: "Crafting dynamic visual pacing and graphics to boost YouTube audience retention." },
      { pillar: "Content Quality Lift", detail: "Enhancing brand reach across social platforms through engaging tech video edits." },
    ],
  },
  "flm-3": {
    id: "flm-3",
    title: "A SECOND CHANCE",
    department: "Films",
    category: "Films",
    brandName: "A SECOND CHANCE",
    client: "Narendra Gupte Biography",
    genre: "Biography",
    industry: "Film & Biography",
    thumbnail: "https://i.ytimg.com/vi/KcvLhqq_epg/hqdefault.jpg",
    description: "A Second Chance is a short-form biography on Narendra Gupte grounded, reality-based, and built to sit with the truth of a real life rather than dramatize it. The Gravity Studios produced the film in full, and it went on to earn genuine appreciation from industry professionals who saw it — the kind of reception that comes from a story told honestly, not oversold.",
    deliverablesText: "Full Produced Film",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtu.be/KcvLhqq_epg",
        poster: "https://i.ytimg.com/vi/KcvLhqq_epg/hqdefault.jpg",
        title: "Full Produced Film Master",
        aspectRatio: "landscape",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/KcvLhqq_epg",
    videoId: "KcvLhqq_epg",
    metrics: [
      { label: "Genre", value: "Biography" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Industry Reception", value: "Genuine Praise" },
    ],
    deliverables: [
      "1x Flagship Short-Form Biography Master Film",
      "Grounded Documentary-Style Storytelling & Production",
      "Authentic Acoustic Sound Score & Editorial Mix",
    ],
    systemPillars: [
      { pillar: "Honest Narrative", detail: "Grounded, reality-based biography on Narendra Gupte built around real-life truth." },
      { pillar: "Industry Appreciation", detail: "Produced in full, earning genuine acclaim from film and media professionals." },
    ],
  },
  "flm-4": {
    id: "flm-4",
    title: "DUVIDHA",
    department: "Films",
    category: "Films",
    brandName: "DUVIDHA",
    client: "Duvidha",
    genre: "Comic",
    industry: "Film & Entertainment",
    thumbnail: "https://i.ytimg.com/vi/XxzlxYt2n94/hqdefault.jpg",
    description: "Duvidha is a comic short film with a premise as playful as it sounds a group of instruments, personified and talking to each other, trying to make a song together. The Gravity Studios produced it start to finish, and it found exactly the audience it was built for: young, quick to laugh, and quick to share. Proof that not everything in the reel needs to be serious to be well-made.",
    deliverablesText: "Full Produced Film",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtu.be/XxzlxYt2n94",
        poster: "https://i.ytimg.com/vi/XxzlxYt2n94/hqdefault.jpg",
        title: "Full Produced Film Master",
        aspectRatio: "landscape",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/XxzlxYt2n94",
    videoId: "XxzlxYt2n94",
    metrics: [
      { label: "Genre", value: "Comic Short" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Virality", value: "High Shareability" },
    ],
    deliverables: [
      "1x Flagship Produced Comic Short Film Master",
      "Personified Musical Instruments Foley & Voice Cast",
      "Start-to-Finish End-to-End Cinema Production",
    ],
    systemPillars: [
      { pillar: "Playful Concept", detail: "Personified instruments talking to each other trying to create a song together." },
      { pillar: "Audience Resonance", detail: "Built for a young, quick-to-share audience proving humor can be masterfully produced." },
    ],
  },
  "flm-5": {
    id: "flm-5",
    title: "FIRST FRIEND",
    department: "Films",
    category: "Films",
    brandName: "FIRST FRIEND",
    client: "First Friend",
    genre: "Psychological",
    industry: "Film & Entertainment",
    thumbnail: "https://i.ytimg.com/vi/LSfNwAK7-lI/hqdefault.jpg",
    description: "FIRST FRIEND is a film which takes you through a ride of showing that there are certain other things which can become your stress buster and give you more satisfaction than any human. For instance, as showed in the film the character is really frustrated in his daily life. He really needs some break in his life and suddenly one day out of nowhere, he comes across certain Instagram videos of people playing keyboard/piano and gets insights of him playing it when he was a child. And then when he finds the piano and starts playing it he really feels satisfied and really happy when he is doing the activity.",
    deliverablesText: "Whole Produced Film",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtu.be/LSfNwAK7-lI",
        poster: "https://i.ytimg.com/vi/LSfNwAK7-lI/hqdefault.jpg",
        title: "Whole Produced Film Master",
        aspectRatio: "landscape",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/LSfNwAK7-lI",
    videoId: "LSfNwAK7-lI",
    metrics: [
      { label: "Genre", value: "Psychological" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Format", value: "Short Film" },
    ],
    deliverables: [
      "1x Flagship Produced Psychological Short Film",
      "Piano Performance Sound & Score Editing",
      "Character Mental Health Narrative Direction",
    ],
    systemPillars: [
      { pillar: "Psychological Narrative", detail: "Exploring stress relief and emotional satisfaction found through childhood passion." },
      { pillar: "Atmospheric Edit", detail: "Frustration to peace transition told through visual rhythm and piano music." },
    ],
  },
  "flm-6": {
    id: "flm-6",
    title: "ENFANCE",
    department: "Films",
    category: "Films",
    brandName: "ENFANCE",
    client: "Enfance",
    genre: "Dark Psychological",
    industry: "Film & Entertainment",
    thumbnail: "https://i.ytimg.com/vi/5x8iREEmung/hqdefault.jpg",
    description: "Enfance is a dark thriller tense, suspense-driven, built around a woman confronting her past inside a single room. It's not a film that leans on scale or spectacle; it leans entirely on the story, and that's exactly what people remember it for. It's one of those films people still bring up unprompted proof that a strong enough narrative outlasts everything else.",
    deliverablesText: "Full Produced Film",
    executionModel: "Whole Production",
    showcaseVideos: [
      {
        src: "https://youtu.be/5x8iREEmung",
        poster: "https://i.ytimg.com/vi/5x8iREEmung/hqdefault.jpg",
        title: "Full Produced Film Master",
        aspectRatio: "landscape",
        sectionTitle: "WHOLE PRODUCTION",
        sectionSubtitle: "YouTube"
      }
    ],
    videoUrl: "https://youtu.be/5x8iREEmung",
    videoId: "5x8iREEmung",
    metrics: [
      { label: "Genre", value: "Dark Thriller" },
      { label: "Execution", value: "Whole Prod" },
      { label: "Storytelling", value: "Unforgettable" },
    ],
    deliverables: [
      "1x Flagship Dark Psychological Short Film Master",
      "Single-Room Suspense Chamber Production",
      "Character Past Confrontation Narrative Score",
    ],
    systemPillars: [
      { pillar: "Suspense Narrative", detail: "Tense, single-room dark thriller built around a woman confronting her past." },
      { pillar: "Enduring Storytelling", detail: "Leaning entirely on a powerful narrative that outlasts scale or spectacle." },
    ],
  },
};
