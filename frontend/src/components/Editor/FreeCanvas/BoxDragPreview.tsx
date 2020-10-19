import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectElementById } from '../../../redux/project/selectors';

const useStyles = makeStyles({
  root: {
    width: (props: any) => props.width,
    height: (props: any) => props.height,
    border: '1px solid red',
    backgroundColor: '#fff',
  },
});

const BoxDragPreview: React.FC<{ id: string }> = memo(({ id }) => {
  const element = useSelector(selectElementById(id));

  const {
    parameters: { width = 300, height = 100 },
  } = element;
  const { root } = useStyles({ width, height });

  return <div className={root}>{element.name}</div>;
});

export default BoxDragPreview;
