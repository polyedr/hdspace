import React, { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Typography,
  ListItem,
  ListItemText,
  List,
  IconButton,
} from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete } from '@material-ui/lab';
import {
  requestAddTask,
  requestDeleteMemberTask,
  requestEditTask,
} from '@Redux/pmtools/board/actions/tasks';
import { ModalAction } from '@Src/types';
import { PanelTextField } from '@Components/styledComponents';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { selectMembersData } from '@Redux/pmtools/board/selectors';
import { IColumnData, ITaskData } from '@Src/types/pmtools/board';

type Props = {
  show: boolean;
  task?: ITaskData;
  hide: () => void;
  action: ModalAction;
  column: IColumnData;
  selectedTaskId?: string;
};

const TaskModal: React.FC<Props> = ({
  show,
  hide,
  column,
  action,
  selectedTaskId,
  task,
}) => {
  const dispatch = useDispatch();
  const project = useSelector(selectCurrentProjectId);
  const members = useSelector(selectMembersData);
  const [selectedMember, updateSelectedMember] = useState<any>('');
  const [taskUpdateMembers, setTaskUpdateMembers] = useState(
    task?.members || [],
  );
  const [title, setTitle] = useState(task?.name || '');

  const handleCreate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(
      requestAddTask({
        name: title || '',
        id: column.id,
        email: selectedMember?.id || '',
        project,
        action: {
          action: `Task "${title}" was added`,
          platform: 'PM-TOOLS',
          priority: 'medium',
        },
      }),
    );
    hide();
  };

  const handleEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task) {
      dispatch(
        requestEditTask({
          id: selectedTaskId || '',
          name: title,
          email: selectedMember?.id || '',
          project,
          action: {
            action: `Task "${task.name}" was edited on "${title}"`,
            platform: 'PM-TOOLS',
            priority: 'medium',
          },
        }),
      );
    }
    hide();
  };

  const removeHandler = (id: string) => {
    dispatch(requestDeleteMemberTask({ cardId: task?.id || '', userId: id }));
    setTaskUpdateMembers(taskUpdateMembers.filter((e) => e.id !== id));
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
            styledColor="#000"
            multiline
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            inputProps={{ maxLength: 200 }}
          />
          {members.length ? (
            <Autocomplete
              value={selectedMember}
              onChange={(event, newValue: any) => {
                updateSelectedMember(newValue);
              }}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.username
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
          <List>
            {taskUpdateMembers.map((member) => (
              <ListItem key={member.id}>
                <ListItemText
                  primary={member.username}
                  secondary={member.fullName}
                />
                <IconButton onClick={() => removeHandler(member.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>

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
