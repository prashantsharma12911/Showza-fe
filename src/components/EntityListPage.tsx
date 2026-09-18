import { useMemo, useRef, useState, type RefObject } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiRefreshCw } from 'react-icons/fi';
import type { EntityConfig } from '../config/types';
import { useCrud } from '../api/useCrud';
import { extractErrorMessage } from '../api/client';
import EntityFormModal from './EntityFormModal';

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'green',
  DONE: 'green',
  PASS: 'green',
  AVAILABLE: 'green',
  ACTIVE: 'green',
  PENDING: 'yellow',
  INPROGRESS: 'yellow',
  CANCELLED: 'red',
  FAILED: 'red',
  BOOKED: 'purple',
  REFUNDED: 'blue',
  ADMIN: 'purple',
  CUSTOMER: 'gray',
};

function renderCell(value: any) {
  if (value === null || value === undefined || value === '') return <Text color="gray.400">-</Text>;
  if (typeof value === 'string' && STATUS_COLORS[value]) {
    return <Badge colorScheme={STATUS_COLORS[value]}>{value}</Badge>;
  }
  return String(value);
}

export default function EntityListPage({ config }: { config: EntityConfig }) {
  const { items, loading, error, refresh, create, update, remove } = useCrud<any>(config.endpoint);
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const formModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null) as RefObject<HTMLButtonElement>;
  const toast = useToast();

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(q));
  }, [items, search]);

  const openCreate = () => {
    setEditingItem(null);
    formModal.onOpen();
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    formModal.onOpen();
  };

  const openDelete = (item: any) => {
    setDeleteTarget(item);
    deleteDialog.onOpen();
  };

  const handleFormSubmit = async (payload: Record<string, any>) => {
    if (editingItem) {
      await update(editingItem.id, payload as any);
      toast({ title: `${config.singularName} updated`, status: 'success', duration: 2500 });
    } else {
      await create(payload as any);
      toast({ title: `${config.singularName} created`, status: 'success', duration: 2500 });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast({ title: `${config.singularName} deleted`, status: 'success', duration: 2500 });
      deleteDialog.onClose();
    } catch (e) {
      toast({ title: 'Delete failed', description: extractErrorMessage(e), status: 'error', duration: 4000 });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6} align="start" flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">{config.name}</Heading>
          <Text color="gray.500" fontSize="sm" mt={1}>
            Manage {config.name.toLowerCase()} for the Showza platform
          </Text>
        </Box>
        <HStack>
          <Tooltip label="Refresh">
            <IconButton aria-label="Refresh" icon={<FiRefreshCw />} onClick={() => refresh()} variant="outline" />
          </Tooltip>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={openCreate}>
            Add {config.singularName}
          </Button>
        </HStack>
      </HStack>

      <InputGroup mb={4} maxW="360px">
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder={`Search ${config.name.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="white"
        />
      </InputGroup>

      {error && (
        <Alert status="error" rounded="md" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box bg="white" rounded="lg" borderWidth="1px" borderColor="gray.200" overflow="hidden">
        {loading ? (
          <Center py={16}>
            <Spinner size="lg" color="blue.500" />
          </Center>
        ) : filteredItems.length === 0 ? (
          <Center py={16} flexDirection="column">
            <Text color="gray.500">No {config.name.toLowerCase()} found.</Text>
          </Center>
        ) : (
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  {config.columns.map((col) => (
                    <Th key={col.key}>{col.label}</Th>
                  ))}
                  <Th textAlign="right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredItems.map((item) => (
                  <Tr key={item.id} _hover={{ bg: 'gray.50' }}>
                    {config.columns.map((col) => (
                      <Td key={col.key}>{renderCell(col.render ? col.render(item) : item[col.key])}</Td>
                    ))}
                    <Td textAlign="right">
                      <HStack justify="flex-end" spacing={1}>
                        <Tooltip label="Edit">
                          <IconButton
                            aria-label="Edit"
                            icon={<FiEdit2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => openEdit(item)}
                          />
                        </Tooltip>
                        <Tooltip label="Delete">
                          <IconButton
                            aria-label="Delete"
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => openDelete(item)}
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <EntityFormModal
        config={config}
        isOpen={formModal.isOpen}
        onClose={formModal.onClose}
        editingItem={editingItem}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog isOpen={deleteDialog.isOpen} leastDestructiveRef={cancelRef} onClose={deleteDialog.onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete {config.singularName}
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this {config.singularName.toLowerCase()}? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteDialog.onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3} isLoading={deleting}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
