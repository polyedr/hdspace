interface IOptions {
  label: string,
  value: string,
}

export const elementTypes = {
  block: 'block',
  group: 'group',
  container: 'container',
  elem: 'elem',
  input: 'textinput',
  button: 'button',
  hyperLine: 'hyperlink',
  text: 'ocrtext',
  select: 'select',
  image: 'image',
  map: 'map',
  calendar: 'calendar',
  clock: 'clock',
};

// export const optionsUIMenu: IOptions[] = [
//   { label: 'Block', value: elementTypes.block },
//   { label: 'Group', value: elementTypes.group },
//   { label: 'Element', value: elementTypes.elem },
//   { label: 'Input', value: elementTypes.input },
//   { label: 'Button', value: elementTypes.button },
//   { label: 'HyperLine', value: elementTypes.hyperLine },
//   { label: 'Text', value: elementTypes.text },
//   { label: 'Select', value: elementTypes.select },
//   { label: 'Image', value: elementTypes.image },
//   // { label: 'RadioButton', value: 'radioButton' },
//   // { label: 'Checkbox', value: 'checkbox' },
//   // { label: 'Sign in', value: 'signin' },
//   // { label: 'Sign up', value: 'signup' },
//   // { label: '+Custom', value: 'custom' },
// ];
