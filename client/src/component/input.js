import React from 'react'

const Input = (props) => {
    return(
        <div class="form-group">
            <label >{props.label}</label>
            <input onChange={props.change} type={`${props.type}`} name={`${props.name||props.type}`} class="form-control"  placeholder={`${props.placeholder}`}/>
        </div>
    )
}

export default Input;