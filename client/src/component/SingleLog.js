import React,{useContext,useState}from 'react'
import {ChatData} from './Chat'

const SingleLog = ({data}) => {
    
    const {state:{receiver,userObj:{username}},setCurrentUser} = useContext(ChatData)
    
    const unreadIcon    =<i class="fa fa-envelope-square msg-box" aria-hidden="true"></i>
    const lastMsg       = data.conversation[data.conversation.length - 1];
    
    if(!lastMsg) return <div></div>;
    
    const displayLstMsg = lastMsg.type === 'gif'? "Sent Gif" : lastMsg.text
    const text = displayLstMsg.length < 25 ? displayLstMsg : displayLstMsg.slice(0,25) + "..."
    const boldStyle = !data.read && "font-weight-bold"
    
    const lastUpdated = new Date(data.lastUpdated).toDateString()
    let Time        = new Date(data.lastUpdated).toLocaleTimeString()
    Time = Time.split('')
    Time.splice(4,3)

    const clickHandelar = ()=>{
        setCurrentUser(data)
    }
    return(
        <div className="singleLog" onClick={clickHandelar}>
            <img style={style.img}src={data.photo} alt=""/>
            
            <div style={{display:"inline-block"}}>
                <div>{data.name}</div>
                <div className={boldStyle}>{lastMsg.sender === username&&"you :"} {text}</div>
            </div>
            
            <small  className="text-center"><div>{lastUpdated}</div> <div>{Time}</div></small>
            {!data.read ? (data.username !== receiver.username?unreadIcon:"") : ""}
        </div>
    )
}

export default SingleLog;

const style={
    img:{
        width: "48px",
        marginRight: "14px",
        marginTop: "-17px",
        borderRadius: "50%",
    }
}