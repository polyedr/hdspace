import React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import {
  selectActiveElement,
  selectCurrentEditableStyles,
} from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import StylesHeader from '../../helperComponents/StylesHeader';
import {
  AppReduxState,
  ContainerElement,
  PropertiesChangeProps,
} from '../../../../../types';

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

      <TextField
        fullWidth
        label="Flex Grow"
        type="number"
        value={flexGrow}
        onChange={handleTextFieldChange}
      />

      {/*      <input
        type="number"
        value={flexGrow}
        min={0}
        onChange={handleTextFieldChange}
      /> */}
    </div>
  ) : null;
};

export default connect(mapState)(withConfigurableProperties(FlexGrow));
