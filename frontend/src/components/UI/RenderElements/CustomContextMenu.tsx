import { State } from '@Components/Editor/Workspace/ElementsInteractions/Crumb/BorderCrumb';
import { Menu, MenuItem } from '@mui/material';
import { copyActiveElement, pasteCopiedElement } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import React, { forwardRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type Props = React.PropsWithChildren<any>;

const initialState: State = {
  mouseX: null,
  mouseY: null,
};

const CustomContextMenu = (Component) => {
  const [state, setState] = useState(initialState);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const dispatch = useDispatch();

  return forwardRef<unknown, Props>((props, ref) => {
    const pasteToBoard = () => {
      dispatch(pasteCopiedElement({ screenId: currentScreenId }));
      setState(initialState);
    };

    const copyToClipBoard = () => {
      const copyText = JSON.stringify(props?.element);
      navigator.clipboard.writeText(copyText);

      dispatch(copyActiveElement());
      setState(initialState);
    };

    return (
      <>
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
        <div
          data-id="test_contexgt"
          onContextMenu={(e) => {
            e.preventDefault();
            setState({
              mouseX: e.clientX + 214,
              mouseY: e.clientY + 44,
            });
          }}
        >
          <Component {...props} ref={ref} />
        </div>
      </>
    );
  });
};

export default CustomContextMenu;
