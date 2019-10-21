import React,{Component} from 'react' 

const Tabs =(props)=>{
    return(
        <>
            <ul className="inline">
                {props.children.map((elem,index)=>{
                    let style = index == props.selected.index ? 'selected': '';
                    return <li className={`${style}`} key={index} onClick={e=>props.handleChange({index,title:elem.props.title})}>
                    <i class={`${elem.props.icon} icon ${elem.props.fade?'now':''}`}></i>
                    {elem.props.title}
                    </li>
                })}
            </ul>
            <div className="tab">{props.children[props.selected.index]}</div>
        </>
    )
    
}

export default Tabs;