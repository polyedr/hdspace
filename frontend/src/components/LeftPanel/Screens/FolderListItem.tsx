import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { MenuItem, styled } from '@mui/material';
import { useCallback, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ContextMenu } from '@Components/styledComponents';
import EditScreenFolder from './EditScreenFolder';

const FolderHandler = styled('h3')({
  padding: '8px 20px',
  backgroundColor: '#f1f1f1',
  margin: 0,
  fontSize: 12,
});

const FolderListItem = ({ children, folder, index }) => {
  const [open, setOpen] = useState(false);

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

  const handleDelete = useCallback(() => {
    handleClose();
  }, []);

  const handleEdit = useCallback(() => {
    handleClose();
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setContextMenu(null);
  }, [setContextMenu]);

  return (
    <>
      <EditScreenFolder
        folder={folder}
        open={open}
        onRequestClose={() => setOpen(false)}
      />
      <Draggable draggableId={folder.id + '-screen-folder'} index={index}>
        {(provided) => (
          <div {...provided.draggableProps} ref={provided.innerRef}>
            <FolderHandler
              {...provided.dragHandleProps}
              onContextMenu={handleContextMenu}
            >
              {folder.name}
            </FolderHandler>
            {children}

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
              <MenuItem onClick={handleDelete}>
                <DeleteIcon />
                Delete
              </MenuItem>
            </ContextMenu>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default FolderListItem;
