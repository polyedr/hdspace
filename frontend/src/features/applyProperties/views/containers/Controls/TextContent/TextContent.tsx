import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { AppReduxState } from '../../../../../../shared/types/app';
import { ParagraphElement } from '../../../../../../api/types';
import { selectActiveItemParams } from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';

const styles = require('./TextContent.scss');

type StateProps = {
  content: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveItemParams<ParagraphElement>(state);

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
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Text content</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <textarea
            className={styles.textContentField}
            name="text_content"
            value={content}
            onChange={handleTextContentChange}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(TextContent));
