import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo';
import UserSearch from './UserSearch';
import FriendListItem from './FriendListItem';
import SearchListItem from './SearchListItem';
import { IFriendListItem, ISearchListItem, IUsersParams } from './types';
import { emptyFriend, TERM_MIN_LENGHT } from './constants';
import CurrentUser from './CurrentUser';

import axios from 'axios';

function Users(data: IUsersParams) {
  const [currentUser, setCurrentUser] = useState(emptyFriend);
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data } = await axios.get('/api/userinfo');
        // set current user for component
        setCurrentUser(data);
        // set current user in sessionStorage for future reference
        CurrentUser.set(data);
      }
      catch(ex: any) {
        // console.log('Failed to fetch UserInfo');
      }
    };

    const fetchFriends = async () => {
      try {
        const { data } = await axios.get('/api/fetch_friends');
        setFriends(data);
      }
      catch(ex: any) {
        // console.log('Failed to fetch Friends');
      }
    }

    try {
      fetchUserInfo();
      fetchFriends();
    }
    catch(ex: any) {
      // console.log('Users.tsx failed to fetch UserInfo or Friends');
    }
  }, []);

  const onSearch = async (event: any) => {
    const term = event.target.value;

    // reset Search list
    if(term.length === 0) {
      setUsers([]);
      // TODO: add try-catch block
      const { data } = await axios.get('/api/fetch_friends');
      setFriends(data);
      return;
    }

    if(term.length < TERM_MIN_LENGHT) return;

    // when User performs a search:
    // 1. Fetch matching users
    // 2. Clean the list of Friends for now
    // 3. TODO: add try-catch block
    const { data } = await axios.get('/api/search_users', { params: { term: term } });
    setFriends([]);
    setUsers(data);
  }

  return (
    <section className="users">
      <UserInfo {...currentUser} />
      <UserSearch onSearch={onSearch} />
      
      {/* Friends List */}
      <section className="users-list">
        {friends.map((friend: IFriendListItem) => {
          friend.setIsFriendShown = data.setIsFriendShown;
          friend.setFriendInChat = data.setFriendInChat;
          return <FriendListItem key={friend.id} {...friend} />
        })}
      </section>

      {/* Search List */}
      <section className="users">
        {users.map((user: ISearchListItem) => {
          return <SearchListItem key={user.id} {...user} />
        })}
      </section>
    </section>
  );
}

export default Users;
