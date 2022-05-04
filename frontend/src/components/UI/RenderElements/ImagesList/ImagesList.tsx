import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { makeComponentStyles } from '@Components/UI/RenderElements/styles';
import { RendererProps } from '@Components/UI/RenderElements/types';
import cn from 'classnames';

const useStyles = makeComponentStyles('imagesList', {
  imagesList: {
    width: '500px',
    height: '450px',
  },
});

type ChildrenImage = Element & { key: string };

const ImagesList = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled, children } = props;
    const [className, groupClass] = element.styles.classNames;
    const classes = useStyles(props);

    const childrenImages = (children as unknown) as ChildrenImage[];

    return (
      <div
        ref={ref}
        className={cn(
          className,
          groupClass,
          classes.ownStyles,
          classes.imagesList,
          !isDisabled && classes.ownPseudoStyles,
        )}
      >
        <ImageList
          className={cn(
            className,
            groupClass,
            classes.ownStyles,
            classes.imagesList,
            !isDisabled && classes.ownPseudoStyles,
          )}
          cols={element.parameters.columns}
          rowHeight={164}
        >
          {childrenImages?.map((item) => (
            <ImageListItem
              key={item.key}
              sx={{ width: '150px', height: '150px' }}
            >
              {item}
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    );
  },
);

export default ImagesList;
