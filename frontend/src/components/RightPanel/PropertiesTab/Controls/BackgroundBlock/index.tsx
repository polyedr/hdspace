/* eslint-disable no-alert */
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  AssetsList,
  ElementTypeName,
  Entity,
  LibraryElement,
  PropertiesChangeProps,
} from '@Src/types';
import { makeStyles, Theme, darken } from '@material-ui/core/styles';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Icon,
  Button,
} from '@material-ui/core';
import { enqueueSnackbar } from '@Redux/notification/actions';

import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllAssetLists,
  selectCurrentAssetListId,
} from '@Redux/project/selectors/asset';
import { uploadElementAsset, uploadImageByUrl } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import { URL_REGEX } from '@Constants/defaultParams';
import ColorSettings from '../../helperComponents/ColorSettings';

interface StyleProperties {
  backgroundColor?: React.CSSProperties['backgroundColor'];
  backgroundImage?: React.CSSProperties['backgroundImage'];
  backgroundPosition?: React.CSSProperties['backgroundPosition'];
  backgroundClip?: React.CSSProperties['backgroundClip'];
  backgroundSize?: React.CSSProperties['backgroundSize'];
  backgroundRepeat?: React.CSSProperties['backgroundRepeat'];
}

type Props = PropertiesChangeProps<LibraryElement<Entity>> &
  StyleProperties & {
    controlName?: string;
    assetLists: AssetsList[];
  };

enum BackgroundType {
  NONE = 'None',
  IMAGE = 'Image',
  COLOR = 'Color',
}

enum BackgroundRepeat {
  NoRepeat = 'No-Repeat',
  Repeat = 'Repeat',
  RepeatX = 'Repeat-X',
  RepeatY = 'Repeat-Y',
  Space = 'Space',
  Round = 'Round',
}

enum BackgroundPosition {
  NONE = 'none',
  TOP_LEFT = 'top left',
  TOP_CENTER = 'top center',
  TOP_RIGHT = 'top right',
  MIDDLE_LEFT = 'center left',
  MIDDLE_CENTER = 'center center',
  MIDDLE_RIGHT = 'center right',
  BOTTOM_LEFT = 'bottom left',
  BOTTOM_CENTER = 'bottom center',
  BOTTOM_RIGHT = 'bottom right',
}

enum BackgroundSize {
  AUTO = 'Auto',
  COVER = 'Cover',
  CONTAIN = 'Contain',
}

enum BackgroundClip {
  NONE = 'None',
  BORDER_BOX = 'Border-Box',
  PADDING_BOX = 'Padding-Box',
  CONTENT_BOX = 'Content-Box',
}

const usePositionSelectorStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    height: 100,
    width: 100,
    background: '#F3F4F6',
    padding: 2,
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    borderRadius: 2,
  },
  button: {
    textIndent: '-1000px',
    border: 'none',
    background: '#E4E6EB',
    outline: 'none',
    margin: 2,
    '&:hover': {
      background: darken('#E4E6EB', 0.1),
    },
    borderRadius: 2,
  },
  active: {
    background: '#5064FF',
    '&:hover': {
      background: '#5064FF',
    },
  },
  buttonSquare: {
    height: 22,
    width: 22,
  },
  fillButton: {
    flex: 1,
  },
  rowWrapper: {
    display: 'flex',
  },
  middleRow: {
    display: 'flex',
    flex: 1,
  },
  middleSideCol: {
    maxWidth: 22,
  },
}));

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: '0 16px',
  },
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  imageWrapper: {
    height: 100,
    width: 100,
    background: '#ddd',
    borderRadius: 10,
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetListsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
  },
  assetsSelector: {
    width: '100%',
  },
  urlContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));

