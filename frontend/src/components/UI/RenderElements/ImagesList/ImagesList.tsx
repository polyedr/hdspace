import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { makeComponentStyles } from '@Components/UI/RenderElements/styles';
import { RendererProps } from '@Components/UI/RenderElements/types';
import cn from 'classnames';
import { selectElementsStyles } from '@Redux/project/selectors/element';
import { useSelector } from 'react-redux';

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

    const childrenStyles = useSelector(
      selectElementsStyles(
        childrenImages.map((item) => {
          // @ts-ignore
          return item.props.elementId;
        }),
      ),
    );

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
            !isDisabled && classes.ownPseudoStyles,
          )}
          sx={{
            width: element.styles.ownStyles.width || 500,
            height: element.styles.ownStyles.height || 450,
          }}
          cols={element.parameters.columns}
          rowHeight={164}
        >
          {childrenImages?.map((item, index) => {
            return (
              <ImageListItem
                key={item.key}
                sx={{
                  width: childrenStyles[index]?.width,
                  height: childrenStyles[index]?.height,
                  margin: 1,
                }}
              >
                {item}
              </ImageListItem>
            );
          })}
        </ImageList>
      </div>
    );
  },
);

export default ImagesList;
