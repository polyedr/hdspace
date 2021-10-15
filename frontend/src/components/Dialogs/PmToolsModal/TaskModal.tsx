/* eslint-disable react/jsx-props-no-spreading */
import React, { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  requestAddTask,
  requestEditTask,
} from '@Redux/pmtools/board/actions/tasks';
import { ModalAction, PermissionsUserData } from '@Src/types/types';
import { PanelTextField } from '@Components/styledComponents';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { ColumnData, TaskData } from '@Src/types/pmtools/types';

type Props = {
  show: boolean;
  task?: TaskData | null;
  hide: () => void;
  action: ModalAction;
  column: ColumnData;
  selectedTaskId?: number | null;
  members: Array<PermissionsUserData & { id: string }>;
};

const TaskModal: React.FC<Props> = ({
  show,
  hide,
  column,
  action,
  selectedTaskId,
  task,
  members,
}) => {
  const [member, setMember] = useState(members[0] || '');
  const project = useSelector(selectCurrentProjectId);
  const dispatch = useDispatch();
  const [title, setTitle] = useState(task?.title || '');
  const [disc, setDisc] = useState(task?.description || '');
  const [isDone, setDone] = useState(task?.isCompleted || false);

  const handleCreate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title) {
      dispatch(
        requestAddTask({
          title,
          description: disc,
          status: 'created',
          column: column.id || 0,
          creator: '',
          owner: member.userData.id,
          project,
          action: `Task "${title}" was added`,
          platform: 'PM-TOOLS',
          priority: 'medium',
        }),
      );
    }
    hide();
  };

  const handleEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title && task) {
      dispatch(
        requestEditTask({
          id: selectedTaskId || 0,
          title,
          description: disc,
          creator: '',
          owner: member.userData.id,
          status: isDone ? 'completed' : 'created',
          column: column?.id || 0,
          project,
          action: `Task "${task.title}" was edited on "${title}"`,
          platform: 'PM-TOOLS',
          priority: 'medium',
        }),
      );
    }

    hide();
  };

  return (
    <Dialog open={show} onClose={hide}>
      <DialogContent>
        <h2>{action === ModalAction.Create ? 'Create task' : 'Edit task'}</h2>
        <form
          onSubmit={action === ModalAction.Create ? handleCreate : handleEdit}
        >
          <PanelTextField
            name="title"
            styledcolor="#000"
            multiline
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            inputProps={{ maxLength: 30 }}
          />
          <PanelTextField
            name="discription"
            styledcolor="#000"
            multiline
            required
            value={disc}
            onChange={(e) => setDisc(e.target.value)}
            placeholder="Discription"
          />

          <FormControlLabel
            label="Completed"
            control={
              <Checkbox checked={isDone} onChange={() => setDone(!isDone)} />
            }
          />

          {members.length ? (
            <Autocomplete
              value={member}
              onChange={(event, newValue: any) => {
                setMember(newValue);
              }}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.userData.username
              }
              id="controllable-states-demo"
              options={members}
              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" />
              )}
            />
          ) : (
            <Typography variant="subtitle2" gutterBottom component="div">
              Note: If you want to add a user, add team members
            </Typography>
          )}

          <DialogActions>
            <Button type="submit" color="secondary" variant="contained">
              {action === ModalAction.Create ? 'Create' : 'Edit'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
