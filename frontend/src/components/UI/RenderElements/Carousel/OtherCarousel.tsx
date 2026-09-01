import React, { useContext } from 'react';
import cn from 'classnames';
import { WindowContext } from '@Components/Editor/FrameWrapper/FrameContext';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('slider', {
  displayContainer: {
    position: 'relative',
  },
  button: {
    border: 'none',
    display: ' inline-block',
    padding: '8px 16px',
    verticalAlign: 'middle',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    backgroundColor: 'inherit',
    textAlign: 'center',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: '0.3',
    },
  },
  buttonBlack: {
    color: '#fff!important',
    backgroundColor: '#000!important',
  },
  buttonRight: {
    position: 'absolute',
    top: '50%',
    right: '0',
    transform: 'translate(0%, -50%)',
    msTtransform: 'translate(0%, -50%)',
  },
  buttonLeft: {
    position: 'absolute',
    top: '50%',
    left: '0  ',
    transform: 'translate(0%, -50%)',
    msTransform: 'translate(-0%, -50%)',
  },
});

const OtherCarousel = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { children, element, isDisabled } = props;
    const frameWindow = useContext(WindowContext);

    const [groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);
    let slideIndex = 1;
    function showDivs(n: number) {
      const selectElement = frameWindow?.document.getElementsByClassName(
        'mySlides',
      ) as HTMLCollectionOf<HTMLElement>;
      if (n > selectElement.length) {
        slideIndex = 1;
      }
      if (n < 1) {
        slideIndex = selectElement.length;
      }
      for (let i = 0; i < selectElement.length; i++) {
        const item = selectElement.item(i);
        if (item) {
          item.style.display = 'none';
        }
      }
      selectElement[slideIndex - 1].style.display = 'block';
    }
    function plusDivs(n: number) {
      showDivs((slideIndex += n));
    }

    return (
      <div
        ref={(dom: HTMLDivElement) => {
          if (dom) {
            showDivs(slideIndex);
          }
          if (!ref) {
            return;
          }
          if (typeof ref === 'function') {
            ref(dom);
          } else {
            ref.current = dom;
          }
        }}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          'w3-content w3-display-container',
          classes.displayContainer,
          classes.ownStyles,
          groupClass,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
        {...eventHandlers}
      >
        {children}
        <button
          onClick={() => plusDivs(-1)}
          className={cn(
            classes.button,
            classes.buttonLeft,
            classes.buttonBlack,
            'w3-display-prev',
          )}
          type="button"
        >
          &#10094;
        </button>
        <button
          onClick={() => plusDivs(1)}
          className={cn(
            classes.button,
            classes.buttonRight,
            classes.buttonBlack,
            'w3-display-next',
          )}
          type="button"
        >
          &#10095;
        </button>
      </div>
    );
  },
);

export default OtherCarousel;
