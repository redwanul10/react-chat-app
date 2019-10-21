import React from 'react'
import MobileMessageIcon from './MessageIcon'
const MessageHeading = ({receiver,mobile})=>{
    const user = receiver ?receiver:"welcome"
    return(
        <div>
            <div style={style.heading}>{user}</div>
            {mobile && <MobileMessageIcon/>}
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