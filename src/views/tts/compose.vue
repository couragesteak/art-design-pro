<template>
  <div class="page-content">

    <el-dialog v-model="dialogVisible" title="Warning" height="300" center>
      <div>
        <div style="border: 0px solid red; display: flex;">
          <div
            v-for="(item, index) in voice_tag_list"
            :key="item.id"
            @click="select_voice_tag(item.id, item.tag_name_en)"
            style="border: 0px solid red; height: 30px; padding-left: 10px; padding-right: 10px; display: flex; justify-content: center; align-items: center;"
          >
            {{ item.tag_name_cn }}
          </div>
        </div>

        <div style="display: flex;">
          <div style="width: 950px; height: 450px; overflow: scroll">
            <div id="voice_box" style="display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 5px;">
              <div
                class="voice_card"
                :class="{ active: index === currentIndex }"
                v-for="(item, index) in voice_character_list"
                :key="item.tvc_id"
                @click="tvc_id_change(index, item.tvc_id, item.voice_id, item.voice_name_cn, item.voice_name_en, item.style_list, item.role_play_list, item.vender, item.sample_rate_list, item.favorite_status, item.sample_url, item.favorite_tag)"
              >
                <div style="height: 25px; width: 30px; border: 0px solid red;">
                  <img :src="get_avatar(item.avatar)" style="height: 100%"/>
                </div>

                <div style="font-size: 13px; border: 0px solid red; flex: 1;">
                  <div>
                    <b>{{ item.voice_name_cn }}</b>
                  </div>
                  <div style="font-size: 10px;">
                    标签：<span style="color: blue;">{{ item.favorite_tag }}</span>
                  </div>
                </div>

                <div style="display: flex; flex-direction: column; width: 20px; border: 0px solid blue; padding: 3px;">
                  <div style="z-index: 999; border: 0px solid red; position: relative; top: 0; right: 0;">
                    <i
                      class="el-icon-star-on"
                      v-if="get_favorite_status(item.favorite_status)"
                      style="color: blue; font-size: 10px"
                    ></i>
                    <i
                      class="el-icon-star-off"
                      v-else
                      style="color: blue; font-size: 10px"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style="width: 290px; padding: 10px; height: 250px; overflow: scroll">
            <!-- 人物 -->
            <div class="config_list">
              <div @click="dialogVisible = true">
                <span>人物：</span>
                <span style="color: blue;">{{ voice_name_cn }} {{ voice_name_en }}</span>
              </div>
            </div>

            <div v-if="tvc_id > 0">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="自定义音色标签"
                v-model="favorite_tag"
              ></el-input>

              <el-checkbox @change="favorite_info_change" v-model="favorite_status">
                <span v-if="favorite_status">已收藏</span>
                <span v-else>未收藏</span>
              </el-checkbox>

              <button @click="save_favorite_change" style="margin: 3px;">保存编辑</button>
            </div>

            <!-- 样例 -->
            <div
              v-for="(item, index) in character_sample_list"
              :key="index"
              style="border: 0px solid red; height: 30px; padding-left: 10px; padding-right: 10px; display: flex; align-items: center;"
              @click="play_music(item.sample_url)"
            >
              {{ item.style_name_cn }}
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>

    <div style="display: flex; ">

      <!-- 输入框 -->
      <div style="padding: 20px; width: 600px;">
        <el-card>
          <div>配音文本内容</div>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            clearable
            :autosize="{ minRows: 25, maxRows: 27 }"
            v-model="textarea"
            @blur="checkBannerWord"
            @change="textarea_change"
            :show-word-limit="true"
            :maxlength="3000"
          />
        </el-card>
      </div>

      <div style="padding: 20px; position: relative; min-width: 350px; max-width: 450px;">
        <el-card class="box-card">
          <div class="config">
            <div class="config_list">

              <div @click="dialogVisible = true">
                <span>人物：</span>
                <span style="color: blue;">{{ voice_name_cn }} {{ voice_name_en }}</span>
              </div>
            </div>

            <div class="config_list">
              <span>风格：</span>
              <el-select v-model="style_id" placeholder="请选择">
                <el-option
                  v-for="item in style_list"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </div>

            <div class="config_list">
              <span>角色：</span>
              <el-select v-model="role_play_id" placeholder="请选择">
                <el-option
                  v-for="item in role_play_list"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </div>

            <div class="config_list">
              <span style="width: 90px;">音量：</span>
              <div style="flex: 1; margin-left: 5px;">
                <el-slider
                  v-model="volume"
                  :value="volume_default"
                  :step="volume_step"
                  :max="volume_max"
                  :min="volume_min"
                />
              </div>
              <div style="margin-left: 15px;">{{ volume }}</div>
            </div>

            <div class="config_list">
              <span style="width: 90px;">语速：</span>
              <div style="flex: 1; margin-left: 5px;">
                <el-slider
                  v-model="rate_value"
                  :value="speed_default"
                  :step="speed_step"
                  :max="speed_max"
                  :min="speed_min"
                />
              </div>
              <div style="margin-left: 15px;">{{ rate_value }}</div>
            </div>

            <div v-show="pitch_status" class="config_list">
              <span style="width: 90px;">语调强度：</span>
              <div style="flex: 1; margin-left: 5px;">
                <el-slider
                  v-model="pitch_value"
                  :value="pitch_default"
                  :step="pitch_step"
                  :max="pitch_max"
                  :min="pitch_min"
                />
              </div>
              <div style="margin-left: 15px;">{{ pitch_value }}</div>
            </div>

            <div>
              音频采样率
              <el-radio-group v-model="sample_rate">
                <div>777</div>
                <el-radio v-for="(item, index) in sample_rate_list" :label="item" :key="index">{{ item }}</el-radio>
              </el-radio-group>
            </div>

            <div style="font-size: 12px; background-color: #f5f7fa; padding: 10px;">
              <div v-show="volume_status">
                <b>音量说明</b>
                <p>{{ volume_desc }}</p>
              </div>

              <div v-show="speed_status">
                <b>语速说明</b>
                <p>{{ speed_desc }}</p>
              </div>

              <div v-show="pitch_status">
                <b>语调说明</b>
                <p>{{ pitch_desc }}</p>
              </div>
            </div>

            <div>
              <el-button type="primary" @click="startCompose()" :loading="isComposing()">开始合成</el-button>
            </div>

            <div style="margin-left: 10px; margin: 15px;">
              <span>下载地址：</span>
              <span>
            <div style="margin: 15px;">
              <a :href="get_res_url()" target="_blank" style="color: blue;">{{ res_url }}</a>
            </div>
          </span>
            </div>
          </div>
        </el-card>

        <div style="margin-top: 15px;">
          <el-card class="box-card">
            <div>疑似违禁词</div>
            <div style="color: red;">
              {{ has_banner_word_list }}
            </div>
            <br/>
          </el-card>
        </div>
      </div>

    </div>

    <audio id="audio" hidden></audio>

  </div>
