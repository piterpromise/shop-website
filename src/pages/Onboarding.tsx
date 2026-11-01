import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Sparkles, ArrowRight, X, Pause, Play } from "lucide-react"
import "./Onboarding.css"

interface OnboardingSlide {
  id: number
  code: string
  src: string
  title: string
  category: string
  subtitle: string
  orientation: "landscape" | "portrait"
}

const ONBOARDING_IMAGES: OnboardingSlide[] = [
  {
    id: 0,
    code: "01",
    src: "/couture/wedding1.webp",
    title: "Robe de Mariée « Céleste »",
    category: "Haute Couture Nuptiale",
    subtitle: "Dentelle de Calais rebrodée main & traîne cathédrale vaporeuse",
    orientation: "landscape",
  },
  {
    id: 1,
    code: "02",
    src: "/couture/party-dress1.webp",
    title: "Silhouette Gala « Étoile d'Or »",
    category: "Soirée & Red Carpet",
    subtitle: "Coupe sur-mesure sculptée et tombé fluide haute couture",
    orientation: "portrait",
  },
  {
    id: 2,
    code: "03",
    src: "/couture/other-robes1.webp",
    title: "Création « Rubis Impérial »",
    category: "Cocktail & Réception",
    subtitle: "Crêpe de soie carmin drapé à la main sur mannequin d'atelier",
    orientation: "portrait",
  },
  {
    id: 3,
    code: "04",
    src: "/couture/wedding2.webp",
    title: "Duo Nuptial « Sérénité »",
    category: "Mariage Sur-Mesure",
    subtitle: "Bustier cœur architecturé et harmonie parfaite du jour J",
    orientation: "portrait",
  },
  {
    id: 4,
    code: "05",
    src: "/couture/party-dress2.webp",
    title: "Robe « Nuit de Lavande »",
    category: "Broderie & Perlage d'Art",
    subtitle: "Tulle illusion constellé de paillettes et d'arabesques cousues main",
    orientation: "portrait",
  },
]

interface CellBox {
  top: string
  left: string
  width: string
  height: string
  opacity: number
  scale: number
  zIndex: number
}

/**
 * Pour chacune des 5 images (0 à 4), définit la géométrie harmonieuse
 * de les 5 cartes afin que l'image active s'étire pour être vue EN ENTIER,
 * tandis que les cartes voisines se réajustent ou s'effacent avec fluidité.
 */
