import React, { useCallback, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Chip, InputBase, Stack } from '@mui/material';
import { IconButton } from './StyledComponents';

const Tags = () => {
  const [showAddTag, setShowAddTag] = useState(false);
  const [value, setValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && value) {
        setTags((tags) => {
          const newTags = [...tags, ...value.split(',').map((v) => v.trim())];
          return [...new Set(newTags)];
        });
        setShowAddTag(false);
        setValue('');
      }
    },
    [value, setValue],
  );

  const handleChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value.trim());
    },
    [setValue],
  );

  const handleDelete = useCallback(
    (index: number) => {
      console.log('index', index);

      setTags((tags) => {
        const newTags = [...tags];
        newTags.splice(index, 1);

        return newTags;
      });
    },
    [setTags],
  );

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {tags.length > 0 ? (
        tags.map((tag, index) => (
          <Chip onDelete={() => handleDelete(index)} key={tag} label={tag} />
        ))
      ) : (
        <span>Add Tag</span>
      )}

      {showAddTag ? (
        <InputBase
          value={value}
          onKeyUp={handleAddTag}
          onChange={handleChangeValue}
          onBlur={() => setShowAddTag(false)}
          autoFocus
          inputProps={{ maxlength: 15 }}
        />
      ) : (
        <IconButton onClick={() => setShowAddTag(true)}>
          <AddIcon />
        </IconButton>
      )}
    </Stack>
  );
};

export default Tags;
