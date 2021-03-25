/**
 *
 * @param element
 * @returns true if element is visible in viewport, false in other case
 */

const isInViewport = (element: HTMLElement | null) => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export default isInViewport;
