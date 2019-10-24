import React from 'react'
import MobileMessageIcon from './MessageIcon'
import TypingAnimation from './TypingAnimation'

const MessageHeading = ({receiver,mobile,collection})=>{
    
    const user = receiver.name ? receiver.name : "welcome"
    const findReceiver = collection.find(singleUser => singleUser.username === receiver.username)
    const typing = findReceiver ? findReceiver.typing : false

    return(
        <div className="heading">
            <div style={style.heading}>{user}</div>
            {mobile && <MobileMessageIcon/>}
            {typing && <TypingAnimation/>}
        </div>                  
    )
}

export default MessageHeading;

const style={
    heading:{
        textAlign: "center",
        background: "rgba(113,197,231,0.9)",
        color: "white",
    //    textTransform: "uppercase",
        fontSize: "20px",
        borderRadius: "7px",
        margin: "29px 0",
        padding: "6px 0",
        borderBottom: "3px solid #eee"
    //    boxShadow: "4px 5px 16px rgba(113,197,231,0.4)",
    }
}