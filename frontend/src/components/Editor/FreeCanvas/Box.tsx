import React from 'react';

const styles = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  cursor: 'move',
};

const Box: React.FC<{ title: string }> = ({ title }) => {
  return <div style={{ ...styles }}>{title}</div>;
};

export default Box;
