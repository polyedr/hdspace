import { InputType } from '@Src/types';

const TYPE: Array<{ label: string; value: InputType }> = [
  { label: 'Text', value: 'text' },
  { label: 'Email', value: 'email' },
  { label: 'Number', value: 'number' },
  { label: 'Phone', value: 'phone' },
  { label: 'Password', value: 'password' },
];

export default TYPE;
