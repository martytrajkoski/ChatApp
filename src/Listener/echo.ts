import Echo from 'laravel-echo';

const token = localStorage.getItem('token');

const echo = new Echo({
    authEndpoint : 'http://chatapp-backend.test/broadcasting/auth',
    broadcaster: 'reverb',
    key: 's3w3thzezulgp5g0e5bs',
    wsHost: 'localhost',
    wsPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    auth: {
        headers: {
            Authorization: `Bearer ${token}`, 
        },
        endpoint: 'http://chatapp-backend.test/broadcasting/auth',
    },
});

export default echo;
