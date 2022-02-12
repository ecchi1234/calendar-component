import { Fragment,useState,useEffect } from 'react';
import React from 'react';

const Loader = () => {

    const [show, setShow] = useState(true);
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(false)
            }, 3000);

        return () => {
            clearTimeout(timeout);
            }
       
    },[show]);

    return (
        <Fragment>
            <div className={`loader-wrapper ${show ? '' : 'loderhide'}`}>
                <div className="loader-index"><span></span></div> 
             </div>
        </Fragment>
    );
}

export default Loader;