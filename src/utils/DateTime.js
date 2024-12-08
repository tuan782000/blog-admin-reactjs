import moment from 'moment';

const formatDateTime = datetime => {
    return moment(datetime).format('D/MM/YYYY h:mm:ss A');
};

export default formatDateTime;
