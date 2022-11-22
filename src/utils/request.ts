import axios, { AxiosInstance } from 'axios'
import qs from 'qs'

const instance: AxiosInstance = axios.create({
    timeout: 25000,
    baseURL: process.env.NODE_ENV === "development" ? "/" : "/api",
    headers: {
        'Content-Type': 'application/json'
    }
})

instance.interceptors.request.use(
    (config: any) => {
        if (config.showLoading) {
            
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

instance.interceptors.response.use(
    (response: any) => {
        if (response.config.showLoading) {
            
        }
        if (response.data.code !== 0) {
            return Promise.reject(response.data.msg)
        }
        return response
    },
    error => {
        
        return Promise.reject(error.message)
    }
)

const defaultConfig = { showLoading: true }
function get(url: string, params?: object, showLoading?: object, error?: string) {
    params = paramFilter(params)
    return new Promise((resolve, reject) => {
        instance
            .get(url, { params, ...defaultConfig, ...showLoading })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                err = error ? error : err
                console.error(err, 1)
                reject(err)
            })
    })
}

function post(url: string, params?: object, config?: any, error?: string) {
    const { headers } = config
    let param: any = ''
    if (headers && headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        param = qs.stringify(paramFilter(params))
    } else {
        param = paramFilter(params)
    }
    return new Promise((resolve, reject) => {
        instance
            .post(url, param, { ...defaultConfig, ...config })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                err = error ? error : err
                console.error(err, 1)
                reject(err)
            })
    })
}

function paramFilter(params: any): object {
    let result: any = {}
    for (let k in params) {
        if (params[k] !== '' && params[k] !== undefined && params[k] !== null) {
            // result[k] = window.encodeURIComponent(params[k]);
            result[k] = params[k]
        }
    }
    return result
}

export default {
    get,
    post
}
