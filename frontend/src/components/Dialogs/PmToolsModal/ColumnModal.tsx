import React, { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@material-ui/core';
import { ModalAction } from '@Src/types';
import {
  requestAddColumn,
  requestEditColumn,
} from '@Redux/pmtools/board/actions/columns';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { PanelTextField } from '@Components/styledComponents';
import { IColumnData } from '@Src/types/pmtools/board';

type Props = {
  show: boolean;
  hide: () => void;
  action: ModalAction;
  column?: IColumnData | null;
};

const ColumnModal: React.FC<Props> = ({ show, hide, action, column }) => {
  const dispatch = useDispatch();
  const project = useSelector(selectCurrentProjectId);
  const [title, setTitle] = useState(column?.name || '');

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title) {
      dispatch(
        requestAddColumn({
          name: title,
          project,
          action: {
            action: `Column "${title}" was added`,
            platform: 'PM-TOOLS',
            priority: 'high',
          },
        }),
      );
      hide();
    }
  };

  const handleEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title && column) {
      dispatch(
        requestEditColumn({
          id: column.id,
          name: title,
          project,
          action: {
            action: `Column "${column.name}" was edited on "${title}"`,
            platform: 'PM-TOOLS',
            priority: 'high',
          },
        }),
      );
      hide();
    }
  };

  const handleClose = () => {
    hide?.();
    setTitle(column?.name || '');
  };

  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogContent>
        <h2>
          {action === ModalAction.Create ? 'Create column' : 'Edit column'}
        </h2>
        <form
          onSubmit={action === ModalAction.Create ? handleSave : handleEdit}
        >
          <PanelTextField
            name="title"
            value={title}
            multiline
            required
            styledColor="#000"
            onChange={(e: any) => setTitle(e.target.value)}
            placeholder="Title"
            inputProps={{ maxLength: 35 }}
          />
          <DialogActions>
            <Button type="submit" color="secondary" variant="contained">
              {action === ModalAction.Create ? 'create' : 'edit'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

ColumnModal.defaultProps = {
  column: null,
};

export default ColumnModal;
