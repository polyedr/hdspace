import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { AccordionDetails, MenuItem } from '@mui/material';
import { useCallback, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  ContextMenu,
  PropertyAccordianSummary,
  PropertyAccordion,
} from '@Components/styledComponents';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';
import { deleteScreenFolder } from '@Redux/project/actions';
import EditScreenFolder from './EditScreenFolder';

const FolderListItem = ({ children, folder, index }) => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const dispatch = useDispatch();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      setContextMenu(
        contextMenu === null
          ? {
              mouseX: e.clientX + 2,
              mouseY: e.clientY - 6,
            }
          : null,
      );
    },
    [contextMenu],
  );

  const handleShowDelete = useCallback(() => {
    setOpenDelete(true);
    handleClose();
  }, []);

  const handleDelete = useCallback(() => {
    dispatch(deleteScreenFolder(folder.id));
  }, [folder]);

  const handleEdit = useCallback(() => {
    handleClose();
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setContextMenu(null);
  }, [setContextMenu]);

  return (
    <>
      <ContextMenu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem onClick={handleShowDelete}>
          <DeleteIcon />
          Delete
        </MenuItem>
      </ContextMenu>

      <EditScreenFolder
        folder={folder}
        open={open}
        onRequestClose={() => setOpen(false)}
      />
      <ConfirmModal
        action={handleDelete}
        show={openDelete}
        hide={() => setOpenDelete(false)}
        elementText="folder"
        actionText="delete"
      />
      <Draggable draggableId={folder.id + '-screen-folder'} index={index}>
        {(provided) => (
          <div {...provided.draggableProps} ref={provided.innerRef}>
            <PropertyAccordion
              {...provided.dragHandleProps}
              onContextMenu={handleContextMenu}
              defaultExpanded
            >
              <PropertyAccordianSummary expandIcon={<ExpandMoreIcon />}>
                {folder.name}
              </PropertyAccordianSummary>
              <AccordionDetails>{children}</AccordionDetails>
            </PropertyAccordion>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default FolderListItem;
