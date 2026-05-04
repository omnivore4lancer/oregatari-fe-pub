import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

describe('Button', () => {
  it('children を表示する', () => {
    render(<Button>クリック</Button>)
    expect(screen.getByRole('button', { name: 'クリック' })).toBeInTheDocument()
  })

  it('type="button" が設定されている', () => {
    render(<Button>送信</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('onClick が呼ばれる', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>クリック</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('disabled のとき onClick が呼ばれない', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        送信
      </Button>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('disabled のとき cursor-not-allowed クラスを持つ', () => {
    render(<Button disabled>送信</Button>)
    expect(screen.getByRole('button')).toHaveClass('disabled:cursor-not-allowed')
  })

  it('variant=primary のとき gradient クラスを持つ', () => {
    render(<Button variant="primary">送信</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-br')
  })

  it('variant 未指定（secondary）のとき border クラスを持つ', () => {
    render(<Button>キャンセル</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('className を追加できる', () => {
    render(<Button className="w-full">送信</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })
})