const BENTO_STATES: Record<number, CellBox[]> = {
  // TOUR 1 (Image 1 en haut à gauche s'étire en grand format panoramique plein cadre sans marges)
  0: [
    { top: "0%", left: "0%", width: "62%", height: "68%", opacity: 1, scale: 1, zIndex: 5 },
    { top: "68%", left: "0%", width: "36%", height: "32%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "0%", left: "62%", width: "38%", height: "34%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "34%", left: "62%", width: "38%", height: "34%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "68%", left: "36%", width: "64%", height: "32%", opacity: 1, scale: 1, zIndex: 3 },
  ],

  // TOUR 2 (Image 2 à gauche s'étire du haut jusqu'en bas sur 100% de la hauteur, plein cadre sans marges)
  1: [
    { top: "-6%", left: "0%", width: "39%", height: "0%", opacity: 0, scale: 0.96, zIndex: 1 },
    { top: "0%", left: "0%", width: "39%", height: "100%", opacity: 1, scale: 1, zIndex: 5 },
    { top: "0%", left: "39%", width: "61%", height: "33%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "33%", left: "39%", width: "61%", height: "33%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "66%", left: "39%", width: "61%", height: "34%", opacity: 1, scale: 1, zIndex: 3 },
  ],

  // TOUR 3 (Image 3 en haut à droite s'étire vers le bas sur 100% de la hauteur à droite, plein cadre sans marges)
  2: [
    { top: "0%", left: "0%", width: "61%", height: "34%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "34%", left: "0%", width: "61%", height: "33%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "0%", left: "61%", width: "39%", height: "100%", opacity: 1, scale: 1, zIndex: 5 },
    { top: "104%", left: "61%", width: "39%", height: "0%", opacity: 0, scale: 0.96, zIndex: 1 },
    { top: "67%", left: "0%", width: "61%", height: "33%", opacity: 1, scale: 1, zIndex: 3 },
  ],

  // TOUR 4 (Image 4 au milieu à droite s'étire vers le haut et le bas sur 100% de la hauteur à droite, plein cadre sans marges)
  3: [
    { top: "0%", left: "0%", width: "61%", height: "34%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "34%", left: "0%", width: "61%", height: "33%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "-6%", left: "61%", width: "39%", height: "0%", opacity: 0, scale: 0.96, zIndex: 1 },
    { top: "0%", left: "61%", width: "39%", height: "100%", opacity: 1, scale: 1, zIndex: 5 },
    { top: "67%", left: "0%", width: "61%", height: "33%", opacity: 1, scale: 1, zIndex: 3 },
  ],

  // TOUR 5 (Image 5 tout en bas s'agrandit du bas vers le haut sur 100% de la hauteur, plein cadre sans marges)
  4: [
    { top: "0%", left: "0%", width: "59%", height: "50%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "50%", left: "0%", width: "59%", height: "50%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "-6%", left: "59%", width: "41%", height: "0%", opacity: 0, scale: 0.96, zIndex: 1 },
    { top: "-4%", left: "59%", width: "41%", height: "0%", opacity: 0, scale: 0.96, zIndex: 1 },
    { top: "0%", left: "59%", width: "41%", height: "100%", opacity: 1, scale: 1, zIndex: 5 },
  ],
}

/**
 * Version mobile calibrée (écrans <= 768px) : conserve 100% de l'animation
 * d'étirement et d'extension harmonieuse tout en offrant à chaque robe
 * un espace généreux en format vertical sur téléphone.
 */
const MOBILE_BENTO_STATES: Record<number, CellBox[]> = {
  // TOUR 1 (Image 1 s'étire en grand sur les 62% supérieurs, les cartes voisines s'ajustent en bas)
  0: [
    { top: "0%", left: "0%", width: "100%", height: "62%", opacity: 1, scale: 1, zIndex: 5 },
    { top: "62%", left: "0%", width: "50%", height: "38%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "62%", left: "50%", width: "50%", height: "38%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "102%", left: "50%", width: "50%", height: "0%", opacity: 0, scale: 0.94, zIndex: 1 },
    { top: "102%", left: "0%", width: "50%", height: "0%", opacity: 0, scale: 0.94, zIndex: 1 },
  ],

  // TOUR 2 (Image 2 s'étire du haut vers le bas sur 66% de la hauteur, 3 & 5 s'alignent en bas)
  1: [
    { top: "-4%", left: "0%", width: "100%", height: "0%", opacity: 0, scale: 0.94, zIndex: 1 },
    { top: "0%", left: "0%", width: "100%", height: "66%", opacity: 1, scale: 1, zIndex: 5 },
    { top: "66%", left: "0%", width: "50%", height: "34%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "102%", left: "50%", width: "50%", height: "0%", opacity: 0, scale: 0.94, zIndex: 1 },
    { top: "66%", left: "50%", width: "50%", height: "34%", opacity: 1, scale: 1, zIndex: 3 },
  ],

  // TOUR 3 (Image 3 s'étire en grand format portrait en bas sur 66%, 1 & 2 s'ajustent en haut)
  2: [
    { top: "0%", left: "0%", width: "50%", height: "34%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "0%", left: "50%", width: "50%", height: "34%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "34%", left: "0%", width: "100%", height: "66%", opacity: 1, scale: 1, zIndex: 5 },
    { top: "102%", left: "50%", width: "50%", height: "0%", opacity: 0, scale: 0.94, zIndex: 1 },
    { top: "102%", left: "0%", width: "50%", height: "0%", opacity: 0, scale: 0.94, zIndex: 1 },
  ],

  // TOUR 4 (Image 4 s'étire en grand format en haut sur 66%, 3 & 5 s'ajustent en bas)
  3: [
    { top: "-4%", left: "0%", width: "50%", height: "0%", opacity: 0, scale: 0.94, zIndex: 1 },
    { top: "-4%", left: "50%", width: "50%", height: "0%", opacity: 0, scale: 0.94, zIndex: 1 },
    { top: "66%", left: "0%", width: "50%", height: "34%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "0%", left: "0%", width: "100%", height: "66%", opacity: 1, scale: 1, zIndex: 5 },
    { top: "66%", left: "50%", width: "50%", height: "34%", opacity: 1, scale: 1, zIndex: 3 },
  ],

  // TOUR 5 (Image 5 tout en bas s'étire du bas vers le haut sur 66% de la hauteur, 1 & 4 s'ajustent en haut)
  4: [
    { top: "0%", left: "0%", width: "50%", height: "34%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "-4%", left: "0%", width: "50%", height: "0%", opacity: 0, scale: 0.94, zIndex: 1 },
    { top: "-4%", left: "50%", width: "50%", height: "0%", opacity: 0, scale: 0.94, zIndex: 1 },
    { top: "0%", left: "50%", width: "50%", height: "34%", opacity: 1, scale: 1, zIndex: 3 },
    { top: "34%", left: "0%", width: "100%", height: "66%", opacity: 1, scale: 1, zIndex: 5 },
  ],
}

const CYCLE_DURATION_MS = 10000 // 10 secondes par image comme demandé

export default function Onboarding() {
  const [entered, setEntered] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [isGreenBoxOpen, setIsGreenBoxOpen] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isMobileView, setIsMobileView] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  )
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Animation d'entrée initiale au chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setEntered(true)
    }, 180)
    return () => clearTimeout(timer)
  }, [])

  // Rotation automatique toutes les 10 secondes entre les 5 images
  useEffect(() => {
    if (!entered || isPaused) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ONBOARDING_IMAGES.length)
    }, CYCLE_DURATION_MS)

    return () => clearInterval(interval)
  }, [entered, isPaused, activeIndex])

  const stateMap = isMobileView ? MOBILE_BENTO_STATES : BENTO_STATES
  const currentLayout = stateMap[activeIndex] || stateMap[0]
  const activeSlide = ONBOARDING_IMAGES[activeIndex] || ONBOARDING_IMAGES[0]

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        {/* Scène Bento Dynamique à Étirement & Extension Harmonieuse */}
        <div className="onboarding-bento-stage">
          {ONBOARDING_IMAGES.map((item, idx) => {
            const box = currentLayout[idx]
            const isExpanded = idx === activeIndex
            const isHidden = box.opacity === 0

            return (
              <motion.div
                key={item.id}
                className={`bento-cell-wrapper ${isExpanded ? "is-expanded" : "is-neighbor"} ${
                  isHidden ? "is-hidden" : ""
                }`}
                initial={{
                  top: box.top,
                  left: box.left,
                  width: box.width,
                  height: box.height,
                  opacity: 0,
                  scale: 0.92,
                }}
                animate={{
                  top: box.top,
                  left: box.left,
                  width: box.width,
                  height: box.height,
                  opacity: entered ? box.opacity : 0,
                  scale: entered ? box.scale : 0.92,
                  zIndex: box.zIndex,
                }}
                transition={{
                  duration: 1.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => {
                  if (!isExpanded && !isHidden) {
                    setActiveIndex(idx)
                  }
                }}
              >
                <div className="bento-card-inner">
                  {/* Image principale : width 100% & height 100% plein cadre sans aucune marge */}
                  <motion.img
                    src={item.src}
                    alt={item.title}
                    className={`bento-img-main ${
                      item.orientation === "landscape" ? "is-landscape" : "is-portrait"
                    }`}
                    animate={{
                      scale: isExpanded ? 1 : 1.03,
                    }}
                    transition={{
                      duration: 1.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />

                  {/* Voile de contraste subtil */}
                  <div className="bento-card-vignette" />

                  {/* Légende éditoriale + Barre de progression 10s sur l'image actuellement étirée en entier */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="bento-expanded-caption"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="bento-caption-text">
                          <span className="bento-caption-cat">{item.category}</span>
                          <h2 className="bento-caption-title">{item.title}</h2>
                          <p className="bento-caption-sub">{item.subtitle}</p>
                        </div>

                        {/* Barre de progression fluide de 10 secondes */}
                        <div className="bento-timer-track">
                          <motion.div
                            key={`timer-${activeIndex}-${isPaused ? "paused" : "run"}`}
                            className="bento-timer-fill"
                            initial={{ width: "0%" }}
                            animate={{ width: isPaused ? "45%" : "100%" }}
                            transition={{
                              duration: isPaused ? 0.3 : CYCLE_DURATION_MS / 1000,
                              ease: "linear",
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* BARRE DE CONTRÔLE FLOTTANTE & MINI-BOUTON DU BOX VERT (Toujours accessible sans jamais attendre) */}
        <div className="onboarding-floating-dock">
          {/* Mini-bouton Vert Intelligent pour ouvrir/fermer le Box Vert à tout instant */}
          <div className="green-launcher-group">
            <motion.button
              type="button"
              className={`green-mini-trigger-btn ${isGreenBoxOpen ? "active" : ""}`}
              onClick={() => setIsGreenBoxOpen((prev) => !prev)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="mini-trigger-pulse" />
              <span className="mini-trigger-icon">
                <Sparkles size={15} />
              </span>
              <span className="mini-trigger-label">
                {isGreenBoxOpen ? "Réduire la carte" : "L'Art du Sur-Mesure"}
              </span>
              <span className="mini-trigger-badge">Menu</span>
            </motion.button>

            {/* Bouton d'accès direct rapide (au cas où l'utilisateur veut entrer en 1 clic) */}
            <motion.button
              type="button"
              className="green-quick-start-btn"
              onClick={() => navigate("/home")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              title="Accéder directement au site"
            >
              <span>Get Started</span>
              <ArrowRight size={15} />
            </motion.button>
          </div>

          {/* Sélecteur des 5 images (permet aussi de voir où en est le cycle de 10s ou de choisir une image) */}
          <div className="onboarding-step-pills" role="tablist" aria-label="Modèles en vedette">
            {ONBOARDING_IMAGES.map((slide, idx) => {
              const isCurrent = idx === activeIndex
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  className={`onboarding-step-pill ${isCurrent ? "active" : ""}`}
                  onClick={() => setActiveIndex(idx)}
                  title={`Voir ${slide.title} en entier`}
                >
                  <span>{slide.code}</span>
                </button>
              )
            })}
            <button
              type="button"
              className="onboarding-pause-btn"
              onClick={() => setIsPaused((prev) => !prev)}
              title={isPaused ? "Reprendre le défilement (10s)" : "Mettre en pause sur cette image"}
              aria-label={isPaused ? "Reprendre" : "Pause"}
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
            </button>
          </div>
        </div>

        {/* POPOVER DU BOX VERT COMPLET (S'affiche instantanément au clic sur le mini-bouton) */}
        <AnimatePresence>
          {isGreenBoxOpen && (
            <>
              <motion.div
                className="green-card-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsGreenBoxOpen(false)}
              />

              <motion.div
                className="green-card-floating-popover"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.92 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="green-card">
                  <button
                    type="button"
                    className="green-card-close-btn"
                    onClick={() => setIsGreenBoxOpen(false)}
                    aria-label="Fermer la carte"
                  >
                    <X size={18} />
                  </button>

                  <div className="green-card-kicker">
                    <Sparkles size={14} />
                    <span>MAISON DE HAUTE COUTURE</span>
                  </div>

                  <h1>L'Art de la Robe Sur-Mesure</h1>

                  <p>
                    Découvrez nos créations de mariée, de gala et de cérémonie façonnées à la main selon vos mesures.
                  </p>

                  <div className="green-card-active-preview">
                    <span className="preview-dot" />
                    <span>
                      Modèle affiché : <strong>{activeSlide.title}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    className="green-card-cta-btn"
                    onClick={() => navigate("/home")}
                  >
                    <span>Get Started · Découvrir l'Atelier</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
