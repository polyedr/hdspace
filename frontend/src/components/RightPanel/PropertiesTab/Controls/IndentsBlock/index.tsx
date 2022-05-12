import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import {
  Entity,
  Indents,
  LibraryElement,
  PropertiesChangeProps,
} from '@Src/types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { selectCurrentProjectDefaultStyles } from '@Redux/project/selectors/base';
import { InputBase } from '@material-ui/core';
import RemoveStyles from '../../helperComponents/RemoveStyles';

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

  const debounced = useDebouncedCallback((name, value) => {
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
    debounced.callback(name, `${val}px`);
  };
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
        <div className={cn(classes.marginTop)}>
          <div className={cn(classes.topLeftAndRightBottomCorner)} />
          <div
            className={cn(
              classes.intentsContainer,
              classes.horizontalMarginContainer,
              classes.blocksContainer,
            )}
          >
            <div className={classes.intentName}>Margin</div>
            <InputBase
              title="Margin top"
              name="marginTop"
              type="number"
              margin="none"
              className={cn(classes.input)}
              inputProps={{ className: classes.numberInput }}
              disabled={!canEdit}
              placeholder="0"
              value={(state && parseInt(state.marginTop as string)) || null}
              onChange={handleChange}
            />
          </div>
          <div className={cn(classes.topRightAndLeftBottomCorner)} />
        </div>

        <div className={cn(classes.marginRight)}>
          <div className={cn(classes.rightTopAndBottomLeftCorner)} />
          <div
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
              className={cn(classes.input)}
              inputProps={{ className: classes.numberInput }}
              placeholder="0"
              value={(state && parseInt(state.marginRight as string)) || null}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={classes.topLeftAndRightBottomCorner} />
        </div>

        <div className={cn(classes.marginBottom)}>
          <div className={cn(classes.rightTopAndBottomLeftCorner)} />
          <div
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
              className={cn(classes.input)}
              inputProps={{ className: classes.numberInput }}
              placeholder="0"
              value={(state && parseInt(state.marginBottom as string)) || null}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={cn(classes.bottomRightAndLeftTopCorner)} />
        </div>

        <div className={cn(classes.marginLeft)}>
          <div className={cn(classes.bottomRightAndLeftTopCorner)} />
          <div
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
              className={cn(classes.input)}
              placeholder="0"
              value={(state && parseInt(state.marginLeft as string)) || null}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={cn(classes.topRightAndLeftBottomCorner)} />
        </div>

        <div className={cn(classes.paddingTop)}>
          <div className={cn(classes.topLeftAndRightBottomCorner)} />
          <div
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
              className={cn(classes.input)}
              placeholder="0"
              value={(state && parseInt(state.paddingTop as string)) || null}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={cn(classes.topRightAndLeftBottomCorner)} />
        </div>

        <div className={cn(classes.paddingRight)}>
          <div className={cn(classes.rightTopAndBottomLeftCorner)} />
          <div
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
              className={cn(classes.input)}
              placeholder="0"
              value={(state && parseInt(state.paddingRight as string)) || null}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={classes.topLeftAndRightBottomCorner} />
        </div>

        <div className={cn(classes.paddingBottom)}>
          <div className={cn(classes.rightTopAndBottomLeftCorner)} />
          <div
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
              className={cn(classes.input)}
              inputProps={{ className: classes.numberInput }}
              placeholder="0"
              value={(state && parseInt(state.paddingBottom as string)) || null}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={cn(classes.bottomRightAndLeftTopCorner)} />
        </div>

        <div className={cn(classes.paddingLeft)}>
          <div className={cn(classes.bottomRightAndLeftTopCorner)} />
          <div
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
              className={cn(classes.input)}
              inputProps={{ className: classes.numberInput }}
              placeholder="0"
              value={(state && parseInt(state.paddingLeft as string)) || null}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={classes.topRightAndLeftBottomCorner} />
        </div>
      </div>
    </div>
  );
};

export default IndentsBlock;
