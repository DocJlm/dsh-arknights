import type { Context } from '@deepseek-ai/cordis'
import {
  ARKNIGHTS_BACKGROUND_DARK,
  ARKNIGHTS_BACKGROUND_LIGHT,
  ARKNIGHTS_CHARACTER_LEFT,
  ARKNIGHTS_CHARACTER_RIGHT,
} from './art.generated.ts'
import { THEME_CSS } from './style.ts'

const OWNER = 'dsh-arknights'
const SKIN_TITLE = 'dsh-arknights · DeepSeek Harness'
const WELCOME_TEXT = '欢迎回家，博士！'
const SIDEBAR_SELECTOR = ":is([data-pane='sidebar'], [class*='sidebarCol'])"
const BODY_PROPERTIES = ['--ark-hero-background', '--ark-empty-background', '--ark-sidebar-width'] as const
const PROJECTED_ATTRIBUTES = [
  'data-arknights-sidebar-root',
  'data-arknights-sidebar-footer',
] as const

interface ActivationState {
  cleanup: () => void
}

declare global {
  interface Window {
    __dshArknightsActivation?: ActivationState
  }
}

function owned<T extends HTMLElement>(element: T, chrome: string): T {
  element.dataset.arknightsOwner = OWNER
  element.dataset.arknightsChrome = chrome
  element.setAttribute('aria-hidden', 'true')
  return element
}

function createImage(src: string, role: string): HTMLImageElement {
  const image = document.createElement('img')
  image.src = src
  image.alt = ''
  image.dataset.arknightsCharacter = role
  image.draggable = false
  return image
}

