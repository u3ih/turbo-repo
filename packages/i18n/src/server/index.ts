import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { defaultNS, getOptions } from '../settings'
import { I18nServerTypes } from '../types'

const defaultResourcesToBackendPath = (language: string, namespace: string) => {
  try {
    return import(`../../../public/locales/${language}/${namespace}.json`)
  } catch {
    return {}
  }
}

export const initI18next = async (lng: string, ns: string | string[], options: I18nServerTypes.UseServerTranslationParams['options'] = {}) => {
  // on server side we create a new instance for each render, because during compilation everything seems to be executed in parallel
  const i18nInstance = options.i18n || createInstance()
  i18nInstance.use(initReactI18next)
  if (!options.resources) {
    i18nInstance.use(
      resourcesToBackend((language: string, namespace: string) => {
        const resourcesToBackendPath = options.resourcesToBackendPath ?? defaultResourcesToBackendPath

        return resourcesToBackendPath(language, namespace)
      }),
    )
  }

  await i18nInstance.init(getOptions(lng, ns, options))
  return i18nInstance
}

export async function useServerTranslation(
  lng: I18nServerTypes.UseServerTranslationParams['lng'],
  ns: I18nServerTypes.UseServerTranslationParams['ns'] = defaultNS,
  options: I18nServerTypes.UseServerTranslationParams['options'] = {},
) {
  const i18nextInstance = await initI18next(lng, ns, options)
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance,
    resources: i18nextInstance.services.resourceStore.data,
  }
}

export type TFuncType = Awaited<ReturnType<typeof useServerTranslation>>['t']
