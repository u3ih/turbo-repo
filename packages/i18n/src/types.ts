import type { i18n as I18n, Resource } from 'i18next'

export namespace I18nServerTypes {
  export interface UseServerTranslationParams {
    lng: string
    ns: string | string[]
    options?: {
      keyPrefix?: string
      i18n?: I18n
      resources?: Resource
      resourcesToBackendPath?: (language: string, namespaces: string) => void
    }
  }
}

export interface TranslationsProviderProps {
  locale: string
  namespaces: string[]
  resources: Resource
  children: React.ReactNode
}
