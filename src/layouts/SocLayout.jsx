import { Box, Button, Flex, Icon, Input, Text } from '@chakra-ui/react'
import { FiBell, FiShield } from 'react-icons/fi'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'

const NAV = [
  { to: '/', key: 'dashboard', end: true, permission: 'DASHBOARD_READ' },
  { to: '/alerts', key: 'alerts', permission: 'ALERT_READ' },
  { to: '/incidents', key: 'incidents', permission: 'INCIDENT_READ' },
  { to: '/assets', key: 'assets', permission: 'ASSET_READ' },
  { to: '/users', key: 'users', permission: 'USER_READ' },
  { to: '/logs', key: 'logs', permission: 'LOG_READ' },
  { to: '/firewall', key: 'firewall', permission: 'FIREWALL_READ' },
  { to: '/threat-intel', key: 'threatIntel', permission: 'THREAT_INTEL_READ' },
  { to: '/reports', key: 'reports', permission: 'REPORT_READ' }
]

export default function SocLayout() {
  const { t, language, setLanguage } = useLanguage()
  const { user, logout } = useAuth()
  const permissions = user?.permissions || []
  const items = NAV.filter((item) => permissions.includes(item.permission))

  return (
    <Flex minH="100vh">
      <Flex
        as="nav"
        direction="column"
        w="260px"
        bg="#111827"
        borderRight="1px solid"
        borderColor="whiteAlpha.200"
        px={4}
        py={6}
        gap={2}
      >
        <Flex align="center" gap={3} mb={6} px={2}>
          <Icon as={FiShield} color="cyan.300" boxSize={6} />
          <Text fontWeight="700">{t('brand')}</Text>
        </Flex>
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end}>
            {({ isActive }) => (
              <Box
                px={3}
                py={2}
                borderRadius="md"
                bg={isActive ? 'whiteAlpha.200' : 'transparent'}
                color={isActive ? 'cyan.200' : 'gray.300'}
                _hover={{ bg: 'whiteAlpha.100' }}
              >
                {t(item.key)}
              </Box>
            )}
          </NavLink>
        ))}
      </Flex>
      <Flex direction="column" flex="1" minW={0}>
        <Flex
          as="header"
          h="64px"
          px={6}
          align="center"
          justify="space-between"
          borderBottom="1px solid"
          borderColor="whiteAlpha.200"
          bg="#0f172a"
          gap={4}
        >
          <Input
            maxW="420px"
            placeholder={t('search')}
            isDisabled
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.300"
          />
          <Flex align="center" gap={3}>
            <Text fontSize="sm" color="gray.400">{user?.displayName}</Text>
            <Icon as={FiBell} title={t('notifications')} color="gray.400" />
            <Button size="sm" variant={language === 'az' ? 'solid' : 'outline'} colorScheme="cyan" onClick={() => setLanguage('az')}>AZ</Button>
            <Button size="sm" variant={language === 'en' ? 'solid' : 'outline'} colorScheme="cyan" onClick={() => setLanguage('en')}>EN</Button>
            <Button size="sm" variant="outline" onClick={logout}>{t('logout')}</Button>
          </Flex>
        </Flex>
        <Box as="main" p={6}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  )
}
