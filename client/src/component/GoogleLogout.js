import React, { useContext } from 'react';
import { GoogleLogout } from 'react-google-login';
import { ChatData } from './Chat';

const Logout = () => {
    const {successLogout} = useContext(ChatData)
    return (
        <div className="text-center">
            <GoogleLogout
            clientId="540092323830-fu2ngr3laj6p672ms0op1vjj2flpu4b6.apps.googleusercontent.com"
            buttonText="Logout"
            onLogoutSuccess={successLogout}
            onFailure={err => console.log(err)}
            />
            
        </div>
    );
};

export default Logout;