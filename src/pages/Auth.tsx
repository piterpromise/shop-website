import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, ArrowLeft, Sun, Moon } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone,
} from "@fortawesome/free-solid-svg-icons"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

type ValidationState = "neutral" | "invalid" | "warning" | "valid"

interface AnimatedInputProps {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isPassword?: boolean
  icon: IconDefinition
  validationState: ValidationState
  validationHint?: string
}

// Composant Input basé sur field.html (effect-21) + FontAwesome + Validation couleur + Animation Password Eye
const AnimatedInput = ({
  label,
  type = "text",
  value,
  onChange,
  isPassword = false,
  icon,
  validationState,
  validationHint,
}: AnimatedInputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isAnimatingToggle, setIsAnimatingToggle] = useState(false)
  const [toggleCycle, setToggleCycle] = useState(0)

  const hasContent = value.length > 0
  const inputType = isPassword ? (showPassword ? "text" : "password") : type

  const togglePassword = () => {
    setIsAnimatingToggle(true)
    setShowPassword((prev) => !prev)
    setToggleCycle((c) => c + 1)
    setTimeout(() => {
      setIsAnimatingToggle(false)
    }, 520)
  }

  const displayChars = value
    .split("")
    .map((ch) => (showPassword ? ch : "•"))

  return (
    <div className={`col-3 input-effect state-${validationState}`}>
      {/* Icône FontAwesome devant le champ */}
      <span className="input-fa-icon" aria-hidden="true">
        <FontAwesomeIcon icon={icon} />
      </span>

      <input
        className={`effect-21 ${hasContent ? "has-content" : ""} ${
          isPassword && !showPassword ? "font-mono-spaced" : ""
        } ${isPassword && isAnimatingToggle && hasContent ? "text-transparent" : "text-black"}`}
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder=""
        autoComplete="off"
      />

      <label>{label}</label>

      <span className="focus-border">
        <i></i>
      </span>

      {validationHint && hasContent && (
        <span className={`input-validation-hint state-${validationState}`}>
          {validationHint}
        </span>
      )}

      {isPassword && (
        <button
          type="button"
          onClick={togglePassword}
          className={`auth-password-toggle ${showPassword ? "is-visible" : ""}`}
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={showPassword ? "eye-off" : "eye-on"}
              initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 25 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="auth-eye-icon-wrap"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </motion.span>
          </AnimatePresence>
        </button>
      )}

      {/* Animation caractère par caractère au clic sur le toggle eye (masqué <-> visible) */}
      {isPassword && isAnimatingToggle && hasContent && (
        <div key={toggleCycle} className="auth-reveal-text" aria-hidden="true">
          {displayChars.map((char: string, i: number) => (
            <motion.span
              key={`${toggleCycle}-${i}`}
              initial={{
                y: showPassword ? 14 : -14,
                opacity: 0,
                filter: "blur(4px)",
                scale: 0.85,
              }}
              animate={{
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
              }}
              transition={{
                delay: i * 0.026,
                type: "spring",
                stiffness: 260,
                damping: 18,
              }}
              className={`auth-reveal-char ${!showPassword ? "is-bullet" : ""}`}
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
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark"
    const saved = window.localStorage.getItem("atelier-theme")
    return saved === "light" ? "light" : "dark"
  })
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(true)
  const [rememberSession, setRememberSession] = useState(false)
  const [submitPhase, setSubmitPhase] = useState<"idle" | "loading" | "success">("idle")
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("atelier-theme", theme)
    }
  }, [theme])

  // Validation dynamique de la concordance des données saisies
  const getNameValidation = (): { state: ValidationState; hint: string } => {
    if (!name) return { state: "neutral", hint: "" }
    const trimmed = name.trim()
    if (trimmed.length < 3) {
      return { state: "invalid", hint: "Minimum 3 caractères" }
    }
    return { state: "valid", hint: "Nom valide" }
  }

  const getEmailValidation = (): { state: ValidationState; hint: string } => {
    if (!email) return { state: "neutral", hint: "" }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email.trim())) {
      return { state: "invalid", hint: "Format e-mail incomplet" }
    }
    return { state: "valid", hint: "Adresse vérifiée" }
  }

  const getPhoneValidation = (): { state: ValidationState; hint: string } => {
    if (!phone) return { state: "neutral", hint: "" }
    const digitsOnly = phone.replace(/\D/g, "")
    if (digitsOnly.length < 8) {
      return { state: "invalid", hint: "Numéro incomplet" }
    }
    if (digitsOnly.length > 15) {
      return { state: "warning", hint: "Vérifiez l'indicatif" }
    }
    return { state: "valid", hint: "Numéro valide" }
  }

  const getPasswordValidation = (): { state: ValidationState; hint: string } => {
    if (!password) return { state: "neutral", hint: "" }
    if (password.length < 6) {
      return { state: "invalid", hint: "Trop court (min. 6)" }
    }
    const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>_\-+=]/.test(password)
    if (password.length < 8 || !hasNumberOrSymbol) {
      return { state: "warning", hint: "Concordance moyenne" }
    }
    return { state: "valid", hint: "Sécurité optimale" }
  }

  const nameVal = getNameValidation()
  const emailVal = getEmailValidation()
  const phoneVal = getPhoneValidation()
  const passwordVal = getPasswordValidation()

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (submitPhase !== "idle") return

    setSubmitPhase("loading")
    setTimeout(() => {
      setSubmitPhase("success")
      setTimeout(() => {
        navigate("/home")
      }, 950)
    }, 1550)
  }

  return (
    <div className="auth-page" data-theme={theme}>
      {/* Background Photo Global pour tout l'ecran */}
      <div className="auth-bg">
        <img
          src="/couture/wedding3.webp"
          alt="Création Haute Couture Sur-Mesure"
          className="auth-bg-img"
        />
        <div className="auth-bg-overlay"></div>
      </div>

      {/* Colonne de gauche (Conteneur transparent ajusté à 40% de l'écran) */}
      <div className="auth-left-col">
        <motion.div
          layout
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`auth-form-card ${isLogin ? "is-login-mode" : "is-register-mode"}`}
        >
          {/* Barre supérieure interne : Flèche de retour + Switch Sign In/Sign Up + Toggle Thème */}
          <div className="auth-card-topbar">
            <motion.button
              type="button"
              onClick={() => navigate("/home")}
              className="auth-back-btn-inline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft size={19} />
            </motion.button>

            <div className="auth-topbar-right">
              <div className="auth-mode-pill-switch">
                <button
                  type="button"
                  className={`auth-mode-pill-tab ${isLogin ? "active" : ""}`}
                  onClick={() => {
                    setIsLogin(true)
                    setSubmitPhase("idle")
                  }}
                >
                  {isLogin && (
                    <motion.span
                      layoutId="authModePillBg"
                      className="auth-mode-pill-slider"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="auth-mode-pill-label">Sign In</span>
                </button>
                <button
                  type="button"
                  className={`auth-mode-pill-tab ${!isLogin ? "active" : ""}`}
                  onClick={() => {
                    setIsLogin(false)
                    setSubmitPhase("idle")
                  }}
                >
                  {!isLogin && (
                    <motion.span
                      layoutId="authModePillBg"
                      className="auth-mode-pill-slider"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="auth-mode-pill-label">Create Account</span>
                </button>
              </div>

              <motion.button
                type="button"
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                className="auth-theme-toggle-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                aria-label={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </motion.button>
            </div>
          </div>

          <div className="auth-title">
            <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p>
              {isLogin
                ? "Accédez à votre carnet de mesures et vos essayages."
                : "Rejoignez l'atelier et créez votre robe sur-mesure."}
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="auth-form">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  key="field-name"
                  initial={{ opacity: 0, height: 0, y: -14 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -14 }}
                  transition={{ duration: 0.25 }}
                >
                  <AnimatedInput
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={faUser}
                    validationState={nameVal.state}
                    validationHint={nameVal.hint}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatedInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={faEnvelope}
              validationState={emailVal.state}
              validationHint={emailVal.hint}
            />

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  key="field-phone"
                  initial={{ opacity: 0, height: 0, y: -14 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -14 }}
                  transition={{ duration: 0.25 }}
                >
                  <AnimatedInput
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={faPhone}
                    validationState={phoneVal.state}
                    validationHint={phoneVal.hint}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatedInput
              label="Password"
              isPassword={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={faLock}
              validationState={passwordVal.state}
              validationHint={passwordVal.hint}
            />

            {isLogin && (
              <div className="auth-login-enrichment">
                <div className="auth-forgot">
                  <a href="#forgot" onClick={(e) => e.preventDefault()}>
                    Forgot Password?
                  </a>
                </div>

                {/* Menu Toggle pour accepter les Conditions d'Utilisation & Session */}
                <div className="auth-toggles-menu">
                  <div
                    role="switch"
                    aria-checked={acceptedTerms}
                    tabIndex={0}
                    className={`auth-toggle-row ${acceptedTerms ? "is-on" : ""}`}
                    onClick={() => setAcceptedTerms((v) => !v)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setAcceptedTerms((v) => !v)
                      }
                    }}
                  >
                    <div className="auth-toggle-text">
                      <span className="auth-toggle-title">Accept Terms &amp; Privacy Policy</span>
                      <span className="auth-toggle-sub">
                        Agree to Maison Soie &amp; Couture member guidelines &amp; data protection
                      </span>
                    </div>
                    <span className={`auth-switch-track ${acceptedTerms ? "active" : ""}`}>
                      <span className="auth-switch-thumb" />
                    </span>
                  </div>

                  <div
                    role="switch"
                    aria-checked={rememberSession}
                    tabIndex={0}
                    className={`auth-toggle-row ${rememberSession ? "is-on" : ""}`}
                    onClick={() => setRememberSession((v) => !v)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setRememberSession((v) => !v)
                      }
                    }}
                  >
                    <div className="auth-toggle-text">
                      <span className="auth-toggle-title">Trusted Device · 30 Days</span>
                      <span className="auth-toggle-sub">
                        Skip two-factor verification on this browser
                      </span>
                    </div>
                    <span className={`auth-switch-track ${rememberSession ? "active" : ""}`}>
                      <span className="auth-switch-thumb" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bouton Submit Personnalisé avec Loading Épuré puis Validation par Check */}
            <motion.button
              type="submit"
              disabled={submitPhase !== "idle"}
              whileHover={submitPhase === "idle" ? { scale: 1.015 } : {}}
              whileTap={submitPhase === "idle" ? { scale: 0.985 } : {}}
              className={`auth-submit-btn is-${submitPhase}`}
            >
              {/* Barre de progression fine pendant le loading */}
              {submitPhase === "loading" && (
                <motion.span
                  className="auth-submit-progress-line"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              <AnimatePresence mode="wait" initial={false}>
                {submitPhase === "idle" && (
                  <motion.span
                    key="idle"
                    className="auth-submit-inner"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                  >
                    <span>{isLogin ? "Sign In" : "Sign Up"}</span>
                  </motion.span>
                )}

                {submitPhase === "loading" && (
                  <motion.span
                    key="loading"
                    className="auth-submit-inner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <svg className="auth-minimal-spinner" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeOpacity="0.22"
                        strokeWidth="1.75"
                      />
                      <path
                        d="M12 3a9 9 0 0 1 9 9"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="auth-submit-status-text">
                      {isLogin ? "Authenticating..." : "Creating account..."}
                    </span>
                  </motion.span>
                )}

                {submitPhase === "success" && (
                  <motion.span
                    key="success"
                    className="auth-submit-inner"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="auth-check-badge">
                      <svg className="auth-check-svg" viewBox="0 0 24 24" fill="none">
                        <motion.path
                          d="M5 12.5L9.5 17L19 7.5"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.38, ease: "easeOut" }}
                        />
                      </svg>
                    </span>
                    <span className="auth-submit-status-text">
                      {isLogin ? "Verified" : "Account Created"}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Séparateur & Connexion Sociale : Google, Apple, Facebook */}
          <div className="auth-social-section">
            <div className="auth-divider">
              <span>Or continue with</span>
            </div>

            <div className="auth-social-grid">
              <button
                type="button"
                className="auth-social-btn"
                onClick={handleFormSubmit}
                aria-label="Continue with Google"
              >
                <svg className="auth-social-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.5c-.24 1.26-.96 2.33-2.04 3.05l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.49 0-.72-.06-1.41-.19-2.07H12z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.29l-.74.57-2.64 2.05C3.56 20.23 7.46 22.5 12 22.5c2.97 0 5.46-.98 7.28-2.66l-3.3-2.56c-.98.66-2.23 1.06-3.98 1.06-3.06 0-5.66-2.06-6.59-4.84l-.14-.21z"
                  />
                  <path
                    fill="#4285F4"
                    d="M1.89 7.09C1.19 8.56.8 10.23.8 12c0 1.77.39 3.44 1.09 4.91l3.52-2.73c-.22-.66-.35-1.36-.35-2.18 0-.82.13-1.52.35-2.18L1.89 7.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 5.76c1.68 0 3.18.58 4.37 1.71l3.27-3.27C17.45 2.16 14.97 1 12 1 7.46 1 3.56 3.27 1.89 7.09l3.52 2.73C6.34 7.82 8.94 5.76 12 5.76z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="auth-social-btn"
                onClick={handleFormSubmit}
                aria-label="Continue with Apple"
              >
                <svg className="auth-social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span>Apple</span>
              </button>

              <button
                type="button"
                className="auth-social-btn"
                onClick={handleFormSubmit}
                aria-label="Continue with Facebook"
              >
                <svg className="auth-social-icon" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>

          <div className="auth-switch">
            <span>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setSubmitPhase("idle")
              }}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Colonne de droite (Texte / Visual — 60% de l'écran) */}
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
            Sublimez Votre <br />{" "}
            <span>Allure.</span>
          </h2>
          <p className="auth-right-desc">
            Chaque robe est une œuvre unique, dessinée et cousue sur-mesure pour illuminer vos moments les plus précieux.
          </p>
        </div>
      </div>
    </div>
  )
}

