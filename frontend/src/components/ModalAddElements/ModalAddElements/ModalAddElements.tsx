import React, { useState, useCallback, memo, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { LibraryElements } from 'src/domain/libraryElements/libraryElements';
import Button from '../../UI/Button';
import Icon from '../../UI/Icon';
import UploadFile, { IUploadFile } from '../../UI/UploadFile';
import ActionsBlock from '../ActionsBlock/ActionsBlock';
import {
  getGroupElements,
  IListCategoryEl,
  parseAddElementsTabs,
} from '../../../utils/parseScenario';
import { AppReduxState } from '../../../shared/types/app';
import {
  CreatedElement,
  ServerStructType,
  StateElement,
} from '../../../redux/project/types';
import { MODAL_ADD_ELEMENTS_TABS } from '../../../constants/defaultParams';
import {
  selectCurrentScreen,
  selectUploadedImageInfo,
} from '../../../redux/project/selectors';
import { uploadFile, createElements } from '../../../redux/project/actions';

const styles = require('./ModalAddElements.scss');

export interface IChooseElement {
  funcType: ServerStructType;
  structType: ServerStructType;
  type: string;
}

function mapStateToProps(state: AppReduxState) {
  return {
    uploadedImageInfo: selectUploadedImageInfo(state),
    currentScreen: selectCurrentScreen(state),
  };
}

const mapDispatchToProps = {
  uploadImg: uploadFile,
  createElements,
};

type OwnProps = {
  activeItem: StateElement;
  active: boolean;
  libraryElements: LibraryElements;
  onClose(): void;
};

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

export type ScenarioStateType = 'scenario_new' | 'scenario_existing';

const ModalAddElements: React.FunctionComponent<Props> = ({
  activeItem,
  active,
  libraryElements,
  onClose,
  createElements,
  uploadImg,
  uploadedImageInfo,
  currentScreen,
}) => {
  const [activeTab, setActiveTab] = useState<string>('Containers');
  const [errorMsg, setErrorMsg] = React.useState<string>('');
  const [listElement, setListElement] = useState<IListCategoryEl>({});
  const [selectedElements, setSelectedElements] = useState<CreatedElement[]>(
    [],
  );
  const [imageToUpload, setUploadImg] = useState<IUploadFile | null>(null);

  const imageURLToAccess =
    uploadedImageInfo && currentScreen.id === uploadedImageInfo.screenID
      ? uploadedImageInfo.imageURL
      : currentScreen.image;

  useEffect(() => {
    if (imageToUpload) {
      uploadImg(imageToUpload, { screenId: currentScreen.id });
    }
  }, [imageToUpload, currentScreen.id]);

  useEffect(() => {
    const newListElement = parseAddElementsTabs(libraryElements);
    setListElement(newListElement);
  }, [libraryElements]);

  const handleConfirm = useCallback(
    (event) => {
      event.preventDefault();
      if (!selectedElements.length) {
        setErrorMsg('No items for the scenario.');
      } else {
        setErrorMsg('');
        createElements(selectedElements, { screenId: currentScreen.id });
        onClose();
      }
    },
    [selectedElements, onClose, currentScreen.id],
  );

  const handleCancel = useCallback(() => {
    onClose();
    setErrorMsg('');
  }, [onClose]);

  const onModalWrapperClick = useCallback(
    (event) => {
      const modal = event.target.closest('form');

      if (modal) {
        return;
      }

      handleCancel();
    },
    [handleCancel],
  );

  const handleChangeTab = useCallback(
    (tabName) => {
      if (tabName === activeTab) return;
      const newListElement = {
        ...parseAddElementsTabs(libraryElements),
        // ...parseAddCustomElementsTabs(customLibraryElements),
      };
      setListElement(newListElement);
      setActiveTab(tabName);
      setErrorMsg('');
      setSelectedElements([]);
    },
    [activeTab, libraryElements],
  );

  const getContentStep = useCallback(() => {
    return Object.keys(listElement).length
      ? getGroupElements(activeTab, listElement)
      : [];
  }, [activeTab, listElement]);

  return active ? (
    <div className={styles.modalWrapper} onClick={onModalWrapperClick}>
      <form
        className={classNames(
          'showAnimation',
          styles.modalContainer_addElements,
        )}
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
          <p className={styles.modalTitle_addElements}>
            Upload UI Drawing or Sketch, or GUI Screenshot, or Document
          </p>
          <div className={styles.modalUploadBlock}>
            <UploadFile title="upload my page" uploadFile={setUploadImg} />
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
                <span>
                  Document (RAD, Scope Document etc): .doc, .docx, *.pdf (doc
                  icon)
                </span>
              </li>
            </ul>
          </div>
          <div>
            Image is processed, The result of processing will be added
            automatically on the screen.
          </div>
          {imageURLToAccess && (
            <div>
              Current screen has screenshot and you can access it by
              <a target="_blank" rel="noreferrer" href={imageURLToAccess}>
                this link
              </a>
              .
            </div>
          )}
          <p className={styles.modalTextDelimiter}>or</p>
          <ActionsBlock
            activeItem={activeItem}
            tabs={MODAL_ADD_ELEMENTS_TABS}
            groupElements={getContentStep()}
            activeTab={activeTab}
            selectedElements={selectedElements}
            changeTab={handleChangeTab}
            setSelectedElements={setSelectedElements}
          />
          {errorMsg && <p className={styles.error_message}>{errorMsg}</p>}
        </div>
        <div className={styles.modalActions_addElements}>
          <Button type="submit">Approve</Button>
        </div>
      </form>
    </div>
  ) : null;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(memo(ModalAddElements));
