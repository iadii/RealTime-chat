import React from 'react';

const ConnectionStatus = ({ connected }) => {
  if (connected) return null;

  return (
    <div className="connection-status">
      Connecting to server...
    </div>
  );
};

export default ConnectionStatus;