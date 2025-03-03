import request from '@/utils/http'
import { BaseResult } from '@/types/axios'


export class GptImgVideoService {
  // 查询图片视频配置信息
  static ApiGetImgVideoInfo(params: any) {
    return request.post<BaseResult>({
      url: '/api/v1/getImgVideoInfo',
      params
    })
  }
}