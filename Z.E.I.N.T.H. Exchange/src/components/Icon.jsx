// Z.E.I.N.T.H. Exchange/src/components/Icon.jsx
import React from 'react';

const icons = {
    search: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    // Add other icons here as needed
};

const Icon = ({ name, className }) => {
    const Svg = icons[name];
    return <div className={className}>{Svg}</div>;
};

export default Icon;