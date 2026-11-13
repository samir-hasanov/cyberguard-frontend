import { Badge, Box, Heading, Text } from '@chakra-ui/react'
import { useLanguage } from '../i18n/LanguageContext'

export default function PlaceholderPage({ phase, titleKey }) {
  const { t } = useLanguage()

  return (
    <Box bg="#111827" border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={8}>
      <Badge colorScheme="cyan" mb={4}>{t('phase')} {phase}</Badge>
      <Heading size="md" mb={3}>{t(titleKey)}</Heading>
      <Text color="gray.400">{t('phaseHint')}</Text>
    </Box>
  )
}
