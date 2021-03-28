// 从地址栏获取参数
const getParam = name => {
    const searchStr = window.location.search ? window.location.search.substr(1) : null;
    if (!searchStr) return;
    const searchPairStr = searchStr.split('&').filter(item => Boolean(item));
    const searchPairs = searchPairStr.map(item => {
        const arr = item.split('=');
        return {key: arr[0], value: arr[1]};
    });
    searchPairs.reverse();
    const searchPair = searchPairs.find(item => item.key === name);
    return searchPair ? searchPair.value : undefined;
};

// 对url追加参数
const appendParams = (url, params) => {
    const urlObj = new URL(url);
    for (let key in params) {
        const values = (params[key] instanceof Array) ? params[key] : [params[key]];
        values.forEach(v => {
            urlObj.searchParams.append(key, v);
        });
    }
    return urlObj.href;
};

export default {getParam, appendParams};
