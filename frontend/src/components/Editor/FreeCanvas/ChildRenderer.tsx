import React from 'react';
import { useSelector } from 'react-redux';
// import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectElementById } from '../../../redux/project/selectors';

/* const useStyles = makeStyles({
  root: {
    border: (props: any) => `1px solid ${props.isActive ? 'red' : 'black'}`,
    backgroundColor: '#fff',
    padding: '0.5rem 1rem',
    cursor: 'move',
  },
}); */

type Props = {
  id: string;
};

const ChildRenderer: React.FC<Props> = ({ id }) => {
  const element = useSelector(selectElementById(id));

  if (!element) return null;

  return (
    <div>
      {element.children.map((childId) => (
        <ChildRenderer id={childId} key={childId} />
      ))}
    </div>
  );
};

export default ChildRenderer;
