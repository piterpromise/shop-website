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
  Sparkles,
  X,
} from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFireFlameSimple, faTruck, faCircle } from "@fortawesome/free-solid-svg-icons"

gsap.registerPlugin(ScrollTrigger)

interface ColorOption {
  name: string
  hex: string
}

interface Product {
  id: number
  name: string
  price: string
  category: string
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
  {
    id: 1,
    name: "Nike Air Max Pulse",
    price: "$150",
    category: "Men's Shoes",
    color: "bg-gradient-product-1",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    badge: "New",
    description: "Design emblématique en rouge écarlate avec amorti Air Max dynamique pour un confort quotidien réinventé.",
    longDescription: "Inspirée par l'énergie de la scène underground londonienne, la Nike Air Max Pulse allie une esthétique sportive épurée à une technologie d'amorti sous le talon inégalée. Conçue pour offrir un rebond réactif à chaque foulée.",
    model: "DX3605-100",
    sizes: ["EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"],
    colors: [
      { name: "Rouge / Noir", hex: "#dc2626" },
      { name: "Blanc Pur", hex: "#ffffff" },
      { name: "Noir Onyx", hex: "#111827" },
    ],
    rating: 4.8,
    reviewsCount: 124,
  },
  {
    id: 2,
    name: "Apple Watch Ultra",
    price: "$799",
    category: "Smartwatches",
    color: "bg-gradient-product-2",
    image:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&auto=format&fit=crop&q=80",
    badge: "Trending",
    description: "Boîtier en titane ultra-résistant avec écran Retina Always-On de 2000 nits et GPS haute précision à double fréquence.",
    longDescription: "Conçue pour repousser les limites des athlètes et aventuriers de l'extrême. Autonomie prolongée jusqu'à 36h, résistance à l'eau jusqu'à 100m et bouton Action personnalisable en aluminium anodisé.",
    model: "MNE03QL/A",
    sizes: ["49 mm"],
    colors: [
      { name: "Titane Naturel", hex: "#9ca3af" },
      { name: "Orange Alpin", hex: "#f97316" },
      { name: "Boucle Marine", hex: "#1e3a8a" },
    ],
    rating: 4.9,
    reviewsCount: 310,
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    price: "$398",
    category: "Headphones",
    color: "bg-gradient-product-3",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=80",
    description: "Casque Bluetooth à réduction de bruit active numéro 1 avec processeur V1 et haut-parleurs de 30mm haute fidélité.",
    longDescription: "Le Sony WH-1000XM5 réinvente l'écoute sans distraction. Équipé de 8 microphones et de 2 processeurs dédiés à l'annulation du bruit environnant, profitez d'une clarté d'appel cristalline et jusqu'à 30h d'autonomie.",
    model: "WH1000XM5/B",
    sizes: ["Taille Unique"],
    colors: [
      { name: "Noir Mat", hex: "#1f2937" },
      { name: "Argent Soft", hex: "#e5e7eb" },
      { name: "Bleu Nuit", hex: "#1e293b" },
    ],
    rating: 4.7,
    reviewsCount: 215,
  },
  {
    id: 4,
    name: "Nike Dri-FIT ADV",
    price: "$85",
    category: "Apparel",
    color: "bg-gradient-product-4",
    image:
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80",
    description: "Chaussure de running ultra-légère avec technologie Dri-FIT respirante et semelle souple dynamique.",
    longDescription: "Un alliage parfait entre performance respirante et design épuré en bleu saphir. La tige en tricot thermorégulateur garde vos pieds au frais pendant les sessions d'entraînement les plus intenses.",
    model: "DR5622-401",
    sizes: ["EU 39", "EU 40", "EU 41", "EU 42", "EU 43"],
    colors: [
      { name: "Bleu Electric", hex: "#2563eb" },
      { name: "Gris Platine", hex: "#9ca3af" },
      { name: "Vert Volt", hex: "#d2ff72" },
    ],
    rating: 4.6,
    reviewsCount: 88,
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
    name: "Emily R.",
    role: "Sneakerhead & Designer",
    quote:
      "Livraison ultra rapide et paires 100% authentiques. La technologie d'amorti et le confort quotidien sont exceptionnels !",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80",
    x: 12,
    y: 16,
  },
  {
    id: 2,
    name: "Sarah M.",
    role: "Marathonienne",
    quote:
      "Des baskets légères et un confort de course inégalé. Le service client m'a guidée avec soin sur la taille parfaite.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    x: 35,
    y: 12,
  },
  {
    id: 3,
    name: "David K.",
    role: "Collectionneur Sneaker",
    quote:
      "Finition impeccable et emballage ultra soigné. Kicks&Co est incontestablement devenu mon shop de référence !",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    x: 65,
    y: 12,
  },
  {
    id: 4,
    name: "Jessica P.",
    role: "Fitness Trainer",
    quote:
      "Un maintien du pied parfait et un style au top pour mes séances d'entraînement intensives au quotidien.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    x: 88,
    y: 18,
  },
  {
    id: 5,
    name: "Alex B.",
    role: "Streetwear Creator",
    quote:
      "Design épuré, matériaux haut de gamme et esthétique incroyable. Je recommande les yeux fermés à la communauté.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    x: 7,
    y: 50,
  },
  {
    id: 6,
    name: "Clara T.",
    role: "Acheteuse Vérifiée",
    quote:
      "Expérience d'achat ultra fluide de A à Z. La livraison express en 24h a été parfaitement respectée !",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    x: 93,
    y: 52,
  },
  {
    id: 7,
    name: "Marcus V.",
    role: "Coach Sportif",
    quote:
      "Une réactivité exemplaire du support et des modèles exclusifs rares disponibles immédiatement. Un 5/5 bien mérité !",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    x: 20,
    y: 84,
  },
  {
    id: 8,
    name: "Hannah L.",
    role: "Content Creator",
    quote:
      "Le confort est absolu dès le premier jour où on les enfile. Les finitions et détails font toute la différence !",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    x: 80,
    y: 82,
  },
  {
    id: 9,
    name: "Lucas D.",
    role: "Athlete & Runner",
    quote:
      "Des paires extrêmement confortables et un style unique. Je suis complètement fan de la qualité Kicks&Co !",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
    x: 50,
    y: 84,
  },
]

