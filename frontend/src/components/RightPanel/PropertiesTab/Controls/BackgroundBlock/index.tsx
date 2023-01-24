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
import { makeStyles } from '@mui/styles';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Icon,
  Button,
  Theme,
  SelectChangeEvent,
  styled,
} from '@mui/material';
import { enqueueSnackbar } from '@Redux/notification/actions';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllAssetLists,
  selectBackGroundAssetsList,
  selectCurrentAssetListId,
} from '@Redux/project/selectors/asset';
import {
  setBackgroundList,
  uploadElementAsset,
  uploadImageByUrl,
} from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import { URL_REGEX } from '@Constants/defaultParams';
import ColorSettings from '../../helperComponents/ColorSettings';
import PositionSelector, { BackgroundPosition } from './PositionSelector';

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
    // eslint-disable-next-line react/no-unused-prop-types
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

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // padding: '0 16px',
  },
  formControl: {
    '&.MuiFormControl-root': {
      width: '100%',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
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

const ImageIcon = styled(Icon)({
  width: 'auto',
  height: 'auto',
});

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
  const selectAssetValue = useSelector(selectBackGroundAssetsList);
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
  const dispatch = useDispatch();
  const handleImageAssets = () => {
    dispatch(setBackgroundList(true));
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

  const fileSelectorRef = useRef<HTMLInputElement>(null);

  const currentAssetListId = useSelector(selectCurrentAssetListId);

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
      const assetId = listRef.current;
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
    [dispatch, element.id, currentScreenId],
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
    (e: SelectChangeEvent) => {
      updateCSS('backgroundSize', e.target.value);
    },
    [element, currentScreenId],
  );

  const handleChangeBackgroundClip = useCallback(
    (e: SelectChangeEvent) => {
      updateCSS('backgroundClip', e.target.value);
    },
    [element, currentScreenId],
  );

  const handleChangeBackgroundRepeat = useCallback(
    (e: SelectChangeEvent) => {
      updateCSS('backgroundRepeat', e.target.value);
    },
    [element, currentScreenId],
  );

  const handleChangePosition = useCallback(
    (backgroundPosition) => {
      updateCSS('backgroundPosition', backgroundPosition);
    },
    [element, currentScreenId],
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
        <div className={classes.formControl}>
          <InputLabel sx={{ margin: '5px 0' }}>Background Image</InputLabel>
          <div
            className={classes.imageWrapper}
            onClick={handleSelectImage}
            style={{
              backgroundImage,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          >
            {!backgroundImage ? (
              <ImageIcon fontSize="medium">image</ImageIcon>
            ) : null}
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
            color="secondary"
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
        <Button
          component="span"
          style={{
            zIndex: 2,
            color: selectAssetValue ? '#000' : '#81818E',
            fontSize: '12px',
            background: selectAssetValue ? '#F3F4F6' : 'white',
            display: 'flex',
          }}
          onClick={handleImageAssets}
          disabled={!canEdit}
        >
          Upload image to asset list
        </Button>

        <FormControl variant="standard" className={classes.formControl}>
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
        <PositionSelector
          defaultValue={backgroundPosition}
          onChange={handleChangePosition}
          disabled={!canEdit}
        />
        <FormControl variant="standard" className={classes.formControl}>
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
        <FormControl variant="standard" className={classes.formControl}>
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
      {/* <FormControl className={classes.formControl}>
        <InputLabel>Background Type</InputLabel>
        <Select onChange={handleChangeType} value={type}>
          {Object.values(BackgroundType).map((type) => (
            <MenuItem value={type} key={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      <StyledTextField
        fullWidth
        margin="dense"
        label="Background Type"
        value={type}
        onChange={handleChangeType}
        select
        disabled={!canEdit}
      >
        {Object.values(BackgroundType).map((type) => (
          <MenuItem value={type} key={type}>
            {type}
          </MenuItem>
        ))}
      </StyledTextField>

      {renderBackgroundControls()}
    </div>
  );
};

export default function (props) {
  const assetLists = useSelector(selectAllAssetLists);

  if (!assetLists) {
    return null;
  }

  return <BackgroundBlock {...props} assetLists={assetLists} />;
}
