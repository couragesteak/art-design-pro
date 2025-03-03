import request from '@/utils/http'
import { BaseResult } from '@/types/axios'


export class TtsService {
  // 获取标签列表
  static ApiGetVoiceTagList(params: any) {
    return request.post<BaseResult>({
      url: '/api/v1/tts/getVoiceTagList',
      params
    })
  }

  // 获取任务声音列表
  static getVoiceCharacter(params: any) {
    return request.post<BaseResult>({
      url: '/api/v1/tts/getVoiceCharacter',
      params
    })
  }

  // 获取任务 具体声音 样例
  static ApiGetVoiceCharacterSample(params: any) {
    return request.post<BaseResult>({
      url: '/api/v1/tts/getVoiceCharacterSample',
      params
    })
  }

  // 添加合成任务
  static ApiAddTTSTask(params: any) {
    return request.post<BaseResult>({
      url: '/api/v1/tts/addTask',
      params
    })
  }

  // 查询 指定 历史合成记录
  static ApiGetTTSHistoryById(params: any) {
    return request.post<BaseResult>({
      url: '/api/v1/tts/getHistoryById',
      params
    })
  }

  // 查询历史合成记录
  static ApiGetTTSHistory(params: any) {
    return request.post<BaseResult>({
      url: '/api/v1/tts/getHistory',
      params
    })
  }

  // 更新收藏信息
  static ApiUpdateFavorite(params: any) {
    return request.post<BaseResult>({
      url: '/tts/updateFavorite',
      params
    })
  }

}
