import axios from 'axios';

const request = async ({url, data, method = 'get',headers = {}, timeout = 60000, alertEnabled = true}) => {
  const options = {
    method,
    timeout,
    url,
    headers
  };
  if (method.toLowerCase() === 'get') options.params = data;
  else options.data = data;
  try {
    const res = await axios(options);
    const result = res.data
    if (result && (result.code === 1000)) return result.data || result.resultMap;
    console.error(result);
    console.error(options);
    if (alertEnabled && result) {
      result.message && alert(result.message);
    }
    return Promise.reject(result);
  }
  catch(e) {
    console.error(e);
    console.error(options);
    alertEnabled && e.message && alert(e.message);
    return Promise.reject(e);
  }
};

export default request;
