import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

// Composant Input avec l'effet CSS demandé
const AnimatedInput = ({
  label,
  type = "text",
  value,
  onChange,
  isPassword = false,
}: any) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)

  const hasContent = value.length > 0
  const inputType = isPassword ? (showPassword ? "text" : "password") : type

  const togglePassword = () => {
    setIsRevealing(true)
    setShowPassword(!showPassword)
    setTimeout(() => setIsRevealing(false), 500) // Durée de l'effet de reveal
  }

  return (
    <div className="input-effect">
      <input
        className={`effect-20 ${
          hasContent ? "has-content" : ""
        } ${isPassword && !showPassword ? "font-mono-spaced" : ""} ${
          isRevealing && isPassword && showPassword
            ? "text-transparent"
            : "text-black"
        }`}
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder=""
      />
      <label>{label}</label>
      <span className="focus-border">
        <i></i>
      </span>

      {isPassword && (
        <button
          type="button"
          onClick={togglePassword}
          className="auth-password-toggle"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}

      {/* Effet Splitting simulé via Framer Motion pour le Reveal Fluide */}
      {isPassword && isRevealing && showPassword && (
        <div className="auth-reveal-text">
          {value.split("").map((char: string, i: number) => (
            <motion.span
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: i * 0.03,
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
              className="auth-reveal-char"
            >
              {char}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const navigate = useNavigate()

  return (
    <div className="auth-page">
      {/* Background Photo Global pour tout l'ecran au lieu des gradients */}
      <div className="auth-bg">
        <img
          src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&auto=format&fit=crop&q=80"
          alt="Sports visual"
          className="auth-bg-img"
        />
        {/* Overlay pour garder le formulaire lisible */}
        <div className="auth-bg-overlay"></div>
      </div>

      {/* Colonne de gauche (Formulaire) */}
      <div className="auth-left-col">
        <motion.button
          onClick={() => navigate("/home")}
          className="auth-back-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={24} />
        </motion.button>

        <motion.div
          layout
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="auth-form-card"
        >
          <div className="auth-title">
            <h1>
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p>
              {isLogin
                ? "Enter your details to access your account."
                : "Join us and discover the best sports gear."}
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="auth-form"
          >
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatedInput
                    label="Full Name"
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatedInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />

            <AnimatedInput
              label="Password"
              isPassword={true}
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />

            {isLogin && (
              <div className="auth-forgot">
                <a href="#">
                  Forgot Password?
                </a>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="auth-submit-btn"
              onClick={() => navigate("/home")}
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </motion.button>
          </form>

          <div className="auth-switch">
            <span>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Colonne de droite (Texte / Visual) */}
      <div className="auth-right-col">
        <div className="auth-right-content">
          <div className="auth-icon-box">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 16V12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8H12.01"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="auth-right-title">
            Unleash Your <br />{" "}
            <span>Potential.</span>
          </h2>
          <p className="auth-right-desc">
            Join thousands of athletes who trust us to provide the best gear for
            their journey.
          </p>
        </div>
      </div>
    </div>
  )
}
