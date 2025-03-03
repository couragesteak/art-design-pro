import request from '@/utils/http'
import { BaseResult } from '@/types/axios'

// api
export class userService {
  static login(params: any) {
    return request.post<BaseResult>({
      url: '/api/v1/users/login',
      params
    })
  }
}
