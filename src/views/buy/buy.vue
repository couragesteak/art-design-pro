<template>
  <div class="pricing-container">
    <!--    <div class="pricing-header">-->
    <!--      <h1 class="title">超过 53,476 位信赖的开发者</h1>-->
    <!--      <h2 class="subtitle">以及众多科技巨头的选择</h2>-->
    <!--    </div>-->

    <el-dialog v-model="payDialogVisible" title="支付" width="500" center
               :before-close="payDialogClose">
      <div>
        <img style="height: 200px" :src="qr_info" alt="">
        二维码过期时间：{{ time_all }}
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelPay">Cancel</el-button>
          <el-button type="primary" @click="cancelPay">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>

    <div class="pricing-cards">
      <el-row :gutter="20" justify="center">
        <el-col v-for="plan in pricingPlans" :key="plan.type" :xs="24" :sm="12" :md="6">
          <el-card class="pricing-card" :class="{ popular: plan.isPopular }" shadow="never">
            <div class="card-header">
              <h3>{{ plan.cl_title }}</h3>
              <p>时长：{{ plan.valid_days }}天</p>
              <p class="description">{{ plan.desc }}</p>
              <div class="price">
                <span class="amount">¥{{ plan.price }}</span>
                <span class="period">/一次性付款</span>
              </div>
            </div>

            <div class="features">
              <div v-for="(feature, index) in plan.features" :key="index" class="feature-item">
                <el-icon :class="feature.available ? 'available' : 'unavailable'">
                  <Check v-if="feature.available"/>
                  <Close v-else/>
                </el-icon>
                <span>{{ feature.text }}</span>
              </div>
            </div>

            <div class="card-footer">
              <el-button @click="buy(plan.cl_id)" type="primary" class="purchase-btn">立即购买</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
import { SubscribeService } from "@/api/subscribe";
import { PayService } from "@/api/pay";
import { GptImgVideoService } from "@/api/gptImgVideo";
import { ApiStatus } from "@/utils/http/status";
import { ElMessage } from "element-plus";

const payDialogVisible = ref(false);
const qr_info = ref("");
const time_all = ref(300);
const pay_status_front = ref<any>(null);

interface Feature {
  text: string
  available: boolean
}

interface PricingPlan {
  type: string
  title: string
  description: string
  price: number
  isPopular: boolean
  features: Feature[]
}

const pricingPlans = ref<PricingPlan[]>([
  {
    type: 'single',
    title: '单次使用版',
    description: '适用于单个最终产品，最终用户无需付费。',
    price: 349,
    isPopular: false,
    features: [
      { text: '完整源代码', available: true },
      { text: '技术文档', available: true },
      { text: 'SaaS应用授权', available: false },
    ]
  },
  {
    type: 'multiple',
    title: '多次使用版',
    description: '适用于无限个最终产品，最终用户无需付费。',
    price: 629,
    isPopular: false,
    features: [
      { text: '完整源代码', available: true },
      { text: '技术文档', available: true },
      { text: 'SaaS应用授权', available: false },
    ]
  },

])

// 关闭弹框
const payDialogClose = (done: () => void) => {
  payDialogVisible.value = false;
  pay_status_front.value = "stop";
}

// 获取套餐列表
const getComboList = () => {
  console.log("生成图片");
  // imgList.value = [];

  const data = {
    cl_type: "money"
  };
  console.log(data);

  SubscribeService.ApiGetMyComboList(data).then((res) => {
    console.log(">>> 添加任务");
    console.log(res);
    console.log(res.data);
    pricingPlans.value = res.data;
    // imgList.value = res.data.img_list;


  });

};

// 下单
const buy = async (cl_id) => {

  payDialogVisible.value = true;
  pay_status_front.value = "paying";

  console.log("购买: ", cl_id);
  // if (this.pay_type === "zfb") {
  //   this.get_alipay_trade_precreate();
  // }

  get_alipay_trade_precreate(cl_id);

}

const cancelPay = async () => {
  payDialogVisible.value = false;
  pay_status_front.value = "stop";
}

