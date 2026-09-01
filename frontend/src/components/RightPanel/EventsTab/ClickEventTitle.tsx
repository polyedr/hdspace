import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { ElementClickEvent } from '@Src/types';
import { selectScreenByIdWrapper } from '@Redux/project/selectors/screen';

interface Props {
  eventData: ElementClickEvent['data'];
}

const ClickEventTitle: FC<Props> = ({
  eventData: { screenId, url, linkType },
}) => {
  const screen = useSelector(
    selectScreenByIdWrapper(+screenId.split('/').reverse()[0]),
  );

  return (
    <div>
      {'Click: to '}

      {linkType === 'external' ? url : screen.name}
    </div>
  );
};

export default ClickEventTitle;
