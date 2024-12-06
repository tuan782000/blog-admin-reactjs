import React, { useEffect, useState } from 'react';

const LiveSearch = props => {
    const { onKeySearch } = props;
    // quản lý trạng thái keyword
    const [keyword, setKeyword] = useState('');

    // áp dụng kỹ thuật debounce
    // khi keyword thay đổi gọi hàm bên trong
    //
    useEffect(() => {
        // khi user gõ dừng hơn 1s mới bắt đầu tìm kiếm
        const delayDebounce = setTimeout(() => {
            console.log('call func onKeySearch');
            onKeySearch(keyword);
        }, 500);

        // return clearTimeout - tránh rò rĩ dữ liệu
        return () => clearTimeout(delayDebounce);
    }, [keyword]);
    const onTyping = event => {
        const target = event.target;
        console.log('Keyword typing =>', target.value);
        setKeyword(target.value);
    };
    return (
        <input
            type='search'
            className='form-control form-control-sm ms-1'
            placeholder='Email or Name'
            value={keyword} // lấy state keyword về hiên thị
            onChange={onTyping} // bắt sự kiện gõ gọi hàm onTyping hàm onTyping sẽ lắng nghe event
        />
    );
};

export default LiveSearch;
