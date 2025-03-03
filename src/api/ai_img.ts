import request from '@/utils/http'
import { BaseResult } from '@/types/axios'


export class AiImgService {
  // 查询图片视频配置信息
  static ApiAiGenImg(params: any) {
    return request.post<BaseResult>({
      url: '/api/v1/ai_gen_img',
      params
    })
  }
}