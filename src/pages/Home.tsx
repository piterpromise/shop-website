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
  Sun,
  Moon,
  Trash2,
} from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFireFlameSimple,
  faTruck,
  faCircle,
  faUser,
  faEnvelope,
  faPhone,
  faCalendarDays,
  faClock,
  faCheck,
  faCheckCircle,
  faPaperPlane,
  faCircleNotch,
  faCommentDots,
  faLocationDot,
  faScissors,
  faChevronLeft,
  faChevronRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"

gsap.registerPlugin(ScrollTrigger)

interface PhoneFormatResult {
  formatted: string
  countryTag: string
}

const DIAL_CODE_RULES: {
  code: string
  tag: string
  group: (rest: string) => string
}[] = [
  {
    code: "236",
    tag: "🇨🇫 +236",
    group: (r) => {
      if (r.length === 9 || (r.length > 8 && r.startsWith("6"))) {
        return [r.slice(0, 1), r.slice(1, 3), r.slice(3, 5), r.slice(5, 7), r.slice(7, 9)]
          .filter(Boolean)
          .join(" ")
      }
      return (r.slice(0, 8).match(/.{1,2}/g) || []).join(" ")
    },
  },
  {
    code: "237",
    tag: "🇨🇲 +237",
    group: (r) => {
      const p1 = r.slice(0, 1)
      const pairs = r.slice(1, 9).match(/.{1,2}/g) || []
      return [p1, ...pairs].filter(Boolean).join(" ")
    },
  },
  {
    code: "225",
    tag: "🇨🇮 +225",
    group: (r) => (r.slice(0, 10).match(/.{1,2}/g) || []).join(" "),
  },
  {
    code: "221",
    tag: "🇸🇳 +221",
    group: (r) =>
      [r.slice(0, 2), r.slice(2, 5), r.slice(5, 7), r.slice(7, 9)].filter(Boolean).join(" "),
  },
  {
    code: "241",
    tag: "🇬🇦 +241",
    group: (r) => (r.slice(0, 8).match(/.{1,2}/g) || []).join(" "),
  },
  {
    code: "242",
    tag: "🇨🇬 +242",
    group: (r) => [r.slice(0, 2), r.slice(2, 5), r.slice(5, 9)].filter(Boolean).join(" "),
  },
  {
    code: "243",
    tag: "🇨🇩 +243",
    group: (r) => [r.slice(0, 2), r.slice(2, 5), r.slice(5, 9)].filter(Boolean).join(" "),
  },
  {
    code: "212",
    tag: "🇲🇦 +212",
    group: (r) => {
      const clean = r.startsWith("0") ? r.slice(1) : r
      const p1 = clean.slice(0, 1)
      const pairs = clean.slice(1, 9).match(/.{1,2}/g) || []
      return [p1, ...pairs].filter(Boolean).join(" ")
    },
  },
  {
    code: "33",
    tag: "🇫🇷 +33",
    group: (r) => {
      const clean = r.startsWith("0") ? r.slice(1) : r
      const p1 = clean.slice(0, 1)
      const pairs = clean.slice(1, 9).match(/.{1,2}/g) || []
      return [p1, ...pairs].filter(Boolean).join(" ")
    },
  },
  {
    code: "32",
    tag: "🇧🇪 +32",
    group: (r) => {
      const clean = r.startsWith("0") ? r.slice(1) : r
      return [clean.slice(0, 3), clean.slice(3, 5), clean.slice(5, 7), clean.slice(7, 9)]
        .filter(Boolean)
        .join(" ")
    },
  },
  {
    code: "41",
    tag: "🇨🇭 +41",
    group: (r) => {
      const clean = r.startsWith("0") ? r.slice(1) : r
      return [clean.slice(0, 2), clean.slice(2, 5), clean.slice(5, 7), clean.slice(7, 9)]
        .filter(Boolean)
        .join(" ")
    },
  },
  {
    code: "44",
    tag: "🇬🇧 +44",
    group: (r) => {
      const clean = r.startsWith("0") ? r.slice(1) : r
      return [clean.slice(0, 4), clean.slice(4, 10)].filter(Boolean).join(" ")
    },
  },
  {
    code: "1",
    tag: "🇺🇸 +1",
    group: (r) => {
      const n = r.slice(0, 10)
      if (n.length <= 3) return n
      if (n.length <= 6) return `(${n.slice(0, 3)}) ${n.slice(3)}`
      return `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}`
    },
  },
]

