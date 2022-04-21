const isValidAnnotationElement = (value: string) => {
  const invalidElements = [
    'calendar',
    'clock',
    'smart',
    'root',
    'template',
    'section',
    'group',
    'html',
  ];
  return (
    invalidElements.filter((element) => value.toLowerCase().includes(element))
      .length === 0
  );
};

export default isValidAnnotationElement;
