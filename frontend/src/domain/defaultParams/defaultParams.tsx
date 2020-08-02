import { ListItemParameters, SelectItemParameters, DropdownItemParameters } from '$api/types';


export const defaultListItemParams: ListItemParameters = {
  textContent: 'New item',
  isLink: false,
  link: '',
};

export const defaultSelectItemParams: SelectItemParameters= {
  name: 'New option',
  value: 'New option',
};

export const defaultDropdownItemParams: DropdownItemParameters = {
  textContent: 'New item',
};



