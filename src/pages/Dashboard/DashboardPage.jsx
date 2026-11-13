import { Badge, Box, Button, Grid, Heading, SimpleGrid, Spinner, Text } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useLanguage } from '../../i18n/LanguageContext'
import { fetchDashboardSummary, fetchSystemStatus } from '../../services/api'

const STATUS_COLOR = {
  UP: 'green',
  DOWN: 'red',
  DEGRADED: 'orange',
  NOT_CONFIGURED: 'gray'
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const [status, setStatus] = useState(null)
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([fetchSystemStatus(), fetchDashboardSummary()])
      .then(([nextStatus, nextSummary]) => {
        setStatus(nextStatus)
        setSummary(nextSummary)
        setError(false)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
    const timer = setInterval(load, 15000)
    return () => clearInterval(timer)
  }, [load])

  if (loading && !status) {
    return <Spinner color="cyan.300" />
  }

  if (error && !status) {
    return (
      <Box>
        <Text mb={4}>{t('loadError')}</Text>
        <Button colorScheme="cyan" onClick={load}>{t('retry')}</Button>
      </Box>
    )
  }

  const alertTotal = summary.alertSeverities.reduce((sum, item) => sum + item.count, 0)

  return (
    <Box>
      <Heading size="md" mb={6}>{t('dashboard')}</Heading>
      <Box bg="#111827" border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={5} mb={6}>
        <Text color="gray.400" mb={2}>{t('overall')}</Text>
        <Badge colorScheme={STATUS_COLOR[status.overall] || 'gray'} fontSize="md" px={3} py={1}>
          {t(status.overall)}
        </Badge>
        <Text mt={3} fontSize="sm" color="gray.500">{status.application} {status.version}</Text>
      </Box>

      <Heading size="sm" mb={3}>{t('components')}</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
        {status.components.map((component) => (
          <Box key={component.name} bg="#111827" border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={4}>
            <Text mb={2}>{t(component.name)}</Text>
            <Badge colorScheme={STATUS_COLOR[component.status] || 'gray'}>{t(component.status)}</Badge>
            <Text mt={3} fontSize="sm" color="gray.500">{component.detail}</Text>
          </Box>
        ))}
      </SimpleGrid>

      <Heading size="sm" mb={3}>{t('metrics')}</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
        {summary.metrics.map((metric) => (
          <Box key={metric.key} bg="#111827" border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={4}>
            <Text color="gray.400" fontSize="sm">{t(metric.key)}</Text>
            <Text fontSize="3xl" fontWeight="700">{metric.available ? metric.value : '—'}</Text>
            {!metric.available && (
              <Text fontSize="sm" color="gray.500">{t(metric.unavailableReason)}</Text>
            )}
          </Box>
        ))}
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: '1.2fr 1fr' }} gap={4}>
        <Box bg="#111827" border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={4} minH="280px">
          <Heading size="sm" mb={4}>{t('severity')}</Heading>
          {alertTotal === 0 ? (
            <Text color="gray.500">{t('noAlerts')}</Text>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={summary.alertSeverities}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="severity" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#22d3ee" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
        <Box bg="#111827" border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={4}>
          <Heading size="sm" mb={4}>{t('integrations')}</Heading>
          {summary.integrations.map((integration) => (
            <FlexRow key={integration.type} integration={integration} t={t} />
          ))}
        </Box>
      </Grid>
    </Box>
  )
}

function FlexRow({ integration, t }) {
  return (
    <Box py={2} borderBottom="1px solid" borderColor="whiteAlpha.100">
      <Text fontWeight="600">{integration.type}</Text>
      <Text fontSize="sm" color="gray.500">
        {integration.enabled ? t('enabled') : t('disabled')} · {integration.configurationReference}
      </Text>
    </Box>
  )
}
