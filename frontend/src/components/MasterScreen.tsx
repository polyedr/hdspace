import { makeButton } from '@Domain/libraryElements/formElements/formElements';
import { selectProjectClasses } from '@Redux/project/selectors/base';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import Button from './UI/RenderElements/Button/Button';

const masterButton = makeButton();
console.log(masterButton);

const MasterScreen: FC = () => {
  const defaultStyles = useSelector(selectProjectClasses);

  return (
    <div>
      <Button
        active
        className="test"
        contentEditable={false}
        groupClass="test"
        id="test-id-button"
        isDisabled={false}
        ownStyles={{}}
        params={{
          textContent: 'test',
          showRipple: true,
        }}
      >
        <div>test1</div>
        <div>test</div>
      </Button>
      <pre>{JSON.stringify(defaultStyles, null, 2)}</pre>
    </div>
  );
};

export default MasterScreen;
