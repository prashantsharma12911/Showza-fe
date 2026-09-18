import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  Icon,
  Center,
  Spinner,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import type { IconType } from 'react-icons';
import {
  FiMap,
  FiMonitor,
  FiGrid,
  FiUser,
  FiVideo,
  FiCalendar,
  FiTag,
  FiUsers,
  FiPercent,
  FiBookOpen,
  FiCreditCard,
  FiRefreshCw,
} from 'react-icons/fi';
import { ENTITY_CONFIGS, ENTITY_ORDER } from '../config/entities';
import { apiClient } from '../api/client';

const ICONS: Record<string, IconType> = {
  city: FiMap,
  eventVenue: FiMonitor,
  screen: FiGrid,
  seat: FiGrid,
  actor: FiUser,
  movie: FiVideo,
  movieShow: FiCalendar,
  showSeat: FiTag,
  user: FiUsers,
  offer: FiPercent,
  booking: FiBookOpen,
  payment: FiCreditCard,
  refund: FiRefreshCw,
};

export default function DashboardPage() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all(
      ENTITY_ORDER.map(async (key) => {
        try {
          const res = await apiClient.get(ENTITY_CONFIGS[key].endpoint);
          return [key, Array.isArray(res.data) ? res.data.length : 0] as const;
        } catch {
          return [key, null] as const;
        }
      })
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, number | null> = {};
      for (const [key, count] of results) map[key] = count;
      setCounts(map);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box>
      <Heading size="lg" mb={1}>
        Dashboard
      </Heading>
      <Text color="gray.500" fontSize="sm" mb={6}>
        Overview of all Showza platform data
      </Text>

      {loading ? (
        <Center py={16}>
          <Spinner size="lg" color="blue.500" />
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
          {ENTITY_ORDER.map((key) => {
            const config = ENTITY_CONFIGS[key];
            const IconCmp = ICONS[key] ?? FiGrid;
            const count = counts[key];
            return (
              <ChakraLink
                as={RouterLink}
                to={`/${key}`}
                key={key}
                _hover={{ textDecoration: 'none' }}
              >
                <Box
                  bg="white"
                  p={5}
                  rounded="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                  transition="all 0.15s"
                  _hover={{ borderColor: 'blue.400', boxShadow: 'md', transform: 'translateY(-2px)' }}
                >
                  <HStack justify="space-between" mb={3}>
                    <Center bg="blue.50" boxSize={10} rounded="md">
                      <Icon as={IconCmp} color="blue.600" boxSize={5} />
                    </Center>
                  </HStack>
                  <Stat>
                    <StatNumber fontSize="2xl">
                      {count === null ? '—' : count}
                    </StatNumber>
                    <StatLabel color="gray.500" fontSize="sm">
                      {config.name}
                    </StatLabel>
                  </Stat>
                </Box>
              </ChakraLink>
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
}
