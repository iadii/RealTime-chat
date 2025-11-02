import React from 'react';

const UserList = ({ 
  showUserList, 
  userListPosition, 
  users, 
  insertUsername,
  setShowUserList
}) => {
  if (!showUserList) return null;

  return (
    <div 
      className="user-list"
      style={{
        position: 'absolute',
        top: `${userListPosition.top}px`,
        left: `${userListPosition.left}px`
      }}
    >
      {users.map(user => (
        <div 
          key={user.id} 
          className="user-list-item"
          onClick={() => {
            insertUsername(user);
            setShowUserList(false);
          }}
        >
          @{user.username}
        </div>
      ))}
    </div>
  );
};

export default UserList;