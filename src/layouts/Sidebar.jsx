import React from 'react';

const Sidebar = () => {
    return (
        <div id='layoutSidenav_nav'>
            <nav
                className='sb-sidenav accordion sb-sidenav-dark'
                id='sidenavAccordion'
            >
                <div className='sb-sidenav-menu'>
                    <div className='nav'>
                        <div className='sb-sidenav-menu-heading'>Core</div>
                        <a className='nav-link' href='index.html'>
                            <div className='sb-nav-link-icon'>
                                <i className='fas fa-tachometer-alt'></i>
                            </div>
                            Dashboard
                        </a>
                        <div className='sb-sidenav-menu-heading'>Interface</div>
                        <a
                            className='nav-link collapsed'
                            href='#'
                            data-bs-toggle='collapse'
                            data-bs-target='#collapseLayouts'
                            aria-expanded='false'
                            aria-controls='collapseLayouts'
                        >
                            <div className='sb-nav-link-icon'>
                                <i className='fas fa-user'></i>
                            </div>
                            Users
                            <div className='sb-sidenav-collapse-arrow'>
                                <i className='fas fa-angle-down'></i>
                            </div>
                        </a>
                        <div
                            className='collapse'
                            id='collapseLayouts'
                            aria-labelledby='headingOne'
                            data-bs-parent='#sidenavAccordion'
                        >
                            <nav className='sb-sidenav-menu-nested nav'>
                                {/* <Link to='/users' className='nav-link'>
                                    Add User
                                </Link>
                                <Link to='/users' className='nav-link'>
                                    List Users
                                </Link> */}
                                <a to='/users' className='nav-link'>
                                    Add User
                                </a>
                                <a to='/users' className='nav-link'>
                                    List Users
                                </a>
                            </nav>
                        </div>
                        <a
                            className='nav-link collapsed'
                            href='#'
                            data-bs-toggle='collapse'
                            data-bs-target='#collapsePost'
                            aria-expanded='false'
                            aria-controls='collapseLayouts'
                        >
                            <div className='sb-nav-link-icon'>
                                <i className='fas fa-columns'></i>
                            </div>
                            Posts
                            <div className='sb-sidenav-collapse-arrow'>
                                <i className='fas fa-angle-down'></i>
                            </div>
                        </a>
                        <div
                            className='collapse'
                            id='collapsePost'
                            aria-labelledby='headingOne'
                            data-bs-parent='#sidenavAccordion'
                        >
                            <nav className='sb-sidenav-menu-nested nav'>
                                {/* <Link to='/users' className='nav-link'>
                                    Add Post
                                </Link>
                                <Link to='/users' className='nav-link'>
                                    List Posts
                                </Link> */}
                                <a to='/users' className='nav-link'>
                                    Add Post
                                </a>
                                <a to='/users' className='nav-link'>
                                    List Posts
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;