</template>

<script lang="ts" setup>
// 设置组件的名称
import { onMounted, ref, reactive } from "vue";
import { TtsService } from "@/api/tts";

import WaveSurfer from "wavesurfer.js";

// import {
//   ApiAddTTSTask,
//   ApiGetTTSHistoryById,
//   ApiGetVoiceCharacterSample,
//   ApiGetVoiceTagList,
//   getVoiceCharacter
// } from "@/api/tts";

defineOptions({
  name: "tts_compose",
});

// 音频
// npm i wavesurfer.js
// import WaveSurfer from "wavesurfer.js";

const wavesurfer = ref(null);
const wavesurfer_play_status = ref("pause");
const tts_audio_url = ref(null);


const currentIndex = ref(-1);     // 声音的声音索引
const dialogVisible = ref(false);

const voice_character_list = ref([ {
  tvc_id: 0,
  voice_name_cn: '未选择'
} ]);
const voice_tag_list = ref([]);
const character_sample_list = ref([]);
const voice_vender_config = ref({});
const voice_config_now = ref<any>({});

// 音量
const volume_status = ref(true);
const volume = ref(100);
const volume_default = ref(50);
const volume_step = ref(1);
const volume_max = ref(100);
const volume_min = ref(0);
const volume_desc = ref("");

// 语速
const speed_status = ref(true);
const rate_value = ref(1.0);
const speed_min = ref(0.2);
const speed_max = ref(3);
const speed_step = ref(0.1);
const speed_default = ref(1);
const speed_desc = ref("");

// 风格强度/语调
const pitch_status = ref(true);
const pitch_value = ref(1);
const pitch_min = ref(0.01);
const pitch_max = ref(2);
const pitch_step = ref(0.01);
const pitch_default = ref(1);
const pitch_desc = ref("");

// 音频采样率
const sample_rate = ref("");
const sample_rate_list = ref([]);