export const PositionButton = ({
  onChange,
  defaultValue,
  disabled = false,
}) => {
  const classes = usePositionSelectorStyles();

  const [activePosition, setActivePosition] = useState(defaultValue || '');

  useEffect(() => {
    setActivePosition(defaultValue);
  }, [defaultValue]);

  const handleChangePosition = useCallback(
    (activePosition) => {
      setActivePosition(activePosition);
      onChange(activePosition);
    },
    [onChange],
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.rowWrapper}>
        <button
          disabled={disabled}
          type="button"
          onClick={() => handleChangePosition(BackgroundPosition.TOP_LEFT)}
          className={classNames(classes.button, classes.buttonSquare, {
            [classes.active]: activePosition === BackgroundPosition.TOP_LEFT,
          })}
        >
          {BackgroundPosition.TOP_LEFT}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleChangePosition(BackgroundPosition.TOP_CENTER)}
          className={classNames(classes.button, classes.fillButton, {
            [classes.active]: activePosition === BackgroundPosition.TOP_CENTER,
          })}
        >
          {BackgroundPosition.TOP_CENTER}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleChangePosition(BackgroundPosition.TOP_RIGHT)}
          className={classNames(classes.button, classes.buttonSquare, {
            [classes.active]: activePosition === BackgroundPosition.TOP_RIGHT,
          })}
        >
          {BackgroundPosition.TOP_RIGHT}
        </button>
      </div>
      <div className={classNames(classes.rowWrapper, classes.middleRow)}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleChangePosition(BackgroundPosition.MIDDLE_LEFT)}
          className={classNames(
            classes.button,
            classes.fillButton,
            classes.middleSideCol,
            {
              [classes.active]:
                activePosition === BackgroundPosition.MIDDLE_LEFT,
            },
          )}
        >
          {BackgroundPosition.MIDDLE_LEFT}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleChangePosition(BackgroundPosition.MIDDLE_CENTER)}
          className={classNames(classes.button, classes.fillButton, {
            [classes.active]:
              activePosition === BackgroundPosition.MIDDLE_CENTER,
          })}
        >
          {BackgroundPosition.MIDDLE_CENTER}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleChangePosition(BackgroundPosition.MIDDLE_RIGHT)}
          className={classNames(
            classes.button,
            classes.fillButton,
            classes.middleSideCol,
            {
              [classes.active]:
                activePosition === BackgroundPosition.MIDDLE_RIGHT,
            },
          )}
        >
          {BackgroundPosition.MIDDLE_RIGHT}
        </button>
      </div>
      <div className={classes.rowWrapper}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleChangePosition(BackgroundPosition.BOTTOM_LEFT)}
          className={classNames(classes.button, classes.buttonSquare, {
            [classes.active]: activePosition === BackgroundPosition.BOTTOM_LEFT,
          })}
        >
          {BackgroundPosition.BOTTOM_LEFT}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleChangePosition(BackgroundPosition.BOTTOM_CENTER)}
          className={classNames(classes.button, classes.fillButton, {
            [classes.active]:
              activePosition === BackgroundPosition.BOTTOM_CENTER,
          })}
        >
          {BackgroundPosition.BOTTOM_CENTER}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleChangePosition(BackgroundPosition.BOTTOM_RIGHT)}
          className={classNames(classes.button, classes.buttonSquare, {
            [classes.active]:
              activePosition === BackgroundPosition.BOTTOM_RIGHT,
          })}
        >
          {BackgroundPosition.BOTTOM_RIGHT}
        </button>
      </div>
    </div>
  );
};

const DEFAULT_BACKGROUND_COLOR = 'transparent';

