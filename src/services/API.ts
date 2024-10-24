import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import axios from 'axios'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import { log } from 'console';
import { toast } from 'react-toastify';

const urlsToNotUse = ['assets'];

const notify = (text:string) => toast.error(text);

function createLoaderElement(): void {
  document.body.classList.add('loading-indicator');
}

function removeLoaderElement(): void {
  document.body.classList.remove('loading-indicator');
}

function isValidRequestForInterceptor(url: string): boolean {
  for (const address of urlsToNotUse) {
      if (new RegExp(address).test(url)) {
          return false;
      }
  }
  return true;
}

// export const API = axios.create({
//   baseURL: "http://68.183.3.120:4000/api/",
//   headers: {
//     "Content-Type": "multipart/form-data"
//   }
// })

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string | undefined } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string
      method: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {    
    try {
    axios.interceptors.response.use(
        (res) => {          
            removeLoaderElement();
            console.log(res, "resresresres");
            if (res?.data?.error) {
              
              
                toast.error(res?.data?.error.message, {
                  //@ts-ignore
                    position: toast.POSITION.TOP_RIGHT
                });
                return Promise.reject(res?.data?.error)
            }
            return res;
        },
        async (err) => {
            removeLoaderElement();
            if (err.response.status === 403) {
             localStorage.removeItem("access-token")
            }
            return Promise.reject(err)
        }
    )
      axios.interceptors.request.use(
        (config) => {
            if (isValidRequestForInterceptor(config.url!)) {
                createLoaderElement();
            }
            const token = localStorage.getItem('access-token');
            if (config.url !== 'auth/login/role' && !!config?.headers && token) {
              console.log("kkkkkkkkk");
              
                config.headers.Authorization = `Bearer ${token}`
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    )
      const result = await axios({ url: baseUrl + url, method, data, params })
      return { data: result.data }
    } catch (axiosError) {
      let err = axiosError as AxiosError      
      notify(err.message);
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }
export default axiosBaseQuery;