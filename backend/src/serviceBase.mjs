import http from './httpService.mjs';

export async function call(url, dataKey, method, expectedErrors, body) {
  const result = { succeeded: false };
  let fullUrl = http.apiUrl + url;
  console.log("making call to get auth token ", fullUrl)
  try {
    const response = await http[method](fullUrl, body);
    result.succeeded = true;
    result[dataKey] = response.data;
  } catch (e) {
    const response = e.response || e;
    console.log("failed to authorize ", response)
    if (e.response) {
      result.errors = e.response.message
    } else {
      result.errors = [{
        message: 'Something is wrong with the service. Please try again later.',
      }];
    }
  }
  return result;
}
