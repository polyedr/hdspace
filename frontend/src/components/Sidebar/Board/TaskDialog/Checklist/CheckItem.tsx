import React from 'react';
import {
  Checkbox,
  IconButton,
  List,
  ListItem as MuiListItem,
  ListItemButton as MuiListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  TextField,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const ListItem = styled(MuiListItem)({
  padding: 0,
});

const ListItemButton = styled(MuiListItemButton)({
  padding: 0,
});

const CheckItem = () => {
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <>
            <ListItem
              key={value}
              secondaryAction={
                // <IconButton edge="end" aria-label="comments">
                //   <CommentIcon />
                // </IconButton>

                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton>
                    <CheckIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>
              }
              disablePadding
            >
              <ListItemIcon>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(value)}
                  dense
                >
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                  <ListItemText
                    id={labelId}
                    primary={`Line item ${value + 1}`}
                  />
                  {/* <TextField variant="outlined" size="small" /> */}
                </ListItemButton>
              </ListItemIcon>
            </ListItem>
          </>
        );
      })}
    </List>
  );
};

export default React.memo(CheckItem);
