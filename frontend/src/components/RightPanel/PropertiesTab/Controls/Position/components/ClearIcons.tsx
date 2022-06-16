import React from 'react';

export enum CLEAR_TYPE {
  LEFT = 'left',
  RIGHT = 'right',
  BOTH = 'both',
}

type Props = {
  isActive?: boolean;
  type: 'left' | 'right' | 'both';
};

const ClearIcons: React.FC<Props> = ({ type, isActive = false }) => {
  if (type === CLEAR_TYPE.LEFT)
    return (
      <>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="8"
            y="8"
            width="8"
            height="8"
            rx="1"
            fill={isActive ? 'rgba(80, 100, 255, 1)' : '#81818E'}
          />
          <path
            d="M4.25 16C4.25 16.4142 4.58579 16.75 5 16.75C5.41421 16.75 5.75 16.4142 5.75 16L4.25 16ZM5.75 8C5.75 7.58579 5.41421 7.25 5 7.25C4.58579 7.25 4.25 7.58579 4.25 8L5.75 8ZM5.75 16L5.75 8L4.25 8L4.25 16L5.75 16Z"
            fill={isActive ? 'rgba(80, 100, 255, 1)' : '#81818E'}
          />
        </svg>
      </>
    );
  if (type === CLEAR_TYPE.BOTH)
    return (
      <>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="8"
            y="8"
            width="8"
            height="8"
            rx="1"
            fill={isActive ? 'rgba(80, 100, 255, 1)' : '#81818E'}
          />
          <path
            d="M4.25 16C4.25 16.4142 4.58579 16.75 5 16.75C5.41421 16.75 5.75 16.4142 5.75 16L4.25 16ZM5.75 8C5.75 7.58579 5.41421 7.25 5 7.25C4.58579 7.25 4.25 7.58579 4.25 8L5.75 8ZM5.75 16L5.75 8L4.25 8L4.25 16L5.75 16Z"
            fill={isActive ? 'rgba(80, 100, 255, 1)' : '#81818E'}
          />
          <path
            d="M18.25 16C18.25 16.4142 18.5858 16.75 19 16.75C19.4142 16.75 19.75 16.4142 19.75 16L18.25 16ZM19.75 8C19.75 7.58579 19.4142 7.25 19 7.25C18.5858 7.25 18.25 7.58579 18.25 8L19.75 8ZM19.75 16L19.75 8L18.25 8L18.25 16L19.75 16Z"
            fill={isActive ? 'rgba(80, 100, 255, 1)' : '#81818E'}
          />
        </svg>
      </>
    );

  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="16"
          y="16"
          width="8"
          height="8"
          rx="1"
          transform="rotate(-180 16 16)"
          fill={isActive ? 'rgba(80, 100, 255, 1)' : '#81818E'}
        />
        <path
          d="M19.75 8C19.75 7.58579 19.4142 7.25 19 7.25C18.5858 7.25 18.25 7.58579 18.25 8L19.75 8ZM18.25 16C18.25 16.4142 18.5858 16.75 19 16.75C19.4142 16.75 19.75 16.4142 19.75 16L18.25 16ZM18.25 8L18.25 16L19.75 16L19.75 8L18.25 8Z"
          fill={isActive ? 'rgba(80, 100, 255, 1)' : '#81818E'}
        />
      </svg>
    </>
  );
};

export default ClearIcons;
