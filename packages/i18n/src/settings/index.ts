import { InitOptions } from 'i18next'
import { I18nServerTypes } from '../types'

export const fallbackLng = 'en-US'
export const languages = [fallbackLng, 'es-US', 'fr-FR', 'ja-JP', 'pt-PT', 'sw-SW']
export const languagePathKeys: string[] = languages.map((l) => l.split('-')[0]) as string[]
export const fallbackLngKey = 'en'
export const defaultNS = 'common'

export function getOptions(lng = fallbackLngKey, ns: string | string[] = defaultNS, options?: I18nServerTypes.UseServerTranslationParams['options']): InitOptions {
  return {
    debug: false,
    resources: options?.resources,
    supportedLngs: languagePathKeys,
    preload: options?.resources ? [] : languagePathKeys,
    fallbackLng: fallbackLngKey,
    lng,
    fallbackNS: defaultNS,
    defaultNS: Array.isArray(ns) ? ns[0] : ns,
    ns,

    // modify the default behavior of i18next
    returnEmptyString: false,
    interpolation: {
      escapeValue: false,
    },
  }
}
