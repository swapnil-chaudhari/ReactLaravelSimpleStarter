import React from 'react';
import Proptypes from 'prop-types';

const ContentTitle = ({ title, subTitle }) =>
        <h1>
            { title }
            <small>{ subTitle }</small>
        </h1>


export default ContentTitle;
