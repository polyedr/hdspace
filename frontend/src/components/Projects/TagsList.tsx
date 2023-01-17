import {
  searchProjects,
  setProjectsSearchParameter,
} from '@Redux/project/actions';
import { ProjectsSearchParameter } from '@Src/types';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { useDispatch } from 'react-redux';

const useStyles = createUseStyles({
  tagsWrapper: {
    marginTop: '5px',
  },
  tag: {
    padding: '5px 5px',
    backgroundColor: '#e0e0e0',
    marginRight: '5px',
    borderRadius: '7px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    '&:last-child': {
      marginRight: '0px',
    },
  },
});
function TagsList({ tags }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleSearchTag = (item: string) => {
    dispatch(setProjectsSearchParameter([ProjectsSearchParameter.tags, item]));
    dispatch(searchProjects());
  };
  return (
    <div className={classes.tagsWrapper}>
      {tags.map((item: string) => {
        const itemWithoutSpace = item.trim();
        return (
          <span
            key={itemWithoutSpace}
            onClick={() => handleSearchTag(itemWithoutSpace)}
            className={classes.tag}
          >
            {itemWithoutSpace}
          </span>
        );
      })}
    </div>
  );
}

export default TagsList;
