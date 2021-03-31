import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  Input,
} from '@material-ui/core';
import * as Actions from '@Redux/permissions/actions';
import {
  EDITABLE_USER_PERMISSIONS,
  PERMISSION_LABELS,
} from '@Constants/defaultParams';
import { selectUserPermissions } from '@Redux/permissions/selectors';
import { UserProjectPermission } from '@Src/types';
import { selectUserData } from '@Redux/user/selectors';

type Props = {
  userId: string;
  projectId: number;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const PermissionsSelect: React.FC<Props> = (props: Props) => {
  const { userId, projectId } = props;
  const permissions = useSelector(selectUserPermissions(userId));
  const currentUserData = useSelector(selectUserData);
  const dispatch = useDispatch();

  const handlePermissionManagement = (
    newPermissions: UserProjectPermission[],
  ) => {
    dispatch(
      Actions.updateUserPermissionsForProject(
        projectId,
        userId,
        newPermissions,
      ),
    );
  };

  return (
    <Select
      onChange={(e: React.ChangeEvent<any>) => {
        handlePermissionManagement(
          (e.target.value as unknown) as Array<UserProjectPermission>,
        );
      }}
      multiple
      renderValue={(selected) => {
        const selectedPermissions = selected as string[];
        if (selectedPermissions.length) {
          return selectedPermissions.join(', ').replace('_', ' ');
        }
        return 'Not specified';
      }}
      input={<Input placeholder="Not specified" style={{ width: '100%' }} />}
      MenuProps={MenuProps}
      value={
        permissions?.filter((perm) =>
          EDITABLE_USER_PERMISSIONS.includes(perm),
        ) || []
      }
      placeholder="Not specified"
      disabled={userId === currentUserData.id.toString()}
    >
      {EDITABLE_USER_PERMISSIONS.map((perm) => {
        return (
          <MenuItem key={`permission-${perm}`} value={perm}>
            <Checkbox checked={permissions.includes(perm)} />
            <ListItemText primary={PERMISSION_LABELS[perm]} />
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default PermissionsSelect;
