import React,{Component} from 'react'
import Gif from './Gif'

const Masseges = React.forwardRef(({msgs,username},ref)=> {
    
    if(!msgs) return <div></div>

    return(
        <div ref={ref}className="messages scrollBar"style={{margin:"10px 0"}}>
            {msgs.map(item => 
                
                <div className={item.anim?"messageAnimation":''}style={{fontSize:"18px",overflow:"hidden"}}>
                    <img style={username === item.sender ?style.senderImg:style.receiverImg}src={item.senderPhoto} alt=""/>
                    {
                        item.type === 'gif'?
                        <Gif url={item.text} style={username === item.sender ?style.senderGIF:style.receiverGIF}/>:
                        (<div style={username === item.sender ?style.senderMsg:style.receiverMsg}>{item.text}</div>)
                    }
                </div> 
            )}
        </div>
    )
        
})

export default Masseges;


const style={
    senderMsg:{
        display: "inline-block",
        borderRadius: "0px 20px 20px 20px",
        background: "ghostwhite",
        padding: "5px 22px",
        float:"left",
    //    boxShadow: "2px 3px 4px rgba(105, 105, 105, 0.2)",
        marginBottom:"10px",
        marginLeft: "5px",
        maxWidth:"300px",
        borderBottom: "2px solid #eee"
    },
    receiverMsg:{
        color:"white",
        display: "inline-block",
        borderRadius: "20px 0px 20px 20px",
        background: "rgba(0,0,0,0.7)",
        padding: "5px 22px",
        float:"right",
    //    boxShadow: "-2px 3px 4px rgba(105, 105, 105, 0.3)",
        marginBottom:"10px",
        marginRight: "5px",
        maxWidth:"300px",
        borderBottom: "2px solid #eee"
    },
    senderImg:{
        width: "34px",
        marginRight: "10px",
        borderRadius: "50%",
        boxShadow: "0px 0px 9px 2px #eee",
        float:"left",
    },
    receiverImg:{
        width: "34px",
        marginLeft: "10px",
        borderRadius: "50%",
        boxShadow: "0px 0px 9px 2px #eee",
        float:"right",
    },
    senderGIF:{
        width: "212px",
        margin: "10px 0",
        float:"left"
    },
    receiverGIF:{
        width: "212px",
        margin: "10px 0",
        float:"right"
    }
}




