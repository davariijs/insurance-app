import React from 'react';

const CustomSpinner: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <img src="/spinner.gif" alt="Loading..." style={{ width: '80px', height: '80px' }} />
    </div>
  );
};

export default CustomSpinner;
