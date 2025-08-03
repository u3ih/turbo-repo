'use client'

import { I18nextProvider } from 'react-i18next'
import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { I18nServerTypes, TranslationsProviderProps } from '../types'
import { getOptions } from '../settings'

export const initClientI18next = async (lng: string, ns: string | string[], options: I18nServerTypes.UseServerTranslationParams['options'] = {}) => {
  // on server side we create a new instance for each render, because during compilation everything seems to be executed in parallel
  const i18nInstance = options.i18n || createInstance()
  i18nInstance.use(initReactI18next)

  await i18nInstance.init(getOptions(lng, ns, options))
  return i18nInstance
}

export const TranslationsProvider: React.FC<TranslationsProviderProps> = ({ children, locale, namespaces, resources }) => {
  const i18n = createInstance()
  initClientI18next(locale, namespaces, { i18n, resources })

  return <I18nextProvider i18n={i18n as any}>{children}</I18nextProvider>
}
