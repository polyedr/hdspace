export function handleMonthPickerClick(e: any) {
  // Filter out unwanted click events
  if (!e.target.classList.contains('calendar__picker-month-option')) {
    return;
  }

  const newMonthValue = parseInt(e.target.dataset.value);

  this.updateMonthPickerSelection(newMonthValue);
  this.updateCurrentDate(0, undefined, newMonthValue);
  this.togglePicker(false);
}

export function updateMonthPickerSelection(newMonthValue: number) {
  const newMonth = newMonthValue < 0 ? 11 : newMonthValue % 12;

  this.removeMonthPickerSelection();
  this.pickerMonthContainer!.children[newMonth].classList.add(
    'calendar__picker-month-selected',
  );
}

export function removeMonthPickerSelection() {
  // Remove old year selection by scanning for the selected month
  for (let i = 0; i < 12; i++) {
    if (
      this.pickerMonthContainer!.children[i].classList.contains(
        'calendar__picker-month-selected',
      )
    ) {
      this.pickerMonthContainer!.children[i].classList.remove(
        'calendar__picker-month-selected',
      );
    }
  }
}
