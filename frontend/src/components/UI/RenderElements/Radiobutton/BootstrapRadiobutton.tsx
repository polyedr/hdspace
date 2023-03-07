import React from 'react';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { updateElementParameters } from '@Redux/project/actions';
import { selectAllElements } from '@Redux/project/selectors/element';
import { RendererProps } from '../types';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('radiobutton', {});

const BootstrapRadiobutton = React.forwardRef<HTMLInputElement, RendererProps>(
  (props, ref) => {
    const dispatch = useDispatch();
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { label } = element.parameters;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);
    const allElements = useSelector(selectAllElements);
    const currentScreenId = useSelector(selectCurrentScreenId);
    const parent = element?.parent ? allElements[element.parent] : null;

    const setSelectedRadioButton = () => {
      if (parent?.id) {
        dispatch(
          updateElementParameters(
            parent?.id,
            { selectedRadioElementId: element?.id },
            { screenId: currentScreenId },
          ),
        );
      }
    };

    return (
      <div
        ref={ref}
        {...eventHandlers}
        className={cn(
          'form-check',
          className,
          groupClass,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
          classes.ownStyles,
        )}
      >
        <input
          type="radio"
          id={element.id}
          data-ls-id={element.id}
          className={cn('form-check-input')}
          checked={
            !isDisabled &&
            element.id === parent?.parameters.selectedRadioElementId
          }
          onChange={setSelectedRadioButton}
          name={element.parameters.name}
        />
        <label
          htmlFor={element.id}
          className="form-check-label"
          dangerouslySetInnerHTML={{ __html: label || '' }}
        />
      </div>
    );
  },
);

export default BootstrapRadiobutton;
