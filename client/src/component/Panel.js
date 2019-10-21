import React from 'react'

const Panel = (props)=> {
    return(
         <div className={`${props.active === props.title?"now":""}`}>{props.children}</div>
    )
}

export default Panel