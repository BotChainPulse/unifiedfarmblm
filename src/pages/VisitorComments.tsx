import { useState } from 'react'
import { trpc } from '@/providers/trpc'
import { toast } from 'sonner'
import { MessageCircle, Plus, X, Calendar, Send, User, ThumbsUp } from 'lucide-react'

export default function VisitorComments() {
  const { data: comments, isLoading } = trpc.comment.list.useQuery()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', comment: '' })

  const createComment = trpc.comment.create.useMutation({
    onSuccess: () => {
      toast.success('Comment submitted! It will appear after approval.')
      setShowModal(false)
      setFormData({ name: '', email: '', comment: '' })
    },
    onError: (err) => toast.error(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createComment.mutate(formData)
  }

  return (
    <div className="pt-24 lg:pt-28">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-[800px] mx-auto text-center">
          <span className="eyebrow mb-3 block">Guestbook</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-4" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Visitor Comments
          </h1>
          <p className="font-serif text-base lg:text-lg" style={{ color: 'var(--text-muted)' }}>
            We love hearing from our community. Share your experience with Unifiedfarm BLM and help other farmers discover quality poultry products.
          </p>
        </div>
      </section>

      {/* Comments */}
      <section className="section-pad px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[800px] mx-auto">
          {/* Stats bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
              <span className="font-sora text-sm" style={{ color: 'var(--text-muted)' }}>
                {comments?.length || 0} comments from our community
              </span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary gap-2 text-xs py-2.5 px-5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Comment
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-5 lg:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-sora text-sm font-medium"
                      style={{ background: 'var(--primary)', color: '#FEFAE0' }}
                    >
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-serif text-base" style={{ color: 'var(--text-main)' }}>{c.name}</h4>
                      <span className="font-sora text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Calendar className="w-3 h-3" />
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}
                      </span>
                    </div>
                  </div>
                  <p className="font-serif text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {c.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MessageCircle className="w-14 h-14 mx-auto mb-4 opacity-20" style={{ color: 'var(--secondary)' }} />
              <h3 className="font-serif text-xl mb-2" style={{ color: 'var(--text-main)' }}>No Comments Yet</h3>
              <p className="font-serif text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Be the first to share your experience with Unifiedfarm BLM.
              </p>
              <button onClick={() => setShowModal(true)} className="btn-primary gap-2">
                <Plus className="w-4 h-4" />
                Write a Comment
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Add Comment Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: 'rgba(40, 54, 24, 0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 lg:p-8"
            style={{ background: 'var(--bg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-2xl" style={{ color: 'var(--text-main)' }}>Leave a Comment</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-full hover:bg-black/5">
                <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Your Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--surface)', color: 'var(--text-main)' }} placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--surface)', color: 'var(--text-main)' }} placeholder="john@example.com" />
              </div>
              <div>
                <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Your Comment</label>
                <textarea required rows={4} value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} className="w-full px-4 py-3 rounded-xl font-serif text-sm outline-none resize-none" style={{ background: 'var(--surface)', color: 'var(--text-main)' }} placeholder="Share your experience with our farm..." />
              </div>
              <button type="submit" disabled={createComment.isPending} className="btn-primary w-full gap-2">
                <Send className="w-4 h-4" />
                {createComment.isPending ? 'Submitting...' : 'Submit Comment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
