import Url from './url';

const parseObjectToQuery = (obj) => {
	const arr = [];
	for (let key in obj) {
		const values = (obj[key] instanceof Array) ? obj[key] : [obj[key]];
		values.forEach(v => {
			arr.push(`${key}=${v}`);
		});
	}
	return arr.join('&');
};
const request = ({method, headers, timeout, data, url, success, error}) => {
	const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	xhr.timeout = timeout;
	try {xhr.responseType = 'json'}
	catch(e) {}
	const setHeaders = () => {
		// header参数
		if (headers) {
			for (let key in headers) {
				xhr.setRequestHeader(key, headers[key]);
			}
		}
	};
	// post表单请求
	if (method.toUpperCase() === 'FORM') {
		xhr.open('POST', url, true);
		setHeaders();
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset-UTF-8');
		xhr.send(parseObjectToQuery(data));
	}
	// post json请求
	else if (method.toUpperCase() === 'JSON') {
		xhr.open('POST', url, true);
		setHeaders();
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		xhr.send(JSON.stringify(data));
	}
	// get请求
	else {
		xhr.open('GET', Url.appendParams(url, data), true);
		setHeaders();
		xhr.send();
	}
	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4) {
			let responseData = xhr.response;
			// xhr.responseType = 'json'兼容处理
			if (typeof responseData === 'string') {
				try {
					responseData = JSON.parse(responseData);
				}
				catch(e) {
					error && error({e, response: responseData});
				}
			}
			if (xhr.status === 200) success && success(responseData);
			else error && error(xhr);
		}
	};
	xhr.ontimeout = (e) => {error && error(e)};
	xhr.onerror = (e) => {error && error(e)};
};
// promise为true时使用promise模式，否则使用传统的回调形式，调用success、error回调
const ajax = ({method = 'GET', headers, timeout = 30000, data = {}, url, promise = true, success, error}) => {
	if (promise) {
		return new Promise((resolve, reject) => {
			request({
				method,
				headers,
				timeout,
				data,
				url,
				success: resolve,
				error: reject,
			});
		});
	}
	else {
		request({
			method,
			headers,
			timeout,
			data,
			url,
			success,
			error,
		});
	}
};

export default ajax;
