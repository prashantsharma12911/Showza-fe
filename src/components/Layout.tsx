import type { ReactNode } from 'react';
import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  HStack,
  Heading,
  Button,
  Divider,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiFilm,
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
  FiLogOut,
  FiMenu,
  FiHome,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { ENTITY_CONFIGS, ENTITY_ORDER } from '../config/entities';
import { useAuth } from '../auth/AuthContext';

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

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Flex direction="column" h="full" bg="gray.900" color="gray.100">
      <HStack px={5} py={5} spacing={3}>
        <Flex bg="blue.600" rounded="lg" boxSize={9} align="center" justify="center">
          <Icon as={FiFilm} color="white" boxSize={5} />
        </Flex>
        <Heading size="md" color="white">
          Showza Admin
        </Heading>
      </HStack>
      <Divider borderColor="gray.700" />
      <VStack align="stretch" spacing={1} px={3} py={4} overflowY="auto" flex={1}>
        <NavLink to="/" end onClick={onNavigate}>
          {({ isActive }) => (
            <HStack
              px={3}
              py={2.5}
              rounded="md"
              spacing={3}
              bg={isActive ? 'blue.600' : 'transparent'}
              color={isActive ? 'white' : 'gray.300'}
              _hover={{ bg: isActive ? 'blue.600' : 'gray.800' }}
              transition="background 0.15s"
            >
              <Icon as={FiHome} boxSize={4} />
              <Text fontSize="sm" fontWeight="medium">
                Dashboard
              </Text>
            </HStack>
          )}
        </NavLink>

        <Text px={3} pt={4} pb={1} fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
          Modules
        </Text>

        {ENTITY_ORDER.map((key) => {
          const config = ENTITY_CONFIGS[key];
          const IconCmp = ICONS[key] ?? FiGrid;
          return (
            <NavLink key={key} to={`/${key}`} onClick={onNavigate}>
              {({ isActive }) => (
                <HStack
                  px={3}
                  py={2.5}
                  rounded="md"
                  spacing={3}
                  bg={isActive ? 'blue.600' : 'transparent'}
                  color={isActive ? 'white' : 'gray.300'}
                  _hover={{ bg: isActive ? 'blue.600' : 'gray.800' }}
                  transition="background 0.15s"
                >
                  <Icon as={IconCmp} boxSize={4} />
                  <Text fontSize="sm" fontWeight="medium">
                    {config.name}
                  </Text>
                </HStack>
              )}
            </NavLink>
          );
        })}
      </VStack>
      <Divider borderColor="gray.700" />
      <Box p={3}>
        <Button
          w="full"
          variant="ghost"
          color="gray.300"
          justifyContent="flex-start"
          leftIcon={<Icon as={FiLogOut} />}
          _hover={{ bg: 'gray.800', color: 'white' }}
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </Box>
    </Flex>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex minH="100vh" bg="gray.50">
      <Box display={{ base: 'none', md: 'block' }} w="260px" flexShrink={0}>
        <Box position="fixed" w="260px" h="100vh">
          <SidebarContent />
        </Box>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="260px">
          <SidebarContent onNavigate={onClose} />
        </DrawerContent>
      </Drawer>

      <Flex direction="column" flex={1} minW={0}>
        <Flex
          as="header"
          align="center"
          justify="space-between"
          px={6}
          py={3}
          bg="white"
          borderBottomWidth="1px"
          borderColor="gray.200"
          position="sticky"
          top={0}
          zIndex={10}
        >
          <IconButton
            aria-label="Open menu"
            icon={<FiMenu />}
            display={{ base: 'inline-flex', md: 'none' }}
            onClick={onOpen}
            variant="outline"
          />
          <Box display={{ base: 'none', md: 'block' }} />
          <Menu>
            <MenuButton>
              <HStack spacing={3}>
                <Avatar size="sm" name="Admin" bg="blue.600" color="white" />
                <Text fontSize="sm" fontWeight="medium" display={{ base: 'none', sm: 'block' }}>
                  Admin
                </Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem isDisabled>prashant.kumar.12911@gmail.com</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <Box as="main" p={{ base: 4, md: 8 }} flex={1}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
