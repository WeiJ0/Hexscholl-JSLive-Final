export const timestampToTime = timestamp => {
    const date = new Date(timestamp * 1000)
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const D = date.getDate() + ' ';
    return Y + M + D;
}