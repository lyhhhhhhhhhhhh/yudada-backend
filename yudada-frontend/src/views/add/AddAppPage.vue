<template>
  <div id="AddAppPage">
    <h2 style="margin-bottom: 16px">创建应用</h2>
    <a-form
      style="width: 480px"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="appName" label="应用名称">
        <a-input v-model="form.appName" placeholder="请输入应用名称" />
      </a-form-item>
      <a-form-item field="appDesc" label="应用名称">
        <a-input v-model="form.appDesc" placeholder="请输入应用描述" />
      </a-form-item>
      <a-form-item field="appIcon" label="应用图标">
        <a-input v-model="form.appIcon" placeholder="请输入应用名称" />
      </a-form-item>
      <a-form-item field="appType" label="应用类型">
        <a-select
          v-model="form.appType"
          :style="{ width: '320px' }"
          placeholder="请选择应用类型"
        >
          <a-option
            v-for="(value, key) of APP_TYPE_MAP"
            :value="Number(key)"
            :label="value"
            :key="key"
          />
        </a-select>
      </a-form-item>
      <a-form-item field="scoringStrategy" label="评分策略">
        <a-select
          v-model="form.scoringStrategy"
          :style="{ width: '320px' }"
          placeholder="请选择"
        >
          <a-option
            v-for="(value, key) of APP_SCORING_STRATEGY_MAP"
            :value="Number(key)"
            :label="value"
            :key="key"
          />
        </a-select>
      </a-form-item>
      <a-form-item>
        <div
          style="
            display: flex;
            width: 100%;
            align-content: space-between;
            justify-content: space-between;
          "
        >
          <a-button type="primary" html-type="submit" style="width: 120px">
            提交
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, ref, watchEffect, withDefaults } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import API from "@/api";
import { useLoginUserStore } from "@/store/userStore";
import {
  addAppUsingPost,
  editAppUsingPost,
  getAppVoByIdUsingGet,
} from "@/api/appController";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constant/app";

/**
 * 表单信息
 */
const form = ref({
  appDesc: "",
  appIcon: "",
  appName: "",
  appType: 0,
  scoringStrategy: 0,
} as API.AppAddRequest);

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => {
    return ";";
  },
});

const router = useRouter();
const loginUserStore = useLoginUserStore();

const oldApp = ref<API.AppVO>();

const loadData = async () => {
  if (!props.id) {
    return;
  }
  const res = await getAppVoByIdUsingGet({ id: props.id as any });
  if (res.data.code === 0 && res.data.data) {
    console.log(res);
    oldApp.value = res.data.data || [];
    form.value = res.data.data;
  } else {
    message.error("获取题目失败" + res.data.message);
  }
};

//获取旧数据
watchEffect(() => {
  loadData();
});

/**
 * 提交表单
 * @param data
 */
const handleSubmit = async () => {
  let res: any;
  //判断是否为修改
  if (props.id) {
    res = await editAppUsingPost({
      id: props.id as any,
      ...form.value,
    });
  } else {
    //修改
    res = await addAppUsingPost(form.value);
  }
  // 登录成功，跳转到主页
  if (res.data.code === 0) {
    message.success("操作成功");
    setTimeout(() => {
      router.push({
        path: `/app/detail/${props.id ?? res.data.data}`,
      });
    }, 3000);
  } else {
    message.error("操作失败，" + res.data.message);
  }
};
</script>
