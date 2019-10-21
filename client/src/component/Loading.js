import React from "react"

const Loading = (props)=>{
    
    return(
        <div style={props.style} class="spinner-border text-primary" role="status">
             <span class="sr-only">Loading...</span>
        </div>
    )
}

export default Loading;

