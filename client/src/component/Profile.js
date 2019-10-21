import React, { useContext } from 'react';
import GoogleLogout from './GoogleLogout'

import {ChatData} from './Chat'

const Profile = () => {
    const {state:{userObj}} = useContext(ChatData)
    return (
        <div className="profile">
            <img src={userObj.imageUrl} alt=""/>
            <div className="name">{userObj.name}</div>
            <div className="email">{userObj.email}</div>
            <GoogleLogout/>
        </div>
    );
};

export default Profile;