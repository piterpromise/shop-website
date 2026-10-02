import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import "./Onboarding.css"

export default function Onboarding() {
  const [phase, setPhase] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    // Phase 1 : Entrée des images
    const timer1 = setTimeout(() => {
      setPhase(1)
    }, 500)

    // Phase 2 : Entrée de la carte et effet squeeze
    const timer2 = setTimeout(() => {
      setPhase(2)
    }, 1500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="onboarding-page">
      {/* Full screen container */}
      <div className="onboarding-container">
        {/* Container des images */}
        <motion.div
          layout
          className="images-container"
          initial={{ paddingBottom: "1rem" }}
          animate={{
            paddingBottom: phase === 2 ? "1rem" : "1rem",
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Colonne Gauche */}
          <div className="col-left">
            <motion.div
              className="img-card tall"
              initial={{ x: "-150%", opacity: 0 }}
              animate={{
                x: phase >= 1 ? 0 : "-150%",
                opacity: phase >= 1 ? 1 : 0,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src="/pictures/image1.webp"
                alt="Avatar"
              />
            </motion.div>
            <motion.div
              className="img-card short"
              initial={{ x: "-150%", opacity: 0 }}
              animate={{
                x: phase >= 1 ? 0 : "-150%",
                opacity: phase >= 1 ? 1 : 0,
              }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
            >
              <img
                src="/pictures/image6.webp"
                alt="Hoppers"
              />
            </motion.div>
          </div>

          {/* Colonne Droite */}
          <div className="col-right">
            <motion.div
              className="img-card short"
              initial={{ x: "150%", opacity: 0 }}
              animate={{
                x: phase >= 1 ? 0 : "150%",
                opacity: phase >= 1 ? 1 : 0,
              }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
            >
              <img
                src="/pictures/image3.webp"
                alt="GTA VI"
              />
            </motion.div>
            <motion.div
              className="img-card tall"
              initial={{ x: "150%", opacity: 0 }}
              animate={{
                x: phase >= 1 ? 0 : "150%",
                opacity: phase >= 1 ? 1 : 0,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src="/pictures/image4.webp"
                alt="Jujutsu Kaisen"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Phase 2 : Section du bas — Carte Verte + Image */}
        <AnimatePresence>
          {phase === 2 && (
            <div className="bottom-section">
              <motion.div
                layout
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="green-card-wrapper"
              >
                <div className="green-card">
                  <h1>
                    Find everything you need for sports
                  </h1>
                  <p>
                    Discover the best gear and accessories tailored perfectly to
                    your lifestyle.
                  </p>
                  <button
                    onClick={() => navigate("/home")}
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="bottom-image-wrapper"
                initial={{ x: "120%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "120%", opacity: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.15,
                }}
              >
                <img
                  src="/pictures/image2.webp"
                  alt="Digger"
                  className="bottom-image"
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
