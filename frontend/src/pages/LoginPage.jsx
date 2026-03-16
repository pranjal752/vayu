import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Eye, EyeOff, Wind, ArrowRight, Lock, User, Mail,
  RefreshCw, CheckCircle, AlertCircle, ChevronLeft,
  UserPlus, ShieldCheck, Check,
} from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   LIVE CANVAS BACKGROUND — interactive particle network
───────────────────────────────────────────────────────────── */
function LiveBackground() {
  const canvasRef = useRef(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })
  const animRef   = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, particles

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()

    const mkParticle = () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r:  Math.random() * 2.2 + 0.8,
      baseAlpha: Math.random() * 0.38 + 0.14,
      alpha: 0,
      color: Math.random() > 0.55 ? '45,212,191' : '56,189,248',
      pulse: Math.random() * Math.PI * 2,
    })
    particles = Array.from({ length: 90 }, mkParticle)

    const rings = [
      { x: 0.15, y: 0.25, r: 180, speed: 0.0007, phase: 0   },
      { x: 0.80, y: 0.70, r: 220, speed: 0.0005, phase: 1.5 },
      { x: 0.55, y: 0.10, r: 130, speed: 0.001,  phase: 3   },
    ]

    let t = 0
    const CONNECT = 140

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t++

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      /* pulsing AQI monitor rings */
      rings.forEach(rg => {
        const cx  = rg.x * W
        const cy  = rg.y * H
        const glow = 0.5 + 0.5 * Math.sin(t * rg.speed * 60 + rg.phase)
        for (let k = 0; k < 3; k++) {
          const radius = rg.r * (0.7 + k * 0.25) + glow * 12
          ctx.beginPath()
          ctx.arc(cx, cy, radius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(45,212,191,${0.06 + 0.05 * glow})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      })

      /* mouse glow orb */
      if (mx > 0) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 190)
        g.addColorStop(0,   'rgba(45,212,191,0.11)')
        g.addColorStop(0.5, 'rgba(45,212,191,0.04)')
        g.addColorStop(1,   'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      }

      /* particle connections */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < CONNECT) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(45,212,191,${0.17 * (1 - d / CONNECT)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      /* particles */
      particles.forEach(p => {
        p.pulse += 0.018
        p.alpha = p.baseAlpha * (0.75 + 0.25 * Math.sin(p.pulse))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`
        ctx.fill()

        if (p.r > 2) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5)
          g.addColorStop(0, `rgba(${p.color},${p.alpha * 0.4})`)
          g.addColorStop(1, 'transparent')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2)
          ctx.fill()
        }

        const ddx = mx - p.x
        const ddy = my - p.y
        const dd  = Math.sqrt(ddx * ddx + ddy * ddy)
        if (dd < 200) {
          p.vx += (ddx / dd) * 0.012
          p.vy += (ddy / dd) * 0.012
        }
        p.vx *= 0.985; p.vy *= 0.985
        p.x  += p.vx;  p.y  += p.vy
        if (p.x < -10)  p.x = W + 10
        if (p.x > W+10) p.x = -10
        if (p.y < -10)  p.y = H + 10
        if (p.y > H+10) p.y = -10
      })

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    const onMove   = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const onLeave  = ()  => { mouseRef.current = { x: -9999, y: -9999 } }
    const onResize = ()  => { resize() }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   MATH CAPTCHA helpers
───────────────────────────────────────────────────────────── */
function makeCaptcha() {
  const ops = ['+', '-', '×']
  const op  = ops[Math.floor(Math.random() * ops.length)]
  let a, b, answer
  if (op === '+') {
    a = Math.floor(Math.random() * 15) + 1; b = Math.floor(Math.random() * 15) + 1; answer = a + b
  } else if (op === '-') {
    a = Math.floor(Math.random() * 14) + 6; b = Math.floor(Math.random() * (a - 1)) + 1; answer = a - b
  } else {
    a = Math.floor(Math.random() * 9) + 1; b = Math.floor(Math.random() * 9) + 1; answer = a * b
  }
  return { question: `${a} ${op} ${b}`, answer }
}

function CaptchaBox({ value, onChange, onRefresh, captcha, submitted }) {
  const correct = submitted && value.trim() !== '' && parseInt(value, 10) === captcha.answer
  const wrong   = submitted && value.trim() !== '' && parseInt(value, 10) !== captcha.answer
  return (
    <div className="captcha-wrap">
      <div className="captcha-challenge">
        <span className="captcha-noise">{captcha.question} = ?</span>
        <button type="button" className="captcha-refresh" onClick={onRefresh} title="New challenge">
          <RefreshCw size={13} />
        </button>
      </div>
      <div className="captcha-input-wrap">
        <input
          type="number"
          className={`form-input captcha-input${wrong ? ' input-error' : correct ? ' input-ok' : ''}`}
          placeholder="?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
        {correct && <span className="field-check ok"><Check size={13} /></span>}
        {wrong   && <span className="field-check err"><AlertCircle size={13} /></span>}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   PASSWORD STRENGTH
───────────────────────────────────────────────────────────── */
function pwStrength(pw) {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8)           s++
  if (/[A-Z]/.test(pw))         s++
  if (/[0-9]/.test(pw))         s++
  if (/[^A-Za-z0-9]/.test(pw))  s++
  return s
}
const PW_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']
const PW_COLORS = ['', '#f87171', '#fb923c', '#facc15', '#34d399']

function PasswordStrength({ password }) {
  const s = pwStrength(password)
  if (!password) return null
  return (
    <div className="pw-strength">
      <div className="pw-bars">
        {[1,2,3,4].map(i => (
          <div key={i} className="pw-bar"
            style={{ background: i <= s ? PW_COLORS[s] : 'rgba(148,163,184,0.13)' }} />
        ))}
      </div>
      <span className="pw-label" style={{ color: PW_COLORS[s] }}>{PW_LABELS[s]}</span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   LIVE AQI GAUGE
───────────────────────────────────────────────────────────── */
function AQIGauge() {
  const [aqi, setAqi] = useState(62)
  const dirRef = useRef(1)

  useEffect(() => {
    const iv = setInterval(() => {
      setAqi(v => {
        const next = v + dirRef.current * (Math.random() * 0.6 + 0.2)
        if (next > 90) dirRef.current = -1
        if (next < 38) dirRef.current = 1
        return Math.round(next * 10) / 10
      })
    }, 150)
    return () => clearInterval(iv)
  }, [])

  const val   = Math.round(aqi)
  const R     = 52
  const circ  = 2 * Math.PI * R
  const offs  = circ * (1 - Math.min(aqi / 200, 1))
  const color = val <= 50 ? '#34d399' : val <= 100 ? '#facc15' : val <= 150 ? '#fb923c' : '#f87171'
  const label = val <= 50 ? 'Good' : val <= 100 ? 'Moderate' : val <= 150 ? 'Unhealthy' : 'Very Unhealthy'

  return (
    <div className="aqi-gauge-wrap">
      <span className="gauge-section-label">Live City AQI · Pune</span>
      <div style={{ display:'flex', alignItems:'center', gap:20 }}>
        <div className="aqi-svg-wrap">
          <svg width="124" height="124" viewBox="0 0 124 124">
            <circle cx="62" cy="62" r={R} fill="none" stroke="rgba(148,163,184,.07)" strokeWidth="9"/>
            <circle cx="62" cy="62" r={R} fill="none"
              stroke={color} strokeWidth="9" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offs}
              transform="rotate(-90 62 62)"
              style={{ transition:'stroke-dashoffset .3s ease,stroke .5s ease' }}/>
            <text x="62" y="58" textAnchor="middle" fontSize="26" fontWeight="800"
              fill={color} fontFamily="Sora,sans-serif"
              style={{ transition:'fill .5s ease' }}>{val}</text>
            <text x="62" y="74" textAnchor="middle" fontSize="9" fontWeight="700"
              fill="rgba(148,163,184,.4)" fontFamily="Manrope,sans-serif" letterSpacing="0.12em">AQI INDEX</text>
          </svg>
          <div className="aqi-pulse-ring" style={{ borderColor:color, boxShadow:`0 0 20px ${color}44` }}/>
        </div>
        <div className="aqi-meta">
          <span className="aqi-status-badge" style={{ color, borderColor:`${color}40`, background:`${color}10` }}>● {label}</span>
          <div className="aqi-live-row">
            <span className="aqi-live-dot"/>
            <span className="aqi-live-text">LIVE</span>
          </div>
          <div className="aqi-mini-bars">
            {[
              { l:'PM',  v: Math.min(aqi * 0.45, 100), c:'#fb923c' },
              { l:'NO₂', v: Math.min(aqi * 0.32, 100), c:'#facc15' },
              { l:'O₃',  v: Math.min(aqi * 0.55, 100), c:'#38bdf8' },
            ].map(b => (
              <div key={b.l} className="aqi-mini-bar-row">
                <span className="aqi-mini-bar-label">{b.l}</span>
                <div className="aqi-mini-bar-track">
                  <div className="aqi-mini-bar-fill" style={{ width:`${b.v}%`, background:b.c, boxShadow:`0 0 5px ${b.c}88`, transition:'width .3s ease' }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   POLLUTANT LIVE GRID
───────────────────────────────────────────────────────────── */
const POLLS = [
  { key:'PM2.5', base:38, range:18, color:'#fb923c', unit:'µg/m³' },
  { key:'PM10',  base:62, range:25, color:'#f87171', unit:'µg/m³' },
  { key:'NO₂',   base:28, range:14, color:'#facc15', unit:'ppb'   },
  { key:'SO₂',   base:12, range:8,  color:'#34d399', unit:'ppb'   },
  { key:'CO',    base:0.8,range:0.4,color:'#5eead4', unit:'ppm'   },
  { key:'O₃',    base:44, range:16, color:'#38bdf8', unit:'ppb'   },
]

function PollutantGrid() {
  const [vals, setVals] = useState(() => POLLS.map(p => p.base))

  useEffect(() => {
    const iv = setInterval(() => {
      setVals(prev => prev.map((v, i) => {
        const p = POLLS[i]
        const delta = (Math.random() - 0.5) * p.range * 0.18
        return Math.max(p.base - p.range, Math.min(p.base + p.range, v + delta))
      }))
    }, 900)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="poll-grid-wrap">
      <span className="gauge-section-label">Pollutant Levels · Real-time</span>
      <div className="poll-grid">
        {POLLS.map((p, i) => {
          const pct     = ((vals[i] - (p.base - p.range)) / (p.range * 2)) * 100
          const display = p.key === 'CO' ? vals[i].toFixed(1) : Math.round(vals[i])
          return (
            <div key={p.key} className="poll-cell">
              <div className="poll-top">
                <span className="poll-name">{p.key}</span>
                <span className="poll-val" style={{ color:p.color }}>{display}</span>
              </div>
              <div className="poll-track">
                <div className="poll-fill" style={{ width:`${Math.min(pct,100)}%`, background:p.color, boxShadow:`0 0 6px ${p.color}77`, transition:'width .9s ease' }}/>
              </div>
              <span className="poll-unit">{p.unit}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   WARD DOT MAP
───────────────────────────────────────────────────────────── */
const WARD_PAL = ['#34d399','#34d399','#34d399','#a3e635','#facc15','#facc15','#fb923c','#f87171']

function WardGrid() {
  const [dots] = useState(() =>
    Array.from({ length: 80 }, () => ({
      ci:    Math.floor(Math.random() * WARD_PAL.length),
      dur:   1.8 + Math.random() * 2.5,
      delay: Math.random() * 3,
    }))
  )

  return (
    <div className="ward-wrap">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
        <span className="gauge-section-label" style={{ margin:0 }}>247 Wards · Monitoring</span>
        <div className="ward-legend">
          {[['#34d399','Good'],['#facc15','Mod'],['#fb923c','USG'],['#f87171','Bad']].map(([c,l]) => (
            <span key={l} className="ward-leg-item">
              <span style={{ width:7,height:7,borderRadius:2,background:c,display:'inline-block',flexShrink:0 }}/>
              {l}
            </span>
          ))}
        </div>
      </div>
      <div className="ward-grid">
        {dots.map((d, i) => (
          <div key={i} className="ward-dot" style={{
            background: WARD_PAL[d.ci],
            boxShadow: `0 0 4px ${WARD_PAL[d.ci]}88`,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
          }}/>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   HERO PANEL
───────────────────────────────────────────────────────────── */
function HeroPanel() {
  return (
    <div className="login-hero">
      <div className="wind-streak" style={{ width: '38%', top: '28%', animationDuration: '6.5s', animationDelay: '0s'   }} />
      <div className="wind-streak" style={{ width: '28%', top: '44%', animationDuration: '9s',   animationDelay: '2s'   }} />
      <div className="wind-streak" style={{ width: '22%', top: '60%', animationDuration: '7.5s', animationDelay: '1.3s' }} />

      <div className="hero-badge"><Wind size={13} strokeWidth={2.5} />Air Quality Intelligence Platform</div>

      <h1 className="hero-wordmark">VAYU</h1>

      <span className="hero-devanagari">
        वायु &nbsp;·&nbsp; vā·yu
        <em style={{ fontStyle:'normal', color:'rgba(94,234,212,0.42)', fontSize:'0.7em', marginLeft:10 }}>
          Sanskrit: "The Breath of Life"
        </em>
      </span>

      <AQIGauge />
      <PollutantGrid />
      <WardGrid />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   LOGIN FORM
───────────────────────────────────────────────────────────── */
function LoginForm({ onForgot, onSignUp }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [remember, setRemember] = useState(false)
  const [captcha,  setCaptcha]  = useState(() => makeCaptcha())
  const [capVal,   setCapVal]   = useState('')
  const [submitted,setSubmitted]= useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const inputRef = useRef(null)
  useEffect(() => { inputRef.current?.focus() }, [])

  const refreshCaptcha = () => { setCaptcha(makeCaptcha()); setCapVal(''); setSubmitted(false) }

  const handleSubmit = (e) => {
    e.preventDefault(); setSubmitted(true); setError('')
    if (!username.trim())                       { setError('Username is required.');          return }
    if (!password)                              { setError('Password is required.');          return }
    if (parseInt(capVal,10) !== captcha.answer) { setError('CAPTCHA answer is incorrect.');  return }
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/dashboard', { replace: true }) }, 1200)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="inner-form">
      <div className="field-label">Username</div>
      <div className="input-wrap">
        <span className="input-icon"><User size={15} strokeWidth={2} /></span>
        <input ref={inputRef} type="text" className="form-input" placeholder="Enter your username"
          value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" spellCheck={false} />
      </div>

      <div className="field-label mb-top">Password</div>
      <div className="input-wrap">
        <span className="input-icon"><Lock size={15} strokeWidth={2} /></span>
        <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="Enter your password"
          value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
        <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}
          aria-label={showPw ? 'Hide' : 'Show'}>{showPw ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
      </div>

      <div className="row-between" style={{ marginTop:10, marginBottom:18 }}>
        <label className="check-label">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="check-input" />
          <span className="check-box">{remember && <Check size={10}/>}</span>
          Remember me
        </label>
        <button type="button" className="link-btn" onClick={onForgot}>Forgot password?</button>
      </div>

      <div className="field-label">Verification</div>
      <CaptchaBox value={capVal} onChange={setCapVal} onRefresh={refreshCaptcha}
        captcha={captcha} submitted={submitted} />

      {error && <div className="error-msg"><AlertCircle size={13} style={{flexShrink:0}}/>{error}</div>}

      <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop:20 }}>
        {loading ? <><span className="btn-spinner"/>Signing in…</> : <>Sign In <ArrowRight size={15} strokeWidth={2.5}/></>}
      </button>

      <div className="divider"><span>or</span></div>

      <button type="button" className="btn-secondary" onClick={onSignUp}>
        <UserPlus size={15} strokeWidth={2}/> Create a new account
      </button>
    </form>
  )
}

/* ─────────────────────────────────────────────────────────────
   FORGOT PASSWORD FORM
───────────────────────────────────────────────────────────── */
function ForgotForm({ onBack }) {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = (e) => {
    e.preventDefault(); setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1200)
  }

  if (sent) return (
    <div className="inner-form" style={{ textAlign:'center', paddingTop:8 }}>
      <div className="success-icon"><CheckCircle size={44} color="#34d399" strokeWidth={1.5}/></div>
      <p className="success-title">Check your inbox</p>
      <p className="success-sub">We've sent a reset link to<br/><strong style={{color:'#b2d8d2'}}>{email}</strong></p>
      <button type="button" className="btn-primary" style={{ marginTop:28 }} onClick={onBack}>
        <ChevronLeft size={15}/> Back to Sign In
      </button>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="inner-form">
      <p className="form-desc">Enter the email linked to your VAYU account and we'll send you a password reset link.</p>
      <div className="field-label">Email address</div>
      <div className="input-wrap">
        <span className="input-icon"><Mail size={15} strokeWidth={2}/></span>
        <input autoFocus type="email" className="form-input" placeholder="you@example.com"
          value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"/>
      </div>
      {error && <div className="error-msg" style={{marginTop:12}}><AlertCircle size={13} style={{flexShrink:0}}/>{error}</div>}
      <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop:22 }}>
        {loading ? <><span className="btn-spinner"/>Sending…</> : <>Send Reset Link <ArrowRight size={15} strokeWidth={2.5}/></>}
      </button>
      <button type="button" className="link-btn center-btn" onClick={onBack} style={{ marginTop:14 }}>
        <ChevronLeft size={13}/> Back to Sign In
      </button>
    </form>
  )
}

/* ─────────────────────────────────────────────────────────────
   SIGN UP FORM
───────────────────────────────────────────────────────────── */
function SignUpForm({ onBack }) {
  const [fullName,  setFullName]  = useState('')
  const [username,  setUsername]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw,    setShowPw]    = useState(false)
  const [showCPw,   setShowCPw]   = useState(false)
  const [agreed,    setAgreed]    = useState(false)
  const [captcha,   setCaptcha]   = useState(() => makeCaptcha())
  const [capVal,    setCapVal]    = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [done,      setDone]      = useState(false)

  const refreshCaptcha = () => { setCaptcha(makeCaptcha()); setCapVal(''); setSubmitted(false) }

  const handleSubmit = (e) => {
    e.preventDefault(); setSubmitted(true); setError('')
    if (!fullName.trim())                       { setError('Full name is required.');              return }
    if (username.trim().length < 3)             { setError('Username must be at least 3 chars.');  return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email.');            return }
    if (pwStrength(password) < 2)               { setError('Password is too weak.');               return }
    if (password !== confirmPw)                 { setError('Passwords do not match.');             return }
    if (!agreed)                                { setError('Please accept the Terms of Service.'); return }
    if (parseInt(capVal,10) !== captcha.answer) { setError('CAPTCHA answer incorrect.');           return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1300)
  }

  if (done) return (
    <div className="inner-form" style={{ textAlign:'center', paddingTop:8 }}>
      <div className="success-icon"><ShieldCheck size={44} color="#34d399" strokeWidth={1.5}/></div>
      <p className="success-title">Account created!</p>
      <p className="success-sub">Your VAYU account is ready.<br/>Sign in to start monitoring.</p>
      <button type="button" className="btn-primary" style={{ marginTop:28 }} onClick={onBack}>
        <ChevronLeft size={15}/> Sign In now
      </button>
    </div>
  )

  const pwMismatch = submitted && confirmPw && password !== confirmPw

  return (
    <form onSubmit={handleSubmit} noValidate className="inner-form">
      <div className="two-col">
        <div>
          <div className="field-label">Full Name</div>
          <div className="input-wrap">
            <span className="input-icon"><User size={15} strokeWidth={2}/></span>
            <input autoFocus type="text" className="form-input" placeholder="Jane Doe"
              value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name"/>
          </div>
        </div>
        <div>
          <div className="field-label">Username</div>
          <div className="input-wrap">
            <span className="input-icon" style={{ fontSize:13, color:'#456b63', fontWeight:700 }}>@</span>
            <input type="text" className="form-input" placeholder="username"
              value={username} onChange={e => setUsername(e.target.value.replace(/\s/g,''))} autoComplete="username"/>
          </div>
        </div>
      </div>

      <div className="field-label mb-top">Email</div>
      <div className="input-wrap">
        <span className="input-icon"><Mail size={15} strokeWidth={2}/></span>
        <input type="email" className="form-input" placeholder="you@example.com"
          value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"/>
      </div>

      <div className="field-label mb-top">Password</div>
      <div className="input-wrap">
        <span className="input-icon"><Lock size={15} strokeWidth={2}/></span>
        <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="Create a strong password"
          value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password"/>
        <button type="button" className="pw-toggle" onClick={() => setShowPw(v=>!v)} aria-label="Toggle">
          {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
        </button>
      </div>
      <PasswordStrength password={password}/>

      <div className="field-label mb-top">Confirm Password</div>
      <div className="input-wrap">
        <span className="input-icon"><Lock size={15} strokeWidth={2}/></span>
        <input type={showCPw ? 'text' : 'password'}
          className={`form-input${pwMismatch ? ' input-error' : ''}`}
          placeholder="Re-enter password" value={confirmPw}
          onChange={e => setConfirmPw(e.target.value)} autoComplete="new-password"/>
        <button type="button" className="pw-toggle" onClick={() => setShowCPw(v=>!v)} aria-label="Toggle">
          {showCPw ? <EyeOff size={15}/> : <Eye size={15}/>}
        </button>
      </div>

      <div className="field-label mb-top">Verification</div>
      <CaptchaBox value={capVal} onChange={setCapVal} onRefresh={refreshCaptcha}
        captcha={captcha} submitted={submitted}/>

      <label className="check-label" style={{ marginTop:14 }}>
        <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} className="check-input"/>
        <span className="check-box">{agreed && <Check size={10}/>}</span>
        <span>I agree to the{' '}
          <button type="button" className="link-inline">Terms of Service</button> and{' '}
          <button type="button" className="link-inline">Privacy Policy</button>
        </span>
      </label>

      {error && <div className="error-msg" style={{marginTop:12}}><AlertCircle size={13} style={{flexShrink:0}}/>{error}</div>}

      <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop:18 }}>
        {loading ? <><span className="btn-spinner"/>Creating account…</> : <>Create Account <ArrowRight size={15} strokeWidth={2.5}/></>}
      </button>
    </form>
  )
}

/* ─────────────────────────────────────────────────────────────
   ROOT PAGE
───────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const [mode,    setMode]    = useState('login')
  const [animKey, setAnimKey] = useState(0)

  const switchMode = useCallback((m) => { setMode(m); setAnimKey(k => k + 1) }, [])

  const TITLE = {
    login:  { eyebrow:'Welcome back',      title:'Sign in to VAYU'   },
    signup: { eyebrow:'Join the mission',  title:'Create Your Account'},
    forgot: { eyebrow:'Password recovery', title:'Reset Password'    },
  }[mode]

  return (
    <>
      <style>{`
        /* keyframes */
        @keyframes heroReveal  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes panelIn     { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:none} }
        @keyframes formSlide   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes letterIn    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes windLine    { 0%{transform:translateX(-130%) scaleX(.6);opacity:0} 30%{opacity:.6} 70%{opacity:.6} 100%{transform:translateX(150%) scaleX(1.3);opacity:0} }
        @keyframes glowCard    { 0%,100%{box-shadow:0 0 22px 2px rgba(45,212,191,.12),0 20px 55px rgba(0,0,0,.5)} 50%{box-shadow:0 0 48px 7px rgba(45,212,191,.22),0 20px 55px rgba(0,0,0,.5)} }
        @keyframes spin        { to{transform:rotate(360deg)} }
        @keyframes checkPop    { 0%{transform:scale(.6);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }

        /* shell */
        .login-shell {
          position:relative; display:grid; width:100%; height:100%; overflow:hidden;
          grid-template-columns:minmax(320px,1.05fr) minmax(360px,470px) minmax(120px,.55fr);
          align-items:center;
          background:
            radial-gradient(1100px 620px at 12% -8%, rgba(45,212,191,.20), transparent 55%),
            radial-gradient(950px 520px at 88% 6%, rgba(56,189,248,.14), transparent 52%),
            linear-gradient(162deg, #040d0b 0%, #071410 40%, #091b16 100%);
        }
        .login-shell::before {
          content:''; position:absolute; left:50%; top:50%; width:min(62vw,840px); height:min(62vw,840px);
          transform:translate(-50%,-50%); pointer-events:none; z-index:0;
          background:radial-gradient(circle, rgba(45,212,191,.08) 0%, rgba(56,189,248,.04) 32%, transparent 68%);
        }

        /* hero */
        .login-hero {
          position:relative; grid-column:1; display:flex; flex-direction:column;
          justify-content:center; align-items:flex-start; padding:56px 52px; overflow:hidden; z-index:1;
          height:100%;
        }
        .login-hero::before {
          content:''; position:absolute; inset:0; pointer-events:none;
          background-image:linear-gradient(rgba(148,163,184,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.055) 1px,transparent 1px);
          background-size:44px 44px;
          mask-image:linear-gradient(to bottom right,rgba(0,0,0,.55),transparent 72%);
        }
        .login-hero::after {
          content:''; position:absolute; right:0; top:8%; bottom:8%; width:1px;
          background:linear-gradient(to bottom,transparent,rgba(45,212,191,.22) 35%,rgba(56,189,248,.18) 65%,transparent);
        }
        .wind-streak {
          position:absolute; left:0; height:1.5px; border-radius:2px; pointer-events:none;
          background:linear-gradient(90deg,transparent,rgba(45,212,191,.4) 50%,transparent);
          animation:windLine linear infinite;
        }
        .hero-badge {
          display:inline-flex; align-items:center; gap:7px; padding:5px 14px 5px 10px;
          border-radius:30px; border:1px solid rgba(45,212,191,.25); background:rgba(45,212,191,.07);
          font-size:11px; font-weight:700; letter-spacing:.09em; color:#5eead4;
          text-transform:uppercase; margin-bottom:32px;
          animation:heroReveal 600ms ease both; animation-delay:.05s;
        }
        .hero-wordmark {
          font-family:'Sora',sans-serif; font-size:clamp(60px,7.5vw,96px); font-weight:800;
          letter-spacing:-.045em; line-height:1; margin-bottom:8px;
          background:linear-gradient(130deg,#f0fdfa 15%,#5eead4 50%,#38bdf8 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:heroReveal 700ms ease both; animation-delay:.15s;
        }
        .hero-devanagari {
          display:block; font-size:clamp(16px,2.2vw,22px); font-weight:600; letter-spacing:.08em;
          color:rgba(94,234,212,.65); margin-bottom:22px;
          animation:heroReveal 700ms ease both; animation-delay:.28s;
        }
        /* ── shared section label ── */
        .gauge-section-label { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#2e5550; margin-bottom:10px; display:block; }

        /* ── AQI Gauge ── */
        @keyframes aqiPulse { 0%,100%{transform:scale(1);opacity:.45} 50%{transform:scale(1.07);opacity:.85} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes wardPulse { 0%,100%{opacity:.4;transform:scale(.78)} 50%{opacity:1;transform:scale(1)} }

        .aqi-gauge-wrap { margin-bottom:20px; animation:heroReveal 700ms ease both; animation-delay:.38s; }
        .aqi-svg-wrap   { position:relative; display:flex; align-items:center; justify-content:center; }
        .aqi-pulse-ring { position:absolute; inset:-8px; border-radius:50%; border:1.5px solid; animation:aqiPulse 2.2s ease-in-out infinite; pointer-events:none; }
        .aqi-meta       { display:flex; flex-direction:column; gap:8px; }
        .aqi-status-badge { font-size:12px; font-weight:700; padding:4px 11px; border-radius:20px; border:1px solid; letter-spacing:.02em; }
        .aqi-live-row   { display:flex; align-items:center; gap:6px; }
        .aqi-live-dot   { width:7px; height:7px; border-radius:50%; background:#f87171; animation:blink 1.1s step-end infinite; flex-shrink:0; }
        .aqi-live-text  { font-size:10.5px; font-weight:800; letter-spacing:.14em; color:#f87171; }
        .aqi-mini-bars  { display:flex; flex-direction:column; gap:5px; }
        .aqi-mini-bar-row { display:flex; align-items:center; gap:6px; }
        .aqi-mini-bar-label { font-size:10px; font-weight:700; color:#3a6460; width:26px; letter-spacing:.02em; }
        .aqi-mini-bar-track { flex:1; height:3px; background:rgba(148,163,184,.1); border-radius:2px; overflow:hidden; }
        .aqi-mini-bar-fill  { height:100%; border-radius:2px; }

        /* ── Pollutant Grid ── */
        .poll-grid-wrap { margin-bottom:18px; animation:heroReveal 700ms ease both; animation-delay:.55s; }
        .poll-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
        .poll-cell { background:rgba(255,255,255,.028); border:1px solid rgba(148,163,184,.09); border-radius:9px; padding:7px 9px; }
        .poll-top  { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:5px; }
        .poll-name { font-size:10px; font-weight:700; color:#3a6460; letter-spacing:.04em; }
        .poll-val  { font-family:'Sora',sans-serif; font-size:13px; font-weight:800; }
        .poll-track { height:3px; background:rgba(148,163,184,.1); border-radius:2px; margin-bottom:4px; overflow:hidden; }
        .poll-fill  { height:100%; border-radius:2px; }
        .poll-unit  { font-size:9px; color:#2a4e4a; font-weight:600; letter-spacing:.04em; }

        /* ── Ward Dot Map ── */
        .ward-wrap   { animation:heroReveal 700ms ease both; animation-delay:.70s; }
        .ward-legend { display:flex; align-items:center; gap:8px; }
        .ward-leg-item { display:flex; align-items:center; gap:3px; font-size:9.5px; font-weight:600; color:#365c58; letter-spacing:.03em; }
        .ward-grid { display:grid; grid-template-columns:repeat(16,1fr); gap:3px; }
        .ward-dot  { aspect-ratio:1/1; border-radius:2px; animation:wardPulse ease-in-out infinite; }

        /* form panel */
        .login-form-panel {
          grid-column:2; width:100%; max-width:470px; justify-self:center;
          display:flex; flex-direction:column;
          justify-content:center; align-items:center; padding:28px 28px;
          z-index:2; overflow-y:auto;
          animation:panelIn 720ms ease both; animation-delay:.2s;
        }
        .login-card {
          width:100%; max-width:440px;
          background:rgba(6,16,13,.82); border:1px solid rgba(148,163,184,.12);
          border-radius:22px; backdrop-filter:blur(22px);
          animation:glowCard 4s ease-in-out infinite; overflow:hidden;
        }
        .card-header { padding:26px 28px 0; }
        .card-eyebrow { font-size:10.5px; font-weight:700; letter-spacing:.13em; text-transform:uppercase; color:#5eead4; margin-bottom:5px; }
        .card-title { font-family:'Sora',sans-serif; font-size:21px; font-weight:700; color:#dbe7e2; letter-spacing:-.025em; }

        /* tabs */
        .card-tabs { display:flex; gap:4px; padding:16px 28px 0; }
        .tab-btn {
          flex:1; padding:9px; border-radius:10px;
          font-family:'Manrope',sans-serif; font-size:13px; font-weight:700; cursor:pointer;
          transition:all .2s;
        }
        .tab-btn.active { background:rgba(45,212,191,.14); border:1px solid rgba(45,212,191,.3); color:#5eead4; }
        .tab-btn:not(.active) { background:transparent; border:1px solid rgba(148,163,184,.1); color:#4a6762; }
        .tab-btn:not(.active):hover { border-color:rgba(45,212,191,.22); color:#7ea89f; }

        /* back row */
        .card-back-row { padding:14px 28px 0; }
        .back-btn {
          display:inline-flex; align-items:center; gap:5px; background:none; border:none;
          cursor:pointer; font-size:12px; font-weight:600; color:#5eead4; padding:0; opacity:.72; transition:opacity .15s;
        }
        .back-btn:hover { opacity:1; }

        /* body */
        .card-body { padding:18px 28px 24px; }
        .inner-form { display:flex; flex-direction:column; animation:formSlide 300ms ease both; }

        .field-label { font-size:11px; font-weight:700; letter-spacing:.07em; color:#4f7572; text-transform:uppercase; margin-bottom:6px; }
        .mb-top { margin-top:13px; }

        .input-wrap { position:relative; display:flex; align-items:center; }
        .input-icon { position:absolute; left:12px; color:#3a5c59; pointer-events:none; display:flex; align-items:center; }
        .form-input {
          width:100%; padding:10.5px 38px 10.5px 36px;
          background:rgba(255,255,255,.033); border:1px solid rgba(148,163,184,.13); border-radius:10px;
          color:#dbe7e2; font-size:13.5px; font-family:'Manrope',sans-serif; outline:none;
          transition:border-color .2s,box-shadow .2s,background .2s;
        }
        .form-input::placeholder { color:#3a5c59; }
        .form-input:focus { border-color:rgba(45,212,191,.42); background:rgba(45,212,191,.04); box-shadow:0 0 0 3px rgba(45,212,191,.09); }
        .form-input.input-error { border-color:rgba(248,113,113,.4); box-shadow:0 0 0 3px rgba(248,113,113,.08); }
        .form-input.input-ok   { border-color:rgba(52,211,153,.4); }
        .form-input[type=number]::-webkit-inner-spin-button,
        .form-input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
        .form-input[type=number] { -moz-appearance:textfield; }

        .pw-toggle { position:absolute; right:10px; background:none; border:none; color:#3a5c59; cursor:pointer; padding:4px; display:flex; align-items:center; border-radius:6px; transition:color .15s; }
        .pw-toggle:hover { color:#5eead4; }

        .row-between { display:flex; align-items:center; justify-content:space-between; }

        .check-label { display:flex; align-items:center; gap:8px; cursor:pointer; font-size:12.5px; color:#5c8079; user-select:none; }
        .check-input { display:none; }
        .check-box {
          width:16px; height:16px; border-radius:5px; flex-shrink:0;
          border:1px solid rgba(45,212,191,.28); background:rgba(45,212,191,.06);
          display:flex; align-items:center; justify-content:center; color:#5eead4;
          transition:background .15s,border-color .15s;
        }
        .check-label:hover .check-box { border-color:rgba(45,212,191,.5); }

        .link-btn { background:none; border:none; cursor:pointer; font-size:12.5px; font-weight:600; color:#5eead4; padding:0; opacity:.72; transition:opacity .15s; font-family:'Manrope',sans-serif; }
        .link-btn:hover { opacity:1; }
        .link-btn.center-btn { display:flex; align-items:center; gap:4px; margin:0 auto; }
        .link-inline { background:none; border:none; cursor:pointer; color:#5eead4; font-size:inherit; font-weight:600; font-family:'Manrope',sans-serif; padding:0; text-decoration:underline; text-underline-offset:2px; }

        /* captcha */
        .captcha-wrap { display:flex; gap:10px; align-items:stretch; }
        .captcha-challenge {
          display:flex; align-items:center; gap:6px; flex:1;
          background:rgba(255,255,255,.025); border:1px solid rgba(148,163,184,.12); border-radius:10px; padding:9px 13px; position:relative; overflow:hidden;
        }
        .captcha-challenge::before {
          content:''; position:absolute; inset:0; pointer-events:none;
          background:repeating-linear-gradient(45deg,transparent,transparent 5px,rgba(148,163,184,.022) 5px,rgba(148,163,184,.022) 10px);
        }
        .captcha-noise { font-family:'Sora',monospace; font-size:15px; font-weight:700; letter-spacing:.06em; color:#96bab5; user-select:none; position:relative; z-index:1; flex:1; text-align:center; }
        .captcha-refresh { background:none; border:none; cursor:pointer; color:#3f6460; padding:2px; display:flex; align-items:center; border-radius:5px; position:relative; z-index:1; transition:color .15s; }
        .captcha-refresh:hover { color:#5eead4; }
        .captcha-input-wrap { position:relative; flex:0 0 96px; display:flex; align-items:center; }
        .captcha-input { padding-left:10px !important; text-align:center; }
        .field-check { position:absolute; right:9px; display:flex; animation:checkPop 300ms ease both; }
        .field-check.ok  { color:#34d399; }
        .field-check.err { color:#f87171; }

        /* password strength */
        .pw-strength { display:flex; align-items:center; gap:8px; margin-top:7px; }
        .pw-bars     { display:flex; gap:4px; flex:1; }
        .pw-bar      { height:3px; flex:1; border-radius:2px; transition:background .3s; }
        .pw-label    { font-size:11px; font-weight:700; letter-spacing:.06em; min-width:40px; text-align:right; }

        /* two-col */
        .two-col { display:grid; grid-template-columns:1fr 1fr; gap:10px; }

        /* error */
        .error-msg { display:flex; align-items:center; gap:7px; font-size:12px; color:#f87171; padding:9px 12px; background:rgba(239,68,68,.07); border:1px solid rgba(239,68,68,.17); border-radius:9px; margin-top:14px; }

        .form-desc { font-size:13px; color:#557370; line-height:1.65; margin-bottom:18px; }

        .divider { display:flex; align-items:center; gap:12px; margin:15px 0; color:#2a4440; font-size:11.5px; font-weight:600; letter-spacing:.06em; }
        .divider::before, .divider::after { content:''; flex:1; height:1px; background:rgba(148,163,184,.09); }

        .btn-primary {
          width:100%; padding:12.5px; border-radius:11px; border:none; cursor:pointer;
          font-family:'Manrope',sans-serif; font-size:14px; font-weight:800; letter-spacing:.02em;
          color:#050e0c; background:linear-gradient(130deg,#2dd4bf 0%,#38bdf8 100%);
          display:flex; align-items:center; justify-content:center; gap:7px;
          box-shadow:0 4px 22px rgba(45,212,191,.3);
          transition:opacity .18s,transform .18s,box-shadow .18s;
        }
        .btn-primary:hover:not(:disabled) { opacity:.9; transform:translateY(-1px); box-shadow:0 7px 30px rgba(45,212,191,.42); }
        .btn-primary:disabled { opacity:.5; cursor:not-allowed; }

        .btn-secondary {
          width:100%; padding:12px; border-radius:11px;
          border:1px solid rgba(45,212,191,.19); cursor:pointer;
          font-family:'Manrope',sans-serif; font-size:13.5px; font-weight:700;
          color:#7ec8bf; background:rgba(45,212,191,.045);
          display:flex; align-items:center; justify-content:center; gap:7px;
          transition:background .18s,border-color .18s,color .18s;
        }
        .btn-secondary:hover { background:rgba(45,212,191,.1); border-color:rgba(45,212,191,.34); color:#5eead4; }

        .btn-spinner { width:15px; height:15px; border:2px solid rgba(5,14,12,.3); border-top-color:#050e0c; border-radius:50%; animation:spin .65s linear infinite; flex-shrink:0; }

        .success-icon  { display:flex; justify-content:center; margin-bottom:14px; animation:checkPop 500ms ease both; }
        .success-title { font-family:'Sora',sans-serif; font-size:20px; font-weight:700; color:#dbe7e2; margin-bottom:9px; }
        .success-sub   { font-size:13.5px; color:#628480; line-height:1.65; }

        @media(max-width:1100px) { .login-shell{grid-template-columns:minmax(280px,.92fr) minmax(340px,460px)} }
        @media(max-width:840px)  {
          .login-shell{display:flex; justify-content:center; align-items:center;}
          .login-hero{display:none}
          .login-form-panel{width:min(100%,520px); max-width:520px; padding:16px}
          .login-card{max-width:100%}
        }
        @media(max-width:480px)  { .two-col{grid-template-columns:1fr} .card-header,.card-tabs,.card-back-row,.card-body{padding-left:18px;padding-right:18px} }
      `}</style>

      <div className="login-shell">
        <LiveBackground />

        <HeroPanel />

        <div className="login-form-panel">
          <div className="login-card">
            <div className="card-header">
              <p className="card-eyebrow">{TITLE.eyebrow}</p>
              <h2 className="card-title">{TITLE.title}</h2>
            </div>

            {mode !== 'forgot' && (
              <div className="card-tabs">
                <button type="button" className={`tab-btn${mode==='login'?' active':''}`} onClick={() => switchMode('login')}>Sign In</button>
                <button type="button" className={`tab-btn${mode==='signup'?' active':''}`} onClick={() => switchMode('signup')}>Sign Up</button>
              </div>
            )}

            {mode === 'forgot' && (
              <div className="card-back-row">
                <button type="button" className="back-btn" onClick={() => switchMode('login')}>
                  <ChevronLeft size={14}/> Back to Sign In
                </button>
              </div>
            )}

            <div className="card-body" key={animKey}>
              {mode === 'login'  && <LoginForm  onForgot={() => switchMode('forgot')} onSignUp={() => switchMode('signup')} />}
              {mode === 'signup' && <SignUpForm  onBack={() => switchMode('login')} />}
              {mode === 'forgot' && <ForgotForm  onBack={() => switchMode('login')} />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
