import { createContext, useContext, useMemo, useState } from 'react'
import { dictionary } from './dictionary'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('az')
  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key) => dictionary[language][key] ?? key
  }), [language])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
