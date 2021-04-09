import { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import Login from '../Login/Login';
import Chat from '../Chat/Chat';

const App = () => {
    const [token, setToken] = useState();
    return (
        <div id="app">
            {token
                ? <BrowserRouter>
                        <Switch>
                            <Route path="/">
                                <Chat />
                            </Route>
                        </Switch>
                    </BrowserRouter>
                : <Login setToken={setToken} />
            }
        </div>
    );
}

export default App;