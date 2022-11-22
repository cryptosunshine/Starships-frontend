import axios from './request'


export function contractList(params?: object, config?: object) {
    return axios.get('/demo', params, { ...config })
}


