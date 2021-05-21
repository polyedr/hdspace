/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { useDrag } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import AspectRatioRoundedIcon from '@material-ui/icons/AspectRatioRounded';
// import { useSelector } from 'react-redux';
// import { selectCurrentRootId } from '@Redux/project/selectors/element';
// import { WindowContext } from '@Components/Editor/FrameWrapper/FrameContext';
import { BoundingStyles, Entity } from '@Src/types';

type Props = {
  type: Entity | 'none';
  styles: BoundingStyles;
};

const useStyles = makeStyles({
  root: ({ styles }: Props) => ({
    position: 'absolute',
    backgroundColor: 'transparent',
    top: styles.top + styles.height,
    left: styles.left + styles.width,
    border: 0,
    margin: 0,
    padding: 0,
  }),
});

const Resizer = (props: Props) => {
  const classes = useStyles(props);
  const { type } = props;

  const [, drag] = useDrag({
    item: {
      type,
      drop: () => {
        console.log('DROP!!');
      },
      hover: () => {
        console.log('HOVER!!');
      },
    },
    begin: () => {
      console.log('BEGIN!!');
    },
  });

  return (
    <div style={{ position: 'relative' }}>
      <div
        className={classes.root}
        ref={(dom: HTMLDivElement) => {
          if (!dom) {
            return;
          }
          drag(dom);
        }}
      >
        <AspectRatioRoundedIcon fontSize="inherit" />
      </div>
    </div>
  );
};

export default Resizer;
