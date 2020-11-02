import React from 'react';
import { connect } from 'react-redux';
import StylesHeader from '../../../components/StylesHeader/StylesHeader';
import {
  selectActiveElement,
  selectCurrentEditableStyles,
} from '../../../../../../redux/project/selectors';
import { AppReduxState } from '../../../../../../shared/types/app';
import { ContainerElement } from '../../../../../../api/types';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';

function mapState(state: AppReduxState) {
  const flexGrow = selectCurrentEditableStyles(state, 'flex-grow');
  const activeItemID = selectActiveElement(state).id;

  return {
    flexGrow,
    activeItemID,
  };
}

type Props = ReturnType<typeof mapState> &
  PropertiesChangeProps<ContainerElement>;

const FlexGrow: React.FC<Props> = ({
  flexGrow,
  activeItemID,
  updateStyles,
  removeStyles,
}) => {
  const el = document.getElementById(activeItemID);
  const parentStyles = el?.parentElement && getComputedStyle(el.parentElement);
  const isFlexItem = parentStyles?.display === 'flex';

  const handleTextFieldChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    updateStyles({ 'flex-grow': Number(value) });
  };

  return isFlexItem ? (
    <div>
      <StylesHeader
        title="Flex Grow"
        onClick={removeStyles}
        cssPropertiesNames={['flex-grow']}
      />

      <input
        type="number"
        value={flexGrow}
        min={0}
        onChange={handleTextFieldChange}
      />
    </div>
  ) : null;
};

export default connect(mapState)(withConfigurableProperties(FlexGrow));
