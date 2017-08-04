import React from 'react';
import MenuItem from './MenuItem';

const Menu = () =>
    <ul className="sidebar-menu" data-widget="tree">
        <li className="header">MAIN NAVIGATION</li>
        <MenuItem href="#/dashboard" className="fa fa-envelope" label="Dashboard" />
        <MenuItem href="#/about" className="fa fa-info-circle" label="About" />
    </ul>

export default Menu;