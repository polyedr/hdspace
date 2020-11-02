import React, { memo } from 'react';
import { connect } from 'react-redux';
import { HEADING_TYPE, HEADING_SETTINGS } from './constants';
import { DropDown } from '../../../../../../components/UI/DropDown';
import {
  HeadingElement,
  HeadingType as HeadingTagType,
} from '../../../../../../api/types';
import { AppReduxState } from '../../../../../../shared/types/app';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';

type StateProps = {
  headingType: HeadingTagType;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    headingType: activeItemParams.headingType,
  };
}

type Props = StateProps & PropertiesChangeProps<HeadingElement>;

const HeadingType: React.FC<Props> = ({
  headingType,
  updateParams,
  updateStyles,
}) => {
  const handleDropdownChange = (value: string) => {
    const newHeadingType = value as HeadingTagType;

    updateParams({ headingType: newHeadingType });
    updateStyles({ 'font-size': HEADING_SETTINGS[newHeadingType].fontSize });
  };

  return (
    <div>
      <h4>Heading type</h4>

      <DropDown
        options={HEADING_TYPE}
        defaultValue={headingType}
        value={headingType}
        onChange={handleDropdownChange}
      />
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(memo(HeadingType)));
