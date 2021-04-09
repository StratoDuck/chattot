import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App/App';

const HelloWorld = () => {
    return (
        <div>
            <div id="background"></div>
            <App />
        </div>
    );
}

ReactDOM.render(<HelloWorld />, document.getElementById('root'));
