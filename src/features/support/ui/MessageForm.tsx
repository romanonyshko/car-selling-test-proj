import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useState, type ChangeEvent } from 'react'

interface MessageFormProps {
  onSend: (text: string) => void
  disabled: boolean
}

export function MessageForm({ onSend, disabled }: MessageFormProps) {
  const [text, setText] = useState('')

  const handleChangeText = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <form onSubmit={(event) => {
      event.preventDefault()
      onSend(text)
      setText('')
     }}
      className="flex gap-3 border-t border-line p-5">
      <div className="flex-1">
        <Input
          value={text}
          onChange={handleChangeText}
          aria-label="Message"
          placeholder="Write a message…"
          maxLength={1000}
          autoComplete="off"
        />
      </div>

      <Button disabled={disabled || !text.trim()} type="submit">Send</Button>
    </form>
  )
}