/** Apply the presentation-only browser skin. */
export function apply(ctx: Context): void {
  if (window.__dshArknightsActivation !== undefined) {
    ctx.effect(() => () => {}, 'ui-skin-arknights: already active')
    return
  }

  const body = document.body
  let officialTitle = document.title
  const previousProperties = new Map<string, string>()
  for (const property of BODY_PROPERTIES) previousProperties.set(property, body.style.getPropertyValue(property))

  const ownedNodes = new Set<HTMLElement>()
  const decoratedElements = new Set<HTMLElement>()
  const welcomeOriginals = new Map<HTMLElement, string>()
  let observer: MutationObserver | undefined
  let resizeObserver: ResizeObserver | undefined
  let observedSidebar: HTMLElement | undefined
  let themeMeta: HTMLMetaElement | null = null
  let officialThemeColor: string | undefined
  let themeColorOverridden = false
  let homeActive = false
  let disposed = false

  const restoreBodyProperties = (): void => {
    for (const [property, value] of previousProperties) {
      if (value === '') body.style.removeProperty(property)
      else body.style.setProperty(property, value)
    }
  }

  const clearProjectedAttributes = (): void => {
    for (const element of decoratedElements) {
      for (const attribute of PROJECTED_ATTRIBUTES) element.removeAttribute(attribute)
    }
    decoratedElements.clear()
  }

  const stopSidebarProjection = (): void => {
    if (resizeObserver !== undefined && observedSidebar !== undefined) resizeObserver.unobserve(observedSidebar)
    observedSidebar = undefined
    clearProjectedAttributes()
    delete body.dataset.arknightsSidebarSize
  }

  const restoreWelcome = (): void => {
    welcomeOriginals.forEach((text, element) => {
      if (element.isConnected && element.textContent === WELCOME_TEXT) element.textContent = text
    })
  }

  const restoreOfficialChrome = (): void => {
    if (
      themeColorOverridden
      && themeMeta?.isConnected
      && (themeMeta.content === '#78c8e8' || themeMeta.content === '#071936')
    ) {
      themeMeta.content = officialThemeColor ?? ''
    }
    themeMeta = null
    officialThemeColor = undefined
    themeColorOverridden = false
    if (document.title === SKIN_TITLE) document.title = officialTitle
  }

  const cleanup = (): void => {
    if (disposed) return
    disposed = true
    observer?.disconnect()
    resizeObserver?.disconnect()
    homeActive = false
    delete body.dataset.arknightsHome
    restoreWelcome()
    stopSidebarProjection()
    restoreOfficialChrome()
    ownedNodes.forEach(node => node.remove())
    delete body.dataset.dshArknights
    delete body.dataset.arknightsPhase
    delete body.dataset.arknightsSidebarSize
    restoreBodyProperties()
    if (window.__dshArknightsActivation?.cleanup === cleanup) delete window.__dshArknightsActivation
  }

  window.__dshArknightsActivation = { cleanup }
  ctx.effect(() => cleanup, 'ui-skin-arknights: astral garden presentation layer')

  const style = owned(document.createElement('style'), 'style')
  style.textContent = THEME_CSS
  ownedNodes.add(style)
  document.head.append(style)

  const backdrop = owned(document.createElement('div'), 'backdrop')
  ownedNodes.add(backdrop)
  body.prepend(backdrop)

  const stage = owned(document.createElement('div'), 'character-stage')
  stage.append(createImage(ARKNIGHTS_CHARACTER_LEFT, 'left'), createImage(ARKNIGHTS_CHARACTER_RIGHT, 'right'))
  ownedNodes.add(stage)
  body.prepend(stage)

  const syncTheme = (): void => {
    if (!homeActive) return
    const dark = body.hasAttribute('data-ds-dark-theme')
    const background = dark ? ARKNIGHTS_BACKGROUND_DARK : ARKNIGHTS_BACKGROUND_LIGHT
    body.style.setProperty('--ark-hero-background', `url(${background})`)
    body.style.setProperty('--ark-empty-background', `url(${background})`)
    const meta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (meta !== null) {
      if (themeMeta !== meta || !themeColorOverridden) {
        themeMeta = meta
        officialThemeColor = meta.content
        themeColorOverridden = true
      }
      meta.content = dark ? '#071936' : '#78c8e8'
    }
  }

  const syncWelcome = (): void => {
    const current = document.querySelector<HTMLElement>("[data-phase='hero'] [class*='headlineText']")
    for (const [element, text] of welcomeOriginals) {
      if (element !== current && element.isConnected && element.textContent === WELCOME_TEXT) element.textContent = text
    }
    if (current !== null) {
      if (!welcomeOriginals.has(current)) welcomeOriginals.set(current, current.textContent ?? '')
      if (current.textContent !== WELCOME_TEXT) current.textContent = WELCOME_TEXT
    }
  }

  const setSidebarWidth = (width: number): void => {
    if (width <= 0) return
    body.style.setProperty('--ark-sidebar-width', `${Math.round(width * 100) / 100}px`)
    body.dataset.arknightsSidebarSize = width <= 120 ? 'rail' : width <= 220 ? 'narrow' : 'wide'
  }

  const decorateSidebar = (): void => {
    if (!homeActive) return
    clearProjectedAttributes()
    const sidebar = document.querySelector<HTMLElement>(SIDEBAR_SELECTOR)
    const root = sidebar?.querySelector<HTMLElement>(':scope > div')
    if (sidebar === null || sidebar === undefined || root === null || root === undefined) {
      if (resizeObserver !== undefined && observedSidebar !== undefined) resizeObserver.unobserve(observedSidebar)
      observedSidebar = undefined
      body.style.setProperty('--ark-sidebar-width', '0px')
      body.dataset.arknightsSidebarSize = 'rail'
      return
    }

    root.dataset.arknightsSidebarRoot = ''
    decoratedElements.add(root)

    const settingsSlot = sidebar.querySelector<HTMLElement>("[data-slot='sidebar.settings']")
    const footer = settingsSlot?.closest<HTMLElement>("[class*='settingsArea']") ?? settingsSlot?.parentElement
    if (footer !== null && footer !== undefined) {
      footer.dataset.arknightsSidebarFooter = ''
      decoratedElements.add(footer)
    }

    setSidebarWidth(sidebar.getBoundingClientRect().width)
    if (resizeObserver !== undefined && observedSidebar !== sidebar) {
      if (observedSidebar !== undefined) resizeObserver.unobserve(observedSidebar)
      observedSidebar = sidebar
      resizeObserver.observe(sidebar)
    }
  }

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(entries => {
      if (!homeActive) return
      const entry = entries.at(-1)
      if (entry !== undefined) setSidebarWidth(entry.contentRect.width)
    })
  }

  const activateHome = (): void => {
    if (!homeActive) {
      homeActive = true
      body.dataset.arknightsHome = ''
      officialTitle = document.title
    }
    document.title = SKIN_TITLE
    syncTheme()
    syncWelcome()
    decorateSidebar()
  }

  const deactivateHome = (): void => {
    homeActive = false
    delete body.dataset.arknightsHome
    restoreWelcome()
    stopSidebarProjection()
    restoreBodyProperties()
    restoreOfficialChrome()
  }

  const syncPhase = (): void => {
    const phase = document.querySelector("[data-phase='active']") !== null
      ? 'active'
      : document.querySelector("[data-phase='hero']") !== null
        ? 'hero'
        : 'other'
    body.dataset.arknightsPhase = phase
    if (phase === 'hero') activateHome()
    else deactivateHome()
  }

  body.dataset.dshArknights = ''
  syncPhase()

  observer = new MutationObserver(records => {
    let shouldSyncTheme = false
    let shouldSyncStructure = false
    let shouldSyncPhase = false
    for (const record of records) {
      if (record.type === 'attributes' && record.target === body && record.attributeName === 'data-ds-dark-theme') {
        shouldSyncTheme = true
      }
      if (record.type === 'attributes' && record.attributeName === 'data-phase') shouldSyncPhase = true
      if (record.type === 'childList') shouldSyncStructure = true
    }
    if (shouldSyncTheme) syncTheme()
    if (shouldSyncPhase || shouldSyncStructure) syncPhase()
  })
  observer.observe(body, {
    attributes: true,
    attributeFilter: ['data-ds-dark-theme', 'data-phase'],
    childList: true,
    subtree: true,
  })
}
