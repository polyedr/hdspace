import React from 'react';
import type { TeamChannelListProps } from '../components/TeamChannelList/TeamChannelList';

export const AddChannel = (
  props: Pick<
    TeamChannelListProps,
    'setCreateType' | 'setIsCreating' | 'setIsEditing' | 'type'
  >,
) => {
  const { setCreateType, setIsCreating, setIsEditing, type } = props;

  return (
    <>
      {/* <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => {
          setCreateType(type);
          setIsCreating((prevState) => !prevState);
          setIsEditing(false);
        }}
      >
        <path
          d="M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM11 7.5H7.5V11H6.5V7.5H3V6.5H6.5V3H7.5V6.5H11V7.5Z"
          fill="black"
          fillOpacity="0.66"
        />
      </svg> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        width="14"
        height="14"
        onClick={() => {
          setCreateType(type);
          setIsCreating((prevState) => !prevState);
          setIsEditing(false);
        }}
      >
        <path
          fill="#81818E"
          d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"
        />
      </svg>
    </>
  );
};
