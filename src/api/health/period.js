import request from '@/utils/request.js'

// 获取姨妈数据
export function periodPage(data) {
  // 请求参数格式：application / json
  return request({
    url: '/period/page',
    method: 'post',
    data
  })
}

export function periodAdd(data) {
  // 请求参数格式：application / json
  return request({
    url: '/period/add',
    method: 'post',
    data
  })
}

export function periodDel(id) {
  // 请求参数格式：application / json
  return request({
    url: '/period/del/' + id,
    method: 'get'
  })
}
