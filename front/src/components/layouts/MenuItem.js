import React from 'react';

const MenuItem = ({ href, className, label }) =>
    <li>
        <a href={ href }>
            <i className={ className }></i> <span>{ label }</span>
        </a>
    </li>

export default MenuItem;