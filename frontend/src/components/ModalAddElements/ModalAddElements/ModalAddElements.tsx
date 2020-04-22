import React, { useState, useCallback, memo, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';
import { ActionsBlock } from '$components/ModalAddElements/ActionsBlock/ActionsBlock';
import { IUploadFile, UploadFile } from '$components/UI/UploadFile';
import { MODAL_ADD_ELEMENTS_TABS } from '$constants/defaultParams';
import { getGroupElements, IListCategoryEl, parseAddElementsTabs } from '$utils/parseScenario';
import { selectors, actionsCreators } from '$redux/project';
import { AppReduxState } from '$shared/types/app';
import { PropertiesPanelProps } from '$features/applyProperties';
import { ServerStructType } from '$redux/project/types';
import { ElementsToAdd } from '$domain/libraryElements';

const styles = require('./ModalAddElements.scss');

export interface IChooseElement {
  funcType: ServerStructType;
  structType: ServerStructType;
  type: string;
}

function mapStateToProps(state: AppReduxState) {
  return {
    uploadedImageInfo: selectors.selectUploadedImageInfo(state),
    currentScreen: selectors.selectCurrentScreen(state),
  };
}

const mapDispatchToProps = {
  getScreenNN: actionsCreators.getScreenNN,
  uploadImg: actionsCreators.uploadFile,
};

type OwnProps = {
  active: boolean;
  scenarios: PropertiesPanelProps['scenarios'];
  libraryElements: ElementsToAdd;
  onClose(): void;
  onConfirm(elementsToAdd: IChooseElement[]): void;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> & OwnProps;

export type ScenarioStateType = 'scenario_new' | 'scenario_existing';

const Component: React.FunctionComponent<Props> = memo((props) => {
  const {
    active,
    scenarios,
    libraryElements,
    onClose,
    onConfirm,
    getScreenNN,
    uploadImg,
    uploadedImageInfo,
    currentScreen,
  } = props;
  const [activeTab, setActiveTab] = useState<string>('Screen');
  const [errorMsg, setErrorMsg] = React.useState<string>('');
  const [listElement, setListElement] = useState<IListCategoryEl>({});
  const [selectedElements, setSelectedElements] = useState<IChooseElement[]>([]);
  const [scenarioState, setScenarioState] = useState<ScenarioStateType>('scenario_new');
  const [scenarioName, setScenarioName] = React.useState<string>('');
  const [scenarioTypeId, setScenarioTypeId] = React.useState<string | null>(null);
  const [imageToUpload, setUploadImg] = useState<IUploadFile | null>(null);

  const imageURLToAccess = uploadedImageInfo && currentScreen.id === uploadedImageInfo.screenID
    ? uploadedImageInfo.imageURL
    : currentScreen.image;

  useEffect(() => {
    if (imageToUpload) {
      uploadImg({ file: imageToUpload });
    }
  }, [imageToUpload]);

  const handleScenarioStateChange = useCallback((scenarioType: ScenarioStateType) => {
    setScenarioState(scenarioType);
    setErrorMsg('');
  }, [setScenarioState]);

  const handleScenarioTypeChange = useCallback((value: string) => {
    setScenarioTypeId(value);
    setScenarioName('');
    setScenarioState('scenario_existing');
    setErrorMsg('');
  }, [setErrorMsg]);

  const handleScenarioName = useCallback((event) => {
    setScenarioTypeId(null);
    setScenarioName(event.target.value);
    setScenarioState('scenario_new');
    setErrorMsg('');
  }, [setErrorMsg]);

  const handleConfirm = useCallback((event) => {
    event.preventDefault();

    if (scenarioState === 'scenario_existing' && !scenarioTypeId) {
      setErrorMsg('Specify the scenario to add items.');
    } else if (!selectedElements.length) {
      setErrorMsg('No items for the scenario.');
    } else {
      setErrorMsg('');
      setScenarioName('');
      setScenarioTypeId(null);
      onConfirm(selectedElements);
      onClose();
    }
  }, [
    scenarioState, scenarioTypeId, scenarioName, selectedElements,
    onConfirm, onClose,
  ]);

  const handleCancel = useCallback(() => {
    onClose();
    setErrorMsg('');
  }, [onClose]);

  const onModalWrapperClick = useCallback((event) => {
    const modal = event.target.closest('form');

    if (modal) {
      return;
    }

    handleCancel();
  }, [handleCancel]);

  const handleChangeTab = useCallback((tabName) => {
    if (tabName === activeTab) return;

    const newListElement = parseAddElementsTabs(libraryElements);

    setListElement(newListElement);
    setActiveTab(tabName);
    setErrorMsg('');
    setSelectedElements([]);
  }, [activeTab, libraryElements]);

  const getContentStep = useCallback(() => {
    const contentStep = getGroupElements(activeTab, listElement);
    return contentStep;
  }, [activeTab, listElement]);

  return active ? (
    <div
      className={styles.modalWrapper}
      onClick={onModalWrapperClick}
    >
      <form
        className={classNames('showAnimation', styles.modalContainer_addElements)}
        onSubmit={handleConfirm}
      >
        <Button
          styleType="none"
          className={styles.modalCloseButton_addElements}
          onClick={handleCancel}
        >
          <Icon icon="close" size={25} />
        </Button>
        <div className={styles.modalBody_addElements}>
          { activeTab === 'Screen' && (
            <React.Fragment>
              <p className={styles.modalTitle_addElements}>
                Upload UI Drawing or Sketch, or GUI Screenshot, or Document
              </p>
              <div className={styles.modalUploadBlock}>
                <UploadFile
                  active={activeTab === 'Screen'}
                  title="upload my page"
                  uploadFile={setUploadImg}
                />
                <ul className={styles.modalUploadList}>
                  <li className={styles.modalUploadItem}>
                    <Icon icon="modal-icon-file_1" size={20} />
                    <span>Drawings: .png, .jpg, .jpeg, .gif (icon)</span>
                  </li>
                  <li className={styles.modalUploadItem}>
                    <Icon icon="modal-icon-file_1" size={20} />
                    <span>GUI screenshot: .png, .jpg, .jpeg, .gif (icon)</span>
                  </li>
                  <li className={styles.modalUploadItem}>
                    <Icon icon="modal-icon-file_2" size={20} />
                    <span>Document (RAD, Scope Document etc): .doc, .docx, *.pdf (doc icon)</span>
                  </li>
                </ul>
              </div>
              <div>
                Image is processed,  The result of processing will be added automatically on the screen.
              </div>
              {imageURLToAccess && (
                <div>Current screen has screenshot and you can access it by
                  <a target="_blank" href={imageURLToAccess}>this link</a>.
                </div>
              )}
              { /* '-------- TEST RESULT NEURAL NETWORK --------' */ }
              <Button
                type="primary"
                onClick={() => {
                  getScreenNN();
                  onClose();
                }}
              >
                Add Result Neural Network
              </Button>
              { /* '------------------- END -------------------' */ }
              <p className={styles.modalTextDelimiter}>or</p>
            </React.Fragment>
          )}
          <ActionsBlock
            scenarios={scenarios}
            tabs={MODAL_ADD_ELEMENTS_TABS}
            groupElements={getContentStep()}
            activeTab={activeTab}
            selectedElements={selectedElements}
            scenarioTypeId={scenarioTypeId}
            scenarioName={scenarioName}
            libraryElements={libraryElements}
            scenarioState={scenarioState}
            startTemplate="signup"
            changeTab={handleChangeTab}
            setSelectedElements={setSelectedElements}
            changeScenarioType={handleScenarioTypeChange}
            changeScenarioName={handleScenarioName}
            changeScenarioState={handleScenarioStateChange}
          />
          {
            errorMsg && (
              <p className={styles.error_message}>{errorMsg}</p>
            )
          }
        </div>
        <div className={styles.modalActions_addElements}>
          <Button type="submit">
            Approve
          </Button>
        </div>
      </form>
    </div>
  ) : null;
});

export const ModalAddElements = connect(mapStateToProps, mapDispatchToProps)(Component);