const textarea = ref('');            // 当前文本内容
const tvc_id = ref(0);               // 当前声音id
const voice_id = ref<any>('');            // 当前声音uuid
const voice_name_cn = ref("未选择"); // 当前声音中文名
const voice_name_en = ref("");       // 当前声音英文名
const sample_url = ref("");          // 当前声音样例
const res_url = ref("");             // 当前声音样例
const style_id = ref("Default");
const style_list = ref([]);
const vender = ref("");
const role_play_id = ref("Default");
const role_play_list = ref([]);
const favorite_status = ref(false);
const favorite_tag = ref("");
const is_compose = ref(false);    // 是否正在合成中
const has_banner_word_list = ref("");    // 违禁词


const getTTSHistoryById = (tts_uuid) => {

  const data = { tts_uuid: tts_uuid };

  const myInterval = setInterval(function () {

    TtsService.ApiGetTTSHistoryById(data).then((res) => {
      console.log(">>> 添加任务");
      console.log(res);
      if (res.code === 20000) {
        if (res.data.status === 'success') {
          console.log("合成成功");
          clearInterval(myInterval);
          is_compose.value = false;
          res_url.value = res.data.tts_audio_url;
        } else {
          console.log("合成中");
        }
      } else {
        console.log("合成状态异常");
      }

    });

    // ApiGetTTSHistoryById(data)
    //   .then(({ data }) => {
    //     console.log(">>> 添加任务");
    //     console.log(data);
    //     if (data.code === 20000) {
    //       console.log("任务添加成功");
    //       console.log(data);
    //       // 停止定时器
    //       // clearInterval(myInterval);
    //       // is_compose.value = false;
    //     } else if (data.code === -1) {
    //
    //     } else {
    //
    //     }
    //
    //   })
  }, 2000);


};

const startCompose = () => {
  console.log('开始合成');

  is_compose.value = true;
  console.log(tvc_id.value);


  if (tvc_id.value === 0) {
    console.log("请选择人物");
    alert("请选择人物")
    // notifyError(that, "请选择人物", "请选择人物");
    // that.is_compose = false;
    return;
  }
  if (textarea.value === '') {
    console.log("请选择输入您的文本内容哦");
    alert("请选择输入您的文本内容哦");
    // notifyError(that, "", "请选择输入您的文本内容哦")
    // that.is_compose = false;
    return;
  }

  is_compose.value = true;

  const data = {
    tvc_id: tvc_id.value,
    style_id: style_id.value,
    role_play_id: role_play_id.value,
    tts_content: textarea.value,
    volume: volume.value,
    rate: rate_value.value,
    pitch: pitch_value.value,
    vender: vender.value,
  };
  console.log(data);

  TtsService.ApiAddTTSTask(data).then((res) => {
    console.log(">>> 添加任务");
    console.log(res);
    if (res.code === 20000) {
      console.log("任务添加成功");
      console.log(data);
      getTTSHistoryById(res.data.tts_uuid);
      // is_compose.value = false;
    }

  });

  // ApiAddTTSTask(data)
  //   .then(({ data }) => {
  //     console.log(">>> 添加任务");
  //     console.log(data);
  //     if (data.code === 20000) {
  //       console.log("任务添加成功");
  //       console.log(data);
  //       getTTSHistoryById(data.tts_uuid);
  //       // is_compose.value = false;
  //     } else if (data.code === -1) {
  //
  //     } else {
  //
  //     }
  //
  //   })
  //   .catch((res) => {
  //     console.log(res);
  //     // tableData.value = []
  //   })
  //   .finally((res) => {
  //    console.log(res);
  //   });

};

const isComposing = () => {
  return is_compose.value; // 修改为合成过程中的 loading 状态
};

const get_res_url = () => {
  return res_url.value;
};

const get_avatar = (avatar) => {
  return avatar;
};
const get_favorite_status = (status) => {
  return status;
};

// 获取标签列表
const getVoiceTagList = async () => {
  TtsService.ApiGetVoiceTagList({})
    .then(({ data }) => {
      // console.log(">>>>>>");
      // console.log(data);
      // console.log("===");
      voice_tag_list.value = data;
    })
    .catch(() => {
      console.log("===");
    })
    .finally(() => {
      // loading.value = false
    });
};

// 获取标签列表
const select_voice_tag = async (voice_tag_id, tag_name_en) => {
  console.log(voice_tag_id, tag_name_en)

  // 获取 人物列表
  let data = { "tag_name_en": tag_name_en }
  voice_character_list.value = [];
  TtsService.getVoiceCharacter(data)
    .then(({ data }) => {
      console.log("666");
      console.log(data);
      voice_character_list.value = data.voice_list;
    })
    .catch(() => {
      console.log("===");
    })
    .finally(() => {
      // loading.value = false
    });
};


