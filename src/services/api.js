import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:8081/api/public/v1' })
export const getFiltered = (country, category, page=0, size=6) => api.get(`/opportunities/filter`, {params:{country, category, page, size}}).then(r=>r.data)
export const getOptions = () => api.get(`/opportunities/options`).then(r=>r.data)
export const explain = (id) => api.get(`/opportunities/${id}/explain`).then(r=>r.data)
export const collect = (c,code,cat) => api.post(`/opportunities/collect?country=${c}&countryCode=${code}&category=${cat}`).then(r=>r.data)
export const collectBatch = (items) => api.post(`/opportunities/collect/batch`, {items}).then(r=>r.data)
export const refresh = () => api.post(`/opportunities/refresh`).then(r=>r.data)
export default api