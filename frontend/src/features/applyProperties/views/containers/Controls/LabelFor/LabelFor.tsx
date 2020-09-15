import React, { memo } from 'react';
import { connect } from 'react-redux';
import ControlTitle from '../../../components/ControlTitle/ControlTitle';
import { DropDown } from '../../../../../../components/UI/DropDown';
import { AppReduxState } from '../../../../../../shared/types/app';
import { getElementsArray } from '../../../../../../utils/ElementsTreeHelper';
import sharedClasses from '../../../../../../styles/sharedClasses';
import { LabelElement } from '../../../../../../api/types';
import {
  selectActiveItemParams,
  selectCurrentRootElement,
} from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';

const styles = require('./LabelFor.scss');

type StateProps = {
  labelFor: string;
  inputsIDs: string[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveItemParams<LabelElement>(state);
  const elements = getElementsArray(selectCurrentRootElement(state));

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
