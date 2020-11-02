import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { AppReduxState } from '../../../../../../shared/types/app';
import { ParagraphElement } from '../../../../../../api/types';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';

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
    <div>
      <h4>Text content</h4>

      <textarea
        name="text_content"
        value={content}
        onChange={handleTextContentChange}
      />
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(TextContent));
