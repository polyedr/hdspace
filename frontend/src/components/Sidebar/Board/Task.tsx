import { styled } from '@mui/material/styles';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import { format } from 'date-fns';

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

const Task = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
          dragging={snapshot.isDragging}
        >
          <Stack
            direction="row"
            spacing={1}
            mb={2}
            justifyContent="space-between"
            alignItems="center"
          >
            {task.title}
            <SignalCellularAltIcon />
          </Stack>
          <Stack direction="row" spacing={0.2} mb={2}>
            <StyledChip label="Tag 1" size="small" />
            <StyledChip label="Tag 2" size="small" />
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
                priority
              >
                <ScheduleIcon fontSize="small" />
                <p>{format(Date.parse(task.due_date), 'dd MMM')}</p>
              </TimeStack>
            ) : (
              <div />
            )}

            <Stack direction="row" spacing={0.5}>
              <Avatar
                sx={{
                  bgcolor: deepOrange[500],
                  width: 24,
                  height: 24,
                  fontSize: 12,
                  lineHeight: 0.8,
                }}
                alt="Remy Sharp"
                src="/broken-image.jpg"
              >
                B
              </Avatar>
              <Avatar
                sx={{
                  bgcolor: deepOrange[500],
                  width: 24,
                  height: 24,
                  fontSize: 12,
                  lineHeight: 0.8,
                }}
                alt="Remy Sharp"
                src="/broken-image.jpg"
              />
              <Avatar
                src="/broken-image.jpg"
                sx={{ width: 24, height: 24, fontSize: 12, lineHeight: 0.8 }}
              />
            </Stack>
          </Stack>
        </Container>
      )}
    </Draggable>
  );
};

export default React.memo(Task);
