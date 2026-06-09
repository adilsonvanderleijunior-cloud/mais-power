import { useState, useCallback } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog'
import {
  Trophy,
  Skull,
  Wallet,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Plus,
  Minus,
  Users,
  DollarSign,
} from 'lucide-react'

export interface SessionData {
  initialCapital: number
  currentCapital: number
  totalGames: number
  totalWins: number
  totalLosses: number
  totalPaidOut: number
}

const STORAGE_KEY = 'mais-power-session'

function loadSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return null
}

function saveSession(data: SessionData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(loadSession)
  const showCapitalPrompt = session === null

  const initSession = useCallback((capital: number) => {
    const s: SessionData = {
      initialCapital: capital,
      currentCapital: capital,
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      totalPaidOut: 0,
    }
    setSession(s)
    saveSession(s)
  }, [])

  const recordResult = useCallback(
    (won: boolean, bet: number, winAmount: number) => {
      setSession((prev) => {
        if (!prev) return prev
        const next: SessionData = {
          ...prev,
          totalGames: prev.totalGames + 1,
          totalWins: prev.totalWins + (won ? 1 : 0),
          totalLosses: prev.totalLosses + (won ? 0 : 1),
          currentCapital: won
            ? prev.currentCapital - winAmount
            : prev.currentCapital + bet,
          totalPaidOut: prev.totalPaidOut + (won ? winAmount : 0),
        }
        saveSession(next)
        return next
      })
    },
    []
  )

  const resetSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }, [])

  return {
    session,
    showCapitalPrompt,
    initSession,
    recordResult,
    resetSession,
  }
}

interface Props {
  session: SessionData
  onReset: () => void
}

export default function BalanceDashboard({ session, onReset }: Props) {
  const profitLoss = session.currentCapital - session.initialCapital
  const isProfitable = profitLoss >= 0

  return (
    <div className="balance-dashboard w-full max-w-md mx-auto">
      {/* Header */}
      <div className="balance-header">
        <Wallet className="w-5 h-5" style={{ color: 'var(--mais-gold)' }} />
        <span className="balance-title">BALANÇO DIÁRIO</span>
      </div>

      {/* Capital Cards */}
      <div className="balance-grid">
        <div className="balance-card card-capital">
          <div className="balance-card-label">
            <DollarSign className="w-3.5 h-3.5" />
            CAPITAL INICIAL
          </div>
          <div className="balance-card-value">
            Kz {session.initialCapital.toLocaleString('pt-AO')}
          </div>
        </div>
        <div className="balance-card card-capital">
          <div className="balance-card-label">
            <Wallet className="w-3.5 h-3.5" />
            CAPITAL ATUAL
          </div>
          <div className="balance-card-value">
            Kz {session.currentCapital.toLocaleString('pt-AO')}
          </div>
        </div>
      </div>

      {/* Profit / Loss */}
      <div className={`balance-profit ${isProfitable ? 'profit-positive' : 'profit-negative'}`}>
        {isProfitable ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>
          {isProfitable ? 'LUCRO' : 'PREJUÍZO'}: Kz {Math.abs(profitLoss).toLocaleString('pt-AO')}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="balance-stats-grid">
        <div className="balance-stat">
          <Users className="w-4 h-4" style={{ color: 'var(--mais-gold)' }} />
          <div className="balance-stat-value">{session.totalGames}</div>
          <div className="balance-stat-label">TOTAL JOGOS</div>
        </div>
        <div className="balance-stat">
          <Trophy className="w-4 h-4" style={{ color: '#30d158' }} />
          <div className="balance-stat-value" style={{ color: '#30d158' }}>
            {session.totalWins}
          </div>
          <div className="balance-stat-label">GANHARAM</div>
        </div>
        <div className="balance-stat">
          <Skull className="w-4 h-4" style={{ color: '#ff4444' }} />
          <div className="balance-stat-value" style={{ color: '#ff4444' }}>
            {session.totalLosses}
          </div>
          <div className="balance-stat-label">PERDERAM</div>
        </div>
      </div>

      {/* Payout Info */}
      <div className="balance-payout">
        <div className="balance-payout-row">
          <span className="balance-payout-label">
            <Plus className="w-3.5 h-3.5" style={{ color: '#30d158' }} />
            Total recebido (apostas perdidas)
          </span>
          <span className="balance-payout-value" style={{ color: '#30d158' }}>
            + Kz {(session.totalLosses > 0 ? session.totalGames > 0 ? (session.totalLosses * (session.initialCapital > 0 ? Math.round(session.currentCapital / session.totalLosses * 100) / 100 : 0)) : 0 : 0).toLocaleString('pt-AO')}
          </span>
        </div>
        <div className="balance-payout-row">
          <span className="balance-payout-label">
            <Minus className="w-3.5 h-3.5" style={{ color: '#ff4444' }} />
            Total pago (prémios)
          </span>
          <span className="balance-payout-value" style={{ color: '#ff4444' }}>
            - Kz {session.totalPaidOut.toLocaleString('pt-AO')}
          </span>
        </div>
      </div>

      {/* Reset */}
      <Button
        onClick={onReset}
        variant="outline"
        className="w-full mt-3 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 font-bold text-sm py-4"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        NOVO DIA / RESETAR BALANÇO
      </Button>
    </div>
  )
}

export function CapitalPrompt({ onConfirm }: { onConfirm: (value: number) => void }) {
  const [value, setValue] = useState(50000)

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="bg-[#0a0a0a] border-zinc-800 text-white max-w-sm dialog-3d">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            <Wallet className="inline w-5 h-5 mr-2" style={{ color: 'var(--mais-gold)' }} />
            <span className="currency-bling">CAPITAL INICIAL</span>
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400 text-sm">
            Quanto tens disponível hoje para pagar os prémios?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold currency-silver">Kz</span>
            <input
              type="number"
              min={1000}
              max={10000000}
              value={value}
              onChange={(e) =>
                setValue(Math.max(1000, Number(e.target.value) || 1000))
              }
              className="bg-transparent text-4xl font-black text-white text-center w-40 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2 text-zinc-600 text-[10px]">
            <span>min Kz 1.000</span>
            <span className="text-zinc-700">•</span>
            <span>max Kz 10.000.000</span>
          </div>
          <Button
            onClick={() => onConfirm(value)}
            className="w-full font-bold py-5 text-base"
            style={{ background: 'var(--mais-gold)', color: '#0a0a0a' }}
          >
            INICIAR SESSÃO 💪
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
