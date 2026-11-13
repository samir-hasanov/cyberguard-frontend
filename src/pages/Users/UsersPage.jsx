import { Badge, Box, Button, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { fetchUsers, setUserEnabled } from '../../services/api'

export default function UsersPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const canWrite = user?.permissions?.includes('USER_WRITE')

  function load() {
    fetchUsers()
      .then(setUsers)
      .catch(() => setError(t('loadError')))
  }

  useEffect(() => {
    load()
  }, [])

  async function toggle(account) {
    await setUserEnabled(account.id, !account.enabled)
    load()
  }

  return (
    <Box>
      <Heading size="md" mb={6}>{t('users')}</Heading>
      {error && <Box mb={4} color="red.300">{error}</Box>}
      <Box bg="#111827" border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" overflowX="auto">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>{t('username')}</Th>
              <Th>{t('displayName')}</Th>
              <Th>{t('roles')}</Th>
              <Th>{t('status')}</Th>
              {canWrite && <Th />}
            </Tr>
          </Thead>
          <Tbody>
            {users.map((account) => (
              <Tr key={account.id}>
                <Td>{account.username}</Td>
                <Td>{account.displayName}</Td>
                <Td>{account.roles.join(', ')}</Td>
                <Td>
                  <Badge colorScheme={account.enabled ? 'green' : 'red'}>
                    {account.enabled ? t('enabled') : t('disabled')}
                  </Badge>
                </Td>
                {canWrite && (
                  <Td>
                    <Button
                      size="xs"
                      variant="outline"
                      isDisabled={account.id === user.id}
                      onClick={() => toggle(account)}
                    >
                      {account.enabled ? t('disable') : t('enable')}
                    </Button>
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}
