import React, { useEffect, useState } from 'react';
import DataTable from '../common/DataTable';
import requestApi from '../../helpers/api';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';

const UserList = () => {
    const dispatch = useDispatch();

    const [users, setUsers] = useState([]);

    const [numOfPage, setnumOfPage] = useState(1);

    const [currentPage, setCurrentPage] = useState(1);

    const [itemPerPage, setitemPerPage] = useState(5);

    const [searchString, setSearchString] = useState('');

    // quản lý các state component cong truyền ra
    const [selectedRows, setSelectedRows] = useState([]); // này sẽ truyền vào api để delete
    const [deleteItem, setDeleteItem] = useState(null); // phục vụ xoá 1
    // quản lý delete multiple
    const [deleteType, setDeleteType] = useState('single');

    // quản lý trạng thái ẩn hiện modal
    const [showModal, setShowModal] = useState(false);

    // tự động refresh sau khi delete
    const [refresh, setRefresh] = useState(Date.now()); // ra chuỗi timeStamp hiện tại

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
                    {/* <button
                        type='button'
                        className='btn btn-sm btn-warning me-1'
                    >
                        <i className='fa fa-pencil'></i> Edit
                    </button> */}
                    <Link
                        to={`/user/edit/${row.id}`}
                        className='btn btn-sm btn-warning me-1'
                    >
                        <i className='fa fa-pencil'></i> Edit
                    </Link>
                    <button
                        type='button'
                        className='btn btn-sm btn-danger me-1'
                        onClick={() => handleDelete(row.id)}
                    >
                        <i className='fa fa-trash'></i> Delete
                    </button>
                </>
            )
        }
    ];

    const handleDelete = id => {
        console.log('Single Delete with id =>', id);
        setShowModal(true);
        setDeleteItem(id);
        // set lại trạng thái xoá single
        setDeleteType('single');
    };

    const handleMultiDelete = () => {
        console.log('Multidelete', selectedRows);
        setShowModal(true);
        // set lại trạng thái xoá multiple
        setDeleteType('multi');
    };

    const requestDeleteApi = () => {
        // Kiểm tra delete type
        if (deleteType === 'single') {
            dispatch(actions.controlLoading(true));
            requestApi(`/users/${deleteItem}`, 'DELETE', [])
                .then(response => {
                    setShowModal(false);
                    setRefresh(Date.now()); // giúp reload lại trang sau khi xoá thành công
                    dispatch(actions.controlLoading(false));
                })
                .catch(error => {
                    console.log(error);
                    setShowModal(false);
                    dispatch(actions.controlLoading(false));
                });
        } else {
            dispatch(actions.controlLoading(true));
            requestApi(
                `/users/multiple?ids=${selectedRows.toString()}`,
                'DELETE',
                []
            )
                .then(response => {
                    setShowModal(false);
                    setSelectedRows([]);
                    setRefresh(Date.now()); // giúp reload lại trang sau khi xoá thành công
                    dispatch(actions.controlLoading(false));
                })
                .catch(error => {
                    console.log(error);
                    setShowModal(false);
                    dispatch(actions.controlLoading(false));
                });
        }
    };

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
    }, [currentPage, itemPerPage, searchString, refresh]); // để đảm bảo khi currentPage thay đổi thì gọi lại api để dannh sách mới

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
                    <div className='mb-3'>
                        <Link
                            type='button'
                            className='btn btn-sm btn-success me-2'
                            to='/user/add'
                        >
                            <i className='fa fa-plus'></i>
                            Add new
                        </Link>
                        {selectedRows.length > 0 && (
                            <button
                                type='button'
                                className='btn btn-sm btn-danger'
                                onClick={handleMultiDelete}
                            >
                                <i className='fa fa-trash'></i>
                                Delete
                            </button>
                        )}
                    </div>
                    <DataTable
                        name={'List Users'}
                        data={users}
                        columns={columns}
                        numOfPage={numOfPage}
                        currentPage={currentPage}
                        itemPerPage={itemPerPage}
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
                        onSelectedRows={rows => {
                            console.log('selected rows in user list', rows); // dựa vào hàm onSelectedRows truyền từ con lên cha dữ liệu các item đã được check
                            setSelectedRows(rows);
                        }}
                    />
                </div>
            </main>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size='sm'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure want to delete?</Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowModal(false)}>Close</Button>
                    <Button className='btn-danger' onClick={requestDeleteApi}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserList;
