// src/components/auth/OAuthButtons.tsx
'use client'
import React from 'react'
import Button from '../common/Button'

const OAuthButtons: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2">
      <Button
        onClick={() => {
          /* <TODO> Implement Google OAuth */
        }}
      >
        Login with Google
      </Button>
      <Button
        onClick={() => {
          /* <TODO> Implement GitHub OAuth */
        }}
      >
        Login with GitHub
      </Button>
    </div>
  )
}

export default OAuthButtons
