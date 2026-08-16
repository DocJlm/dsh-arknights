import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context, type Fiber } from '@deepseek-ai/cordis'
import { apply } from '../src/client/index.ts'
import { THEME_CSS } from '../src/client/style.ts'

let fibers: Fiber[] = []

async function mount(): Promise<Fiber> {
  const fiber = new Context().plugin({ apply })
  await fiber.await()
  fibers.push(fiber)
  return fiber
}

async function flushMutations(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 0))
}

afterEach(async () => {
  for (const fiber of fibers.reverse()) await fiber.dispose()
  fibers = []
  document.head.innerHTML = ''
  document.body.innerHTML = ''
  document.body.removeAttribute('style')
  document.body.removeAttribute('data-ds-dark-theme')
  document.title = ''
  delete window.__dshArknightsActivation
  vi.unstubAllGlobals()
})

describe('dsh-arknights skin lifecycle', () => {
  it('declares the scoped body state and required owned layers', async () => {
    await mount()
    expect(document.body.hasAttribute('data-dsh-arknights')).toBe(true)
    expect(document.querySelectorAll("[data-arknights-owner='dsh-arknights']").length).toBeGreaterThanOrEqual(3)
    expect(document.querySelectorAll('[data-arknights-character]')).toHaveLength(2)
  })

  it('replaces the hero welcome text and restores it on dispose', async () => {
    document.body.innerHTML = '<main data-phase="hero"><span class="fixture_headlineText">Into the Unknown</span></main>'
    const fiber = await mount()
    expect(document.querySelector('.fixture_headlineText')?.textContent).toBe('欢迎回家，博士！')
    await fiber.dispose()
    fibers = fibers.filter(item => item !== fiber)
    expect(document.querySelector('.fixture_headlineText')?.textContent).toBe('Into the Unknown')
  })

  it('tracks hero and active phases mounted after activation', async () => {
    await mount()
    document.body.insertAdjacentHTML('beforeend', '<main data-phase="hero"><span class="fixture_headlineText">Into the Unknown</span></main>')
    await flushMutations()
    expect(document.body.dataset.arknightsPhase).toBe('hero')
    const phase = document.querySelector<HTMLElement>('[data-phase]')!
    phase.dataset.phase = 'active'
    await flushMutations()
    expect(document.body.dataset.arknightsPhase).toBe('active')
    expect(phase.querySelector('.fixture_headlineText')?.textContent).toBe('Into the Unknown')
  })

  it('switches the embedded background with the DSH dark-theme attribute', async () => {
    await mount()
    const light = document.body.style.getPropertyValue('--ark-hero-background')
    document.body.setAttribute('data-ds-dark-theme', '')
    await flushMutations()
    const dark = document.body.style.getPropertyValue('--ark-hero-background')
    expect(light).not.toBe(dark)
    expect(dark).toContain('data:image')
  })

  it('marks a remounted native sidebar without adding custom decorations', async () => {
    await mount()
    document.body.insertAdjacentHTML('beforeend', '<aside data-pane="sidebar"><div></div></aside>')
    await flushMutations()
    expect(document.querySelector('[data-arknights-sidebar-root]')).not.toBeNull()
    expect(document.querySelectorAll("[data-arknights-chrome='sidebar-mascot']")).toHaveLength(0)
    expect(document.querySelectorAll("[data-arknights-chrome='sidebar-frame']")).toHaveLength(0)
    expect(document.querySelectorAll("[data-arknights-chrome='sidebar-swag']")).toHaveLength(0)
    document.querySelector('[data-pane="sidebar"]')?.append(document.createElement('span'))
    await flushMutations()
    expect(document.querySelectorAll('[data-arknights-sidebar-root]')).toHaveLength(1)
  })

  it('preserves native session markup and removes only sidebar hooks on dispose', async () => {
    document.body.innerHTML = `
      <aside data-pane="sidebar"><div>
        <div role="tree">
          <div><button role="treeitem" aria-expanded="true">Workspace</button></div>
          <button role="treeitem" aria-selected="true">Session</button>
        </div>
      </div></aside>`
    const fiber = await mount()
    expect(document.querySelector('[data-arknights-sidebar-root]')).not.toBeNull()
    expect(document.querySelector('[data-arknights-workspace-row]')).toBeNull()
    expect(document.querySelector('[data-arknights-session-row]')).toBeNull()
    await fiber.dispose()
    fibers = fibers.filter(item => item !== fiber)
    expect(document.querySelector('[data-arknights-sidebar-root]')).toBeNull()
  })

  it('does not inject a favicon and leaves the DSH favicon untouched', async () => {
    document.head.innerHTML = '<link id="dsh-favicon" rel="icon" href="/favicon.ico">'
    const fiber = await mount()
    expect(document.querySelectorAll("[data-arknights-chrome='favicon']")).toHaveLength(0)
    expect(document.querySelector<HTMLLinkElement>('#dsh-favicon')?.href).toContain('/favicon.ico')
    await fiber.dispose()
    fibers = fibers.filter(item => item !== fiber)
    expect(document.querySelector<HTMLLinkElement>('#dsh-favicon')?.href).toContain('/favicon.ico')
  })

  it('keeps repeated activation idempotent and leaves the first owner active', async () => {
    const first = await mount()
    const before = document.querySelectorAll("[data-arknights-owner='dsh-arknights']").length
    const second = await mount()
    expect(document.querySelectorAll("[data-arknights-owner='dsh-arknights']")).toHaveLength(before)
    await second.dispose()
    fibers = fibers.filter(item => item !== second)
    expect(document.body.hasAttribute('data-dsh-arknights')).toBe(true)
    await first.dispose()
    fibers = fibers.filter(item => item !== first)
    expect(document.body.hasAttribute('data-dsh-arknights')).toBe(false)
  })

  it('restores title, theme color, inline variables, nodes and activation state', async () => {
    document.title = 'DeepSeek Harness'
    document.body.style.setProperty('--ark-sidebar-width', '17px')
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = '#ffffff'
    document.head.append(meta)
    const fiber = await mount()
    expect(document.title).toContain('dsh-arknights')
    expect(meta.content).toBe('#78c8e8')
    await fiber.dispose()
    fibers = fibers.filter(item => item !== fiber)
    expect(document.title).toBe('DeepSeek Harness')
    expect(meta.content).toBe('#ffffff')
    expect(document.body.style.getPropertyValue('--ark-sidebar-width')).toBe('17px')
    expect(document.querySelector("[data-arknights-owner='dsh-arknights']")).toBeNull()
    expect(window.__dshArknightsActivation).toBeUndefined()
  })

  it('disconnects the sidebar ResizeObserver during disposal', async () => {
    const observe = vi.fn()
    const unobserve = vi.fn()
    const disconnect = vi.fn()
    class ResizeObserverFixture {
      observe = observe
      unobserve = unobserve
      disconnect = disconnect
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverFixture)
    document.body.innerHTML = '<aside data-pane="sidebar"><div></div></aside>'
    const fiber = await mount()
    expect(observe).toHaveBeenCalledOnce()
    await fiber.dispose()
    fibers = fibers.filter(item => item !== fiber)
    expect(disconnect).toHaveBeenCalledOnce()
  })

  it('includes narrow-screen and motion safeguards while leaving sidebar surfaces native', () => {
    expect(THEME_CSS).toContain('@media (max-width: 1024px)')
    expect(THEME_CSS).toContain('@media (prefers-reduced-motion: reduce)')
    expect(THEME_CSS).toContain('pointer-events: none')
    expect(THEME_CSS).not.toContain('[data-arknights-sidebar-root]')
    expect(THEME_CSS).not.toContain('[data-arknights-sidebar-footer]')
  })
})
