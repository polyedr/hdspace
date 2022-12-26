/* eslint-disable react/no-unused-prop-types */
import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { BoundingStyles, StateElement } from '@Src/types';
import {
  makeButtons,
  setTextContent,
} from '@Src/domain/libraryElements/generatorElements/generatorElements';
import {
  setMasterSourceElementId,
  copyActiveElement,
  deleteElement,
  pasteCopiedElement,
  setActiveElement,
  updateMultipleElementsStyles,
  updateElementParameters,
  softDeleteMultipleElements,
  createElements,
} from '@Redux/project/actions';
import { ALL_ELEMENTS_INDEX } from '@Constants/defaultParams';
import {
  selectCurrentGeneratorElements,
  selectCurrentRootId,
} from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

import { makeStyles } from '@material-ui/core/styles';
import { Menu, MenuItem } from '@mui/material';
import Icon from '../../../../UI/Icon';

type Props = {
  element: StateElement;
  show: boolean;
  currentProjectId: number;
  rootId: string;
  styles: BoundingStyles;
  children?: any;
  masterScreenId: number | null;
};

export type State = {
  mouseX: number | null;
  mouseY: number | null;
};

const useStyles = makeStyles((theme) => ({
  crumb: ({ styles, element, rootId }: Props & { rootId: string }) => ({
    top: element.id === rootId ? styles.top : styles.top + styles.height - 1,
    left: element.id === rootId ? 'auto' : styles.left,
    right: element.id === rootId ? styles.right : 'auto',
    zIndex: 9999999,
    fontFamily: 'Roboto',
    position: 'absolute',
    padding: '2px 4px',
    fontSize: '12px',
    lineHeight: 1,
    color: theme.palette.common.white,
    background: '#5A899D',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }),
  label: {
    display: 'block',
    padding: '0 3px',
  },
  sourceLabel: {
    padding: '0 3px',
    cursor: 'pointer',
    '&:before': {
      content: '|',
    },
  },
  separator: {
    margin: '0 3px',
  },
  icon: {
    cursor: 'pointer',
    paddingTop: '1px',
  },
}));

