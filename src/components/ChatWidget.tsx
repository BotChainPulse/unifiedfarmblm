import { useState, useRef, useEffect } from 'react'
import { Leaf, X, Send, Loader2, Bot, User } from 'lucide-react'
import { isStaticHost } from '@/providers/trpc'

function generateSessionId() {
  return 'session_' + Math.random().toString(36).substring(2, 15)
}

const SUGGESTED_PROMPTS = [
  'What are your egg prices?',
  'How do I order?',
  'Tell me about day-old chicks',
]

// Local response database — works entirely client-side
const RESPONSE_DB: { keywords: string[]; response: string }[] = [
  {
    keywords: ['price', 'prices', 'cost', 'how much', 'egg', 'eggs', 'tray'],
    response: 'Our fresh organic eggs are UGX 15,000 per tray. Day-old chicks are UGX 3,500 each, brooded chicks (1 month) are UGX 12,000 each, and mature layers are UGX 35,000 each. We also have organic chicken manure at UGX 50,000 per ton.',
  },
  {
    keywords: ['order', 'buy', 'purchase', 'how do i order', 'how to order', 'get'],
    response: 'You can order directly through WhatsApp by clicking the "Order via WhatsApp" button, or use the "Submit Order" button on any product. You can also call us at +256 708 813 419 or email ryglutwa0@gmail.com.',
  },
  {
    keywords: ['chick', 'chicks', 'day-old', 'day old', 'brooded', 'layer', 'layers', 'broiler'],
    response: 'We sell vaccinated day-old chicks (UGX 3,500 each), brooded chicks at 1 month old (UGX 12,000 each), and mature point-of-lay hens (UGX 35,000 each). All chicks are raised under strict biosecurity protocols with proper vaccinations.',
  },
  {
    keywords: ['consult', 'consultation', 'advice', 'help', 'guidance', 'farm', 'farming', 'poultry'],
    response: 'We offer farm consultation services covering poultry housing design, feeding programs, disease prevention, and business planning. Contact us at +256 708 813 419 or ryglutwa0@gmail.com to schedule a consultation.',
  },
  {
    keywords: ['location', 'where', 'find', 'mpigi', 'address', 'visit', 'direction'],
    response: 'We are located in Mpigi District, Central Region, Uganda. You are welcome to visit our farm to see our operations firsthand! Call +256 708 813 419 to arrange a visit.',
  },
  {
    keywords: ['contact', 'phone', 'email', 'call', 'reach', 'whatsapp'],
    response: 'You can reach us at:\nPhone: +256 708 813 419\nEmail: ryglutwa0@gmail.com\nWhatsApp: Click any "Order via WhatsApp" button on our site.',
  },
  {
    keywords: ['manure', 'fertilizer', 'organic'],
    response: 'Our organic chicken manure is rich in nitrogen, phosphorus, and potassium. It is composted and ready for immediate use in gardens and farms. Price: UGX 50,000 per ton.',
  },
  {
    keywords: ['hour', 'open', 'time', 'when', 'available'],
    response: 'Our farm operates daily. For visits or consultations, please call +256 708 813 419 in advance to schedule. We are always available on WhatsApp for orders and inquiries.',
  },
  {
    keywords: ['delivery', 'deliver', 'shipping', 'transport'],
    response: 'Delivery options depend on your location in Uganda. Please contact us on WhatsApp at +256 708 813 419 to discuss delivery arrangements for your order.',
  },
  {
    keywords: ['payment', 'pay', 'mobile money', 'airtel', 'mtn'],
    response: 'We accept payments via Mobile Money (Airtel Money & MTN MoMo) and cash. Contact us on WhatsApp at +256 708 813 419 for payment details when placing your order.',
  },
  {
    keywords: ['vaccine', 'vaccination', 'healthy', 'disease', 'biosecurity'],
    response: 'All our chicks and layers receive proper vaccinations and health checks before leaving our farm. We follow strict biosecurity protocols to ensure healthy, happy birds.',
  },
  {
    keywords: ['shambani', 'marketplace', 'market', 'buy online'],
    response: 'Check out ShambaNi Marketplace at shambani-market.africa — East Africa\'s farmers marketplace for buying and selling agricultural products across borders!',
  },
]

function findLocalResponse(input: string): string | null {
  const lower = input.toLowerCase()
  for (const item of RESPONSE_DB) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.response
    }
  }
  return null
}

function getFallbackResponse(): string {
  return "I'm not sure about that. For more help, please WhatsApp us at +256 708 813 419 or email ryglutwa0@gmail.com — we're happy to assist!"
}

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
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`chat_history_${sessionId}`)
      if (saved) {
        setMessages(JSON.parse(saved))
      }
    } catch {
      // ignore parse errors
    }
  }, [sessionId])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_history_${sessionId}`, JSON.stringify(messages))
    }
  }, [messages, sessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const processMessage = (userMsg: string) => {
    setIsThinking(true)
    // Simulate a brief thinking delay for natural feel
    setTimeout(() => {
      const reply = findLocalResponse(userMsg) || getFallbackResponse()
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      setIsThinking(false)
    }, 600 + Math.random() * 400)
  }

  const handleSend = () => {
    if (!message.trim() || isThinking) return
    const userMsg = message.trim()
    setMessage('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    processMessage(userMsg)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePromptClick = (prompt: string) => {
    if (isThinking) return
    setMessages((prev) => [...prev, { role: 'user', content: prompt }])
    processMessage(prompt)
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
                      onClick={() => handlePromptClick(prompt)}
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
                  className="max-w-[75%] px-3.5 py-2.5 rounded-2xl font-serif text-sm leading-relaxed whitespace-pre-line"
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
                        ? '0 1px 4px rgba(40, 54, 24, 0.06)'
                        : 'none',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isThinking && (
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
              disabled={!message.trim() || isThinking}
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
