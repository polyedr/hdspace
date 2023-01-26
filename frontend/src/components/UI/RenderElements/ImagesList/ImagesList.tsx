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

const ImagesList = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled, children } = props;
    const [className, groupClass] = element.styles.classNames;
    const classes = useStyles(props);

    const childrenImages = children;

    const childrenStyles = useSelector(
      selectElementsStyles(
        (childrenImages as React.ReactElement[])?.map(
          (item) => item.props.elementId,
        ),
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
          rowHeight="auto"
        >
          {(childrenImages as React.ReactElement[])?.map((item, index) => (
            <ImageListItem
              key={item.key}
              sx={{
                width: childrenStyles[index]?.width || 150,
                height: childrenStyles[index]?.height || 150,
                margin: 1,
              }}
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
