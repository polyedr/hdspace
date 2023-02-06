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
let slideIndex = 1;

showDivs(slideIndex);

function showDivs(n) {
  const x = document.getElementsByClassName('mySlides');
  if (n > x.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = x.length;
  }
  for (let i = 0; i < x.length; i++) {
    const item = x.item(i);
    if (item) {
      item.style.display = 'none';
    }
  }
  x[slideIndex - 1].style.display = 'block';
}
const sliders = document.querySelectorAll('.carousel');
for (let i = 0; i < sliders.length; i++) {
  const prevBtn = document.getElementsByClassName('w3-display-prev');
  const nextBtn = document.getElementsByClassName('w3-display-next');
  prevBtn[0].addEventListener('click', () => showDivs((slideIndex += -1)));
  nextBtn[0].addEventListener('click', () => showDivs((slideIndex += 1)));
}
