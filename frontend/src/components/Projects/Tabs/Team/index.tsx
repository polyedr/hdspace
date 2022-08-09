import React from 'react';
// import {
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Avatar,
//   Grid,
// } from '@mui/material';
import { Grid, Avatar, Switch } from '@mui/material';
import Label from '@Components/UI/RenderElements/Label/Label';
import DeleteIcon from '@mui/icons-material/Delete';
// import { ServerProject } from '@Src/types';

// type PropsType = {
//   project: ServerProject['id'];
//   userData: any;
//   permissions: Array<string>;
// };

// const useStyles = makeStyles((theme) => ({
//   action: {
//     maxWidth: '270px',
//     margin: '10px 0',
//     wordWrap: 'break-word',
//     fontSize: 14,
//   },
//   description: {
//     color: '#81818E',
//     fontSize: 12,
//   },
//   time: {
//     fontSize: 12,
//     color: '#81818E',
//   },
//   title: {
//     marginRight: theme.spacing(1),
//   },
// }));

const TeamMember: React.FC = () => {
  // const classes = useStyles();
  // const TeamMember: React.FC<PropsType> = ({ userData, permissions }) => {
  //   const { username, id, profile } = userData;
  //   const rights = !!permissions.find((p: string) => p === 'change_project');

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={8} md={4}>
          <span>Member</span>
        </Grid>
        <Grid item xs={8} md={3}>
          <span>Email</span>
        </Grid>
        <Grid item xs={4} md={3}>
          Role
        </Grid>
        <Grid item xs={4} md={1}>
          Guest
        </Grid>
        <Grid item xs={4} md={1}>
          Actions
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          <p>Aleksandra Sayapina</p>
        </Grid>
        <Grid item xs={3}>
          <p>alexandra.sayapina@alignedcode.com</p>
          {/* <ListItem button key={id} style={{ padding: 0 }}>
            <ListItemAvatar>
              <Avatar
                src={
                  typeof profile.parameters.avatarCrop === 'string'
                    ? profile.parameters.avatarCrop
                    : ''
                }
                alt={username}
                sx={{ bgcolor: '#344AF0' }}
              >
                {username[0].toUpperCase()}
              </Avatar>
            </ListItemAvatar>
          </ListItem> */}
        </Grid>
        <Grid item xs={3}>
          <p>Project Manager</p>
          {/* <ListItemText
            primary={profile.role}
            secondary={username}
            secondaryTypographyProps={{ style: { color: '#fff' } }}
            primaryTypographyProps={{ style: { fontSize: '14px' } }}
          /> */}
        </Grid>
        <Grid item xs={1}>
          <Switch {...Label} defaultChecked />
        </Grid>
        <Grid item xs={1}>
          <DeleteIcon color="action" />
        </Grid>
      </Grid>
      {/* <ListItem button key={id} style={{ padding: 0 }}>
        <ListItemAvatar>
          <Avatar
            src={
              typeof profile.parameters.avatarCrop === 'string'
                ? profile.parameters.avatarCrop
                : ''
            }
            alt={username}
            sx={{ bgcolor: '#344AF0' }}
          >
            {username[0].toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={profile.role}
          secondary={username}
          secondaryTypographyProps={{ style: { color: '#fff' } }}
          primaryTypographyProps={{ style: { fontSize: '14px' } }}
        />
        <p style={{ fontSize: 10 }}>{rights ? 'READ, WRITE' : 'READ'}</p>
      </ListItem> */}
    </>
  );
};

export default TeamMember;
