import { useState, useRef, useEffect } from 'react'
import { trpc } from '@/providers/trpc'
import { Leaf, X, Send, Loader2, Bot, User } from 'lucide-react'

function generateSessionId() {
  return 'session_' + Math.random().toString(36).substring(2, 15)
}

const SUGGESTED_PROMPTS = [
  'What are your egg prices?',
  'How do I order?',
  'Tell me about day-old chicks',
]

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('chat_session_id')
    if (!id) {
      id = generateSessionId()
      localStorage.setItem('chat_session_id', id)
    }
    return id
  })
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatMutation = trpc.chat.send.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    },
  })

  const { data: history } = trpc.chat.history.useQuery(
    { sessionId },
    { enabled: isOpen }
  )

  useEffect(() => {
    if (history && history.length > 0) {
      setMessages(
        history.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))
      )
    }
  }, [history])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!message.trim() || chatMutation.isPending) return
    const userMsg = message.trim()
    setMessage('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    chatMutation.mutate({ sessionId, message: userMsg })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-widget">
      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-panel mb-3">
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ background: 'var(--secondary)' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--primary)' }}
              >
                <Leaf className="w-4 h-4" style={{ color: '#FEFAE0' }} />
              </div>
              <div>
                <h4 className="font-sora text-sm font-medium" style={{ color: '#FEFAE0' }}>
                  Farm Assistant
                </h4>
                <p className="font-sora text-[10px]" style={{ color: 'rgba(254,250,224,0.6)' }}>
                  Ask me anything about our farm
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full transition-colors duration-200 hover:bg-white/10"
            >
              <X className="w-5 h-5" style={{ color: '#FEFAE0' }} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            style={{ background: 'var(--bg)' }}
          >
            {messages.length === 0 && (
              <div className="text-center py-6">
                <Bot
                  className="w-10 h-10 mx-auto mb-3 opacity-30"
                  style={{ color: 'var(--secondary)' }}
                />
                <p className="font-serif text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  Hi there! How can I help you today?
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        setMessages((prev) => [...prev, { role: 'user', content: prompt }])
                        chatMutation.mutate({ sessionId, message: prompt })
                      }}
                      className="font-sora text-[11px] px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                      style={{
                        background: 'var(--surface)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background:
                      msg.role === 'user' ? 'var(--primary)' : 'var(--secondary)',
                  }}
                >
                  {msg.role === 'user' ? (
                    <User className="w-3.5 h-3.5" style={{ color: '#FEFAE0' }} />
                  ) : (
                    <Bot className="w-3.5 h-3.5" style={{ color: '#FEFAE0' }} />
                  )}
                </div>
                <div
                  className="max-w-[75%] px-3.5 py-2.5 rounded-2xl font-serif text-sm leading-relaxed"
                  style={{
                    background:
                      msg.role === 'user'
                        ? 'var(--primary)'
                        : 'var(--surface)',
                    color:
                      msg.role === 'user'
                        ? '#FEFAE0'
                        : 'var(--text-main)',
                    borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                    borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 16,
                    boxShadow:
                      msg.role === 'assistant'
                        ? '0 1px 4px rgba(40,54,24,0.06)'
                        : 'none',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {chatMutation.isPending && (
              <div className="flex gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'var(--secondary)' }}
                >
                  <Bot className="w-3.5 h-3.5" style={{ color: '#FEFAE0' }} />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1"
                  style={{
                    background: 'var(--surface)',
                    boxShadow: '0 1px 4px rgba(40,54,24,0.06)',
                  }}
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--text-muted)' }} />
                  <span className="font-sora text-xs" style={{ color: 'var(--text-muted)' }}>
                    Thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="px-4 py-3 shrink-0 flex items-center gap-2"
            style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 font-sora text-sm px-4 py-2.5 rounded-full outline-none"
              style={{
                background: 'var(--bg)',
                color: 'var(--text-main)',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || chatMutation.isPending}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40"
              style={{ background: 'var(--primary)' }}
            >
              <Send className="w-4 h-4" style={{ color: '#FEFAE0' }} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg"
        style={{
          background: 'var(--primary)',
          boxShadow: '0 4px 20px rgba(188, 108, 37, 0.3)',
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6" style={{ color: '#FEFAE0' }} />
        ) : (
          <Leaf className="w-6 h-6" style={{ color: '#FEFAE0' }} />
        )}
      </button>
    </div>
  )
}