const get_ali_pay_status = async (out_trade_no) => {


  time_all.value = 295;
  let paramData = {
    out_trade_no: out_trade_no
  }
  const myInterval = setInterval(async function () {

    let res = await PayService.ApiGetAlipayStatus(paramData)
    console.log("===登录===")
    console.log(res)

    // let { code, msg, data } = res
    if (res.code === ApiStatus.success && res.data) {
      console.log(res.data)
      console.log(res.data.status)

      if (res.data.status === "pay_success") {
        ElMessage.success("支付成功");
        clearInterval(myInterval);
        payDialogVisible.value = false;
        return;
      }

    } else {
      console.log("异常")
      ElMessage.error(res.msg)
      clearInterval(myInterval);
      payDialogVisible.value = false;
    }

    if (pay_status_front.value == "stop") {
      clearInterval(myInterval);
      payDialogVisible.value = false;
      return;
    }

    time_all.value = time_all.value - 1;
    if (time_all <= 0) {
      clearInterval(myInterval);
      payDialogVisible.value = false;
      return;
    }

  }, 1000)
}

// 支付宝 订单预创建
const get_alipay_trade_precreate = async (cl_id) => {
  console.log("===支付宝 订单预创建===")
  const res = await PayService.ApiGetAlipayTradePrecreate({
    business_type: "money",      // 套餐类型 vip、money
    total_amount: 1, // 金额
    product_uuid: cl_id,         // 具体套餐id：vip_1、vip_6
  })

  console.log(res)

  let { code, data } = res
  if (code === ApiStatus.success && data) {
    console.log(data);
    // console.log(data.data);
    // console.log(data.out_trade_no);
    qr_info.value = data.data;
    get_ali_pay_status(data.out_trade_no);
  } else {
    ElMessage.error(res.message)
  }

}

onMounted(() => {
  getComboList();
});

</script>

<style lang="scss" scoped>
.pricing-container {
  padding: 5rem 1rem !important;
  background-color: transparent !important;
  border: none !important;

  .pricing-header {
    margin-bottom: 40px;
    text-align: center;

    .title {
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
      font-weight: 500;
    }

    .subtitle {
      font-size: 1.4rem;
      font-weight: 400;
      color: #666;
    }
  }

  .pricing-cards {
    margin-top: 80px;

    .el-col {
      margin-bottom: 20px;
    }

    .pricing-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      border-radius: 10px;

      &.popular {
        position: relative;
        border: 2px solid var(--el-color-primary);

        &::after {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 2px 8px;
          font-size: 12px;
          color: var(--el-color-primary);
          content: '热门';
          background-color: var(--el-color-primary-light-9);
          border-radius: 12px;
        }
      }

      .card-header {
        margin-bottom: 20px;

        h3 {
          margin-bottom: 10px;
          font-size: 1.3rem;
          color: var(--art-text-gray-900) !important;
        }

        .description {
          display: -webkit-box;
          height: 40px;
          padding-bottom: 20px;
          margin-bottom: 20px;
          overflow: hidden;
          font-size: 14px;
          color: var(--art-text-gray-600);
          text-overflow: ellipsis;
          border-bottom: 1px solid var(--art-border-color);
          -webkit-box-orient: vertical;
        }

        .price {
          margin-top: 30px;

          .amount {
            font-size: 1.8rem;
            font-weight: 600;
          }

          .period {
            margin-left: 10px;
            font-size: 14px;
            color: var(--art-text-gray-600);
          }
        }
      }

      .features {
        flex-grow: 1;
        margin-bottom: 20px;

        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          font-size: 14px;

          .el-icon {
            margin-right: 10px;

            &.available {
              color: var(--el-color-primary);
            }

            &.unavailable {
              color: var(--el-color-danger);
            }
          }
        }
      }

      .card-footer {
        margin-top: auto;
        text-align: center;

        .purchase-btn {
          width: 100%;
          height: 40px;
        }
      }
    }
  }
}

@media only screen and (max-width: $device-notebook) {
  .pricing-container {
    padding: 2rem 0 !important;

    .pricing-cards {
      margin-top: 0;
    }
  }
}

@media only screen and (max-width: $device-phone) {
  .pricing-container {
    .pricing-header {
      .title {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1.5rem;
      }
    }

    .el-col {
      margin-bottom: 20px;
    }
  }
}
</style>
