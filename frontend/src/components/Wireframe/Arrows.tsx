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
      {links.map((c) => {
        const start = getRef(
          `element-${c.elementId}`,
        ) as React.RefObject<unknown>;
        const end = getRef(
          `screen-${c.destinationScreenId}`,
        ) as React.RefObject<unknown>;

        if (!start || !end) {
          return null;
        }

        return (
          <Xarrow
            key={c.elementId.toString()}
            color="#000"
            strokeWidth={1.5}
            start={start as any}
            path="grid"
            tailShape="circle"
            showTail
            tailSize={3}
            zIndex={0}
            end={end as any}
          />
        );
      })}
    </>
  );
};

export default Arrows;
