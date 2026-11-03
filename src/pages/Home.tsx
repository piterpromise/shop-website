import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "../carousel.css"
import "./Home.css"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import {
  Search,
  ShoppingBag,
  User,
  Bell,
  HeadphonesIcon,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  X,
  Plus,
  Minus,
  Heart,
  Tag,
} from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFireFlameSimple,
  faTruck,
  faCircle,
  faHandSparkles,
  faGem,
  faWind,
  faUser,
  faEnvelope,
  faPhone,
  faCalendarDays,
  faClock,
  faUsers,
  faCheck,
  faCheckCircle,
  faChevronLeft,
  faChevronRight,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons"

gsap.registerPlugin(ScrollTrigger)

const BESPOKE_MONTH_NAMES = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
]

const BESPOKE_WEEKDAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]
const BESPOKE_TIME_SLOTS = ["09:30", "10:30", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

const formatBespokeDate = (d: Date | null): string => {
  if (!d) return ""
  return `${d.getDate()} ${BESPOKE_MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`
}

const isSameCalendarDay = (d1: Date | null, d2: Date | null): boolean => {
  if (!d1 || !d2) return false
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  )
}

const getMonthCalendarDays = (monthDate: Date) => {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7 // Monday = 0
  const totalDays = new Date(year, month + 1, 0).getDate()
  const days: ({ date: Date; dayNum: number; isPast: boolean } | null)[] = []

  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null)
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let d = 1; d <= totalDays; d++) {
    const dateObj = new Date(year, month, d)
    days.push({
      date: dateObj,
      dayNum: d,
      isPast: dateObj < today,
    })
  }
  return days
}

interface ColorOption {
  name: string
  hex: string
}

export type DressCategoryKey =
  | "wedding"
  | "party"
  | "cocktail"
  | "bespoke"
  | "veil"
  | "henna"
  | "cortege"
  | "corsetry"

interface DressCategoryTab {
  key: DressCategoryKey
  label: string
  subtitle: string
  accent: string
  count: number
}

const DRESS_CATEGORIES: DressCategoryTab[] = [
  {
    key: "wedding",
    label: "Robes de Mariée",
    subtitle: "Dentelle impériale, satin duchesse & traînes majestueuses",
    accent: "#74634f",
    count: 4,
  },
  {
    key: "party",
    label: "Soirée & Gala",
    subtitle: "Silhouettes fendues, fourreaux perlés & drapés de soie",
    accent: "#3f2028",
    count: 4,
  },
  {
    key: "cocktail",
    label: "Cocktail & Cérémonie",
    subtitle: "Coupes audacieuses, organza aérien & bustiers sculptés",
    accent: "#29251c",
    count: 4,
  },
  {
    key: "bespoke",
    label: "Créations Sur-Mesure",
    subtitle: "Pièces uniques dessinées et cousues selon vos mesures",
    accent: "#74634f",
    count: 4,
  },
  {
    key: "veil",
    label: "Voiles & Traînes",
    subtitle: "Tulle de soie rebrodé main, dentelle chantilly & parures",
    accent: "#d8c8b8",
    count: 4,
  },
  {
    key: "henna",
    label: "Henné & Orient",
    subtitle: "Broderies au fil d'or, velours profonds & capes royales",
    accent: "#3f2028",
    count: 4,
  },
  {
    key: "cortege",
    label: "Cortège & Demoiselles",
    subtitle: "Harmonie de nuances sur-mesure pour vos invitées d'honneur",
    accent: "#74634f",
    count: 4,
  },
  {
    key: "corsetry",
    label: "Corseterie d'Art",
    subtitle: "Bustiers baleinés souples, galbe haute précision & laçage soie",
    accent: "#29251c",
    count: 4,
  },
]

interface Product {
  id: number
  name: string
  price: string
  category: string
  categoryKey: DressCategoryKey
  color: string
  image: string
  badge?: string
  description: string
  longDescription: string
  model: string
  sizes: string[]
  colors: ColorOption[]
  rating: number
  reviewsCount: number
}

const products: Product[] = [
  // CATÉGORIE 1 : ROBES DE MARIÉE (wedding7 .. wedding10)
  {
    id: 1,
    name: 'Robe de Mariée "Céleste"',
    price: "Sur-Mesure · 890 €",
    category: "Robes de Mariée",
    categoryKey: "wedding",
    color: "bg-gradient-product-1",
    image: "/couture/wedding7.webp",
    badge: "Nouvelle Collection",
    description: "Bustier cœur en dentelle de Calais rebrodée à la main et jupe vaporeuse à traîne cathédrale.",
    longDescription: "Façonnée dans notre atelier pour sublimer le port de tête et la taille, la robe Céleste associe un corset baleiné invisible à des appliqués floraux cousus point par point sur un tulle illusion d'une légèreté absolue.",
    model: "MARIÉE-CEL-01",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44", "46+"],
    colors: [
      { name: "Blanc Ivoire", hex: "#fdfbf7" },
      { name: "Champagne Rosé", hex: "#f3e5dc" },
      { name: "Perle Nacrée", hex: "#e5e7eb" },
    ],
    rating: 5.0,
    reviewsCount: 94,
  },
  {
    id: 2,
    name: 'Robe Sirène "Aurore Boréale"',
    price: "Sur-Mesure · 950 €",
    category: "Robes de Mariée",
    categoryKey: "wedding",
    color: "bg-gradient-product-2",
    image: "/couture/wedding8.webp",
    badge: "Coup de Cœur",
    description: "Coupe sirène sculptante en crêpe de soie lourd et dos nu plongeant orné de perles fines.",
    longDescription: "Pensée pour épouser les courbes avec une fluidité couture, Aurore Boréale révèle un travail d'incrustation de guipure sur les hanches et une godille en dentelle qui s'ouvre à chaque pas.",
    model: "MARIÉE-AUR-02",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Ivoire Pur", hex: "#fcfaf2" },
      { name: "Crème de Soie", hex: "#f5efe6" },
    ],
    rating: 4.9,
    reviewsCount: 118,
  },
  {
    id: 3,
    name: 'Robe Princesse "Éternité"',
    price: "Sur-Mesure · 1 120 €",
    category: "Robes de Mariée",
    categoryKey: "wedding",
    color: "bg-gradient-product-3",
    image: "/couture/wedding9.webp",
    badge: "Haute Couture",
    description: "Volume royal en satin duchesse et superposition d'organza brodé de cristaux scintillants.",
    longDescription: "Une pièce magistrale dotée d'un jupon structuré à plis creux et d'un corsage drapé main. Chaque motif de broderie est placé sur mannequin pour allonger harmonieusement la silhouette.",
    model: "MARIÉE-ETE-03",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44", "46+"],
    colors: [
      { name: "Blanc Optique", hex: "#ffffff" },
      { name: "Ivoire Doré", hex: "#f7f1e3" },
    ],
    rating: 5.0,
    reviewsCount: 86,
  },
  {
    id: 4,
    name: 'Robe Bohème "Souveraine"',
    price: "Sur-Mesure · 790 €",
    category: "Robes de Mariée",
    categoryKey: "wedding",
    color: "bg-gradient-product-4",
    image: "/couture/wedding10.webp",
    description: "Manches vaporeuses en mousseline de soie et taille empire soulignée d'un galon ajouré.",
    longDescription: "Alliance de romantisme et de confort absolu, cette création légère accompagne chaque mouvement avec grâce du cortège jusqu'à la première danse.",
    model: "MARIÉE-SOU-04",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Ivoire Naturel", hex: "#faf6f0" },
      { name: "Nude Poudré", hex: "#ead7c8" },
    ],
    rating: 4.9,
    reviewsCount: 72,
  },

  // CATÉGORIE 2 : SOIRÉE & GALA (party-dress5 .. party-dress8)
  {
    id: 5,
    name: 'Robe de Gala "Obsidienne Royale"',
    price: "Sur-Mesure · 540 €",
    category: "Soirée & Gala",
    categoryKey: "party",
    color: "bg-gradient-product-1",
    image: "/couture/party-dress5.webp",
    badge: "Best Seller",
    description: "Fourreau long à fente haute, drapé asymétrique à la taille et épaule structurée couture.",
    longDescription: "Réalisée dans un satin envers crêpe au tombé liquide, cette robe de gala sculpte la silhouette tout en offrant une liberté de mouvement remarquable.",
    model: "GALA-OBS-05",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44", "46+"],
    colors: [
      { name: "Noir Obsidienne", hex: "#111827" },
      { name: "Bordeaux Velours", hex: "#7f1d1d" },
      { name: "Émeraude Nuit", hex: "#064e3b" },
    ],
    rating: 4.9,
    reviewsCount: 142,
  },
  {
    id: 6,
    name: 'Robe Fourreau "Éclat Stellaire"',
    price: "Sur-Mesure · 620 €",
    category: "Soirée & Gala",
    categoryKey: "party",
    color: "bg-gradient-product-2",
    image: "/couture/party-dress6.webp",
    badge: "Édition Gala",
    description: "Broderie intégrale de sequins et perles tubulaires captant la lumière à chaque pas.",
    longDescription: "Entièrement doublée de pongé de soie extensible pour une douceur incomparable sur la peau, Éclat Stellaire est la pièce maîtresse des grandes réceptions.",
    model: "GALA-ECL-06",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Or Champagne", hex: "#d4af37" },
      { name: "Argent Lunaire", hex: "#cbd5e1" },
      { name: "Bronze Impérial", hex: "#92400e" },
    ],
    rating: 5.0,
    reviewsCount: 109,
  },
  {
    id: 7,
    name: 'Robe Bustier "Vénus Drapée"',
    price: "Sur-Mesure · 490 €",
    category: "Soirée & Gala",
    categoryKey: "party",
    color: "bg-gradient-product-3",
    image: "/couture/party-dress7.webp",
    description: "Bustier plissé main à maintien interne et jupe longue fluide coupée dans le biais.",
    longDescription: "Le travail de coupe en biais permet à l'étoffe d'onduler naturellement autour des jambes sans jamais marquer, mettant en valeur le décolleté et les épaules.",
    model: "GALA-VEN-07",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44", "46+"],
    colors: [
      { name: "Rubis Intense", hex: "#be123c" },
      { name: "Bleu Minuit", hex: "#1e3a8a" },
      { name: "Noir Couture", hex: "#18181b" },
    ],
    rating: 4.8,
    reviewsCount: 88,
  },
  {
    id: 8,
    name: 'Robe Longue "Saphir d\'Orient"',
    price: "Sur-Mesure · 580 €",
    category: "Soirée & Gala",
    categoryKey: "party",
    color: "bg-gradient-product-4",
    image: "/couture/party-dress8.webp",
    badge: "Exclusivité",
    description: "Corsage travaillé en dentelle perlée et traîne fluide en mousseline de soie plissée soleil.",
    longDescription: "Une création sophistiquée alliant maintien parfait du buste et ampleur aérienne, idéale pour les galas, fiançailles et cérémonies prestigieuses.",
    model: "GALA-SAP-08",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Bleu Saphir", hex: "#1d4ed8" },
      { name: "Prune Impériale", hex: "#581c87" },
    ],
    rating: 4.9,
    reviewsCount: 131,
  },

  // CATÉGORIE 3 : COCKTAIL & CÉRÉMONIE (party-dress9 .. party-dress12)
  {
    id: 9,
    name: 'Robe Cocktail "Orchidée Impériale"',
    price: "Sur-Mesure · 380 €",
    category: "Cocktail & Cérémonie",
    categoryKey: "cocktail",
    color: "bg-gradient-product-1",
    image: "/couture/party-dress9.webp",
    badge: "Tendance",
    description: "Encolure asymétrique sculpturale et coupe cintrée soulignant la finesse de la taille.",
    longDescription: "Taillée dans un crêpe couture à haute tenue, Orchidée Impériale offre une allure contemporaine et raffinée pour vos cocktails, réceptions et mariages civils.",
    model: "COCK-ORC-09",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Rose Poudré", hex: "#f4bbc9" },
      { name: "Corail Soie", hex: "#fb7185" },
      { name: "Ivoire", hex: "#fafaf9" },
    ],
    rating: 4.9,
    reviewsCount: 79,
  },
  {
    id: 10,
    name: 'Robe Midi "Rosée d\'Or"',
    price: "Sur-Mesure · 410 €",
    category: "Cocktail & Cérémonie",
    categoryKey: "cocktail",
    color: "bg-gradient-product-2",
    image: "/couture/party-dress10.webp",
    badge: "Nouveau",
    description: "Jupe midi évasée en Mikado de soie et décolleté carré flatteur aux finitions gansées.",
    longDescription: "Le Mikado de soie confère à cette robe une tenue architecturale lumineuse tout en restant légère et agréable à porter tout au long de la journée et de la soirée.",
    model: "COCK-ROS-10",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44", "46+"],
    colors: [
      { name: "Doré Satin", hex: "#eab308" },
      { name: "Sauge Pastel", hex: "#a7f3d0" },
    ],
    rating: 4.8,
    reviewsCount: 64,
  },
  {
    id: 11,
    name: 'Robe "Camélia" Corset & Organza',
    price: "Sur-Mesure · 430 €",
    category: "Cocktail & Cérémonie",
    categoryKey: "cocktail",
    color: "bg-gradient-product-3",
    image: "/couture/party-dress11.webp",
    description: "Bustier à baleines apparentes recouvertes de soie et volants superposés en organza aérien.",
    longDescription: "Un jeu de transparences subtiles et de volumes vaporeux entièrement montés à la main dans notre atelier pour une silhouette pleine de caractère.",
    model: "COCK-CAM-11",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Lilas Couture", hex: "#c084fc" },
      { name: "Noir Velouté", hex: "#1f2937" },
    ],
    rating: 4.9,
    reviewsCount: 92,
  },
  {
    id: 12,
    name: 'Robe "Velours d\'Ambre" Cérémonie',
    price: "Sur-Mesure · 395 €",
    category: "Cocktail & Cérémonie",
    categoryKey: "cocktail",
    color: "bg-gradient-product-4",
    image: "/couture/party-dress12.webp",
    badge: "Série Limitée",
    description: "Drapé croisé au buste, manches délicates et tombé fluide qui flatte toutes les morphologies.",
    longDescription: "Conçue pour les invitées d'honneur et les demoiselles d'honneur exigeantes, cette pièce est personnalisable en longueur comme en nuance de tissu.",
    model: "COCK-VEL-12",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44", "46+"],
    colors: [
      { name: "Ambre Doré", hex: "#d97706" },
      { name: "Terracotta Soie", hex: "#c2410c" },
    ],
    rating: 5.0,
    reviewsCount: 105,
  },

  // CATÉGORIE 4 : CRÉATIONS SUR-MESURE (other-robes4 .. other-robes7)
  {
    id: 13,
    name: 'Création Signature "Reine de Saba"',
    price: "Sur-Mesure · 680 €",
    category: "Créations Sur-Mesure",
    categoryKey: "bespoke",
    color: "bg-gradient-product-1",
    image: "/couture/other-robes4.webp",
    badge: "Pièce Unique",
    description: "Broderies dorées fil à fil, coupe majestueuse et finitions haute couture réalisées sur patron individuel.",
    longDescription: "Chaque exemplaire est dessiné avec vous lors du premier rendez-vous et ajusté au millimètre lors de trois séances d'essayage privées.",
    model: "SURM-SAB-13",
    sizes: ["100% Sur-Mesure", "Essayage Atelier"],
    colors: [
      { name: "Or & Ivoire", hex: "#d4af37" },
      { name: "Émeraude & Or", hex: "#047857" },
      { name: "Rubis & Or", hex: "#9f1239" },
    ],
    rating: 5.0,
    reviewsCount: 154,
  },
  {
    id: 14,
    name: 'Robe Couture "Drapé Byzantin"',
    price: "Sur-Mesure · 520 €",
    category: "Créations Sur-Mesure",
    categoryKey: "bespoke",
    color: "bg-gradient-product-2",
    image: "/couture/other-robes5.webp",
    badge: "Atelier",
    description: "Jeu de plissés sculptés sur buste, ceinture ornementale et tombé d'une élégance intemporelle.",
    longDescription: "Inspirée des drapés antiques revisités par la couture moderne, cette robe met en valeur le port de tête et affine la silhouette avec naturel.",
    model: "SURM-BYZ-14",
    sizes: ["100% Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Sable Doré", hex: "#d6d3d1" },
      { name: "Bleu Roi", hex: "#1d4ed8" },
    ],
    rating: 4.9,
    reviewsCount: 83,
  },
  {
    id: 15,
    name: 'Robe d\'Exception "Fleur de Lys"',
    price: "Sur-Mesure · 590 €",
    category: "Créations Sur-Mesure",
    categoryKey: "bespoke",
    color: "bg-gradient-product-3",
    image: "/couture/other-robes6.webp",
    description: "Manches travaillées en dentelle fine, encolure bijou et jupe ample à godets fluides.",
    longDescription: "Un modèle d'exception pensé pour les grandes occasions familiales et cérémonies, alliant pudeur élégante, raffinement des matières et confort absolu.",
    model: "SURM-LYS-15",
    sizes: ["100% Sur-Mesure", "34 / 36", "38 / 40", "42 / 44", "46+"],
    colors: [
      { name: "Perle d'Orient", hex: "#e2e8f0" },
      { name: "Vieux Rose", hex: "#fda4af" },
    ],
    rating: 4.9,
    reviewsCount: 97,
  },
  {
    id: 16,
    name: 'Silhouette "Mille et Une Nuits"',
    price: "Sur-Mesure · 740 €",
    category: "Créations Sur-Mesure",
    categoryKey: "bespoke",
    color: "bg-gradient-product-4",
    image: "/couture/other-robes7.webp",
    badge: "Prestige",
    description: "Parure de perles cousues main, cape vaporeuse amovible et traîne brodée sur-mesure.",
    longDescription: "Véritable chef-d'œuvre de notre atelier de couture, cette création offre deux allures en une grâce à sa traîne et son voile d'épaules amovibles.",
    model: "SURM-MIL-16",
    sizes: ["100% Sur-Mesure", "Essayage Privé"],
    colors: [
      { name: "Nuit Étoilée", hex: "#1e293b" },
      { name: "Champagne Impérial", hex: "#f59e0b" },
    ],
    rating: 5.0,
    reviewsCount: 128,
  },

  // CATÉGORIE 5 : VOILES & TRAÎNES (wedding11 .. wedding14)
  {
    id: 17,
    name: 'Voile Cathédrale "Dentelle d\'Alençon"',
    price: "Sur-Mesure · 320 €",
    category: "Voiles & Traînes",
    categoryKey: "veil",
    color: "bg-gradient-product-1",
    image: "/couture/wedding11.webp",
    badge: "Fait Main",
    description: "Tulle de soie aérien bordé d'une guipure florale incrustée point par point à l'atelier.",
    longDescription: "Un voile de 3,20 mètres d'une transparence cristalline, dont chaque fleur de dentelle est découpée et appliquée à la main sans couture visible.",
    model: "VOIL-ALE-17",
    sizes: ["3m20 Cathédrale", "2m40 Chapelle", "Sur-Mesure"],
    colors: [
      { name: "Ivoire Pur", hex: "#fcfaf2" },
      { name: "Linen Mist", hex: "#d8c8b8" },
    ],
    rating: 5.0,
    reviewsCount: 64,
  },
  {
    id: 18,
    name: 'Traîne Amovible "Duchesse Royale"',
    price: "Sur-Mesure · 450 €",
    category: "Voiles & Traînes",
    categoryKey: "veil",
    color: "bg-gradient-product-2",
    image: "/couture/wedding12.webp",
    badge: "2-en-1 Couture",
    description: "Sur-jupe à plis creux en satin duchesse se fixant invisiblement à la taille pour la cérémonie.",
    longDescription: "Offrez-vous l'amplitude spectaculaire d'une traîne royale lors de votre entrée, puis détachez-la en un geste pour révéler votre robe fourreau en soirée.",
    model: "VOIL-DUC-18",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Ivoire Satin", hex: "#fdfbf7" },
      { name: "Champagne Doux", hex: "#e8dfd5" },
    ],
    rating: 4.9,
    reviewsCount: 58,
  },
  {
    id: 19,
    name: 'Cape Nuptiale "Brume d\'Organza"',
    price: "Sur-Mesure · 390 €",
    category: "Voiles & Traînes",
    categoryKey: "veil",
    color: "bg-gradient-product-3",
    image: "/couture/wedding13.webp",
    description: "Cape d'épaules fluide en organza de soie rebrodé de perles nacrées sur l'encolure.",
    longDescription: "Alternative contemporaine au voile traditionnel, cette cape vaporeuse enlace les épaules avec délicatesse et ondule au moindre souffle.",
    model: "VOIL-CAP-19",
    sizes: ["Sur-Mesure", "Longueur Sol", "Longueur Traîne"],
    colors: [
      { name: "Perle d'Ivoire", hex: "#f8f5f0" },
      { name: "Taupe Rosé", hex: "#d8c8b8" },
    ],
    rating: 5.0,
    reviewsCount: 49,
  },
  {
    id: 20,
    name: 'Voile Perlé "Pluie d\'Étoiles"',
    price: "Sur-Mesure · 360 €",
    category: "Voiles & Traînes",
    categoryKey: "veil",
    color: "bg-gradient-product-4",
    image: "/couture/wedding14.webp",
    badge: "Atelier",
    description: "Semis de perles d'eau douce et cristaux sertis à la main sur tulle illusion ultra-souple.",
    longDescription: "Chaque perle est fixée individuellement pour capter la lumière naturelle et entourer le visage d'un halo doux et précieux.",
    model: "VOIL-ETO-20",
    sizes: ["Sur-Mesure", "Chapelle", "Cathédrale"],
    colors: [
      { name: "Ivoire Lumière", hex: "#ffffff" },
      { name: "Sable Nacré", hex: "#e6dcd2" },
    ],
    rating: 4.9,
    reviewsCount: 73,
  },

  // CATÉGORIE 6 : HENNÉ & ORIENT (other-robes17 .. other-robes20)
  {
    id: 21,
    name: 'Création Henné "Sultane d\'Or"',
    price: "Sur-Mesure · 780 €",
    category: "Henné & Orient",
    categoryKey: "henna",
    color: "bg-gradient-product-1",
    image: "/couture/other-robes17.webp",
    badge: "Orfèvrerie Textile",
    description: "Velours profond rebrodé au fil d'or véritable, ceinture sculptée et manches drapées.",
    longDescription: "Une pièce d'apparat conjuguant le savoir-faire ancestral de la broderie au fil d'or et le cintrage haute couture de notre atelier.",
    model: "HENN-SUL-21",
    sizes: ["100% Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Mulberry Wine", hex: "#3f2028" },
      { name: "Olive Oscuro", hex: "#29251c" },
    ],
    rating: 5.0,
    reviewsCount: 112,
  },
  {
    id: 22,
    name: 'Robe d\'Apparat "Palais d\'Ambre"',
    price: "Sur-Mesure · 720 €",
    category: "Henné & Orient",
    categoryKey: "henna",
    color: "bg-gradient-product-2",
    image: "/couture/other-robes18.webp",
    badge: "Pièce Maîtresse",
    description: "Brocart de soie tressé, cape impériale amovible et incrustations de cristaux ambrés.",
    longDescription: "Dessinée pour illuminer votre cérémonie de henné ou de fiançailles, cette silhouette offre une allure royale tout en préservant une aisance parfaite.",
    model: "HENN-PAL-22",
    sizes: ["100% Sur-Mesure", "Essayage Privé"],
    colors: [
      { name: "Moss Taupe & Or", hex: "#74634f" },
      { name: "Linen Mist", hex: "#d8c8b8" },
    ],
    rating: 4.9,
    reviewsCount: 95,
  },
  {
    id: 23,
    name: 'Silhouette "Jardin de Grenade"',
    price: "Sur-Mesure · 690 €",
    category: "Henné & Orient",
    categoryKey: "henna",
    color: "bg-gradient-product-3",
    image: "/couture/other-robes19.webp",
    description: "Corsage ajusté à arabesques perlées et jupe à godets fluides en satin duchesse.",
    longDescription: "Les motifs floraux orientaux sont tracés sur-mesure selon votre morphologie puis brodés au crochet de Lunéville.",
    model: "HENN-GRE-23",
    sizes: ["100% Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Velvet Plum", hex: "#2a171d" },
      { name: "Or Antique", hex: "#b89b72" },
    ],
    rating: 5.0,
    reviewsCount: 88,
  },
  {
    id: 24,
    name: 'Parure Royale "Zéphyr d\'Orient"',
    price: "Sur-Mesure · 810 €",
    category: "Henné & Orient",
    categoryKey: "henna",
    color: "bg-gradient-product-4",
    image: "/couture/other-robes20.webp",
    badge: "Haute Broderie",
    description: "Ensemble deux pièces sur-mesure en soie sauvage et tulle brodé de perles fines.",
    longDescription: "Une création lumineuse aux finitions gansées main, accompagnée de son voile d'épaules assorti pour une entrée inoubliable.",
    model: "HENN-ZEP-24",
    sizes: ["100% Sur-Mesure", "Essayage Atelier"],
    colors: [
      { name: "Olive Smoke", hex: "#3f3d30" },
      { name: "Champagne Doré", hex: "#d8c8b8" },
    ],
    rating: 5.0,
    reviewsCount: 104,
  },

  // CATÉGORIE 7 : CORTÈGE & DEMOISELLES (party-dress13 .. party-dress16)
  {
    id: 25,
    name: 'Robe Demoiselle "Harmonie de Soie"',
    price: "Sur-Mesure · 340 €",
    category: "Cortège & Demoiselles",
    categoryKey: "cortege",
    color: "bg-gradient-product-1",
    image: "/couture/party-dress13.webp",
    badge: "Nuancier Cortège",
    description: "Drapé fluide en crêpe Georgette avec encolure personnalisable selon chaque morphologie.",
    longDescription: "Coupées dans le même bain de teinture pour une unité chromatique absolue, tout en permettant à chaque demoiselle d'honneur de choisir son décolleté.",
    model: "CORT-HAR-25",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44", "46+"],
    colors: [
      { name: "Linen Mist", hex: "#d8c8b8" },
      { name: "Moss Taupe", hex: "#74634f" },
      { name: "Mulberry Wine", hex: "#3f2028" },
    ],
    rating: 5.0,
    reviewsCount: 91,
  },
  {
    id: 26,
    name: 'Robe Longue "Sauge & Velours"',
    price: "Sur-Mesure · 360 €",
    category: "Cortège & Demoiselles",
    categoryKey: "cortege",
    color: "bg-gradient-product-2",
    image: "/couture/party-dress14.webp",
    description: "Taille empire délicatement froncée, dos goutte d'eau et jupe aérienne coupée dans le biais.",
    longDescription: "Légère et infroissable, cette robe accompagne vos témoins et demoiselles d'honneur du matin jusqu'au bout de la nuit.",
    model: "CORT-SAU-26",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Olive Smoke", hex: "#3f3d30" },
      { name: "Sable Chaud", hex: "#d8c8b8" },
    ],
    rating: 4.9,
    reviewsCount: 67,
  },
  {
    id: 27,
    name: 'Silhouette "Rose d\'Atelier"',
    price: "Sur-Mesure · 350 €",
    category: "Cortège & Demoiselles",
    categoryKey: "cortege",
    color: "bg-gradient-product-3",
    image: "/couture/party-dress15.webp",
    badge: "Coup de Cœur",
    description: "Bustier cache-cœur drapé main et ceinture ruban en satin duchesse coordonné.",
    longDescription: "Un modèle universellement flatteur qui souligne la taille en douceur et s'adapte à toutes les silhouettes de votre cortège.",
    model: "CORT-ROS-27",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44", "46+"],
    colors: [
      { name: "Rose Brume", hex: "#d8c8b8" },
      { name: "Prune Douce", hex: "#3f2028" },
    ],
    rating: 4.9,
    reviewsCount: 82,
  },
  {
    id: 28,
    name: 'Robe Cortège "Aube Dorée"',
    price: "Sur-Mesure · 375 €",
    category: "Cortège & Demoiselles",
    categoryKey: "cortege",
    color: "bg-gradient-product-4",
    image: "/couture/party-dress16.webp",
    description: "Encolure bateau raffinée, manches papillon en mousseline et tombé fluide.",
    longDescription: "Pensée pour les mariages champêtres comme pour les réceptions en château, avec essayage groupé privatisé au boudoir.",
    model: "CORT-AUB-28",
    sizes: ["Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Taupe Doré", hex: "#74634f" },
      { name: "Ivoire Chaud", hex: "#f5efe6" },
    ],
    rating: 5.0,
    reviewsCount: 74,
  },

  // CATÉGORIE 8 : CORSETERIE D'ART (party-dress17 .. party-dress20)
  {
    id: 29,
    name: 'Bustier Sculpté "Maison d\'Or"',
    price: "Sur-Mesure · 460 €",
    category: "Corseterie d'Art",
    categoryKey: "corsetry",
    color: "bg-gradient-product-1",
    image: "/couture/party-dress17.webp",
    badge: "Savoir-Faire",
    description: "Corset à 14 baleines spirales souples, entoilage soie et laçage dos au ruban de satin.",
    longDescription: "Façonné selon les règles de la haute corseterie parisienne, ce bustier galbe la taille sans jamais comprimer et soutient le port de tête.",
    model: "CORS-MAI-29",
    sizes: ["100% Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Noir Earth", hex: "#111312" },
      { name: "Linen Mist", hex: "#d8c8b8" },
    ],
    rating: 5.0,
    reviewsCount: 96,
  },
  {
    id: 30,
    name: 'Robe Corset "Dentelle & Baleinage"',
    price: "Sur-Mesure · 590 €",
    category: "Corseterie d'Art",
    categoryKey: "corsetry",
    color: "bg-gradient-product-2",
    image: "/couture/party-dress18.webp",
    badge: "Haute Précision",
    description: "Jeu de transparence en tulle illusion, goussets debaleines gansés de satin et jupe drapée.",
    longDescription: "L'architecture intérieure du vêtement devient un élément esthétique majeur, soulignant chaque ligne du buste avec une finesse d'orfèvre.",
    model: "CORS-DEN-30",
    sizes: ["100% Sur-Mesure", "34 / 36", "38 / 40", "42 / 44"],
    colors: [
      { name: "Mulberry Wine", hex: "#3f2028" },
      { name: "Olive Oscuro", hex: "#29251c" },
    ],
    rating: 4.9,
    reviewsCount: 84,
  },
  {
    id: 31,
    name: 'Fourreau Bustier "Galbe Impérial"',
    price: "Sur-Mesure · 630 €",
    category: "Corseterie d'Art",
    categoryKey: "corsetry",
    color: "bg-gradient-product-3",
    image: "/couture/party-dress19.webp",
    description: "Décolleté cœur architectural en crêpe lourd et boutonnage dos recouvert de perles de soie.",
    longDescription: "Grâce à sa ceinture de maintien interne invisible, cette robe bustier reste parfaitement en place tout au long de votre réception.",
    model: "CORS-GAL-31",
    sizes: ["100% Sur-Mesure", "34 / 36", "38 / 40", "42 / 44", "46+"],
    colors: [
      { name: "Moss Taupe", hex: "#74634f" },
      { name: "Noir Couture", hex: "#111312" },
    ],
    rating: 5.0,
    reviewsCount: 110,
  },
  {
    id: 32,
    name: 'Création Corsetée "Velours & Guipure"',
    price: "Sur-Mesure · 670 €",
    category: "Corseterie d'Art",
    categoryKey: "corsetry",
    color: "bg-gradient-product-4",
    image: "/couture/party-dress20.webp",
    badge: "Pièce Signature",
    description: "Bustier en velours de soie rebrodé de guipure ancienne et jupe fendue à drapé asymétrique.",
    longDescription: "Alliance d'un maintien sculptural et d'une douceur seconde peau grâce à sa doublure intégrale en pongé de soie naturelle.",
    model: "CORS-VEL-32",
    sizes: ["100% Sur-Mesure", "Essayage Privé"],
    colors: [
      { name: "Velvet Plum", hex: "#2a171d" },
      { name: "Linen Mist", hex: "#d8c8b8" },
    ],
    rating: 5.0,
    reviewsCount: 99,
  },
]

