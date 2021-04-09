import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';

import users from '../services/users';

interface LoginProps {
    setToken: any,
}

const Login = ({ setToken }: LoginProps) => {
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = await users.login({username, password});
        setToken(token);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <p>Username</p>
                <input type="text" onChange={e => setUsername(e.target.value)} />
            </label>
            <label>
                <p>Password</p>
                <input type="password" onChange={e => setPassword(e.target.value)} />
            </label>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
};

export default Login;