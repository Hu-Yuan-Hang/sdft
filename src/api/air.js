import request from '@/utils/request'

export default {
    
    getConsume() {
        return request ({
            url: 'air/device/consume',
            method: 'get'
        })
    },
    
    getRank() {
        return request ({
            url: 'air/device/rank',
            method: 'get'
        })
    },

    getRankTable() {
        return request ({
            url: 'air/device/rank/table',
            method: 'get'
        })
    }
}