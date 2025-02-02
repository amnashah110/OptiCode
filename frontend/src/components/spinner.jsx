import React from "react";
import spinnerGIF from '../assets/spinner.gif'

const Spinner = () => {
    return (
        <div className='flex flex-col justify-center items-center' style={{ marginTop: '-15%'}}>
            <img src={spinnerGIF} alt="Loading Spinner" style={{width: 150, height: 150, zIndex: 10}}/>
        </div>
    );
}

export default Spinner;