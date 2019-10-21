import React from 'react';
import GoogleLogin from 'react-google-login'
import Spinner from './Spinner'

const SignInWithGoogle = ({successLogin,login,loading,failureLogin,errorMessage}) => {
    const responseGoogle = (res)=>{
        console.log(res)
        successLogin(res)
    }
    const AuthorUrl = "https://www.facebook.com/redwanul10";
    return (
        <div className ="google messageAnimation"style={{textAlign:"center",marginTop:"151px"}}>
            <div onClick={login} style={{marginBottom:"15px"}}>
                <GoogleLogin
                clientId="540092323830-fu2ngr3laj6p672ms0op1vjj2flpu4b6.apps.googleusercontent.com"
                buttonText="Sigin with Google"
                onSuccess={responseGoogle}
                onFailure={failureLogin}
                />
            </div>

            {loading && <Spinner/>}
            {errorMessage && <div style={{color:"red"}}>{errorMessage}</div>} 

            <div className="author">A Simple Chat App Built in React,Node, & Mongoddb Created By <a target="_blank"href={AuthorUrl}>Redwan</a></div>
            <img src="giphy.png" alt=""/>
        </div>
        
    );
};

export default SignInWithGoogle;
