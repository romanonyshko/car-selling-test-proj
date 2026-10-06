# Support chat

Specification for the support chat on `/support` (`src/pages/support/`) and
the `features/support/` feature. Read before any work on either.

## Current implementation status

Checked against the code on 2026-10-05.

| Part | Status | Notes |
| --- | --- | --- |
| WebSocket connection | Implemented | `WS_URL` + `WS_ROUTES.chat`, session cookie sent with the handshake |
| Sending, optimistic messages | Implemented | `pending` → `sent` / `failed` |
| Server replies | Echo | the Nest API sends the user's text back as a `support` message |
| Connection status + close reason | Implemented | badge in the header, notice for `4401` / `4403` / `1006` |
| Auto-scroll | Implemented | on every new message |
| Message history | Not implemented | the list is empty after a reload (open question #14) |
| Reconnect | Not implemented | a closed socket stays closed until a reload (open question #14) |
| Empty state | Not implemented | an empty list shows nothing |

## 1. Contract (`@auto-lincoln/contracts`, `chat/messages.ts`)

Described in `auto-lincoln-contracts/README.md`. In short:

| Direction | Event |
| --- | --- |
| client → server | `{ type: 'message:send', clientId, text }` — `clientId` is a uuid made by the client, `text` 1–1000 chars after `trim` |
| server → client | `{ type: 'message:new', message: ChatMessage }` |
| server → client | `{ type: 'error', code: 'INVALID_JSON' \| 'VALIDATION_ERROR', message, clientId? }` |

`ChatMessage` = `{ id, clientId?, author: 'user' | 'support', text, sentAt }`.

Close codes sent by the Nest gateway (`chat.gateway.ts`); they are not in
the contract yet (open question #13):

| Code | Meaning |
| --- | --- |
| `4401` | no session or the session is invalid |
| `4403` | `Origin` does not match `CORS_ORIGIN` |
| `1006` | set by the browser — the connection dropped (API down) |

## 2. Files and responsibilities

```
lib/apiClient.ts        WS_URL (API_URL with http → ws)
features/support/
├── api/chatSocket.ts        connectChat({ onOpen, onEvent, onClose }) → { send, close }
├── model/chatReducer.ts     ChatState, ChatAction, chatReducer — pure, no React
├── hooks/useSupportChat.ts  useReducer + socket in a ref → { messages, connectionStatus, closeCode, sendMessage }
└── ui/
    ├── SupportChat.tsx       calls the hook, passes data down
    ├── ConnectionBadge.tsx   dot + "Connecting… / Online / Disconnected"
    ├── ConnectionNotice.tsx  close reason by closeCode, nothing while null
    ├── MessageList.tsx       scrollable list, auto-scroll on new messages
    ├── MessageBubble.tsx     one message: author side/colour, status or error
    └── MessageForm.tsx       controlled input + submit, disabled unless open
pages/support/SupportPage.tsx  PageHeader + <SupportChat />
```

- Only `api/chatSocket.ts` touches `WebSocket`. The hook knows the socket
  only as `{ send, close }`; the UI knows neither.
- `chatSocket.close()` detaches the handlers before closing, so a socket
  closed by the cleanup never dispatches into an unmounted component
  (relevant under StrictMode, which mounts effects twice in dev).

## 3. State

The chat is a stream, not request/response, so it does **not** use
TanStack Query. The state lives in `useReducer` inside `useSupportChat` — a
deliberate exception to "server state — TanStack Query only".

```ts
type ConnectionStatus = 'connecting' | 'open' | 'closed'
type MessageStatus    = 'pending' | 'sent' | 'failed'

interface ChatState {
  connectionStatus: ConnectionStatus
  socketClosureCode: number | null
  messages: ChatItem[]  // ChatMessage + status, error?
}
```

### Actions

| Action | Dispatched by | Effect |
| --- | --- | --- |
| `connection/open` | `onOpen` | status `open`, close code reset to `null` |
| `connection/closed` | `onClose` | status `closed`, close code stored |
| `message/sent` | `sendMessage` | appends the user's message, `pending`, `id = clientId` |
| `server/event` | `onEvent` | see below |

### `server/event`

| Incoming | Matching `clientId` in the list? | Result |
| --- | --- | --- |
| `message:new`, `author: 'support'` | yes | the user's message → `sent` **and** the reply is appended (without `clientId`) |
| `message:new`, `author: 'user'` | yes | confirmation: the user's message gets the server `id` / `sentAt`, → `sent` |
| `message:new` | no | appended as a new message (e.g. the greeting) |
| `error` with `clientId` | — | that message → `failed`, `error` = server message |
| `error` without `clientId` | — | ignored |

The first row exists because the echo reply carries the `clientId` of the
message it answers: it is the confirmation and the reply at once. The reply
is appended without `clientId` so a later event with the same `clientId`
cannot match two items. See open question #12.

## 4. Sending

`sendMessage(text)` returns nothing; the outcome shows up in `messages`.

1. Returns early unless `connectionStatus === 'open'`, or when the text is
   blank.
2. Generates `clientId` (`crypto.randomUUID()`) and `sentAt` (ISO).
3. Dispatches `message/sent` **before** `send`, so the confirmation always
   finds the message.
4. Sends `{ type: 'message:send', clientId, text }`.

The form is disabled while the socket is not open, so a message is never
sent into a closed socket; there is no `message/failed` action for that
case.

## 5. UI

Card `bg-surface shadow-card-1`, 600px tall: header (title + badge) → close
notice → message list (`flex-1`, own scroll) → form (`Input` + `Button`).
User messages are on the right in `bg-accent`, support messages on the left
in `bg-field`; under each bubble the status (`Sending…`, `Sent`,
`Not sent`) or the server error in `text-danger`. No new tokens.

## 6. Known limitations

- A message that is `pending` when the socket closes stays `pending`
  forever (open question #14).
- Auto-scroll also fires when the user has scrolled up to read older
  messages.
- No history, no reconnect, no unread indicator.
