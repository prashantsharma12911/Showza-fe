export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'time' | 'enum' | 'entity' | 'email';

export interface FieldConfig {
  name: string; // property key on the entity
  label: string;
  type: FieldType;
  required?: boolean;
  enumValues?: readonly string[]; // for type 'enum'
  entityKey?: string; // for type 'entity' -> key into ENTITY_CONFIGS
  entityLabel?: (item: any) => string; // display label for entity option
  nullable?: boolean; // for entity type: allow "None" selection
  maxLength?: number;
  placeholder?: string;
  step?: string;
  colSpan?: 1 | 2;
}

export interface ColumnConfig {
  key: string;
  label: string;
  render?: (item: any) => any;
}

export interface EntityConfig {
  key: string; // route/key, e.g. 'city'
  name: string; // plural display name
  singularName: string;
  endpoint: string; // e.g. '/api/cities'
  columns: ColumnConfig[];
  fields: FieldConfig[];
  defaultLabel: (item: any) => string; // used when this entity is referenced by others
}
