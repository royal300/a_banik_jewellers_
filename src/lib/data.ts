import catGold from "@/assets/cat-gold.jpg";
import catDiamond from "@/assets/cat-diamond.jpg";
import catSilver from "@/assets/cat-silver.jpg";
import catNecklace from "@/assets/cat-necklace.jpg";
import catRings from "@/assets/cat-rings.jpg";
import catBangles from "@/assets/cat-bangles.jpg";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";
import p7 from "@/assets/product-7.jpg";
import p8 from "@/assets/product-8.jpg";
import c1 from "@/assets/customer-1.jpg";
import c2 from "@/assets/customer-2.jpg";
import c3 from "@/assets/customer-3.jpg";

export type CategorySlug =
  | "gold"
  | "diamond"
  | "silver"
  | "necklace"
  | "rings"
  | "bangles";

export interface Category {
  slug: CategorySlug;
  name: string;
  image: string;
  description: string;
}

export const categories: Category[] = [
  { slug: "gold", name: "Gold Jewellery", image: catGold, description: "Hallmarked 22K & 24K gold masterpieces crafted for every occasion." },
  { slug: "diamond", name: "Diamond Jewellery", image: catDiamond, description: "Certified brilliant diamonds set in refined gold and platinum." },
  { slug: "silver", name: "Silver Jewellery", image: catSilver, description: "Pure sterling silver ornaments with intricate traditional artistry." },
  { slug: "necklace", name: "Necklace", image: catNecklace, description: "Signature necklaces from delicate chains to ornate bridal sets." },
  { slug: "rings", name: "Rings", image: catRings, description: "Solitaires, bands and statement rings for every promise." },
  { slug: "bangles", name: "Bangles", image: catBangles, description: "Handcrafted bangles that carry timeless tradition on every wrist." },
];

export interface Product {
  id: string;
  name: string;
  category: CategorySlug;
  weight: string;
  purity: string;
  availability: "In Stock" | "Made to Order";
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "abj-001",
    name: "Ruby Radiance Gold Pendant",
    category: "necklace",
    weight: "8.42 g",
    purity: "22K Hallmarked Gold",
    availability: "In Stock",
    description:
      "A finely handcrafted 22K gold pendant featuring a vivid ruby centrepiece, delicately framed with filigree scrollwork — a timeless everyday statement.",
    image: p1,
  },
  {
    id: "abj-002",
    name: "Aurora Solitaire Diamond Ring",
    category: "diamond",
    weight: "3.15 g",
    purity: "18K Gold · IGI Certified Diamond",
    availability: "In Stock",
    description:
      "A brilliant round solitaire crowning a six-prong white gold band. Precision cut, certified purity, made to celebrate your forever.",
    image: p2,
  },
  {
    id: "abj-003",
    name: "Meenakari Jhumka Earrings",
    category: "gold",
    weight: "14.28 g",
    purity: "22K Hallmarked Gold",
    availability: "In Stock",
    description:
      "Traditional temple jhumkas with intricate meenakari detailing and dangling pearls — an heirloom for every celebration.",
    image: p3,
  },
  {
    id: "abj-004",
    name: "Regal Diamond Kada",
    category: "bangles",
    weight: "22.60 g",
    purity: "18K Gold · VVS Diamonds",
    availability: "Made to Order",
    description:
      "A regal three-row diamond kada set in warm rose gold — brilliance stacked into a single, unforgettable silhouette.",
    image: p4,
  },
  {
    id: "abj-005",
    name: "Emerald Empress Bridal Choker",
    category: "necklace",
    weight: "68.90 g",
    purity: "22K Hallmarked Gold · Zambian Emeralds",
    availability: "Made to Order",
    description:
      "A bridal masterpiece — cascading emeralds set on 22K gold, hand-crafted by our master karigars for the most important day of your life.",
    image: p5,
  },
  {
    id: "abj-006",
    name: "Blossom Silver Cuff",
    category: "silver",
    weight: "18.75 g",
    purity: "925 Sterling Silver",
    availability: "In Stock",
    description:
      "Softly polished sterling silver cuff with a floral filigree band — modern minimalism with traditional soul.",
    image: p6,
  },
  {
    id: "abj-007",
    name: "Eternity Diamond Tennis Bracelet",
    category: "diamond",
    weight: "6.42 g",
    purity: "18K Gold · IGI Certified",
    availability: "In Stock",
    description:
      "A continuous line of hand-set brilliant diamonds — an eternity of light around your wrist.",
    image: p7,
  },
  {
    id: "abj-008",
    name: "Classic Mangalsutra",
    category: "necklace",
    weight: "12.10 g",
    purity: "22K Hallmarked Gold",
    availability: "In Stock",
    description:
      "A refined mangalsutra with a diamond-studded pendant and black bead detailing — sacred tradition, redesigned for today.",
    image: p8,
  },
  {
    id: "abj-009",
    name: "Antique Gold Bangle Set",
    category: "bangles",
    weight: "42.30 g",
    purity: "22K Hallmarked Gold",
    availability: "In Stock",
    description:
      "A stack of antique-finish 22K gold bangles with rubies — inspired by the karigar traditions of Bengal.",
    image: catBangles,
  },
  {
    id: "abj-010",
    name: "Sona Chain Necklace",
    category: "gold",
    weight: "10.80 g",
    purity: "22K Hallmarked Gold",
    availability: "In Stock",
    description:
      "An everyday 22K gold chain finished with a delicate ruby-drop pendant.",
    image: catGold,
  },
  {
    id: "abj-011",
    name: "Twilight Solitaire Ring",
    category: "rings",
    weight: "2.90 g",
    purity: "18K Gold",
    availability: "In Stock",
    description:
      "A minimalist solitaire setting on a slender 18K gold band — refined, luminous, effortless.",
    image: catRings,
  },
  {
    id: "abj-012",
    name: "Silver Filigree Anklet",
    category: "silver",
    weight: "16.40 g",
    purity: "925 Sterling Silver",
    availability: "In Stock",
    description:
      "Delicate filigree anklet with tiny ghungroo bells — traditional artistry perfected.",
    image: catSilver,
  },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  review: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Priya Sengupta",
    role: "Madhyamgram",
    image: c1,
    rating: 5,
    review:
      "The craftsmanship is exceptional. Our entire family has been trusting A Banik Jewellers for over two decades — every piece feels like an heirloom.",
  },
  {
    id: "t2",
    name: "Ananya Roy",
    role: "Bride, 2025",
    image: c2,
    rating: 5,
    review:
      "My bridal set was designed exactly the way I imagined it. Their team walked us through every detail — pure gold, pure trust, pure joy.",
  },
  {
    id: "t3",
    name: "Sujata Banerjee",
    role: "Kolkata",
    image: c3,
    rating: 5,
    review:
      "Certified purity, hallmarked designs and honest pricing. There's a reason A Banik is a name every family in Madhyamgram remembers with love.",
  },
];

export interface WhyItem {
  title: string;
  description: string;
  icon: "shield" | "gem" | "sparkles" | "award";
}

export const whyChooseUs: WhyItem[] = [
  { title: "Hallmarked Gold", description: "Every ornament BIS-hallmarked for guaranteed purity.", icon: "shield" },
  { title: "Certified Purity", description: "IGI / GIA certified diamonds & precious stones.", icon: "gem" },
  { title: "Custom Jewellery", description: "Design your own — from concept to finished heirloom.", icon: "sparkles" },
  { title: "Trusted Since Years", description: "Generations of Madhyamgram families served with love.", icon: "award" },
];
