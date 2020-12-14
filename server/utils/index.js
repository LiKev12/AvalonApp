getTimestamp = () => {
    let now = new Date();
    let month = formatDateToString(now.getMonth() + 1);
    let day = formatDateToString(now.getDate());
    let year = now.getFullYear();
    let hours = formatDateToString(now.getHours());
    let minutes = formatDateToString(now.getMinutes());
    let seconds = formatDateToString(now.getSeconds());

    let res = `[${month}/${day}/${year} @ ${hours}:${minutes}:${seconds}] `;
    return res;
};

formatDateToString = before => {
    return before.toString().length === 1 ? '0' + before.toString() : before.toString();
};

module.exports = {
    getTimestamp
};
