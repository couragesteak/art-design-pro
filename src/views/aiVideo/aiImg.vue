<template>
  <div style="padding: 15px;">

    <div style="display: grid;grid-template-columns: 1fr 300px;">
      <div style="display: grid;grid-template-columns: repeat(3, 1fr);gap: 5px;">
        <div v-for="(image, index) in imgList" :key="index">
          <a :href="image" target="_blank">
            <img :src="image" alt="Image" style="height: 250px"/>
          </a>
        </div>
      </div>
      <div>
        <el-form-item label="风格">
          <el-select v-model="style_key" placeholder="请选择">
            <el-option
              v-for="item in style_list"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="大小">
          <el-radio-group v-model="img_size" @change="aTypeChange">
            头像
            <el-radio key="768x768" label="768x768">头像768x768</el-radio>
            <el-radio key="1024x1024" label="1024x1024">头像1024x1024</el-radio>
            <el-radio key="1536x1536" label="1536x1536">头像1536x1536</el-radio>
            <el-radio key="2048x2048" label="2048x2048">头像2048x2048</el-radio>

            <el-radio key="1024x768" label="1024x768">文章1024x768</el-radio>
            <el-radio key="2048x1536" label="2048x1536">文章2048x1536</el-radio>

            <el-radio key="768x1024" label="768x1024">海报768x1024</el-radio>
            <el-radio key="576x1024" label="576x1024">海报576x1024</el-radio>
            <el-radio key="1152x2048" label="1152x2048">海报1152x2048</el-radio>
            <el-radio key="1536x2048" label="1536x2048">海报1536x2048</el-radio>

            <el-radio key="1024x576" label="1024x576">电脑壁纸1024x576</el-radio>
            <el-radio key="2048x1152" label="2048x1152">电脑壁纸2048x1152</el-radio>

          </el-radio-group>
        </el-form-item>

      </div>
    </div>
    <div>
      <div>
        正向提示词
        <el-input
          v-model="prompt"
          style="width: 540px"
          :autosize="{ minRows: 3, maxRows: 15 }"
          type="textarea"
          placeholder="Please input"
        />
      </div>
      <div>
        反向提示词
        <el-input
          v-model="negative_prompt"
          style="width: 540px"
          :autosize="{ minRows: 3, maxRows: 15 }"
          type="textarea"
          placeholder="Please input"
        />
      </div>
      <button @click="genImg">一键配图</button>
    </div>


  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AiImgService } from "@/api/ai_img";


const img_size = ref("1024x1024");
const style_key = ref("Base");
const style_list = ref([
  {key: "Base", name: "基础风格"},
  {key: "3D Model", name: "3D模型"},
  {key: "Analog Film", name: "模拟胶片"},
  {key: "Anime", name: "动漫"},
  {key: "Cinematic", name: "电影"},
  {key: "Comic Book", name: "漫画"},
  {key: "Craft Clay", name: "工艺黏土"},
  {key: "Digital Art", name: "数字艺术"},
  {key: "Enhance", name: "增强"},
  {key: "Fantasy Art", name: "幻想艺术"},
  {key: "Isometric", name: "等距风格"},
  {key: "Line Art", name: "线条艺术"},
  {key: "Lowpoly", name: "低多边形"},
  {key: "Neonpunk", name: "霓虹朋克"},
  {key: "Origami", name: "折纸"},
  {key: "Photographic", name: "摄影"},
  {key: "Pixel Art", name: "像素艺术"},
  {key: "Texture", name: "纹理"},
]);

// 合并后的字幕 临时
const imgList = ref([
  // "https://static.couragesteak.com/ai/img/Humcr.jpg",
  // "https://static.couragesteak.com/ai/img/Humcr.jpg",
  // "https://static.couragesteak.com/ai/img/Humcr.jpg",
  // "https://static.couragesteak.com/ai/img/Humcr.jpg",
  // "https://static.couragesteak.com/ai/img/Humcr.jpg",
]);
const prompt = ref("古人修道、古风、图画");
const negative_prompt = ref("丑陋、缺失、边框");

// 配图
const genImg = () => {
  console.log("生成图片");
  imgList.value = [];

  const data = {
    prompt: prompt.value,
    negative_prompt: negative_prompt.value,
    size: img_size.value,
  };
  console.log(data);

  AiImgService.ApiAiGenImg(data).then((res) => {
    console.log(">>> 添加任务");
    console.log(res);
    console.log(res.data.img_list);

    imgList.value = res.data.img_list;


  });

};

</script>