interface Testimonial {
  id: number
  name: string
  role: string
  quote: string
  avatar: string
  x: number
  y: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Inès M.",
    role: "Mariée · Collection Céleste",
    quote:
      "Ma robe de mariée était encore plus belle que dans mes rêves. Le tombé de la dentelle et l'ajustement au millimètre ont ébloui tous nos invités !",
    avatar: "/couture/other-robes8.webp",
    x: 12,
    y: 16,
  },
  {
    id: 2,
    name: "Sarah K.",
    role: "Robe de Gala Sur-Mesure",
    quote:
      "Des doigts de fée ! En trois essayages, elle a créé une robe fourreau qui épouse parfaitement ma morphologie avec un confort incroyable.",
    avatar: "/couture/other-robes9.webp",
    x: 35,
    y: 12,
  },
  {
    id: 3,
    name: "Amina B.",
    role: "Cérémonie & Fiançailles",
    quote:
      "La qualité des tissus, la finesse des perles cousues à la main et la douceur de l'accueil à l'atelier font toute la différence. Mille mercis !",
    avatar: "/couture/other-robes10.webp",
    x: 65,
    y: 12,
  },
  {
    id: 4,
    name: "Chloé L.",
    role: "Demoiselle d'Honneur",
    quote:
      "Nous avons fait réaliser nos quatre robes de cortège sur-mesure : harmonie parfaite des couleurs et finitions dignes des plus grandes maisons.",
    avatar: "/couture/other-robes11.webp",
    x: 88,
    y: 18,
  },
  {
    id: 5,
    name: "Nadia R.",
    role: "Robe de Soirée Éclat",
    quote:
      "Du croquis initial jusqu'à la livraison sous housse parfumée, chaque étape a été un pur bonheur. Je recommande cet atelier les yeux fermés.",
    avatar: "/couture/other-robes12.webp",
    x: 7,
    y: 50,
  },
  {
    id: 6,
    name: "Camille T.",
    role: "Mariée · Coupe Sirène",
    quote:
      "Elle a su écouter chacune de mes envies et me conseiller sur le choix du satin duchesse. Je me suis sentie comme une reine toute la soirée !",
    avatar: "/couture/other-robes13.webp",
    x: 93,
    y: 52,
  },
  {
    id: 7,
    name: "Leïla S.",
    role: "Création Haute Couture",
    quote:
      "Un savoir-faire rare et précieux. Le travail du bustier baleiné maintient parfaitement sans jamais serrer, on danse toute la nuit sans effort.",
    avatar: "/couture/other-robes14.webp",
    x: 20,
    y: 84,
  },
  {
    id: 8,
    name: "Myriam D.",
    role: "Robe Cocktail Orchidée",
    quote:
      "Délais parfaitement respectés et un sens du détail exceptionnel sur les broderies et l'ourlet invisible. C'est désormais ma couturière attitrée !",
    avatar: "/couture/other-robes15.webp",
    x: 80,
    y: 82,
  },
  {
    id: 9,
    name: "Sofia V.",
    role: "Robe Princesse Éternité",
    quote:
      "Une patience et une passion admirables ! Chaque point de couture respire l'amour du métier et l'élégance sur-mesure.",
    avatar: "/couture/other-robes16.webp",
    x: 50,
    y: 84,
  },
]

interface ExclusiveCollectionItem {
  id: number
  title: string
  kicker: string
  text: string
  btnText: string
  bg: string
}

const EXCLUSIVE_COLLECTIONS: ExclusiveCollectionItem[] = [
  {
    id: 1,
    title: "Sérénade Étoilée",
    kicker: "Robe de Gala Broderie Main",
    text: "Tulle illusion rebrodé de cristaux facettés et corsage sculpté pour une allure nocturne inoubliable.",
    btnText: "Découvrir le Modèle",
    bg: "/couture/party-dress13.webp",
  },
  {
    id: 2,
    title: "Velours Impérial",
    kicker: "Soirée Haute Couture",
    text: "Drapé asymétrique en soie sauvage et bustier baleiné épousant chaque courbe avec une précision d'orfèvre.",
    btnText: "Voir les Détails",
    bg: "/couture/party-dress14.webp",
  },
  {
    id: 3,
    title: "Aurore de Satin",
    kicker: "Coupe Sirène Fluide",
    text: "Satin duchesse coupé dans le biais offrant une fluidité lumineuse et un dos nu vertigineux.",
    btnText: "Explorer la Création",
    bg: "/couture/party-dress15.webp",
  },
  {
    id: 4,
    title: "Éclat de Perles",
    kicker: "Dentelle & Perlage d'Art",
    text: "Plus de trois mille perles nacrées posées au crochet de Lunéville sur une dentelle florale aérienne.",
    btnText: "Admirer le Perlage",
    bg: "/couture/party-dress16.webp",
  },
  {
    id: 5,
    title: "Murmure d'Organza",
    kicker: "Volants Architecturaux",
    text: "Superposition de volants d'organza de soie roulottés main pour un volume vaporeux et gracieux.",
    btnText: "Commander Sur-Mesure",
    bg: "/couture/party-dress17.webp",
  },
  {
    id: 6,
    title: "Silhouette Palais",
    kicker: "Robe d'Apparat",
    text: "L'alliance parfaite entre la noblesse d'un taffetas craquant et la finesse d'une encolure bateau sculptée.",
    btnText: "Voir la Collection",
    bg: "/couture/party-dress18.webp",
  },
  {
    id: 7,
    title: "Grâce Minimaliste",
    kicker: "Crêpe Georgette Pur",
    text: "Lignes pures, coutures anglaises invisibles et tombé lourd qui accompagne chaque pas avec majesté.",
    btnText: "En Savoir Plus",
    bg: "/couture/party-dress19.webp",
  },
  {
    id: 8,
    title: "Reflet d'Orfèvre",
    kicker: "Brocart & Fil d'Or",
    text: "Jacquard de soie tissé de fils métallisés subtils, structuré par un juponnage invisible d'atelier.",
    btnText: "Découvrir l'Étoffe",
    bg: "/couture/party-dress20.webp",
  },
  {
    id: 9,
    title: "Poésie Nocturne",
    kicker: "Mousseline Plissée",
    text: "Plissé soleil exécuté sur-mesure et taille marquée d'un galon de satin rebrodé à la main.",
    btnText: "Découvrir le Style",
    bg: "/couture/party-dress21.webp",
  },
  {
    id: 10,
    title: "Apothéose Couture",
    kicker: "Pièce Maîtresse d'Atelier",
    text: "Le chef-d'œuvre de notre saison réunissant dentelle chantilly, corsetage traditionnel et traîne royale.",
    btnText: "Réserver un Essayage",
    bg: "/couture/party-dress22.webp",
  },
]

interface CarouselShoe {
  name: string
  image: string
  desc: string
  a: number
  bg: string
}

const CAROUSEL_SHOES: CarouselShoe[] = [
  { name: "Mariée Royale", image: "/couture/wedding4.webp", desc: "Dentelle & Traîne Cathédrale", a: -12, bg: "#29251c" },
  { name: "Gala Étoilé", image: "/couture/party-dress3.webp", desc: "Fourreau Perlé Main", a: -6, bg: "#74634f" },
  { name: "Drapé Couture", image: "/couture/other-robes3.webp", desc: "Soie Sauvage Sur-Mesure", a: 0, bg: "#3f2028" },
  { name: "Dentelle d'Or", image: "/couture/wedding6.webp", desc: "Création Mariage Impérial", a: 6, bg: "#111312" },
  { name: "Soirée Velours", image: "/couture/party-dress4.webp", desc: "Silhouette Haute Couture", a: 12, bg: "#3f3d30" },
]

interface EventItem {
  id: number
  title: string
  subtitle: string
  category: string
  date: string
  location: string
  image: string
  speaker: {
    name: string
    role: string
    initials: string
  }
  description: string
  highlights: string[]
  perks: string[]
}

const eventsData: EventItem[] = [
  {
    id: 1,
    title: "Salon Privé des futures Mariées",
    subtitle: "Essayage privilégié de la nouvelle collection nuptiale, conseils morphologiques et sélection des dentelles de Calais.",
    category: "Mariage & Sur-Mesure",
    date: "18 Novembre 2026 • 14:00 - 19:00",
    location: "Salon d'Essayage Privé, Atelier Couture",
    image: "/couture/wedding11.webp",
    speaker: {
      name: "Maître Couturière & Créatrice",
      role: "Fondatrice de l'Atelier & Modéliste",
      initials: "MC"
    },
    description: "Une après-midi intimiste dédiée aux futures mariées. Découvrez nos 15 nouvelles silhouettes nuptiales, touchez nos soies sauvages et composez avec notre créatrice le croquis personnalisé de votre robe.",
    highlights: [
      "14:00 - Accueil au salon & découverte du carnet de dentelles",
      "15:00 - Défilé commenté des coupes Sirène, Princesse et Bohème",
      "16:30 - Séance individuelle de prise d'empreinte morphologique",
      "18:00 - Remise de votre croquis d'esquisse personnalisé"
    ],
    perks: [
      "Coffret d'échantillons de soieries & dentelles offert",
      "Premier essayage sur toile inclus",
      "Voile assorti brodé aux initiales sur commande"
    ]
  },
  {
    id: 2,
    title: "Soirée Défilé Gala & Tapis Rouge",
    subtitle: "Présentation en avant-première des robes de soirée perlées, fourreaux drapés et créations de gala.",
    category: "Défilé Haute Couture",
    date: "28 Novembre 2026 • 18:30 - 22:00",
    location: "Galerie Verrière, Salon d'Honneur",
    image: "/couture/party-dress23.webp",
    speaker: {
      name: "Atelier Création & Perlage",
      role: "Artisanes Brodeuses & Stylistes",
      initials: "AC"
    },
    description: "Assistez au dévoilement de nos robes du soir façonnées à la main. Jeux de lumière sur sequins brodés, velours profonds et satins fluides coupés dans le biais.",
    highlights: [
      "18:30 - Cocktail d'ouverture & exposition des bustes d'atelier",
      "19:30 - Grand Défilé des 20 silhouettes Gala & Soirée",
      "20:30 - Démonstration en direct de broderie au crochet de Lunéville",
      "21:15 - Réservations prioritaires des pièces uniques"
    ],
    perks: [
      "Lookbook imprimé numéroté de la saison",
      "Accès prioritaire au carnet de commandes Gala",
      "Retouches d'ourlet et de bustier offertes"
    ]
  },
  {
    id: 3,
    title: "Masterclass Drapé & Moulage sur Mannequin",
    subtitle: "Découvrez l'art de sculpter la mousseline et le satin directement sur buste de couturière.",
    category: "Savoir-Faire d'Atelier",
    date: "05 Décembre 2026 • 10:00 - 17:00",
    location: "Grand Atelier de Coupe",
    image: "/couture/other-robes17.webp",
    speaker: {
      name: "Cheffe d'Atelier Modéliste",
      role: "Spécialiste du Drapé & Corseterie",
      initials: "CM"
    },
    description: "Plongez dans les secrets de construction d'une robe haute couture : placement du droit-fil, travail du plein biais, épinglage des plis soleil et équilibrage de la traîne.",
    highlights: [
      "10:00 - Étude des étoffes : Satin duchesse, Crêpe Georgette & Organza",
      "12:00 - Technique du moulage de bustier sans couture apparente",
      "14:30 - Création d'un drapé asymétrique sur mannequin Stockman",
      "16:30 - Finitions roulottées main & pose de dentelle incrustée"
    ],
    perks: [
      "Trousse d'épingles couture & ciseaux de broderie",
      "Guide illustré des coupes selon chaque morphologie",
      "Bon privilège sur votre prochaine commande sur-mesure"
    ]
  },
  {
    id: 4,
    title: "Rendez-Vous Cortège & Demoiselles d'Honneur",
    subtitle: "Harmonisez les robes de vos témoins et invitées d'honneur autour d'une palette de tissus coordonnée.",
    category: "Cortège & Cérémonie",
    date: "12 Décembre 2026 • 13:30 - 18:30",
    location: "Boudoir Privé de l'Atelier",
    image: "/couture/wedding12.webp",
    speaker: {
      name: "Conseillère Silhouette & Nuancier",
      role: "Experte Harmonie Cortège",
      initials: "CS"
    },
    description: "Un moment convivial entre la mariée et ses proches pour concevoir des robes de cortège assorties en couleur mais adaptées à la morphologie et au style de chacune.",
    highlights: [
      "13:30 - Sélection de la gamme chromatique (Sauge, Champagne, Rose Poudré, Bleu Nuit)",
      "15:00 - Choix des encolures personnalisées pour chaque demoiselle d'honneur",
      "16:30 - Prise de mesures complète du cortège",
      "18:00 - Planification groupée des essayages"
    ],
    perks: [
      "Tarif préférentiel Cortège dès 3 robes commandées",
      "Échantillons tissus remis pour assortir les accessoires",
      "Housses de transport couture personnalisées"
    ]
  },
  {
    id: 5,
    title: "Exposition Broderies d'Art & Dentelles Rares",
    subtitle: "Immersion au cœur des matières nobles : perles de cristal, guipures florales et soieries d'exception.",
    category: "Haute Broderie",
    date: "20 Décembre 2026 • 15:00 - 20:00",
    location: "Verrière des Étoffes",
    image: "/couture/party-dress24.webp",
    speaker: {
      name: "Artisane Brodeuse d'Art",
      role: "Maître du Perlage & Incrustations",
      initials: "AB"
    },
    description: "Admirez de près le travail minutieux de centaines d'heures de perlage et d'application de dentelle qui transforment chaque robe de notre atelier en bijou textile.",
    highlights: [
      "15:00 - Visite guidée de notre matériauthèque de tissus précieux",
      "16:30 - Atelier tactile : marier transparence du tulle et éclat du satin",
      "18:00 - Conseils d'entretien et de conservation des robes d'exception",
      "19:00 - Rencontre privée pour projets sur-mesure 2027"
    ],
    perks: [
      "Carnet d'inspiration Haute Couture offert",
      "Consultation privée de 45 min incluse",
      "Priorité sur le calendrier des mariages d'été"
    ]
  }
]

interface WhyChooseCard {
  id: number
  title: string
  accentTitle: string
  subtitle: string
  category: string
  price: string
  locationCode: string
  locationFull: string
  duration: string
  level: string
  schedule: string
  rating: string
  reviewsCount: number
  ctaText: string
  image: string
  description: string
  benefits: string[]
  slots: string[]
  instructor: {
    name: string
    role: string
    initials: string
  }
}

const whyChooseCards: WhyChooseCard[] = [
  {
    id: 1,
    title: "Robe de Mariée",
    accentTitle: "Sur-Mesure.",
    subtitle: "Création Exclusive de A à Z",
    category: "Haute Couture Nuptiale",
    price: "890 €",
    locationCode: "MARIÉE",
    locationFull: "Salon Nuptial Privé · Sur Rendez-Vous",
    duration: "3 Essayages",
    level: "Patron Individuel",
    schedule: "Lun - Sam • 10:00 & 18:30",
    rating: "5.0",
    reviewsCount: 164,
    ctaText: "Réserver un essayage",
    image: "/couture/wedding13.webp",
    description: "De la feuille blanche jusqu'au jour J, nous concevons et cousons la robe de mariée de vos rêves selon vos mesures exactes, avec un choix d'étoffes nobles et de dentelles raffinées.",
    benefits: [
      "Croquis personnalisé et sélection des dentelles & soieries à l'atelier",
      "Patronage individuel en 28 points et essayage sur toile de coton",
      "Corset baleiné sur-mesure assurant un maintien parfait et confortable",
      "Trois séances d'essayage privatisées jusqu'à la remise sous housse"
    ],
    slots: ["10:00 Matin", "14:30 Après-midi", "17:30 Fin de journée"],
    instructor: {
      name: "Maître Couturière",
      role: "Créatrice Robes de Mariée & Modéliste",
      initials: "MC"
    }
  },
  {
    id: 2,
    title: "Robe de Gala",
    accentTitle: "& Tapis Rouge.",
    subtitle: "Fourreaux & Drapés Précieux",
    category: "Soirée d'Exception",
    price: "490 €",
    locationCode: "GALA",
    locationFull: "Atelier Soirée & Réception",
    duration: "2 Essayages",
    level: "Coupe Biais & Perlage",
    schedule: "Mar - Sam • 11:00 - 19:00",
    rating: "5.0",
    reviewsCount: 218,
    ctaText: "Commander ce style",
    image: "/couture/party-dress25.webp",
    description: "Pour vos soirées de gala, fiançailles et réceptions prestigieuses, nous réalisons des robes longues au tombé spectaculaire qui subliment votre allure.",
    benefits: [
      "Moulage direct sur buste pour un drapé fluide sans pli disgracieux",
      "Choix de satins duchesse, crêpes de soie, velours et tulles perlés",
      "Finitions intérieures doublées en soie pour un confort absolu",
      "Personnalisation du décolleté, du dos nu et de la hauteur de fente"
    ],
    slots: ["11:00 Consultation", "15:00 Essayage", "18:00 Soirée"],
    instructor: {
      name: "Atelier Soirée",
      role: "Spécialiste Drapé & Broderie Main",
      initials: "AS"
    }
  },
  {
    id: 3,
    title: "Tenue de Henné",
    accentTitle: "& Fiançailles.",
    subtitle: "Broderies d'Or & Tradition",
    category: "Cérémonie & Orient",
    price: "580 €",
    locationCode: "TRAD",
    locationFull: "Salon d'Ornement & Broderie",
    duration: "3 Essayages",
    level: "Orfèvrerie Textile",
    schedule: "Tous les jours • Sur RDV",
    rating: "4.9",
    reviewsCount: 176,
    ctaText: "Personnaliser le modèle",
    image: "/couture/other-robes18.webp",
    description: "L'alliance majestueuse des coupes haute couture contemporaines et de la richesse des broderies traditionnelles au fil d'or, perles et cristaux cousus main.",
    benefits: [
      "Motifs de broderie exclusifs dessinés et placés sur-mesure",
      "Ceinture sculptée assortie et cape d'épaules amovible sur demande",
      "Tissus riches : velours de soie, brocart royal et organza brodé",
      "Ajustement précis pour danser et célébrer en toute légèreté"
    ],
    slots: ["10:30 Matin", "14:00 Après-midi", "17:00 Soirée"],
    instructor: {
      name: "Artisane Brodeuse",
      role: "Experte Broderie Fil d'Or & Perlage",
      initials: "AB"
    }
  },
  {
    id: 4,
    title: "Robe Cocktail",
    accentTitle: "& Invitée.",
    subtitle: "Coupes Midi & Asymétriques",
    category: "Cocktail & Cortège",
    price: "360 €",
    locationCode: "COCKTAIL",
    locationFull: "Studio Coupes & Couleurs",
    duration: "2 Essayages",
    level: "Toutes Morphologies",
    schedule: "Lun - Sam • 09:30 - 19:00",
    rating: "5.0",
    reviewsCount: 194,
    ctaText: "Choisir ma couleur",
    image: "/couture/party-dress26.webp",
    description: "Soyez l'invitée la plus élégante avec une robe de cocktail taillée exactement à vos mesures et déclinée dans plus de 40 nuances de notre nuancier.",
    benefits: [
      "Plus de 40 coloris de crêpe, satin, mikado et mousseline disponibles",
      "Longueur midi, courte ou cheville adaptée à votre silhouette",
      "Maintien poitrine intégré pour porter les dos nus en toute sérénité",
      "Délai de confection rapide pour vos événements proches"
    ],
    slots: ["09:30 Matin", "14:00 Studio", "17:30 Fin d'après-midi"],
    instructor: {
      name: "Styliste Modéliste",
      role: "Conseil Morphologie & Nuancier",
      initials: "SM"
    }
  },
  {
    id: 5,
    title: "Cortège Royal",
    accentTitle: "& Demoiselles.",
    subtitle: "Harmonie des Silhouettes",
    category: "Cortège Coordonné",
    price: "340 €",
    locationCode: "CORTÈGE",
    locationFull: "Boudoir Privé de l'Atelier",
    duration: "2 Essayages",
    level: "Groupe & Famille",
    schedule: "Mer - Sam • 10:00 & 16:00",
    rating: "4.9",
    reviewsCount: 115,
    ctaText: "Réserver pour le groupe",
    image: "/couture/other-robes19.webp",
    description: "Un même bain de teinture pour une harmonie visuelle parfaite sur les photos, avec une coupe d'encolure et de manches personnalisée pour chaque demoiselle d'honneur.",
    benefits: [
      "Tissu issu du même rouleau garantissant une nuance 100% identique",
      "Liberté de choisir l'encolure (cœur, bateau, asymétrique, cache-cœur)",
      "Prise de mesures individuelle pour chaque membre du cortège",
      "Remise privilégiée dès 3 robes de cortège commandées"
    ],
    slots: ["10:30 Matinée", "14:30 Groupe", "17:00 Privatisation"],
    instructor: {
      name: "Coordinatrice Cortège",
      role: "Styliste Mariage & Harmonie",
      initials: "CC"
    }
  },
  {
    id: 6,
    title: "Corseterie",
    accentTitle: "& Bustier.",
    subtitle: "Architecture & Maintien",
    category: "Savoir-Faire Signature",
    price: "420 €",
    locationCode: "CORSET",
    locationFull: "Atelier de Corseterie Fine",
    duration: "2 Essayages",
    level: "Haute Précision",
    schedule: "Jeu - Sam • Sur Rendez-Vous",
    rating: "4.9",
    reviewsCount: 163,
    ctaText: "Découvrir le sur-mesure",
    image: "/couture/other-robes20.webp",
    description: "Le secret d'une robe qui sublime la taille réside dans son bustier interne. Nos corsets sont entoilés et baleinés souplement pour sculpter sans jamais comprimer.",
    benefits: [
      "Baleinage spirale souple épousant chaque mouvement du buste",
      "Laçage dos satiné ou boutonnage recouvert de perles de soie",
      "Galbe naturel et maintien irréprochable du matin jusqu'à l'aube",
      "Réalisable en dentelle transparente, satin structuré ou velours"
    ],
    slots: ["11:00 Mesures", "15:00 Toile", "18:00 Finition"],
    instructor: {
      name: "Maître Corsetière",
      role: "Architecture du Buste & Maintien",
      initials: "MC"
    }
  },
  {
    id: 7,
    title: "Transformation",
    accentTitle: "& Ajustement.",
    subtitle: "Sublimation & Retouche Haute Couture",
    category: "Service Sur-Mesure",
    price: "190 €",
    locationCode: "ATELIER",
    locationFull: "Table de Coupe & Essayage",
    duration: "1 à 2 RDV",
    level: "Finition Main",
    schedule: "Mar - Sam • 09:30 - 18:00",
    rating: "5.0",
    reviewsCount: 289,
    ctaText: "Prendre rendez-vous",
    image: "/couture/other-robes21.webp",
    description: "Personnalisez un modèle de notre collection avec l'ajout de manches en dentelle, d'une traîne amovible, d'un voile brodé ou d'un ajustement haute précision.",
    benefits: [
      "Ajout ou retrait de manches, bretelles perlées et capes d'épaules",
      "Création de traîne amovible et système d'attache-traîne invisible",
      "Ourlet roulotté main et reprise de cintrage au millimètre",
      "Pressage vapeur professionnel et mise sous housse avant le jour J"
    ],
    slots: ["09:30 Matin", "13:30 Après-midi", "16:30 Finition"],
    instructor: {
      name: "Première Main d'Atelier",
      role: "Experte Finitions & Personnalisation",
      initials: "PM"
    }
  }
]

interface LookbookHotspot {
  id: number
  indexLabel: string
  productId: number
  x: number
  y: number
  partLabel: string
  zoneTitle: string
  materialNote: string
  archiveRef: string
  craftOrigin: string
  techSpec: string
  weightSpec: string
  stylingNote: string
  materialName: string
  countryOrigin: string
  countryFlag: string
  atelierName: string
  composition: string
  textureTouch: string
  lightReflect: string
  durabilityBreathability: string
  whySpecial: string
  artisanSecret: string
  careGuidance: string
}

interface LookbookSilhouette {
  id: number
  code: string
  title: string
  serifSubtitle: string
  seasonNote: string
  image: string
  photographer: string
  totalPrice: string
  hoursOfWork: string
  fabricMeterage: string
  fittingsCount: string
  editorialNote: string
  hotspots: LookbookHotspot[]
}

