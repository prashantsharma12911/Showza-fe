import { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  SimpleGrid,
  Alert,
  AlertIcon,
  Spinner,
  Center,
} from '@chakra-ui/react';
import type { EntityConfig, FieldConfig } from '../config/types';
import { ENTITY_CONFIGS } from '../config/entities';
import { apiClient, extractErrorMessage } from '../api/client';

interface Props {
  config: EntityConfig;
  isOpen: boolean;
  onClose: () => void;
  editingItem: any | null;
  onSubmit: (payload: Record<string, any>) => Promise<void>;
}

function normalizeTime(value: string): string {
  if (/^\d{2}:\d{2}$/.test(value)) return `${value}:00`;
  return value;
}

function buildInitialFormData(config: EntityConfig, item: any | null): Record<string, any> {
  const data: Record<string, any> = {};
  for (const field of config.fields) {
    if (item) {
      if (field.type === 'entity') {
        data[field.name] = item[field.name]?.id != null ? String(item[field.name].id) : '';
      } else if (field.type === 'time' && item[field.name]) {
        data[field.name] = item[field.name];
      } else {
        data[field.name] = item[field.name] ?? '';
      }
    } else {
      data[field.name] = '';
    }
  }
  return data;
}

export default function EntityFormModal({ config, isOpen, onClose, editingItem, onSubmit }: Props) {
  const [formData, setFormData] = useState<Record<string, any>>(() => buildInitialFormData(config, editingItem));
  const [entityOptions, setEntityOptions] = useState<Record<string, any[]>>({});
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData(buildInitialFormData(config, editingItem));
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingItem, config.key]);

  useEffect(() => {
    const entityFields = config.fields.filter((f) => f.type === 'entity');
    if (entityFields.length === 0 || !isOpen) return;
    let cancelled = false;
    setOptionsLoading(true);
    Promise.all(
      entityFields.map(async (f) => {
        const refConfig = ENTITY_CONFIGS[f.entityKey!];
        const res = await apiClient.get(refConfig.endpoint);
        return [f.name, res.data] as const;
      })
    )
      .then((results) => {
        if (cancelled) return;
        const map: Record<string, any[]> = {};
        for (const [name, data] of results) map[name] = data;
        setEntityOptions(map);
      })
      .catch((e) => !cancelled && setError(extractErrorMessage(e)))
      .finally(() => !cancelled && setOptionsLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, config.key]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload: Record<string, any> = {};
      for (const field of config.fields) {
        const raw = formData[field.name];
        if (field.type === 'entity') {
          payload[field.name] = raw ? { id: Number(raw) } : null;
        } else if (field.type === 'number') {
          payload[field.name] = raw === '' ? null : Number(raw);
        } else if (field.type === 'time') {
          payload[field.name] = raw ? normalizeTime(raw) : null;
        } else {
          payload[field.name] = raw === '' ? null : raw;
        }
      }
      await onSubmit(payload);
      onClose();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FieldConfig) => {
    const value = formData[field.name] ?? '';

    if (field.type === 'entity') {
      const refConfig = ENTITY_CONFIGS[field.entityKey!];
      const options = entityOptions[field.name] ?? [];
      return (
        <Select
          placeholder={optionsLoading ? 'Loading...' : `Select ${refConfig.singularName}`}
          value={value}
          isDisabled={optionsLoading}
          onChange={(e) => handleChange(field.name, e.target.value)}
        >
          {field.nullable && <option value="">None</option>}
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {refConfig.defaultLabel(opt)}
            </option>
          ))}
        </Select>
      );
    }

    if (field.type === 'enum') {
      return (
        <Select
          placeholder={`Select ${field.label}`}
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
        >
          {field.enumValues!.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </Select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <Textarea
          value={value}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          onChange={(e) => handleChange(field.name, e.target.value)}
        />
      );
    }

    return (
      <Input
        type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'date' ? 'date' : field.type === 'time' ? 'time' : 'text'}
        step={field.step}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => handleChange(field.name, e.target.value)}
      />
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editingItem ? `Edit ${config.singularName}` : `Add ${config.singularName}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && (
            <Alert status="error" rounded="md" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}
          {optionsLoading && config.fields.some((f) => f.type === 'entity') ? (
            <Center py={2}>
              <Spinner size="sm" mr={2} /> Loading related data...
            </Center>
          ) : null}
          <SimpleGrid columns={2} spacing={4}>
            {config.fields.map((field) => (
              <FormControl
                key={field.name}
                isRequired={field.required}
                gridColumn={field.colSpan === 2 ? 'span 2' : undefined}
              >
                <FormLabel fontSize="sm">{field.label}</FormLabel>
                {renderField(field)}
              </FormControl>
            ))}
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={submitting}>
            {editingItem ? 'Save Changes' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
