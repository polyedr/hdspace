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
import { selectTokenPair } from '@Redux/user/selectors';
import { ColumnData } from '@Src/types/pmtools/types';

type Props = {
  show: boolean;
  hide: () => void;
  action: ModalAction;
  column?: ColumnData | null;
};

const ColumnModal: React.FC<Props> = ({ show, hide, action, column }) => {
  const dispatch = useDispatch();
  const projectId = useSelector(selectCurrentProjectId);
  const [title, setTitle] = useState(column?.title || '');
  const [desc, setDesc] = useState(column?.description || '');
  const { access } = useSelector(selectTokenPair);

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title) {
      dispatch(
        requestAddColumn({
          access,
          title,
          projectId,
          description: desc || '',
          action: `Column "${title}" was added`,
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
          access,
          id: column.id,
          title,
          description: desc || '',
          projectId,
          action: `Column "${column.title}" was edited on "${title}"`,
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
            styledcolor="#000"
            onChange={(e: any) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <PanelTextField
            name="description"
            styledcolor="#000"
            value={desc}
            onChange={(e: any) => setDesc(e.target.value)}
            placeholder="Description"
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
