import { useSelector } from 'react-redux';
import Xarrow from 'react-xarrows';
import { selectScreenLinks } from '@Redux/wireframe/selectors';

interface Props {
  getRef: (key: string) => void | React.RefObject<unknown>;
}

const Arrows: React.FunctionComponent<Props> = ({ getRef }) => {
  const links = useSelector(selectScreenLinks);

  return (
    <>
      {links.map((c) => (
        <Xarrow
          key={c.elementId.toString()}
          color="#000"
          strokeWidth={1.5}
          start={getRef(`element-${c.elementId}`) as React.RefObject<unknown>}
          path="grid"
          tailShape="circle"
          showTail
          tailSize={3}
          zIndex={0}
          end={
            getRef(
              `screen-${c.destinationScreenId}`,
            ) as React.RefObject<unknown>
          }
        />
      ))}
    </>
  );
};

export default Arrows;
