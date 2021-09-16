import { PanelTextField } from '@Components/styledComponents';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
} from '@material-ui/core';
import { ModalAction } from '@Src/types';
import React, { ChangeEvent } from 'react';

type Props = {
  show: boolean;
  action: ModalAction;
  permissions: boolean;
  close: () => void;
  save: (e: React.FormEvent<HTMLFormElement>) => void;
  edit: (e: React.FormEvent<HTMLFormElement>) => void;
  memberData: {
    role: string;
    status: string;
  };
  changePermissions: (e: boolean) => void;
  changeRole: (e: any) => void;
};

const MembersModal: React.FC<Props> = ({
  show,
  action,
  close,
  save,
  edit,
  memberData,
  permissions,
  changePermissions,
  changeRole,
}) => (
  <Dialog open={show} onClose={close}>
    <DialogContent>
      <h2>{action === ModalAction.Create ? 'Add Members' : 'Edit Members'}</h2>
      <form onSubmit={action === ModalAction.Create ? save : edit}>
        <PanelTextField
          name="role"
          value={memberData.role}
          onChange={(e: any) => changeRole(e.target.value)}
          styledcolor="#000"
          inputProps={{
            maxLength: 20,
          }}
        />
        {action === ModalAction.Edit && (
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  changePermissions(e.target.checked)
                }
                checked={permissions}
                name="edit_project"
              />
            }
            label="Edit Project"
          />
        )}
        <Button type="submit" color="secondary" variant="contained">
          {action === ModalAction.Create ? 'Add' : 'Save'}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
);

export default MembersModal;
