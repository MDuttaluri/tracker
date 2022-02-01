import React from 'react';
import './LoadingStyles.scss';

interface LoadingComponentPropsInterface {
    fullDiv: boolean,
    message?: string
}

function Loading(props: LoadingComponentPropsInterface) {
    return (

        <div className={props.fullDiv ? 'loadingFullDiv' : ''} >
            <p className='loadingText'>{props.message || 'Loading...'}</p>
            <div className='loadingComponent'>
                <div className='loadingComponent--inner' />
            </div>
        </div>

    );
}

export default Loading;
