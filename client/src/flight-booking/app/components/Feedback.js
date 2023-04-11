import React from 'react';

function Feedback(props) {
    return (
        <div className="feedback">
            <h3>{props.text}</h3>
        </div>    
    );
}

export default Feedback;