const BackgroundBlock: React.FC<Props> = ({
  element,
  canEdit,
  assetLists,
  removeStyles,
  updateStyles,
  backgroundColor = DEFAULT_BACKGROUND_COLOR,
  backgroundImage = undefined,
  backgroundSize = BackgroundSize.CONTAIN,
  backgroundPosition = BackgroundPosition.TOP_LEFT,
  backgroundClip = BackgroundClip.NONE,
  backgroundRepeat = BackgroundRepeat.Repeat,
}) => {
  const classes = useStyles();

  const isRootElement = element.name === ElementTypeName.ROOT;

  const defaultBackgroundColor = isRootElement
    ? '#ffffff'
    : DEFAULT_BACKGROUND_COLOR;

  const getBackgroundType = useMemo(() => {
    let initialType = BackgroundType.NONE;

    if (backgroundColor && backgroundColor !== defaultBackgroundColor) {
      initialType = BackgroundType.COLOR;
    }

    if (
      backgroundImage &&
      (backgroundImage !== 'none' ||
        (isRootElement && backgroundColor !== '#fffff'))
    ) {
      initialType = BackgroundType.IMAGE;
    }

    return initialType;
  }, [backgroundColor, backgroundImage, isRootElement]);

  const updateCSS = (property: string, value: string) => {
    updateStyles({ [property]: value });
  };

  const [type, setType] = useState(getBackgroundType);
  const inputUrlRef = useRef<HTMLInputElement | null>(null);

  const [color, handleColorChange] = useDebouncedValueChange(
    backgroundColor,
    (updatedColorValue: string) => {
      updateCSS('backgroundColor', updatedColorValue);
    },
  );

  useEffect(() => {
    setType(getBackgroundType);
  }, [element.id]);

  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();

  const fileSelectorRef = useRef<HTMLInputElement>(null);

  const currentAssetListId = useSelector(selectCurrentAssetListId);

  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const listRef = useRef(
    !currentAssetListId
      ? assetLists[assetLists.length - 1]?.id
      : currentAssetListId,
  );

  const handleChangeType = useCallback(
    (e) => {
      if (
        type === BackgroundType.IMAGE &&
        (!backgroundImage || backgroundImage !== 'none')
      ) {
        if (
          window.confirm('Are you sure want to reset background image styles?')
        ) {
          removeStyles([
            'backgroundImage',
            'backgroundSize',
            'backgroundClip',
            'backgroundPosition',
          ]);

          setType(e.target.value);
        }

        return;
      }

      if (
        type === BackgroundType.COLOR &&
        backgroundColor !== defaultBackgroundColor
      ) {
        if (
          // eslint-disable-next-line no-alert
          window.confirm('Are you sure want to reset background color styles?')
        ) {
          removeStyles(['backgroundColor']);
          setType(e.target.value);
        }

        return;
      }

      setType(e.target.value);
    },
    [setType, type, backgroundColor, backgroundImage, removeStyles],
  );

  const handleChangeFileInput = useCallback(
    ({ target }) => {
      const assetId = selectedAsset || listRef.current;
      if (!assetId) {
        dispatch(
          enqueueSnackbar({
            message: 'Asset list ID is not provided',
            options: { variant: 'error' },
          }),
        );
        return;
      }
      const file = target.files[0];

      if (file.size > 5242880) {
        alert('Choose image up to 5Mb!');
      } else {
        dispatch(
          uploadElementAsset(
            element.id,
            { file, useInBackground: true },
            assetId,
            {
              screenId: currentScreenId,
            },
          ),
        );
      }
    },
    [selectedAsset, dispatch, element.id, currentScreenId],
  );

  const handleUploadFromUrl = useCallback(() => {
    if (!inputUrlRef.current) {
      return;
    }
    const imageUrl = inputUrlRef.current.value;
    if (!imageUrl.trim().length) {
      dispatch(
        enqueueSnackbar({
          message: 'Image URL is not provided',
          options: { variant: 'error' },
        }),
      );
      return;
    }
    if (!imageUrl.match(URL_REGEX)) {
      dispatch(
        enqueueSnackbar({
          message: 'Image URL is incorrect',
          options: { variant: 'error' },
        }),
      );
      return;
    }
    dispatch(
      uploadImageByUrl(
        element.id,
        { url: imageUrl, useInBackground: true },
        assetLists[0].id,
        {
          screenId: currentScreenId,
        },
      ),
    );
    inputUrlRef.current.value = '';
  }, [dispatch, element.id, assetLists, currentScreenId]);

  const handleSelectImage = useCallback(() => {
    fileSelectorRef.current?.click();
  }, []);

  const handleChangeBackgroundSize = useCallback(
    (e: React.ChangeEvent<{ value: unknown }>) => {
      updateCSS('backgroundSize', e.target.value as string);
    },
    [element, currentScreenId],
  );

  const handleChangeBackgroundClip = useCallback(
    (e: React.ChangeEvent<{ value: unknown }>) => {
      updateCSS('backgroundClip', e.target.value as string);
    },
    [element, currentScreenId],
  );

  const handleChangeBackgroundRepeat = useCallback(
    (e: React.ChangeEvent<{ value: unknown }>) => {
      updateCSS('backgroundRepeat', e.target.value as string);
    },
    [element, currentScreenId],
  );

  const handleChangePosition = useCallback(
    (backgroundPosition) => {
      updateCSS('backgroundPosition', backgroundPosition);
    },
    [element, currentScreenId],
  );

  const handleChangeAssetList = useCallback(
    (e: React.ChangeEvent<{ value: unknown }>) => {
      setSelectedAsset(e.target.value as string);
    },
    [setSelectedAsset],
  );

  const renderBackgroundControls = () => {
    if (type === BackgroundType.NONE) {
      return null;
    }

    if (type === BackgroundType.COLOR) {
      return (
        <ColorSettings
          onClick={removeStyles}
          propsToRemove={['backgroundColor']}
          currentColor={color as string}
          activeElementId={element.id}
          onChange={handleColorChange as (color: string) => any}
          disabled={!canEdit}
        />
      );
    }

    return (
      <>
        <div onClick={handleSelectImage} className={classes.formControl}>
          <InputLabel>Background Image</InputLabel>
          <div
            className={classes.imageWrapper}
            style={{ backgroundImage, backgroundPosition: 'cover' }}
          >
            {!backgroundImage ? <Icon fontSize="medium">image</Icon> : null}
          </div>
        </div>

        <div className={classes.urlContainer}>
          <StyledTextField
            type="url"
            label="Upload from URL"
            inputRef={inputUrlRef}
            disabled={!canEdit}
            style={{ width: '100%' }}
          />
          <Button
            variant="contained"
            color="primary"
            component="span"
            style={{
              zIndex: 2,
            }}
            onClick={handleUploadFromUrl}
            disabled={!canEdit}
          >
            Upload
          </Button>
        </div>

        {assetLists.length && canEdit && (
          <div className={classes.assetListsWrapper}>
            <label htmlFor="image-asset-list">Upload image to asset list</label>
            <Select
              defaultValue={listRef.current}
              onChange={handleChangeAssetList}
            >
              {assetLists.map((list) => (
                <MenuItem key={`image-asset-${list.id}`} value={list.id} dense>
                  {list.name}
                </MenuItem>
              ))}
            </Select>
          </div>
        )}
        <FormControl className={classes.formControl}>
          <InputLabel>Background Repeat</InputLabel>
          <Select
            onChange={handleChangeBackgroundRepeat}
            value={backgroundRepeat}
            disabled={!canEdit}
          >
            {Object.values(BackgroundRepeat).map((type) => (
              <MenuItem value={type} key={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <InputLabel>Position</InputLabel>
        <PositionButton
          defaultValue={backgroundPosition}
          onChange={handleChangePosition}
          disabled={!canEdit}
        />
        <FormControl className={classes.formControl}>
          <InputLabel>Background Size</InputLabel>
          <Select
            onChange={handleChangeBackgroundSize}
            value={backgroundSize}
            disabled={!canEdit}
          >
            {Object.values(BackgroundSize).map((type) => (
              <MenuItem value={type} key={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Background Clip</InputLabel>
          <Select
            onChange={handleChangeBackgroundClip}
            value={backgroundClip}
            disabled={!canEdit}
          >
            {Object.values(BackgroundClip).map((type) => (
              <MenuItem value={type} key={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
  };

  return (
    <div className={classes.root}>
      <input
        onChange={handleChangeFileInput}
        ref={fileSelectorRef}
        accept="image/*"
        style={{
          display: 'none',
        }}
        id="upload-image"
        type="file"
        disabled={!canEdit}
      />
      <FormControl className={classes.formControl}>
        <InputLabel>Background Type</InputLabel>
        <Select onChange={handleChangeType} value={type}>
          {Object.values(BackgroundType).map((type) => (
            <MenuItem value={type} key={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {renderBackgroundControls()}
    </div>
  );
};

export default (props) => {
  const assetLists = useSelector(selectAllAssetLists);

  if (!assetLists) {
    return null;
  }

  return <BackgroundBlock {...props} assetLists={assetLists} />;
};
