import { useState, useRef, useEffect, useCallback } from 'react'
import { gameConfig, messages, type Question, mathQuestions, generalQuestions, saudeQuestions, bibleQuestions, logicaQuestions, portuguesQuestions } from '../data/siteContent'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog'
import { ArrowRight, BarChart3, Gamepad2, Zap, HelpCircle, Gift, BookOpen, Play, Brain, Heart, Bookmark, Lightbulb, FileText } from 'lucide-react'
import BalanceDashboard, { useSession } from '../components/BalanceDashboard'

type GameState = 'idle' | 'playing' | 'won' | 'lost' | 'bonus_won'
type Tab = 'game' | 'balance'
type QuestionPhase = 'hidden' | 'category' | 'answering' | 'result'
type QuestionCategory = 'math' | 'general' | 'saude' | 'biblia' | 'logica' | 'portugues'

function formatTime(ms: number): string {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const cs = Math.floor((ms % 1000) / 10)
  return `${m}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`
}

const STRENGTH_EMOJIS = ['💪', '🔥', '⚡']
const WIN_EMOJIS = ['🏆', '🔥', '💪', '🎉', '👑']

function HandGrip({ state }: { state: GameState }) {
  const isPlaying = state === 'playing'
  const isWon = state === 'won' || state === 'bonus_won'
  const isLost = state === 'lost'

  return (
    <div className="grip-wrapper">
      {isPlaying && <div className="squeeze-glow" />}
      {isPlaying && <div className="grip-ring" />}
      {state === 'bonus_won' && <div className="bonus-glow" />}

      <div className={`grip-3d ${isPlaying ? 'holding' : isWon ? '' : 'idle'}`}>
        <svg
          viewBox="0 0 160 240"
          className={`grip-svg w-full h-full ${isPlaying ? 'squeezed' : ''} ${isWon ? 'grip-won-glow' : ''}`}
        >
          <defs>
            <linearGradient id="gripGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8C84A" />
              <stop offset="50%" stopColor="#D4A017" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
            <linearGradient id="gripSilver" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#999" />
              <stop offset="50%" stopColor="#C0C0C0" />
              <stop offset="100%" stopColor="#999" />
            </linearGradient>
            <linearGradient id="gripRubber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a3a3a" />
              <stop offset="50%" stopColor="#222" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>
            <linearGradient id="gripWon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#30d158" />
              <stop offset="100%" stopColor="#1a9a3a" />
            </linearGradient>
            <linearGradient id="gripBonus" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b35" />
              <stop offset="100%" stopColor="#e05530" />
            </linearGradient>
            <filter id="gripGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#D4A017" floodOpacity="0.6" />
            </filter>
            <filter id="gripGlowWon">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#30d158" floodOpacity="0.6" />
            </filter>
            <filter id="gripGlowBonus">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#ff6b35" floodOpacity="0.7" />
            </filter>
          </defs>

          {/* UPPER HANDLE */}
          <g className="grip-upper" filter={isWon ? 'url(#gripGlowWon)' : isPlaying ? 'url(#gripGlow)' : undefined}>
            <rect x="32" y="8" width="96" height="32" rx="16" fill="url(#gripRubber)" stroke={isWon ? 'url(#gripWon)' : 'url(#gripSilver)'} strokeWidth="2" />
            <line x1="45" y1="16" x2="45" y2="32" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="55" y1="14" x2="55" y2="34" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="65" y1="16" x2="65" y2="32" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="75" y1="14" x2="75" y2="34" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="85" y1="16" x2="85" y2="32" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="95" y1="14" x2="95" y2="34" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="105" y1="16" x2="105" y2="32" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="115" y1="14" x2="115" y2="34" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 80 40 L 80 70" stroke="url(#gripGold)" strokeWidth="12" strokeLinecap="round" />
          </g>

          {/* SPRING COIL */}
          <g className="grip-spring">
            {isPlaying ? (
              <path d="M 80 70 L 71 78 L 89 86 L 71 94 L 89 102 L 71 110 L 80 118" stroke="#D4A017" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#gripGlow)" />
            ) : (
              <path d="M 80 70 L 70 76 L 90 84 L 70 92 L 90 100 L 70 108 L 90 116 L 80 122" stroke="#D4A017" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
            )}
          </g>

          {/* LOWER HANDLE */}
          <g filter={isWon ? 'url(#gripGlowWon)' : undefined}>
            <path d="M 80 122 L 80 195" stroke="url(#gripGold)" strokeWidth="12" strokeLinecap="round" />
            <rect x="32" y="195" width="96" height="32" rx="16" fill="url(#gripRubber)" stroke={isWon ? 'url(#gripWon)' : 'url(#gripSilver)'} strokeWidth="2" />
            <line x1="45" y1="203" x2="45" y2="219" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="55" y1="201" x2="55" y2="221" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="65" y1="203" x2="65" y2="219" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="75" y1="201" x2="75" y2="221" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="85" y1="203" x2="85" y2="219" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="95" y1="201" x2="95" y2="219" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="105" y1="203" x2="105" y2="219" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="115" y1="201" x2="115" y2="219" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {isWon && (
            <g>
              <rect x="10" y="10" width="140" height="220" rx="20" fill="rgba(48, 209, 88, 0.08)" />
              <text x="80" y="120" textAnchor="middle" fill="#30d158" fontSize="16" fontWeight="bold" filter="url(#gripGlowWon)">🏆 VITÓRIA 🏆</text>
              {state === 'bonus_won' && (
                <text x="80" y="144" textAnchor="middle" fill="#ff6b35" fontSize="12" fontWeight="bold" filter="url(#gripGlowBonus)">+ BÓNUS 🎁</text>
              )}
            </g>
          )}

          {isLost && (
            <g opacity="0.4">
              <rect x="10" y="10" width="140" height="220" rx="20" fill="rgba(180, 0, 0, 0.15)" />
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}

const PARTICLE_POSITIONS = [
  { left: 22, top: 40 }, { left: 65, top: 35 }, { left: 40, top: 55 },
  { left: 78, top: 50 }, { left: 30, top: 60 }, { left: 55, top: 42 },
  { left: 70, top: 58 }, { left: 48, top: 62 },
]

function EmojiParticles({ emojis, count = 4 }: { emojis: string[]; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const pos = PARTICLE_POSITIONS[i % PARTICLE_POSITIONS.length]
        return (
          <span
            key={i}
            className="emoji-particle"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${1.8 + (i * 0.17)}s`,
            }}
          >
            {emojis[i % emojis.length]}
          </span>
        )
      })}
    </>
  )
}

export default function Index() {
  const [gameState, setGameState] = useState<GameState>('idle')
  const [bet, setBet] = useState(gameConfig.defaultBet)
  const [elapsed, setElapsed] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [tab, setTab] = useState<Tab>('game')
  const [timeReduced, setTimeReduced] = useState(false)
  const [phase, setPhase] = useState<'normal' | 'bonus'>('normal')
  const [gripPressed, setGripPressed] = useState(false)
  const [lostInBonus, setLostInBonus] = useState(false)

  // Question states
  const [questionPhase, setQuestionPhase] = useState<QuestionPhase>('hidden')
  const [questionCategory, setQuestionCategory] = useState<QuestionCategory>('math')
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null)
  const [lastCorrectAnswerText, setLastCorrectAnswerText] = useState('')

  const { session, showCapitalPrompt, initSession, recordResult, resetSession } = useSession()

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef(0)
  const bonusStartRef = useRef(0)

  const BASE_MS = timeReduced ? 150000 : gameConfig.holdDuration * 1000
  const winAmount = bet * gameConfig.multiplier
  const bonusAmountExtra = gameConfig.bonusAmount
  const STRENGTH_MS = 30000
  const BONUS_TARGET_MS = (gameConfig.bonusDuration - gameConfig.holdDuration) * 1000
  const showBonus = bet >= gameConfig.bonusThreshold

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleWin = useCallback((withBonus: boolean = false) => {
    stopTimer()
    setGameState(withBonus ? 'bonus_won' : 'won')
    const payout = withBonus ? winAmount + bonusAmountExtra : winAmount
    recordResult(true, bet, payout)
    setGripPressed(false)
    setTimeout(() => setShowResult(true), 600)
  }, [stopTimer, recordResult, bet, winAmount, bonusAmountExtra])

  const handleLoss = useCallback(() => {
    setLostInBonus(phase === 'bonus')
    stopTimer()
    setGameState('lost')
    recordResult(false, bet, 0)
    setGripPressed(false)
    setPhase('normal')
    setTimeout(() => setShowResult(true), 400)
  }, [stopTimer, recordResult, bet, phase])

  const startGame = useCallback(() => {
    startTimeRef.current = Date.now()
    setElapsed(0)
    setPhase('normal')
    setGripPressed(true)
    setGameState('playing')
    setShowResult(false)
  }, [])

  // Start the game directly from idle (no question)
  const startDirect = useCallback(() => {
    // Reset any question state
    setQuestionPhase('hidden')
    setCurrentQuestion(null)
    setLastAnswerCorrect(null)
    startGame()
  }, [startGame])

  // Start the game after answering a question
  const startAfterQuestion = useCallback(() => {
    setQuestionPhase('hidden')
    setCurrentQuestion(null)
    setLastAnswerCorrect(null)
    startGame()
  }, [startGame])

  // Open question flow: choose category
  const openQuestionFlow = useCallback(() => {
    setQuestionPhase('category')
  }, [])

  // Choose category
  const chooseCategory = useCallback((cat: QuestionCategory) => {
    setQuestionCategory(cat)
    const pool =
      cat === 'math' ? mathQuestions :
      cat === 'general' ? generalQuestions :
      cat === 'saude' ? saudeQuestions :
      cat === 'biblia' ? bibleQuestions :
      cat === 'logica' ? logicaQuestions :
      portuguesQuestions
    const q = pool[Math.floor(Math.random() * pool.length)]
    setCurrentQuestion(q)
    setLastAnswerCorrect(null)
    setQuestionPhase('answering')
  }, [])

  // Answer a question
  const handleAnswer = useCallback((answerIdx: number) => {
    if (!currentQuestion) return
    const correct = answerIdx === currentQuestion.correct
    setLastAnswerCorrect(correct)
    setLastCorrectAnswerText(currentQuestion.options[currentQuestion.correct])
    setTimeReduced(correct)
    setQuestionPhase('result')
  }, [currentQuestion])

  const onPress = useCallback(() => {
    if (gameState === 'playing') {
      setGripPressed(true)
    }
    // In idle, Apertado is handled by startDirect or openQuestionFlow separately
  }, [gameState])

  const onRelease = useCallback(() => {
    if (gameState === 'playing' && gripPressed) {
      setGripPressed(false)
      handleLoss()
    }
  }, [gameState, gripPressed, handleLoss])

  useEffect(() => {
    if (gameState !== 'playing') return

    timerRef.current = setInterval(() => {
      const now = Date.now()
      const e = now - startTimeRef.current
      setElapsed(e)

      if (phase === 'normal') {
        if (e >= BASE_MS) {
          stopTimer()
          if (showBonus) {
            setPhase('bonus')
            bonusStartRef.current = now
            setElapsed(0)
          } else {
            handleWin(false)
          }
        }
      } else if (phase === 'bonus') {
        const bonusE = now - bonusStartRef.current
        setElapsed(bonusE)
        if (bonusE >= BONUS_TARGET_MS) {
          handleWin(true)
        }
      }
    }, 33)

    return () => stopTimer()
  }, [gameState, phase, BASE_MS, showBonus, handleWin, stopTimer, BONUS_TARGET_MS])

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        onPress()
      }
    }
    const onUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        onRelease()
      }
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [onPress, onRelease])

  const resetGame = () => {
    setGameState('idle')
    setElapsed(0)
    setShowResult(false)
    setPhase('normal')
    setGripPressed(false)
    setLostInBonus(false)
    setTimeReduced(false)
    setQuestionPhase('hidden')
    setCurrentQuestion(null)
    setLastAnswerCorrect(null)
    stopTimer()
  }

  // Display timer: show total elapsed from game start (including bonus phase)
  const totalElapsed = phase === 'normal' ? elapsed : BASE_MS + elapsed
  const displayTime = Math.min(totalElapsed, BASE_MS + BONUS_TARGET_MS)

  const isUrgent = phase === 'normal'
    ? elapsed >= BASE_MS - 10000
    : elapsed >= BONUS_TARGET_MS - 10000

  const strengthProgress = Math.min(100, (elapsed / STRENGTH_MS) * 100)
  const resistanceProgress = phase === 'normal'
    ? Math.min(100, (elapsed / BASE_MS) * 100)
    : 100
  const bonusProgress = phase === 'bonus'
    ? Math.min(100, (elapsed / BONUS_TARGET_MS) * 100)
    : 0


  return (
    <div className="mais-gradient h-dvh w-full flex flex-col relative overflow-hidden min-h-0">
      {showCapitalPrompt && (
        <Dialog open={showCapitalPrompt} onOpenChange={(open) => {
          if (!open && session === null) {
            initSession(1000)
          }
        }}>
          <DialogContent className="bg-[#0a0a0a] border-zinc-800 text-white max-w-sm dialog-3d">
            <DialogHeader>
              <DialogTitle className="text-center text-xl currency-bling">
                💰 CAPITAL INICIAL
              </DialogTitle>
              <DialogDescription className="text-center text-zinc-400">
                Insira o capital inicial para começar o balanço diário
              </DialogDescription>
            </DialogHeader>
            <CapitalPromptInline onConfirm={initSession} />
          </DialogContent>
        </Dialog>
      )}

      {/* Background glow */}
      {gameState === 'playing' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(212,160,23,${0.03 + (elapsed / BASE_MS) * 0.12}) 0%, transparent 70%)`,
          }}
        />
      )}
      {gameState === 'bonus_won' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,107,53,0.25) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Floating emoji particles */}
      {gameState === 'playing' && (
        <EmojiParticles emojis={STRENGTH_EMOJIS} count={5} />
      )}

      {/* Header */}
      <div className="flex-none w-full">
        {/* Title */}
        <div className="text-center mb-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-[0.15em]" style={{ color: 'var(--mais-gold)' }}>
            +MAIS <span style={{ color: '#C0C0C0' }}>POWER</span>
          </h1>
          <p className="text-[10px] text-zinc-600 tracking-[0.3em] uppercase mt-0.5">
            {gameConfig.tagline}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-nav">
          <button
            className={`tab-btn ${tab === 'game' ? 'tab-active' : ''}`}
            onClick={() => setTab('game')}
          >
            <Gamepad2 className="w-5 h-5" />
            JOGO
          </button>
          <button
            className={`tab-btn ${tab === 'balance' ? 'tab-active' : ''}`}
            onClick={() => setTab('balance')}
          >
            <BarChart3 className="w-5 h-5" />
            BALANÇO
          </button>
        </div>
      </div>

      {/* ===== GAME TAB ===== */}
      {tab === 'game' && (
        <div className="flex flex-col items-center gap-2 z-10 flex-1 justify-center w-full max-w-lg mx-auto px-4 min-h-0">
          {/* Status + Timer */}
          <div className="text-center">
            <div className={`text-sm font-bold uppercase tracking-[0.2em] ${
              gameState === 'playing' ? 'text-zinc-400' :
              gameState === 'won' ? 'text-green-400' :
              gameState === 'bonus_won' ? 'text-orange-400' :
              gameState === 'lost' ? 'text-red-600' : 'text-zinc-500'
            }`}>
              {gameState === 'idle' && messages.idle}
              {gameState === 'playing' && (phase === 'bonus' ? '🔥 BÓNUS ATIVO!' : messages.holding)}
              {gameState === 'won' && messages.won}
              {gameState === 'bonus_won' && '🎁 BÓNUS GANHO! 🔥'}
              {gameState === 'lost' && messages.lost}
            </div>
            {gameState !== 'idle' && (
              <div className={`timer-responsive font-black mt-2 timer-digits ${
                isUrgent ? 'timer-urgent' :
                gameState === 'won' ? 'text-green-400' :
                gameState === 'bonus_won' ? 'text-orange-400' :
                gameState === 'lost' ? 'text-zinc-500' :
                phase === 'bonus' ? 'text-orange-300' : ''
              }`}>
                {gameState === 'won' && formatTime(BASE_MS)}
                {gameState === 'bonus_won' && formatTime(BASE_MS + BONUS_TARGET_MS)}
                {gameState === 'lost' && formatTime(displayTime)}
                {gameState === 'playing' && formatTime(displayTime)}
              </div>
            )}
            {gameState === 'playing' && phase === 'bonus' && (
              <div className="text-xs text-orange-400 font-bold mt-0.5 uppercase tracking-wider">
                🎯 BÓNUS: aguenta até 5:30!
              </div>
            )}
          </div>

          {/* The Hand Grip - decorative only */}
          <div className="mt-1" style={{ touchAction: 'none' }}>
            <HandGrip state={gameState} />
          </div>

          {/* Apertado / Abriu buttons */}
          {gameState === 'playing' && (
            <div className="flex gap-4 mt-1">
              <button
                onClick={onPress}
                className={`grip-btn apertado-btn ${gripPressed ? 'apertado-active' : ''}`}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="text-2xl">💪</span>
                <span className="text-lg font-black tracking-wider">APERTADO</span>
                {gripPressed && <div className="apertado-pulse" />}
              </button>
              <button
                onClick={onRelease}
                className="grip-btn abriu-btn"
                style={{ touchAction: 'manipulation' }}
              >
                <span className="text-2xl">✋</span>
                <span className="text-lg font-black tracking-wider">ABRIU</span>
              </button>
            </div>
          )}

          {/* Text below grip */}
          {gameState === 'idle' && (
            <p className="text-sm text-zinc-500 text-center max-w-[240px] leading-relaxed font-semibold">
              aperte a pistola e não clique em Abriu 💪
            </p>
          )}

          {gameState === 'playing' && (
            <p className="text-sm text-zinc-500 text-center font-semibold">
              {gripPressed ? 'segura firme! não clica em Abriu! 🔥' : 'clica em Apertado!'}
            </p>
          )}

          {/* BARS */}
          {gameState === 'playing' && (
            <div className="w-full flex flex-col gap-2 mt-1">
              <div className="bar-strength">
                <div className="bar-label text-sm">
                  <span style={{ color: 'var(--mais-strength)' }}>💪 FORÇA</span>
                  <span className="text-zinc-500">{strengthProgress.toFixed(0)}%</span>
                </div>
                <div className="bar-track">
                  <div
                    className={`bar-fill ${strengthProgress >= 100 ? 'strength-throb' : ''}`}
                    style={{ width: `${strengthProgress}%` }}
                  />
                </div>
              </div>

              {phase === 'normal' && (
                <div className="bar-resistance">
                  <div className="bar-label text-sm">
                    <span style={{ color: 'var(--mais-gold)' }}>🛡️ RESISTÊNCIA</span>
                    <span className="text-zinc-500">{resistanceProgress.toFixed(0)}%</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${resistanceProgress >= 100 ? 'resistance-throb' : ''}`}
                      style={{ width: `${resistanceProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Bonus bar */}
              {showBonus && phase === 'bonus' && (
                <div className="bar-bonus">
                  <div className="bar-label text-sm">
                    <span style={{ color: '#ff6b35' }}>🎁 BÓNUS</span>
                    <span className="text-orange-400">{bonusProgress.toFixed(0)}%</span>
                  </div>
                  <div className="bar-track bonus-track">
                    <div
                      className={`bar-fill bonus-fill ${bonusProgress >= 100 ? 'bonus-throb' : ''}`}
                      style={{ width: `${bonusProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bet area - idle state */}
          {gameState === 'idle' && (
            <div className="flex flex-col items-center gap-2 mt-2">
              <label className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-bold">
                💰 Valor da aposta
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold currency-silver">Kz</span>
                <input
                  type="number"
                  min={gameConfig.minBet}
                  max={gameConfig.maxBet}
                  value={bet}
                  onChange={(e) => setBet(Math.max(gameConfig.minBet, Math.min(gameConfig.maxBet, Number(e.target.value) || gameConfig.minBet)))}
                  className="bet-input bg-transparent bet-input-responsive font-black text-white text-center w-full max-w-[200px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex items-center gap-2 text-zinc-600 text-xs">
                <span>min Kz {gameConfig.minBet.toLocaleString('pt-AO')}</span>
                <span className="text-zinc-700">•</span>
                <span>max Kz {gameConfig.maxBet.toLocaleString('pt-AO')}</span>
              </div>

              {/* Bonus indicator */}
              {bet >= gameConfig.bonusThreshold && (
                <div className="bonus-indicator mt-1">
                  <Gift className="w-4 h-4" />
                  <span>BÓNUS DISPONÍVEL: +Kz {gameConfig.bonusAmount.toLocaleString('pt-AO')} até 5:30</span>
                </div>
              )}

              {/* Time display (shows if reduced by question) */}
              {timeReduced && (
                <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: '#30d158' }}>
                  <Zap className="w-3.5 h-3.5" />
                  <span>⚡ Tempo reduzido: 2:30</span>
                </div>
              )}

              {/* Action buttons row */}
              <div className="flex gap-3 mt-3 w-full">
                <button
                  onClick={startDirect}
                  className="start-btn flex-1 py-3 sm:py-4 text-sm sm:text-base"
                  style={{ touchAction: 'manipulation' }}
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                  INICIAR 💪
                </button>
                <button
                  onClick={openQuestionFlow}
                  className="question-btn flex-1 py-3 sm:py-4 text-sm sm:text-base"
                  style={{ touchAction: 'manipulation' }}
                >
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  PERGUNTA?
                </button>
              </div>
            </div>
          )}

          {/* Prize display */}
          {(gameState === 'playing' || gameState === 'won' || gameState === 'bonus_won') && (
            <div className="text-center mt-1">
              <div className="text-xs text-zinc-500 uppercase tracking-[0.2em] mb-0.5 font-bold">
                🏆 Prémio
              </div>
              <div className={`text-3xl font-black ${
                gameState === 'bonus_won' ? 'text-orange-400' : 'currency-bling'
              }`}>
                Kz {winAmount.toLocaleString('pt-AO')}
              </div>
              {phase === 'bonus' && (
                <div className="text-xl font-black text-orange-400 mt-0.5">
                  + BÓNUS Kz {bonusAmountExtra.toLocaleString('pt-AO')}
                </div>
              )}
              {gameState === 'bonus_won' && (
                <div className="text-lg font-black text-orange-400 mt-0.5">
                  🎁 +Kz {bonusAmountExtra.toLocaleString('pt-AO')}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== BALANCE TAB ===== */}
      {tab === 'balance' && (
        <div className="z-10 flex-1 overflow-y-auto px-4 py-2 w-full max-w-lg mx-auto">
          <BalanceDashboard
            session={session}
            onReset={resetSession}
          />
        </div>
      )}

      {/* ===== QUESTION DIALOG: Category Choice ===== */}
      <Dialog open={questionPhase === 'category'} onOpenChange={(open) => {
        if (!open) {
          setQuestionPhase('hidden')
          setTimeReduced(false)
          setLastAnswerCorrect(null)
          setCurrentQuestion(null)
        }
      }}>
        <DialogContent className="bg-[#0a0a0a] border-zinc-800 text-white max-w-sm dialog-3d">
            <DialogHeader>
              <DialogTitle className="text-center text-xl currency-bling">
                ❓ ESCOLHA A CATEGORIA
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-400">
              Se acertar, o tempo reduz para 2:30 ⚡<br />
              Se errar, mantém 3:00
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={() => chooseCategory('math')}
              className="category-btn"
            >
              <Brain className="w-6 h-6 shrink-0" />
              <div className="text-left">
                <div className="text-base sm:text-lg font-bold">MATEMÁTICA</div>
                <div className="text-xs text-zinc-400">contas de rasteira 🧮</div>
              </div>
            </button>
            <button
              onClick={() => chooseCategory('general')}
              className="category-btn"
            >
              <BookOpen className="w-6 h-6 shrink-0" />
              <div className="text-left">
                <div className="text-base sm:text-lg font-bold">CULTURA GERAL</div>
                <div className="text-xs text-zinc-400">conhecimentos gerais 🌍</div>
              </div>
            </button>
            <button
              onClick={() => chooseCategory('saude')}
              className="category-btn"
            >
              <Heart className="w-6 h-6 shrink-0" style={{ color: '#ff4d4d' }} />
              <div className="text-left">
                <div className="text-base sm:text-lg font-bold">SAÚDE</div>
                <div className="text-xs text-zinc-400">o corpo humano engana 🏥</div>
              </div>
            </button>
            <button
              onClick={() => chooseCategory('biblia')}
              className="category-btn"
            >
              <Bookmark className="w-6 h-6 shrink-0" style={{ color: '#D4A017' }} />
              <div className="text-left">
                <div className="text-base sm:text-lg font-bold">BÍBLIA</div>
                <div className="text-xs text-zinc-400">conhecimento bíblico 📖</div>
              </div>
            </button>
            <button
              onClick={() => chooseCategory('logica')}
              className="category-btn"
            >
              <Lightbulb className="w-6 h-6 shrink-0" style={{ color: '#ffaa00' }} />
              <div className="text-left">
                <div className="text-base sm:text-lg font-bold">LÓGICA</div>
                <div className="text-xs text-zinc-400">pensa bem antes de responder 🧠</div>
              </div>
            </button>
            <button
              onClick={() => chooseCategory('portugues')}
              className="category-btn"
            >
              <FileText className="w-6 h-6 shrink-0" style={{ color: '#60a5fa' }} />
              <div className="text-left">
                <div className="text-base sm:text-lg font-bold">PORTUGUÊS</div>
                <div className="text-xs text-zinc-400">a nossa língua tem rasteiras 🇦🇴</div>
              </div>
            </button>
            <Button
              onClick={() => setQuestionPhase('hidden')}
              className="w-full font-bold py-4 text-base"
              style={{ background: 'transparent', color: '#666', border: '1px solid #333' }}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== QUESTION DIALOG: Answering ===== */}
      <Dialog open={questionPhase === 'answering'} onOpenChange={(open) => {
        if (!open) {
          setQuestionPhase('hidden')
          setTimeReduced(false)
          setLastAnswerCorrect(null)
          setCurrentQuestion(null)
        }
      }}>
        <DialogContent className="bg-[#0a0a0a] border-zinc-800 text-white max-w-sm dialog-3d">
          <DialogHeader>
            <DialogTitle className="text-center text-lg currency-bling flex items-center justify-center gap-2">
              {questionCategory === 'math' && <><Brain className="w-5 h-5" /> MATEMÁTICA</>}
              {questionCategory === 'general' && <><BookOpen className="w-5 h-5" /> CULTURA GERAL</>}
              {questionCategory === 'saude' && <><Heart className="w-5 h-5" style={{ color: '#ff4d4d' }} /> SAÚDE</>}
              {questionCategory === 'biblia' && <><Bookmark className="w-5 h-5" style={{ color: '#D4A017' }} /> BÍBLIA</>}
              {questionCategory === 'logica' && <><Lightbulb className="w-5 h-5" style={{ color: '#ffaa00' }} /> LÓGICA</>}
              {questionCategory === 'portugues' && <><FileText className="w-5 h-5" style={{ color: '#60a5fa' }} /> PORTUGUÊS</>}
            </DialogTitle>
          </DialogHeader>
          {currentQuestion && (
            <div className="flex flex-col items-center gap-3 mt-2">
              <div className="text-xl font-bold text-white text-center leading-relaxed">
                {currentQuestion.question}
              </div>
              <div className="flex flex-col gap-2 w-full mt-1">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="option-btn"
                  >
                    <span className="option-letter">{'ABCDEFGHIJKLMNOPQRSTUVWXYZ' [idx]}</span>
                    <span className="text-base font-semibold">{opt}</span>
                  </button>
                ))}
              </div>
              <Button
                onClick={() => {
                  setQuestionPhase('category')
                  setLastAnswerCorrect(null)
                  setCurrentQuestion(null)
                }}
                className="w-full font-bold py-3 text-sm mt-1"
                style={{ background: 'transparent', color: '#666', border: '1px solid #333' }}
              >
                ← Voltar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== QUESTION DIALOG: Result ===== */}
      <Dialog open={questionPhase === 'result'} onOpenChange={(open) => {
        if (!open) {
          setQuestionPhase('hidden')
          setTimeReduced(false)
          setLastAnswerCorrect(null)
          setCurrentQuestion(null)
        }
      }}>
        <DialogContent className="bg-[#0a0a0a] border-zinc-800 text-white max-w-sm dialog-3d">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {lastAnswerCorrect ? (
                <span style={{ color: '#30d158' }}>✅ ACERTOU!</span>
              ) : (
                <span className="text-red-500">❌ ERROU!</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3 mt-1">
            {lastAnswerCorrect ? (
              <>
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6" style={{ color: 'var(--mais-gold)' }} />
                  <span className="text-lg font-bold" style={{ color: 'var(--mais-gold)' }}>
                    Vai fazer 2:30s! ⚡
                  </span>
                </div>
                <p className="text-zinc-400 text-sm text-center">
                  Resposta correta! Tempo reduzido 💪
                </p>
              </>
            ) : (
              <>
                <div className="text-lg font-bold text-zinc-300 text-center">
                  Vai fazer 3:00
                </div>
                <div className="bg-zinc-900 rounded-xl px-4 py-3 text-center w-full">
                  <p className="text-xs text-zinc-500 mb-1">RESPOSTA CORRETA:</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--mais-gold)' }}>
                    {lastCorrectAnswerText}
                  </p>
                </div>
                <p className="text-zinc-500 text-sm text-center">
                  Na próxima acertas! 💪🏾
                </p>
              </>
            )}
            <button
              onClick={startAfterQuestion}
              className="start-btn mt-2 w-full"
              style={{ touchAction: 'manipulation' }}
            >
              <Play className="w-5 h-5" />
              INICIAR JOGO
            </button>
            <button
              onClick={resetGame}
              className="w-full py-3 rounded-xl font-bold text-sm mt-1"
              style={{ background: 'transparent', color: '#C0C0C0', border: '1px solid #444', touchAction: 'manipulation' }}
            >
              ← Voltar ao início
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== RESULT DIALOG ===== */}
      <Dialog open={showResult} onOpenChange={() => {}}>
        <DialogContent className="bg-[#0a0a0a] border-zinc-800 text-white max-w-sm dialog-3d">
          <DialogHeader>
            {(gameState === 'won' || gameState === 'bonus_won') ? (
              <DialogTitle className="text-center">
                <div className="text-5xl font-black mb-2" style={{ color: '#30d158' }}>
                  🏆 VITÓRIA!
                </div>
                <EmojiParticles emojis={WIN_EMOJIS} count={6} />
              </DialogTitle>
            ) : (
              <DialogTitle className="text-center">
                <div className="text-5xl font-black mb-2 text-red-600">
                  💀 DERROTA!
                </div>
              </DialogTitle>
            )}
            <DialogDescription asChild>
              <div className="text-center mt-2">
                {(gameState === 'won' || gameState === 'bonus_won') ? (
                  <>
                    <div className="text-4xl font-black currency-bling">
                      +Kz {((gameState === 'bonus_won' ? winAmount + bonusAmountExtra : winAmount)).toLocaleString('pt-AO')}
                    </div>
                    {gameState === 'bonus_won' && (
                      <div className="flex flex-col items-center gap-1 mt-2">
                        <div className="bonus-notification-badge">
                          <span className="text-2xl">🎁</span>
                          <span className="font-bold text-orange-300">BÓNUS: +Kz {bonusAmountExtra.toLocaleString('pt-AO')}</span>
                        </div>
                        <p className="text-zinc-500 text-sm mt-1">
                          💪 Chegou aos 5:30! Resistência lendária!
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 mt-4">
                    <div className="text-5xl font-black text-red-500">
                      -Kz {bet.toLocaleString('pt-AO')}
                    </div>
                    <p className="text-zinc-400 text-sm">
                      {lostInBonus ? 'Soltou no bónus! Perdeu tudo 😤' : `Soltou com ${formatTime(Math.max(0, BASE_MS - elapsed))} restantes 😤`}
                    </p>
                    <p className="text-base mt-1" style={{ color: 'var(--mais-gold)' }}>
                      {messages.encouragement}
                    </p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-2">
            <Button
              onClick={() => { resetGame() }}
              className="w-full font-bold py-5 text-base"
              style={{ background: 'var(--mais-gold)', color: '#0a0a0a' }}
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              💪 Jogar Novamente
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Capital prompt inline
function CapitalPromptInline({ onConfirm }: { onConfirm: (val: number) => void }) {
  const [val, setVal] = useState(50000)

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <input
        type="number"
        min={1000}
        value={val}
        onChange={(e) => setVal(Math.max(1000, Number(e.target.value) || 1000))}
        className="bg-zinc-900 text-4xl font-black text-white text-center w-full py-3 rounded-xl border border-zinc-700 outline-none"
      />
      <Button
        onClick={() => onConfirm(val)}
        className="w-full font-bold py-5 text-base"
        style={{ background: 'var(--mais-gold)', color: '#0a0a0a' }}
      >
        💰 CONFIRMAR CAPITAL
      </Button>
    </div>
  )
}
