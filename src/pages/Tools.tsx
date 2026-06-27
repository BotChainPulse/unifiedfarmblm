import { useState } from 'react'
import { Egg, Scale, TrendingUp } from 'lucide-react'

/* ─── Feed Calculator ─── */
function FeedCalculator() {
  const [birdCount, setBirdCount] = useState(10)
  const [age, setAge] = useState<'chick' | 'grower' | 'layer'>('layer')
  const [days, setDays] = useState(30)

  const feedRates = { chick: 0.05, grower: 0.08, layer: 0.12 }
  const totalFeed = birdCount * feedRates[age] * days
  const bags50kg = Math.ceil(totalFeed / 50)
  const costPerBag = age === 'chick' ? 85000 : age === 'grower' ? 75000 : 72000
  const totalCost = bags50kg * costPerBag

  return (
    <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-alt)' }}>
          <Scale className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
        </div>
        <h3 className="font-serif text-xl" style={{ color: 'var(--text-main)' }}>Feed Calculator</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Number of Birds</label>
          <input type="number" min={0} value={birdCount} onChange={(e) => setBirdCount(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--bg)', color: 'var(--text-main)' }} />
        </div>
        <div>
          <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Bird Stage</label>
          <select value={age} onChange={(e) => setAge(e.target.value as any)} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--bg)', color: 'var(--text-main)' }}>
            <option value="chick">Day-old to 8 weeks (0.05kg/bird/day)</option>
            <option value="grower">8-18 weeks (0.08kg/bird/day)</option>
            <option value="layer">Layers 18+ weeks (0.12kg/bird/day)</option>
          </select>
        </div>
        <div>
          <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Duration (days)</label>
          <input type="number" min={0} value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--bg)', color: 'var(--text-main)' }} />
        </div>
        <div className="p-4 rounded-xl space-y-2" style={{ background: 'var(--bg-alt)' }}>
          <div className="flex justify-between font-sora text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Total Feed Needed</span>
            <span style={{ color: 'var(--text-main)' }} className="font-medium">{totalFeed.toFixed(1)} kg</span>
          </div>
          <div className="flex justify-between font-sora text-sm">
            <span style={{ color: 'var(--text-muted)' }}>50kg Bags Required</span>
            <span style={{ color: 'var(--accent)' }} className="font-medium">{bags50kg} bags</span>
          </div>
          <div className="flex justify-between font-sora text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Estimated Cost</span>
            <span style={{ color: 'var(--accent)' }} className="font-medium">UGX {totalCost.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Egg Production Calculator ─── */
function EggCalculator() {
  const [hens, setHens] = useState(10)
  const [layingRate, setLayingRate] = useState(85)
  const [eggPrice, setEggPrice] = useState(500)

  const dailyEggs = Math.round(hens * (layingRate / 100))
  const weeklyEggs = dailyEggs * 7
  const monthlyEggs = dailyEggs * 30
  const traysPerDay = (dailyEggs / 30).toFixed(1)
  const dailyRevenue = dailyEggs * eggPrice
  const monthlyRevenue = dailyRevenue * 30

  return (
    <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-alt)' }}>
          <Egg className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
        </div>
        <h3 className="font-serif text-xl" style={{ color: 'var(--text-main)' }}>Egg Production Calculator</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Number of Laying Hens</label>
          <input type="number" min={0} value={hens} onChange={(e) => setHens(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--bg)', color: 'var(--text-main)' }} />
        </div>
        <div>
          <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Laying Rate (%)</label>
          <input type="number" min={0} max={100} value={layingRate} onChange={(e) => setLayingRate(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--bg)', color: 'var(--text-main)' }} />
        </div>
        <div>
          <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Price per Egg (UGX)</label>
          <input type="number" min={0} value={eggPrice} onChange={(e) => setEggPrice(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--bg)', color: 'var(--text-main)' }} />
        </div>
        <div className="p-4 rounded-xl space-y-2" style={{ background: 'var(--bg-alt)' }}>
          <div className="flex justify-between font-sora text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Daily Eggs</span>
            <span style={{ color: 'var(--text-main)' }} className="font-medium">{dailyEggs} eggs ({traysPerDay} trays)</span>
          </div>
          <div className="flex justify-between font-sora text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Weekly Production</span>
            <span style={{ color: 'var(--text-main)' }} className="font-medium">{weeklyEggs} eggs</span>
          </div>
          <div className="flex justify-between font-sora text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Monthly Production</span>
            <span style={{ color: 'var(--text-main)' }} className="font-medium">{monthlyEggs} eggs</span>
          </div>
          <div className="flex justify-between font-sora text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Monthly Revenue</span>
            <span style={{ color: 'var(--accent)' }} className="font-medium">UGX {monthlyRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Profit Calculator ─── */
function ProfitCalculator() {
  const [hens, setHens] = useState(10)
  const [feedCost, setFeedCost] = useState(50000)
  const [otherCosts, setOtherCosts] = useState(20000)
  const [monthlyRevenue, setMonthlyRevenue] = useState(100000)

  const totalCosts = feedCost + otherCosts
  const profit = monthlyRevenue - totalCosts
  const margin = monthlyRevenue > 0 ? ((profit / monthlyRevenue) * 100).toFixed(1) : '0'
  const costPerBird = hens > 0 ? (totalCosts / hens).toFixed(0) : '0'

  return (
    <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-alt)' }}>
          <TrendingUp className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
        </div>
        <h3 className="font-serif text-xl" style={{ color: 'var(--text-main)' }}>Profit Calculator</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Number of Birds</label>
          <input type="number" min={0} value={hens} onChange={(e) => setHens(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--bg)', color: 'var(--text-main)' }} />
        </div>
        <div>
          <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Monthly Feed Cost (UGX)</label>
          <input type="number" min={0} value={feedCost} onChange={(e) => setFeedCost(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--bg)', color: 'var(--text-main)' }} />
        </div>
        <div>
          <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Other Monthly Costs (UGX)</label>
          <input type="number" min={0} value={otherCosts} onChange={(e) => setOtherCosts(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--bg)', color: 'var(--text-main)' }} />
        </div>
        <div>
          <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Monthly Revenue (UGX)</label>
          <input type="number" min={0} value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--bg)', color: 'var(--text-main)' }} />
        </div>
        <div className="p-4 rounded-xl space-y-2" style={{ background: profit >= 0 ? 'rgba(96,108,56,0.08)' : 'rgba(188,108,37,0.08)' }}>
          <div className="flex justify-between font-sora text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Total Monthly Costs</span>
            <span style={{ color: 'var(--text-main)' }} className="font-medium">UGX {totalCosts.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-sora text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Monthly Profit</span>
            <span style={{ color: profit >= 0 ? 'var(--secondary)' : 'var(--accent)' }} className="font-medium">UGX {profit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-sora text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Profit Margin</span>
            <span style={{ color: profit >= 0 ? 'var(--secondary)' : 'var(--accent)' }} className="font-medium">{margin}%</span>
          </div>
          <div className="flex justify-between font-sora text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Cost per Bird</span>
            <span style={{ color: 'var(--text-main)' }} className="font-medium">UGX {Number(costPerBird).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Tools() {
  return (
    <div className="pt-24 lg:pt-28">
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-[1200px] mx-auto">
          <span className="eyebrow mb-3 block">Free Tools</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-4" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Farming Calculators
          </h1>
          <p className="font-serif text-base lg:text-lg max-w-[600px]" style={{ color: 'var(--text-muted)' }}>
            Plan your poultry farm with our free calculators. Estimate feed costs, egg production, and profitability before you invest.
          </p>
        </div>
      </section>

      <section className="section-pad px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FeedCalculator />
          <EggCalculator />
          <ProfitCalculator />
        </div>
      </section>
    </div>
  )
}
