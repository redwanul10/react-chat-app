import React from 'react';
import Spinner from './Spinner';

const GiphyModal = ({loading,searchGif,fetchGif,GifList,changeHandelar,submit,hideGiphyModal}) => {
    return (
        <div className="gif_area">
            <div className="search_form">
                <input 
                onChange={event=>changeHandelar(event)}
                type="text" 
                placeholder="search"
                name="searchGif"
                value={searchGif}
                className='search_box'/>

                <img className="search_icon"onClick={e=>fetchGif(e)} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAB7CAMAAABjGQ9NAAAAY1BMVEX///8AAAD39/eUlJTz8/Pl5eXt7e2goKDLy8vAwMDp6el7e3upqanHx8f8/Pzd3d0SEhJQUFBBQUGampq3t7eGhoYiIiJkZGRfX1/X19dtbW01NTUaGhovLy+MjIxZWVlISEj022e2AAAEfklEQVRoge1b6daiMAwFBGVTQAEFRH3/pxxBx29JmiZtZc6Z4/1Ne22b5SatnvfBBx98MGMXplFRdF0RpetgOdpgvV31131b+jPOY3XM8iJ8P3FYZ3sfxXETvZU5P+G8T4yX4k3EXUYSP+nrN5z+9spgntAe1m6Z44rJ/GB3uPa0FzBPGBJX1Bsh84STE6OPFD6lw8aeOjdjvqOyDDcBx69UaDsb6pTrWArU5tSmR/0F40OPzrbUvn8wo07tme9YmVCvSyfcJtseWp/1X8hjnCaM7q/ZoU6SpM6b/tbS30pd7UDMdT7WxY9skcaXgfqdsiATEzPhGZrK7r2EOlB611W9gcFKSZ4LuFWHPWzJYaFy7Xw5odrxi1YTxAqzO7K5ccNpOc4SKtRkzKTG0+bA1KANOnq/Yw0O0H3jOwouc3gpDR3L/N0z0H0bOPoxHLGRAmoFOWfh2MCzUHJjvnZj/PwbMo5rpS9gcl4/CebbcgGQIoFR7+NISKvE1J5Xw2nKVDMmQBSDUXF5hPPoonoCh1xMqL0ITrTXDIEWWhqWlYita8KTq2WjC6ddHBlgXE3DE2/I72FgMTHyB6DpjOT38JAsyhq4h2RMh8LYooEBQwUV2nbCbaIBD5Dy8DX4OrPg7sBslM/AYC5RmL8BYyS1EhiFaWGqARBAFZFHwQmVVo1CkEmpHA7UvVQ0/ATw2JZwMqAxW6t+zQUcoYjbqkMIiyRiKYB7FGlEt9yu95yYDvzQ1srWwFLOxBGCsqC0aouC2oyqMGBsEavj7wBVBhVbtoDbIoV6HoiplEyGLTVTxTShALNRwiUAX+u0JQV4gmSvDVb9FsEFiiCyeyD8nAaYixZBsPYW9ad+AEoHX/q98abDPdRUg5DbVLmEcCpNWxe2iUxTGdLp0wgRpHY16/2vYQV+1g2B3K2ubkaBtLq0cQq5nTHRyVj7QtvLRgpwAx8PkM6/PkQGWENTnMWxRhPDYbCu/SCkxtqDI2MBWItI0AeeAFOxz8yIaDNWYm9oC1zbZZqB34tlbMWKrpp7T4bfPfTM+IZEp2nZTMELFcSMPcvaoS6ewc4K+E/niLe14kZPIH+wfu6EIy2Zd8qLekE5i7S6HigvanPdJaqf7J/41NRLg7aJUIsPa+oZiqgTTV2HXsHLpSDJNHflkkSMhvVv6A953EVpWnTJpuFcGUvIU0fX3y9ILuER2bgcOR4bFyJXhRhjSKwd0zBWkBhc59rgJOSq+GwM0ZMTmwdN1uS15hXHW8kj6au9CeNWaaiyW8ZEvPQmJLxEWGTJng1eH+naFfluw1776VX7KMmlD6wCMkG/kH2vupyRe7su02TWavNL1rgjv6uTuBkUsa6tcqTQVCYks6o+Sla/uxNjn8cKAe6Y/PELuqTO76hjzdNzJbnhc0IRlORGzwn/C/J/uu1WL3ctyc1v1wVQPYl77/8jnlCs3Oau15bc5l7Clpx+fuEObp5KuSO3ugOzIy8Xo4bky5g5Sr5IaMHJqwX/eTajeOkufqvSHZJs9P3b4Suc/gHdozPFHMCduwAAAABJRU5ErkJggg=="/>
                <i class="fa fa-times closeIcon" onClick={e=>hideGiphyModal(e)}aria-hidden="true"></i>
                
            </div>

            {   loading ?<Spinner/>:(
                    GifList.map(singleGif=>{
                        const url = singleGif.images.preview_webp.url;
                        return (<img onClick={e=>submit(e,'gif',url)}className='gifImg'src={url} alt=""/>)
                    })
                )
            }
        </div>
    );
};

export default GiphyModal;