const LOOKBOOK_SILHOUETTES: LookbookSilhouette[] = [
  {
    id: 1,
    code: "SILHOUETTE 01",
    title: "Souveraine d'Ivoire",
    serifSubtitle: "Robe de Mariée — Dentelle de Calais & Pur Lin",
    seasonNote: "Haute Couture Nuptiale",
    image: "/couture/wedding14.webp",
    photographer: "Confection : 100% Sur-Mesure à l'Atelier",
    totalPrice: "980 €",
    hoursOfWork: "85 Heures",
    fabricMeterage: "12 Mètres d'Étoffe Noble",
    fittingsCount: "3 Essayages Privés",
    editorialNote:
      "Une création nuptiale majestueuse célébrant la noblesse des fibres naturelles : dentelle de Caudry-Calais ajourée, corset en soie de Côme et traîne royale façonnée en pur lin normand peigné.",
    hotspots: [
      {
        id: 101,
        indexLabel: "01",
        productId: 1,
        x: 32,
        y: 28,
        partLabel: "Corsage & Décolleté",
        zoneTitle: "Dentelle de Caudry-Calais & Tulle Illusion",
        materialNote: "Dentelle Leavers de Calais (France) · Tulle soyeux invisible",
        archiveRef: "ATELIER / COR-01",
        craftOrigin: "Incrustation Main · Point Invisible",
        techSpec: "14 Baleines Souples · Bonnets Intégrés",
        weightSpec: "38 Heures de Broderie Fine",
        stylingNote:
          "Les motifs floraux de la dentelle sont découpés aux ciseaux fins puis réappliqués à la main sur le décolleté sans aucune couture apparente.",
        materialName: "Dentelle de Caudry-Calais sur Tulle Illusion",
        countryOrigin: "France (Hauts-de-France)",
        countryFlag: "🇫🇷",
        atelierName: "Maison Dentellière Fondée en 1887 — Calais-Caudry",
        composition: "78% Coton d'Égypte peigné extra-long · 22% Soie naturelle de mûrier",
        textureTouch: "D'une légèreté vaporeuse, caresse aérienne sur la peau sans aucune sensation de grattage ni raideur.",
        lightReflect: "Fini poudré mat qui absorbe la lumière naturelle sans reflet parasite, idéal pour les photographies de mariage.",
        durabilityBreathability: "Trame aérée respirante à 100%, maintenant une fraîcheur totale sous le bustier durant toute la journée.",
        whySpecial:
          "Tissée sur les légendaires métiers Leavers du XIXe siècle (qui ne sont plus construits aujourd'hui), cette dentelle nécessite plus de 5 000 fils de chaîne entrelacés selon un tracé mécanique d'une précision microscopique. Chaque arabesque florale est ensuite découpée et réappliquée au point invisible par une brodeuse d'art sur le tulle illusion, donnant l'impression magique que les fleurs de dentelle fleurissent à même la peau de la mariée.",
        artisanSecret: "Incrustation point par point sans couture visible : 38 heures de travail manuel rien que pour ce décolleté.",
        careGuidance: "Conservation sur cintre rembourré en soie, nettoyage exclusivement chez un maître teinturier spécialisé haute couture.",
      },
      {
        id: 102,
        indexLabel: "02",
        productId: 2,
        x: 31,
        y: 48,
        partLabel: "Cintrage & Taille",
        zoneTitle: "Satin Duchesse & Crêpe de Soie de Côme",
        materialNote: "100% Pure Soie de Côme (Italie) · Baleinage souple",
        archiveRef: "ATELIER / TAI-02",
        craftOrigin: "Moulage sur Mannequin Vivant",
        techSpec: "Maintien Interne · Fermeture Perles Nacrées",
        weightSpec: "Ajustement au Millimètre Près",
        stylingNote:
          "La ligne de taille est subtilement galbée en V pour élancer le buste et marquer la cambrure avec une aisance et une souplesse absolues.",
        materialName: "Satin Duchesse & Crêpe de Soie de Côme",
        countryOrigin: "Italie (Lombardie, Lac de Côme)",
        countryFlag: "🇮🇹",
        atelierName: "Tissages Soyeux Historiques de Côme — Fondés en 1902",
        composition: "100% Pure Soie de Mûrier biologique (42 mommes)",
        textureTouch: "Toucher liquide et soyeux, enveloppant le corps avec une douceur incomparable et un maintien ferme mais voluptueux.",
        lightReflect: "Éclat subtilement nacré, captant la douce lueur des bougies et du soleil couchant.",
        durabilityBreathability: "Thermorégulation naturelle : la soie évacue l'humidité et procure une sensation de fraîcheur continue.",
        whySpecial:
          "Le satin duchesse de Côme est réputé dans le monde entier comme le saint des saints des soies nuptiales. Grâce à une densité exceptionnelle de fils de soie ultra-fins battus sur des métiers Jacquard séculaires, il possède une 'mémoire de forme' unique qui galbe et sculpte la taille sans nécessiter de corset rigide étouffant. La cambrure naturelle de la mariée est magnifiée tout en lui laissant une liberté de mouvement et de respiration absolue.",
        artisanSecret: "Entoilage interne en pongé de soie pure et 14 baleines souples à mémoire de forme épousant chaque respiration.",
        careGuidance: "Défroissage doux à la vapeur verticale basse pression, mise sous housse respirante en coton non blanchi.",
      },
      {
        id: 103,
        indexLabel: "03",
        productId: 3,
        x: 40,
        y: 76,
        partLabel: "Jupe & Traîne",
        zoneTitle: "Pur Lin de Normandie & Voile d'Organza",
        materialNote: "Lin normand peigné (France) · Organza de soie pure",
        archiveRef: "ATELIER / TRA-03",
        craftOrigin: "Coupe en Plein Biais · Roulotté Main",
        techSpec: "Attache-Traîne Invisible Inclus",
        weightSpec: "8,5 Mètres de Dentelle & Lin d'Ourlet",
        stylingNote:
          "La traîne se déploie avec majesté lors de la cérémonie puis se relève en un geste grâce au bouton nacré dissimulé pour la soirée.",
        materialName: "Pur Lin de Normandie & Organza de Soie Aérienne",
        countryOrigin: "France (Normandie) & Flandres",
        countryFlag: "🇫🇷",
        atelierName: "Filatures Traditionnelles de Normandie — Label Masters of Linen",
        composition: "65% Lin Normand peigné longue fibre · 35% Organza de Soie naturelle",
        textureTouch: "Souplesse texturée au tombé sculptural, conférant à la jupe et à la traîne un mouvement noble et aérien.",
        lightReflect: "Texture brute raffinée rehaussée de reflets ivoire changeants au gré des pas.",
        durabilityBreathability: "Résistance extrême à la déchirure lors de la marche et tombé lourd infroissable qui ne s'écrase jamais.",
        whySpecial:
          "Le lin cultivé sur les terres côtières de Normandie bénéficie d'un climat océanique unique au monde qui confère à ses fibres une longueur et une souplesse incomparables. Marié en trame serrée avec l'organza de soie, il permet à la traîne royale d'avoir une ampleur sculpturale sans être alourdie par des jupons synthétiques rigides. La robe ondule avec une grâce majestueuse à chaque pas vers l'autel, tout en restant remarquablement fraîche et légère.",
        artisanSecret: "Coupe en plein biais avec ourlet roulotté main et bouton nacré dissimulé pour relever la traîne le soir du bal.",
        careGuidance: "Housse anti-UV fournie avec papier de soie au pH neutre pour une préservation patrimoniale sur plusieurs générations.",
      },
    ],
  },
  {
    id: 2,
    code: "SILHOUETTE 02",
    title: "Impératrice de Gala",
    serifSubtitle: "Robe du Soir — Pongé & Crêpe de Soie de Lyon",
    seasonNote: "Collection Gala & Réception",
    image: "/couture/party-dress27.webp",
    photographer: "Confection : Patron Individuel Sur-Mesure",
    totalPrice: "640 €",
    hoursOfWork: "55 Heures",
    fabricMeterage: "6,5 Mètres de Soie Pure",
    fittingsCount: "2 à 3 Essayages",
    editorialNote:
      "L'équilibre parfait entre glamour sculptural et fluidité couture. Taillée dans une étoffe précieuse qui capte la lumière du soir, cette silhouette magnifie la démarche.",
    hotspots: [
      {
        id: 201,
        indexLabel: "01",
        productId: 5,
        x: 50,
        y: 56,
        partLabel: "Épaules & Encolure",
        zoneTitle: "Pongé de Soie Pure & Finition Glacée",
        materialNote: "Soie d'élevage de Lyon (France) certifiée Oeko-Tex",
        archiveRef: "GALA / ENC-01",
        craftOrigin: "Bâtissage sur Buste · Finition Glacée",
        techSpec: "Tenue Sans Bretelles · Ruban Anti-Glisse",
        weightSpec: "Doublure 100% Pongé de Soie",
        stylingNote:
          "L'encolure est renforcée d'un ruban de maintien invisible qui épouse le décolleté sans jamais bâiller, même en mouvement.",
        materialName: "Pongé de Soie Pure de Lyon & Perles Fines",
        countryOrigin: "France (Auvergne-Rhône-Alpes, Lyon)",
        countryFlag: "🇫🇷",
        atelierName: "Ateliers Soyeux de la Croix-Rousse — Lyon",
        composition: "100% Soie Pongée Naturelle (55 g/m²)",
        textureTouch: "Finesse caressante d'une absolue légèreté, régulant thermiquement le contact avec le buste.",
        lightReflect: "Reflets profonds et soyeux sous les projecteurs de soirée.",
        durabilityBreathability: "Confort respirant incomparable évitant tout échauffement lors des réceptions.",
        whySpecial:
          "Héritier du savoir-faire des Canuts lyonnais, ce pongé de soie possède une finesse de filature que seuls les tisseurs de la région Rhône-Alpes maîtrisent. Sa souplesse permet un plaquage parfait sur la peau sans faux plis.",
        artisanSecret: "Montage sur ruban de sergé sous-jacent pour un maintien sans faille sans armature métallique gênante.",
        careGuidance: "Nettoyage délicat à sec, pressage à fer tiède sans vapeur directe.",
      },
      {
        id: 202,
        indexLabel: "02",
        productId: 6,
        x: 48,
        y: 71,
        partLabel: "Drapé Oblique",
        zoneTitle: "Crêpe de Soie Lourd 4 Plis & Perles de Murano",
        materialNote: "Crêpe de soie lourd de Côme (Italie) & Perles de Murano",
        archiveRef: "GALA / DRA-02",
        craftOrigin: "Épinglage Vivant à l'Atelier",
        techSpec: "Plis Fixés Point par Point",
        weightSpec: "Tombé Liquide Infroissable",
        stylingNote:
          "Les plis convergent vers la hanche pour dessiner une taille de guêpe et créer un jeu d'ombres et de lumière flatteur.",
        materialName: "Crêpe de Soie Lourd 4 Plis & Verre de Murano",
        countryOrigin: "Italie (Lombardie & Vénétie)",
        countryFlag: "🇮🇹",
        atelierName: "Maison Tessile Lombarda — Côme",
        composition: "100% Crêpe de Soie Lourd torsadé 4 brins (220 g/m²)",
        textureTouch: "Grain crêpé inimitable, dense, avec un effet drapant lourd et voluptueux.",
        lightReflect: "Matité profonde créant un contraste saisissant avec les perles de verre soufflé de Murano.",
        durabilityBreathability: "Tombé infroissable même après plusieurs heures assise.",
        whySpecial:
          "Ce crêpe lourd 4 plis utilise des fils de soie fortement surtorsadés qui lui confèrent une élasticité naturelle sans un gramme d'élasthanne synthétique. Le vêtement bouge comme du mercure liquide.",
        artisanSecret: "Chaque pli est fixé un par un au point de chausson sur un ruban intérieur en gros-grain.",
        careGuidance: "Suspension sur cintre large rembourré pour préserver le volume des plis.",
      },
      {
        id: 203,
        indexLabel: "03",
        productId: 8,
        x: 50,
        y: 88,
        partLabel: "Tombé & Fente",
        zoneTitle: "Satin Envers Crêpe Liquide & Roulotté Main",
        materialNote: "Satin italien (Biella) · Ourlet invisible au point de chausson",
        archiveRef: "GALA / JUP-03",
        craftOrigin: "Coupe Haute Précision au Millimètre",
        techSpec: "Hauteur de Fente Personnalisable",
        weightSpec: "Fluidité Dynamique 360°",
        stylingNote:
          "Chaque ourlet est cousu à la main au fil de soie assorti afin qu'aucune piqûre machine ne vienne briser la souplesse du tombé.",
        materialName: "Satin Envers Crêpe Liquide de Biella",
        countryOrigin: "Italie (Piémont, Biella)",
        countryFlag: "🇮🇹",
        atelierName: "Lanificio & Setificio Storico di Biella",
        composition: "100% Soie d'exception double face satin/crêpe",
        textureTouch: "Face extérieure satinée brillante et glissante, envers crêpé doux contre la peau.",
        lightReflect: "Lustre chatoyant qui capte l'éclairage feutré des salons de gala.",
        durabilityBreathability: "Tissage serré très résistant aux accrocs lors des déplacements.",
        whySpecial:
          "L'eau pure des Alpes biellaises utilisée pour le rinçage des fils confère à ce satin envers crêpe une brillance naturelle sans aucun additif chimique. Le tombé est si fluide qu'il accompagne la démarche avec une prestance cinématographique.",
        artisanSecret: "Ourlet exécuté à l'aiguille fine n°10 avec un fil de soie pure tiré de la lisière même du tissu.",
        careGuidance: "Housse de protection en soie noire fournie pour éviter toute décoloration.",
      },
    ],
  },
  {
    id: 3,
    code: "SILHOUETTE 03",
    title: "Légende d'Orient",
    serifSubtitle: "Création d'Apparat — Broderie d'Or & Soie Mikado",
    seasonNote: "Édition Prestige Sur-Mesure",
    image: "/couture/other-robes22.webp",
    photographer: "Confection : Broderie & Couture Main",
    totalPrice: "780 €",
    hoursOfWork: "72 Heures",
    fabricMeterage: "9 Mètres d'Étoffe d'Apparat",
    fittingsCount: "3 Essayages Privés",
    editorialNote:
      "Une robe de cérémonie d'une richesse ornementale remarquable, mariant la noblesse des broderies artisanales au fil d'or 24 carats et la tenue sculpturale de la soie Mikado impériale.",
    hotspots: [
      {
        id: 301,
        indexLabel: "01",
        productId: 13,
        x: 51,
        y: 35,
        partLabel: "Parure de Buste",
        zoneTitle: "Canetille de Fil d'Or 24ct & Cristaux de Bohême",
        materialNote: "Fil d'or d'artisanat français · Cristaux de Bohême posés main",
        archiveRef: "PRESTIGE / BRO-01",
        craftOrigin: "Broderie au Crochet de Lunéville & Aiguille",
        techSpec: "Plus de 2 400 Perles & Cristaux Posés Main",
        weightSpec: "Doublure Douce Anti-Frottement",
        stylingNote:
          "Les arabesques brodées encadrent le bustier et illuminent le port de tête tel un véritable bijou cousu à même l'étoffe.",
        materialName: "Canetille d'Or Pur & Cristaux de Bohême",
        countryOrigin: "France (Lyon) & République Tchèque (Bohême)",
        countryFlag: "🇫🇷 / 🇨🇿",
        atelierName: "Maison Broderie d'Or de Lunéville & Ateliers Lyonnais",
        composition: "Fil de cuivre gainé d'or pur 24 carats · Cristaux facettés de Bohême",
        textureTouch: "Relief précieux sans aspérité blessante, doublé de mousseline de soie douce.",
        lightReflect: "Scintillement éclatant sous tous les angles de lumière.",
        durabilityBreathability: "Fil d'or inoxydable inaltérable à l'humidité.",
        whySpecial:
          "Chaque centimètre carré de ce plastron est brodé selon la technique séculaire du crochet de Lunéville. La canetille d'or est un ressort hélicoïdal microscopique coupé à la pince millimétrique et enfilé un à un pour former les arabesques royales.",
        artisanSecret: "Plus de 2 400 perles et cristaux sertis à la main avec du fil de soie ciré haute résistance.",
        careGuidance: "Conserver à plat dans sa boîte d'atelier capitonnée de soie avant port.",
      },
      {
        id: 302,
        indexLabel: "02",
        productId: 14,
        x: 50,
        y: 50,
        partLabel: "Ceinture & Galbe",
        zoneTitle: "Soie Mikado Impériale & Passementerie d'Or",
        materialNote: "Mikado de soie pure (Italie) · Passementerie orfèvre",
        archiveRef: "PRESTIGE / CEI-02",
        craftOrigin: "Façonnage et Cintrage Sur-Mesure",
        techSpec: "Agrafes Couture Invisibles Doublées",
        weightSpec: "Maintien Sculptural & Souple",
        stylingNote:
          "La ceinture souligne la taille tout en structurant la transition entre le bustier perlé et le volume généreux de la jupe.",
        materialName: "Soie Mikado Impériale & Galon Tressé d'Or",
        countryOrigin: "Italie (Lombardie, Lac de Côme)",
        countryFlag: "🇮🇹",
        atelierName: "Setificio Reale di Como",
        composition: "100% Soie Mikado à armure diagonale lourde (280 g/m²)",
        textureTouch: "Grain ferme et structuré, offrant une tenue architecturale incomparable.",
        lightReflect: "Reflet semi-mat poudré très noble et distingué.",
        durabilityBreathability: "Rigidité noble naturelle sans renfort cartonné synthétique.",
        whySpecial:
          "La soie Mikado est la reine des étoffes de cour : sa structure sergée serée lui confère un maintien tridimensionnel sans équivalent dans le monde textile. Elle galbe le ventre et les hanches tout en restant légère et respirante.",
        artisanSecret: "Entoilage au crin de cheval naturel traditionnel pour une tenue perpétuelle.",
        careGuidance: "Repassage à sec sur l'envers uniquement avec pattemouille.",
      },
      {
        id: 303,
        indexLabel: "03",
        productId: 16,
        x: 52,
        y: 76,
        partLabel: "Jupe & Panneaux",
        zoneTitle: "Tulle Aérien Plissé Soleil & Soie Végétale",
        materialNote: "Voile de soie et tulle de Lyon (France) · Finition orfèvre",
        archiveRef: "PRESTIGE / PAN-03",
        craftOrigin: "Assemblage et Plissage Traditionnel au Carton",
        techSpec: "Tombé Symétrique Haut Volume",
        weightSpec: "Finitions Biais de Soie Pure",
        stylingNote:
          "Les panneaux s'ouvrent avec grâce à chaque pas, dévoilant la finesse des motifs jusqu'au bas de la robe.",
        materialName: "Tulle de Soie Aérien & Crêpe Plissé Soleil",
        countryOrigin: "France (Auvergne-Rhône-Alpes)",
        countryFlag: "🇫🇷",
        atelierName: "Atelier Plisseur d'Art de Paris & Lyon",
        composition: "70% Tulle de Soie d'élevage · 30% Mousseline légère de soie",
        textureTouch: "Volutes d'air d'une légèreté presque immatérielle.",
        lightReflect: "Transparence délicate laissant transparaître la couleur profonde de la doublure de soie.",
        durabilityBreathability: "Aération maximale permettant une aisance totale durant les danses.",
        whySpecial:
          "Le plissé soleil de cette jupe est réalisé à l'aide de moules en carton kraft fabriqués à la main et passés à l'étuve de vapeur. Les plis s'évasent en éventail de la taille jusqu'à l'ourlet, créant un volume royal sans jamais alourdir la silhouette.",
        artisanSecret: "Montage des panneaux en biais pour que chaque pli s'ouvre comme une aile d'oiseau lors de la marche.",
        careGuidance: "Ne jamais repasser les plis directement : utiliser un défroisseur vapeur vertical à distance.",
      },
    ],
  },
]

interface FlagshipStudio {
  id: number
  index: string
  code: string
  city: string
  district: string
  address: string
  architect: string
  surface: string
  coordinates: string
  localTime: string
  hours: string
  image: string
  materials: string
  spaces: string[]
}

const FLAGSHIP_STUDIOS: FlagshipStudio[] = [
  {
    id: 1,
    index: "01",
    code: "ESQ",
    city: "Esquisse & Style",
    district: "Étape 01 · Rencontre & Dessin de votre Robe",
    address: "Écoute de vos envies, étude de votre morphologie et création du croquis original",
    architect: "Consultation Créative Privée",
    surface: "1h30 Dédiée",
    coordinates: "CROQUIS ORIGINAL",
    localTime: "ÉTAPE 1 / 5",
    hours: "Choix de la coupe & du décolleté",
    image: "/couture/wedding15.webp",
    materials: "Carnet d'échantillons : Satin duchesse, Crêpe de soie, Dentelle de Calais & Organza",
    spaces: ["Croquis personnalisé", "Conseil morphologique", "Sélection des étoffes"],
  },
  {
    id: 2,
    index: "02",
    code: "MES",
    city: "Prise de Mesures",
    district: "Étape 02 · Patronage Individuel Haute Précision",
    address: "Relevé anatomique complet et tracé d'un patron unique exclusivement à vos mesures",
    architect: "Modélisme Sur-Mesure",
    surface: "28 Points de Mesure",
    coordinates: "PATRON INDIVIDUEL",
    localTime: "ÉTAPE 2 / 5",
    hours: "Tracé & coupe de la toile d'essai",
    image: "/couture/other-robes23.webp",
    materials: "Toile de coton écrue, papier kraft d'atelier, règles courbes de modéliste & ruban couture",
    spaces: ["Relevé en 28 points", "Patron sur-mesure", "Équilibrage des volumes"],
  },
  {
    id: 3,
    index: "03",
    code: "COU",
    city: "Coupe & Moulage",
    district: "Étape 03 · Sculpture du Tissu sur Mannequin",
    address: "Premier essayage de la toile puis coupe dans les tissus nobles et montage du bustier",
    architect: "Savoir-Faire Tailleur & Flou",
    surface: "Montage Main",
    coordinates: "SCULPTURE SUR BUSTE",
    localTime: "ÉTAPE 3 / 5",
    hours: "Ajustement du galbe & du tombé",
    image: "/couture/other-robes24.webp",
    materials: "Baleinage souple en spirale, entoilage organza de soie, fil de bâti & épingles fines",
    spaces: ["Premier essayage", "Baleinage du bustier", "Drapé en plein biais"],
  },
  {
    id: 4,
    index: "04",
    code: "BRO",
    city: "Dentelle & Perlage",
    district: "Étape 04 · Ennoblissement & Broderie Main",
    address: "Pose minutieuse des dentelles incrustées, perles de cristal et finitions invisibles",
    architect: "Haute Broderie d'Atelier",
    surface: "30 à 60h de Main",
    coordinates: "FINITIONS PRÉCIEUSES",
    localTime: "ÉTAPE 4 / 5",
    hours: "Second essayage & ornementation",
    image: "/couture/other-robes25.webp",
    materials: "Dentelle rebrodée, perles de rocaille, cristaux, boutons recouverts de soie & fil invisible",
    spaces: ["Incrustation dentelle", "Perlage point par point", "Ourlet roulotté main"],
  },
  {
    id: 5,
    index: "05",
    code: "ESS",
    city: "Essayage Final",
    district: "Étape 05 · Sublimation & Remise de votre Création",
    address: "Validation finale avec vos chaussures et accessoires, pressage vapeur et remise sous housse",
    architect: "Cérémonie de Livraison",
    surface: "Ajustement 100%",
    coordinates: "PRÊTE POUR LE JOUR J",
    localTime: "ÉTAPE 5 / 5",
    hours: "Vérification finale & remise écrin",
    image: "/couture/other-robes26.webp",
    materials: "Pressage vapeur douce, papier de soie sans acide & housse respirante Haute Couture",
    spaces: ["Essayage avec accessoires", "Réglage de la traîne", "Housse couture offerte"],
  },
]

interface CraftCallout {
  code: string
  x: number
  y: number
  title: string
  spec: string
}

interface CraftBenchmark {
  label: string
  value: string
  fillPercent: number
}

interface CraftAnatomyLayer {
  id: number
  index: string
  tabTitle: string
  tabSub: string
  code: string
  title: string
  serifSubtitle: string
  labLocation: string
  surfaceLabel: string
  blueprintLabel: string
  surfaceImage: string
  blueprintImage: string
  description: string
  protocolNote: string
  callouts: CraftCallout[]
  benchmarks: CraftBenchmark[]
  specs: {
    norm: string
    tolerance: string
    lifespan: string
  }
}

const CRAFT_ANATOMY_LAYERS: CraftAnatomyLayer[] = [
  {
    id: 1,
    index: "01",
    tabTitle: "Dentelle & Perlage",
    tabSub: "Dentelle de Calais & Broderie Main",
    code: "SECRET 01 — ORNEMENTATION & TRANSPARENCE",
    title: "Dentelle Incrustée & Tulle Illusion",
    serifSubtitle: "Finesse Florale — Zéro Couture Apparente",
    labLocation: "Table de Broderie · Travail à l'Aiguille Fine",
    surfaceLabel: "VUE MARIÉE · DENTELLE & ÉCLAT",
    blueprintLabel: "VUE ATELIER · PLACEMENT & INCRUSTATION",
    surfaceImage: "/couture/wedding16.webp",
    blueprintImage: "/couture/other-robes27.webp",
    description:
      "Chaque motif de dentelle est découpé à la main suivant le dessin des fleurs, épinglé directement sur mannequin puis cousu à points glissés invisibles sur un tulle illusion seconde peau.",
    protocolNote:
      "Nos perles et cristaux sont fixés individuellement avec un point d'arrêt noué tous les trois rangs, garantissant une tenue irréprochable tout au long de votre événement.",
    callouts: [
      {
        code: "D1",
        x: 32,
        y: 32,
        title: "Tulle Illusion Seconde Peau",
        spec: "Maille hexagonale ultra-fine · Maintien invisible du décolleté",
      },
      {
        code: "D2",
        x: 54,
        y: 52,
        title: "Incrustation de Guipure & Calais",
        spec: "Découpe florale aux ciseaux · Point de bourdon main",
      },
      {
        code: "D3",
        x: 68,
        y: 74,
        title: "Perlage & Cristaux Scellés",
        spec: "Fil de soie ciré · Reflets doux sous lumière naturelle et soirée",
      },
    ],
    benchmarks: [
      { label: "TRAVAIL DE FINITION À LA MAIN", value: "100%", fillPercent: 100 },
      { label: "LÉGÈRETÉ & DOUCEUR SUR LA PEAU", value: "98.5%", fillPercent: 98 },
      { label: "TENUE DES BRODERIES & PERLES", value: "99.4%", fillPercent: 99 },
    ],
    specs: {
      norm: "Dentelle & Soie Choisies",
      tolerance: "Point Invisible < 1 mm",
      lifespan: "Conservation Héritage",
    },
  },
  {
    id: 2,
    index: "02",
    tabTitle: "Corseterie & Bustier",
    tabSub: "Baleinage Souple & Satin Duchesse",
    code: "SECRET 02 — ARCHITECTURE DU BUSTE",
    title: "Bustier Sculptant & Maintien Doux",
    serifSubtitle: "Galbe Parfait — Liberté de Mouvement",
    labLocation: "Atelier Corseterie · Moulage sur Buste",
    surfaceLabel: "LIGNE EXTERNE · GALBE & DRAPÉ",
    blueprintLabel: "CONSTRUCTION INTERNE · BALEINAGE & SOIE",
    surfaceImage: "/couture/other-robes28.webp",
    blueprintImage: "/couture/other-robes29.webp",
    description:
      "À l'intérieur de nos robes de mariée et de gala se cache une véritable architecture de corseterie : entoilage en coton de soie, baleines souples en spirale et ceinture interne de maintien.",
    protocolNote:
      "Grâce à la ceinture de taille interne (gros-grain couture), le poids de la jupe repose sur les hanches et non sur les épaules, offrant une sensation de légèreté incomparable.",
    callouts: [
      {
        code: "C1",
        x: 36,
        y: 36,
        title: "Bonnets & Galbe Sur-Mesure",
        spec: "Moulés selon vos mesures · Aucun besoin de soutien-gorge",
      },
      {
        code: "C2",
        x: 52,
        y: 56,
        title: "Baleines Spirales Souples",
        spec: "Maintien vertical sans rigidité · Suit chaque respiration",
      },
      {
        code: "C3",
        x: 70,
        y: 74,
        title: "Doublure Pongé de Soie",
        spec: "Coutures rabattues vers l'intérieur · Zéro irritation",
      },
    ],
    benchmarks: [
      { label: "MAINTIEN SANS BRETELLES", value: "99.2%", fillPercent: 99 },
      { label: "CONFORT ASSIS & EN DANSE", value: "97.8%", fillPercent: 98 },
      { label: "PRÉCISION DU CINTRAGE TAILLE", value: "Sur-Mesure", fillPercent: 100 },
    ],
    specs: {
      norm: "Corseterie d'Art",
      tolerance: "Ajustement ± 1 mm",
      lifespan: "Maintien Toute la Nuit",
    },
  },
  {
    id: 3,
    index: "03",
    tabTitle: "Drapé & Volumétrie",
    tabSub: "Coupe en Biais & Ourlet Roulotté",
    code: "SECRET 03 — FLUIDITÉ & MOUVEMENT",
    title: "Architecture des Jupes & Traînes",
    serifSubtitle: "Tombé Aérien — Amplitude Royale",
    labLocation: "Table de Coupe · Travail du Plein Biais",
    surfaceLabel: "TOMBÉ EN MOUVEMENT · FLUIDITÉ SOIE",
    blueprintLabel: "SUPERPOSITION · JUPONS & GODETS",
    surfaceImage: "/couture/other-robes30.webp",
    blueprintImage: "/couture/other-robes31.webp",
    description:
      "Pour obtenir un tombé fluide qui ondule à chaque pas, nos jupes associent la coupe à 45° dans le plein biais du tissu et une superposition savante de mousseline, d'organza et de crin souple.",
    protocolNote:
      "Chaque robe à grand volume est suspendue sur mannequin pendant 48 heures avant l'ourlet final afin que le biais de la soie prenne son tombé définitif.",
    callouts: [
      {
        code: "V1",
        x: 34,
        y: 34,
        title: "Coupe à 45° en Plein Biais",
        spec: "Élasticité naturelle du tissage · Épouse les hanches sans pli",
      },
      {
        code: "V2",
        x: 54,
        y: 56,
        title: "Superposition Multi-Voiles",
        spec: "Jeu d'opacité et de lumière entre satin et mousseline",
      },
      {
        code: "V3",
        x: 70,
        y: 78,
        title: "Ourlet Roulotté & Crin Souple",
        spec: "Maintien de la corolle en bas de jupe · Finition main",
      },
    ],
    benchmarks: [
      { label: "FLUIDITÉ DU TOMBÉ EN MARCHE", value: "99.5%", fillPercent: 99 },
      { label: "RÉSISTANCE AU FROISSEMENT", value: "94.0%", fillPercent: 94 },
      { label: "ÉQUILIBRE DE LA TRAÎNE", value: "100%", fillPercent: 100 },
    ],
    specs: {
      norm: "Coupe Plein Biais",
      tolerance: "Ourlet Nivelé Laser",
      lifespan: "Attache-Traîne Intégré",
    },
  },
]

interface CraftCounterItem {
  id: number
  index: string
  target: number
  decimals: number
  prefix: string
  suffix: string
  label: string
  detail: string
}

const CRAFT_COUNTERS: CraftCounterItem[] = [
  {
    id: 1,
    index: "01",
    target: 100,
    decimals: 0,
    prefix: "",
    suffix: "%",
    label: "Confection Sur-Mesure & Finitions Main",
    detail: "Chaque robe est coupée et assemblée individuellement selon les mesures exactes de notre cliente.",
  },
  {
    id: 2,
    index: "02",
    target: 3,
    decimals: 0,
    prefix: "",
    suffix: " RDV",
    label: "Séances d'Essayage Privatisées",
    detail: "Un accompagnement attentif de la première toile jusqu'à l'ajustement final avec vos accessoires.",
  },
  {
    id: 3,
    index: "03",
    target: 4.9,
    decimals: 1,
    prefix: "",
    suffix: "/5",
    label: "Satisfaction des Mariées & Clientes",
    detail: "Note moyenne attribuée pour la qualité du tombé, le confort du bustier et le respect des délais.",
  },
  {
    id: 4,
    index: "04",
    target: 180,
    decimals: 0,
    prefix: "+",
    suffix: "",
    label: "Créations Exclusives Réalisées",
    detail: "Robes de mariée, de gala, de fiançailles et de cortège façonnées avec passion à l'atelier.",
  },
]

class MzaCarousel {
  root: HTMLElement
  viewport: HTMLElement
  track: HTMLElement
  slides: HTMLElement[]
  prevBtn: HTMLElement | null
  nextBtn: HTMLElement | null
  pagination: HTMLElement | null
  progressBar: HTMLElement | null
  isFF: boolean
  n: number
  state: any
  opts: any
  slideW: number = 0
  ro: ResizeObserver | null = null
  dots: HTMLButtonElement[] = []

