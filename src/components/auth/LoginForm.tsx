// src/components/auth/LoginForm.tsx
import React, { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import { useRouter } from 'next/navigation'
import useAuth from '@hooks/useAuth'

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login({ email, password })
    router.push('/dashboard') // Redirect on success
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        fullWidth
        className="mb-4"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        fullWidth
        className="mb-4"
      />
      <Button type="submit" fullWidth>
        Login
      </Button>
    </form>
  )
}

export default LoginForm
