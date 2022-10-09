import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import './UserList.css';

import type { ChannelFilters, UserResponse } from 'stream-chat';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';

import { useSelector } from 'react-redux';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../client';

const StyledTableCell = styled(TableCell)({
  '&.MuiTableCell-root': {
    padding: 12,
    width: '33%',

    '&:first-child': {
      paddingLeft: 0,
      width: '20px',
    },
  },

  '&.MuiTableCell-head': {
    color: '#81818E',
    fontWeight: 500,
    borderWidth: 2,
  },
});

const ListContainer: React.FC = (props) => {
  const { children } = props;

  return (
    <>
      {/* <div className="user-list__container"> */}
      {/* <div className="user-list__header">
        <Checkbox
          sx={{
            color: '#E4E6EB',
            '&.Mui-checked': {
              color: '#5064FF',
            },
          }}
        />
        <p>User</p>
        <p>Role</p>
        <p>Last Active</p>
        {/* <p>Invite</p> 
      </div> */}
      <TableContainer sx={{ margin: '0 20px', width: 'auto' }}>
        <Table
          sx={{ minWidth: 650, borderCollapse: 'inherit' }}
          aria-label="table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell width="20px">
                <Checkbox
                  sx={{
                    color: '#E4E6EB',
                    padding: 0,
                    '&.Mui-checked': {
                      color: '#5064FF',
                    },
                  }}
                />
              </StyledTableCell>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell>Last Active</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      </TableContainer>
      {/* {children}
      </div> */}
    </>
  );
};

type ItemProps = {
  index: number;
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  user: UserResponse<TeamUserType>;
};

const UserItem: React.FC<ItemProps> = (props) => {
  const { index, setSelectedUsers, user } = props;

  const [selected, setSelected] = useState(false);

  const getLastActive = (i: number) => {
    switch (i) {
      case 0:
        return '12 min ago';
      case 1:
        return '27 min ago';
      case 2:
        return '6 hours ago';
      case 3:
        return '14 hours ago';
      case 4:
        return 'Yesterday';
      default:
        return 'Yesterday';
    }
  };

  const handleClick = () => {
    if (selected) {
      setSelectedUsers((prevUsers) =>
        prevUsers?.filter((prevUser) => prevUser !== user.id),
      );
    } else {
      setSelectedUsers((prevUsers) =>
        prevUsers ? [...prevUsers, user.id] : [user.id],
      );
    }
    setSelected(!selected);
  };

  return (
    <>
      {/* <div className="user-item__wrapper" onClick={handleClick}> */}
      <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        onClick={handleClick}
      >
        <StyledTableCell width="20px">
          <Checkbox
            checked={selected}
            sx={{
              color: '#E4E6EB',
              padding: 0,
              '&.Mui-checked': {
                color: '#5064FF',
              },
            }}
          />
        </StyledTableCell>
        <StyledTableCell>
          <div className="user-item__name-wrapper">
            <Avatar image={user.image} name={user.name || user.id} size={32} />
            <p className="user-item__name">{user.name || user.id}</p>
          </div>
        </StyledTableCell>
        <StyledTableCell>Project Manager</StyledTableCell>
        <StyledTableCell>{getLastActive(index)}</StyledTableCell>
      </TableRow>

      {/* <Checkbox
        checked={selected}
        sx={{
          color: '#E4E6EB',
          '&.Mui-checked': {
            color: '#5064FF',
          },
        }}
      />
      <div className="user-item__name-wrapper">
        <Avatar image={user.image} name={user.name || user.id} size={32} />
        <p className="user-item__name">{user.name || user.id}</p>
      </div>
      <p className="user-item__role">Role</p>
      <p className="user-item__last-active">{getLastActive(index)}</p> */}
      {/* {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />} */}
      {/* </div> */}
    </>
  );
};

type Props = {
  filters: ChannelFilters[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[] | undefined>>;
};

export const UserList: React.FC<Props> = (props) => {
  const { filters, setSelectedUsers } = props;

  const projectId = useSelector(selectCurrentProjectId);

  const { client } = useChatContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const [error, setError] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<
    UserResponse<TeamUserType>[] | undefined
  >();

  useEffect(() => {
    const getUsers = async () => {
      if (loading) return;
      setLoading(true);

      try {
        const response = await client.queryUsers(
          {
            id: { $ne: client.userID || '' },
            ...filters,
            teams: { $contains: projectId.toString() },
          },
          { id: 1 },
          { limit: 8 },
        );

        if (response.users.length) {
          setUsers(response.users);
        } else {
          setListEmpty(true);
        }
      } catch (event) {
        setError(true);
      }

      setLoading(false);
    };

    if (client) getUsers();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <ListContainer>
        <div className="user-list__message">
          Error loading, please refresh and try again.
        </div>
      </ListContainer>
    );
  }

  if (listEmpty) {
    return (
      <ListContainer>
        <div className="user-list__message">No users found.</div>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {loading ? (
        <div className="user-list__message">Loading users...</div>
      ) : (
        users?.length &&
        users.map((user, i) => (
          <UserItem
            index={i}
            key={user.id}
            setSelectedUsers={setSelectedUsers}
            user={user}
          />
        ))
      )}
    </ListContainer>
  );
};