const BorderCrumb: React.FC<Props> = (props) => {
  const initialState: State = {
    mouseX: null,
    mouseY: null,
  };

  const borderRef = useRef(null);

  const { element, children, show, currentProjectId, masterScreenId } = props;
  const currentGeneratorElements = useSelector(selectCurrentGeneratorElements);
  const rootId = useSelector(selectCurrentRootId);
  const [state, setState] = useState(initialState);

  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles(props);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleSourceElementClick = useCallback(() => {
    dispatch(setMasterSourceElementId(element.parameters.sourceElementId));
    history.push(`/project/${currentProjectId}/${masterScreenId}`);
  }, [
    currentProjectId,
    dispatch,
    element.parameters.sourceElementId,
    history,
    masterScreenId,
  ]);

  const handleDelete = () => {
    dispatch(deleteElement(element.id, { screenId: currentScreenId }));
  };

  const generatorRandom = () => {
    if (element.name === 'generator') {
      if (currentGeneratorElements && currentGeneratorElements.length > 2) {
        const keys = Object.keys(
          currentGeneratorElements[0].styles.ownStyles,
        ).filter((key) => {
          let count = 0;
          for (let i = 1; i < currentGeneratorElements.length; i++) {
            if (
              currentGeneratorElements[0].styles.ownStyles[key] ===
              currentGeneratorElements[i].styles.ownStyles[key]
            )
              count++;
          }
          return count === currentGeneratorElements.length - 1;
        });
        const predefinedStyles = {};
        keys.forEach((key) => {
          predefinedStyles[key] =
            currentGeneratorElements[0].styles.ownStyles[key];
        });
        const newButtons = makeButtons(predefinedStyles);
        if (
          keys.length ===
          Object.keys(newButtons[0].styles.ownStyles).length - 1
        ) {
          const { id, type, name, parameters, styles } =
            currentGeneratorElements[0];
          const createdElementsData = {
            createdElements: [
              {
                id,
                type,
                name: `generated ${name}`,
                custom: false,
                parameters,
                shared: true,
                styles,
              },
            ],
            parentId: rootId,
          };
          dispatch(
            createElements(createdElementsData, { screenId: currentScreenId }),
          );
          const removalElements = currentGeneratorElements.slice(
            1,
            currentGeneratorElements.length,
          );
          const removalIds = removalElements.map((element) => element.id);
          dispatch(
            softDeleteMultipleElements([...removalIds], {
              screenId: currentScreenId,
            }),
          );
        } else {
          currentGeneratorElements.forEach((element, index) => {
            dispatch(
              updateMultipleElementsStyles(
                [element.id],
                {
                  [ALL_ELEMENTS_INDEX]: newButtons[index].styles.ownStyles,
                },
                { screenId: currentScreenId },
              ),
            );
            const value = setTextContent();
            let count = 0;
            for (let i = 1; i < currentGeneratorElements.length; i++) {
              if (
                currentGeneratorElements[0].parameters.textContent ===
                currentGeneratorElements[i].parameters.textContent
              )
                count++;
            }
            if (count !== currentGeneratorElements.length - 1) {
              dispatch(
                updateElementParameters(
                  element.id,
                  { textContent: value.toString() },
                  {
                    screenId: currentScreenId,
                  },
                ),
              );
            }
          });
        }
      }
    }
  };

  const pasteToBoard = () => {
    // navigator.clipboard.readText().then((result) => {
    //   const data = JSON.parse(result);
    dispatch(pasteCopiedElement({ screenId: currentScreenId }));
    // });
    setState(initialState);
  };

  const copyToClipBoard = () => {
    const copyText = JSON.stringify(element);
    navigator.clipboard.writeText(copyText);

    dispatch(copyActiveElement());
    setState(initialState);
  };

  const handleDuplicate = () => {
    dispatch(copyActiveElement());
    dispatch(setActiveElement(String(element.parent)));
    dispatch(pasteCopiedElement({ screenId: currentScreenId }));
  };

  return element && show ? (
    <>
      <div
        ref={borderRef}
        onContextMenu={(e) => {
          e.preventDefault();

          setState({
            mouseX: e.clientX + 214,
            mouseY: e.clientY + 44,
          });
        }}
        className={cn(classes.crumb)}
      >
        {state.mouseX && (
          <Menu
            onClose={() => setState(initialState)}
            open={state?.mouseY !== null}
            anchorReference="anchorPosition"
            anchorPosition={
              state.mouseY !== null && state.mouseX !== null
                ? { top: state.mouseY, left: state.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={copyToClipBoard}>Copy</MenuItem>
            <MenuItem onClick={pasteToBoard}>Paste</MenuItem>
          </Menu>
        )}
        <span
          className={classes.label}
          data-label-id={element.id}
          data-element-name={element.name}
        >
          {element.name}
        </span>
        {element.type !== 'root' && element.name.indexOf('Master') < 0 && (
          <>
            <span className={classes.icon} onClick={handleDuplicate}>
              <Icon icon="copy" size={16} color="white" />
            </span>
            <span className={classes.icon} onClick={handleDelete}>
              <Icon icon="delete" size={16} color="white" />
            </span>
            {/* <span className={classes.icon} onClick={copyToClipBoard}>
              <Icon icon="copy" size={16} color="white" />
            </span> */}
            {element.name === 'generator' && (
              <span className={classes.icon} onClick={generatorRandom}>
                <Icon icon="add" size={16} color="white" />
              </span>
            )}
          </>
        )}

        {element.parameters.sourceElementId && (
          <>
            <span className={classes.separator}>|</span>
            <span
              className={classes.sourceLabel}
              onClick={() => handleSourceElementClick()}
            >
              source
            </span>
          </>
        )}
        {children}
      </div>
    </>
  ) : null;
};

export default memo(BorderCrumb);