interface CarouselShoe {
  name: string
  code: string
  desc: string
  a: number
  bg: string
}

const CAROUSEL_SHOES: CarouselShoe[] = [
  { name: "AIR MAX", code: "1542291026-7eec264c27ff", desc: "Nike Air Max Pulse", a: -12, bg: "#111827" },
  { name: "ULTRA RUN", code: "1515955656352-a1fa3ffcd111", desc: "Nike Dri-FIT ADV", a: -6, bg: "#0f172a" },
  { name: "SONY XM5", code: "1618366712010-f4ae9c647dcb", desc: "Sony WH-1000XM5", a: 0, bg: "#171717" },
  { name: "APPLE WATCH", code: "1434493789847-2f02dc6ca35d", desc: "Apple Watch Ultra", a: 6, bg: "#1e1b4b" },
  { name: "KICKS SPEC", code: "1600185365483-26d7a4cc7519", desc: "Special Edition", a: 12, bg: "#064e3b" },
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
    avatar: string
  }
  description: string
  highlights: string[]
  perks: string[]
}

const eventsData: EventItem[] = [
  {
    id: 1,
    title: "Workshop & Events",
    subtitle: "Rejoignez nos ateliers exclusifs, retraites créatives et masterclasses d'exception conçus pour perfectionner vos compétences et sublimer votre style.",
    category: "Design & Craftsmanship",
    date: "18 Octobre 2026 • 14:00 - 18:00",
    location: "La Caserne, Paris 10e",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&auto=format&fit=crop&q=80",
    speaker: {
      name: "Tinker Hatfield & Team",
      role: "Lead Innovators & Designers",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
    },
    description: "Une journée immersive unique dédiée au design de silhouettes streetwear, au prototypage 3D et au choix de matériaux durables de nouvelle génération. Découvrez l'envers du décor du design de sneakers iconiques.",
    highlights: [
      "09:30 - Keynote d'ouverture & Analyse des tendances 2027",
      "11:30 - Atelier pratique d'esquisse et rendu de matière",
      "14:30 - Session individuelle de feedback & Mentorat",
      "17:00 - Dévoilement des projets & Cocktails VIP"
    ],
    perks: [
      "Kit de dessin professionnel offert",
      "Accès prioritaire aux drops Kicks&Co 2026",
      "Certificat d'accomplissement numéroté"
    ]
  },
  {
    id: 2,
    title: "Women's Wellness Yoga Retreat",
    subtitle: "Un séjour d'immersion totale entre méditation, renforcement musculaire et récupération sportive d'élite.",
    category: "Wellness & Life",
    date: "24-26 Octobre 2026",
    location: "Domaine de la Sainte-Victoire, Aix-en-Provence",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80",
    speaker: {
      name: "Elena Rostova",
      role: "Master Yoga Instructor & Biohacker",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80"
    },
    description: "Reconnectez votre esprit et votre corps avec des sessions de vinyasa guidées, des bains glacés de récupération et un accompagnement nutritionnel sur-mesure dans un cadre naturel majestueux.",
    highlights: [
      "07:30 - Sunrise Meditation & Vinyasa Flow",
      "10:30 - Atelier Biohacking & Récupération Musculaire",
      "15:00 - Sound Bath & Respiration Holotropique",
      "19:00 - Dîner Gastronomique Bio & Échange Communautaire"
    ],
    perks: [
      "Tenue d'entraînement Kicks&Co Eco-Seamless",
      "Bouteille isotherme gravée personnalisée",
      "Bilan de souplesse & récupération offert"
    ]
  },
  {
    id: 3,
    title: "Streetball Championship 2026",
    subtitle: "Le plus grand tournoi 3x3 streetwear rassemblant les meilleurs talents et DJs de la scène urbaine.",
    category: "Tournament & Performance",
    date: "05 Novembre 2026 • 10:00 - 22:00",
    location: "Playground Part-Dieu, Lyon",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&auto=format&fit=crop&q=80",
    speaker: {
      name: "Marcus Vance",
      role: "Former Pro Athlete & Coach",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
    },
    description: "Vivez une compétition intense de basketball streetball 3x3. Musique live, contest de dunks spectaculaires, foodtrucks gastronomiques et customisation de paires en temps réel.",
    highlights: [
      "10:00 - Qualifications & Poules éliminatoires",
      "14:00 - Concert DJ Live & Performance Breakdance",
      "16:30 - Contest de Dunks Exclusif Kicks&Co",
      "19:30 - Grande Finale & Remise du Cashprize de 15 000 €"
    ],
    perks: [
      "Maillot d'équipe numéroté personnalisé",
      "Pass VIP accès aux loges joueurs",
      "Pack d'hydratation & nutrition sportive"
    ]
  },
  {
    id: 4,
    title: "Art of Sneaker Customisation",
    subtitle: "Apprenez les techniques de peinture, préparation des cuirs et gravure laser auprès d'artistes internationaux.",
    category: "Creative Workshop",
    date: "12 Novembre 2026 • 13:30 - 19:00",
    location: "Atelier Kicks&Co, Bordeaux",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&auto=format&fit=crop&q=80",
    speaker: {
      name: "Alexis 'Kustom' Moreau",
      role: "Sneaker Artist & Custom Specialist",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
    },
    description: "Transformez vos paires en pièces d'art uniques. Maîtrisez le décapage, l'aérographie, les motifs pochoirs et l'application de vernis de protection hydrophobes longue durée.",
    highlights: [
      "13:30 - Théorie des cuirs, textiles & préparation de la surface",
      "15:00 - Pratique de l'aérographe & techniques de dégradés",
      "17:30 - Pose des détails au pinceau fin & finition mat/brillant",
      "18:30 - Séance photo professionnelle de vos créations"
    ],
    perks: [
      "Coffret de peintures Angelus & 5 pinceaux de précision",
      "Une paire de sneakers vierge offerte pour le workshop",
      "Support d'entretien & vernis pro offert"
    ]
  },
  {
    id: 5,
    title: "Next-Gen Carbon Running Experience",
    subtitle: "Testez les dernières mousses d'amorti et plaques de carbone lors d'un run nocturne chronométré avec analyse IA.",
    category: "Run & Technology",
    date: "20 Novembre 2026 • 20:00 - 23:00",
    location: "Corniche Kennedy & MUCEM, Marseille",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80",
    speaker: {
      name: "David K. & Sports Lab",
      role: "Biomechanical Engineers",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
    },
    description: "Testez vos limits sur 10 km le long du littoral marseillais avec capteurs connectés aux pieds. Recevez une analyse biomécanique complète de votre cadence, pronation et restitution d'énergie.",
    highlights: [
      "20:00 - Fitting des prototypes & Calibrage des capteurs podologiques",
      "20:45 - Départ du Night Run 10K illuminé au néon",
      "22:00 - Débriefing Data individuel & Restitution d'énergie par IA",
      "22:30 - Recovery Lounge & Smoothies protéinés"
    ],
    perks: [
      "Dossard connecté & puce de chronométrage haute précision",
      "Rapport biomécanique PDF complet de votre foulée",
      "Lampe frontale ultra-léger Kicks&Co"
    ]
  }
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
  const [k, setK] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [activeTestimonialId, setActiveTestimonialId] = useState<number>(1)

  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([])
  const [leftTextOpacity, setLeftTextOpacity] = useState<number>(1)
  const eventsScrollRef = useRef<HTMLDivElement>(null)

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

  const openProductModal = (product: Product) => {
    setSelectedProduct(product)
    setSelectedColorIndex(0)
    setSelectedSize(product.sizes[0] || "")
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
  }

  useGSAP(
    () => {
      // Hero Animation
      gsap.from(".hero-element", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      })

      // Scroll Animations for Product Cards (Staggered)
      gsap.from(".product-card", {
        scrollTrigger: {
          trigger: ".product-grid",
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play reverse play reverse",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
      })

      // Staggered Entrance/Exit Animation for Testimonial Avatars
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

      // GSAP Pinned Horizontal Scroll Section with Individual Card Animations & Text Fade
      const pinnedSection = document.querySelector(".events-pinned-section") as HTMLElement
      const cardsTrack = document.querySelector(".events-cards-track") as HTMLElement
      const leftPanel = document.querySelector(".events-left-panel") as HTMLElement
      const eventCards = document.querySelectorAll(".events-cards-track .event-card")

      if (pinnedSection && cardsTrack && leftPanel) {
        const progressBarFill = document.querySelector(".events-progress-bar-fill") as HTMLElement
        const getScrollAmount = () => {
          return cardsTrack.scrollWidth - window.innerWidth + 120
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
          },
        })

        // 1. Move horizontal cards track to the left
        timeline.to(
          cardsTrack,
          {
            x: () => -getScrollAmount(),
            ease: "none",
          },
          0
        )

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

        // 4. Staggered individual card entrance & scroll-up / scroll-down reveal effect
        eventCards.forEach((card, index) => {
          gsap.fromTo(
            card,
            { opacity: 0.3, y: 40, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: timeline,
                start: "left 90%",
                end: "left 50%",
                scrub: 0.5,
              },
            }
          )
        })
      }

      // GSAP Entrance Animation for Éditions Limitées section
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
              start: "top 80%",
              toggleActions: "play none none reverse",
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
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: editionsSection,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }
      }

      // Infinite Marquee for announcements
      gsap.to(".marquee-inner", {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1,
      })
    },
    { scope: container },
  )

  return (
    <div
      ref={container}
      className="home-page"
    >
      {/* Navbar (Fixed) */}
      <nav className="home-navbar">
        <div className="home-nav-content">
          <div className="home-logo">
            <div className="home-logo-icon">
              <TrendingUp size={18} />
            </div>
            <span className="home-logo-text">Kicks&Co</span>
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
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Profile"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Announcements Marquee */}
      <div className="home-marquee">
        <div className="marquee-inner">
          <span><FontAwesomeIcon icon={faFireFlameSimple} /> Flash Sale: 30% OFF on selected items</span>
          <span><FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.75em' }} /></span>
          <span><FontAwesomeIcon icon={faTruck} /> Free Shipping on orders over $150</span>
          <span><FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.75em' }} /></span>
          <span><FontAwesomeIcon icon={faFireFlameSimple} /> Flash Sale: 30% OFF on selected items</span>
          <span><FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.75em' }} /></span>
          <span><FontAwesomeIcon icon={faTruck} /> Free Shipping on orders over $150</span>
          <span><FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.75em' }} /></span>
          <span><FontAwesomeIcon icon={faFireFlameSimple} style={{ color: '#D2FF72' }} /> Flash Sale: 30% OFF on selected items</span>
          <span><FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.75em' }} /></span>
          <span><FontAwesomeIcon icon={faTruck} /> Free Shipping on orders over $150</span>
        </div>
      </div>

      <main className="home-main">
        {/* Hero Section */}
        <section className="home-hero" style={{ backgroundColor: CAROUSEL_SHOES[k].bg }}>
          <div className="home-hero-left">
            <span className="hero-element home-tag">
              New Collection
            </span>
            <h1 className="hero-element home-hero-title">
              Step Into <br />{" "}
              <span className="home-hero-title-light">The Future.</span>
            </h1>
            <p className="hero-element home-hero-desc">
              Experience unparalleled comfort and style with our latest drops.
              Engineered for everyday athletes.
            </p>
            <button className="hero-element home-hero-btn">
              Explore Now <TrendingUp size={20} className="animate-draw-arrow" />
            </button>
            <div className="hero-element home-hero-brands">
              <span className="brand-logo" title="Xbox">
                <ion-icon name="logo-xbox"></ion-icon>
              </span>
              <span className="brand-logo" title="Microsoft">
                <ion-icon name="logo-microsoft"></ion-icon>
              </span>
              <span className="brand-logo" title="Apple">
                <ion-icon name="logo-apple"></ion-icon>
              </span>
              <span className="brand-logo" title="Amazon">
                <ion-icon name="logo-amazon"></ion-icon>
              </span>
              <span className="brand-logo" title="PlayStation">
                <ion-icon name="logo-playstation"></ion-icon>
              </span>
            </div>
            <div className="hero-element home-scroll-indicator">
              <span>Scroll</span>
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
                  <img src={`https://images.unsplash.com/photo-${shoe.code}?w=800`} alt={shoe.desc} />
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

        {/* Product Grid */}
        <section>
          <div className="home-section-header">
            <h2 className="home-section-title">Trending Now</h2>
            <button className="home-section-link">
              View All
            </button>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => openProductModal(product)}
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
                      openProductModal(product)
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

            {/* Thin 1.2px Black Top & Bottom Borders */}
            <use href="#ribbonTopBorder" stroke="#111827" strokeWidth="1.2" fill="none" />
            <use href="#ribbonBottomBorder" stroke="#111827" strokeWidth="1.2" fill="none" />

            {/* Neon Green Scrolling Text */}
            <text
              fill="#000000ff"
              fontSize="20"
              fontWeight="700"
              letterSpacing="1px"
              dominantBaseline="central"
              alignmentBaseline="middle"
              dy="1px"
            >
              <textPath href="#separatorRibbonTextPath" startOffset="0%">
                • DES BASKETS D'EXCEPTION &amp; CONFORT INÉGALÉ • SERVICE CLIENT RÉACTIF 7J/7 • LIVRAISON EXPRESS 24H OFFERTE • 100% PRODUITS AUTHENTIQUES • REJOIGNEZ KICKS&amp;CO • DES BASKETS D'EXCEPTION &amp; CONFORT INÉGALÉ •
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
              <span className="testimonials-pill-badge">Avis Clients</span>
              <h2 className="testimonials-title">Avis de notre Communauté</h2>
              <p className="testimonials-subtitle">
                Découvrez les retours de nos acheteurs sur le confort, l'authenticité et la rapidité de notre service Kicks&amp;Co.
              </p>
            </div>

            {/* Floating Avatars Layer */}
            <div className="testimonials-avatars-layer">
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
          </div>
        </section>

        {/* Featured 3D Parallax Coverflow Carousel (Customized & Unbridled 90vw width) */}
        <section className="featured-carousel-section">
          <div className="featured-carousel-header">
            <span className="testimonials-pill-badge carousel-badge">Éditions Limités</span>
            <h2 className="featured-carousel-title">Collections Exclusives</h2>
            <p className="featured-carousel-subtitle">
              Explorez nos séries iconiques et modèles d'exception façonnés pour les passionnés.
            </p>
          </div>

          <div className="mzaCarousel" id="mzaCarousel" aria-roledescription="carousel" aria-label="Featured cards">
            <div className="mzaCarousel-viewport" tabIndex={0}>
              <div className="mzaCarousel-track">
                <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="1 of 10">
                  <div className="mzaCard" style={{ "--mzaCard-bg": "url('/PHONES/pexels-aksbykas-14979023.jpg')" } as React.CSSProperties}>
                    <header className="mzaCard-head mzaPar-1">
                      <h2 className="mzaCard-title">Titanium Series</h2>
                      <p className="mzaCard-kicker">Next-Gen Smartphone</p>
                    </header>
                    <p className="mzaCard-text mzaPar-2">Conçu en titane ultra-résistant avec écran Super Retina XDR et performances graphiques inégalées.</p>
                    <footer className="mzaCard-actions mzaPar-3">
                      <button className="mzaBtn">Découvrir le Modèle</button>
                    </footer>
                  </div>
                </article>

                <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="2 of 10">
                  <div className="mzaCard" style={{ "--mzaCard-bg": "url('/PHONES/pexels-caleboquendo-9667336.jpg')" } as React.CSSProperties}>
                    <header className="mzaCard-head mzaPar-1">
                      <h2 className="mzaCard-title">Cyber Edition</h2>
                      <p className="mzaCard-kicker">Futuristic Aesthetic</p>
                    </header>
                    <p className="mzaCard-text mzaPar-2">Un design audacieux associé à une technologie de pointe pour une expérience mobile immersive.</p>
                    <footer className="mzaCard-actions mzaPar-3">
                      <button className="mzaBtn">Voir les Détails</button>
                    </footer>
                  </div>
                </article>

                <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="3 of 10">
                  <div className="mzaCard" style={{ "--mzaCard-bg": "url('/PHONES/pexels-debraj-roy-282189167-13780425.jpg')" } as React.CSSProperties}>
                    <header className="mzaCard-head mzaPar-1">
                      <h2 className="mzaCard-title">Ultra Display Pro</h2>
                      <p className="mzaCard-kicker">Immersive Experience</p>
                    </header>
                    <p className="mzaCard-text mzaPar-2">Écran OLED bord-à-bord haute définition offrant une fidélité de couleurs et une fluidité exceptionnelles.</p>
                    <footer className="mzaCard-actions mzaPar-3">
                      <button className="mzaBtn">Explorer le Produit</button>
                    </footer>
                  </div>
                </article>

                <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="4 of 10">
                  <div className="mzaCard" style={{ "--mzaCard-bg": "url('/PHONES/pexels-imadclicks-30466740.jpg')" } as React.CSSProperties}>
                    <header className="mzaCard-head mzaPar-1">
                      <h2 className="mzaCard-title">Pro Optics Matrix</h2>
                      <p className="mzaCard-kicker">Capture Every Detail</p>
                    </header>
                    <p className="mzaCard-text mzaPar-2">Capteur photo haute résolution avec zoom optique avancé et mode nuit ultra-performant.</p>
                    <footer className="mzaCard-actions mzaPar-3">
                      <button className="mzaBtn">Tester la Caméra</button>
                    </footer>
                  </div>
                </article>

                <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="5 of 10">
                  <div className="mzaCard" style={{ "--mzaCard-bg": "url('/PHONES/pexels-imadclicks-30466756.jpg')" } as React.CSSProperties}>
                    <header className="mzaCard-head mzaPar-1">
                      <h2 className="mzaCard-title">Sleek Midnight</h2>
                      <p className="mzaCard-kicker">Ergonomic Luxury</p>
                    </header>
                    <p className="mzaCard-text mzaPar-2">Finitions soignées en verre poli et aluminium recyclé pour une prise en main d'une grande élégance.</p>
                    <footer className="mzaCard-actions mzaPar-3">
                      <button className="mzaBtn">Commander Maintenant</button>
                    </footer>
                  </div>
                </article>

                <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="6 of 10">
                  <div className="mzaCard" style={{ "--mzaCard-bg": "url('/PHONES/pexels-regeci-38017143.jpg')" } as React.CSSProperties}>
                    <header className="mzaCard-head mzaPar-1">
                      <h2 className="mzaCard-title">Studio Series</h2>
                      <p className="mzaCard-kicker">Master Crafter</p>
                    </header>
                    <p className="mzaCard-text mzaPar-2">L'alliance parfaite entre esthétique studio raffinée et puissance de traitement de dernière génération.</p>
                    <footer className="mzaCard-actions mzaPar-3">
                      <button className="mzaBtn">Voir la Collection</button>
                    </footer>
                  </div>
                </article>

                <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="7 of 10">
                  <div className="mzaCard" style={{ "--mzaCard-bg": "url('/PHONES/pexels-rubaitulazad-16149966.jpg')" } as React.CSSProperties}>
                    <header className="mzaCard-head mzaPar-1">
                      <h2 className="mzaCard-title">Minimalist Tech</h2>
                      <p className="mzaCard-kicker">Pure Elegance</p>
                    </header>
                    <p className="mzaCard-text mzaPar-2">Lignes épurées, simplicité d'utilisation et autonomie longue durée pour accompagner vos journées.</p>
                    <footer className="mzaCard-actions mzaPar-3">
                      <button className="mzaBtn">En Savoir Plus</button>
                    </footer>
                  </div>
                </article>

                <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="8 of 10">
                  <div className="mzaCard" style={{ "--mzaCard-bg": "url('/PHONES/pexels-rubaitulazad-16149968.jpg')" } as React.CSSProperties}>
                    <header className="mzaCard-head mzaPar-1">
                      <h2 className="mzaCard-title">Bionic Power</h2>
                      <p className="mzaCard-kicker">Peak Performance</p>
                    </header>
                    <p className="mzaCard-text mzaPar-2">Puce haute vitesse réactive garantissant une fluidité irréprochable dans les jeux et le multitasking.</p>
                    <footer className="mzaCard-actions mzaPar-3">
                      <button className="mzaBtn">Découvrir la Puce</button>
                    </footer>
                  </div>
                </article>

                <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="9 of 10">
                  <div className="mzaCard" style={{ "--mzaCard-bg": "url('/PHONES/pexels-sorjigrey-9956771.jpg')" } as React.CSSProperties}>
                    <header className="mzaCard-head mzaPar-1">
                      <h2 className="mzaCard-title">Nordic Concept</h2>
                      <p className="mzaCard-kicker">Scandinavian Spirit</p>
                    </header>
                    <p className="mzaCard-text mzaPar-2">Inspiré par le design scandinave moderne pour offrir un smartphone aussi beau que fonctionnel.</p>
                    <footer className="mzaCard-actions mzaPar-3">
                      <button className="mzaBtn">Découvrir le Style</button>
                    </footer>
                  </div>
                </article>

                <article className="mzaCarousel-slide" role="group" aria-roledescription="slide" aria-label="10 of 10">
                  <div className="mzaCard" style={{ "--mzaCard-bg": "url('/PHONES/pexels-zeleboba-33797246.jpg')" } as React.CSSProperties}>
                    <header className="mzaCard-head mzaPar-1">
                      <h2 className="mzaCard-title">Flagship Premier</h2>
                      <p className="mzaCard-kicker">Unmatched Excellence</p>
                    </header>
                    <p className="mzaCard-text mzaPar-2">Le produit phare incontournable réunissant le meilleur de l'innovation mobile Kicks&amp;Co.</p>
                    <footer className="mzaCard-actions mzaPar-3">
                      <button className="mzaBtn">Rejoindre le Club</button>
                    </footer>
                  </div>
                </article>
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
        </section>

        {/* Events & Masterclasses Section (GSAP Pinned Horizontal Scroll) */}
        <section className="events-pinned-section">
          <div className="events-pinned-container">
            {/* Left Info Panel (Fades out when cards glide over it) */}
            <div className="events-left-panel">
              <span className="testimonials-pill-badge">Événements &amp; Culture</span>
              <h2 className="events-left-title">
                Workshops &amp; <br />
                <span className="home-hero-title-light">Events.</span>
              </h2>
              <p className="events-left-subtitle">
                Rejoignez nos ateliers exclusifs, retraites créatives, tournois streetwear et masterclasses d'exception conçus par Kicks&amp;Co.
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
      </main>

      {/* Product Detail Modal Popup with Entrance and Exit Fade Animations */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="product-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeProductModal}
          >
            <motion.div
              className="product-modal-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="product-modal-close"
                onClick={closeProductModal}
                aria-label="Fermer"
              >
                ✕
              </button>

              <div className="product-modal-body">
                {/* Left Column: Image preview */}
                <div className={`product-modal-image-col ${selectedProduct.color}`}>
                  {selectedProduct.badge && (
                    <span className="product-modal-badge">{selectedProduct.badge}</span>
                  )}
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="product-modal-img"
                  />
                </div>

                {/* Right Column: Detailed Product Specs */}
                <div className="product-modal-details-col">
                  <div className="product-modal-header">
                    <span className="product-modal-category">{selectedProduct.category}</span>
                    <span className="product-modal-model-badge">Réf: {selectedProduct.model}</span>
                  </div>

                  <h2 className="product-modal-title">{selectedProduct.name}</h2>

                  <div className="product-modal-price-row">
                    <span className="product-modal-price">{selectedProduct.price}</span>
                    <div className="product-modal-rating">
                      <span className="star">★</span>
                      <span className="rating-score">{selectedProduct.rating}</span>
                      <span className="rating-count">({selectedProduct.reviewsCount} avis)</span>
                    </div>
                  </div>

                  <p className="product-modal-description">{selectedProduct.longDescription}</p>

                  {/* Choice of Colors */}
                  <div className="product-modal-option-group">
                    <label className="product-modal-option-label">
                      Couleur sélectionnée: <strong>{selectedProduct.colors[selectedColorIndex]?.name}</strong>
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

                  {/* Choice of Sizes / Models */}
                  <div className="product-modal-option-group">
                    <label className="product-modal-option-label">
                      Taille / Variante: <strong>{selectedSize}</strong>
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

                  {/* Actions */}
                  <div className="product-modal-actions">
                    <button
                      className="product-modal-add-cart-btn"
                      onClick={() => {
                        alert(`Ajouté au panier: ${selectedProduct.name} (${selectedProduct.colors[selectedColorIndex]?.name}, ${selectedSize})`)
                        closeProductModal()
                      }}
                    >
                      Ajouter au panier • {selectedProduct.price}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  
                  if (topOffset < modalHeight * 0.88 && topOffset > -rect.height * 0.5) {
                    gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" })
                  } else if (topOffset >= modalHeight * 0.88) {
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
                  <img src={selectedEvent.speaker.avatar} alt={selectedEvent.speaker.name} className="speaker-avatar" />
                  <div>
                    <span className="speaker-kicker">Intervenant Principal</span>
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
                    className={`event-modal-cta-btn ${
                      registeredEvents.includes(selectedEvent.id) ? "registered" : ""
                    }`}
                    onClick={() => toggleEventRegistration(selectedEvent.id)}
                  >
                    {registeredEvents.includes(selectedEvent.id) ? (
                      <>
                        <CheckCircle2 size={20} /> Place Réservée - Annuler l'inscription
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} /> S'inscrire Gratuitement à l'Événement
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
