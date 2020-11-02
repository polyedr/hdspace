import React, { useState, useCallback, memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { LIBRARY_ELEMENTS } from '../../../domain/libraryElements/libraryElements';
import Button from '../../UI/Button';
import Icon from '../../UI/Icon';
import UploadFile, { IUploadFile } from '../../UI/UploadFile';
import ActionsBlock from '../ActionsBlock/ActionsBlock';
import {
  getGroupElements,
  IListCategoryEl,
  parseAddElementsTabs,
} from '../../../utils/parseScenario';
import { CreatedElement, ServerStructType } from '../../../redux/project/types';
import {
  MODAL_ADD_ELEMENTS_TABS,
  NNBlockType,
} from '../../../constants/defaultParams';
import {
  selectActiveElement,
  selectCurrentRootId,
  selectCurrentScreen,
  selectIsAddElementsModalOpened,
  selectUploadedImageInfo,
} from '../../../redux/project/selectors';
import {
  uploadFile,
  createElements,
  setIsAddElementsModalOpened,
} from '../../../redux/project/actions';

const styles = require('./ModalAddElements.scss');

export interface IChooseElement {
  funcType: ServerStructType;
  structType: ServerStructType;
  type: string;
}

export type ScenarioStateType = 'scenario_new' | 'scenario_existing';

const ModalAddElements: React.FC = () => {
  const rootId = useSelector(selectCurrentRootId);
  const uploadedImageInfo = useSelector(selectUploadedImageInfo);
  const currentScreen = useSelector(selectCurrentScreen);
  const active = useSelector(selectIsAddElementsModalOpened);
  const activeElement = useSelector(selectActiveElement);

  const [activeTab, setActiveTab] = useState<string>('Containers');
  const [errorMsg, setErrorMsg] = React.useState<string>('');
  const [listElement, setListElement] = useState<IListCategoryEl>({});
  const [selectedElements, setSelectedElements] = useState<CreatedElement[]>(
    [],
  );

  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(setIsAddElementsModalOpened(false));
  }, [dispatch]);
  const [imageToUpload, setUploadImg] = useState<IUploadFile | null>(null);

  const imageURLToAccess =
    uploadedImageInfo && currentScreen.id === uploadedImageInfo.screenID
      ? uploadedImageInfo.imageURL
      : currentScreen.image;

  useEffect(() => {
    if (imageToUpload) {
      dispatch(
        uploadFile(imageToUpload, rootId, NNBlockType.WEBPAGE, {
          screenId: currentScreen.id,
        }),
      );
    }
  }, [dispatch, rootId, imageToUpload, currentScreen.id]);

  useEffect(() => {
    const newListElement = parseAddElementsTabs(LIBRARY_ELEMENTS);
    setListElement(newListElement);
  }, []);

  const handleConfirm = useCallback(
    (event) => {
      event.preventDefault();
      if (!selectedElements.length) {
        setErrorMsg('No items for the scenario.');
      } else {
        setErrorMsg('');
        dispatch(
          createElements(selectedElements, { screenId: currentScreen.id }),
        );
        handleClose();
      }
    },
    [dispatch, selectedElements, currentScreen.id, handleClose],
  );

  const handleCancel = useCallback(() => {
    handleClose();
    setErrorMsg('');
  }, [handleClose]);

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
        ...parseAddElementsTabs(LIBRARY_ELEMENTS),
      };
      setListElement(newListElement);
      setActiveTab(tabName);
      setErrorMsg('');
      setSelectedElements([]);
    },
    [activeTab],
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
            activeItem={activeElement}
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

export default memo(ModalAddElements);
