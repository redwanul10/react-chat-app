import React from 'react'

const Icon = (props)=>{

    return(
        <button onClick={()=>props.click()}type="button" class="close" data-dismiss="modal" aria-label="Close">
            <i className={props.name} aria-hidden="true" style={props.style && style.icon}></i>
        </button>
    )
}

export default Icon;

const style ={
    icon:{
        margin: "3px 18px"
    }
}