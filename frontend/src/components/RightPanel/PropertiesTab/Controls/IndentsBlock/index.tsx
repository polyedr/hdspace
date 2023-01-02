import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import {
  Entity,
  Indents,
  LibraryElement,
  PropertiesChangeProps,
} from '@Src/types';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { selectCurrentProjectDefaultStyles } from '@Redux/project/selectors/base';
import { InputBase } from '@mui/material';
import RemoveStyles from '../../helperComponents/RemoveStyles';

const initialOnFocusState = {
  marginTop: false,
  marginLeft: false,
  marginBottom: false,
  marginRight: false,
  paddingTop: false,
  paddingLeft: false,
  paddingRight: false,
  paddingBottom: false,
};

const onFocusColor = 'rgba(80, 100, 255, 0.1)';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  controlsContainer: {
    width: '227px',
    height: '124px',
  },
  intentName: {
    fontFamily: 'Roboto',
    fontSize: '10px',
    fontWeight: 400,
    lineHeight: '12px',
    letterSpacing: '0px',
    textAlign: 'left',
    color: '#81818E',
    position: 'absolute',
    left: '60px',
  },
  input: {
    '& .MuiInputBase-input': {
      height: 10,
      fontSize: '0.8em',
      padding: '0.4em',
    },
  },
  numberInput: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    textAlign: 'center',
  },
  sizeContainer: {},
  marginTop: {
    display: 'flex',
  },
  marginRight: {
    position: 'relative',
    left: '199px',
    bottom: '22px',
    width: 'fit-content',
  },
  marginBottom: {
    position: 'relative',
    bottom: '44px',
    width: 'fit-content',
    display: 'flex',
  },
  marginLeft: {
    width: 'fit-content',
    position: 'relative',
    bottom: '168px',
  },
  paddingTop: {
    position: 'relative',
    bottom: '267px',
    left: '25px',
    width: 'fit-content',
    display: 'flex',
  },
  paddingRight: {
    position: 'relative',
    bottom: '289px',
    left: '174px',
    width: 'fit-content',
  },
  paddingBottom: {
    position: 'relative',
    bottom: '311px',
    left: '25px',
    width: 'fit-content',
    display: 'flex',
  },
  paddingLeft: {
    position: 'relative',
    bottom: '385px',
    left: '25px',
    width: 'fit-content',
  },
  topLeftAndRightBottomCorner: {
    borderTop: '24px solid #F3F4F6',
    borderLeft: '24px solid transparent',
    width: 0,
  },
  topRightAndLeftBottomCorner: {
    borderTop: '24px solid #F3F4F6',
    borderRight: '24px solid transparent',
    width: 0,
  },
  rightTopAndBottomLeftCorner: {
    borderBottom: '24px solid #F3F4F6',
    borderLeft: '24px solid transparent',
    width: 0,
  },
  bottomRightAndLeftTopCorner: {
    borderBottom: '24px solid #F3F4F6',
    borderRight: '24px solid transparent',
    width: 0,
  },
  intentsContainer: {
    backgroundColor: '#F3F4F6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalMarginContainer: {
    width: '175px',
    height: '24px',
  },
  verticalMarginContainer: {
    width: '24px',
    height: '74px',
  },
  horizontalPaddingContainer: {
    width: '125px',
    height: '24px',
  },
  verticalPaddingContainer: {
    width: '24px',
    height: '24px',
  },
  blocksContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  marginTop?: React.CSSProperties['marginTop'];
  marginBottom?: React.CSSProperties['marginBottom'];
  marginLeft?: React.CSSProperties['marginLeft'];
  marginRight?: React.CSSProperties['marginRight'];
  paddingTop?: React.CSSProperties['paddingTop'];
  paddingBottom?: React.CSSProperties['paddingBottom'];
  paddingLeft?: React.CSSProperties['paddingLeft'];
  paddingRight?: React.CSSProperties['paddingRight'];
  isDefaultStyles?: boolean;
};

