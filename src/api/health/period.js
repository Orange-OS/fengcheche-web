import request from '@/utils/request.js'

// 获取姨妈数据
export function periodList(data) {
  // 请求参数格式：application / json
  return request({
    url: '/period/page',
    method: 'post',
    data
  })
}

export function test() {
  // 请求参数格式：application / json
  return request({
    url: '/period/test',
    method: 'get'
  })
}
