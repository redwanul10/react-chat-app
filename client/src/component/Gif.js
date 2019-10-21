import React from 'react';

const Gif = (props) => {
    return (
        <img className='Gif-Img'style={props.style}src={props.url} alt=""/>
    );
};

export default Gif;