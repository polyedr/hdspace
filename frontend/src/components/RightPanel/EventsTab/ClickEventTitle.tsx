import React, { FC } from 'react';
import { ElementClickEvent } from '@Src/types';
import { useSelector } from 'react-redux';
import { selectScreenById } from '@Redux/project/selectors/screen';

type Props = {
  eventData: ElementClickEvent['data'];
};

const ClickEventTitle: FC<Props> = ({
  eventData: { screenId, url, linkType },
}) => {
  const screen = useSelector(
    selectScreenById(+screenId.split('/').reverse()[0]),
  );

  return (
    <div>
      {`Click: to `}

      {linkType === 'external' ? url : screen.name}
    </div>
  );
};

export default ClickEventTitle;
