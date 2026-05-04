import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Field } from './Field'

describe('Field', () => {
  it('label が表示される', () => {
    render(<Field label="名前"><input /></Field>)
    expect(screen.getByText('名前')).toBeInTheDocument()
  })

  it('required=true のとき * が表示される', () => {
    render(<Field label="名前" required={true}><input /></Field>)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('required 未指定のとき * が表示されない', () => {
    render(<Field label="名前"><input /></Field>)
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('children が描画される', () => {
    render(<Field label="名前"><input data-testid="field-input" /></Field>)
    expect(screen.getByTestId('field-input')).toBeInTheDocument()
  })
})
