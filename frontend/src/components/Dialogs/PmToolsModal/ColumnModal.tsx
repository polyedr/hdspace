import React, { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@material-ui/core';
import { ModalAction } from '@Src/types/types';
import {
  requestAddColumn,
  requestEditColumn,
} from '@Redux/pmtools/board/actions/columns';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { PanelTextField } from '@Components/styledComponents';
import { ColumnData } from '@Src/types/pmtools/types';

type Props = {
  show: boolean;
  hide: () => void;
  action: ModalAction;
  column?: ColumnData | null;
};

const ColumnModal: React.FC<Props> = ({ show, hide, action, column }) => {
  const dispatch = useDispatch();
  const project = useSelector(selectCurrentProjectId);
  const [title, setTitle] = useState(column?.title || '');
  const [desc, setDesc] = useState(column?.description || '');

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title) {
      dispatch(
        requestAddColumn({
          title,
          project,
          description: desc || '',
          action: `Column "${title}" was added`,
          platform: 'PM-TOOLS',
          priority: 'high',
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
          title,
          description: desc || '',
          project,
          action: `Column "${column.title}" was edited on "${title}"`,
          platform: 'PM-TOOLS',
          priority: 'high',
        }),
      );
      hide();
    }
  };

  return (
    <Dialog open={show} onClose={hide}>
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
            styledcolor="#000"
            onChange={(e: any) => setTitle(e.target.value)}
            placeholder="Title"
            inputProps={{ maxLength: 35 }}
          />
          <PanelTextField
            name="description"
            styledcolor="#000"
            value={desc}
            multiline
            required
            onChange={(e: any) => setDesc(e.target.value)}
            placeholder="Description"
            inputProps={{ maxLength: 200 }}
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
