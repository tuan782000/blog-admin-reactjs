import React, { useEffect, useState } from 'react';
import DataTable from '../common/DataTable';
import requestApi from '../../helpers/api';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';

const UserList = () => {
    const dispatch = useDispatch();

    const [users, setUsers] = useState([]);

    const [numOfPage, setnumOfPage] = useState(1);

    const [currentPage, setCurrentPage] = useState(1);

    const [itemPerPage, setitemPerPage] = useState(1);

    const [searchString, setSearchString] = useState('');

    const columns = [
        {
            name: 'ID',
            element: row => row.id
        },
        {
            name: 'First name',
            element: row => row.first_name
        },
        {
            name: 'Last name',
            element: row => row.last_name
        },
        {
            name: 'Email',
            element: row => row.email
        },
        {
            name: 'Created at',
            element: row => row.created_at
        },
        {
            name: 'Updated at',
            element: row => row.updated_at
        },
        {
            name: 'Action',
            element: row => (
                <>
                    <button
                        type='button'
                        className='btn btn-sm btn-warning me-1'
                    >
                        <i className='fa fa-pencil'></i> Edit
                    </button>
                    <button
                        type='button'
                        className='btn btn-sm btn-danger me-1'
                        // onClick={() => handleDelete(row.id)}
                    >
                        <i className='fa fa-trash'></i> Delete
                    </button>
                </>
            )
        }
    ];

    useEffect(() => {
        dispatch(actions.controlLoading(true));
        // truyền theo query - quyết định 1 trang có nhiêu phần tử
        let query = `?items_per_page=${itemPerPage}&page=${currentPage}&search=${searchString}`;
        // có thể bỏ mảng [] rỗng đi
        requestApi(`/users${query}`, 'GET', [])
            .then(response => {
                console.log('response', response);
                setUsers(response.data.data);
                setnumOfPage(response.data.lastPage);
                dispatch(actions.controlLoading(false));
            })
            .catch(err => {
                dispatch(actions.controlLoading(true));
                console.log(err);
            });
    }, [currentPage, itemPerPage, searchString]); // để đảm bảo khi currentPage thay đổi thì gọi lại api để dannh sách mới

    console.log(users);
    return (
        <div id='layoutSidenav_content'>
            <main>
                <div className='container-fluid px-4'>
                    <h1 className='mt-4'>Tables</h1>
                    <ol className='breadcrumb mb-4'>
                        <li className='breadcrumb-item'>
                            <a href='index.html'>Dashboard</a>
                        </li>
                        <li className='breadcrumb-item active'>Tables</li>
                    </ol>
                    <DataTable
                        name={'List Users'}
                        data={users}
                        columns={columns}
                        numOfPage={numOfPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage} // onPageChange - sẽ gọi setCurrentPage để set lại currentPage - number - hàm setCurrentPage
                        onChangeItemsPerPage={setitemPerPage} // chọn số lượng item trên 1 trang - bằng cách gọi hàm setitemPerPage
                        // onKeySearch={setSearchString}
                        onKeySearch={keyword => {
                            console.log(
                                'Keyword in user list comp => ',
                                keyword
                            );
                            setSearchString(keyword);
                        }}
                    />
                </div>
            </main>
        </div>
    );
};

export default UserList;
