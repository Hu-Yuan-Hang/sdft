import request from '@/utils/request'

export default {
    getBoilderData(num) {
        return request({
            url: '/boiler',
            method: 'get',
            data: { num }
        })
    },
} 