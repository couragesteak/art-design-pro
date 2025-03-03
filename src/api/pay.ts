import request from '@/utils/http'
import { BaseResult } from '@/types/axios'


export class PayService {
  // 支付宝 交易订单预创建
  static ApiGetAlipayTradePrecreate(params: any) {
    return request.post<BaseResult>({
      url: '/api/v1/alipay/trade_precreate',
      params
    })
  }

  // 支付宝 支付状态查询
  static ApiGetAlipayStatus(params: any) {
    return request.post<BaseResult>({
      url: '/api/v1/alipay/payStatus',
      params
    })
  }
}