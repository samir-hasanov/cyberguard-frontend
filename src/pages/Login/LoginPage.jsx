import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useLanguage } from '../../i18n/LanguageContext'

export default function LoginPage() {
  const { user, login } = useAuth()
  const { t } = useLanguage()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login(username.trim(), password)
    } catch (requestError) {
      const code = requestError.response?.data?.message || 'AUTHENTICATION_FAILED'
      setError(t(code))
    } finally {
      setPassword('')
      setSubmitting(false)
    }
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="#0b1220" px={4}>
      <Box as="form" onSubmit={submit} w="100%" maxW="420px" bg="#111827" border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={8}>
        <Heading size="md" mb={2}>{t('brand')}</Heading>
        <Text color="gray.400" mb={6}>{t('loginHint')}</Text>
        <FormControl mb={4} isRequired>
          <FormLabel>{t('username')}</FormLabel>
          <Input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" bg="whiteAlpha.100" />
        </FormControl>
        <FormControl mb={6} isRequired>
          <FormLabel>{t('password')}</FormLabel>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" bg="whiteAlpha.100" />
        </FormControl>
        {error && <Text color="red.300" mb={4}>{error}</Text>}
        <Button type="submit" colorScheme="cyan" w="100%" isLoading={submitting}>{t('login')}</Button>
      </Box>
    </Flex>
  )
}
