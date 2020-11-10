import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { ParagraphElement, PropertiesChangeProps } from '../../../../../types';
import { AppReduxState } from '../../../../../redux/types';

type StateProps = {
  content: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    content: activeItemParams.textContent,
  };
}

type Props = StateProps & PropertiesChangeProps<ParagraphElement>;

const TextContent: React.FC<Props> = ({ content, updateParams }) => {
  const handleTextContentChange = useCallback(
    ({ target: { value } }) => {
      updateParams({ textContent: value });
    },
    [updateParams],
  );

  return (
    <TextField
      variant="outlined"
      value={content}
      onChange={handleTextContentChange}
      label="Text Content"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default connect(mapState)(withConfigurableProperties(TextContent));
