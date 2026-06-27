import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/providers/trpc'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  ShoppingCart,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  LogOut,
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

function StatCard({ icon: Icon, label, value, color }: { icon: typeof LayoutDashboard; label: string; value: string | number; color: string }) {
  return (
    <div className="p-5 rounded-2xl" style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="font-sora text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <div className="font-sora text-2xl font-semibold" style={{ color: 'var(--text-main)' }}>{value}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, isLoading: authLoading, logout } = useAuth()
  const utils = trpc.useUtils()

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login')
    } else if (!authLoading && isAuthenticated && !isAdmin) {
      navigate('/')
      toast.error('Access denied. Admin only.')
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate])

  const { data: stats } = trpc.dashboard.stats.useQuery(undefined, { enabled: isAdmin })
  const { data: recentOrders } = trpc.dashboard.recentOrders.useQuery(undefined, { enabled: isAdmin })
  const { data: recentComments } = trpc.dashboard.recentComments.useQuery(undefined, { enabled: isAdmin })
  const { data: salesData } = trpc.dashboard.salesData.useQuery(undefined, { enabled: isAdmin })

  const updateOrderStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('Order status updated')
      utils.dashboard.recentOrders.invalidate()
      utils.dashboard.stats.invalidate()
    },
  })

  const approveComment = trpc.comment.approve.useMutation({
    onSuccess: () => {
      toast.success('Comment approved')
      utils.dashboard.recentComments.invalidate()
      utils.dashboard.stats.invalidate()
    },
  })

  const rejectComment = trpc.comment.reject.useMutation({
    onSuccess: () => {
      toast.success('Comment rejected')
      utils.dashboard.recentComments.invalidate()
      utils.dashboard.stats.invalidate()
    },
  })

  if (authLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!isAdmin) return null

  const salesChartData = {
    labels: salesData?.map((d) => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'Revenue (UGX)',
        data: salesData?.map((d) => d.revenue) || [],
        borderColor: '#D4A373',
        backgroundColor: 'rgba(212, 163, 115, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#D4A373',
      },
    ],
  }

  const ordersChartData = {
    labels: salesData?.map((d) => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'Orders',
        data: salesData?.map((d) => d.orders) || [],
        backgroundColor: '#606C38',
        borderRadius: 6,
      },
    ],
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      pending: { bg: 'rgba(188,108,37,0.12)', text: '#BC6C25' },
      confirmed: { bg: 'rgba(96,108,56,0.12)', text: '#606C38' },
      delivered: { bg: 'rgba(100,149,237,0.12)', text: '#6495ED' },
      cancelled: { bg: 'rgba(220,20,60,0.08)', text: '#DC143C' },
    }
    const c = colors[status] || colors.pending
    return (
      <span className="font-sora text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium" style={{ background: c.bg, color: c.text }}>
        {status}
      </span>
    )
  }

  return (
    <div className="min-h-[100dvh] pt-20 lg:pt-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
              <span className="eyebrow">Admin Panel</span>
            </div>
            <h1 className="font-serif text-2xl lg:text-3xl" style={{ color: 'var(--text-main)' }}>
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sora text-xs" style={{ color: 'var(--text-muted)' }}>
              {user?.name}
            </span>
            <button onClick={logout} className="flex items-center gap-1.5 font-sora text-xs px-3 py-2 rounded-full" style={{ background: 'var(--bg-alt)', color: 'var(--text-muted)' }}>
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <StatCard icon={ShoppingCart} label="Total Orders" value={stats?.totalOrders || 0} color="#D4A373" />
          <StatCard icon={Clock} label="Pending Orders" value={stats?.pendingOrders || 0} color="#BC6C25" />
          <StatCard icon={TrendingUp} label="Total Revenue" value={`UGX ${(stats?.totalRevenue || 0).toLocaleString()}`} color="#606C38" />
          <StatCard icon={MessageCircle} label="Pending Comments" value={stats?.pendingComments || 0} color="#8B7E66" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded-2xl" style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}>
            <h3 className="font-serif text-lg mb-4" style={{ color: 'var(--text-main)' }}>Revenue Trend (30 Days)</h3>
            <Line
              data={salesChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { family: 'Sora', size: 10 }, color: '#8B7E66' } },
                  y: { grid: { color: 'rgba(139,126,102,0.1)' }, ticks: { font: { family: 'Sora', size: 10 }, color: '#8B7E66' } },
                },
              }}
            />
          </div>
          <div className="p-5 rounded-2xl" style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}>
            <h3 className="font-serif text-lg mb-4" style={{ color: 'var(--text-main)' }}>Daily Orders (30 Days)</h3>
            <Bar
              data={ordersChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { family: 'Sora', size: 10 }, color: '#8B7E66' } },
                  y: { grid: { color: 'rgba(139,126,102,0.1)' }, ticks: { font: { family: 'Sora', size: 10 }, color: '#8B7E66' } },
                },
              }}
            />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl overflow-hidden mb-8" style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}>
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
              <h3 className="font-serif text-lg" style={{ color: 'var(--text-main)' }}>Recent Orders</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--bg-alt)' }}>
                  <th className="text-left font-sora text-[10px] uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>ID</th>
                  <th className="text-left font-sora text-[10px] uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>Customer</th>
                  <th className="text-left font-sora text-[10px] uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>Product</th>
                  <th className="text-left font-sora text-[10px] uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>Qty</th>
                  <th className="text-left font-sora text-[10px] uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>Status</th>
                  <th className="text-left font-sora text-[10px] uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders?.map((order) => (
                  <tr key={order.id} className="transition-colors duration-150 hover:bg-black/[0.02]">
                    <td className="px-4 py-3 font-sora text-xs" style={{ color: 'var(--text-main)' }}>#{order.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-sora text-xs" style={{ color: 'var(--text-main)' }}>{order.customerName}</div>
                      <div className="font-sora text-[10px]" style={{ color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 font-serif text-xs" style={{ color: 'var(--text-main)' }}>{order.product}</td>
                    <td className="px-4 py-3 font-sora text-xs" style={{ color: 'var(--text-main)' }}>{order.quantity}</td>
                    <td className="px-4 py-3">{statusBadge(order.status)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus.mutate({ id: order.id, status: e.target.value as any })}
                        className="font-sora text-[11px] px-2 py-1 rounded-lg outline-none"
                        style={{ background: 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {(!recentOrders || recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center font-serif text-sm" style={{ color: 'var(--text-muted)' }}>No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments Moderation */}
        <div className="rounded-2xl overflow-hidden mb-8" style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}>
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
              <h3 className="font-serif text-lg" style={{ color: 'var(--text-main)' }}>Comments Moderation</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--bg-alt)' }}>
                  <th className="text-left font-sora text-[10px] uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>Name</th>
                  <th className="text-left font-sora text-[10px] uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>Comment</th>
                  <th className="text-left font-sora text-[10px] uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>Status</th>
                  <th className="text-left font-sora text-[10px] uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentComments?.map((comment) => (
                  <tr key={comment.id} className="transition-colors duration-150 hover:bg-black/[0.02]">
                    <td className="px-4 py-3">
                      <div className="font-sora text-xs" style={{ color: 'var(--text-main)' }}>{comment.name}</div>
                      <div className="font-sora text-[10px]" style={{ color: 'var(--text-muted)' }}>{comment.email}</div>
                    </td>
                    <td className="px-4 py-3 font-serif text-xs max-w-[300px] truncate" style={{ color: 'var(--text-main)' }}>{comment.comment}</td>
                    <td className="px-4 py-3">
                      <span
                        className="font-sora text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: comment.approved ? 'rgba(96,108,56,0.12)' : 'rgba(188,108,37,0.12)',
                          color: comment.approved ? '#606C38' : '#BC6C25',
                        }}
                      >
                        {comment.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!comment.approved && (
                          <button
                            onClick={() => approveComment.mutate({ id: comment.id })}
                            className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-green-50"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" style={{ color: '#606C38' }} />
                          </button>
                        )}
                        <button
                          onClick={() => rejectComment.mutate({ id: comment.id })}
                          className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-red-50"
                          title="Delete"
                        >
                          <XCircle className="w-4 h-4" style={{ color: '#DC143C' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!recentComments || recentComments.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center font-serif text-sm" style={{ color: 'var(--text-muted)' }}>No comments yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