// 获取 人物列表
const getVoiceCharacterList = async () => {
  // const data = { "tag_name_en": "favorite" }
  const data = { "tag_name_en": "all" }
  TtsService.getVoiceCharacter(data)
    .then(({ data }) => {
      console.log("获取 人物列表");
      console.log(data.vender_config);
      voice_character_list.value = data.voice_list;
      voice_vender_config.value = data.vender_config;
    })
    .catch(() => {
      // tableData.value = []
    })
    .finally(() => {
      // loading.value = false
    });
};

// 获取 人物列表
const getVoiceCharacterSample = async (tvc_id) => {
  // const data = { "tag_name_en": "favorite" }
  const data = { "tvc_id": tvc_id }
  TtsService.ApiGetVoiceCharacterSample(data)
    .then(({ data }) => {
      console.log("===");
      console.log(data);
      character_sample_list.value = data;
    })
    .catch(() => {
      // tableData.value = []
    })
    .finally(() => {
      // loading.value = false
    });
};

// 选择 配音人物
const tvc_id_change = async (index_tmp, tvc_id_tmp, voice_id_tmp, voice_name_cn_tmp, voice_name_en_tmp,
                             style_list_tmp, role_play_list_tmp, vender_tmp, sample_rate_list_tmp, favorite_status_tmp, sample_url_tmp, favorite_tag_tmp) => {

  console.log("------ tvc_id_change -------")
  console.log(style_list_tmp);
  console.log(role_play_list_tmp);
  // 声音 索引
  currentIndex.value = index_tmp;
  // 声音 具体信息
  tvc_id.value = tvc_id_tmp;
  voice_id.value = voice_id_tmp;
  voice_name_cn.value = voice_name_cn_tmp;
  voice_name_en.value = voice_name_en_tmp;

  style_list.value = style_list_tmp;
  role_play_list.value = role_play_list_tmp;

  // 风格+角色重置
  style_id.value = "Default";
  role_play_id.value = "Default";
  res_url.value = "";

  vender.value = vender_tmp;

  favorite_status.value = favorite_status_tmp;
  favorite_tag.value = favorite_tag_tmp;

  // 获取 不同风格样例
  getVoiceCharacterSample(tvc_id_tmp);

  // 播放
  // this.play_music(sample_url_tmp);

  //  参数调整改变
  console.log("===================调整默认配置===================")
  console.log("vender: " + vender_tmp);
  volume_status.value = true;
  speed_status.value = true;
  pitch_status.value = true;
  if (vender_tmp === "tc") {
    console.log("tc");
    console.log(voice_vender_config.value.tc_config);

    volume_min.value = voice_vender_config.value.tc_config.volume_min;
    volume_max.value = voice_vender_config.value.tc_config.volume_max;
    volume_step.value = voice_vender_config.value.tc_config.volume_step;
    volume.value = voice_vender_config.value.tc_config.volume_default;
    volume_desc.value = voice_vender_config.value.tc_config.volume_desc;

    speed_min.value = voice_vender_config.value.tc_config.speed_min;
    speed_max.value = voice_vender_config.value.tc_config.speed_max;
    speed_step.value = voice_vender_config.value.tc_config.speed_step;
    rate_value.value = voice_vender_config.value.tc_config.speed_default;
    speed_desc.value = voice_vender_config.value.tc_config.speed_desc;

    pitch_status.value = false;
    pitch_min.value = 0;
    pitch_max.value = 0;
    pitch_step.value = 0;
    pitch_value.value = 0;
    pitch_desc.value = "无";

    sample_rate_list.value = sample_rate_list_tmp;

  } else if (vender_tmp === "hs") {
    volume_min.value = voice_vender_config.value.hs_config.volume_min;
    volume_max.value = voice_vender_config.value.hs_config.volume_max;
    volume_step.value = voice_vender_config.value.hs_config.volume_step;
    volume.value = voice_vender_config.value.hs_config.volume_default;
    volume_desc.value = voice_vender_config.value.hs_config.volume_desc;

    speed_min.value = voice_vender_config.value.hs_config.speed_min;
    speed_max.value = voice_vender_config.value.hs_config.speed_max;
    speed_step.value = voice_vender_config.value.hs_config.speed_step;
    rate_value.value = voice_vender_config.value.hs_config.speed_default;
    speed_desc.value = voice_vender_config.value.hs_config.speed_desc;

    pitch_min.value = voice_vender_config.value.hs_config.pitch_min;
    pitch_max.value = voice_vender_config.value.hs_config.pitch_max;
    pitch_step.value = voice_vender_config.value.hs_config.pitch_step;
    pitch_value.value = voice_vender_config.value.hs_config.pitch_default;
    pitch_desc.value = voice_vender_config.value.hs_config.pitch_desc;

    sample_rate_list.value = [];


  } else if (vender_tmp === "al") {
    volume_min.value = voice_vender_config.value.al_config.volume_min;
    volume_max.value = voice_vender_config.value.al_config.volume_max;
    volume_step.value = voice_vender_config.value.al_config.volume_step;
    volume.value = voice_vender_config.value.al_config.volume_default;
    volume_desc.value = voice_vender_config.value.al_config.volume_desc;

    speed_min.value = voice_vender_config.value.al_config.speed_min;
    speed_max.value = voice_vender_config.value.al_config.speed_max;
    speed_step.value = voice_vender_config.value.al_config.speed_step;
    rate_value.value = voice_vender_config.value.al_config.speed_default;
    speed_desc.value = voice_vender_config.value.al_config.speed_desc;

    pitch_min.value = voice_vender_config.value.al_config.pitch_min;
    pitch_max.value = voice_vender_config.value.al_config.pitch_max;
    pitch_step.value = voice_vender_config.value.al_config.pitch_step;
    pitch_value.value = voice_vender_config.value.al_config.pitch_default;
    pitch_desc.value = voice_vender_config.value.al_config.pitch_desc;

    sample_rate_list.value = sample_rate_list_tmp;

  } else if (vender_tmp === "ms") {
    console.log(voice_vender_config.value.ms_config)
    volume_min.value = voice_vender_config.value.ms_config.volume_min;
    volume_max.value = voice_vender_config.value.ms_config.volume_max;
    volume_step.value = voice_vender_config.value.ms_config.volume_step;
    volume.value = voice_vender_config.value.ms_config.volume_default;
    volume_desc.value = voice_vender_config.value.ms_config.volume_desc;

    speed_min.value = voice_vender_config.value.ms_config.speed_min;
    speed_max.value = voice_vender_config.value.ms_config.speed_max;
    speed_step.value = voice_vender_config.value.ms_config.speed_step;
    rate_value.value = voice_vender_config.value.ms_config.speed_default;
    speed_desc.value = voice_vender_config.value.ms_config.speed_desc;

    pitch_min.value = voice_vender_config.value.ms_config.pitch_min;
    pitch_max.value = voice_vender_config.value.ms_config.pitch_max;
    pitch_step.value = voice_vender_config.value.ms_config.pitch_step;
    pitch_value.value = voice_vender_config.value.ms_config.pitch_default;
    pitch_desc.value = voice_vender_config.value.ms_config.pitch_desc;

    sample_rate_list.value = [];

  } else if (vender_tmp === "bd") {
    volume_min.value = voice_vender_config.value.bd_config.volume_min;
    volume_max.value = voice_vender_config.value.bd_config.volume_max;
    volume_step.value = voice_vender_config.value.bd_config.volume_step;
    volume.value = voice_vender_config.value.bd_config.volume_default;
    volume_desc.value = voice_vender_config.value.bd_config.volume_desc;

    speed_min.value = voice_vender_config.value.bd_config.speed_min;
    speed_max.value = voice_vender_config.value.bd_config.speed_max;
    speed_step.value = voice_vender_config.value.bd_config.speed_step;
    rate_value.value = voice_vender_config.value.bd_config.speed_default;
    speed_desc.value = voice_vender_config.value.bd_config.speed_desc;

    pitch_min.value = voice_vender_config.value.bd_config.pitch_min;
    pitch_max.value = voice_vender_config.value.bd_config.pitch_max;
    pitch_step.value = voice_vender_config.value.bd_config.pitch_step;
    pitch_value.value = voice_vender_config.value.bd_config.pitch_default;
    pitch_desc.value = voice_vender_config.value.bd_config.pitch_desc;

    sample_rate_list.value = [];


  }
};


// 生命周期函数，组件挂载时调用
onMounted(() => {
  // console.log("组件已挂载");
  getVoiceTagList();
  getVoiceCharacterList();
});
</script>

<style scoped></style>
