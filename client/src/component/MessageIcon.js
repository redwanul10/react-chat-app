import React,{useContext} from 'react';
import {ChatData} from './Chat'
const MessageIcon = (props) => {
    const {closeMessageArea} = useContext(ChatData);
    return <i onClick={closeMessageArea}class="fa fa-times messageIcon" aria-hidden="true"></i>
}

export default MessageIcon;