export type FilterCondition =  
  | 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'notIn'
  | 'contains' | 'notContains' | 'containsi' | 'notContainsi' 
  | 'null' | 'notNull' | 'between' | 'startsWith' | 'endsWith'
  | 'or' | 'and';

export const buildFilter = (fieldname: string | string[], condition: FilterCondition): string => {
  const fieldnames = (typeof fieldname === 'string') ? [fieldname] : fieldname;
  const fieldArea = fieldnames.map(f => '[' + f + ']').join('');
  const conditionArea = '[$' + condition + ']';
  return `${fieldArea}${conditionArea}`;
}

export const defaultPaginationConfig = {
  page: 0,
  pageSize: 25,
}