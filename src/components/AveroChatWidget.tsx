import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Send, X } from 'lucide-react'
import LiquidIconLogo from './branding/LiquidIconLogo'
import { trackEvent } from '../lib/analytics'
import { isChatApiConfigured, requestChatReply } from '../lib/chatApi'

type ChatRole = 'assistant' | 'user'

interface ChatMessage {
  id: number
  role: ChatRole
  text: string
}

const quickPrompts = [
  'What is Avero in one sentence?',
  'Which marketing workflows can Avero run?',
  'How does Avero reduce compliance risk?',
  'How do I get access?',
]

const MIN_REPLY_DELAY_MS = 220
const chatApiConfigured = isChatApiConfigured()

function buildReply(input: string) {
  const query = input.toLowerCase()

  if (query.includes('what is') || query.includes('avero')) {
    return 'Avero is an all-in-one marketing command center where teams run execution, integrations, analytics, and compliance control in one platform.'
  }

  if (
    query.includes('feature') ||
    query.includes('workflow') ||
    query.includes('module') ||
    query.includes('tool')
  ) {
    return 'Avero covers campaign operations, analytics and attribution, lead quality, CRM and pipeline alignment, lifecycle execution, integration control, and pre-launch compliance checks through SYN Engine.'
  }

  if (
    query.includes('integration') ||
    query.includes('connect') ||
    query.includes('meta') ||
    query.includes('google') ||
    query.includes('tiktok')
  ) {
    return 'Avero supports a replace-plus-connect model: move key workflows into Avero while connecting systems you keep, so your team still operates from one decision layer.'
  }

  if (
    query.includes('compliance') ||
    query.includes('risk') ||
    query.includes('fine') ||
    query.includes('regulation')
  ) {
    return 'Avero uses SYN Engine, powered by Synergair, to run pre-launch compliance checks so teams can catch avoidable issues before campaigns go live.'
  }

  if (
    query.includes('price') ||
    query.includes('pricing') ||
    query.includes('plan') ||
    query.includes('cost')
  ) {
    return 'Avero offers Starter, Growth, and Scale plans. Final pricing and billing are selected during account provisioning.'
  }

  if (
    query.includes('login') ||
    query.includes('sign up') ||
    query.includes('signup') ||
    query.includes('access') ||
    query.includes('trial')
  ) {
    return 'Use “Get Access” to start onboarding, or “Log In” if you already have an account. I can also walk you through what to expect in signup.'
  }

  if (query.includes('who') || query.includes('buyer') || query.includes('team')) {
    return 'Avero is built for founders, CMOs, Heads of Growth, marketing operations, and execution teams that need one system to run everything marketing.'
  }

  return 'I can help with Avero features, integrations, compliance, pricing structure, and onboarding. Ask me one of those and I will answer directly.'
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hi, I am Ava. Ask me anything about features, integrations, compliance, or getting access.',
  },
]

export default function AveroChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const nextIdRef = useRef(2)
  const messagesRef = useRef<HTMLDivElement | null>(null)
  const requestRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!open) return
    trackEvent('chat_widget_open', { source: 'floating_chat' })
  }, [open])

  useEffect(() => {
    if (!open) return
    const el = messagesRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, open, isTyping])

  useEffect(() => {
    return () => {
      requestRef.current?.abort()
    }
  }, [])

  const submitQuestion = async (question: string) => {
    const trimmed = question.trim()
    if (!trimmed || isTyping) return

    const userMessage: ChatMessage = {
      id: nextIdRef.current,
      role: 'user',
      text: trimmed,
    }
    nextIdRef.current += 1

    const historyWithQuestion = [...messages, userMessage]
    const fallbackReply = buildReply(trimmed)
    const abortController = new AbortController()
    requestRef.current = abortController

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    trackEvent('chat_widget_question', {
      source: 'floating_chat',
      question_length: trimmed.length,
      chat_api_enabled: chatApiConfigured,
    })

    try {
      const [apiReply] = await Promise.all([
        requestChatReply({
          question: trimmed,
          history: historyWithQuestion.map((entry) => ({ role: entry.role, text: entry.text })),
          signal: abortController.signal,
        }),
        new Promise<void>((resolve) => {
          window.setTimeout(resolve, MIN_REPLY_DELAY_MS)
        }),
      ])

      if (abortController.signal.aborted) return

      const reply = apiReply ?? fallbackReply
      const assistantMessage: ChatMessage = {
        id: nextIdRef.current,
        role: 'assistant',
        text: reply,
      }
      nextIdRef.current += 1

      setMessages((prev) => [...prev, assistantMessage])
      trackEvent('chat_widget_reply', {
        source: 'floating_chat',
        reply_source: apiReply ? 'api' : 'fallback',
      })
    } catch (error) {
      if (abortController.signal.aborted) return

      const assistantMessage: ChatMessage = {
        id: nextIdRef.current,
        role: 'assistant',
        text: fallbackReply,
      }
      nextIdRef.current += 1
      setMessages((prev) => [...prev, assistantMessage])

      trackEvent('chat_widget_reply', {
        source: 'floating_chat',
        reply_source: 'fallback_error',
      })
      trackEvent('chat_widget_error', {
        source: 'floating_chat',
        error: error instanceof Error ? error.message : 'unknown_error',
      })
    } finally {
      if (requestRef.current === abortController) {
        requestRef.current = null
      }
      if (!abortController.signal.aborted) {
        setIsTyping(false)
      }
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submitQuestion(input)
  }

  return (
    <div className={open ? 'chat-widget-root is-open' : 'chat-widget-root'}>
      {open ? (
        <section className="chat-panel" aria-label="Ava chat assistant">
          <header className="chat-panel-header">
            <div className="chat-panel-brand">
              <LiquidIconLogo size={26} className="chat-panel-logo" />
              <div>
                <p>Ava</p>
                <span>Ask a question</span>
              </div>
            </div>
            <button
              type="button"
              className="chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </header>

          <div className="chat-messages" ref={messagesRef}>
            {messages.map((message) => (
              <article
                key={message.id}
                className={
                  message.role === 'user' ? 'chat-message chat-message-user' : 'chat-message chat-message-assistant'
                }
              >
                {message.text}
              </article>
            ))}
            {isTyping ? <div className="chat-typing">Typing...</div> : null}
          </div>

          {messages.length <= 2 ? (
            <div className="chat-quick-prompts">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="chat-prompt"
                  onClick={() => void submitQuestion(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}

          <form className="chat-input-row" onSubmit={onSubmit}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your question..."
              aria-label="Ask a question"
              maxLength={220}
            />
            <button type="submit" aria-label="Send message" disabled={isTyping || input.trim().length === 0}>
              <Send size={15} />
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="chat-launcher"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? 'Close Ava chat' : 'Open Ava chat'}
      >
        <LiquidIconLogo size={34} className="chat-launcher-logo" />
      </button>
    </div>
  )
}
