import React from 'react'

const UserList = ({ users, insertUsername, userListPosition }) => {
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
          onClick={() => insertUsername(user)}
        >
          @{user.username}
        </div>
      ))}
    </div>
  )
}

export default UserList