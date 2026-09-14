import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useState, type FormEvent } from 'react'
import { useLogin } from '../hooks/useLogin'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLogin()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="martin@autolincoln.com"
      />
      <Input
        label="Пароль"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="••••••••"
      />

      {loginMutation.isError && (
        <p className="text-sm text-red-600">
          Не вдалося увійти. Перевірте email і пароль.
        </p>
      )}

      <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
        Увійти
      </Button>
    </form>
  )
}
