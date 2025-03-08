// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import useAuth from '@hooks/useAuth'

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Additional fields as needed
  const {
    /*register*/
  } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // <TODO>: Call registration API
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
        Register
      </Button>
    </form>
  )
}

export default RegisterForm
