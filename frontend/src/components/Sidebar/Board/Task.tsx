import { styled } from '@mui/material/styles';
import React, { useCallback, useMemo, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { differenceInDays, format } from 'date-fns';
import { BoardLabel, BoardTask } from '@Redux/pmtools/types';
import { useSelector } from 'react-redux';
import { selectLabels } from '@Redux/pmtools/board/selectors';
import TaskDialog from './TaskDialog';
import User from './User';
import BarIcon from './BarIcon';

const Container = styled('div')<{ dragging: boolean }>(({ dragging }) => ({
  padding: '10px 12px',
  margin: '0 8px 8px',
  backgroundColor: '#FFFFFF',
  boxShadow:
    '0px 0px 1px rgba(42, 42, 45, 0.16), 0px 2px 6px rgba(42, 42, 45, 0.08)',
  flexGrow: 1,
  borderRadius: 4,
  border: `1px solid ${dragging ? '#5064FF' : '#ffffff'}`,

  '&:hover': {
    border: '1px solid #5064FF',
  },

  '&:focus': {
    border: '1px solid #5064FF',
  },
}));

const StyledChip = styled(Chip)({
  backgroundColor: '#F3F4F6',
  fontSize: 12,
  marginBottom: '5px !important',
});

const TimeStack = styled(Stack)<{ priority: boolean }>(({ priority }) => ({
  '& svg': {
    fontSize: 13,
    color: priority ? 'red' : '#81818E',
  },
  '& p': {
    fontSize: 12,
    color: priority ? 'red' : '#81818E',
    lineHeight: 'initial',
  },
}));

interface Props {
  task: BoardTask;
  index: number;
}

const Task: React.FC<Props> = ({ task, index }) => {
  const [showDialog, setShowDialog] = useState(false);

  const labels = useSelector(selectLabels);

  const handleShowDialog = useCallback(
    (show) => () => setShowDialog(show),
    [setShowDialog],
  );

  const selectedLabels = useMemo(() => {
    const mergedLabels = task.label_ids
      .map((id) => labels.find((l) => l.id === id) ?? null)
      .filter((l) => l !== null);

    return mergedLabels.sort((a, b) => (a.text > b.text ? 1 : -1));
  }, [task.label_ids, labels]);

  return (
    <>
      <TaskDialog
        task={task}
        onClose={handleShowDialog(false)}
        open={showDialog}
      />
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided, snapshot) => (
          <Container
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            dragging={snapshot.isDragging}
            onClick={handleShowDialog(true)}
          >
            <Stack
              direction="row"
              spacing={1}
              mb={2}
              justifyContent="space-between"
              alignItems="center"
            >
              {task.title}
              <BarIcon priority={task.priority} />
            </Stack>
            <Stack direction="row" spacing={0.2} mb={2} flexWrap="wrap">
              {selectedLabels.map((label) => (
                <StyledChip
                  key={label.id.toString()}
                  label={label.text}
                  size="small"
                />
              ))}
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              alignItems="flex-end"
              justifyContent="space-between"
            >
              {task.due_date ? (
                <TimeStack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  priority={
                    differenceInDays(Date.parse(task.due_date), new Date()) < 1
                  }
                >
                  <ScheduleIcon fontSize="small" />
                  <p>{format(Date.parse(task.due_date), 'dd MMM')}</p>
                </TimeStack>
              ) : (
                <div />
              )}

              <Stack direction="row" spacing={0.5}>
                {task.assignee ? <User user={task.assignee} /> : null}
                {task.author ? <User user={task.author} /> : null}
              </Stack>
            </Stack>
          </Container>
        )}
      </Draggable>
    </>
  );
};

export default React.memo(Task);
