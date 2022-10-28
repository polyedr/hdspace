import React from 'react';

type Props = {
  setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CloseCreateChannel = (props: Props) => {
  const { setIsCreating, setIsEditing } = props;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        width="24"
        height="24"
        onClick={() => {
          if (setIsCreating) setIsCreating(false);
          if (setIsEditing) setIsEditing(false);
        }}
      >
        <path
          fill="#81818E"
          d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"
        />
      </svg>
      {/* <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => {
          if (setIsCreating) setIsCreating(false);
          if (setIsEditing) setIsEditing(false);
        }}
      >
        <path
          d="M6.10042 6.10051C0.633603 11.5673 0.633603 20.4327 6.10042 25.8995C11.5672 31.3663 20.4326 31.3663 25.8994 25.8995C31.3662 20.4327 31.3662 11.5673 25.8994 6.10051C20.4326 0.633686 11.5672 0.633685 6.10042 6.10051ZM22.3639 11.0503L17.4141 16L22.3639 20.9497L20.9497 22.364L15.9999 17.4142L11.0502 22.364L9.63596 20.9497L14.5857 16L9.63596 11.0503L11.0502 9.63604L15.9999 14.5858L20.9497 9.63604L22.3639 11.0503Z"
          fill="var(--primary-color)"
        />
      </svg> */}
    </>
  );
};
