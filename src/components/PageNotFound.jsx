import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className='text-center'>
            <h1>404 Not found</h1>
            <Link className='mt-2 d-block' to='/'>
                <i className='fas fa-arrow-left me-1'></i> Go to the Dashboard
            </Link>
        </div>
    );
};

export default PageNotFound;
