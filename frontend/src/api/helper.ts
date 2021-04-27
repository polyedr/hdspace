import { AxiosError, AxiosResponse } from 'axios';

export const onError = ({ response: r }: AxiosError) => {
  const response = r as any;
  if (typeof response !== 'undefined') {
    switch (response.status) {
      case 400:
        return {
          msg: 'Incorrect request.',
          response,
        };
      case 401:
        return {
          msg: 'User not authorised!',
          response,
        };
      case 403:
        return {
          msg: 'Given token not valid for any token type.',
          response,
        };
      case 404:
        return {
          msg: 'Page not found!',
          response,
        };
      case response.status >= 500:
        return {
          msg: 'Server error. Please, try later.',
          response,
        };
      default:
        return response.statusText;
    }
  } else {
    const errorMsg =
      'Request is not present in axios error, look at onError handler!';
    console.error(errorMsg);
    return {
      msg: 'Request is not present in axios error, look at onError handler!',
      response,
    };
  }
};

export const handleError = (error) => {
  console.error(error);
  return {
    error: error.response?.data?.detail || error.message,
  };
};

export const parseResult = <T>(result: AxiosResponse<T>) => result?.data;

export const parseCursor = (nextUrl: string | null) => {
  if (nextUrl === null) {
    return null;
  }
  return new URL(nextUrl).searchParams.get('cursor');
};
