/* eslint-disable */
if (mdc.textField) {
  const textFieldDom = document.querySelectorAll('.mdc-text-field');
  for (var i = 0; i < textFieldDom.length; i++) {
    mdc.textField.MDCTextField.attachTo(textFieldDom.item(i));
  }
}
if (mdc.select) {
  const selectDom = document.querySelectorAll('.mdc-select');
  for (var i = 0; i < selectDom.length; i++) {
    mdc.select.MDCSelect.attachTo(selectDom.item(i));
  }
}
if (mdc.menu) {
  const dropdownMenuDom = document.querySelectorAll('.mdc-dropdown-menu');
  for (var i = 0; i < dropdownMenuDom.length; i++) {
    const domElement = dropdownMenuDom.item(i);
    const mdcMenu = mdc.menu.MDCMenu.attachTo(domElement);
    domElement.parentNode.addEventListener('click', () => {
      mdcMenu.open = !mdcMenu.open;
    });
  }
}