const formatPhoneWithAutoCountry = (rawValue: string, prevFormatted: string): PhoneFormatResult => {
  const isDeleting = rawValue.length < prevFormatted.length
  let digits = rawValue.replace(/\D/g, "")
  const prevDigits = prevFormatted.replace(/\D/g, "")

  if (isDeleting && digits === prevDigits && prevDigits.length > 0) {
    digits = digits.slice(0, -1)
  }

  if (!rawValue.trim() || digits.length === 0) {
    if (rawValue.trimStart().startsWith("+") && !isDeleting) {
      return { formatted: "+", countryTag: "" }
    }
    return { formatted: "", countryTag: "" }
  }

  const formatByDialCode = (allDigits: string): PhoneFormatResult => {
    const matched = DIAL_CODE_RULES.find((rule) => allDigits.startsWith(rule.code))
    if (matched) {
      const rest = allDigits.slice(matched.code.length)
      if (!rest) {
        return { formatted: `+${matched.code}`, countryTag: matched.tag }
      }
      return {
        formatted: `+${matched.code} ${matched.group(rest)}`,
        countryTag: matched.tag,
      }
    }
    const codeChunk = allDigits.slice(0, 3)
    const restChunk = allDigits.slice(3)
    const groupedRest = (restChunk.match(/.{1,2}/g) || []).join(" ")
    return {
      formatted: groupedRest ? `+${codeChunk} ${groupedRest}` : `+${codeChunk}`,
      countryTag: codeChunk ? `+${codeChunk}` : "",
    }
  }

  // Case 1: User already has explicit international "+" or "00"
  if (rawValue.trimStart().startsWith("+") || digits.startsWith("00")) {
    const normalized = digits.startsWith("00") ? digits.slice(2) : digits
    if (!normalized) return { formatted: "+", countryTag: "" }
    return formatByDialCode(normalized)
  }

  // Case 2: Raw digits typed without "+": auto-detect country code according to digit count & prefix
  if (!isDeleting) {
    if (digits.startsWith("236") && digits.length >= 11) {
      return formatByDialCode(digits)
    }
    if (digits.startsWith("237") && digits.length >= 12) {
      return formatByDialCode(digits)
    }
    if (digits.startsWith("33") && digits.length >= 11) {
      return formatByDialCode(digits)
    }
    if (digits.startsWith("225") && digits.length >= 13) {
      return formatByDialCode(digits)
    }

    // 8 digits local (e.g. RCA 75123456 -> +236 75 12 34 56)
    if (digits.length === 8 && /^(7[02457]|2[12])\d{6}$/.test(digits)) {
      return formatByDialCode(`236${digits}`)
    }

    // 9 digits local (e.g. RCA 640927576 -> +236 6 40 92 75 76, Cameroun 678110014 -> +237, Sénégal -> +221)
    if (digits.length === 9 && !digits.startsWith("0")) {
      if (/^6[01234]\d{7}$/.test(digits)) {
        return formatByDialCode(`236${digits}`)
      }
      if (/^6[56789]\d{7}$/.test(digits)) {
        return formatByDialCode(`237${digits}`)
      }
      if (/^7[05678]\d{7}$/.test(digits)) {
        return formatByDialCode(`221${digits}`)
      }
      return formatByDialCode(`33${digits}`)
    }

    // 10 digits local starting with 0 (France 06/07... -> +33 6..., Côte d'Ivoire 01/05/07...)
    if (digits.length === 10 && digits.startsWith("0")) {
      if (/^0[679]\d{8}$/.test(digits) || /^0[1-4]\d{8}$/.test(digits)) {
        return formatByDialCode(`33${digits.slice(1)}`)
      }
      if (/^05\d{8}$/.test(digits)) {
        return formatByDialCode(`225${digits}`)
      }
      return formatByDialCode(`33${digits.slice(1)}`)
    }

    // 10 digits local not starting with 0 -> +1 (US / Canada)
    if (digits.length === 10 && !digits.startsWith("0")) {
      return formatByDialCode(`1${digits}`)
    }
  }

  // Fallback intermediate grouping while typing
  return {
    formatted: (digits.match(/.{1,2}/g) || [digits]).join(" "),
    countryTag: "",
  }
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

const formatBespokeDate = (date: Date): string => {
  const day = date.getDate()
  const month = BESPOKE_MONTH_NAMES[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const isSameCalendarDay = (a: Date | null, b: Date): boolean => {
  if (!a) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

interface CalendarDayCell {
  date: Date
  isCurrentMonth: boolean
  isPast: boolean
}

interface GliderRect {
  left: number
  top: number
  width: number
  height: number
  ready: boolean
}

function measureButtonRect(
  navEl: HTMLElement | null,
  activeBtn: HTMLElement | null,
  autoCenterScroll = false
): GliderRect {
  if (!activeBtn) {
    return { left: 0, top: 0, width: 0, height: 0, ready: false }
  }
  if (autoCenterScroll && navEl && navEl.scrollWidth > navEl.clientWidth + 2) {
    const targetScrollLeft =
      activeBtn.offsetLeft - navEl.clientWidth / 2 + activeBtn.offsetWidth / 2
    navEl.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: "smooth",
    })
  }
  return {
    left: activeBtn.offsetLeft,
    top: activeBtn.offsetTop,
    width: activeBtn.offsetWidth,
    height: activeBtn.offsetHeight,
    ready: true,
  }
}

const CONTACT_SUBJECT_OPTIONS = [
  "Robe de Mariée Sur-Mesure",
  "Tenue de Gala & Soirée",
  "Robes de Cortège",
  "Retouche & Essayage Privé",
] as const

const getMonthCalendarDays = (year: number, month: number): CalendarDayCell[] => {
  const firstDayOfMonth = new Date(year, month, 1)
  const totalDays = new Date(year, month + 1, 0).getDate()
  const startWeekday = (firstDayOfMonth.getDay() + 6) % 7
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const cells: CalendarDayCell[] = []
  for (let i = 0; i < startWeekday; i++) {
    cells.push({ date: new Date(year, month, 0), isCurrentMonth: false, isPast: true })
  }
  for (let d = 1; d <= totalDays; d++) {
    const cellDate = new Date(year, month, d)
    cells.push({
      date: cellDate,
      isCurrentMonth: true,
      isPast: cellDate < today,
    })
  }
  return cells
}

interface CarouselShoe {
  name: string
  image: string
  desc: string
  a: number
  bg: string
  accentLight: string
  accentGlow: string
  contrastText: string
  paletteLabel: string
}

const CAROUSEL_SHOES: CarouselShoe[] = [
  {
    name: "Mariée Royale",
    image: "/couture/wedding4.webp",
    desc: "Dentelle & Traîne Cathédrale",
    a: -12,
    bg: "#29251c",
    accentLight: "#f4ece1",
    accentGlow: "#d8c8b8",
    contrastText: "#29251c",
    paletteLabel: "Ivoire & Olive Oscuro",
  },
  {
    name: "Gala Étoilé",
    image: "/couture/party-dress3.webp",
    desc: "Fourreau Perlé Main",
    a: -6,
    bg: "#74634f",
    accentLight: "#fbf6ef",
    accentGlow: "#ebd9c5",
    contrastText: "#473b2c",
    paletteLabel: "Champagne & Moss Taupe",
  },
  {
    name: "Drapé Couture",
    image: "/couture/other-robes3.webp",
    desc: "Soie Sauvage Sur-Mesure",
    a: 0,
    bg: "#3f2028",
    accentLight: "#faeef1",
    accentGlow: "#e7c4cd",
    contrastText: "#3f2028",
    paletteLabel: "Nacre Poudrée & Mulberry",
  },
  {
    name: "Dentelle d'Or",
    image: "/couture/wedding6.webp",
    desc: "Création Mariage Impérial",
    a: 6,
    bg: "#111312",
    accentLight: "#f3f0ea",
    accentGlow: "#d5cec3",
    contrastText: "#111312",
    paletteLabel: "Soie Pure & Noir Earth",
  },
  {
    name: "Soirée Velours",
    image: "/couture/party-dress4.webp",
    desc: "Silhouette Haute Couture",
    a: 12,
    bg: "#3f3d30",
    accentLight: "#f5f4eb",
    accentGlow: "#dcd8c3",
    contrastText: "#2e2d22",
    paletteLabel: "Lin Naturel & Olive Smoke",
  },
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
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const saved = window.localStorage.getItem("atelier-theme")
      return saved === "light" || saved === "dark" ? saved : "dark"
    } catch {
      return "dark"
    }
  })

  type HeaderMenuType = "search" | "notifications" | "bag"
  interface CartItem {
    id: string
    product: Product
    colorName: string
    size: string
    qty: number
  }

  const [activeHeaderMenu, setActiveHeaderMenu] = useState<HeaderMenuType | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const headerActionsContainerRef = useRef<HTMLDivElement>(null)
  const headerPopoverRef = useRef<HTMLDivElement>(null)
  const headerArrowRef = useRef<HTMLSpanElement>(null)
  const searchBtnRef = useRef<HTMLButtonElement>(null)
  const bellBtnRef = useRef<HTMLButtonElement>(null)
  const bagBtnRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const isClosingHeaderRef = useRef<boolean>(false)

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
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
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const displayedProducts = normalizedSearch
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedSearch) ||
          p.category.toLowerCase().includes(normalizedSearch) ||
          p.description.toLowerCase().includes(normalizedSearch) ||
          (p.badge && p.badge.toLowerCase().includes(normalizedSearch))
      )
    : showAllProducts
      ? products
      : products.filter((p) => p.categoryKey === currentCategory.key)

  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [eventModalOrigin, setEventModalOrigin] = useState<{
    left: number
    top: number
    width: number
    height: number
    sourceEl: HTMLElement | null
  } | null>(null)
  const eventModalBackdropRef = useRef<HTMLDivElement>(null)
  const eventModalCardRef = useRef<HTMLDivElement>(null)
  const eventModalHeroBottomRef = useRef<HTMLDivElement>(null)
  const eventModalHeroImgRef = useRef<HTMLImageElement>(null)
  const isEventModalClosingRef = useRef<boolean>(false)
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

  // Why Choose / Sur-Mesure glider state
  const [whyGlider, setWhyGlider] = useState<{ left: number; width: number }>({ left: 0, width: 85 })
  const whyTabsNavRef = useRef<HTMLDivElement>(null)
  const whyTabRefs = useRef<(HTMLButtonElement | null)[]>([])

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
  const [activeStudioId, setActiveStudioId] = useState<number>(1)
  const [reservedStudioVisits, setReservedStudioVisits] = useState<number[]>([])

  // Unified Segmented Toggle Gliders (Product Sizes, Index 06 Flagship Stages, Contact Subject)
  const sizeNavRef = useRef<HTMLDivElement>(null)
  const sizeBtnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [sizeGlider, setSizeGlider] = useState<GliderRect>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    ready: false,
  })

  const flagshipNavRef = useRef<HTMLDivElement>(null)
  const flagshipBtnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [flagshipGlider, setFlagshipGlider] = useState<GliderRect>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    ready: false,
  })

  const contactSubjectNavRef = useRef<HTMLDivElement>(null)
  const contactSubjectBtnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [contactSubjectGlider, setContactSubjectGlider] = useState<GliderRect>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    ready: false,
  })

  // Contact section state (adapts seamlessly to active Hero silhouette palette)
  const [contactName, setContactName] = useState<string>("")
  const [contactEmail, setContactEmail] = useState<string>("")
  const [contactPhone, setContactPhone] = useState<string>("")
  const [contactPhoneCountry, setContactPhoneCountry] = useState<string>("")
  const [contactOccasion, setContactOccasion] = useState<string>("")
  const [contactSelectedDate, setContactSelectedDate] = useState<Date | null>(null)
  const [isContactDatePickerOpen, setIsContactDatePickerOpen] = useState<boolean>(false)
  const [contactCalendarMonth, setContactCalendarMonth] = useState<Date>(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })
  const contactDateDropdownRef = useRef<HTMLDivElement>(null)
  const [contactSubject, setContactSubject] = useState<string>("Robe de Mariée Sur-Mesure")
  const [contactMessage, setContactMessage] = useState<string>("")
  const [contactSubmitState, setContactSubmitState] = useState<"idle" | "sending" | "sent">("idle")
  const [contactError, setContactError] = useState<string>("")

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    document.body.style.backgroundColor = theme === "dark" ? "#0b0b0a" : "#f8f1ea"
    document.body.style.color = theme === "dark" ? "#f4ece1" : "#111312"
    try {
      window.localStorage.setItem("atelier-theme", theme)
    } catch {
      // ignore storage quota errors
    }
  }, [theme])

  const closeHeaderMenu = () => {
    if (!activeHeaderMenu || isClosingHeaderRef.current) return
    const popEl = headerPopoverRef.current
    if (!popEl) {
      setActiveHeaderMenu(null)
      return
    }
    isClosingHeaderRef.current = true
    gsap.killTweensOf(popEl)
    gsap.to(popEl, {
      opacity: 0,
      y: -8,
      scale: 0.96,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        isClosingHeaderRef.current = false
        setActiveHeaderMenu(null)
      },
    })
  }

  const toggleHeaderMenu = (target: HeaderMenuType) => {
    if (activeHeaderMenu === target) {
      closeHeaderMenu()
      return
    }
    isClosingHeaderRef.current = false
    if (target === "notifications") {
      setHasUnreadNotifications(false)
    }
    setActiveHeaderMenu(target)
  }

  const addToCart = (product: Product, colorName: string, size: string) => {
    const itemId = `${product.id}-${colorName}-${size}`
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId)
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { id: itemId, product, colorName, size, qty: 1 }]
    })
  }

  const updateCartQty = (itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    )
  }

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const totalCartAmount = cartItems.reduce((sum, item) => {
    const numeric = parseFloat(item.product.price.replace(/[^\d.,]/g, "").replace(",", ".")) || 0
    return sum + numeric * item.qty
  }, 0)

  useEffect(() => {
    if (!activeHeaderMenu) return
    const handleOutsideOrEsc = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") closeHeaderMenu()
        return
      }
      if (
        headerActionsContainerRef.current &&
        !headerActionsContainerRef.current.contains(event.target as Node)
      ) {
        closeHeaderMenu()
      }
    }
    document.addEventListener("mousedown", handleOutsideOrEsc)
    document.addEventListener("keydown", handleOutsideOrEsc)
    return () => {
      document.removeEventListener("mousedown", handleOutsideOrEsc)
      document.removeEventListener("keydown", handleOutsideOrEsc)
    }
  }, [activeHeaderMenu])

  useEffect(() => {
    if (!activeHeaderMenu) return
    const updateBubblePointer = () => {
      const btnMap: Record<HeaderMenuType, HTMLButtonElement | null> = {
        search: searchBtnRef.current,
        notifications: bellBtnRef.current,
        bag: bagBtnRef.current,
      }
      const targetBtn = btnMap[activeHeaderMenu]
      const popEl = headerPopoverRef.current
      if (!targetBtn || !popEl) return
      const btnRect = targetBtn.getBoundingClientRect()
      const popRect = popEl.getBoundingClientRect()
      const arrowX = Math.max(24, Math.min(popRect.width - 24, btnRect.left + btnRect.width / 2 - popRect.left))
      popEl.style.setProperty("--bubble-arrow-x", `${arrowX.toFixed(1)}px`)
    }

    updateBubblePointer()
    const rafId = requestAnimationFrame(updateBubblePointer)
    window.addEventListener("resize", updateBubblePointer, { passive: true })

    const popEl = headerPopoverRef.current
    const arrowEl = headerArrowRef.current
    if (popEl) {
      gsap.killTweensOf(popEl)
      const staggerEls = popEl.querySelectorAll(".header-bubble-stagger")
      gsap.killTweensOf(staggerEls)

      const tl = gsap.timeline()
      tl.fromTo(
        popEl,
        { opacity: 0, y: -12, scale: 0.94, transformOrigin: "top right" },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out", clearProps: "transform" }
      )
      if (arrowEl) {
        tl.fromTo(
          arrowEl,
          { opacity: 0, scale: 0.45, rotation: 45 },
          { opacity: 1, scale: 1, rotation: 45, duration: 0.3, ease: "back.out(2)" },
          0.04
        )
      }
      if (staggerEls.length > 0) {
        tl.fromTo(
          staggerEls,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.34, stagger: 0.055, ease: "power2.out", clearProps: "transform" },
          0.08
        )
      }
    }

    let focusTimer: number | undefined
    if (activeHeaderMenu === "search") {
      focusTimer = window.setTimeout(() => {
        searchInputRef.current?.focus()
      }, 110)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", updateBubblePointer)
      if (focusTimer) window.clearTimeout(focusTimer)
    }
  }, [activeHeaderMenu])

  useEffect(() => {
    if (!isContactDatePickerOpen) return
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        contactDateDropdownRef.current &&
        !contactDateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsContactDatePickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [isContactDatePickerOpen])

  // Synchronise les gliders des 3 groupes toggle (Tailles Modale, Parcours Atelier, Sujet Contact)
  useEffect(() => {
    const syncFlagshipGlider = () => {
      const idx = FLAGSHIP_STUDIOS.findIndex((s) => s.id === activeStudioId)
      const activeBtn = flagshipBtnRefs.current[idx >= 0 ? idx : 0] || null
      setFlagshipGlider(measureButtonRect(flagshipNavRef.current, activeBtn, true))
    }

    syncFlagshipGlider()
    const rafId = requestAnimationFrame(syncFlagshipGlider)
    const ro = new ResizeObserver(syncFlagshipGlider)
    if (flagshipNavRef.current) ro.observe(flagshipNavRef.current)
    window.addEventListener("resize", syncFlagshipGlider, { passive: true })
    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener("resize", syncFlagshipGlider)
    }
  }, [activeStudioId, theme])

  useEffect(() => {
    const syncContactSubjectGlider = () => {
      const idx = CONTACT_SUBJECT_OPTIONS.indexOf(
        contactSubject as (typeof CONTACT_SUBJECT_OPTIONS)[number]
      )
      const activeBtn = contactSubjectBtnRefs.current[idx >= 0 ? idx : 0] || null
      setContactSubjectGlider(measureButtonRect(contactSubjectNavRef.current, activeBtn, false))
    }

    syncContactSubjectGlider()
    const rafId = requestAnimationFrame(syncContactSubjectGlider)
    const ro = new ResizeObserver(syncContactSubjectGlider)
    if (contactSubjectNavRef.current) ro.observe(contactSubjectNavRef.current)
    window.addEventListener("resize", syncContactSubjectGlider, { passive: true })
    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener("resize", syncContactSubjectGlider)
    }
  }, [contactSubject, contactSubmitState, theme])

  useEffect(() => {
    if (!selectedProduct) {
      setSizeGlider((prev) => ({ ...prev, ready: false }))
      return
    }
    const syncSizeGlider = () => {
      const idx = selectedProduct.sizes.indexOf(selectedSize)
      const activeBtn = sizeBtnRefs.current[idx >= 0 ? idx : 0] || null
      setSizeGlider(measureButtonRect(sizeNavRef.current, activeBtn, true))
    }

    syncSizeGlider()
    const rafId = requestAnimationFrame(syncSizeGlider)
    const timer = window.setTimeout(syncSizeGlider, 140)
    const ro = new ResizeObserver(syncSizeGlider)
    if (sizeNavRef.current) ro.observe(sizeNavRef.current)
    window.addEventListener("resize", syncSizeGlider, { passive: true })
    return () => {
      cancelAnimationFrame(rafId)
      window.clearTimeout(timer)
      ro.disconnect()
      window.removeEventListener("resize", syncSizeGlider)
    }
  }, [selectedSize, selectedProduct, theme])

  // Aligne précisément les motifs SVG d'une section à l'autre (aucun décalage visuel aux frontières)
  useEffect(() => {
    const syncBackgroundPatternOffsets = () => {
      const pageEl = container.current
      if (!pageEl) return
      const pageTop = pageEl.getBoundingClientRect().top + window.scrollY

      const targets: { selector: string; varName: string }[] = [
        { selector: ".home-hero", varName: "--hero-offset-y" },
        { selector: ".testimonials-container", varName: "--testimonials-offset-y" },
        { selector: ".events-pinned-section", varName: "--events-offset-y" },
        { selector: ".site-footer", varName: "--footer-offset-y" },
      ]

      targets.forEach(({ selector, varName }) => {
        const el = pageEl.querySelector(selector) as HTMLElement | null
        if (!el) return
        const anchorEl = el.parentElement?.classList.contains("pin-spacer")
          ? el.parentElement
          : el
        const offsetFromPageTop = anchorEl.getBoundingClientRect().top + window.scrollY - pageTop
        const tileMod = ((offsetFromPageTop % 140) + 140) % 140
        el.style.setProperty(varName, `${tileMod.toFixed(2)}px`)
      })
    }

    syncBackgroundPatternOffsets()
    const rafId = requestAnimationFrame(syncBackgroundPatternOffsets)
    const timer = window.setTimeout(syncBackgroundPatternOffsets, 450)
    const ro = new ResizeObserver(syncBackgroundPatternOffsets)
    if (container.current) ro.observe(container.current)
    window.addEventListener("resize", syncBackgroundPatternOffsets, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.clearTimeout(timer)
      ro.disconnect()
      window.removeEventListener("resize", syncBackgroundPatternOffsets)
    }
  }, [showAllProducts, activeCategoryIdx, activeStudioId, contactSubmitState])

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (contactSubmitState === "sending") return

    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactError("Merci de renseigner votre nom, votre e-mail et votre message pour l'atelier.")
      return
    }
    setContactError("")
    setContactSubmitState("sending")
    window.setTimeout(() => {
      setContactSubmitState("sent")
    }, 1350)
  }

  const resetContactForm = () => {
    setContactName("")
    setContactEmail("")
    setContactPhone("")
    setContactPhoneCountry("")
    setContactOccasion("")
    setContactSelectedDate(null)
    setIsContactDatePickerOpen(false)
    setContactMessage("")
    setContactError("")
    setContactSubmitState("idle")
  }

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const activeTestimonial = testimonials.find((t) => t.id === activeTestimonialId) || testimonials[0]
  const n = CAROUSEL_SHOES.length

  useEffect(() => {
    if (selectedProduct || selectedEvent) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedProduct, selectedEvent])

  const openEventModal = (evt: EventItem, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    const cardEl = (e.currentTarget as HTMLElement).closest(".event-card") as HTMLElement | null
    const rect = cardEl
      ? cardEl.getBoundingClientRect()
      : {
          left: window.innerWidth / 2 - 200,
          top: window.innerHeight / 2 - 250,
          width: 400,
          height: 500,
        }
    isEventModalClosingRef.current = false
    setEventModalOrigin({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      sourceEl: cardEl,
    })
    setSelectedEvent(evt)
  }

  const closeEventModal = () => {
    if (!selectedEvent || isEventModalClosingRef.current) return
    isEventModalClosingRef.current = true

    const backdropEl = eventModalBackdropRef.current
    const popupEl = eventModalCardRef.current
    const heroBottomEl = eventModalHeroBottomRef.current
    const imgEl = eventModalHeroImgRef.current
    const originRect = eventModalOrigin
    const sourceEl = eventModalOrigin?.sourceEl

    if (!popupEl || !backdropEl || !originRect) {
      if (sourceEl) {
        gsap.set(sourceEl, { autoAlpha: 1, pointerEvents: "auto" })
      }
      setSelectedEvent(null)
      setEventModalOrigin(null)
      isEventModalClosingRef.current = false
      return
    }

    const liveRect = sourceEl ? sourceEl.getBoundingClientRect() : originRect
    const closeBtn = popupEl.querySelector(".product-modal-close")
    const isMobile = window.innerWidth <= 768

    popupEl.scrollTop = 0
    popupEl.style.overflowY = "hidden"

    const closeTl = gsap.timeline({
      onComplete: () => {
        if (sourceEl) {
          gsap.set(sourceEl, { autoAlpha: 1, pointerEvents: "auto" })
        }
        setSelectedEvent(null)
        setEventModalOrigin(null)
        isEventModalClosingRef.current = false
      },
    })

    closeTl.to(
      [heroBottomEl, closeBtn].filter(Boolean),
      {
        opacity: 0,
        y: 18,
        duration: 0.22,
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
        borderRadius: isMobile ? "24px" : "2rem",
        duration: 0.52,
        ease: "power3.inOut",
      },
      0
    )

    if (imgEl) {
      closeTl.to(
        imgEl,
        {
          scale: 1.05,
          duration: 0.52,
          ease: "power3.inOut",
        },
        0
      )
    }

    closeTl.to(
      backdropEl,
      {
        opacity: 0,
        duration: 0.44,
        ease: "power2.inOut",
      },
      0
    )

    if (sourceEl) {
      closeTl.call(
        () => {
          gsap.set(sourceEl, { autoAlpha: 1 })
        },
        [],
        0.46
      )
    }
  }

  useEffect(() => {
    if (!selectedEvent || !eventModalOrigin) return

    const backdropEl = eventModalBackdropRef.current
    const popupEl = eventModalCardRef.current
    const heroBottomEl = eventModalHeroBottomRef.current
    const imgEl = eventModalHeroImgRef.current
    const { sourceEl } = eventModalOrigin

    if (!popupEl || !backdropEl) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const isMobile = vw <= 768

    // +130px wider than previous 680px -> 810px on desktop
    const targetW = isMobile ? Math.round(vw * 0.95) : Math.min(810, Math.round(vw - 48))
    const targetH = isMobile ? Math.round(vh * 0.92) : Math.round(vh * 0.9)
    const targetLeft = Math.round((vw - targetW) / 2)
    const targetTop = Math.round((vh - targetH) / 2)
    const closeBtn = popupEl.querySelector(".product-modal-close")

    gsap.set(backdropEl, { opacity: 0 })
    gsap.set(popupEl, {
      position: "fixed",
      margin: 0,
      opacity: 1,
      left: eventModalOrigin.left,
      top: eventModalOrigin.top,
      width: eventModalOrigin.width,
      height: eventModalOrigin.height,
      borderRadius: isMobile ? "24px" : "2rem",
      overflowY: "hidden",
    })

    if (imgEl) {
      gsap.set(imgEl, { scale: 1.07 })
    }
    if (heroBottomEl) {
      gsap.set(heroBottomEl, { opacity: 0, y: 26 })
    }
    if (closeBtn) {
      gsap.set(closeBtn, { opacity: 0, scale: 0.78 })
    }

    if (sourceEl) {
      gsap.set(sourceEl, { autoAlpha: 0, pointerEvents: "none" })
    }

    const openTl = gsap.timeline({
      onComplete: () => {
        popupEl.style.overflowY = "auto"
      },
    })

    openTl.to(
      backdropEl,
      {
        opacity: 1,
        duration: 0.45,
        ease: "power2.out",
      },
      0
    )

    openTl.to(
      popupEl,
      {
        left: targetLeft,
        top: targetTop,
        width: targetW,
        height: targetH,
        borderRadius: isMobile ? "26px" : "2.25rem",
        duration: 0.74,
        ease: "expo.inOut",
      },
      0
    )

    if (imgEl) {
      openTl.to(
        imgEl,
        {
          scale: 1,
          duration: 0.9,
          ease: "expo.out",
        },
        0
      )
    }

    if (heroBottomEl) {
      openTl.to(
        heroBottomEl,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        },
        0.34
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

    const handleEsc = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") closeEventModal()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [selectedEvent, eventModalOrigin])

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

      // Contact Atelier Section — Smooth Reveal
      gsap.fromTo(
        ".contact-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-atelier-section",
            start: "top 84%",
            end: "bottom 12%",
            toggleActions: "play reverse play reverse",
          },
        }
      )

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
      data-theme={theme}
      style={{
        "--hero-diamond-color": CAROUSEL_SHOES[k].bg,
        "--hero-next-color": CAROUSEL_SHOES[(k + 1) % CAROUSEL_SHOES.length].bg,
        "--hero-accent-light": CAROUSEL_SHOES[k].accentLight,
        "--hero-accent-glow": CAROUSEL_SHOES[k].accentGlow,
        "--hero-contrast-text": CAROUSEL_SHOES[k].contrastText,
      } as React.CSSProperties}
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

          <div className="home-nav-actions" ref={headerActionsContainerRef}>
            <button
              type="button"
              className="home-nav-btn home-theme-toggle-btn"
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
              title={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
            >
              <span className="theme-icon-wrap" aria-hidden="true">
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </span>
            </button>

            <button
              ref={searchBtnRef}
              type="button"
              className={`home-nav-btn ${activeHeaderMenu === "search" ? "active" : ""}`}
              onClick={() => toggleHeaderMenu("search")}
              aria-label="Rechercher une création"
              aria-expanded={activeHeaderMenu === "search"}
            >
              <Search size={21} />
            </button>

            <button
              ref={bellBtnRef}
              type="button"
              className={`home-nav-btn ${activeHeaderMenu === "notifications" ? "active" : ""}`}
              onClick={() => toggleHeaderMenu("notifications")}
              aria-label="Notifications de l'atelier"
              aria-expanded={activeHeaderMenu === "notifications"}
            >
              <Bell size={21} />
              {hasUnreadNotifications && <span className="home-badge" />}
            </button>

            <button
              ref={bagBtnRef}
              type="button"
              className={`home-nav-btn ${activeHeaderMenu === "bag" ? "active" : ""}`}
              onClick={() => toggleHeaderMenu("bag")}
              aria-label="Sélection et panier Atelier"
              aria-expanded={activeHeaderMenu === "bag"}
            >
              <ShoppingBag size={21} />
              {totalCartCount > 0 && <span className="home-bag-count">{totalCartCount}</span>}
            </button>

            <button
              type="button"
              onClick={() => (window.location.href = "/auth")}
              className="home-profile-btn"
              aria-label="Profil Atelier"
            >
              <img
                src="/couture/other-robes2.webp"
                alt="Profil Atelier"
              />
            </button>

            {activeHeaderMenu && (
              <div
                ref={headerPopoverRef}
                className={`header-bubble-popover ${
                  activeHeaderMenu === "search" ? "header-search-only-popover" : ""
                }`}
                role="dialog"
                aria-label={
                  activeHeaderMenu === "search"
                    ? "Recherche Couture"
                    : activeHeaderMenu === "notifications"
                      ? "Notifications de la Maison"
                      : "Sélection Atelier"
                }
              >
                <span ref={headerArrowRef} className="header-bubble-arrow" aria-hidden="true" />

                {activeHeaderMenu === "search" && (
                  <div className="header-bubble-stagger header-search-field-wrap">
                    <div className="input-effect header-effect-21-wrap">
                      <input
                        ref={searchInputRef}
                        type="text"
                        className={`effect-21 header-effect-21 ${searchQuery ? "has-content" : ""}`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && searchQuery.trim()) {
                            e.preventDefault()
                            closeHeaderMenu()
                            scrollToSection("catalogue-creations")
                          }
                        }}
                        placeholder="Rechercher une création..."
                        aria-label="Rechercher une création couture"
                      />
                      <label className="header-effect-21-label">Recherche Atelier</label>
                      <span className="focus-border">
                        <i />
                      </span>
                      {searchQuery && (
                        <button
                          type="button"
                          className="header-search-clear-btn"
                          onClick={() => {
                            setSearchQuery("")
                            searchInputRef.current?.focus()
                          }}
                          aria-label="Effacer la recherche"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {activeHeaderMenu === "notifications" && (
                  <div className="header-bubble-inner">
                    <div className="header-bubble-stagger header-bubble-top-row">
                      <span className="header-bubble-kicker">Alertes &amp; Salons Privés</span>
                      <span className="header-bubble-pill-status">À jour</span>
                    </div>

                    <div className="header-notif-list">
                      <button
                        type="button"
                        className="header-bubble-stagger header-notif-item"
                        onClick={() => {
                          setActiveHeaderMenu(null)
                          scrollToSection("catalogue-creations")
                        }}
                      >
                        <span className="header-notif-dot" />
                        <div className="header-notif-body">
                          <strong>Nouvelle Capsule Dentelle d&apos;Or</strong>
                          <span>4 nouvelles robes nuptiales ajoutées à la vitrine couture.</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className="header-bubble-stagger header-notif-item"
                        onClick={() => {
                          setActiveHeaderMenu(null)
                          scrollToSection("salons-prives")
                        }}
                      >
                        <span className="header-notif-dot" />
                        <div className="header-notif-body">
                          <strong>Salon Privé des Futures Mariées</strong>
                          <span>18 Novembre 2026 • Dernières places sur rendez-vous.</span>
                        </div>
                      </button>

                      {bookedFittingIds.length > 0 && (
                        <button
                          type="button"
                          className="header-bubble-stagger header-notif-item"
                          onClick={() => {
                            setActiveHeaderMenu(null)
                            scrollToSection("contact-atelier")
                          }}
                        >
                          <span className="header-notif-dot" />
                          <div className="header-notif-body">
                            <strong>{bookedFittingIds.length} Essayage(s) enregistré(s)</strong>
                            <span>Finalisez vos disponibilités avec notre Première d&apos;Atelier.</span>
                          </div>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      className="header-bubble-stagger header-bubble-footer-btn"
                      onClick={() => {
                        setActiveHeaderMenu(null)
                        scrollToSection("contact-atelier")
                      }}
                    >
                      <span>Planifier un essayage privé</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                )}

                {activeHeaderMenu === "bag" && (
                  <div className="header-bubble-inner">
                    <div className="header-bubble-stagger header-bubble-top-row">
                      <span className="header-bubble-kicker">
                        Sélection Atelier ({totalCartCount})
                      </span>
                      {totalCartCount > 0 && (
                        <strong className="header-bag-total">
                          {totalCartAmount.toLocaleString("fr-FR")} €
                        </strong>
                      )}
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="header-bubble-stagger header-bag-empty-box">
                        <p className="header-bubble-empty">
                          Votre sélection sur-mesure est actuellement vide.
                        </p>
                        <button
                          type="button"
                          className="header-bubble-footer-btn"
                          onClick={() => {
                            setActiveHeaderMenu(null)
                            scrollToSection("catalogue-creations")
                          }}
                        >
                          <span>Découvrir les créations</span>
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="header-bag-list">
                          {cartItems.map((entry) => (
                            <div key={entry.id} className="header-bubble-stagger header-bag-row">
                              <img
                                src={entry.product.image}
                                alt={entry.product.name}
                                className="header-search-thumb"
                              />
                              <div className="header-bag-info">
                                <strong>{entry.product.name}</strong>
                                <span>
                                  {entry.colorName} • {entry.size}
                                </span>
                                <span className="header-bag-unit-price">{entry.product.price}</span>
                              </div>
                              <div className="header-bag-controls">
                                <button
                                  type="button"
                                  className="header-bag-qty-btn"
                                  onClick={() => updateCartQty(entry.id, -1)}
                                  aria-label="Diminuer la quantité"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="header-bag-qty-val">{entry.qty}</span>
                                <button
                                  type="button"
                                  className="header-bag-qty-btn"
                                  onClick={() => updateCartQty(entry.id, 1)}
                                  aria-label="Augmenter la quantité"
                                >
                                  <Plus size={12} />
                                </button>
                                <button
                                  type="button"
                                  className="header-bag-remove-btn"
                                  onClick={() => removeFromCart(entry.id)}
                                  aria-label="Retirer de la sélection"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          className="header-bubble-stagger header-bubble-footer-btn"
                          onClick={() => {
                            const summary = cartItems
                              .map(
                                (item) =>
                                  `${item.qty}× ${item.product.name} (${item.colorName}, ${item.size})`
                              )
                              .join(" ; ")
                            setContactMessage(
                              `Bonjour l'Atelier, je souhaite commander / essayer ma sélection : ${summary}.`
                            )
                            setActiveHeaderMenu(null)
                            scrollToSection("contact-atelier")
                          }}
                        >
                          <span>Finaliser ma sélection en salon</span>
                          <ArrowRight size={15} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
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
        <section id="hero-accueil" className="home-hero" style={{ backgroundColor: CAROUSEL_SHOES[k].bg }}>
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
            <button type="button" onClick={() => scrollToSection("catalogue-creations")} className="hero-element home-hero-btn">
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
                  onClick={() => setK(i)}
                  style={{ '--i': i, '--a': `${shoe.a}deg`, cursor: i !== k ? 'pointer' : 'default' } as React.CSSProperties}
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
        <section id="catalogue-creations" className="trending-now-section">
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

        {/* Haute Couture Crossed Silk Ribbons Separator */}
        <section className="section-separator-ribbon" aria-label="Signatures de la Maison">
          {/* Secondary Whisper Linen Ribbon (Counter-tilted, slower inverse drift) */}
          <div className="couture-ribbon-band couture-ribbon-ghost" aria-hidden="true">
            <div className="couture-ribbon-track couture-ribbon-track-reverse">
              {[0, 1].map((dup) => (
                <div key={dup} className="couture-ribbon-group">
                  <span className="ribbon-ghost-item">SOIE NATURELLE DE CÔME</span>
                  <span className="ribbon-diamond-sep">◇</span>
                  <span className="ribbon-ghost-item">DENTELLE DE CALAIS-CAUDRY</span>
                  <span className="ribbon-diamond-sep">◇</span>
                  <span className="ribbon-ghost-item">LIN NORMAND PEIGNÉ</span>
                  <span className="ribbon-diamond-sep">◇</span>
                  <span className="ribbon-ghost-item">BRODERIES DE LUNÉVILLE</span>
                  <span className="ribbon-diamond-sep">◇</span>
                  <span className="ribbon-ghost-item">PATRONAGE EXCLUSIF</span>
                  <span className="ribbon-diamond-sep">◇</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Sovereign Couture Silk Ribbon (Hero-adaptive, tailored top/bottom stitch) */}
          <div className="couture-ribbon-band couture-ribbon-primary">
            <div className="couture-ribbon-stitch-top" aria-hidden="true" />
            <div className="couture-ribbon-track couture-ribbon-track-forward">
              {[0, 1].map((dup) => (
                <div key={dup} className="couture-ribbon-group">
                  <span className="ribbon-sans-item">HAUTE COUTURE &amp; SUR-MESURE</span>
                  <span className="ribbon-star-sep" aria-hidden="true">✦</span>
                  <span className="ribbon-serif-item">L'Éloge de la Grâce</span>
                  <span className="ribbon-star-sep" aria-hidden="true">✦</span>
                  <span className="ribbon-sans-item">ROBES DE MARIÉE &amp; GALA</span>
                  <span className="ribbon-star-sep" aria-hidden="true">✦</span>
                  <span className="ribbon-serif-item">Façonnées à la Main</span>
                  <span className="ribbon-star-sep" aria-hidden="true">✦</span>
                  <span className="ribbon-sans-item">ESSAYAGES PRIVÉS EN SALON</span>
                  <span className="ribbon-star-sep" aria-hidden="true">✦</span>
                </div>
              ))}
            </div>
            <div className="couture-ribbon-stitch-bottom" aria-hidden="true" />
          </div>
        </section>

        {/* Customer Testimonials Section */}
        <section id="temoignages-clientes" className="testimonials-section">
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
        <section id="collections-exclusives" className="featured-carousel-section">
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
        <section id="salons-prives" className="events-pinned-section">
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
                      onClick={(e) => openEventModal(evt, e)}
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
                          onClick={(e) => openEventModal(evt, e)}
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
        <section id="excellence-sur-mesure" className="why-choose-section">
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
                <button
                  type="button"
                  className="why-choose-cta-btn"
                  onClick={() => scrollToSection("contact-atelier")}
                >
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

        {/* SECTION 2: PARCOURS DE CRÉATION & EXPÉRIENCE ATELIER — "DE L'ESQUISSE À LA ROBE RÊVÉE" */}
        <section id="parcours-atelier" className="flagship-studios-section">
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
                <div
                  className="flagship-city-pills"
                  ref={flagshipNavRef}
                  role="tablist"
                  aria-label="Étapes de création sur-mesure"
                >
                  <span
                    className="segmented-pill-glider flagship-city-glider"
                    aria-hidden="true"
                    style={{
                      opacity: flagshipGlider.ready ? 1 : 0,
                      transform: `translate3d(${flagshipGlider.left}px, ${flagshipGlider.top}px, 0)`,
                      width: `${flagshipGlider.width}px`,
                      height: `${flagshipGlider.height}px`,
                    }}
                  />
                  {FLAGSHIP_STUDIOS.map((studio, sIdx) => (
                    <button
                      key={studio.id}
                      ref={(el) => {
                        flagshipBtnRefs.current[sIdx] = el
                      }}
                      type="button"
                      role="tab"
                      aria-selected={activeStudioId === studio.id}
                      className={`flagship-city-pill ${activeStudioId === studio.id ? "active" : ""}`}
                      onClick={() => setActiveStudioId(studio.id)}
                    >
                      <span>{studio.code}</span>
                      <span className="flagship-pill-city-name">{studio.city}</span>
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

        {/* SECTION CONTACT: HAUTE COUTURE & CONCIERGERIE ADAPTATIVE HERO */}
        <section id="contact-atelier" className="contact-atelier-section">
          <div className="contact-atelier-container">
            {/* Editorial Header */}
            <div className="contact-header-bar contact-reveal">
              <div className="contact-header-left">
                <div className="lookbook-kicker-row">
                  <span className="lookbook-kicker-num">CONCIERGERIE PRIVÉE</span>
                  <span className="lookbook-kicker-line contact-dynamic-line" />
                  <span className="lookbook-kicker-label">RENDEZ-VOUS &amp; CRÉATIONS SUR-MESURE</span>
                </div>
                <h2 className="contact-main-title">
                  Écrivons Votre{" "}
                  <span className="lookbook-serif-italic contact-dynamic-italic">
                    Pièce d'Exception.
                  </span>
                </h2>
              </div>

              <div className="contact-header-right">
                <p className="contact-header-manifesto">
                  Première rencontre créative, demande de croquis personnalisé ou réservation de cabine privée : adressez vos envies à nos maîtres couturières. L'esthétique du formulaire épouse en direct la silhouette sélectionnée dans notre vitrine Hero.
                </p>
              </div>
            </div>

            {/* Main 2-Column Interactive Stage */}
            <div className="contact-stage-grid">
              {/* Left Column: Hero Theme Live Sync + Atelier Info Cards */}
              <div className="contact-info-column contact-reveal">
                {/* Live Hero Silhouette Harmony Card */}
                <div className="contact-hero-sync-card">
                  <div className="contact-sync-media">
                    <img
                      src={CAROUSEL_SHOES[k].image}
                      alt={CAROUSEL_SHOES[k].name}
                      className="contact-sync-thumb"
                    />
                    <span className="contact-sync-badge">TEINTE HERO ACTIVE</span>
                  </div>
                  <div className="contact-sync-body">
                    <span className="contact-sync-eyebrow">HARMONIE CHROMATIQUE SYNCHRONISÉE</span>
                    <h3 className="contact-sync-name">{CAROUSEL_SHOES[k].name}</h3>
                    <p className="contact-sync-desc">
                      {CAROUSEL_SHOES[k].desc} · <strong>{CAROUSEL_SHOES[k].paletteLabel}</strong>
                    </p>
                    <div className="contact-swatch-switcher" role="group" aria-label="Changer la silhouette et les couleurs">
                      {CAROUSEL_SHOES.map((item, idx) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setK(idx)}
                          className={`contact-swatch-btn ${k === idx ? "active" : ""}`}
                          style={{ backgroundColor: item.bg }}
                          title={`Appliquer l'ambiance ${item.name}`}
                          aria-label={`Choisir la nuance ${item.name}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Atelier Direct Coordinate Cards */}
                <div className="contact-coords-stack">
                  <a
                    href="https://wa.me/236640927576"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-coord-card contact-coord-link"
                  >
                    <div className="contact-coord-icon">
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div className="contact-coord-text">
                      <span className="contact-coord-label">WHATSAPP &amp; LIGNE DIRECTE ATELIER</span>
                      <strong className="contact-coord-val">+236 6 40 92 75 76</strong>
                      <span className="contact-coord-sub">Échangez directement sur WhatsApp pour croquis &amp; devis</span>
                    </div>
                  </a>

                  <div className="contact-coord-card">
                    <div className="contact-coord-icon">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div className="contact-coord-text">
                      <span className="contact-coord-label">CORRESPONDANCE DIRECTE</span>
                      <strong className="contact-coord-val">atelier@maisonsoiecouture.com</strong>
                      <span className="contact-coord-sub">Réponse dédiée de la Première d'Atelier sous 24h</span>
                    </div>
                  </div>

                  <div className="contact-coord-card">
                    <div className="contact-coord-icon">
                      <FontAwesomeIcon icon={faLocationDot} />
                    </div>
                    <div className="contact-coord-text">
                      <span className="contact-coord-label">SALON PRIVÉ &amp; CABINE D'ESSAYAGE</span>
                      <strong className="contact-coord-val">Mardi au Samedi · 10:00 — 19:30</strong>
                      <span className="contact-coord-sub">Séances individuelles d'1h30 sur rendez-vous</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Color-Adaptive Effect-21 Form Card */}
              <div className="contact-form-card contact-reveal">
                <div className="contact-form-top-strip">
                  <span className="contact-form-kicker">
                    <FontAwesomeIcon icon={faScissors} /> DEMANDE DE CRÉATION &amp; RENDEZ-VOUS
                  </span>
                  <span className="contact-form-palette-tag">
                    NUANCE : {CAROUSEL_SHOES[k].name.toUpperCase()}
                  </span>
                </div>

                <h3 className="contact-form-heading">
                  Partagez votre souhait d'atelier
                </h3>

                {/* Quick Subject Selector Segmented Toggle */}
                <div
                  className="contact-subject-pills"
                  ref={contactSubjectNavRef}
                  role="radiogroup"
                  aria-label="Objet de votre demande"
                >
                  <span
                    className="segmented-pill-glider contact-subject-glider"
                    aria-hidden="true"
                    style={{
                      opacity: contactSubjectGlider.ready ? 1 : 0,
                      transform: `translate3d(${contactSubjectGlider.left}px, ${contactSubjectGlider.top}px, 0)`,
                      width: `${contactSubjectGlider.width}px`,
                      height: `${contactSubjectGlider.height}px`,
                    }}
                  />
                  {CONTACT_SUBJECT_OPTIONS.map((subj, idx) => (
                    <button
                      key={subj}
                      ref={(el) => {
                        contactSubjectBtnRefs.current[idx] = el
                      }}
                      type="button"
                      role="radio"
                      aria-checked={contactSubject === subj}
                      className={`contact-subject-pill ${contactSubject === subj ? "active" : ""}`}
                      onClick={() => setContactSubject(subj)}
                    >
                      {subj}
                    </button>
                  ))}
                </div>

                <form className="contact-form-fields" onSubmit={handleContactSubmit} noValidate>
                  <div className="contact-fields-grid">
                    {/* Nom complet - Effect 21 */}
                    <div className="input-effect-wrap">
                      <div className="effect-21-icon">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div className="input-effect">
                        <input
                          type="text"
                          className={`effect-21 ${contactName ? "has-content" : ""}`}
                          value={contactName}
                          onChange={(e) => {
                            setContactName(e.target.value)
                            if (contactError) setContactError("")
                          }}
                          placeholder=""
                          disabled={contactSubmitState === "sent"}
                          aria-label="Nom & Prénom"
                        />
                        <label>Nom &amp; Prénom *</label>
                        <span className="focus-border">
                          <i />
                        </span>
                      </div>
                    </div>

                    {/* Email - Effect 21 */}
                    <div className="input-effect-wrap">
                      <div className="effect-21-icon">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>
                      <div className="input-effect">
                        <input
                          type="email"
                          className={`effect-21 ${contactEmail ? "has-content" : ""}`}
                          value={contactEmail}
                          onChange={(e) => {
                            setContactEmail(e.target.value)
                            if (contactError) setContactError("")
                          }}
                          placeholder=""
                          disabled={contactSubmitState === "sent"}
                          aria-label="Adresse Email"
                        />
                        <label>Adresse E-mail *</label>
                        <span className="focus-border">
                          <i />
                        </span>
                      </div>
                    </div>

                    {/* Téléphone avec formatage automatique + indicatif pays détecté - Effect 21 */}
                    <div className="input-effect-wrap">
                      <div className="effect-21-icon">
                        <FontAwesomeIcon icon={faPhone} />
                      </div>
                      <div className="input-effect">
                        <input
                          type="tel"
                          inputMode="tel"
                          className={`effect-21 ${contactPhone ? "has-content" : ""} ${contactPhoneCountry ? "has-country-tag" : ""}`}
                          value={contactPhone}
                          onChange={(e) => {
                            const { formatted, countryTag } = formatPhoneWithAutoCountry(
                              e.target.value,
                              contactPhone
                            )
                            setContactPhone(formatted)
                            setContactPhoneCountry(countryTag)
                          }}
                          placeholder=""
                          disabled={contactSubmitState === "sent"}
                          aria-label="Téléphone ou WhatsApp (indicatif automatique)"
                        />
                        <label>Téléphone / WhatsApp</label>
                        {contactPhoneCountry && (
                          <span className="phone-country-pill" title="Indicatif pays détecté automatiquement">
                            {contactPhoneCountry}
                          </span>
                        )}
                        <span className="focus-border">
                          <i />
                        </span>
                      </div>
                    </div>

                    {/* Date souhaitée de votre événement - Calendrier Personnalisé + Effect 21 */}
                    <div className="custom-picker-container" ref={contactDateDropdownRef}>
                      <div
                        className="input-effect-wrap clickable-picker"
                        onClick={() => {
                          if (contactSubmitState === "sent") return
                          setIsContactDatePickerOpen((prev) => !prev)
                        }}
                      >
                        <div className="effect-21-icon">
                          <FontAwesomeIcon icon={faCalendarDays} />
                        </div>
                        <div className="input-effect">
                          <input
                            type="text"
                            readOnly
                            className={`effect-21 ${contactOccasion || isContactDatePickerOpen ? "has-content" : ""}`}
                            value={contactOccasion}
                            onKeyDown={(e) => {
                              if (contactSubmitState === "sent") return
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                setIsContactDatePickerOpen((prev) => !prev)
                              } else if (e.key === "Escape") {
                                setIsContactDatePickerOpen(false)
                              }
                            }}
                            placeholder=""
                            disabled={contactSubmitState === "sent"}
                            aria-label="Date prévue de votre événement"
                            aria-expanded={isContactDatePickerOpen}
                            aria-haspopup="dialog"
                          />
                          <label>Date de votre événement</label>
                          <span className="focus-border">
                            <i />
                          </span>
                        </div>
                      </div>

                      {isContactDatePickerOpen && contactSubmitState !== "sent" && (
                        <div
                          className="custom-calendar-dropdown contact-calendar-dropdown"
                          role="dialog"
                          aria-label="Choisir la date de votre événement"
                        >
                          <div className="calendar-dropdown-header">
                            <button
                              type="button"
                              className="calendar-nav-btn"
                              onClick={() =>
                                setContactCalendarMonth(
                                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                                )
                              }
                              aria-label="Mois précédent"
                            >
                              <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <span className="calendar-month-label">
                              {BESPOKE_MONTH_NAMES[contactCalendarMonth.getMonth()]}{" "}
                              {contactCalendarMonth.getFullYear()}
                            </span>
                            <div className="calendar-header-actions">
                              {contactSelectedDate && (
                                <button
                                  type="button"
                                  className="calendar-nav-btn"
                                  onClick={() => {
                                    setContactSelectedDate(null)
                                    setContactOccasion("")
                                    setIsContactDatePickerOpen(false)
                                  }}
                                  aria-label="Effacer la date sélectionnée"
                                  title="Effacer la date"
                                >
                                  <FontAwesomeIcon icon={faXmark} />
                                </button>
                              )}
                              <button
                                type="button"
                                className="calendar-nav-btn"
                                onClick={() =>
                                  setContactCalendarMonth(
                                    (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                                  )
                                }
                                aria-label="Mois suivant"
                              >
                                <FontAwesomeIcon icon={faChevronRight} />
                              </button>
                            </div>
                          </div>

                          <div className="calendar-weekdays-row">
                            {BESPOKE_WEEKDAYS.map((wd) => (
                              <span key={wd} className="calendar-weekday-cell">
                                {wd}
                              </span>
                            ))}
                          </div>

                          <div className="calendar-days-grid">
                            {getMonthCalendarDays(
                              contactCalendarMonth.getFullYear(),
                              contactCalendarMonth.getMonth()
                            ).map((cell, idx) =>
                              !cell.isCurrentMonth ? (
                                <span key={`empty-${idx}`} className="calendar-empty-cell" />
                              ) : (
                                <button
                                  key={cell.date.toISOString()}
                                  type="button"
                                  disabled={cell.isPast}
                                  className={`calendar-day-btn ${
                                    isSameCalendarDay(contactSelectedDate, cell.date) ? "selected" : ""
                                  }`}
                                  onClick={() => {
                                    setContactSelectedDate(cell.date)
                                    setContactOccasion(formatBespokeDate(cell.date))
                                    setIsContactDatePickerOpen(false)
                                  }}
                                >
                                  {cell.date.getDate()}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Textarea - Effect 21 */}
                  <div className="input-effect-wrap contact-textarea-wrap">
                    <div className="effect-21-icon effect-21-textarea-icon">
                      <FontAwesomeIcon icon={faCommentDots} />
                    </div>
                    <div className="input-effect">
                      <textarea
                        rows={4}
                        className={`effect-21 contact-textarea ${contactMessage ? "has-content" : ""}`}
                        value={contactMessage}
                        onChange={(e) => {
                          setContactMessage(e.target.value)
                          if (contactError) setContactError("")
                        }}
                        placeholder=""
                        disabled={contactSubmitState === "sent"}
                        aria-label="Votre message et vos inspirations couture"
                      />
                      <label>Votre message &amp; inspirations *</label>
                      <span className="focus-border">
                        <i />
                      </span>
                    </div>
                  </div>

                  {contactError && (
                    <div className="contact-error-banner" role="alert">
                      {contactError}
                    </div>
                  )}

                  {/* Submit Event Button with 3-Stage Liquid Collision Hover + Morphing Click State */}
                  <div className="contact-submit-row">
                    <button
                      type="submit"
                      className={`contact-liquid-submit-btn ${
                        contactSubmitState === "sending"
                          ? "is-sending"
                          : contactSubmitState === "sent"
                            ? "is-sent"
                            : ""
                      }`}
                      disabled={contactSubmitState === "sending"}
                    >
                      <span className="contact-liquid-blobs" aria-hidden="true">
                        <span className="contact-liquid-blob b-1" />
                        <span className="contact-liquid-blob b-2" />
                        <span className="contact-liquid-blob b-3" />
                        <span className="contact-liquid-blob b-4" />
                        <span className="contact-liquid-blob b-5" />
                        <span className="contact-liquid-blob b-6" />
                      </span>

                      <span className="contact-btn-label-wrap">
                        {contactSubmitState === "idle" && (
                          <>
                            <FontAwesomeIcon icon={faPaperPlane} className="contact-btn-icon" />
                            <span>Envoyer le message</span>
                          </>
                        )}
                        {contactSubmitState === "sending" && (
                          <>
                            <FontAwesomeIcon icon={faCircleNotch} spin className="contact-btn-icon" />
                            <span>Transmission à l'Atelier...</span>
                          </>
                        )}
                        {contactSubmitState === "sent" && (
                          <>
                            <FontAwesomeIcon icon={faCheck} className="contact-btn-icon" />
                            <span>Message Envoyé</span>
                          </>
                        )}
                      </span>
                    </button>

                    <span className="contact-privacy-note">
                      Réponse personnalisée sous 24h ouvrées · Confidentialité absolue
                    </span>
                  </div>
                </form>

                {contactSubmitState === "sent" && (
                  <div className="contact-sent-confirmation">
                    <div className="contact-sent-head">
                      <FontAwesomeIcon icon={faCheckCircle} className="contact-sent-check" />
                      <div>
                        <strong>Votre demande a été enregistrée pour « {contactSubject} »</strong>
                        <p>
                          Merci <strong>{contactName}</strong>. Notre Première d'Atelier a reçu votre note inspirée par la nuance <em>{CAROUSEL_SHOES[k].name}</em> et vous contactera très rapidement à <strong>{contactEmail}</strong>.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="contact-reset-btn"
                      onClick={resetContactForm}
                    >
                      Rédiger un autre message
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SITE FOOTER — MAISON SOIE & COUTURE */}
      <footer className="site-footer">
        {/* Top Signature Strip */}
        <div className="footer-cta-banner">
          <div className="footer-cta-left">
            <span className="footer-cta-eyebrow">MAISON DE HAUTE COUTURE &amp; PATRONAGE SUR-MESURE</span>
            <h2 className="footer-cta-title">
              Sublimez Chaque Instant d'Exception.
            </h2>
          </div>
          <div className="footer-cta-right">
            <button
              type="button"
              className="footer-cta-btn"
              onClick={() => scrollToSection("contact-atelier")}
            >
              <span>Prendre Rendez-Vous en Salon</span>
              <ArrowUpRight size={17} />
            </button>
          </div>
        </div>

        {/* Main 4-Column Editorial Footer Grid */}
        <div className="footer-main-grid">
          {/* Column 1: Maison Identity */}
          <div className="footer-brand-col">
            <div className="footer-brand-logo">
              <div className="footer-logo-square">
                <Sparkles size={17} />
              </div>
              <span className="footer-brand-name">Maison Soie &amp; Couture</span>
            </div>
            <p className="footer-brand-desc">
              Maison de confection dédiée aux robes de mariée, silhouettes de gala et pièces de cérémonie façonnées à la main avec les plus nobles soieries de Côme, dentelles de Calais et lins peignés.
            </p>
            <div className="footer-atelier-badge">
              NUANCE EN VITRINE : {CAROUSEL_SHOES[k].name.toUpperCase()}
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">SILHOUETTES &amp; CRÉATIONS</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => scrollToSection("hero-accueil")}>
                  Vitrine Haute Couture
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("catalogue-creations")}>
                  Catalogue &amp; Pièces Phares
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("collections-exclusives")}>
                  Collections Exclusives
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("temoignages-clientes")}>
                  Confidences de Mariées
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Experience */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">SAVOIR-FAIRE &amp; SALONS</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => scrollToSection("salons-prives")}>
                  Salons Privés &amp; Défilés
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("excellence-sur-mesure")}>
                  L'Excellence du Sur-Mesure
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("parcours-atelier")}>
                  De l'Esquisse à la Robe Rêvée
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("contact-atelier")}>
                  Conciergerie &amp; Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Atelier Contact & Hours */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">L'ATELIER SUR RENDEZ-VOUS</h4>
              <div className="footer-contact-details">
                <div className="footer-contact-line">
                  <FontAwesomeIcon icon={faPhone} className="footer-contact-ic" />
                  <a
                    href="https://wa.me/236640927576"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-contact-link"
                  >
                    +236 6 40 92 75 76 (WhatsApp)
                  </a>
                </div>
                <div className="footer-contact-line">
                  <FontAwesomeIcon icon={faEnvelope} className="footer-contact-ic" />
                  <span>atelier@maisonsoiecouture.com</span>
                </div>
                <div className="footer-contact-line">
                  <FontAwesomeIcon icon={faClock} className="footer-contact-ic" />
                  <span>Mardi — Samedi · 10h00 à 19h30</span>
                </div>
                <div className="footer-contact-line">
                  <FontAwesomeIcon icon={faLocationDot} className="footer-contact-ic" />
                  <span>Salon Privé · Sur Rendez-Vous Uniquement</span>
                </div>
              </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © 2026 Maison Soie &amp; Couture · Tous droits réservés · Haute Couture &amp; Sur-Mesure Artisanal.
          </div>
          <div className="footer-bottom-tags">
            <span className="footer-bottom-tag">100% FAIT MAIN</span>
            <span className="footer-bottom-tag">PATRONAGE UNIQUE</span>
            <button
              type="button"
              className="footer-back-top-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Haut de page ↑
            </button>
          </div>
        </div>
      </footer>


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
                      <div
                        className="product-modal-size-grid"
                        ref={sizeNavRef}
                        role="radiogroup"
                        aria-label="Taille ou Coupe"
                      >
                        <span
                          className="segmented-pill-glider product-modal-size-glider"
                          aria-hidden="true"
                          style={{
                            opacity: sizeGlider.ready ? 1 : 0,
                            transform: `translate3d(${sizeGlider.left}px, ${sizeGlider.top}px, 0)`,
                            width: `${sizeGlider.width}px`,
                            height: `${sizeGlider.height}px`,
                          }}
                        />
                        {selectedProduct.sizes.map((size, sIdx) => (
                          <button
                            key={size}
                            ref={(el) => {
                              sizeBtnRefs.current[sIdx] = el
                            }}
                            type="button"
                            role="radio"
                            aria-checked={selectedSize === size}
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
                        const chosenColor =
                          selectedProduct.colors[selectedColorIndex]?.name || "Sur-Mesure"
                        const chosenSize = selectedSize || selectedProduct.sizes[0] || "Sur-Mesure"
                        addToCart(selectedProduct, chosenColor, chosenSize)
                        closeProductModal()
                        window.setTimeout(() => {
                          setActiveHeaderMenu("bag")
                        }, 360)
                      }}
                    >
                      <span>Ajouter à ma sélection • {selectedProduct.price}</span>
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

      {/* Event Detail Modal Popup (GSAP FLIP displaced from exact card position) */}
      {selectedEvent && (
        <div
          ref={eventModalBackdropRef}
          className="product-modal-backdrop event-modal-backdrop-ext"
          onClick={closeEventModal}
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            ref={eventModalCardRef}
            className="event-modal-card event-modal-card-ext"
            onClick={(e) => e.stopPropagation()}
            onScroll={(e) => {
              const target = e.currentTarget
              const elements = target.querySelectorAll('.gsap-scroll-reveal')
              const modalHeight = target.clientHeight
              elements.forEach((el) => {
                const rect = el.getBoundingClientRect()
                const containerRect = target.getBoundingClientRect()
                const topOffset = rect.top - containerRect.top
                
                if (topOffset < modalHeight * 0.99 && topOffset > -rect.height * 0.5) {
                  gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" })
                } else if (topOffset >= modalHeight * 0.99) {
                  gsap.to(el, { opacity: 0.15, y: 25, duration: 0.4, ease: "power2.out", overwrite: "auto" })
                } else if (topOffset <= -rect.height * 0.5) {
                  gsap.to(el, { opacity: 0, y: -20, duration: 0.4, ease: "power2.out", overwrite: "auto" })
                }
              })
            }}
          >
            <button
              className="product-modal-close"
              onClick={closeEventModal}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            {/* Event Hero Cover Header (Occupies 100% of initial popup fold, exact original design) */}
            <div className="event-modal-hero">
              <img
                ref={eventModalHeroImgRef}
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="event-modal-hero-img"
              />

              {/* Transparent to solid dark gradient background overlay behind text elements */}
              <div className="event-modal-hero-overlay" />

              <div ref={eventModalHeroBottomRef} className="event-modal-hero-bottom">
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

                {/* Action CTA Register Button */}
                <div className="event-modal-actions gsap-scroll-reveal">
                  <button
                    type="button"
                    className={`event-modal-cta-btn ${
                      registeredEvents.includes(selectedEvent.id) ? "registered" : ""
                    }`}
                    onClick={() => toggleEventRegistration(selectedEvent.id)}
                  >
                    {registeredEvents.includes(selectedEvent.id) ? (
                      <>
                        <FontAwesomeIcon icon={faCheckCircle} /> Place Réservée ✓ — Annuler l'inscription
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} /> Confirmer mon Inscription Gratuite
                      </>
                    )}
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}

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
                        onClick={() => setSelectedWhySlot(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 7. Signature Action Footer */}
              <div className="why-modal-actions-row why-modal-stagger-item">
                <button
                  type="button"
                  className={`why-modal-book-btn ${
                    bookedWhySessions.includes(selectedWhyModal.card.id) ? "booked" : ""
                  }`}
                  onClick={() => toggleWhySessionBooking(selectedWhyModal.card.id)}
                >
                  {bookedWhySessions.includes(selectedWhyModal.card.id) ? (
                    <>
                      <span>Session réservée • {selectedWhySlot}</span>
                      <span className="why-modal-btn-Check">✓</span>
                    </>
                  ) : (
                    <>
                      <span>Réserver la session</span>
                      <span className="why-modal-btn-right">
                        {selectedWhySlot} — {selectedWhyModal.card.price}
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

      {/* Floating Customer Service / WhatsApp Button */}
      <a
        href="https://wa.me/236640927576"
        target="_blank"
        rel="noopener noreferrer"
        className="home-fab"
        aria-label="Contacter l'atelier sur WhatsApp au +236 6 40 92 75 76"
      >
        <HeadphonesIcon size={24} />
        <span className="home-fab-tooltip">
          WhatsApp Atelier · +236 6 40 92 75 76
        </span>
      </a>
    </div>
  )
}
