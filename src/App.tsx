import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./App.css"

export default function App() {
  const [phase, setPhase] = useState(0)

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
    <div className="app-page">
      {/* Mobile container constraint for realism */}
      <div className="app-container">
        {/* Container des images */}
        <motion.div
          layout
          className="images-container"
          initial={{ paddingBottom: "1rem" }}
          animate={{
            paddingBottom: phase === 2 ? "1rem" : "1rem", // Adjust if needed
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
                src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=1200&fit=crop"
                alt="iPhone"
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
                src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=800&fit=crop"
                alt="AirPods"
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
                src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop"
                alt="Watch"
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
                src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=1200&fit=crop"
                alt="Samsung"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Phase 2 : Carte Verte en bas */}
        <AnimatePresence>
          {phase === 2 && (
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
                <button>
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
