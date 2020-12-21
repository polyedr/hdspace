/* eslint-disable */
const textFieldDom = document.querySelectorAll('.mdc-text-field');
for (var i = 0; i < textFieldDom.length; i++) {
  mdc.textField.MDCTextField.attachTo(textFieldDom.item(i));
}
const selectDom = document.querySelectorAll('.mdc-select');
for (var i = 0; i < selectDom.length; i++) {
  mdc.select.MDCSelect.attachTo(selectDom.item(i));
}
