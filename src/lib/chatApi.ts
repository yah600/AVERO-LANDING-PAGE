type ChatRole = 'assistant' | 'user'

interface ChatRequestMessage {
  role: ChatRole
  text: string
}

interface RequestChatReplyOptions {
  question: string
  history: ChatRequestMessage[]
  signal?: AbortSignal
  timeoutMs?: number
}

const CHAT_ENDPOINT = (import.meta.env.VITE_AVA_CHAT_ENDPOINT as string | undefined)?.trim() ?? ''
const DEFAULT_TIMEOUT_MS = 8_000

function normalizeText(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => {
        if (typeof item === 'string') return item.trim()
        if (item && typeof item === 'object') {
          const text = (item as Record<string, unknown>).text
          return typeof text === 'string' ? text.trim() : ''
        }
        return ''
      })
      .filter((item) => item.length > 0)

    return parts.length > 0 ? parts.join('\n') : null
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return normalizeText(record.text) ?? normalizeText(record.content)
  }

  return null
}

function parseReply(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null
  const record = payload as Record<string, unknown>

  const directReply =
    normalizeText(record.reply) ??
    normalizeText(record.answer) ??
    normalizeText(record.message) ??
    normalizeText(record.text) ??
    normalizeText(record.content)

  if (directReply) return directReply

  const choices = record.choices
  if (!Array.isArray(choices) || choices.length === 0) return null

  const firstChoice = choices[0]
  if (!firstChoice || typeof firstChoice !== 'object') return null
  const choiceRecord = firstChoice as Record<string, unknown>

  return normalizeText(choiceRecord.text) ?? normalizeText(choiceRecord.message)
}

export function isChatApiConfigured() {
  return CHAT_ENDPOINT.length > 0
}

export async function requestChatReply({
  question,
  history,
  signal,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: RequestChatReplyOptions): Promise<string | null> {
  if (!isChatApiConfigured()) return null

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)
  const relayAbort = () => controller.abort()

  if (signal) {
    if (signal.aborted) {
      controller.abort()
    } else {
      signal.addEventListener('abort', relayAbort, { once: true })
    }
  }

  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: question,
        messages: history.map((entry) => ({ role: entry.role, content: entry.text })),
        source: 'avero_landing_ava',
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Chat API request failed with status ${response.status}`)
    }

    const payload = (await response.json()) as unknown
    return parseReply(payload)
  } finally {
    window.clearTimeout(timeoutId)
    if (signal) {
      signal.removeEventListener('abort', relayAbort)
    }
  }
}
