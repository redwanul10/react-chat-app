import React from 'react'

const MessageForm = ({submit,msg,changeHandelar,showGiphyModal,typingIndicator})=> {

    return(
        <div class="bottom"style={style.msgForm}>
            <input 
            type="text" 
            name='msg' 
            value={msg} 
            placeholder="Enter Message" 
            onChange={event=>changeHandelar(event)}
            style={style.input}
            onFocus={e=>typingIndicator("typing")}
            onBlur ={e=>typingIndicator("stopTyping")}
            />
            <button onClick={event =>submit(event)} style={style.button}>submit</button>

            <div className="icons_parent">
                <img className="gif" onClick={e=>showGiphyModal(e,'gifs')}src="gif.png" alt=""/>
                <img className="gif sticker" onClick={e=>showGiphyModal(e,'stickers')}src="sticker.png" alt=""/>
            </div>

        </div>
    )
}

export default MessageForm;

const style={
    msgForm:{
        position: "absolute",
        textAlign: "center",
        width: "100%",
        left: "50%",
        transform: "translatex(-50%)",
    },
    input:{
        border: "none",
        background: "rgba(201,233,246, 0.3)",
        padding: "13px 73px 13px 27px",
        borderRadius: "20px",
        outline: "none",
        width: "80%",
    },
    button:{
        position: "absolute",
        bottom: "49%",
        border: "none",
        background: "url(https://static.thenounproject.com/png/1054386-200.png) center center",
        width: "41px",
        height: "40px",
        backgroundSize:"cover",
        fontSize: "0",
        backgroundColor: "white",
        right: "15%",
        borderRadius: "50%",
        padding: "9px",
    //    boxShadow: "rgba(2,11,15,0.2) 0px 1px 7px 3px",
        outline:"none"
    }
}