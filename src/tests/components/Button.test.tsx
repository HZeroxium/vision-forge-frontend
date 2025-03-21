// tests/components/Button.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '@components/common/Button'
import { describe, it, expect, jest } from '@jest/globals'

describe('Button Component', () => {
  it('renders with text and handles click', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)
    const buttonElement = screen.getByText(/Click Me/i)
    fireEvent.click(buttonElement)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