  constructor(root: HTMLElement, opts = {}) {
    this.root = root
    this.viewport = root.querySelector(".mzaCarousel-viewport") as HTMLElement
    this.track = root.querySelector(".mzaCarousel-track") as HTMLElement
    this.slides = Array.from(root.querySelectorAll(".mzaCarousel-slide")) as HTMLElement[]
    this.prevBtn = root.querySelector(".mzaCarousel-prev")
    this.nextBtn = root.querySelector(".mzaCarousel-next")
    this.pagination = root.querySelector(".mzaCarousel-pagination")
    this.progressBar = root.querySelector(".mzaCarousel-progressBar")
    this.isFF = typeof (window as any).InstallTrigger !== "undefined"
    this.n = this.slides.length
    this.state = {
      index: 0,
      pos: 0,
      width: 0,
      height: 0,
      gap: 28,
      dragging: false,
      pointerId: null,
      x0: 0,
      v: 0,
      t0: 0,
      animating: false,
      hovering: false,
      startTime: 0,
      pausedAt: 0,
      rafId: 0,
    }
    this.opts = Object.assign(
      {
        gap: 28,
        peek: 0.15,
        rotateY: 34,
        zDepth: 150,
        scaleDrop: 0.09,
        blurMax: 2.0,
        activeLeftBias: 0.12,
        interval: 4500,
        transitionMs: 900,
        keyboard: true,
        breakpoints: [
          {
            mq: "(max-width: 1200px)",
            gap: 24,
            peek: 0.12,
            rotateY: 28,
            zDepth: 120,
            scaleDrop: 0.08,
            activeLeftBias: 0.1,
          },
          {
            mq: "(max-width: 1000px)",
            gap: 18,
            peek: 0.09,
            rotateY: 22,
            zDepth: 90,
            scaleDrop: 0.07,
            activeLeftBias: 0.09,
          },
          {
            mq: "(max-width: 768px)",
            gap: 14,
            peek: 0.06,
            rotateY: 16,
            zDepth: 70,
            scaleDrop: 0.06,
            activeLeftBias: 0.08,
          },
          {
            mq: "(max-width: 560px)",
            gap: 12,
            peek: 0.05,
            rotateY: 12,
            zDepth: 60,
            scaleDrop: 0.05,
            activeLeftBias: 0.07,
          },
        ],
      },
      opts,
    )
    if (this.isFF) {
      this.opts.rotateY = 10
      this.opts.zDepth = 0
      this.opts.blurMax = 0
    }
    this._init()
  }

  destroy() {
    if (this.state.rafId) cancelAnimationFrame(this.state.rafId)
    if (this.ro) this.ro.disconnect()
  }

  _init() {
    this._setupDots()
    this._bind()
    this._preloadImages()
    this._measure()
    this.goTo(0, false)
    this._startCycle()
    this._loop()
  }

  _preloadImages() {
    this.slides.forEach((sl) => {
      const card = sl.querySelector(".mzaCard")
      if (!card) return
      const bg = getComputedStyle(card).getPropertyValue("--mzaCard-bg")
      const m = /url\((?:'|")?([^'")]+)(?:'|")?\)/.exec(bg)
      if (m && m[1]) {
        const img = new Image()
        img.src = m[1]
      }
    })
  }

  _setupDots() {
    if (!this.pagination) return
    this.pagination.innerHTML = ""
    this.dots = this.slides.map((_, i) => {
      const b = document.createElement("button")
      b.type = "button"
      b.className = "mzaCarousel-dot"
      b.setAttribute("role", "tab")
      b.setAttribute("aria-label", `Go to slide ${i + 1}`)
      b.addEventListener("click", () => {
        this.goTo(i)
      })
      this.pagination!.appendChild(b)
      return b
    })
  }

  _bind() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        this.prev()
      })
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        this.next()
      })
    }
    if (this.opts.keyboard) {
      this.root.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") this.prev()
        if (e.key === "ArrowRight") this.next()
      })
    }
    const pe = this.viewport
    if (pe) {
      pe.addEventListener("pointerdown", (e: PointerEvent) => this._onDragStart(e))
      pe.addEventListener("pointermove", (e: PointerEvent) => this._onDragMove(e))
      pe.addEventListener("pointerup", (e: PointerEvent) => this._onDragEnd(e))
      pe.addEventListener("pointercancel", (e: PointerEvent) => this._onDragEnd(e))
      pe.addEventListener("pointermove", (e: PointerEvent) => this._onTilt(e))
    }
    this.root.addEventListener("mouseenter", () => {
      this.state.hovering = true
      this.state.pausedAt = performance.now()
    })
    this.root.addEventListener("mouseleave", () => {
      if (this.state.pausedAt) {
        this.state.startTime += performance.now() - this.state.pausedAt
        this.state.pausedAt = 0
      }
      this.state.hovering = false
    })
    this.ro = new ResizeObserver(() => this._measure())
    if (this.viewport) this.ro.observe(this.viewport)

    this.opts.breakpoints.forEach((bp: any) => {
      const m = window.matchMedia(bp.mq)
      const apply = () => {
        Object.keys(bp).forEach((k) => {
          if (k !== "mq") this.opts[k] = bp[k]
        })
        this._measure()
        this._render()
      }
      if (m.addEventListener) m.addEventListener("change", apply)
      else m.addListener(apply)
      if (m.matches) apply()
    })
  }

  _measure() {
    if (!this.viewport || !this.root) return
    const viewRect = this.viewport.getBoundingClientRect()
    const rootRect = this.root.getBoundingClientRect()
    const pagRect = this.pagination ? this.pagination.getBoundingClientRect() : { height: 40, bottom: rootRect.bottom }
    const bottomGap = Math.max(
      12,
      Math.round(rootRect.bottom - pagRect.bottom)
    )
    const pagSpace = pagRect.height + bottomGap
    const availH = viewRect.height - pagSpace
    const cardH = Math.max(320, Math.min(640, Math.round(availH)))
    this.state.width = viewRect.width
    this.state.height = viewRect.height
    this.state.gap = this.opts.gap
    this.slideW = Math.min(880, this.state.width * (1 - this.opts.peek * 2))
    this.root.style.setProperty("--mzaPagH", `${pagSpace}px`)
    this.root.style.setProperty("--mzaCardH", `${cardH}px`)
  }

  _tiltRaf: number = 0

  _onTilt(e: PointerEvent) {
    if (!this.viewport) return
    const r = this.viewport.getBoundingClientRect()
    const mx = (e.clientX - r.left) / r.width - 0.5
    const my = (e.clientY - r.top) / r.height - 0.5
    this.root.style.setProperty("--mzaTiltX", (my * -6).toFixed(3))
    this.root.style.setProperty("--mzaTiltY", (mx * 6).toFixed(3))
    if (!this.viewport || this.state.animating || this.state.dragging) return
    if (this._tiltRaf) return
    const clientX = e.clientX
    const clientY = e.clientY
    this._tiltRaf = requestAnimationFrame(() => {
      this._tiltRaf = 0
      if (!this.viewport) return
      const r = this.viewport.getBoundingClientRect()
      const mx = (clientX - r.left) / r.width - 0.5
      const my = (clientY - r.top) / r.height - 0.5
      this.root.style.setProperty("--mzaTiltX", (my * -4).toFixed(2))
      this.root.style.setProperty("--mzaTiltY", (mx * 4).toFixed(2))
    })
  }

  _onDragStart(e: PointerEvent) {
    if (e.pointerType === "mouse" && e.button !== 0) return
    e.preventDefault()
    this.state.dragging = true
    this.state.pointerId = e.pointerId
    this.viewport.setPointerCapture(e.pointerId)
    this.state.x0 = e.clientX
    this.state.t0 = performance.now()
    this.state.v = 0
    this.state.pausedAt = performance.now()
  }

  _onDragMove(e: PointerEvent) {
    if (!this.state.dragging || e.pointerId !== this.state.pointerId) return
    const dx = e.clientX - this.state.x0
    const dt = Math.max(16, performance.now() - this.state.t0)
    this.state.v = dx / dt
    const slideSpan = this.slideW + this.state.gap
    this.state.pos = this._mod(this.state.index - dx / slideSpan, this.n)
    this._render()
  }

  _onDragEnd(e?: PointerEvent) {
    if (!this.state.dragging || (e && e.pointerId !== this.state.pointerId))
      return
    this.state.dragging = false
    try {
      if (this.state.pointerId != null)
        this.viewport.releasePointerCapture(this.state.pointerId)
    } catch {}
    this.state.pointerId = null
    if (this.state.pausedAt) {
      this.state.startTime += performance.now() - this.state.pausedAt
      this.state.pausedAt = 0
    }
    const v = this.state.v
    const threshold = 0.18
    let target = Math.round(
      this.state.pos - Math.sign(v) * (Math.abs(v) > threshold ? 0.5 : 0)
    )
    this.goTo(this._mod(target, this.n))
  }

  _startCycle() {
    this.state.startTime = performance.now()
    this._renderProgress(0)
  }

  _loop() {
    const step = (t: number) => {
      if (
        !this.state.dragging &&
        !this.state.hovering &&
        !this.state.animating
      ) {
        const elapsed = t - this.state.startTime
        const p = Math.min(1, elapsed / this.opts.interval)
        this._renderProgress(p)
        if (elapsed >= this.opts.interval) this.next()
      }
      this.state.rafId = requestAnimationFrame(step)
    }
    this.state.rafId = requestAnimationFrame(step)
  }

  _renderProgress(p: number) {
    if (this.progressBar) {
      this.progressBar.style.transform = `scaleX(${p})`
    }
  }

  prev() {
    this.goTo(this._mod(this.state.index - 1, this.n))
  }

  next() {
    this.goTo(this._mod(this.state.index + 1, this.n))
  }

  goTo(i: number, animate = true) {
    const start = this.state.pos || this.state.index
    const end = this._nearest(start, i)
    const dur = animate ? this.opts.transitionMs : 0
    const t0 = performance.now()
    const ease = (x: number) => 1 - Math.pow(1 - x, 3)
    this.state.animating = true
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur)
      const p = dur ? ease(t) : 1
      this.state.pos = start + (end - start) * p
      this._render()
      if (t < 1) requestAnimationFrame(step)
      else this._afterSnap(i)
    }
    requestAnimationFrame(step)
  }

  _afterSnap(i: number) {
    this.state.index = this._mod(Math.round(this.state.pos), this.n)
    this.state.pos = this.state.index
    this.state.animating = false
    this._render(true)
    this._startCycle()
  }

  _nearest(from: number, target: number) {
    let d = target - Math.round(from)
    if (d > this.n / 2) d -= this.n
    if (d < -this.n / 2) d += this.n
    return Math.round(from) + d
  }

  _mod(i: number, n: number) {
    return ((i % n) + n) % n
  }

  _render(markActive = false) {
    const span = this.slideW + this.state.gap
    const tiltX = parseFloat(
      this.root.style.getPropertyValue("--mzaTiltX") || "0"
    )
    const tiltY = parseFloat(
      this.root.style.getPropertyValue("--mzaTiltY") || "0"
    )
    for (let i = 0; i < this.n; i++) {
      let d = i - this.state.pos
      if (d > this.n / 2) d -= this.n
      if (d < -this.n / 2) d += this.n
      const absD = Math.abs(d)
      const s = this.slides[i]
      if (!s) continue

      // Cull far offscreen slides to eliminate offscreen rendering overhead
      if (absD > 2.8) {
        s.style.display = "none"
        continue
      } else {
        s.style.display = "grid"
      }

      const weight = Math.max(0, 1 - absD * 2)
      const biasActive = -this.slideW * this.opts.activeLeftBias * weight
      const tx = d * span + biasActive
      const depth = -absD * this.opts.zDepth
      const rot = -d * this.opts.rotateY
      const scale = 1 - Math.min(absD * this.opts.scaleDrop, 0.42)
      const z = Math.round(1000 - absD * 10)

      s.style.transform = `translate3d(${tx}px,-50%,${depth}px) rotateY(${rot}deg) scale(${scale})`
      s.style.zIndex = z.toString()
      if (markActive)
        s.dataset.state =
          Math.round(this.state.index) === i ? "active" : "rest"

      if (absD <= 1.5) {
        const card = s.querySelector(".mzaCard") as HTMLElement
        if (!card) continue
        const parBase = Math.max(-1, Math.min(1, -d))
        const parX = parBase * 48 + tiltY * 2.0
        const parY = tiltX * -1.5
        const bgX = parBase * -64 + tiltY * -2.4
        card.style.setProperty("--mzaParX", `${parX.toFixed(1)}px`)
        card.style.setProperty("--mzaParY", `${parY.toFixed(1)}px`)
        card.style.setProperty("--mzaParBgX", `${bgX.toFixed(1)}px`)
        card.style.setProperty("--mzaParBgY", `${(parY * 0.35).toFixed(1)}px`)
      }
    }
    const active = this._mod(Math.round(this.state.pos), this.n)
    this.dots.forEach((d, i) =>
      d.setAttribute("aria-selected", i === active ? "true" : "false")
    )
  }
}