const IndentsBlock: React.FC<Props> = ({
  element,
  updateStyles,
  removeStyles,
  masterScreenEnabled,
  editableStyles,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  canEdit,
  isDefaultStyles = false,
}) => {
  const defaultStyles = useSelector(selectCurrentProjectDefaultStyles);
  const classes = useStyles();
  const [state, setState] = useState<Indents | null>(null);

  useEffect(() => {
    const styles = isDefaultStyles
      ? defaultStyles?.indents
      : {
          marginTop,
          marginLeft,
          marginBottom,
          marginRight,
          paddingTop,
          paddingLeft,
          paddingRight,
          paddingBottom,
        };
    setState(styles as Indents);
  }, [
    marginTop,
    marginLeft,
    marginBottom,
    marginRight,
    paddingTop,
    paddingLeft,
    paddingBottom,
    paddingRight,
    defaultStyles,
    isDefaultStyles,
  ]);

  const debouncedValueChange = useDebouncedCallback((name, value) => {
    updateStyles({ [name]: value });
  }, 500);

  const handleChange = ({ target: { value, name } }) => {
    let val;
    if (
      name === 'paddingTop' ||
      name === 'paddingBottom' ||
      name === 'paddingRight' ||
      name === 'paddingLeft'
    ) {
      if (value < 0) {
        val = 0;
      } else {
        val = value;
      }
    } else {
      val = value;
    }
    setState({ ...state, [name]: val } as Indents);
    debouncedValueChange.callback(name, `${val}px`);
  };

  const [isFocusActive, setIsFocusActive] = useState(initialOnFocusState);

  return (
    <div className={classes.container}>
      {!isDefaultStyles && !masterScreenEnabled && canEdit && (
        <RemoveStyles
          onClick={removeStyles}
          propsToRemove={[
            'marginTop',
            'marginRight',
            'marginBottom',
            'marginLeft',
            'paddingTop',
            'paddingRight',
            'paddingBottom',
            'paddingLeft',
          ]}
          type={element.type}
          editableStyles={editableStyles}
        />
      )}

      <div className={classes.controlsContainer}>
        <div className={classes.marginTop}>
          <div
            className={classes.topLeftAndRightBottomCorner}
            style={{
              borderTopColor: isFocusActive.marginTop ? onFocusColor : '',
            }}
          />
          <div
            className={cn(
              classes.intentsContainer,
              classes.horizontalMarginContainer,
              classes.blocksContainer,
            )}
            style={{
              backgroundColor: isFocusActive.marginTop ? onFocusColor : '',
            }}
          >
            <div className={classes.intentName}>Margin</div>
            <InputBase
              title="Margin top"
              name="marginTop"
              type="number"
              margin="none"
              className={classes.input}
              onFocus={() =>
                setIsFocusActive({ ...isFocusActive, marginTop: true })
              }
              onBlur={() =>
                setIsFocusActive({ ...isFocusActive, marginTop: false })
              }
              inputProps={{ className: classes.numberInput }}
              disabled={!canEdit}
              placeholder="0"
              value={(state && parseInt(state.marginTop as string)) || ''}
              onChange={handleChange}
            />
          </div>
          <div
            className={classes.topRightAndLeftBottomCorner}
            style={{
              borderTopColor: isFocusActive.marginTop ? onFocusColor : '',
            }}
          />
        </div>

        <div className={classes.marginRight}>
          <div
            className={classes.rightTopAndBottomLeftCorner}
            style={{
              borderBottomColor: isFocusActive.marginRight ? onFocusColor : '',
            }}
          />
          <div
            style={{
              backgroundColor: isFocusActive.marginRight ? onFocusColor : '',
            }}
            className={cn(
              classes.intentsContainer,
              classes.verticalMarginContainer,
              classes.blocksContainer,
            )}
          >
            <InputBase
              title="Margin right"
              name="marginRight"
              type="number"
              margin="none"
              className={classes.input}
              inputProps={{ className: classes.numberInput }}
              onFocus={() =>
                setIsFocusActive({ ...isFocusActive, marginRight: true })
              }
              onBlur={() =>
                setIsFocusActive({ ...isFocusActive, marginRight: false })
              }
              placeholder="0"
              value={(state && parseInt(state.marginRight as string)) || ''}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div
            className={classes.topLeftAndRightBottomCorner}
            style={{
              borderTopColor: isFocusActive.marginRight ? onFocusColor : '',
            }}
          />
        </div>

        <div className={classes.marginBottom}>
          <div
            className={classes.rightTopAndBottomLeftCorner}
            style={{
              borderBottomColor: isFocusActive.marginBottom ? onFocusColor : '',
            }}
          />
          <div
            style={{
              backgroundColor: isFocusActive.marginBottom ? onFocusColor : '',
            }}
            className={cn(
              classes.intentsContainer,
              classes.horizontalMarginContainer,
              classes.blocksContainer,
            )}
          >
            <InputBase
              title="Margin bottom"
              name="marginBottom"
              type="number"
              margin="none"
              className={classes.input}
              inputProps={{ className: classes.numberInput }}
              onFocus={() =>
                setIsFocusActive({ ...isFocusActive, marginBottom: true })
              }
              onBlur={() =>
                setIsFocusActive({ ...isFocusActive, marginBottom: false })
              }
              placeholder="0"
              value={(state && parseInt(state.marginBottom as string)) || ''}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div
            className={classes.bottomRightAndLeftTopCorner}
            style={{
              borderBottomColor: isFocusActive.marginBottom ? onFocusColor : '',
            }}
          />
        </div>

        <div className={classes.marginLeft}>
          <div
            className={classes.bottomRightAndLeftTopCorner}
            style={{
              borderBottomColor: isFocusActive.marginLeft ? onFocusColor : '',
            }}
          />
          <div
            style={{
              backgroundColor: isFocusActive.marginLeft ? onFocusColor : '',
            }}
            className={cn(
              classes.intentsContainer,
              classes.verticalMarginContainer,
              classes.blocksContainer,
            )}
          >
            <InputBase
              title="Margin left"
              name="marginLeft"
              type="number"
              margin="none"
              inputProps={{ className: classes.numberInput }}
              className={classes.input}
              onFocus={() =>
                setIsFocusActive({ ...isFocusActive, marginLeft: true })
              }
              onBlur={() =>
                setIsFocusActive({ ...isFocusActive, marginLeft: false })
              }
              placeholder="0"
              value={(state && parseInt(state.marginLeft as string)) || ''}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div
            className={classes.topRightAndLeftBottomCorner}
            style={{
              borderTopColor: isFocusActive.marginLeft ? onFocusColor : '',
            }}
          />
        </div>

        <div className={classes.paddingTop}>
          <div
            className={classes.topLeftAndRightBottomCorner}
            style={{
              borderTopColor: isFocusActive.paddingTop ? onFocusColor : '',
            }}
          />
          <div
            style={{
              backgroundColor: isFocusActive.paddingTop ? onFocusColor : '',
            }}
            className={cn(
              classes.intentsContainer,
              classes.horizontalPaddingContainer,
              classes.blocksContainer,
            )}
          >
            <div
              className={classes.intentName}
              style={{
                left: '20px',
              }}
            >
              Padding
            </div>
            <InputBase
              title="Padding top"
              name="paddingTop"
              type="number"
              margin="none"
              inputProps={{ className: classes.numberInput }}
              className={classes.input}
              onFocus={() =>
                setIsFocusActive({ ...isFocusActive, paddingTop: true })
              }
              onBlur={() =>
                setIsFocusActive({ ...isFocusActive, paddingTop: false })
              }
              placeholder="0"
              value={(state && parseInt(state.paddingTop as string)) || ''}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div
            className={classes.topRightAndLeftBottomCorner}
            style={{
              borderTopColor: isFocusActive.paddingTop ? onFocusColor : '',
            }}
          />
        </div>

        <div className={classes.paddingRight}>
          <div
            className={classes.rightTopAndBottomLeftCorner}
            style={{
              borderBottomColor: isFocusActive.paddingRight ? onFocusColor : '',
            }}
          />
          <div
            style={{
              backgroundColor: isFocusActive.paddingRight ? onFocusColor : '',
            }}
            className={cn(
              classes.intentsContainer,
              classes.verticalPaddingContainer,
              classes.blocksContainer,
            )}
          >
            <InputBase
              title="Padding right"
              name="paddingRight"
              type="number"
              margin="none"
              inputProps={{ className: classes.numberInput }}
              className={classes.input}
              onFocus={() =>
                setIsFocusActive({ ...isFocusActive, paddingRight: true })
              }
              onBlur={() =>
                setIsFocusActive({ ...isFocusActive, paddingRight: false })
              }
              placeholder="0"
              value={(state && parseInt(state.paddingRight as string)) || ''}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div
            className={classes.topLeftAndRightBottomCorner}
            style={{
              borderTopColor: isFocusActive.paddingRight ? onFocusColor : '',
            }}
          />
        </div>

        <div className={classes.paddingBottom}>
          <div
            className={classes.rightTopAndBottomLeftCorner}
            style={{
              borderBottomColor: isFocusActive.paddingBottom
                ? onFocusColor
                : '',
            }}
          />
          <div
            style={{
              backgroundColor: isFocusActive.paddingBottom ? onFocusColor : '',
            }}
            className={cn(
              classes.intentsContainer,
              classes.horizontalPaddingContainer,
              classes.blocksContainer,
            )}
          >
            <InputBase
              title="Padding bottom"
              name="paddingBottom"
              type="number"
              margin="none"
              className={classes.input}
              inputProps={{ className: classes.numberInput }}
              onFocus={() =>
                setIsFocusActive({ ...isFocusActive, paddingBottom: true })
              }
              onBlur={() =>
                setIsFocusActive({ ...isFocusActive, paddingBottom: false })
              }
              placeholder="0"
              value={(state && parseInt(state.paddingBottom as string)) || ''}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div
            className={classes.bottomRightAndLeftTopCorner}
            style={{
              borderBottomColor: isFocusActive.paddingBottom
                ? onFocusColor
                : '',
            }}
          />
        </div>

        <div className={classes.paddingLeft}>
          <div
            className={classes.bottomRightAndLeftTopCorner}
            style={{
              borderBottomColor: isFocusActive.paddingLeft ? onFocusColor : '',
            }}
          />
          <div
            style={{
              backgroundColor: isFocusActive.paddingLeft ? onFocusColor : '',
            }}
            className={cn(
              classes.intentsContainer,
              classes.verticalPaddingContainer,
              classes.blocksContainer,
            )}
          >
            <InputBase
              title="Padding left"
              name="paddingLeft"
              type="number"
              margin="none"
              className={classes.input}
              inputProps={{ className: classes.numberInput }}
              onFocus={() =>
                setIsFocusActive({ ...isFocusActive, paddingLeft: true })
              }
              onBlur={() =>
                setIsFocusActive({ ...isFocusActive, paddingLeft: false })
              }
              placeholder="0"
              value={(state && parseInt(state.paddingLeft as string)) || ''}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div
            className={classes.topRightAndLeftBottomCorner}
            style={{
              borderTopColor: isFocusActive.paddingLeft ? onFocusColor : '',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default IndentsBlock;
