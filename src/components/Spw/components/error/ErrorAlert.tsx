import ReactJson from 'react-json-view';
import React from 'react';

export function ErrorAlert({error}: { error: any }) {
    const color = '#2b0000';
    if (!error) return null;
    const wrapperStyle = {
        background: 'whitesmoke',
        border:     'thick solid ' + color,
        position:   'absolute',
        bottom:     0,
        right:      0,
        zIndex:     1,
    };
    const titleStyle   = {
        background: color,
        color:      'whitesmoke',
        padding:    '.5rem',
        fontSize:   '1.5rem',
        zIndex:     1,
    };
    console.error(error);
    return (
        <div className={'error'} style={wrapperStyle as any}>
            <div className={'title'} style={titleStyle}>Error</div>
            <div className="content">
                <pre style={{fontSize: '1rem'}}><ReactJson src={typeof error === 'object' ? error : {error}}/></pre>
            </div>
        </div>
    )
}