export default function Home() {
  const container = useRef<HTMLDivElement>(null)
  const productGridRef = useRef<HTMLDivElement>(null)
  const segmentedNavRef = useRef<HTMLDivElement>(null)
  const trendingTabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [trendingGlider, setTrendingGlider] = useState<{ left: number; width: number }>({
    left: 6,
    width: 110,
  })
  const [k, setK] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedMaterialHotspot, setSelectedMaterialHotspot] = useState<LookbookHotspot | null>(null)
  const [productModalOrigin, setProductModalOrigin] = useState<{
    left: number
    top: number
    width: number
    height: number
    sourceEl: HTMLElement | null
  } | null>(null)
  const [bookedFittingIds, setBookedFittingIds] = useState<number[]>([])
  const productModalBackdropRef = useRef<HTMLDivElement>(null)
  const productModalCardRef = useRef<HTMLDivElement>(null)
  const productModalImageColRef = useRef<HTMLDivElement>(null)
  const productModalImgRef = useRef<HTMLImageElement>(null)
  const productModalDetailsColRef = useRef<HTMLDivElement>(null)
  const isProductModalClosingRef = useRef<boolean>(false)
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number>(0)
  const [showAllProducts, setShowAllProducts] = useState<boolean>(false)
  const [activeTestimonialId, setActiveTestimonialId] = useState<number>(1)
  const [activeExclusiveIdx, setActiveExclusiveIdx] = useState<number>(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const currentCategory = DRESS_CATEGORIES[activeCategoryIdx] || DRESS_CATEGORIES[0]
  const activeTrendingTab = showAllProducts ? DRESS_CATEGORIES.length : activeCategoryIdx
  const displayedProducts = showAllProducts
    ? products
    : products.filter((p) => p.categoryKey === currentCategory.key)

  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([])
  const [likedWhyCards, setLikedWhyCards] = useState<number[]>([])
  const [selectedWhyModal, setSelectedWhyModal] = useState<{
    card: WhyChooseCard
    originRect: { left: number; top: number; width: number; height: number }
    sourceEl: HTMLElement | null
  } | null>(null)
  const [selectedWhySlot, setSelectedWhySlot] = useState<string>("")
  const [bookedWhySessions, setBookedWhySessions] = useState<number[]>([])
  const whyModalBackdropRef = useRef<HTMLDivElement>(null)
  const whyModalCardRef = useRef<HTMLDivElement>(null)
  const whyModalImageColRef = useRef<HTMLDivElement>(null)
  const whyModalImgRef = useRef<HTMLImageElement>(null)
  const whyModalRightColRef = useRef<HTMLDivElement>(null)
  const isWhyModalClosingRef = useRef<boolean>(false)

  // Why Choose / Sur-Mesure appointment state
  const [whyClientName, setWhyClientName] = useState<string>("")
  const [whyClientEmail, setWhyClientEmail] = useState<string>("")
  const [whySelectedDate, setWhySelectedDate] = useState<Date | null>(() => {
    const d = new Date()
    d.setDate(d.getDate() + 5)
    return d
  })
  const [whySelectedTime, setWhySelectedTime] = useState<string>("11:00")
  const [isWhyDatePickerOpen, setIsWhyDatePickerOpen] = useState<boolean>(false)
  const [isWhyTimePickerOpen, setIsWhyTimePickerOpen] = useState<boolean>(false)
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())
  const [whyGlider, setWhyGlider] = useState<{ left: number; width: number }>({ left: 0, width: 85 })
  const whyTabsNavRef = useRef<HTMLDivElement>(null)
  const whyTabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const whyDateDropdownRef = useRef<HTMLDivElement>(null)
  const whyTimeDropdownRef = useRef<HTMLDivElement>(null)

  // Salons Privés & Défilés event registration state
  const [eventClientName, setEventClientName] = useState<string>("")
  const [eventClientEmail, setEventClientEmail] = useState<string>("")
  const [eventClientPhone, setEventClientPhone] = useState<string>("")
  const [eventGuestsCount, setEventGuestsCount] = useState<number>(1)

  // Fermer les sélecteurs date / heure personnalisés lors d'un clic extérieur
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        whyDateDropdownRef.current &&
        !whyDateDropdownRef.current.contains(e.target as Node)
      ) {
        setIsWhyDatePickerOpen(false)
      }
      if (
        whyTimeDropdownRef.current &&
        !whyTimeDropdownRef.current.contains(e.target as Node)
      ) {
        setIsWhyTimePickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  // Mesure dynamique et coulissage fluide de l'onglet créneau dans le popup Sur-Mesure
  useEffect(() => {
    if (!selectedWhyModal) return
    const slots = selectedWhyModal.card.slots
    const idx = slots.indexOf(selectedWhySlot) >= 0 ? slots.indexOf(selectedWhySlot) : 0
    const activeBtn = whyTabRefs.current[idx]
    const navEl = whyTabsNavRef.current
    if (activeBtn && navEl) {
      const btnRect = activeBtn.getBoundingClientRect()
      const navRect = navEl.getBoundingClientRect()
      setWhyGlider({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      })
    }
  }, [selectedWhySlot, selectedWhyModal])
  const [leftTextOpacity, setLeftTextOpacity] = useState<number>(1)
  const eventsScrollRef = useRef<HTMLDivElement>(null)
  const [activeLookIdx, setActiveLookIdx] = useState<number>(0)
  const [activeHotspotIdx, setActiveHotspotIdx] = useState<number>(0)
  const [activeStudioId, setActiveStudioId] = useState<number>(1)
  const [reservedStudioVisits, setReservedStudioVisits] = useState<number[]>([])
  const [quickAddedLookbookItems, setQuickAddedLookbookItems] = useState<number[]>([])
  const [activeCraftLayerIdx, setActiveCraftLayerIdx] = useState<number>(0)
  const [craftSliderPos, setCraftSliderPos] = useState<number>(52)
  const [activeCraftCalloutIdx, setActiveCraftCalloutIdx] = useState<number>(0)
  const isDraggingCraftRef = useRef<boolean>(false)
  const craftComparatorRef = useRef<HTMLDivElement>(null)

  const currentCraftLayer = CRAFT_ANATOMY_LAYERS[activeCraftLayerIdx] || CRAFT_ANATOMY_LAYERS[0]

  const updateCraftSliderFromClientX = (clientX: number) => {
    const el = craftComparatorRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0) return
    const rawPct = ((clientX - rect.left) / rect.width) * 100
    const clamped = Math.max(6, Math.min(94, rawPct))
    setCraftSliderPos(clamped)
  }

  const currentLook = LOOKBOOK_SILHOUETTES[activeLookIdx] || LOOKBOOK_SILHOUETTES[0]
  const currentHotspot = currentLook.hotspots[activeHotspotIdx] || currentLook.hotspots[0]
  const currentHotspotProduct =
    products.find((p) => p.id === currentHotspot.productId) || products[0]

  const activeTestimonial = testimonials.find((t) => t.id === activeTestimonialId) || testimonials[0]
  const n = CAROUSEL_SHOES.length

  useEffect(() => {
    if (selectedProduct || selectedEvent || selectedMaterialHotspot) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedProduct, selectedEvent, selectedMaterialHotspot])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedMaterialHotspot) {
        setSelectedMaterialHotspot(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedMaterialHotspot])

  const openWhyCardModal = (card: WhyChooseCard, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    const cardEl = (e.currentTarget as HTMLElement).closest(".why-choose-card-item") as HTMLElement | null
    if (cardEl) {
      cardEl.classList.add("why-card-modal-active")
    }
    const rect = cardEl
      ? cardEl.getBoundingClientRect()
      : {
          left: window.innerWidth / 2 - 245,
          top: window.innerHeight / 2 - 345,
          width: 490,
          height: 690,
        }
    isWhyModalClosingRef.current = false
    setSelectedWhySlot(card.slots[0] || "")
    setSelectedWhyModal({
      card,
      originRect: {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      },
      sourceEl: cardEl,
    })
  }

  const closeWhyCardModal = () => {
    if (!selectedWhyModal || isWhyModalClosingRef.current) return
    isWhyModalClosingRef.current = true

    const { originRect, sourceEl } = selectedWhyModal
    const liveRect = sourceEl ? sourceEl.getBoundingClientRect() : originRect
    const backdropEl = whyModalBackdropRef.current
    const popupEl = whyModalCardRef.current
    const imageColEl = whyModalImageColRef.current
    const imgEl = whyModalImgRef.current
    const rightColEl = whyModalRightColRef.current

    if (!popupEl || !imageColEl || !backdropEl) {
      if (sourceEl) {
        gsap.set(sourceEl, { autoAlpha: 1, pointerEvents: "auto" })
        sourceEl.classList.remove("why-card-modal-active")
      }
      setSelectedWhyModal(null)
      isWhyModalClosingRef.current = false
      return
    }

    const imgBadge = popupEl.querySelector(".why-modal-img-floating-badge")
    const closeBtn = popupEl.querySelector(".why-modal-close-btn")

    const closeTl = gsap.timeline({
      onComplete: () => {
        if (sourceEl) {
          gsap.set(sourceEl, { autoAlpha: 1, pointerEvents: "auto" })
          // Trigger smooth CSS clip-path retraction back to resting card state
          requestAnimationFrame(() => {
            sourceEl.classList.remove("why-card-modal-active")
          })
        }
        setSelectedWhyModal(null)
        isWhyModalClosingRef.current = false
      },
    })

    // 1. Immediately fade out right-side content & floating controls (0s delay)
    closeTl.to(
      [rightColEl, imgBadge, closeBtn].filter(Boolean),
      {
        opacity: 0,
        duration: 0.18,
        ease: "power2.out",
      },
      0
    )

    // 2. Immediately glide popup & image back to exact parent card coordinates (0s delay)
    closeTl.to(
      popupEl,
      {
        left: liveRect.left,
        top: liveRect.top,
        width: liveRect.width,
        height: liveRect.height,
        borderRadius: "44px",
        boxShadow: "0 22px 55px rgba(0, 0, 0, 0.12)",
        duration: 0.48,
        ease: "power3.inOut",
      },
      0
    )

    closeTl.to(
      imageColEl,
      {
        width: liveRect.width,
        height: liveRect.height,
        borderTopLeftRadius: "44px",
        borderBottomLeftRadius: "44px",
        borderTopRightRadius: "44px",
        borderBottomRightRadius: "44px",
        duration: 0.48,
        ease: "power3.inOut",
      },
      0
    )

    if (imgEl) {
      closeTl.to(
        imgEl,
        {
          scale: 1.06,
          duration: 0.48,
          ease: "power3.inOut",
        },
        0
      )
    }

    // 3. Fade out blur backdrop in sync
    closeTl.to(
      backdropEl,
      {
        opacity: 0,
        duration: 0.42,
        ease: "power2.inOut",
      },
      0
    )

    // 4. Pre-paint the locked full-bleed source card right underneath BEFORE popup unmounts (0ms gap!)
    if (sourceEl) {
      closeTl.call(
        () => {
          gsap.set(sourceEl, { autoAlpha: 1 })
        },
        [],
        0.42
      )
    }
  }

  const toggleWhySessionBooking = (cardId: number) => {
    setBookedWhySessions((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    )
  }

  useEffect(() => {
    if (!selectedWhyModal) return

    const { originRect, sourceEl } = selectedWhyModal
    const backdropEl = whyModalBackdropRef.current
    const popupEl = whyModalCardRef.current
    const imageColEl = whyModalImageColRef.current
    const imgEl = whyModalImgRef.current
    const rightColEl = whyModalRightColRef.current

    if (!popupEl || !imageColEl || !backdropEl || !rightColEl) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const isMobile = vw <= 768
    // 95% de largeur sur mobile, 80% sur desktop
    const targetW = isMobile ? Math.round(vw * 0.95) : Math.round(vw * 0.8)
    const targetH = isMobile ? Math.round(vh * 0.92) : Math.round(Math.min(vh * 0.85, 750))
    const targetLeft = Math.round((vw - targetW) / 2)
    const targetTop = Math.round((vh - targetH) / 2)

    const targetImgW = isMobile ? targetW : Math.round(targetW * 0.44)
    const targetImgH = isMobile ? Math.round(targetH * 0.38) : targetH
    const targetRightW = isMobile ? targetW : targetW - targetImgW
    const targetRightH = isMobile ? targetH - targetImgH : targetH

    // Lock right column width from frame 0 to prevent any text reflow while container expands
    gsap.set(rightColEl, {
      width: targetRightW,
      minWidth: targetRightW,
      maxWidth: targetRightW,
      height: targetRightH,
    })

    // Set initial state at the exact position & size of the clicked parent card
    gsap.set(backdropEl, { opacity: 0 })
    gsap.set(popupEl, {
      opacity: 1,
      left: originRect.left,
      top: originRect.top,
      width: originRect.width,
      height: originRect.height,
      borderRadius: isMobile ? "28px" : "44px",
    })
    gsap.set(imageColEl, {
      width: originRect.width,
      height: originRect.height,
      borderTopLeftRadius: isMobile ? "28px" : "44px",
      borderBottomLeftRadius: isMobile ? "28px" : "44px",
      borderTopRightRadius: isMobile ? "28px" : "44px",
      borderBottomRightRadius: isMobile ? "28px" : "44px",
    })
    if (imgEl) {
      gsap.set(imgEl, { scale: 1.08 })
    }

    // Hide source card only AFTER popup is placed directly on top of it
    if (sourceEl) {
      gsap.set(sourceEl, { autoAlpha: 0, pointerEvents: "none" })
    }

    const staggerItems = popupEl.querySelectorAll(".why-modal-stagger-item")
    const imgBadge = popupEl.querySelector(".why-modal-img-floating-badge")
    const closeBtn = popupEl.querySelector(".why-modal-close-btn")

    gsap.set(staggerItems, { opacity: 0, y: 24 })
    if (imgBadge) gsap.set(imgBadge, { opacity: 0, y: 16 })
    if (closeBtn) gsap.set(closeBtn, { opacity: 0, scale: 0.8 })

    const openTl = gsap.timeline()

    // 1. Blur overlay fade in
    openTl.to(
      backdropEl,
      {
        opacity: 1,
        duration: 0.45,
        ease: "power2.out",
      },
      0
    )

    // 2. Popup & Image displacement from card origin to centered popup
    openTl.to(
      popupEl,
      {
        left: targetLeft,
        top: targetTop,
        width: targetW,
        height: targetH,
        borderRadius: isMobile ? "28px" : "44px",
        duration: 0.76,
        ease: "expo.inOut",
      },
      0
    )

    // 3. Image morphs width & height cleanly for desktop or mobile
    openTl.to(
      imageColEl,
      {
        width: targetImgW,
        height: targetImgH,
        borderTopLeftRadius: isMobile ? "28px" : "44px",
        borderBottomLeftRadius: isMobile ? "0px" : "44px",
        borderTopRightRadius: isMobile ? "28px" : "0px",
        borderBottomRightRadius: "0px",
        duration: 0.76,
        ease: "expo.inOut",
      },
      0
    )

    if (imgEl) {
      openTl.to(
        imgEl,
        {
          scale: 1,
          duration: 0.95,
          ease: "expo.out",
        },
        0
      )
    }

    if (imgBadge) {
      openTl.to(
        imgBadge,
        {
          opacity: 1,
          y: 0,
          duration: 0.48,
          ease: "power3.out",
        },
        0.44
      )
    }

    if (closeBtn) {
      openTl.to(
        closeBtn,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        },
        0.42
      )
    }

    // 4. Successive (staggered) entrance of all right-side editorial sections
    openTl.to(
      staggerItems,
      {
        opacity: 1,
        y: 0,
        duration: 0.52,
        stagger: 0.065,
        ease: "power3.out",
      },
      0.38
    )

    return () => {
      openTl.kill()
    }
  }, [selectedWhyModal])

  const handleEventsScroll = () => {
    if (!eventsScrollRef.current) return
    const scrollLeft = eventsScrollRef.current.scrollLeft
    const maxScroll = eventsScrollRef.current.scrollWidth - eventsScrollRef.current.clientWidth
    if (maxScroll > 0) {
      const progress = Math.min(1, Math.max(0, scrollLeft / (maxScroll * 0.4)))
      setLeftTextOpacity(1 - progress * 0.8)
    }
  }

  const toggleEventRegistration = (eventId: number) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter((id) => id !== eventId))
    } else {
      setRegisteredEvents([...registeredEvents, eventId])
    }
  }

  useEffect(() => {
    const root = document.getElementById("mzaCarousel")
    if (!root) return
    const carouselInstance = new MzaCarousel(root, { transitionMs: 900 })
    return () => {
      carouselInstance.destroy()
    }
  }, [])

  const getProductCoutureSpecs = (product: Product) => {
    switch (product.categoryKey) {
      case "wedding":
        return {
          fabric: "Dentelle de Calais & Soie",
          craftHours: "75 à 95h Façon Main",
          fittings: "3 Séances Privées",
          structureNote: "Corset interne baleiné invisible, doublure en pongé de soie pure et traîne rebrodée au point d'esprit.",
          leadTime: "Confection sur-mesure sous 4 à 6 semaines",
        }
      case "party":
        return {
          fabric: "Satin Duchesse & Perles",
          craftHours: "60 à 75h d'Atelier",
          fittings: "2 à 3 Essayages",
          structureNote: "Drapé biais sculpté sur mannequin de bois, perlage cristal cousu main et fente architecturale.",
          leadTime: "Confection sur-mesure sous 3 à 4 semaines",
        }
      case "cocktail":
        return {
          fabric: "Crêpe Georgette & Organza",
          craftHours: "45 à 60h d'Atelier",
          fittings: "2 Essayages Privés",
          structureNote: "Bustier structuré haute tenue, volants aériens coupés au fil et ourlet roulotté à la main.",
          leadTime: "Confection sur-mesure sous 2 à 3 semaines",
        }
      case "veil":
        return {
          fabric: "Tulle Illusion de Soie & Dentelle",
          craftHours: "50 à 70h de Broderie",
          fittings: "2 Séances d'Ajustement",
          structureNote: "Bordure festonnée rebrodée au fil de soie, peigne d'orfèvre dissimulé et chute cathédrale aérienne.",
          leadTime: "Confection sur-mesure sous 2 à 4 semaines",
        }
      case "henna":
        return {
          fabric: "VeloursImpérial & Fil d'Or",
          craftHours: "85 à 110h d'Orfèvrerie Textile",
          fittings: "3 Séances Privées",
          structureNote: "Broderie sfifa et maâlem façonnée main, doublure satinée fluide et ceinture sculptée sur-mesure.",
          leadTime: "Confection sur-mesure sous 4 à 6 semaines",
        }
      case "cortege":
        return {
          fabric: "Mousseline & Crêpe de Soie",
          craftHours: "40 à 55h d'Atelier",
          fittings: "2 Essayages Harmonie",
          structureNote: "Drapé fluide harmonisé au cortège nuptial, maintien interne discret et finitions couture main.",
          leadTime: "Confection sur-mesure sous 2 à 3 semaines",
        }
      case "corsetry":
        return {
          fabric: "Satin Duchesse & Baleines Acier",
          craftHours: "65 à 80h de Corseterie",
          fittings: "3 Séances Techniques",
          structureNote: "14 baleines spiralées gainées de soie, laçage dos réglable au millimètre et galbe architectural.",
          leadTime: "Confection sur-mesure sous 3 à 5 semaines",
        }
      default:
        return {
          fabric: "Soie Sauvage & Guipure",
          craftHours: "65 à 85h Sur-Mesure",
          fittings: "3 Séances Privées",
          structureNote: "Toile d'étude dédiée à votre morphologie, broderies haute couture et finitions intérieures gansées.",
          leadTime: "Confection sur-mesure sous 3 à 5 semaines",
        }
    }
  }

  const openProductModal = (product: Product, e?: React.MouseEvent<HTMLElement>) => {
    let rect = {
      left: window.innerWidth / 2 - 210,
      top: window.innerHeight / 2 - 290,
      width: 420,
      height: 580,
    }
    let cardEl: HTMLElement | null = null

    if (e && e.currentTarget) {
      cardEl = (e.currentTarget as HTMLElement).closest(".product-card") as HTMLElement | null
      const imgContainerEl =
        (cardEl?.querySelector(".product-image-container") as HTMLElement | null) ||
        cardEl ||
        (e.currentTarget as HTMLElement)
      if (imgContainerEl) {
        const domRect = imgContainerEl.getBoundingClientRect()
        rect = {
          left: domRect.left,
          top: domRect.top,
          width: domRect.width,
          height: domRect.height,
        }
      }
    }

    isProductModalClosingRef.current = false
    setSelectedColorIndex(0)
    setSelectedSize(product.sizes[0] || "")
    setProductModalOrigin({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      sourceEl: cardEl,
    })
    setSelectedProduct(product)
  }

  const closeProductModal = () => {
    if (!selectedProduct || isProductModalClosingRef.current) return
    isProductModalClosingRef.current = true

    const origin = productModalOrigin
    const sourceEl = origin?.sourceEl || null
    const imgContainerEl =
      (sourceEl?.querySelector(".product-image-container") as HTMLElement | null) || sourceEl
    const liveRect = imgContainerEl
      ? imgContainerEl.getBoundingClientRect()
      : origin || {
          left: window.innerWidth / 2 - 210,
          top: window.innerHeight / 2 - 290,
          width: 420,
          height: 580,
        }

    const backdropEl = productModalBackdropRef.current
    const popupEl = productModalCardRef.current
    const imageColEl = productModalImageColRef.current
    const imgEl = productModalImgRef.current
    const detailsColEl = productModalDetailsColRef.current

    if (!popupEl || !imageColEl || !backdropEl) {
      if (sourceEl) {
        gsap.set(sourceEl, { autoAlpha: 1, pointerEvents: "auto" })
      }
      setSelectedProduct(null)
      setProductModalOrigin(null)
      isProductModalClosingRef.current = false
      return
    }

    const floatingBadges = popupEl.querySelectorAll(".product-modal-badge, .product-modal-img-caption")
    const closeBtn = popupEl.querySelector(".product-modal-close")

    const closeTl = gsap.timeline({
      onComplete: () => {
        if (sourceEl) {
          gsap.set(sourceEl, { autoAlpha: 1, pointerEvents: "auto" })
        }
        setSelectedProduct(null)
        setProductModalOrigin(null)
        isProductModalClosingRef.current = false
      },
    })

    closeTl.to(
      [detailsColEl, closeBtn, ...Array.from(floatingBadges)].filter(Boolean),
      {
        opacity: 0,
        duration: 0.18,
        ease: "power2.out",
      },
      0
    )

    closeTl.to(
      popupEl,
      {
        left: liveRect.left,
        top: liveRect.top,
        width: liveRect.width,
        height: liveRect.height,
        borderRadius: "24px",
        duration: 0.62,
        ease: "expo.inOut",
      },
      0
    )

    closeTl.to(
      imageColEl,
      {
        width: liveRect.width,
        height: liveRect.height,
        borderTopLeftRadius: "24px",
        borderBottomLeftRadius: "24px",
        borderTopRightRadius: "24px",
        borderBottomRightRadius: "24px",
        duration: 0.62,
        ease: "expo.inOut",
      },
      0
    )

    if (imgEl) {
      closeTl.to(
        imgEl,
        {
          scale: 1,
          duration: 0.62,
          ease: "expo.inOut",
        },
        0
      )
    }

    closeTl.to(
      backdropEl,
      {
        opacity: 0,
        duration: 0.36,
        ease: "power2.inOut",
      },
      0.22
    )
  }

  // GSAP Image Extension Animation when opening Trending Now Product Modal (80vw desktop, 95vw mobile)
  useEffect(() => {
    if (!selectedProduct || !productModalOrigin) return

    const backdropEl = productModalBackdropRef.current
    const popupEl = productModalCardRef.current
    const imageColEl = productModalImageColRef.current
    const imgEl = productModalImgRef.current
    const detailsColEl = productModalDetailsColRef.current

    if (!popupEl || !imageColEl || !backdropEl || !detailsColEl) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const isMobile = vw <= 768
    // 95% de largeur sur mobile, 80% sur desktop
    const targetW = isMobile
      ? Math.round(vw * 0.95)
      : Math.round(Math.min(vw * 0.84, Math.max(vw * 0.8, 1080)))
    const targetH = isMobile
      ? Math.round(vh * 0.92)
      : Math.round(Math.min(vh * 0.88, 860))
    const targetLeft = Math.round((vw - targetW) / 2)
    const targetTop = Math.round((vh - targetH) / 2)

    const targetImgW = isMobile ? targetW : Math.round(targetW * 0.5)
    const targetImgH = isMobile ? Math.round(targetH * 0.44) : targetH
    const targetRightW = isMobile ? targetW : targetW - targetImgW
    const targetRightH = isMobile ? targetH - targetImgH : targetH

    gsap.set(detailsColEl, {
      width: targetRightW,
      minWidth: targetRightW,
      maxWidth: targetRightW,
      height: targetRightH,
      opacity: 1,
    })

    // Point de départ : exactement sur les coordonnées de l'image cliquée
    gsap.set(backdropEl, { opacity: 0 })
    gsap.set(popupEl, {
      opacity: 1,
      left: productModalOrigin.left,
      top: productModalOrigin.top,
      width: productModalOrigin.width,
      height: productModalOrigin.height,
      borderRadius: "24px",
    })
    gsap.set(imageColEl, {
      width: productModalOrigin.width,
      height: productModalOrigin.height,
      borderTopLeftRadius: "24px",
      borderBottomLeftRadius: "24px",
      borderTopRightRadius: "24px",
      borderBottomRightRadius: "24px",
    })
    if (imgEl) {
      gsap.set(imgEl, { scale: 1.1 })
    }

    if (productModalOrigin.sourceEl) {
      gsap.set(productModalOrigin.sourceEl, { autoAlpha: 0, pointerEvents: "none" })
    }

    const staggerItems = popupEl.querySelectorAll(".product-modal-stagger-item")
    const floatingBadges = popupEl.querySelectorAll(".product-modal-badge, .product-modal-img-caption")
    const closeBtn = popupEl.querySelector(".product-modal-close")

    gsap.set(staggerItems, { opacity: 0, y: 22 })
    if (floatingBadges.length > 0) gsap.set(floatingBadges, { opacity: 0, y: 14 })
    if (closeBtn) gsap.set(closeBtn, { opacity: 0, scale: 0.8 })

    const openTl = gsap.timeline()

    openTl.to(
      backdropEl,
      {
        opacity: 1,
        duration: 0.42,
        ease: "power2.out",
      },
      0
    )

    // Déplacement et extension visible de l'image et du conteneur vers le popup
    openTl.to(
      popupEl,
      {
        left: targetLeft,
        top: targetTop,
        width: targetW,
        height: targetH,
        borderRadius: isMobile ? "28px" : "36px",
        duration: 0.78,
        ease: "expo.inOut",
      },
      0
    )

    openTl.to(
      imageColEl,
      {
        width: targetImgW,
        height: targetImgH,
        borderTopLeftRadius: isMobile ? "28px" : "36px",
        borderBottomLeftRadius: isMobile ? "0px" : "36px",
        borderTopRightRadius: isMobile ? "28px" : "0px",
        borderBottomRightRadius: "0px",
        duration: 0.78,
        ease: "expo.inOut",
      },
      0
    )

    if (imgEl) {
      openTl.to(
        imgEl,
        {
          scale: 1,
          duration: 0.96,
          ease: "expo.out",
        },
        0
      )
    }

    if (floatingBadges.length > 0) {
      openTl.to(
        floatingBadges,
        {
          opacity: 1,
          y: 0,
          duration: 0.48,
          stagger: 0.08,
          ease: "power3.out",
        },
        0.44
      )
    }

    if (closeBtn) {
      openTl.to(
        closeBtn,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        },
        0.42
      )
    }

    openTl.to(
      staggerItems,
      {
        opacity: 1,
        y: 0,
        duration: 0.52,
        stagger: 0.055,
        ease: "power3.out",
      },
      0.38
    )

    return () => {
      openTl.kill()
    }
  }, [selectedProduct, productModalOrigin])

  // Mesure dynamique du bouton actif pour faire glisser de façon fluide le fond coloré et centrer l'onglet dans la barre scrollable
  useEffect(() => {
    const updateGlider = () => {
      const activeBtn = trendingTabRefs.current[activeTrendingTab]
      const navEl = segmentedNavRef.current
      if (activeBtn) {
        setTrendingGlider({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth,
        })
        if (navEl) {
          const targetScrollLeft =
            activeBtn.offsetLeft - navEl.clientWidth / 2 + activeBtn.offsetWidth / 2
          navEl.scrollTo({
            left: Math.max(0, targetScrollLeft),
            behavior: "smooth",
          })
        }
      }
    }
    updateGlider()
    const timer = setTimeout(updateGlider, 60)
    window.addEventListener("resize", updateGlider)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateGlider)
    }
  }, [activeTrendingTab])

  // Animation GSAP ScrollTrigger (scroll-down ET scroll-up) appliquée à TOUTES les images de Trending Now
  useEffect(() => {
    const gridEl = productGridRef.current
    if (!gridEl) return
    const cards = Array.from(gridEl.querySelectorAll<HTMLElement>(".product-card"))
    const createdTimelines: gsap.core.Timeline[] = []

    cards.forEach((cardEl, idx) => {
      const imgEl = cardEl.querySelector<HTMLElement>(".product-image")
      const overlayEl = cardEl.querySelector<HTMLElement>(".product-overlay-info")
      const colStagger = (idx % 4) * 0.08

      gsap.killTweensOf([cardEl, imgEl, overlayEl].filter(Boolean))

      const isMobileScreen = window.innerWidth <= 768
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardEl,
          start: isMobileScreen ? "top 95%" : "top 88%",
          end: isMobileScreen ? undefined : "bottom 12%",
          toggleActions: isMobileScreen ? "play none none none" : "play reverse play reverse",
          once: isMobileScreen,
        },
      })

      tl.fromTo(
        cardEl,
        {
          opacity: 0,
          y: 56,
          scale: 0.92,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.72,
          delay: colStagger,
          ease: "back.out(1.4)",
        },
        0
      )

      if (imgEl) {
        tl.fromTo(
          imgEl,
          {
            scale: 1.18,
          },
          {
            scale: 1,
            duration: 0.85,
            delay: colStagger,
            ease: "power3.out",
            clearProps: "transform",
          },
          0
        )
      }

      if (overlayEl) {
        tl.fromTo(
          overlayEl,
          {
            opacity: 0,
            y: 16,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.52,
            delay: colStagger + 0.1,
            ease: "power2.out",
          },
          0
        )
      }

      createdTimelines.push(tl)
    })

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 90)

    return () => {
      clearTimeout(refreshTimer)
      createdTimelines.forEach((tl) => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill()
        }
        tl.kill()
      })
    }
  }, [activeCategoryIdx, showAllProducts])

  useGSAP(
    () => {
      ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true })
      // Hero Animation
      gsap.from(".hero-element", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      })

      // Scroll-Down & Scroll-Up Animation for Trending Now Header
      const trendingHeader = document.querySelector(".home-section-header")
      if (trendingHeader) {
        gsap.fromTo(
          trendingHeader,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: trendingHeader,
              start: "top 88%",
              end: "bottom 12%",
              toggleActions: "play reverse play reverse",
            },
          }
        )
      }

      // Scroll-Down & Scroll-Up Animation for Testimonials Header & Avatars
      const testimonialsHeaderItems = document.querySelectorAll(
        ".testimonials-header .testimonials-pill-badge, .testimonials-header .testimonials-title, .testimonials-header .testimonials-subtitle"
      )
      if (testimonialsHeaderItems.length > 0) {
        gsap.fromTo(
          testimonialsHeaderItems,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".testimonials-container",
              start: "top 82%",
              end: "bottom 18%",
              toggleActions: "play reverse play reverse",
            },
          }
        )
      }

      gsap.from(".testimonial-avatar-wrapper", {
        scrollTrigger: {
          trigger: ".testimonials-container",
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play reverse play reverse",
        },
        scale: 0.85,
        opacity: 0,
        y: 35,
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(1.4)",
      })

      // GSAP Pinned Horizontal Scroll Section ("Workshops & Events") with Horizontal + Vertical (Scroll-Down / Scroll-Up) Reveal
      const pinnedSection = document.querySelector(".events-pinned-section") as HTMLElement
      const cardsTrack = document.querySelector(".events-cards-track") as HTMLElement
      const leftPanel = document.querySelector(".events-left-panel") as HTMLElement
      const eventCards = document.querySelectorAll(".events-cards-track .event-card")

      let updateEventCardsVisibility = () => {}
      let updateWhyCardsVisibility = () => {}

      if (pinnedSection && cardsTrack && leftPanel) {
        const progressBarFill = document.querySelector(".events-progress-bar-fill") as HTMLElement
        const progressBarContainer = document.querySelector(".events-progress-bar-container") as HTMLElement
        const leftPanelItems = leftPanel.querySelectorAll(
          ".testimonials-pill-badge, .events-left-title, .events-left-subtitle, .events-left-scroll-hint"
        )

        const getScrollAmount = () => {
          return cardsTrack.scrollWidth - window.innerWidth + 120
        }

        updateEventCardsVisibility = () => {
          if (window.innerWidth <= 768) return
          const vw = window.innerWidth
          const vh = window.innerHeight
          const easeOut = gsap.parseEase("power2.out")
          const secRect = pinnedSection.getBoundingClientRect()

          // Vertical visibility when scrolling down into section (bottom edge) or scrolling up into section (top edge)
          const rawEnterBottom = gsap.utils.clamp(0, 1, (vh * 0.92 - secRect.top) / (vh * 0.78))
          const bottomVis = easeOut(rawEnterBottom)
          const rawEnterTop = gsap.utils.clamp(0, 1, (secRect.bottom - vh * 0.08) / (vh * 0.78))
          const topVis = easeOut(rawEnterTop)
          const vertVis = Math.min(bottomVis, topVis)

          // Direction-aware vertical offset (+y when below screen, -y when above screen)
          const vertDir = secRect.top > 4 ? 1 : secRect.bottom < vh - 4 ? -1 : 0

          // Staggered vertical reveal for left text panel items on scroll-down / scroll-up
          leftPanelItems.forEach((item, idx) => {
            const staggerStart = idx * 0.1
            const itemRaw = gsap.utils.clamp(0, 1, (rawEnterBottom - staggerStart) / (1 - staggerStart))
            const itemVis = easeOut(itemRaw) * topVis
            gsap.set(item, {
              opacity: itemVis,
              y: 42 * (1 - itemVis) * (vertDir || 1),
              scale: 0.95 + 0.05 * itemVis,
            })
          })

          if (progressBarContainer) {
            gsap.set(progressBarContainer, {
              opacity: vertVis,
              y: 24 * (1 - vertVis),
            })
          }

          eventCards.forEach((card) => {
            const el = card as HTMLElement
            const rect = el.getBoundingClientRect()
            // Horizontal visibility (left & right viewport edges)
            const rawLeft = gsap.utils.clamp(0, 1, (rect.right - vw * 0.1) / (vw * 0.35))
            const leftVis = easeOut(rawLeft)
            const rawRight = gsap.utils.clamp(0, 1, 1 - (rect.left - vw * 0.55) / (vw * 0.35))
            const rightVis = easeOut(rawRight)
            const horizVis = Math.min(leftVis, rightVis)

            // Combined Horizontal + Vertical visibility
            const horizY = 40 * (1 - horizVis)
            const vertY = 55 * (1 - vertVis) * vertDir
            const finalOpacity = (0.3 + 0.7 * horizVis) * (0.15 + 0.85 * vertVis)
            const finalScale = (0.95 + 0.05 * horizVis) * (0.92 + 0.08 * vertVis)

            gsap.set(el, {
              opacity: finalOpacity,
              y: horizY + vertY,
              scale: finalScale,
            })
          })
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedSection,
            pin: true,
            scrub: 0.8,
            start: "top top",
            end: () => `+=${getScrollAmount() + 400}`,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: updateEventCardsVisibility,
            onRefresh: updateEventCardsVisibility,
          },
        })

        // 1. Move horizontal cards track to the left
        timeline.to(
          cardsTrack,
          {
            x: () => -getScrollAmount(),
            ease: "none",
            onUpdate: updateEventCardsVisibility,
          },
          0
        )

        // Initial visibility state
        updateEventCardsVisibility()

        // 2. Real-time scroll progress bar fill
        if (progressBarFill) {
          timeline.to(
            progressBarFill,
            {
              width: "100%",
              ease: "none",
            },
            0
          )
        }

        // 3. Fade out left text panel as cards glide over it
        timeline.to(
          leftPanel,
          {
            opacity: 0,
            scale: 0.92,
            ease: "power2.out",
            duration: 0.25,
          },
          0
        )
      }

      // GSAP Scroll-Down & Scroll-Up Animation for Éditions Limitées section
      const editionsSection = document.querySelector(".featured-carousel-section") as HTMLElement
      if (editionsSection) {
        const headerElements = editionsSection.querySelectorAll(".carousel-badge, .featured-carousel-title, .featured-carousel-subtitle")
        gsap.fromTo(
          headerElements,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: editionsSection,
              start: "top 82%",
              end: "bottom 18%",
              toggleActions: "play reverse play reverse",
            },
          }
        )

        const mzaCarousel = editionsSection.querySelector(".mzaCarousel")
        if (mzaCarousel) {
          gsap.fromTo(
            mzaCarousel,
            { opacity: 0, scale: 0.94, y: 40 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: editionsSection,
                start: "top 75%",
                end: "bottom 20%",
                toggleActions: "play reverse play reverse",
              },
            }
          )
        }
      }

      // GSAP Pinned Horizontal Scroll for Why Choose Sunset Section (Reverse: Left to Right, Text on Right) + Vertical Scroll-Down / Scroll-Up Reveal
      const whyChooseSec = document.querySelector(".why-choose-section") as HTMLElement
      const whyCardsTrack = document.querySelector(".why-choose-cards-track") as HTMLElement
      const whyRightPanel = document.querySelector(".why-choose-right-panel") as HTMLElement
      const whyCards = document.querySelectorAll(".why-choose-card-item")

      if (whyChooseSec && whyCardsTrack && whyRightPanel) {
        const whyProgressBarFill = document.querySelector(".why-choose-progress-bar-fill") as HTMLElement
        const whyProgressBarContainer = document.querySelector(".why-choose-progress-bar-container") as HTMLElement
        const whyRightItems = whyRightPanel.querySelectorAll(
          ".why-choose-badge, .why-choose-title, .why-choose-list-item, .why-choose-actions-row"
        )

        const getWhyScrollAmount = () => {
          return whyCardsTrack.scrollWidth - window.innerWidth + 120
        }

        updateWhyCardsVisibility = () => {
          if (window.innerWidth <= 768) return
          const vw = window.innerWidth
          const vh = window.innerHeight
          const easeOut = gsap.parseEase("power2.out")
          const secRect = whyChooseSec.getBoundingClientRect()

          // Vertical visibility when scrolling down into section (bottom edge) or scrolling up into section (top edge)
          const rawEnterBottom = gsap.utils.clamp(0, 1, (vh * 0.92 - secRect.top) / (vh * 0.78))
          const bottomVis = easeOut(rawEnterBottom)
          const rawEnterTop = gsap.utils.clamp(0, 1, (secRect.bottom - vh * 0.08) / (vh * 0.78))
          const topVis = easeOut(rawEnterTop)
          const vertVis = Math.min(bottomVis, topVis)

          const vertDir = secRect.top > 4 ? 1 : secRect.bottom < vh - 4 ? -1 : 0

          // Staggered vertical reveal for right text panel items on scroll-down / scroll-up
          whyRightItems.forEach((item, idx) => {
            const staggerStart = idx * 0.08
            const itemRaw = gsap.utils.clamp(0, 1, (rawEnterBottom - staggerStart) / (1 - staggerStart))
            const itemVis = easeOut(itemRaw) * topVis
            gsap.set(item, {
              opacity: itemVis,
              y: 38 * (1 - itemVis) * (vertDir || 1),
              scale: 0.96 + 0.04 * itemVis,
            })
          })

          if (whyProgressBarContainer) {
            gsap.set(whyProgressBarContainer, {
              opacity: vertVis,
              y: 24 * (1 - vertVis),
            })
          }

          whyCards.forEach((card) => {
            const el = card as HTMLElement
            if (el.classList.contains("why-card-modal-active")) return
            const rect = el.getBoundingClientRect()
            // Horizontal visibility (left & right viewport edges)
            const rawLeft = gsap.utils.clamp(0, 1, (rect.right - vw * 0.1) / (vw * 0.35))
            const leftVis = easeOut(rawLeft)
            const rawRight = gsap.utils.clamp(0, 1, 1 - (rect.left - vw * 0.55) / (vw * 0.35))
            const rightVis = easeOut(rawRight)
            const horizVis = Math.min(leftVis, rightVis)

            // Combined Horizontal + Vertical visibility
            const horizY = 40 * (1 - horizVis)
            const vertY = 55 * (1 - vertVis) * vertDir
            const finalOpacity = (0.3 + 0.7 * horizVis) * (0.15 + 0.85 * vertVis)
            const finalScale = (0.95 + 0.05 * horizVis) * (0.92 + 0.08 * vertVis)

            gsap.set(el, {
              opacity: finalOpacity,
              y: horizY + vertY,
              scale: finalScale,
            })
          })
        }

        const whyTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: whyChooseSec,
            pin: true,
            scrub: 0.8,
            start: "top top",
            end: () => `+=${getWhyScrollAmount() + 400}`,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: updateWhyCardsVisibility,
            onRefresh: updateWhyCardsVisibility,
          },
        })

        // 1. Move horizontal cards track from LEFT to RIGHT
        whyTimeline.fromTo(
          whyCardsTrack,
          {
            x: () => -getWhyScrollAmount(),
          },
          {
            x: 0,
            ease: "none",
            onUpdate: updateWhyCardsVisibility,
          },
          0
        )

        // Initial positioning & visibility state
        gsap.set(whyCardsTrack, { x: -getWhyScrollAmount() })
        updateWhyCardsVisibility()

        // 2. Real-time scroll progress bar fill
        if (whyProgressBarFill) {
          whyTimeline.to(
            whyProgressBarFill,
            {
              width: "100%",
              ease: "none",
            },
            0
          )
        }

        // 3. Fade out right text panel as cards glide over it from left to right
        whyTimeline.to(
          whyRightPanel,
          {
            opacity: 0,
            scale: 0.92,
            ease: "power2.out",
            duration: 0.25,
          },
          0
        )
      }

      // Continuous vertical scroll listener so scroll-down and scroll-up entry/exit before & after pinning is 100% real-time (throttled with rAF)
      let rAFId: number | null = null
      const handleVerticalScrollReveal = () => {
        if (window.innerWidth <= 768) return
        if (rAFId !== null) return
        rAFId = requestAnimationFrame(() => {
          updateEventCardsVisibility()
          updateWhyCardsVisibility()
          rAFId = null
        })
      }
      window.addEventListener("scroll", handleVerticalScrollReveal, { passive: true })
      window.addEventListener("resize", handleVerticalScrollReveal, { passive: true })

      // Lookbook Editorial Section — Scroll-Down & Scroll-Up Reveal
      gsap.fromTo(
        ".lookbook-reveal-header",
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".lookbook-editorial-section",
            start: "top 82%",
            end: "bottom 14%",
            toggleActions: "play reverse play reverse",
          },
        }
      )

      gsap.fromTo(
        ".lookbook-reveal-stage",
        { y: 64, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".lookbook-stage-grid",
            start: "top 82%",
            end: "bottom 12%",
            toggleActions: "play reverse play reverse",
          },
        }
      )

      // Flagship Studios Section — Scroll-Down & Scroll-Up Reveal
      gsap.fromTo(
        ".flagship-reveal-header",
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".flagship-studios-section",
            start: "top 82%",
            end: "bottom 14%",
            toggleActions: "play reverse play reverse",
          },
        }
      )

      gsap.fromTo(
        ".flagship-monolith-panel",
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".flagship-accordion-track",
            start: "top 82%",
            end: "bottom 12%",
            toggleActions: "play reverse play reverse",
          },
        }
      )

      // Inside The Craft Section — Scroll-Down & Scroll-Up Reveal + Animated Counters
      gsap.fromTo(
        ".craft-reveal-header",
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".craft-anatomy-section",
            start: "top 82%",
            end: "bottom 14%",
            toggleActions: "play reverse play reverse",
          },
        }
      )

      gsap.fromTo(
        ".craft-reveal-stage",
        { y: 64, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".craft-stage-grid",
            start: "top 82%",
            end: "bottom 12%",
            toggleActions: "play reverse play reverse",
          },
        }
      )

      gsap.fromTo(
        ".craft-counter-card",
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".craft-counters-ledger",
            start: "top 86%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse",
          },
        }
      )

      const counterNodes = gsap.utils.toArray<HTMLElement>(".craft-counter-num")
      counterNodes.forEach((node) => {
        const targetVal = parseFloat(node.dataset.target || "0")
        const decimals = parseInt(node.dataset.decimals || "0", 10)
        const prefix = node.dataset.prefix || ""
        const suffix = node.dataset.suffix || ""
        const counterObj = { val: 0 }

        gsap.to(counterObj, {
          val: targetVal,
          duration: 2.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".craft-counters-ledger",
            start: "top 86%",
            end: "bottom 10%",
            toggleActions: "play reset play reset",
          },
          onUpdate: () => {
            let formatted = ""
            if (decimals > 0) {
              formatted = counterObj.val.toFixed(decimals)
            } else {
              const rounded = Math.round(counterObj.val)
              formatted = rounded >= 1000 ? rounded.toLocaleString("fr-FR") : String(rounded)
            }
            node.textContent = `${prefix}${formatted}${suffix}`
          },
        })
      })

      // Infinite Marquee for announcements
      gsap.to(".marquee-inner", {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1,
      })

      return () => {
        window.removeEventListener("scroll", handleVerticalScrollReveal)
        window.removeEventListener("resize", handleVerticalScrollReveal)
      }
    },
    { scope: container },
  )

  return (
    <div
      ref={container}
      className="home-page"
      style={{ "--hero-diamond-color": CAROUSEL_SHOES[k].bg } as React.CSSProperties}
    >
      {/* Navbar (Fixed) */}
      <nav className="home-navbar">
        <div className="home-nav-content">
          <div className="home-logo">
            <div className="home-logo-icon">
              <Sparkles size={18} />
            </div>
            <span className="home-logo-text">Maison Soie &amp; Couture</span>
          </div>

          <div className="home-nav-actions">
            <button className="home-nav-btn">
              <Search size={22} />
            </button>
            <button className="home-nav-btn">
              <Bell size={22} />
              <span className="home-badge"></span>
            </button>
            <button className="home-nav-btn">
              <ShoppingBag size={22} />
            </button>
            <button
              onClick={() => (window.location.href = "/auth")}
              className="home-profile-btn"
            >
              <img
                src="/couture/other-robes2.webp"
                alt="Profil Atelier"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Announcements Marquee */}
      <div className="home-marquee">
        <div className="marquee-inner">
          <span><FontAwesomeIcon icon={faFireFlameSimple} /> Prise de Mesures Privée Offerte sur Rendez-Vous en Salon</span>
          <span><FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.75em' }} /></span>
          <span><FontAwesomeIcon icon={faTruck} /> Soies Naturelles, Dentelle de Calais &amp; Broderies Façonnées Main</span>
          <span><FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.75em' }} /></span>
          <span><FontAwesomeIcon icon={faFireFlameSimple} /> Création Sur-Mesure : Robes de Mariée, Gala &amp; Cérémonie</span>
          <span><FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.75em' }} /></span>
          <span><FontAwesomeIcon icon={faTruck} /> Accompagnement Personnalisé jusqu'au Jour J</span>
          <span><FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.75em' }} /></span>
          <span><FontAwesomeIcon icon={faFireFlameSimple} style={{ color: '#d8c8b8' }} /> Prise de Mesures Privée Offerte sur Rendez-Vous en Salon</span>
          <span><FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.75em' }} /></span>
          <span><FontAwesomeIcon icon={faTruck} /> Soies Naturelles, Dentelle de Calais &amp; Broderies Façonnées Main</span>
        </div>
      </div>

      <main className="home-main">
        {/* Hero Section */}
        <section className="home-hero" style={{ backgroundColor: CAROUSEL_SHOES[k].bg }}>
          <div className="home-hero-left">
            <span className="hero-element home-tag">
              Haute Couture &amp; Sur-Mesure
            </span>
            <h1 className="hero-element home-hero-title">
              Sublimez Votre <br />{" "}
              <span className="home-hero-title-light">Allure Unique.</span>
            </h1>
            <p className="hero-element home-hero-desc">
              Des robes de mariée, de gala et de cérémonie dessinées et cousues
              main pour célébrer chaque instant d'exception avec grâce.
            </p>
            <button className="hero-element home-hero-btn">
              Découvrir l'Atelier <TrendingUp size={20} className="animate-draw-arrow" />
            </button>
            <div className="hero-element home-hero-brands">
              <span className="brand-logo" title="Soie de Lyon">
                <ion-icon name="Sparkles-outline"></ion-icon>
              </span>
              <span className="brand-logo" title="Dentelle de Calais">
                <ion-icon name="diamond-outline"></ion-icon>
              </span>
              <span className="brand-logo" title="Sur-Mesure">
                <ion-icon name="cut-outline"></ion-icon>
              </span>
              <span className="brand-logo" title="Broderie Main">
                <ion-icon name="rose-outline"></ion-icon>
              </span>
              <span className="brand-logo" title="Haute Couture">
                <ion-icon name="ribbon-outline"></ion-icon>
              </span>
            </div>
            <div className="hero-element home-scroll-indicator">
              <span>Défiler</span>
              <div className="home-scroll-line">
                <div className="home-scroll-fill"></div>
              </div>
            </div>
          </div>
          <div className="home-hero-right hero-element">
            <section
              className="carousel-section"
              style={{ '--n': n, '--k': k } as React.CSSProperties}
            >
              {CAROUSEL_SHOES.map((shoe: CarouselShoe, i: number) => (
                <article
                  key={i}
                  style={{ '--i': i, '--a': `${shoe.a}deg` } as React.CSSProperties}
                >
                  <h2>{shoe.name}</h2>
                  <em>{shoe.desc}</em>
                  <img src={shoe.image} alt={shoe.desc} />
                </article>
              ))}
              <div className="carousel-dots-container">
                <button
                  className="carousel-arrow-btn"
                  aria-label="Previous slide"
                  onClick={() => setK((prev) => (prev - 1 + n) % n)}
                >
                  <ChevronLeft size={16} />
                </button>
                {CAROUSEL_SHOES.map((_: CarouselShoe, i: number) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`carousel-dot-btn ${i === k ? 'active' : ''}`}
                    onClick={() => setK(i)}
                  />
                ))}
                <button
                  className="carousel-arrow-btn"
                  aria-label="Next slide"
                  onClick={() => setK((prev) => (prev + 1) % n)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </section>
          </div>
        </section>

        {/* Product Grid — Trending Now with Unified Segmented Pill Bar & Sliding Background Glider */}
        <section className="trending-now-section">
          <div className="home-section-header trending-header-upgraded">
            <h2 className="home-section-title">
              Catalogue <span className="calligraphy-title-accent">Couture</span>
            </h2>

            <div
              ref={segmentedNavRef}
              className="trending-segmented-nav"
              role="tablist"
              aria-label="Catégories de modèles de robes"
              onWheel={(e) => {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                  e.currentTarget.scrollLeft += e.deltaY
                }
              }}
            >
              <span
                className="trending-segmented-glider"
                style={{
                  transform: `translate3d(${trendingGlider.left}px, 0, 0)`,
                  width: `${trendingGlider.width}px`,
                }}
              />
              {DRESS_CATEGORIES.map((cat, idx) => {
                const isActiveCat = !showAllProducts && idx === activeCategoryIdx
                return (
                  <button
                    key={cat.key}
                    ref={(el) => {
                      trendingTabRefs.current[idx] = el
                    }}
                    type="button"
                    role="tab"
                    aria-selected={isActiveCat}
                    className={`trending-segmented-tab ${isActiveCat ? "active" : ""}`}
                    onClick={() => {
                      setShowAllProducts(false)
                      setActiveCategoryIdx(idx)
                    }}
                  >
                    {cat.label}
                  </button>
                )
              })}
              <button
                ref={(el) => {
                  trendingTabRefs.current[DRESS_CATEGORIES.length] = el
                }}
                type="button"
                role="tab"
                aria-selected={showAllProducts}
                className={`trending-segmented-tab ${showAllProducts ? "active" : ""}`}
                onClick={() => {
                  setShowAllProducts(true)
                }}
              >
                Tout Voir
              </button>
            </div>
          </div>

          <div ref={productGridRef} className="product-grid">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={(e) => openProductModal(product, e)}
              >
                <div
                  className={`product-image-container ${product.color}`}
                >
                  {product.badge && (
                    <span className="product-badge">
                      {product.badge}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />

                  {/* Gradient Overlay and Animated Product Details (Category, Name, Price) */}
                  <div className="product-image-overlay">
                    <div className="product-overlay-info">
                      <p className="product-overlay-category">{product.category}</p>
                      <h3 className="product-overlay-name">{product.name}</h3>
                      <p className="product-overlay-price">{product.price}</p>
                    </div>
                  </div>

                  {/* Quick Add Button overlay */}
                  <button
                    className="product-add-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      openProductModal(product, e)
                    }}
                    title="Voir les détails"
                  >
                    <ShoppingBag size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Wavy Ribbon Separator: 2 thin black borders + green text */}
        <div className="section-separator-ribbon">
          <svg className="separator-ribbon-svg" viewBox="0 0 1600 200" preserveAspectRatio="none">
            <defs>
              <path
                id="ribbonTopBorder"
                d="M -150,55 C 450,185 1050,-45 1750,75"
                fill="none"
              />
              <path
                id="ribbonBottomBorder"
                d="M -150,135 C 450,265 1050,35 1750,155"
                fill="none"
              />
              <path
                id="separatorRibbonTextPath"
                d="M -150,95 C 450,225 1050,-5 1750,115"
                fill="none"
              />
            </defs>

            {/* Thin 1.2px Earthen Top & Bottom Borders */}
            <use href="#ribbonTopBorder" stroke="#29251c" strokeWidth="1.2" fill="none" />
            <use href="#ribbonBottomBorder" stroke="#29251c" strokeWidth="1.2" fill="none" />

            {/* Scrolling Couture Ribbon Text */}
            <text
              fill="#29251c"
              fontSize="20"
              fontWeight="700"
              letterSpacing="1px"
              dominantBaseline="central"
              alignmentBaseline="middle"
              dy="1px"
            >
              <textPath href="#separatorRibbonTextPath" startOffset="0%">
                • CRÉATION SUR-MESURE &amp; HAUTE COUTURE • ROBES DE MARIÉE, SOIRÉE &amp; COCKTAIL • BRODERIES MAIN &amp; DENTELLE DE CALAIS • ESSAYAGES PRIVÉS EN SALON • PATRONAGE EXCLUSIF • CRÉATION SUR-MESURE &amp; HAUTE COUTURE •
                <animate
                  attributeName="startOffset"
                  from="0%"
                  to="-50%"
                  dur="30s"
                  repeatCount="indefinite"
                />
              </textPath>
            </text>
          </svg>
        </div>

        {/* Customer Testimonials Section */}
        <section className="testimonials-section">
          <div className="testimonials-container">
            {/* Central Testimonials Title Header */}
            <div className="testimonials-header">
              <span className="testimonials-pill-badge">Témoignages Clientes</span>
              <h2 className="testimonials-title">
                L'Émotion du <span className="calligraphy-title-accent">Sur-Mesure</span>
              </h2>
              <p className="testimonials-subtitle">
                Découvrez les confidences de nos mariées et clientes sur la coupe, le tombé parfait et l'accompagnement de notre atelier.
              </p>
            </div>

            {/* Desktop Floating Avatars Layer (Constellation plein écran originale) */}
            <div className="testimonials-avatars-layer desktop-only">
              {testimonials.map((item) => {
                const isActive = item.id === activeTestimonialId

                // Determine smart direction so popovers never get cut off by container bounds
                const direction: "top" | "left" | "right" | "bottom" =
                  item.y >= 75
                    ? "top"
                    : item.x <= 15
                    ? "right"
                    : item.x >= 85
                    ? "left"
                    : "bottom"

                const motionProps = {
                  top: {
                    initial: { opacity: 0, x: "-50%", y: -12, scale: 0.92 },
                    animate: { opacity: 1, x: "-50%", y: 0, scale: 1 },
                    exit: { opacity: 0, x: "-50%", y: -8, scale: 0.95 },
                  },
                  right: {
                    initial: { opacity: 0, x: 12, y: "-50%", scale: 0.92 },
                    animate: { opacity: 1, x: 0, y: "-50%", scale: 1 },
                    exit: { opacity: 0, x: 8, y: "-50%", scale: 0.95 },
                  },
                  left: {
                    initial: { opacity: 0, x: -12, y: "-50%", scale: 0.92 },
                    animate: { opacity: 1, x: 0, y: "-50%", scale: 1 },
                    exit: { opacity: 0, x: -8, y: "-50%", scale: 0.95 },
                  },
                  bottom: {
                    initial: { opacity: 0, x: "-50%", y: 12, scale: 0.92 },
                    animate: { opacity: 1, x: "-50%", y: 0, scale: 1 },
                    exit: { opacity: 0, x: "-50%", y: 8, scale: 0.95 },
                  },
                }[direction]

                return (
                  <div
                    key={item.id}
                    className={`testimonial-avatar-wrapper ${isActive ? "active" : ""}`}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    onClick={() => setActiveTestimonialId(item.id)}
                  >
                    {/* Animated Wave Halos */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className="active-rings-container"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.4 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <div className="wave-ring wave-1" />
                          <div className="wave-ring wave-2" />
                          <div className="wave-ring wave-3" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="avatar-circle">
                      <img src={item.avatar} alt={item.name} />
                    </div>

                    {/* Popover anchored directly to avatar with smart direction positioning */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className={`testimonial-card-popover direction-${direction}`}
                          initial={motionProps.initial}
                          animate={motionProps.animate}
                          exit={motionProps.exit}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="popover-arrow" />
                          <p className="popover-quote">"{item.quote}"</p>
                          <div className="popover-author">
                            <h4 className="popover-name">{item.name}</h4>
                            <span className="popover-role">{item.role}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Showcase Témoignages Dédié & Aéré Spécial Mobile */}
            <div className="testimonials-mobile-showcase mobile-only">
              <div className="testimonial-mobile-card">
                <div className="testimonial-mobile-top">
                  <div className="testimonial-mobile-user">
                    <img
                      src={activeTestimonial.avatar}
                      alt={activeTestimonial.name}
                      className="testimonial-mobile-avatar"
                    />
                    <div>
                      <h4 className="testimonial-mobile-name">{activeTestimonial.name}</h4>
                      <p className="testimonial-mobile-role">{activeTestimonial.role}</p>
                    </div>
                  </div>
                  <div className="testimonial-mobile-stars" aria-label="5 étoiles">
                    ★★★★★
                  </div>
                </div>

                <p className="testimonial-mobile-quote">
                  "{activeTestimonial.quote}"
                </p>

                <div className="testimonial-mobile-nav">
                  <span className="testimonial-mobile-count">
                    0{testimonials.findIndex((t) => t.id === activeTestimonialId) + 1} / 0{testimonials.length}
                  </span>
                  <div className="testimonial-mobile-arrows">
                    <button
                      type="button"
                      className="testimonial-mobile-arrow-btn"
                      onClick={() => {
                        const currentIdx = testimonials.findIndex((t) => t.id === activeTestimonialId)
                        const prevIdx = (currentIdx - 1 + testimonials.length) % testimonials.length
                        setActiveTestimonialId(testimonials[prevIdx].id)
                      }}
                      aria-label="Témoignage précédent"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      className="testimonial-mobile-arrow-btn"
                      onClick={() => {
                        const currentIdx = testimonials.findIndex((t) => t.id === activeTestimonialId)
                        const nextIdx = (currentIdx + 1) % testimonials.length
                        setActiveTestimonialId(testimonials[nextIdx].id)
                      }}
                      aria-label="Témoignage suivant"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Barre de sélection d'avatars tactile fluide */}
              <div className="testimonials-mobile-avatars-bar">
                {testimonials.map((item) => {
                  const isActive = item.id === activeTestimonialId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`testimonials-mobile-thumb-btn ${isActive ? "active" : ""}`}
                      onClick={() => setActiveTestimonialId(item.id)}
                      aria-label={`Voir le témoignage de ${item.name}`}
                    >
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="testimonials-mobile-thumb-img"
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Featured 3D Parallax Coverflow Carousel (Customized & Unbridled 90vw width) */}
        <section className="featured-carousel-section">
          <div className="featured-carousel-header">
            <span className="testimonials-pill-badge carousel-badge">Défilé &amp; Pièces Uniques</span>
            <h2 className="featured-carousel-title">
              Collections <span className="calligraphy-title-accent">Exclusives</span>
            </h2>
            <p className="featured-carousel-subtitle">
              Explorez nos robes d'apparat et silhouettes couture façonnées à la main dans nos étoffes les plus précieuses.
            </p>
          </div>

          {/* Desktop 3D Coverflow Original Carousel */}
          <div className="mzaCarousel desktop-only" id="mzaCarousel" aria-roledescription="carousel" aria-label="Featured cards">
            <div className="mzaCarousel-viewport" tabIndex={0}>
              <div className="mzaCarousel-track">
                {EXCLUSIVE_COLLECTIONS.map((col, idx) => (
                  <article key={col.id} className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label={`${idx + 1} of ${EXCLUSIVE_COLLECTIONS.length}`}>
                    <div className="mzaCard" style={{ "--mzaCard-bg": `url('${col.bg}')` } as React.CSSProperties}>
                      <header className="mzaCard-head mzaPar-1">
                        <h2 className="mzaCard-title">{col.title}</h2>
                        <p className="mzaCard-kicker">{col.kicker}</p>
                      </header>
                      <p className="mzaCard-text mzaPar-2">{col.text}</p>
                      <footer className="mzaCard-actions mzaPar-3">
                        <button className="mzaBtn">{col.btnText}</button>
                      </footer>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mzaCarousel-controls" aria-label="Controls">
              <button className="mzaCarousel-prev" aria-label="Previous slide" type="button">
                <ChevronLeft size={24} />
              </button>
              <button className="mzaCarousel-next" aria-label="Next slide" type="button">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="mzaCarousel-pagination" role="tablist" aria-label="Slide navigation"></div>
          </div>

          {/* Slider Collections Exclusives Dédié & Aéré Spécial Mobile */}
          <div
            className="exclusive-mobile-slider mobile-only"
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX === null) return
              const diff = e.changedTouches[0].clientX - touchStartX
              if (diff > 45) {
                setActiveExclusiveIdx((prev) => (prev > 0 ? prev - 1 : EXCLUSIVE_COLLECTIONS.length - 1))
              } else if (diff < -45) {
                setActiveExclusiveIdx((prev) => (prev < EXCLUSIVE_COLLECTIONS.length - 1 ? prev + 1 : 0))
              }
              setTouchStartX(null)
            }}
          >
            {(() => {
              const currentEx = EXCLUSIVE_COLLECTIONS[activeExclusiveIdx] || EXCLUSIVE_COLLECTIONS[0]
              return (
                <>
                  <div className="exclusive-mobile-card">
                    <img
                      src={currentEx.bg}
                      alt={currentEx.title}
                      className="exclusive-mobile-card-img"
                    />
                    <div className="exclusive-mobile-badge">
                      PIÈCE D'ATELIER 0{activeExclusiveIdx + 1} / {EXCLUSIVE_COLLECTIONS.length}
                    </div>
                    <div className="exclusive-mobile-scrim" />
                    <div className="exclusive-mobile-content">
                      <span className="exclusive-mobile-kicker">{currentEx.kicker}</span>
                      <h3 className="exclusive-mobile-title">{currentEx.title}</h3>
                      <p className="exclusive-mobile-desc">{currentEx.text}</p>
                      <button
                        type="button"
                        className="exclusive-mobile-btn"
                        onClick={() => {
                          const matchedProduct = products.find((p) => p.name.toLowerCase().includes(currentEx.title.toLowerCase())) || products[0]
                          openProductModal(matchedProduct)
                        }}
                      >
                        <span>{currentEx.btnText}</span>
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="exclusive-mobile-controls">
                    <button
                      type="button"
                      className="exclusive-mobile-arrow-btn"
                      onClick={() =>
                        setActiveExclusiveIdx((prev) =>
                          prev > 0 ? prev - 1 : EXCLUSIVE_COLLECTIONS.length - 1
                        )
                      }
                      aria-label="Modèle précédent"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="exclusive-mobile-dots">
                      {EXCLUSIVE_COLLECTIONS.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          className={`exclusive-mobile-dot ${dotIdx === activeExclusiveIdx ? "active" : ""}`}
                          onClick={() => setActiveExclusiveIdx(dotIdx)}
                          aria-label={`Aller au modèle ${dotIdx + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      className="exclusive-mobile-arrow-btn"
                      onClick={() =>
                        setActiveExclusiveIdx((prev) =>
                          prev < EXCLUSIVE_COLLECTIONS.length - 1 ? prev + 1 : 0
                        )
                      }
                      aria-label="Modèle suivant"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </section>

        {/* Events & Masterclasses Section (GSAP Pinned Horizontal Scroll) */}
        <section className="events-pinned-section">
          <div className="events-pinned-container">
            {/* Left Info Panel (Fades out when cards glide over it) */}
            <div className="events-left-panel">
              <span className="testimonials-pill-badge">Salons Privés &amp; Défilés</span>
              <h2 className="events-left-title">
                Rendez-Vous &amp; <br />
                <span className="home-hero-title-light">Créations.</span>
              </h2>
              <p className="events-left-subtitle">
                Participez à nos présentations privées, trunk shows nuptiaux, ateliers de broderie et essayages sur-mesure au salon.
              </p>
              <div className="events-left-scroll-hint">
                <span>Défilez vers le bas</span>
                <div className="events-scroll-indicator-line">
                  <span className="indicator-seg seg-1"></span>
                  <span className="indicator-seg seg-2"></span>
                  <span className="indicator-seg seg-3"></span>
                </div>
              </div>
            </div>

            {/* Cards Layer Gliding Over Text Area */}
            <div className="events-cards-viewport">
              <div className="events-cards-track">
                {eventsData.map((evt) => {
                  const isRegistered = registeredEvents.includes(evt.id)
                  return (
                    <div
                      key={evt.id}
                      className="event-card"
                      onClick={() => setSelectedEvent(evt)}
                    >
                      <img src={evt.image} alt={evt.title} className="event-card-img" />

                      {/* Dark Translucent Gradient Overlay (Fades in on hover) */}
                      <div className="event-card-overlay" />

                      {/* Top Header Text (Drops down from top -40px on hover) */}
                      <div className="event-card-header">
                        <span className="event-card-category">{evt.category}</span>
                        <h3 className="event-card-title">{evt.title}</h3>
                        <p className="event-card-date">
                          <Calendar size={14} /> {evt.date}
                        </p>
                      </div>

                      {/* Bottom Footer Button (Slides up from bottom +40px on hover) */}
                      <div className="event-card-footer">
                        <button
                          className={`event-card-btn ${isRegistered ? "registered" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEvent(evt)
                          }}
                        >
                          {isRegistered ? "Inscrit ✓" : "S'inscrire à l'événement"}
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Real-time Scroll Progress Bar at Bottom Right of Section */}
            <div className="events-progress-bar-container">
              <div className="events-progress-bar-track">
                <div className="events-progress-bar-fill"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Atelier Section (Reverse Pinned Horizontal Scroll: Left to Right, Text on Right) */}
        <section className="why-choose-section">
          <div className="why-choose-pinned-container">
            {/* Right Info Panel (Fades out when cards glide over it from left to right) */}
            <div className="why-choose-right-panel">
              <span className="why-choose-badge">— L'Excellence du Sur-Mesure</span>
              <h2 className="why-choose-title">
                Façonné pour votre <span className="calligraphy-title-accent">Silhouette</span><br />
                Pensé autour de votre allure.
              </h2>

              <ul className="why-choose-list">
                <li className="why-choose-list-item">
                  <span className="check-icon">✓</span>
                  <span>Un patronage individuel tracé selon vos mesures exactes</span>
                </li>
                <li className="why-choose-list-item">
                  <span className="check-icon">✓</span>
                  <span>Une sélection d'étoffes nobles : soie, dentelle de Calais &amp; organza</span>
                </li>
                <li className="why-choose-list-item">
                  <span className="check-icon">✓</span>
                  <span>Des essayages privés dédiés jusqu'au tombé parfait</span>
                </li>
              </ul>

              <div className="why-choose-actions-row">
                <button className="why-choose-cta-btn">
                  Prendre Rendez-Vous
                </button>
                <div className="why-choose-scroll-hint">
                  <div className="why-choose-scroll-indicator-line">
                    <span className="why-indicator-seg seg-3"></span>
                    <span className="why-indicator-seg seg-2"></span>
                    <span className="why-indicator-seg seg-1"></span>
                  </div>
                  <span>Défilez vers le bas</span>
                </div>
              </div>
            </div>

            {/* Cards Layer Gliding From Left to Right Over Right Text Area */}
            <div className="why-choose-cards-viewport">
              <div className="why-choose-cards-track">
                {whyChooseCards.map((card) => {
                  const isLiked = likedWhyCards.includes(card.id)
                  const toggleLike = (e: React.MouseEvent) => {
                    e.stopPropagation()
                    setLikedWhyCards((prev) =>
                      prev.includes(card.id) ? prev.filter((id) => id !== card.id) : [...prev, card.id]
                    )
                  }

                  return (
                    <article
                      key={card.id}
                      className="why-choose-card-item"
                      onClick={(e) => openWhyCardModal(card, e)}
                    >
                      {/* Image Layer: Clipped to top rounded frame with white borders at rest, expands to 100% full card on hover */}
                      <div className="why-choose-card-media">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="why-choose-card-img"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="why-choose-card-shade" />
                      </div>

                      {/* Top-Right Frosted Glass Heart Button (Appears on Hover like Card 1) */}
                      <button
                        type="button"
                        className={`why-choose-card-heart-top ${isLiked ? "liked" : ""}`}
                        onClick={toggleLike}
                        aria-label="Ajouter aux favoris"
                      >
                        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                      </button>

                      {/* Bottom Content Area */}
                      <div className="why-choose-card-content">
                        <div className="why-choose-card-text-group">
                          <h3 className="why-choose-card-heading">{card.title}</h3>
                          <p className="why-choose-card-sub">{card.subtitle}</p>
                        </div>

                        <div className="why-choose-card-meta">
                          <span className="why-choose-meta-item">
                            <Tag size={16} className="why-choose-meta-icon" />
                            <span>from <strong>{card.price}</strong></span>
                          </span>
                          <span className="why-choose-meta-item">
                            <Sparkles size={16} className="why-choose-meta-icon" />
                            <strong>{card.locationCode}</strong>
                          </span>
                        </div>

                        <div className="why-choose-card-actions">
                          <button
                            type="button"
                            className="why-choose-card-cta"
                            onClick={(e) => openWhyCardModal(card, e)}
                          >
                            {bookedWhySessions.includes(card.id) ? "Session Réservée ✓" : card.ctaText}
                          </button>
                          <button
                            type="button"
                            className={`why-choose-card-heart-bottom ${isLiked ? "liked" : ""}`}
                            onClick={toggleLike}
                            aria-label="Ajouter aux favoris"
                          >
                            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>

            {/* Real-time Scroll Progress Bar */}
            <div className="why-choose-progress-bar-container">
              <div className="why-choose-progress-bar-track">
                <div className="why-choose-progress-bar-fill"></div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: HAUTE COUTURE & SILHOUETTES SUR-MESURE — "L'ÉLÉGANCE FAÇONNÉE MAIN" */}
        <section className="lookbook-editorial-section">
          <div className="lookbook-editorial-container">
            {/* Top Architectural Index Header */}
            <div className="lookbook-header-bar">
              <div className="lookbook-header-left lookbook-reveal-header">
                <div className="lookbook-kicker-row">
                  <span className="lookbook-kicker-num">INDEX 05</span>
                  <span className="lookbook-kicker-line" />
                  <span className="lookbook-kicker-label">HAUTE COUTURE &amp; SILHOUETTES SUR-MESURE</span>
                </div>
                <h2 className="lookbook-main-title">
                  L'Élégance <span className="lookbook-serif-italic">Façonnée Main.</span>
                </h2>
              </div>

              <div className="lookbook-header-right lookbook-reveal-header">
                <p className="lookbook-header-manifesto">
                  Trois créations maîtresses photographiées à l'atelier. Survolez ou sélectionnez un repère numéroté sur la robe pour examiner l'architecture du corsage, le drapé de taille et l'ampleur de la traîne.
                </p>

                {/* Silhouette Switcher Tabs */}
                <div className="lookbook-silhouette-tabs" role="tablist" aria-label="Choisir une création couture">
                  {LOOKBOOK_SILHOUETTES.map((look, idx) => {
                    const isLookActive = idx === activeLookIdx
                    return (
                      <button
                        key={look.id}
                        type="button"
                        role="tab"
                        aria-selected={isLookActive}
                        className={`lookbook-silhouette-tab sliding-bg-btn ${isLookActive ? "active" : ""}`}
                        onClick={() => {
                          setActiveLookIdx(idx)
                          setActiveHotspotIdx(0)
                        }}
                      >
                        <span className="btn-sliding-bg" />
                        <span className="btn-sliding-content">
                          <span className="lookbook-tab-code">{look.code}</span>
                          <span className="lookbook-tab-name">{look.title}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Main 2-Column Editorial Stage */}
            <div className="lookbook-stage-grid">
              {/* Left Column: Interactive Full-Height Editorial Frame with Magnetic Hotspots */}
              <div className="lookbook-photo-column lookbook-reveal-stage">
                <div className="lookbook-photo-frame">
                  <img
                    key={currentLook.id}
                    src={currentLook.image}
                    alt={`${currentLook.title} — ${currentLook.serifSubtitle}`}
                    className="lookbook-photo-img"
                    style={{
                      transformOrigin: `${currentHotspot.x}% ${currentHotspot.y}%`,
                    }}
                  />
                  <div className="lookbook-photo-vignette" />

                  {/* Top-left film frame metadata */}
                  <div className="lookbook-frame-top-meta">
                    <span className="lookbook-frame-code">{currentLook.code}</span>
                    <span className="lookbook-frame-sep">/</span>
                    <span className="lookbook-frame-season">{currentLook.seasonNote}</span>
                  </div>

                  {/* Interactive Numbered Hotspots on the Silhouette */}
                  {currentLook.hotspots.map((spot, idx) => {
                    const isSpotActive = idx === activeHotspotIdx
                    const isFlipLeft = spot.x > 50
                    return (
                      <button
                        key={spot.id}
                        type="button"
                        className={`lookbook-hotspot-pin ${isSpotActive ? "active" : ""} ${isFlipLeft ? "pin-flip-left" : ""}`}
                        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                        onMouseEnter={() => setActiveHotspotIdx(idx)}
                        onClick={() => {
                          setActiveHotspotIdx(idx)
                          setSelectedMaterialHotspot(spot)
                        }}
                        aria-label={`Zone ${spot.indexLabel} : ${spot.materialName} (${spot.countryOrigin})`}
                      >
                        <span className="lookbook-hotspot-pulse" />
                        <span className="lookbook-hotspot-core">{spot.indexLabel}</span>
                        <span className="lookbook-hotspot-tag">
                          <span className="lookbook-hotspot-tag-part">{spot.partLabel} · {spot.countryFlag}</span>
                          <span className="lookbook-hotspot-tag-name">{spot.materialName}</span>
                        </span>
                      </button>
                    )
                  })}

                  {/* Bottom Editorial Caption Bar inside Photo */}
                  <div className="lookbook-frame-bottom-bar">
                    <div className="lookbook-frame-location">
                      <span className="lookbook-frame-serif">{currentLook.serifSubtitle}</span>
                      <span className="lookbook-frame-credit">{currentLook.photographer}</span>
                    </div>
                    <div className="lookbook-frame-total">
                      <span className="lookbook-frame-total-label">CRÉATION SUR-MESURE</span>
                      <span className="lookbook-frame-total-price">{currentLook.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Redesigned Haute Couture Patronage & Atelier Dossier */}
              <div className="lookbook-sheet-column lookbook-reveal-stage">
                {/* Sheet Top Header + 3-Metric Couture Atelier Ribbon */}
                <div className="lookbook-sheet-header">
                  <div className="lookbook-sheet-title-row">
                    <div>
                      <span className="lookbook-sheet-eyebrow">DOSSIER DE CONFECTION — {currentLook.code}</span>
                      <h3 className="lookbook-sheet-title">
                        {currentLook.title}{" "}
                        <span className="lookbook-sheet-subtitle-serif">({currentLook.serifSubtitle})</span>
                      </h3>
                    </div>
                    <span className="lookbook-sheet-piece-counter">
                      ZONE 0{activeHotspotIdx + 1} / 0{currentLook.hotspots.length}
                    </span>
                  </div>
                  <p className="lookbook-sheet-editorial-note">{currentLook.editorialNote}</p>

                  {/* New Couture Metrics Bar (Hours of Work, Fabric Meterage, Fittings) */}
                  <div className="lookbook-atelier-metrics-ribbon">
                    <div className="lookbook-metric-cell">
                      <span className="lookbook-metric-key">TEMPS DE FAÇONNAGE</span>
                      <strong className="lookbook-metric-val">{currentLook.hoursOfWork}</strong>
                    </div>
                    <div className="lookbook-metric-cell">
                      <span className="lookbook-metric-key">MÉTRAGE D'ÉTOFFE</span>
                      <strong className="lookbook-metric-val">{currentLook.fabricMeterage}</strong>
                    </div>
                    <div className="lookbook-metric-cell">
                      <span className="lookbook-metric-key">ACCOMPAGNEMENT</span>
                      <strong className="lookbook-metric-val">{currentLook.fittingsCount}</strong>
                    </div>
                  </div>
                </div>

                {/* Active Couture Zone Card with Live Optical Loupe (100% Precise Geometric Centering) */}
                <div className="lookbook-spotlight-card lookbook-couture-dossier-card" key={currentHotspot.id}>
                  <div
                    className="lookbook-spotlight-media lookbook-loupe-media"
                    onClick={() => setSelectedMaterialHotspot(currentHotspot)}
                    style={{ cursor: "pointer" }}
                    title="Cliquer pour ouvrir le dossier matière détaillé"
                  >
                    <span className="lookbook-spotlight-index-badge">LOUPE {currentHotspot.indexLabel}</span>
                    <div
                      className="lookbook-optical-loupe"
                      role="img"
                      aria-label={`Détail optique : ${currentHotspot.zoneTitle} (${currentHotspot.materialName})`}
                    >
                      <img
                        src={currentLook.image}
                        alt={currentHotspot.zoneTitle}
                        className="lookbook-loupe-zoomed-img"
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transformOrigin: `${currentHotspot.x}% ${currentHotspot.y}%`,
                          transform: `translate(-${currentHotspot.x}%, -${currentHotspot.y}%) scale(3.2)`,
                        }}
                      />
                      <div className="lookbook-loupe-crosshair">
                        <span className="loupe-ring" />
                        <span className="loupe-dot" />
                      </div>
                    </div>
                  </div>

                  <div className="lookbook-spotlight-body">
                    <div className="lookbook-spotlight-top-group">
                      <div className="lookbook-spotlight-meta-top">
                        <span className="lookbook-spotlight-part">{currentHotspot.partLabel}</span>
                        <span className="lookbook-spotlight-origin-badge">
                          {currentHotspot.countryFlag} {currentHotspot.countryOrigin}
                        </span>
                      </div>

                      <h4 className="lookbook-spotlight-name">{currentHotspot.materialName}</h4>
                      <p className="lookbook-spotlight-material">
                        <strong className="text-[#29251c]">{currentHotspot.zoneTitle}</strong> · {currentHotspot.materialNote}
                      </p>
                      <p className="lookbook-spotlight-desc">{currentHotspot.stylingNote}</p>
                    </div>

                    {/* Architectural & Couture Specifications Grid */}
                    <div className="lookbook-spotlight-specs-grid">
                      <div className="lookbook-spotlight-spec-item">
                        <span className="lookbook-spotlight-spec-label">ATELIER &amp; SAVOIR-FAIRE</span>
                        <span className="lookbook-spotlight-spec-val">{currentHotspot.craftOrigin}</span>
                      </div>
                      <div className="lookbook-spotlight-spec-item">
                        <span className="lookbook-spotlight-spec-label">TECHNIQUE DE COUTURE</span>
                        <span className="lookbook-spotlight-spec-val">{currentHotspot.techSpec}</span>
                      </div>
                      <div className="lookbook-spotlight-spec-item">
                        <span className="lookbook-spotlight-spec-label">MÉTRAGE &amp; DENSITÉ</span>
                        <span className="lookbook-spotlight-spec-val">{currentHotspot.weightSpec}</span>
                      </div>
                    </div>

                    {/* Available Finishes (Colors) & Bespoke Sizes Preview */}
                    <div className="lookbook-spotlight-variants-row">
                      <div className="lookbook-spotlight-swatches-group">
                        <span className="lookbook-spotlight-variant-label">NUANCIER DE SOIE</span>
                        <div className="lookbook-spotlight-swatches">
                          {currentHotspotProduct.colors.map((c, cIdx) => (
                            <span
                              key={cIdx}
                              className="lookbook-spotlight-swatch"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="lookbook-spotlight-sizes-group">
                        <span className="lookbook-spotlight-variant-label">PATRONAGE &amp; TAILLES</span>
                        <div className="lookbook-spotlight-size-pills">
                          {currentHotspotProduct.sizes.slice(0, 4).map((sz, sIdx) => (
                            <span key={sIdx} className="lookbook-spotlight-size-pill">
                              {sz}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lookbook-spotlight-actions">
                      <button
                        type="button"
                        className="lookbook-inspect-btn lookbook-material-dossier-btn"
                        onClick={() => setSelectedMaterialHotspot(currentHotspot)}
                      >
                        <Sparkles size={16} />
                        <span>Fiche Matière &amp; Origine</span>
                        <ArrowUpRight size={17} />
                      </button>
                      <button
                        type="button"
                        className="lookbook-quick-bag-btn"
                        onClick={() => {
                          setQuickAddedLookbookItems((prev) =>
                            prev.includes(currentHotspot.id)
                              ? prev
                              : [...prev, currentHotspot.id]
                          )
                        }}
                      >
                        {quickAddedLookbookItems.includes(currentHotspot.id)
                          ? "Zone Sélectionnée ✓"
                          : "+ Demander un essayage"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Complete 3-Zone Couture Anatomy List (with 100% Precise Mini Optical Loupes) */}
                <div className="lookbook-nomenclature-list">
                  <div className="lookbook-nomenclature-head">
                    <span>ARCHITECTURE DES 3 ZONES DE LA ROBE</span>
                    <span>FICHE MATIÈRE &amp; ORIGINE (CLIQUEZ POUR DÉTAIL)</span>
                  </div>

                  {currentLook.hotspots.map((spot, idx) => {
                    const isRowActive = idx === activeHotspotIdx
                    return (
                      <div
                        key={spot.id}
                        role="button"
                        tabIndex={0}
                        className={`lookbook-nomenclature-row ${isRowActive ? "active" : ""}`}
                        onMouseEnter={() => setActiveHotspotIdx(idx)}
                        onClick={() => {
                          setActiveHotspotIdx(idx)
                          setSelectedMaterialHotspot(spot)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            setActiveHotspotIdx(idx)
                            setSelectedMaterialHotspot(spot)
                          }
                        }}
                      >
                        <span className="lookbook-row-index">{spot.indexLabel}</span>
                        <div
                          className="lookbook-row-thumb-wrap lookbook-row-loupe-thumb"
                          style={{ position: "relative", overflow: "hidden" }}
                          aria-hidden="true"
                        >
                          <img
                            src={currentLook.image}
                            alt=""
                            style={{
                              position: "absolute",
                              left: "50%",
                              top: "50%",
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transformOrigin: `${spot.x}% ${spot.y}%`,
                              transform: `translate(-${spot.x}%, -${spot.y}%) scale(3.2)`,
                            }}
                          />
                        </div>
                        <div className="lookbook-row-info">
                          <span className="lookbook-row-name">
                            {spot.materialName}{" "}
                            <span className="lookbook-row-flag">{spot.countryFlag}</span>
                          </span>
                          <span className="lookbook-row-note">
                            {spot.partLabel} · {spot.countryOrigin}
                          </span>
                        </div>
                        <div className="lookbook-row-right">
                          <span className="lookbook-row-price">{spot.archiveRef}</span>
                          <button
                            type="button"
                            className="lookbook-row-open-modal"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveHotspotIdx(idx)
                              setSelectedMaterialHotspot(spot)
                            }}
                            aria-label={`Ouvrir le dossier matière pour ${spot.materialName}`}
                          >
                            <ArrowUpRight size={15} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: PARCOURS DE CRÉATION & EXPÉRIENCE ATELIER — "DE L'ESQUISSE À LA ROBE RÊVÉE" */}
        <section className="flagship-studios-section">
          <div className="flagship-studios-container">
            {/* Editorial Section Header */}
            <div className="flagship-header-bar">
              <div className="flagship-header-left flagship-reveal-header">
                <div className="lookbook-kicker-row">
                  <span className="lookbook-kicker-num">INDEX 06</span>
                  <span className="lookbook-kicker-line" />
                  <span className="lookbook-kicker-label">PARCOURS DE CRÉATION &amp; EXPÉRIENCE ATELIER</span>
                </div>
                <h2 className="flagship-main-title">
                  De l'Esquisse <span className="lookbook-serif-italic">à la Robe Rêvée.</span>
                </h2>
              </div>

              <div className="flagship-header-right flagship-reveal-header">
                <p className="flagship-header-desc">
                  Cinq étapes d'accompagnement sur-mesure au cœur de notre maison de couture. Du premier croquis aquarellé jusqu'à l'essayage final, chaque robe naît d'un dialogue intime entre vos envies et la main de l'artisane.
                </p>
                <div className="flagship-city-pills">
                  {FLAGSHIP_STUDIOS.map((studio) => (
                    <button
                      key={studio.id}
                      type="button"
                      className={`flagship-city-pill sliding-bg-btn ${activeStudioId === studio.id ? "active" : ""}`}
                      onClick={() => setActiveStudioId(studio.id)}
                    >
                      <span className="btn-sliding-bg" />
                      <span className="btn-sliding-content">
                        <span>{studio.code}</span>
                        <span className="flagship-pill-city-name">{studio.city}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5-Monolith Expanding Couture Creation Accordion */}
            <div className="flagship-accordion-track">
              {FLAGSHIP_STUDIOS.map((studio) => {
                const isExpanded = activeStudioId === studio.id
                const isVisitReserved = reservedStudioVisits.includes(studio.id)
                return (
                  <article
                    key={studio.id}
                    className={`flagship-monolith-panel ${isExpanded ? "expanded" : "collapsed"}`}
                    onClick={() => setActiveStudioId(studio.id)}
                    onMouseEnter={() => setActiveStudioId(studio.id)}
                  >
                    {/* Background Couture Photograph */}
                    <div className="flagship-monolith-media">
                      <img src={studio.image} alt={`${studio.city} — ${studio.district}`} className="flagship-monolith-img" />
                      <div className="flagship-monolith-scrim" />
                    </div>

                    {/* Collapsed Vertical Spine Overlay (Visible when panel is narrow) */}
                    <div className="flagship-collapsed-spine">
                      <span className="flagship-spine-index">{studio.index}</span>
                      <span className="flagship-spine-code">{studio.code}</span>
                      <div className="flagship-spine-city-vertical">{studio.city}</div>
                      <span className="flagship-spine-plus">+</span>
                    </div>

                    {/* Expanded Couture Dossier Content */}
                    <div className="flagship-expanded-dossier">
                      {/* Top Telemetry Bar */}
                      <div className="flagship-dossier-top">
                        <div className="flagship-dossier-code-group">
                          <span className="flagship-dossier-index">{studio.index}</span>
                          <span className="flagship-dossier-divider">/</span>
                          <span className="flagship-dossier-code">{studio.code} — ÉTAPE SUR-MESURE</span>
                        </div>
                        <div className="flagship-dossier-telemetry">
                          <span className="flagship-telemetry-coords">{studio.coordinates}</span>
                          <span className="flagship-telemetry-time">
                            <span className="flagship-live-dot" />
                            {studio.localTime}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Couture Step Details */}
                      <div className="flagship-dossier-bottom">
                        <div className="flagship-dossier-Identity">
                          <span className="flagship-dossier-district">{studio.district}</span>
                          <h3 className="flagship-dossier-city">{studio.city}</h3>
                          <p className="flagship-dossier-address">{studio.address}</p>
                        </div>

                        {/* Couture Step Ledger Grid */}
                        <div className="flagship-spec-grid">
                          <div className="flagship-spec-cell">
                            <span className="flagship-spec-label">ARTISANAT &amp; DIRECTION</span>
                            <span className="flagship-spec-val">{studio.architect}</span>
                          </div>
                          <div className="flagship-spec-cell">
                            <span className="flagship-spec-label">DURÉE &amp; ACCOMPAGNEMENT</span>
                            <span className="flagship-spec-val">
                              {studio.surface} · {studio.hours}
                            </span>
                          </div>
                          <div className="flagship-spec-cell flagship-spec-cell-wide">
                            <span className="flagship-spec-label">ÉTOFFES &amp; OUTILS D'ATELIER</span>
                            <span className="flagship-spec-val">{studio.materials}</span>
                          </div>
                        </div>

                        {/* Deliverables & Animated Sliding-Background Action Button */}
                        <div className="flagship-dossier-footer">
                          <div className="flagship-spaces-list">
                            {studio.spaces.map((space, sIdx) => (
                              <span key={sIdx} className="flagship-space-tag">
                                {space}
                              </span>
                            ))}
                          </div>

                          <button
                            type="button"
                            className={`flagship-visit-btn sliding-bg-btn ${isVisitReserved ? "reserved" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              setReservedStudioVisits((prev) =>
                                prev.includes(studio.id)
                                  ? prev.filter((id) => id !== studio.id)
                                  : [...prev, studio.id]
                              )
                            }}
                          >
                            <span className="btn-sliding-bg" />
                            <span className="btn-sliding-content">
                              <span>
                                {isVisitReserved ? "Rendez-vous Couture Confirmé ✓" : "Réserver cette étape à l'atelier"}
                              </span>
                              <ArrowUpRight size={16} />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3: NOBLESSE DES ÉTOFFES & SECRETS DE CONFECTION — "L'ART DU SAVOIR-FAIRE" */}
        <section className="craft-anatomy-section">
          <div className="craft-anatomy-container">
            {/* Top Architectural Header + 3-Layer Selector */}
            <div className="craft-header-bar">
              <div className="craft-header-left craft-reveal-header">
                <div className="lookbook-kicker-row">
                  <span className="lookbook-kicker-num">INDEX 07</span>
                  <span className="lookbook-kicker-line" />
                  <span className="lookbook-kicker-label">NOBLESSE DES ÉTOFFES &amp; SECRETS DE CONFECTION</span>
                </div>
                <h2 className="craft-main-title">
                  L'Art du <span className="lookbook-serif-italic">Savoir-Faire.</span>
                </h2>
              </div>

              <div className="craft-header-right craft-reveal-header">
                <p className="craft-header-desc">
                  Plongez au cœur de nos techniques de Haute Couture. Sélectionnez un pilier de confection puis faites glisser le curseur optique pour comparer le tombé extérieur et la structure interne du vêtement.
                </p>

                {/* 3-Layer Interactive Selector */}
                <div className="craft-layer-tabs" role="tablist" aria-label="Sélecteur de savoir-faire couture">
                  {CRAFT_ANATOMY_LAYERS.map((layer, idx) => {
                    const isLayerActive = idx === activeCraftLayerIdx
                    return (
                      <button
                        key={layer.id}
                        type="button"
                        role="tab"
                        aria-selected={isLayerActive}
                        className={`craft-layer-tab sliding-bg-btn ${isLayerActive ? "active" : ""}`}
                        onClick={() => {
                          setActiveCraftLayerIdx(idx)
                          setActiveCraftCalloutIdx(0)
                        }}
                      >
                        <span className="btn-sliding-bg" />
                        <span className="btn-sliding-content">
                          <span className="craft-tab-num">{layer.index}. {layer.tabTitle}</span>
                          <span className="craft-tab-sub">{layer.tabSub}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Central 2-Column Stage: Left Interactive Couture Split Comparator + Right Redesigned Savoir-Faire Dossier */}
            <div className="craft-stage-grid">
              {/* Left Column: Sliding Split-Screen Visual Comparator */}
              <div className="craft-comparator-column craft-reveal-stage">
                <div
                  ref={craftComparatorRef}
                  className="craft-comparator-viewport"
                  onMouseDown={(e) => {
                    isDraggingCraftRef.current = true
                    updateCraftSliderFromClientX(e.clientX)
                  }}
                  onMouseMove={(e) => {
                    if (isDraggingCraftRef.current || e.buttons === 1) {
                      updateCraftSliderFromClientX(e.clientX)
                    }
                  }}
                  onMouseUp={() => {
                    isDraggingCraftRef.current = false
                  }}
                  onMouseLeave={() => {
                    isDraggingCraftRef.current = false
                  }}
                  onTouchMove={(e) => {
                    if (e.touches[0]) {
                      updateCraftSliderFromClientX(e.touches[0].clientX)
                    }
                  }}
                >
                  {/* Base Layer (Right side exposed): Internal Couture Structure View */}
                  <div className="craft-layer-blueprint">
                    <img
                      key={`bp-${currentCraftLayer.id}`}
                      src={currentCraftLayer.blueprintImage}
                      alt={`${currentCraftLayer.title} — Structure Interne`}
                      className="craft-comparator-img craft-img-xray"
                      draggable={false}
                    />
                    <div className="craft-xray-grid-overlay" />

                    {/* Technical SVG Reticle Overlay */}
                    <svg className="craft-xray-svg" viewBox="0 0 800 700" preserveAspectRatio="none">
                      <circle cx="400" cy="350" r="210" fill="none" stroke="rgba(251,250,247,0.18)" strokeWidth="1" strokeDasharray="4 6" />
                      <circle cx="400" cy="350" r="310" fill="none" stroke="rgba(251,250,247,0.1)" strokeWidth="1" />
                      <line x1="0" y1="350" x2="800" y2="350" stroke="rgba(251,250,247,0.1)" strokeWidth="1" />
                      <line x1="400" y1="0" x2="400" y2="700" stroke="rgba(251,250,247,0.1)" strokeWidth="1" />
                    </svg>

                    {/* Interactive Couture Callout Markers */}
                    {currentCraftLayer.callouts.map((callout, cIdx) => {
                      const isCalloutActive = cIdx === activeCraftCalloutIdx
                      return (
                        <button
                          key={callout.code}
                          type="button"
                          className={`craft-xray-callout ${isCalloutActive ? "active" : ""}`}
                          style={{ left: `${callout.x}%`, top: `${callout.y}%` }}
                          onMouseEnter={() => setActiveCraftCalloutIdx(cIdx)}
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveCraftCalloutIdx(cIdx)
                          }}
                        >
                          <span className="craft-callout-code">{callout.code}</span>
                          <span className="craft-callout-card">
                            <span className="craft-callout-title">{callout.title}</span>
                            <span className="craft-callout-spec">{callout.spec}</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Clipped Top Layer (Left side exposed): Exterior Couture Drape View */}
                  <div
                    className="craft-layer-surface"
                    style={{
                      clipPath: `inset(0 ${100 - craftSliderPos}% 0 0)`,
                    }}
                  >
                    <img
                      key={`sf-${currentCraftLayer.id}`}
                      src={currentCraftLayer.surfaceImage}
                      alt={`${currentCraftLayer.title} — Tombé Externe`}
                      className="craft-comparator-img craft-img-surface"
                      draggable={false}
                    />
                    <div className="craft-surface-vignette" />
                  </div>

                  {/* Top Corner Mode Badges */}
                  <div className="craft-viewport-top-badges">
                    <span className="craft-mode-badge craft-mode-badge-light">
                      {currentCraftLayer.surfaceLabel}
                    </span>
                    <span className="craft-mode-badge craft-mode-badge-dark">
                      {currentCraftLayer.blueprintLabel}
                    </span>
                  </div>

                  {/* Sliding Vertical Divider Line & Handle */}
                  <div
                    className="craft-slider-divider"
                    style={{ left: `${craftSliderPos}%` }}
                  >
                    <div className="craft-slider-handle" aria-hidden="true">
                      <ChevronLeft size={14} />
                      <span className="craft-slider-handle-code">COUTURE</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>

                  {/* Accessible Range Input + Quick Preset Bar at Bottom of Viewport */}
                  <div
                    className="craft-viewport-bottom-bar"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="craft-viewport-presets">
                      <button
                        type="button"
                        className={`craft-preset-btn ${craftSliderPos > 80 ? "active" : ""}`}
                        onClick={() => setCraftSliderPos(88)}
                      >
                        Tombé Externe
                      </button>
                      <button
                        type="button"
                        className={`craft-preset-btn ${craftSliderPos >= 35 && craftSliderPos <= 65 ? "active" : ""}`}
                        onClick={() => setCraftSliderPos(50)}
                      >
                        Coupe 50 / 50
                      </button>
                      <button
                        type="button"
                        className={`craft-preset-btn ${craftSliderPos < 25 ? "active" : ""}`}
                        onClick={() => setCraftSliderPos(12)}
                      >
                        Structure Interne
                      </button>
                    </div>

                    <div className="craft-range-control">
                      <span className="craft-range-label">CURSEUR D'INSPECTION</span>
                      <input
                        type="range"
                        min={6}
                        max={94}
                        value={Math.round(craftSliderPos)}
                        onChange={(e) => setCraftSliderPos(Number(e.target.value))}
                        className="craft-range-input"
                        aria-label="Curseur de comparaison entre tombé externe et structure interne"
                      />
                      <span className="craft-range-pct">{Math.round(craftSliderPos)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Redesigned Haute Couture Savoir-Faire & Matières Dossier */}
              <div className="craft-dossier-column craft-reveal-stage" key={currentCraftLayer.id}>
                <div className="craft-dossier-header">
                  <div className="craft-dossier-meta-row">
                    <span className="craft-dossier-code">{currentCraftLayer.code}</span>
                    <span className="craft-dossier-lab">{currentCraftLayer.labLocation}</span>
                  </div>
                  <h3 className="craft-dossier-title">
                    {currentCraftLayer.title}{" "}
                    <span className="lookbook-sheet-subtitle-serif">({currentCraftLayer.serifSubtitle})</span>
                  </h3>
                  <p className="craft-dossier-desc">{currentCraftLayer.description}</p>
                </div>

                {/* Redesigned Couture Architecture Cards (3-Card Interactive Matrix) */}
                <div className="craft-callouts-ledger">
                  <div className="craft-subhead-row">
                    <span>POINTS DE MAÎTRISE COUTURE</span>
                    <span>EXIGENCE D'ATELIER</span>
                  </div>
                  <div className="craft-couture-cards-grid">
                    {currentCraftLayer.callouts.map((cItem, cIdx) => {
                      const isCurrent = cIdx === activeCraftCalloutIdx
                      return (
                        <div
                          key={cItem.code}
                          role="button"
                          tabIndex={0}
                          className={`craft-couture-pillar-card ${isCurrent ? "active" : ""}`}
                          onMouseEnter={() => setActiveCraftCalloutIdx(cIdx)}
                          onClick={() => {
                            setActiveCraftCalloutIdx(cIdx)
                            if (craftSliderPos > 60) {
                              setCraftSliderPos(24)
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              setActiveCraftCalloutIdx(cIdx)
                            }
                          }}
                        >
                          <div className="craft-pillar-card-top">
                            <span className="craft-callout-row-code">{cItem.code}</span>
                            <span className="craft-pillar-step-tag">POINT N°0{cIdx + 1}</span>
                          </div>
                          <span className="craft-callout-row-title">{cItem.title}</span>
                          <span className="craft-callout-row-spec">{cItem.spec}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Calibrated Couture Quality Benchmarks */}
                <div className="craft-benchmarks-block">
                  <div className="craft-subhead-row">
                    <span>INDICES DE QUALITÉ DES ÉTOFFES</span>
                    <span>BARÈME HAUTE COUTURE</span>
                  </div>
                  <div className="craft-benchmarks-list">
                    {currentCraftLayer.benchmarks.map((bm, bIdx) => (
                      <div key={bIdx} className="craft-benchmark-item">
                        <div className="craft-benchmark-top">
                          <span className="craft-benchmark-label">{bm.label}</span>
                          <span className="craft-benchmark-val">{bm.value}</span>
                        </div>
                        <div className="craft-benchmark-bar-track">
                          <div
                            className="craft-benchmark-bar-fill"
                            style={{ width: `${bm.fillPercent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Couture Seal + 3-Pillar Guarantee Strip */}
                <div className="craft-protocol-box craft-couture-seal-box">
                  <div className="craft-seal-header">
                    <span className="craft-protocol-label">SCEAU D'EXCELLENCE &amp; FINITION MAIN</span>
                    <span className="craft-seal-badge">CERTIFIÉ SUR-MESURE</span>
                  </div>
                  <p className="craft-protocol-text">{currentCraftLayer.protocolNote}</p>
                </div>

                <div className="craft-specs-strip">
                  <div className="craft-spec-pill-box">
                    <span className="craft-spec-key">FINITION</span>
                    <span className="craft-spec-value">{currentCraftLayer.specs.norm}</span>
                  </div>
                  <div className="craft-spec-pill-box">
                    <span className="craft-spec-key">PRÉCISION</span>
                    <span className="craft-spec-value">{currentCraftLayer.specs.tolerance}</span>
                  </div>
                  <div className="craft-spec-pill-box">
                    <span className="craft-spec-key">TENUE</span>
                    <span className="craft-spec-value">{currentCraftLayer.specs.lifespan}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 4-Column Animated Numeric Counters Ledger */}
            <div className="craft-counters-ledger">
              {CRAFT_COUNTERS.map((counter) => (
                <div key={counter.id} className="craft-counter-card">
                  <div className="craft-counter-top-line">
                    <span className="craft-counter-index">INDICATEUR {counter.index}</span>
                    <span className="craft-counter-dot" />
                  </div>
                  <div
                    className="craft-counter-num"
                    data-target={counter.target}
                    data-decimals={counter.decimals}
                    data-prefix={counter.prefix}
                    data-suffix={counter.suffix}
                  >
                    {counter.prefix}
                    {counter.decimals > 0
                      ? counter.target.toFixed(counter.decimals)
                      : counter.target >= 1000
                        ? counter.target.toLocaleString("fr-FR")
                        : counter.target}
                    {counter.suffix}
                  </div>
                  <h4 className="craft-counter-label">{counter.label}</h4>
                  <p className="craft-counter-detail">{counter.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Product Detail Modal Popup with GSAP Image Extension Animation (80% width, large image & enriched Couture specs) */}
      {selectedProduct && (() => {
        const coutureSpecs = getProductCoutureSpecs(selectedProduct)
        const isFittingBooked = bookedFittingIds.includes(selectedProduct.id)
        return (
          <div
            ref={productModalBackdropRef}
            className="product-modal-backdrop product-modal-backdrop-ext"
            onClick={closeProductModal}
          >
            <div
              ref={productModalCardRef}
              className="product-modal-card product-modal-card-ext"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="product-modal-close"
                onClick={closeProductModal}
                aria-label="Fermer"
              >
                <X size={20} />
              </button>

              <div className="product-modal-body product-modal-body-ext">
                {/* Left Column: Huge Full-Bleed Image with Extension Animation */}
                <div
                  ref={productModalImageColRef}
                  className={`product-modal-image-col product-modal-image-col-ext ${selectedProduct.color}`}
                >
                  {selectedProduct.badge && (
                    <span className="product-modal-badge">{selectedProduct.badge}</span>
                  )}
                  <img
                    ref={productModalImgRef}
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="product-modal-img product-modal-img-ext"
                  />

                  <div className="product-modal-img-caption">
                    <div className="product-modal-img-caption-top">
                      <span className="caption-pulse-dot" />
                      <span>MAISON SOIE &amp; COUTURE · PIÈCE FAÇONNÉE MAIN</span>
                    </div>
                    <p className="product-modal-img-caption-sub">
                      {coutureSpecs.leadTime} • {coutureSpecs.fittings}
                    </p>
                  </div>
                </div>

                {/* Right Column: Enriched Haute Couture Details & Specifications */}
                <div
                  ref={productModalDetailsColRef}
                  className="product-modal-details-col product-modal-details-col-ext"
                >
                  <div className="product-modal-header product-modal-stagger-item">
                    <span className="product-modal-category">{selectedProduct.category}</span>
                    <span className="product-modal-model-badge">Réf: {selectedProduct.model}</span>
                    <span className="product-modal-atelier-tag">Sur-Mesure Atelier</span>
                  </div>

                  <h2 className="product-modal-title product-modal-stagger-item">
                    {selectedProduct.name}
                  </h2>

                  <div className="product-modal-price-row product-modal-stagger-item">
                    <span className="product-modal-price">{selectedProduct.price}</span>
                    <div className="product-modal-rating">
                      <span className="star">★</span>
                      <span className="rating-score">{selectedProduct.rating}</span>
                      <span className="rating-count">({selectedProduct.reviewsCount} avis vérifiés)</span>
                    </div>
                  </div>

                  <p className="product-modal-description product-modal-stagger-item">
                    {selectedProduct.longDescription}
                  </p>

                  {/* Enriched Section 1: 3-Column Haute Couture Technical Cards */}
                  <div className="product-modal-specs-grid product-modal-stagger-item">
                    <div className="product-modal-spec-card">
                      <span className="spec-card-label">ÉTOFFE NOBLE</span>
                      <strong className="spec-card-value">{coutureSpecs.fabric}</strong>
                    </div>
                    <div className="product-modal-spec-card">
                      <span className="spec-card-label">TEMPS D'ATELIER</span>
                      <strong className="spec-card-value">{coutureSpecs.craftHours}</strong>
                    </div>
                    <div className="product-modal-spec-card">
                      <span className="spec-card-label">ACCOMPAGNEMENT</span>
                      <strong className="spec-card-value">{coutureSpecs.fittings}</strong>
                    </div>
                  </div>

                  {/* Enriched Section 2: Architecture & Savoir-Faire Note */}
                  <div className="product-modal-architecture-box product-modal-stagger-item">
                    <div className="architecture-box-head">
                      <Sparkles size={15} />
                      <span>ARCHITECTURE &amp; FINITIONS COUTURE</span>
                    </div>
                    <p>{coutureSpecs.structureNote}</p>
                  </div>

                  {/* Choice of Colors & Sizes side-by-side or stacked cleanly */}
                  <div className="product-modal-options-row product-modal-stagger-item">
                    <div className="product-modal-option-group">
                      <label className="product-modal-option-label">
                        Nuancier : <strong>{selectedProduct.colors[selectedColorIndex]?.name}</strong>
                      </label>
                      <div className="product-modal-color-swatches">
                        {selectedProduct.colors.map((color, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`color-swatch-btn ${idx === selectedColorIndex ? "active" : ""}`}
                            onClick={() => setSelectedColorIndex(idx)}
                            title={color.name}
                            style={{ backgroundColor: color.hex }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="product-modal-option-group">
                      <label className="product-modal-option-label">
                        Taille / Coupe : <strong>{selectedSize}</strong>
                      </label>
                      <div className="product-modal-size-grid">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            className={`size-option-btn ${selectedSize === size ? "active" : ""}`}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Enriched Section 3: Atelier Guarantees Strip */}
                  <div className="product-modal-guarantees product-modal-stagger-item">
                    <div className="guarantee-pill">
                      <CheckCircle2 size={14} />
                      <span>Prise de mesures offerte en salon</span>
                    </div>
                    <div className="guarantee-pill">
                      <CheckCircle2 size={14} />
                      <span>Retouches incluses jusqu'au Jour J</span>
                    </div>
                    <div className="guarantee-pill">
                      <CheckCircle2 size={14} />
                      <span>Housse couture &amp; certificat inclus</span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="product-modal-actions product-modal-actions-ext product-modal-stagger-item">
                    <button
                      type="button"
                      className="product-modal-add-cart-btn"
                      onClick={() => {
                        alert(
                          `Ajouté au panier : ${selectedProduct.name} (${selectedProduct.colors[selectedColorIndex]?.name}, ${selectedSize})`
                        )
                        closeProductModal()
                      }}
                    >
                      <span>Commander cette création • {selectedProduct.price}</span>
                    </button>

                    <button
                      type="button"
                      className={`product-modal-fitting-btn ${isFittingBooked ? "booked" : ""}`}
                      onClick={() => {
                        setBookedFittingIds((prev) =>
                          prev.includes(selectedProduct.id)
                            ? prev
                            : [...prev, selectedProduct.id]
                        )
                      }}
                    >
                      <Calendar size={16} />
                      <span>
                        {isFittingBooked ? "Essayage Privé Réservé ✓" : "Réserver un Essayage"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Event Detail Modal Popup */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="product-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className="event-modal-card"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              onScroll={(e) => {
                const target = e.currentTarget
                const elements = target.querySelectorAll('.gsap-scroll-reveal')
                const modalHeight = target.clientHeight
                elements.forEach((el) => {
                  const rect = el.getBoundingClientRect()
                  const containerRect = target.getBoundingClientRect()
                  const topOffset = rect.top - containerRect.top
                  
                  if (topOffset < modalHeight * 0.95 && topOffset > -rect.height * 0.5) {
                    gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" })
                  } else if (topOffset >= modalHeight * 0.95) {
                    gsap.to(el, { opacity: 0.15, y: 25, duration: 0.4, ease: "power2.out", overwrite: "auto" })
                  } else if (topOffset <= -rect.height * 0.5) {
                    gsap.to(el, { opacity: 0, y: -20, duration: 0.4, ease: "power2.out", overwrite: "auto" })
                  }
                })
              }}
            >
              <button
                className="product-modal-close"
                onClick={() => setSelectedEvent(null)}
                aria-label="Fermer"
              >
                <X size={20} />
              </button>

              {/* Event Hero Cover Header (Occupies 100% of initial popup fold) */}
              <div className="event-modal-hero">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="event-modal-hero-img" />
                
                {/* Transparent to solid dark gradient background overlay behind text elements */}
                <div className="event-modal-hero-overlay" />
                
                <div className="event-modal-hero-bottom">
                  {/* Category & Date Badges */}
                  <div className="event-modal-hero-badges">
                    <span className="event-modal-category-badge">{selectedEvent.category}</span>
                    <span className="event-modal-date-badge">
                      <Calendar size={14} /> {selectedEvent.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="event-modal-hero-title">{selectedEvent.title}</h2>

                  {/* Subtitle Description */}
                  <p className="event-modal-hero-subtitle">{selectedEvent.subtitle}</p>

                  {/* Location & Time Meta Bar */}
                  <div className="event-modal-meta-bar">
                    <div className="meta-item">
                      <MapPin size={18} className="meta-icon" />
                      <div>
                        <span className="meta-label">Lieu</span>
                        <strong className="meta-value">{selectedEvent.location}</strong>
                      </div>
                    </div>
                    <div className="meta-item">
                      <Clock size={18} className="meta-icon" />
                      <div>
                        <span className="meta-label">Date &amp; Horaire</span>
                        <strong className="meta-value">{selectedEvent.date}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Event Details (Hidden completely below the initial fold, revealed smoothly upon scrolling) */}
              <div className="event-modal-content">
                {/* Speaker Spotlight Card */}
                <div className="event-speaker-box gsap-scroll-reveal">
                  <div className="speaker-monogram-avatar" aria-hidden="true">
                    {selectedEvent.speaker.initials}
                  </div>
                  <div>
                    <span className="speaker-kicker">Direction d'Atelier</span>
                    <h4 className="speaker-name">{selectedEvent.speaker.name}</h4>
                    <p className="speaker-role">{selectedEvent.speaker.role}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="event-modal-section gsap-scroll-reveal">
                  <h3 className="section-heading">À propos de l'événement</h3>
                  <p className="event-modal-description">{selectedEvent.description}</p>
                </div>

                {/* Agenda / Highlights Timeline */}
                <div className="event-modal-section gsap-scroll-reveal">
                  <h3 className="section-heading">Programme &amp; Temps Forts</h3>
                  <ul className="event-highlights-list">
                    {selectedEvent.highlights.map((item, idx) => (
                      <li key={idx} className="highlight-item">
                        <span className="highlight-bullet">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Perks Included */}
                <div className="event-modal-section gsap-scroll-reveal">
                  <h3 className="section-heading">Inclus dans votre inscription</h3>
                  <div className="event-perks-grid">
                    {selectedEvent.perks.map((perk, idx) => (
                      <div key={idx} className="perk-chip">
                        <CheckCircle2 size={16} className="perk-icon" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formulaire Nominatif Personnalisé (Effect-21 + Date Fixe) */}
                <div className="event-modal-form-section gsap-scroll-reveal">
                  <div className="event-fixed-date-banner">
                    <div className="fixed-date-icon">
                      <FontAwesomeIcon icon={faCalendarCheck} />
                    </div>
                    <div className="fixed-date-info">
                      <span className="fixed-date-kicker">DATE &amp; HORAIRE FIXÉS POUR CETTE ÉDITION</span>
                      <strong className="fixed-date-val">{selectedEvent.date}</strong>
                      <span className="fixed-date-loc">Lieu : {selectedEvent.location}</span>
                    </div>
                  </div>

                  <h3 className="section-heading" style={{ marginTop: "1.25rem" }}>
                    Inscription Nominative Personnalisée
                  </h3>
                  <p className="event-modal-description" style={{ fontSize: "0.88rem" }}>
                    Les invitations pour cet atelier sont strictement personnelles et nominatives. Veuillez renseigner les informations du participant.
                  </p>

                  <div className="event-form-grid">
                    {/* Nom & Prénom with effect-21 */}
                    <div className="input-effect-wrap">
                      <div className="effect-21-icon">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div className="input-effect">
                        <input
                          className={`effect-21 ${eventClientName ? "has-content" : ""}`}
                          type="text"
                          placeholder=""
                          value={eventClientName}
                          onChange={(e) => setEventClientName(e.target.value)}
                        />
                        <label>Nom &amp; Prénom du titulaire</label>
                        <span className="focus-border"><i></i></span>
                      </div>
                    </div>

                    {/* Email with effect-21 */}
                    <div className="input-effect-wrap">
                      <div className="effect-21-icon">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>
                      <div className="input-effect">
                        <input
                          className={`effect-21 ${eventClientEmail ? "has-content" : ""}`}
                          type="email"
                          placeholder=""
                          value={eventClientEmail}
                          onChange={(e) => setEventClientEmail(e.target.value)}
                        />
                        <label>Adresse Email pour le carton d'invitation</label>
                        <span className="focus-border"><i></i></span>
                      </div>
                    </div>

                    {/* Téléphone with effect-21 */}
                    <div className="input-effect-wrap">
                      <div className="effect-21-icon">
                        <FontAwesomeIcon icon={faPhone} />
                      </div>
                      <div className="input-effect">
                        <input
                          className={`effect-21 ${eventClientPhone ? "has-content" : ""}`}
                          type="tel"
                          placeholder=""
                          value={eventClientPhone}
                          onChange={(e) => setEventClientPhone(e.target.value)}
                        />
                        <label>Numéro de Téléphone Mobile</label>
                        <span className="focus-border"><i></i></span>
                      </div>
                    </div>

                    {/* Nombre d'invités with faUsers and effect-21 */}
                    <div className="event-guests-selector-wrap">
                      <div className="event-guests-label">
                        <FontAwesomeIcon icon={faUsers} style={{ marginRight: "0.5rem", color: "#d8c8b8" }} />
                        <span>Nombre de places souhaitées</span>
                      </div>
                      <div className="event-guests-options">
                        {[1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            type="button"
                            className={`event-guest-btn ${eventGuestsCount === num ? "active" : ""}`}
                            onClick={() => setEventGuestsCount(num)}
                          >
                            {num} {num > 1 ? "personnes" : "personne"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action CTA Register Button with generous margin-bottom so GSAP completes fully */}
                <div className="event-modal-actions gsap-scroll-reveal">
                  <button
                    type="button"
                    className={`event-modal-cta-btn ${
                      registeredEvents.includes(selectedEvent.id) ? "registered" : ""
                    }`}
                    onClick={() => {
                      if (!registeredEvents.includes(selectedEvent.id)) {
                        if (!eventClientName.trim()) {
                          alert("Veuillez renseigner votre nom et prénom.")
                          return
                        }
                        if (!eventClientEmail.trim()) {
                          alert("Veuillez renseigner votre adresse email.")
                          return
                        }
                      }
                      toggleEventRegistration(selectedEvent.id)
                    }}
                  >
                    {registeredEvents.includes(selectedEvent.id) ? (
                      <>
                        <FontAwesomeIcon icon={faCheckCircle} /> Place Réservée ({eventGuestsCount} invité{eventGuestsCount > 1 ? "s" : ""}) — Annuler
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} /> Confirmer mon Inscription Gratuite ({eventGuestsCount} place{eventGuestsCount > 1 ? "s" : ""})
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Special Why Choose Sunset FLIP-Displaced Popup (80% width, pure editorial light theme, left rounded-only image, staggered right details) */}
      {selectedWhyModal && (
        <div
          ref={whyModalBackdropRef}
          className="why-modal-backdrop"
          onClick={closeWhyCardModal}
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            ref={whyModalCardRef}
            className="why-modal-popup"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Minimalist Close Button */}
            <button
              type="button"
              className="why-modal-close-btn"
              onClick={closeWhyCardModal}
              aria-label="Fermer"
            >
              <X size={18} strokeWidth={1.75} />
            </button>

            {/* Left Column: Image that travels & expands from clicked card with top-left & bottom-left rounded, top-right & bottom-right square (0px) */}
            <div ref={whyModalImageColRef} className="why-modal-left-image">
              <img
                ref={whyModalImgRef}
                src={selectedWhyModal.card.image}
                alt={selectedWhyModal.card.title}
                className="why-modal-left-img"
              />
              <div className="why-modal-left-shade" />

              {/* Subtle Editorial Location Caption on Bottom-Left of Image */}
              <div className="why-modal-img-floating-badge">
                <span className="why-modal-img-code">{selectedWhyModal.card.locationCode}</span>
                <span className="why-modal-img-divider" />
                <span className="why-modal-img-loc">{selectedWhyModal.card.locationFull}</span>
              </div>
            </div>

            {/* Right Column: Pure Swiss-Editorial Atelier Layout — Successive Staggered Reveal */}
            <div ref={whyModalRightColRef} className="why-modal-right-content">
              {/* 1. Editorial Index & Edition Header */}
              <div className="why-modal-editorial-top why-modal-stagger-item">
                <span className="why-modal-index-num">
                  N° 0{selectedWhyModal.card.id} / 07 — {selectedWhyModal.card.category}
                </span>
                <span className="why-modal-edition-loc">
                  <span className="loc-dot" /> {selectedWhyModal.card.locationCode} · {selectedWhyModal.card.rating} ★
                </span>
              </div>

              {/* 2. Monumental Title + Sculptural Price */}
              <div className="why-modal-hero-row why-modal-stagger-item">
                <div className="why-modal-title-group">
                  <p className="why-modal-serif-kicker">
                    {selectedWhyModal.card.subtitle} — {selectedWhyModal.card.accentTitle}
                  </p>
                  <h2 className="why-modal-title">
                    {selectedWhyModal.card.title}
                  </h2>
                </div>

                <div className="why-modal-price-block">
                  <span className="why-modal-price-label">Tarif</span>
                  <strong className="why-modal-price-figure">{selectedWhyModal.card.price}</strong>
                </div>
              </div>

              {/* 3. Architectural Hairline Specification Strip (No boxy containers) */}
              <div className="why-modal-spec-strip why-modal-stagger-item">
                <div className="why-modal-spec-cell">
                  <span className="spec-key">Durée</span>
                  <span className="spec-val">{selectedWhyModal.card.duration}</span>
                </div>
                <div className="why-modal-spec-cell">
                  <span className="spec-key">Public</span>
                  <span className="spec-val">{selectedWhyModal.card.level}</span>
                </div>
                <div className="why-modal-spec-cell">
                  <span className="spec-key">Rythme</span>
                  <span className="spec-val">{selectedWhyModal.card.schedule.split("•")[0]}</span>
                </div>
                <div className="why-modal-spec-cell">
                  <span className="spec-key">Format</span>
                  <span className="spec-val">8 Places max.</span>
                </div>
              </div>

              {/* 4. Airy Editorial Narrative */}
              <p className="why-modal-description why-modal-stagger-item">
                {selectedWhyModal.card.description}
              </p>

              {/* 5. Numbered Programme Sequence (01 — 02 — 03) with Fine Hairlines */}
              <div className="why-modal-sequence-list why-modal-stagger-item">
                {selectedWhyModal.card.benefits.slice(0, 3).map((benefit, i) => (
                  <div key={i} className="why-modal-sequence-row">
                    <span className="sequence-index">0{i + 1}</span>
                    <span className="sequence-text">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* 6. Minimalist Mentor Signature & Fluid Sliding Time Slot Tabs */}
              <div className="why-modal-curated-bar why-modal-stagger-item">
                <div className="why-modal-mentor">
                  <div className="why-modal-mentor-monogram" aria-hidden="true">
                    {selectedWhyModal.card.instructor.initials}
                  </div>
                  <div className="why-modal-mentor-meta">
                    <span className="mentor-byline">Dirigé par {selectedWhyModal.card.instructor.name}</span>
                    <span className="mentor-role">{selectedWhyModal.card.instructor.role}</span>
                  </div>
                </div>

                <div className="why-modal-time-tabs-wrap" ref={whyTabsNavRef} role="radiogroup" aria-label="Créneau horaire">
                  <span
                    className="why-modal-time-glider"
                    style={{
                      transform: `translateX(${whyGlider.left}px)`,
                      width: `${whyGlider.width}px`,
                    }}
                  />
                  <div className="why-modal-time-tabs">
                    {selectedWhyModal.card.slots.map((slot, sIdx) => (
                      <button
                        key={slot}
                        ref={(el) => {
                          whyTabRefs.current[sIdx] = el
                        }}
                        type="button"
                        className={`why-time-tab ${selectedWhySlot === slot ? "active" : ""}`}
                        onClick={() => {
                          setSelectedWhySlot(slot)
                          const timePart = slot.split(" ")[0]
                          if (timePart) setWhySelectedTime(timePart)
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 6b. Formulaire Personnalisé avec Composants TypeScript Date/Heure & Effect-21 */}
              <div className="why-modal-booking-form why-modal-stagger-item">
                <div className="why-form-header">
                  <span className="why-form-kicker">COORDONNÉES &amp; PLANIFICATION PRIVÉE</span>
                  <p className="why-form-subtitle">
                    Précisez vos disponibilités personnalisées pour cet accompagnement à l'atelier ({selectedWhyModal.card.locationFull}).
                  </p>
                </div>

                <div className="why-form-fields-grid">
                  {/* Nom & Prénom with effect-21 */}
                  <div className="input-effect-wrap">
                    <div className="effect-21-icon">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="input-effect">
                      <input
                        className={`effect-21 ${whyClientName ? "has-content" : ""}`}
                        type="text"
                        placeholder=""
                        value={whyClientName}
                        onChange={(e) => setWhyClientName(e.target.value)}
                      />
                      <label>Nom &amp; Prénom</label>
                      <span className="focus-border"><i></i></span>
                    </div>
                  </div>

                  {/* Email with effect-21 */}
                  <div className="input-effect-wrap">
                    <div className="effect-21-icon">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div className="input-effect">
                      <input
                        className={`effect-21 ${whyClientEmail ? "has-content" : ""}`}
                        type="email"
                        placeholder=""
                        value={whyClientEmail}
                        onChange={(e) => setWhyClientEmail(e.target.value)}
                      />
                      <label>Adresse Email de contact</label>
                      <span className="focus-border"><i></i></span>
                    </div>
                  </div>

                  {/* Custom TypeScript Date Picker (No browser default!) */}
                  <div className="custom-picker-container" ref={whyDateDropdownRef}>
                    <div
                      className="input-effect-wrap clickable-picker"
                      onClick={() => setIsWhyDatePickerOpen((prev) => !prev)}
                    >
                      <div className="effect-21-icon">
                        <FontAwesomeIcon icon={faCalendarDays} />
                      </div>
                      <div className="input-effect">
                        <input
                          readOnly
                          className={`effect-21 cursor-pointer ${whySelectedDate ? "has-content" : ""}`}
                          type="text"
                          placeholder=""
                          value={formatBespokeDate(whySelectedDate)}
                        />
                        <label>Date du rendez-vous</label>
                        <span className="focus-border"><i></i></span>
                      </div>
                    </div>

                    {isWhyDatePickerOpen && (
                      <div className="custom-calendar-dropdown">
                        <div className="calendar-dropdown-header">
                          <button
                            type="button"
                            className="calendar-nav-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
                            }}
                            aria-label="Mois précédent"
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </button>
                          <span className="calendar-month-label">
                            {BESPOKE_MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                          </span>
                          <button
                            type="button"
                            className="calendar-nav-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
                            }}
                            aria-label="Mois suivant"
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </button>
                        </div>

                        <div className="calendar-weekdays-row">
                          {BESPOKE_WEEKDAYS.map((d) => (
                            <span key={d} className="calendar-weekday-cell">{d}</span>
                          ))}
                        </div>

                        <div className="calendar-days-grid">
                          {getMonthCalendarDays(calendarMonth).map((cell, idx) =>
                            cell ? (
                              <button
                                key={idx}
                                type="button"
                                className={`calendar-day-btn ${
                                  isSameCalendarDay(cell.date, whySelectedDate) ? "selected" : ""
                                }`}
                                disabled={cell.isPast}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setWhySelectedDate(cell.date)
                                  setIsWhyDatePickerOpen(false)
                                }}
                              >
                                {cell.dayNum}
                              </button>
                            ) : (
                              <span key={idx} className="calendar-empty-cell" />
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Custom TypeScript Time Picker (No browser default!) */}
                  <div className="custom-picker-container" ref={whyTimeDropdownRef}>
                    <div
                      className="input-effect-wrap clickable-picker"
                      onClick={() => setIsWhyTimePickerOpen((prev) => !prev)}
                    >
                      <div className="effect-21-icon">
                        <FontAwesomeIcon icon={faClock} />
                      </div>
                      <div className="input-effect">
                        <input
                          readOnly
                          className={`effect-21 cursor-pointer ${whySelectedTime ? "has-content" : ""}`}
                          type="text"
                          placeholder=""
                          value={whySelectedTime ? `${whySelectedTime} (Atelier Privé)` : ""}
                        />
                        <label>Horaire de l'essayage</label>
                        <span className="focus-border"><i></i></span>
                      </div>
                    </div>

                    {isWhyTimePickerOpen && (
                      <div className="custom-time-dropdown">
                        <span className="time-dropdown-title">Horaires d'Atelier Disponibles</span>
                        <div className="time-slots-grid">
                          {BESPOKE_TIME_SLOTS.map((t) => (
                            <button
                              key={t}
                              type="button"
                              className={`time-slot-btn ${whySelectedTime === t ? "selected" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setWhySelectedTime(t)
                                setIsWhyTimePickerOpen(false)
                              }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 7. Signature Action Footer (Echoing the Reference Card's Matte Black Pill + Circular Heart) */}
              <div className="why-modal-actions-row why-modal-stagger-item">
                <button
                  type="button"
                  className={`why-modal-book-btn ${
                    bookedWhySessions.includes(selectedWhyModal.card.id) ? "booked" : ""
                  }`}
                  onClick={() => {
                    if (!bookedWhySessions.includes(selectedWhyModal.card.id)) {
                      if (!whyClientName.trim()) {
                        alert("Veuillez renseigner votre nom et prénom pour valider la réservation.")
                        return
                      }
                      if (!whyClientEmail.trim()) {
                        alert("Veuillez renseigner votre adresse email pour recevoir la confirmation d'atelier.")
                        return
                      }
                    }
                    toggleWhySessionBooking(selectedWhyModal.card.id)
                  }}
                >
                  {bookedWhySessions.includes(selectedWhyModal.card.id) ? (
                    <>
                      <span>Session confirmée • {formatBespokeDate(whySelectedDate)} à {whySelectedTime}</span>
                      <span className="why-modal-btn-Check">✓</span>
                    </>
                  ) : (
                    <>
                      <span>Réserver la session</span>
                      <span className="why-modal-btn-right">
                        {whySelectedTime || selectedWhySlot} — {selectedWhyModal.card.price}
                        <ArrowRight size={17} />
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className={`why-modal-fav-btn ${
                    likedWhyCards.includes(selectedWhyModal.card.id) ? "liked" : ""
                  }`}
                  onClick={() =>
                    setLikedWhyCards((prev) =>
                      prev.includes(selectedWhyModal.card.id)
                        ? prev.filter((id) => id !== selectedWhyModal.card.id)
                        : [...prev, selectedWhyModal.card.id]
                    )
                  }
                  aria-label="Ajouter aux favoris"
                >
                  <Heart
                    size={20}
                    fill={likedWhyCards.includes(selectedWhyModal.card.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Haute Couture Material & Provenance Dossier Popup Modal */}
      {selectedMaterialHotspot && (
        <div
          className="material-modal-backdrop"
          onClick={() => setSelectedMaterialHotspot(null)}
          role="presentation"
        >
          <div
            className="material-modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="material-modal-title-id"
          >
            {/* Header */}
            <div className="material-modal-header">
              <div className="material-modal-header-left">
                <div className="material-modal-badge-row">
                  <span className="material-modal-badge">
                    DOSSIER MATIÈRE &amp; SAVOIR-FAIRE HAUTE COUTURE
                  </span>
                  <span className="material-modal-origin-pill">
                    {selectedMaterialHotspot.countryFlag} {selectedMaterialHotspot.countryOrigin}
                  </span>
                </div>
                <h2 id="material-modal-title-id" className="material-modal-title">
                  {selectedMaterialHotspot.materialName}
                </h2>
                <div className="material-modal-meta-line">
                  <span className="material-modal-meta-zone">
                    Zone {selectedMaterialHotspot.indexLabel} : {selectedMaterialHotspot.partLabel}
                  </span>
                  <span className="material-modal-meta-sep">•</span>
                  <span className="material-modal-meta-silhouette">
                    {currentLook.title} <em>({currentLook.serifSubtitle})</em>
                  </span>
                  <span className="material-modal-meta-sep">•</span>
                  <span className="material-modal-meta-ref">{selectedMaterialHotspot.archiveRef}</span>
                </div>
              </div>

              <button
                type="button"
                className="material-modal-close-btn"
                onClick={() => setSelectedMaterialHotspot(null)}
                aria-label="Fermer le dossier matière"
              >
                <X size={20} />
              </button>
            </div>

            {/* 3-Zone Interactive Switcher Tabs inside Modal */}
            <div className="material-modal-tabs-bar" role="tablist" aria-label="Zones de la robe">
              {currentLook.hotspots.map((spot, sIdx) => {
                const isTabActive = spot.id === selectedMaterialHotspot.id
                return (
                  <button
                    key={spot.id}
                    type="button"
                    role="tab"
                    aria-selected={isTabActive}
                    className={`material-modal-tab-btn ${isTabActive ? "active" : ""}`}
                    onClick={() => {
                      setActiveHotspotIdx(sIdx)
                      setSelectedMaterialHotspot(spot)
                    }}
                  >
                    <span className="tab-zone-num">ZONE {spot.indexLabel}</span>
                    <span className="tab-zone-title">{spot.partLabel}</span>
                    <span className="tab-zone-flag">{spot.countryFlag}</span>
                  </button>
                )
              })}
            </div>

            {/* 2-Column Haute Couture Body */}
            <div className="material-modal-body-grid">
              {/* Left Column: Macro Optical Loupe Viewport + Technical Passport */}
              <div className="material-modal-left-col">
                <div className="material-modal-macro-viewport">
                  <div className="material-modal-macro-top">
                    <span className="material-modal-macro-badge">
                      MACRO TEXTURE 3.8X · RÉSOLUTION ATELIER
                    </span>
                    <span className="material-modal-macro-flag">
                      {selectedMaterialHotspot.countryFlag}
                    </span>
                  </div>

                  <div className="material-modal-macro-loupe">
                    <img
                      src={currentLook.image}
                      alt={selectedMaterialHotspot.materialName}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transformOrigin: `${selectedMaterialHotspot.x}% ${selectedMaterialHotspot.y}%`,
                        transform: `translate(-${selectedMaterialHotspot.x}%, -${selectedMaterialHotspot.y}%) scale(3.8)`,
                      }}
                    />
                    <div className="lookbook-loupe-crosshair">
                      <span className="loupe-ring" />
                      <span className="loupe-dot" />
                    </div>
                  </div>

                  <div className="material-modal-macro-foot">
                    <span className="macro-foot-coord">
                      COORD : X{selectedMaterialHotspot.x}% · Y{selectedMaterialHotspot.y}%
                    </span>
                    <span className="macro-foot-provenance">100% FIBRES CERTIFIÉES</span>
                  </div>
                </div>

                {/* Passport Card */}
                <div className="material-passport-card">
                  <h4 className="material-passport-title">
                    <span>PASSEPORT MATIÈRE &amp; TRAÇABILITÉ</span>
                    <span className="passport-cert-tag">CERTIFIÉ COUTURE</span>
                  </h4>

                  <div className="material-passport-rows">
                    <div className="material-passport-row">
                      <span className="passport-key">ATELIER &amp; MANUFACTURE</span>
                      <strong className="passport-val">{selectedMaterialHotspot.atelierName}</strong>
                    </div>
                    <div className="material-passport-row">
                      <span className="passport-key">ORIGINE GÉOGRAPHIQUE</span>
                      <strong className="passport-val">
                        {selectedMaterialHotspot.countryFlag} {selectedMaterialHotspot.countryOrigin}
                      </strong>
                    </div>
                    <div className="material-passport-row">
                      <span className="passport-key">COMPOSITION CERTIFIÉE</span>
                      <strong className="passport-val">{selectedMaterialHotspot.composition}</strong>
                    </div>
                    <div className="material-passport-row">
                      <span className="passport-key">SAVOIR-FAIRE DE CONFECTION</span>
                      <strong className="passport-val">{selectedMaterialHotspot.craftOrigin}</strong>
                    </div>
                    <div className="material-passport-row">
                      <span className="passport-key">TEMPS DE FAÇONNAGE</span>
                      <strong className="passport-val">{selectedMaterialHotspot.weightSpec}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative Signature Box, Characteristics, Secret & Care */}
              <div className="material-modal-right-col">
                {/* Grand Encart Signature: Pourquoi ce matériau est si particulier */}
                <div className="material-special-highlight-box">
                  <div className="special-highlight-header">
                    <Sparkles size={18} className="special-sparkle-icon" />
                    <span className="special-highlight-eyebrow">DISTINCTION &amp; RARETÉ ATELIER</span>
                  </div>
                  <h3 className="special-highlight-heading">
                    Pourquoi ce matériau est si particulier ?
                  </h3>
                  <p className="special-highlight-text">
                    {selectedMaterialHotspot.whySpecial}
                  </p>
                </div>

                {/* 3 Physical & Sensory Cards */}
                <div className="material-sensory-grid">
                  <div className="material-sensory-card">
                    <div className="sensory-head">
                      <span className="sensory-icon">
                        <FontAwesomeIcon icon={faHandSparkles} className="sensory-fa-icon" />
                      </span>
                      <strong className="sensory-label">Toucher &amp; Texture</strong>
                    </div>
                    <p className="sensory-desc">{selectedMaterialHotspot.textureTouch}</p>
                  </div>

                  <div className="material-sensory-card">
                    <div className="sensory-head">
                      <span className="sensory-icon">
                        <FontAwesomeIcon icon={faGem} className="sensory-fa-icon" />
                      </span>
                      <strong className="sensory-label">Photogénie &amp; Rendu Lumière</strong>
                    </div>
                    <p className="sensory-desc">{selectedMaterialHotspot.lightReflect}</p>
                  </div>

                  <div className="material-sensory-card">
                    <div className="sensory-head">
                      <span className="sensory-icon">
                        <FontAwesomeIcon icon={faWind} className="sensory-fa-icon" />
                      </span>
                      <strong className="sensory-label">Respirabilité &amp; Confort</strong>
                    </div>
                    <p className="sensory-desc">{selectedMaterialHotspot.durabilityBreathability}</p>
                  </div>
                </div>

                {/* Secret d'Atelier */}
                <div className="material-secret-card">
                  <div className="secret-card-head">
                    <span className="secret-tag">SECRET D'ATELIER</span>
                    <span className="secret-tech">{selectedMaterialHotspot.techSpec}</span>
                  </div>
                  <p className="secret-card-desc">
                    {selectedMaterialHotspot.artisanSecret}
                  </p>
                </div>

                {/* Conservation & Care */}
                <div className="material-care-card">
                  <span className="care-tag">CONSEILS DE CONSERVATION &amp; ENTRETIEN DE L'ÉTOFFE</span>
                  <p className="care-desc">
                    {selectedMaterialHotspot.careGuidance}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="material-modal-actions">
                  <button
                    type="button"
                    className="material-action-btn primary"
                    onClick={() => {
                      setQuickAddedLookbookItems((prev) =>
                        prev.includes(selectedMaterialHotspot.id)
                          ? prev
                          : [...prev, selectedMaterialHotspot.id]
                      )
                      setSelectedMaterialHotspot(null)
                    }}
                  >
                    <span>
                      {quickAddedLookbookItems.includes(selectedMaterialHotspot.id)
                        ? "Échantillon & Essayage Sélectionnés ✓"
                        : "Demander un Échantillon d'Étoffe • Sur-Mesure"}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="material-action-btn secondary"
                    onClick={() => setSelectedMaterialHotspot(null)}
                  >
                    <span>Fermer le dossier</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Customer Service Button */}
      <button className="home-fab">
        <HeadphonesIcon size={24} />
        <span className="home-fab-tooltip">
          Besoin d'aide ?
        </span>
      </button>
    </div>
  )
}
