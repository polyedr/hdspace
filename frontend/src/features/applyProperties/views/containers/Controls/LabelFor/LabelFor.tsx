import React, { memo } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import sharedClasses from '$styles/sharedClasses';
import { LabelElement } from '$api/types';
import { getElementsArray } from '$utils/ElementsTreeHelper';

import ControlTitle from '../../../components/ControlTitle/ControlTitle';

const styles = require('./LabelFor.scss');

type StateProps = {
  labelFor: string;
  inputsIDs: string[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams<LabelElement>(
    state,
  );
  const elements = getElementsArray(selectors.selectRootElement(state));

  const inputsIDs = Object.values(elements)
    .filter(
      (element) =>
        element.type === 'textinput' ||
        element.type === 'textarea' ||
        element.type === 'select' ||
        element.type === 'radiobutton' ||
        element.type === 'checkbox',
    )
    .map((element) => element.id);

  return {
    inputsIDs,
    labelFor: activeItemParams.labelFor,
  };
}

type Props = StateProps & PropertiesChangeProps<LabelElement>;

const LabelFor: React.FC<Props> = ({ labelFor, inputsIDs, updateParams }) => {
  const options = [
    { label: 'No for attribute', value: 'no for attribute' },
    ...inputsIDs.map((id) => ({ label: id, value: id })),
  ];

  const handleDropdownChange = (value: string) => {
    updateParams({ labelFor: value });
  };

  return (
    <section className={sharedClasses.propsSection}>
      <header className={styles.header}>
        <ControlTitle content="For attribute" />
      </header>
      <div className={sharedClasses.propsContent}>
        <div className={sharedClasses.propsContainer}>
          <DropDown
            options={options}
            defaultValue={labelFor}
            value={labelFor}
            onChange={handleDropdownChange}
          />
        </div>
      </div>
    </section>
  );
};

export default connect(mapState)(withConfigurableProperties(memo(LabelFor)));
