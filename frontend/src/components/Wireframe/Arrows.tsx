import { useSelector } from 'react-redux';
import Xarrow from 'react-xarrows';
import { selectScreenLinks } from '@Redux/wireframe/selectors';

const Arrows: React.FC = ({ children }) => {
  const links = useSelector(selectScreenLinks);

  return (
    <>
      {children}
      {links.map((c) => (
        <Xarrow
          key={c.elementId.toString()}
          color="#000"
          strokeWidth={1.5}
          start={'element-link-' + c.elementId.toString()}
          path="grid"
          tailShape="circle"
          tailSize={20}
          zIndex={0}
          end={`wireframe-screen-${c.destinationScreenId}`}
        />
      ))}
    </>
  );
};

export default Arrows;
