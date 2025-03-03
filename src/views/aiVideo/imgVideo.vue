<template>
  <div class="page-content">
    <div style="display: grid;grid-template-rows: 5fr 1fr;height: 80vh;">
      <div>
        <button @click="mergeSubtitles">保存配置</button>
        <button @click="genImgAll">一键配图</button>

        <div v-for="(sub, index) in subtitles" :key="sub.index" class="subtitle-item" style="border: 1px solid red">
          <p>{{ index }}</p>
          <p>{{ sub.start }} --> {{ sub.end }}</p>
          <p>{{ sub.text }}</p>
          <img src="" alt="">
          <button v-if="index !==0" @click="mergeSubtitles(index)">向上合并</button>
          <button @click="genImg(index)">配图</button>
        </div>


      </div>
      <div style="border: 1px solid red">
        1
      </div>
    </div>

  </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { TtsService } from "../../api/tts.js";
import { GptImgVideoService } from "../../api/gptImgVideo.js";
import { userService } from "../../api/user.js";
import { ApiStatus } from "../../utils/http/status.js";
import { HOME_PAGE } from "../../router/index.js";
import { ElMessage } from "element-plus";

// 合并后的字幕 临时
const mergedSubtitles = ref([]);

// 原始字幕数据
const subtitles = ref([
  // {index: 1, start: "00:00:00,256", end: "00:00:01,280", text: "养气望言守"},
  // {index: 2, start: "00:00:01,536", end: "00:00:02,816", text: "将心为不为"},
  // {index: 3, start: "00:00:03,328", end: "00:00:04,608", text: "动静之宗祖"},
  // {index: 4, start: "00:00:04,864", end: "00:00:05,888", text: "无事更寻谁 "}
]);
const subtitles_now_length = ref(0);


// 合并字幕函数
const mergeSubtitles = (index) => {
  mergedSubtitles.value = [];
  const last = subtitles.value[index - 1];
  const current = subtitles.value[index];

  subtitles_now_length.value = subtitles.value.length;

  console.log("前期处理");
  let srt_index = 0;
  for (let i = srt_index; i < index - 1; i++) {
    srt_index += 1;
    mergedSubtitles.value.push(subtitles.value[i]);
  }

  srt_index += 1;
  mergedSubtitles.value.push({
    index: srt_index,
    start: last.start,
    end: current.end,
    text: `${ last.text } ${ current.text }`
  });

  // console.log("后期处理");
  srt_index += 1;
  for (let i = srt_index; i < subtitles_now_length.value; i++) {
    subtitles.value[i].index = srt_index;
    mergedSubtitles.value.push(subtitles.value[i]);
    srt_index += 1;
  }
  subtitles.value = mergedSubtitles.value;
  subtitles_now_length.value = subtitles.value.length;

  console.log(subtitles.value);
};

// 配图
const genImg = (index) => {
  console.log("配图", index);
  console.log(subtitles.value[index]);
  console.log(subtitles.value[index].text);
};

// 一键配图
const genImgAll = () => {
  for (let i = 0; i < subtitles.value.length; i++) {
    console.log(subtitles.value[i].text);
  }
};

// 获取标签列表
const getImgVideoInfo = async () => {

  const res = await GptImgVideoService.ApiGetImgVideoInfo({
    av_id: 1,
  })
  console.log("===登录===")
  console.log(res)

  let {code, data} = res
  if (code === ApiStatus.success && data) {
    console.log(data)
    console.log(data.video_info)
    console.log(data.video_info.srt)
    subtitles.value = data.video_info.srt;
  } else {
    ElMessage.error(res.message)
  }

};

// 生命周期函数，组件挂载时调用
onMounted(() => {
  getImgVideoInfo();
});

</script>
