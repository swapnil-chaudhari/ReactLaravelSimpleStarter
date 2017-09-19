import React from 'react';
import MenuItem from './MenuItem';

const Menu = () =>
    <ul className="sidebar-menu" data-widget="tree">
        <li className="header">MAIN NAVIGATION</li>
        <MenuItem href="#/dashboard" className="fa fa-envelope" label="Dashboard" />
        <MenuItem href="#/tour" className="fa fa-suitcase" label="Tour" />
    </ul>

export default Menu;
