import React from 'react';

const Sidebar = () =>
    <div className="sidebar">
        <aside className="main-sidebar">

            <section className="sidebar">

                <ul className="sidebar-menu" data-widget="tree">
                    <li className="header">MAIN NAVIGATION</li>
                    <li>
                        <a href=''>
                            <i className="fa fa-envelope"></i> <span>Mailbox</span>
                        </a>
                    </li>
                </ul>
            </section>

        </aside>
    </div>


export default Sidebar;