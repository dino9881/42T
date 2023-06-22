import React from 'react';

interface ConnectionStateProps {
isConnected: boolean;
}

export function ConnectionState({ isConnected }: ConnectionStateProps){
    return <p>State: {String(isConnected)}</p>;
}



