/* eslint-disable react/jsx-props-no-spreading */
import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  requestAddTask,
  requestEditTask,
} from '@Redux/pmtools/board/actions/tasks';
import { ModalAction } from '@Src/types/types';
import { PanelTextField } from '@Components/styledComponents';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { ColumnData, MemberData, TaskData } from '@Src/types/pmtools/types';
import { selectTokenPair } from '@Redux/user/selectors';

type Props = {
  members: Array<MemberData>;
  show: boolean;
  task?: TaskData | null;
  hide: () => void;
  action: ModalAction;
  column: ColumnData;
  selectedTaskId?: number | null;
};

const TaskModal: React.FC<Props> = ({
  members,
  show,
  hide,
  column,
  action,
  selectedTaskId,
  task,
}) => {
  const [member, setMember] = useState<any>(members[0] || '');
  const project = useSelector(selectCurrentProjectId);
  const dispatch = useDispatch();
  const [title, setTitle] = useState(task?.title || '');
  const [disc, setDisc] = useState(task?.description || '');
  const { access } = useSelector(selectTokenPair);

  useEffect(() => {
    setMember(members[0]);
  }, [members]);

  const handleCreate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title) {
      dispatch(
        requestAddTask({
          title,
          access,
          description: disc,
          status: 'created',
          column: column.id || 0,
          creator: member?.status || '',
          owner: member?.user?.id || null,
          project,
          action: `Task "${title}" was added`,
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
          access,
          title,
          description: disc,
          creator: member.status || '',
          owner: member.user.id || '',
          status: task.isCompleted ? 'completed' : 'created',
          column: column?.id || 0,
          project,
          action: `Task "${task.title}" was edited on "${title}"`,
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
            onChange={(e: any) => setDisc(e.target.value)}
            placeholder="Discription"
          />

          {members.length ? (
            <Autocomplete
              value={member}
              onChange={(event, newValue) => {
                setMember(newValue);
              }}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.user.username
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
