import request from '@/utils/http'
import { BaseResult } from '@/types/axios'


export class SubscribeService {
  // 查询图片视频配置信息
  static ApiGetMyComboList(params: any) {
    return request.post<BaseResult>({
      url: '/api/v1/getMyComboList',
      params
    })
  }
}
