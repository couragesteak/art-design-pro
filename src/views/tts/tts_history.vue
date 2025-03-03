<template>
  <div class="page-content">

    <div style="padding: 20px;position: relative;">

      <div>
        <el-table
          :data="tts_history_list"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          size="small"
        >

          <el-table-column
            prop="tts_uuid"
            label="订单号"
            width="190">
          </el-table-column>

          <el-table-column
            prop="voice_name_cn"
            label="配音人物"
            width="100">
          </el-table-column>

          <el-table-column label="内容" width="180">
            <template #default="scope">
              <el-popover effect="light" trigger="hover" placement="top" width="auto">
                <template #default>
                  <p>内容: {{ scope.row.tts_content }}</p>
                </template>
                <template #reference>
                  <el-tag>{{ getTruncatedText(scope.row.tts_content, 10) }}</el-tag>
                </template>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            label="地址"
            width="130">
            <template #default="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" @click="get_audio_url('audio', scope.row.tts_audio_url)">播放</el-tag>
                <el-tag size="medium" @click="down_audio(scope.row.tts_audio_url)">下载</el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="tts_duration"
            label="时长(秒)"
            width="100">
          </el-table-column>

          <el-table-column
            prop="tts_count"
            label="字数"
            width="50">
          </el-table-column>

          <el-table-column
            prop="tts_consum"
            label="消费"
            width="50">
          </el-table-column>

          <el-table-column
            prop="status"
            label="状态"
            width="100">
          </el-table-column>

          <el-table-column
            prop="createtime"
            label="创建时间"
            width="150">
          </el-table-column>

        </el-table>
      </div>

      <!--    <div class="block">-->

      <!--      <el-pagination-->
      <!--        @current-change="handleCurrentChange"-->
      <!--        :current-page="currentPage"-->
      <!--        :page-size="100"-->
      <!--        layout="total, prev, pager, next, jumper"-->
      <!--        :total="400">-->
      <!--      </el-pagination>-->
      <!--    </div>-->

      <!--      <audio id="audio" :src="tts_audio_url" hidden></audio>-->

    </div>

  </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { TtsService } from "../../api/tts.js";
import { ApiStatus } from "../../utils/http/status.js";
import { ElMessage } from "element-plus";

const tts_history_list = ref([]);

const tableRowClassName = async (row, rowIndex) => {
  if (row.status === "success") {
    console.log("成功");
    return 'success-row';
  } else if (row.status === "composing") {
    return 'warning-row';
  }
  return '';
}

// 获取 音频url
const get_audio_url = async (id, tts_audio_url) => {
  let that = this;
  // that.tts_audio_url = tts_audio_url;
  // document.getElementById(id).play();
}
const down_audio = async (tts_audio_url) => {
  console.log(tts_audio_url);
  // location.href = tts_audio_url;
  // window.open(tts_audio_url);
}

const getTruncatedText = (text, limit = 30) => {
  // 截取前 limit 个字符
  // return text;
  return text.length > limit ? text.substring(0, limit) + '...' : text;
}

// 查询tts合成记录
const getTtsHistory = async () => {

  const res = await TtsService.ApiGetTTSHistory({
    current_page: 1,
  })
  console.log("===查询tts合成记录===");
  console.log(res);

  let {code, data} = res
  if (code === ApiStatus.success && data) {
    console.log(data);
    console.log(data.tts_history_list);
    tts_history_list.value = data.tts_history_list;

  } else {
    ElMessage.error(res.message);
  }

};

// 生命周期函数，组件挂载时调用
onMounted(() => {
  getTtsHistory();
});

</script>
