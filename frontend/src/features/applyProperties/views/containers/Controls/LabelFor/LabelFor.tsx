import React, { memo } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { ElementParameters } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import {
  withConfigurableProperties,
  PropertiesChangeProps
} from '$utils/withConfigurableProperties';
import { sharedClasses } from '$styles/sharedClasses';

import { ControlTitle } from '../../../components/ControlTitle/ControlTitle';
const styles = require('./LabelFor.scss');

type StateProps = {
  labelFor?: string;
  inputsIDs: number[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as ElementParameters;
  const elements = selectors.selectScenariosElements(state);

  const inputsIDs = Object.values(elements)
    .filter((element) =>
      element.struct_type === "textinput" ||
      element.struct_type === "textarea" ||
      element.struct_type === "select" ||
      element.struct_type === 'radiobutton' ||
      element.struct_type === 'checkbox')
    .map(element => element.id);

  return {
    inputsIDs,
    labelFor: activeItemParams.labelFor,
  };
}

type Props = StateProps & PropertiesChangeProps;

const LabelFor: React.FC<Props> = memo((props) => {
  const { labelFor, inputsIDs, updateParams } = props;

  const options = [
    { label: 'No for attribute', value: 'no for attribute' },
    ...inputsIDs.map((id => ({ label: `${id}e`, value: `${id}e` })))
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
});

const Component = connect(mapState)(withConfigurableProperties(LabelFor));
export { Component as LabelFor };
