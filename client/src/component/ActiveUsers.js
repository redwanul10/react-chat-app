import React,{Component,useContext} from 'react'
import {ChatData} from './Chat'

//const ActiveUsers = ({users,username,currentUser})=> {
     
const ActiveUsers = ()=> {
    const {state:{users,userObj:{username},currentUser},setCurrentUser} = useContext(ChatData)
    console.log(users)
    return(
        <div className="activeUsers">
            {
                users.map(user =>
                    user.username !== username && (
                        <div onClick={event=>setCurrentUser(user,event)} style={style.li}>
                            <img style={style.img}src={user.imageUrl} alt=""/>
                            <span>{user.name}</span> 
                            <span style={style.span}></span>
                        </div>
                        )
                    )
                }
        </div>
    )
}

export default ActiveUsers;


const style={
    li:{
        padding: "11px",
        fontWeight: "bold",
        cursor:'pointer',
        position:"relative",
        ovreflow:"hidden"
    },
    span:{
        width: "10px",
        height: "10px",
        background: "green",
        display: "inline-block",
        borderRadius:" 50%",
        top: "50%",
        right: "30px",
        transform: "translate(-50%,-50%)",
         position: "absolute",
    },
    img:{
        width: "30px",
        marginRight: "10px",
        borderRadius: "50%",
    }
}