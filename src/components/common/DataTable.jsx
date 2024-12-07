import React, { useEffect, useState } from 'react';
import LiveSearch from './LiveSearch';

const DataTable = props => {
    const {
        name,
        data,
        columns,
        numOfPage,
        currentPage,
        onPageChange,
        onChangeItemsPerPage,
        onKeySearch,
        onSelectedRows
    } = props;

    // quản lý state chọn các item
    const [selectedRows, setSelectedRows] = useState([]);

    const renderHeaders = () => {
        return columns.map((col, index) => (
            <th key={index} scope='col'>
                {col.name}
            </th>
        ));
    };

    useEffect(() => {
        console.log('selected rows =>', selectedRows);
        onSelectedRows(selectedRows); // đóng vai trò dữ liệu chuyển lên cho thằng cha UserList- rows
    }, [selectedRows]);

    // const renderData = () => {
    //     return data.map((item, index) => (
    //         <tr key={index}>
    //             {columns.map((col, ind) => (
    //                 <td key={ind}>{col.element(item)}</td>;
    //             ))}
    //         </tr>
    //     ));
    // };

    // map mảng 2 chiều thì - sẽ map ra dòng ngang truớc sau map cột dọc sau
    // map ra từng user - map ra các cột thông tin user đó
    // trước tiên map data từ props user
    // sau đó sinh ra từng dòng dữ liệu. dựa vào map col dựa vào columns sẽ lấy ra cụ thể thông tin cột đó
    const renderData = () => {
        return data.map((item, index) => (
            <tr key={index}>
                <td>
                    <input
                        type='checkbox'
                        className='form-check-input'
                        onChange={onClickCheckBox}
                        value={item.id}
                        checked={
                            selectedRows.includes(String(item.id))
                                ? true
                                : false
                        }
                    />
                </td>
                {columns.map((col, ind) => (
                    <td key={ind}>{col.element(item)}</td>
                ))}
            </tr>
        ));
    };

    const onClickCheckBox = event => {
        let checked = event.target.checked;
        let value = event.target.value;
        if (checked) {
            if (!selectedRows.includes(value)) {
                // kiểm tra nếu chưa có trong mảng selectedRows - thì thêm vào mảng đó
                setSelectedRows([...selectedRows, value]);
            }
        } else {
            let index = selectedRows.indexOf(value);
            const temp = [...selectedRows];
            temp.splice(index, 1);
            setSelectedRows(temp);
        }
    };

    const renderPagination = () => {
        const pagination = [];
        const nextPage = currentPage + 1 > numOfPage ? null : currentPage + 1; // numOfPage tổng số trang đang có - nếu trang hiện tại + 1 > tổng số trang đang có thì null còn lại cho qua trang kế

        const prevPage = currentPage - 1 < 1 ? null : currentPage - 1;

        // Tạo nút <--
        pagination.push(
            <li
                key='prev'
                className={prevPage ? 'page-item' : 'page-item disabled'}
            >
                <button
                    className='page-link'
                    onClick={() => onPageChange(prevPage)}
                >
                    &laquo;
                </button>
            </li>
        );

        // vòng lặp - push số trang vào pagination
        for (let i = 1; i <= numOfPage; i++) {
            pagination.push(
                <li
                    key={i}
                    className={
                        currentPage === i ? 'page-item active' : 'page-item'
                    }
                >
                    <button
                        className='page-link'
                        onClick={() => onPageChange(i)} // khi nhấn vào nút hàm này được cb gọi onPageChange nhận vào i - hàm này truyền từ userList xuống
                    >
                        {i}
                    </button>
                </li>
            );
        }

        pagination.push(
            <li
                key='next'
                className={nextPage ? 'page-item' : 'page-item disabled'}
            >
                <button
                    className='page-link'
                    onClick={() => onPageChange(nextPage)}
                >
                    &raquo;
                </button>
            </li>
        );

        return pagination;
    };

    // nhận vào event
    const onChangeOption = event => {
        const target = event.target;
        console.log('Chang item per page to. ==> ', target.value);
        onChangeItemsPerPage(target.value);
    };

    const onSelectAll = event => {
        if (event.target.checked) {
            // lấy toàn bộ id của các item có trong trang hiện tại bỏ vào trong array selectedRows
            const temp = data.map(element => String(element.id)); // vì request lên server thì thông qua params đều phải dạng chuổi cho nên String ép kiểu
            setSelectedRows(temp); // check hết nè
        } else {
            // remove các check mà user đã check trước đó
            setSelectedRows([]);
        }

        // sẽ có trường hợp tất cả các item đã được check hết trong trang hiện tại thì các checkAll này cũng phải được check.
        // xử lý ở bên dưới
    };

    return (
        <div className='card mb-4'>
            <div className='card-header'>
                <i className='fas fa-table me-1'></i>
                {name}
            </div>
            <div className='card-body'>
                <div className='row mb-3'>
                    <div className='col-sm-12 col-md-6'>
                        <label className='d-inline-flex'>
                            Show
                            <select
                                name='example_length'
                                className='form-select form-select-sm ms-1 me-1'
                                onChange={onChangeOption} // khi chọn gọi sự kiện onChangeOption
                            >
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                                <option value='5'>5</option>
                                <option value='10'>10</option>
                                <option value='50'>50</option>
                            </select>{' '}
                            entries
                        </label>
                    </div>
                    <div className='col-sm-12 col-md-6'>
                        <label className='d-inline-flex float-end'>
                            Search:
                            <LiveSearch onKeySearch={onKeySearch} />
                        </label>
                    </div>
                </div>
                <table
                    className='table table-striped table-bordered'
                    cellSpacing='0'
                    width='100%'
                >
                    <thead>
                        <tr>
                            <td>
                                <input
                                    // kiểm tra tất cả các item của trang hiện tại có được check hay chưa nếu còn 1 đứa không check coi như false - tất cả đã check hết true
                                    // điều kiện check - độ dài của mảng chứa item được check === độ dài của dữ liệu của trang hiện tại
                                    // và
                                    // data phải có - data.length > 0
                                    checked={
                                        selectedRows.length === data.length &&
                                        data.length > 0
                                            ? true
                                            : false
                                    }
                                    type='checkbox'
                                    className='form-check-input'
                                    onChange={onSelectAll}
                                />
                            </td>
                            {renderHeaders()}
                        </tr>
                    </thead>
                    <tbody>{renderData()}</tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            {renderHeaders()}
                        </tr>
                    </tfoot>
                </table>
                {numOfPage > 1 && (
                    <div className='row'>
                        <div className='col-sm-12 col-md-7'>
                            <ul className='pagination justify-content-end'>
                                {renderPagination()}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataTable;
