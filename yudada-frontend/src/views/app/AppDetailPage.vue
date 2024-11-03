<template>
  <div class="appDetailPage">
    <a-card>
      <a-row style="margin-bottom: 16px">
        <a-col flex="auto" class="content-wrapper">
          <h2>{{ data.appName }}</h2>
          <p>{{ data.appDesc }}</p>
          <p>应用类型: {{ APP_TYPE_MAP[data.appType] }}</p>
          <p>评分策略: {{ APP_SCORING_STRATEGY_MAP[data.scoringStrategy] }}</p>
          <p>
            <a-space>
              作者:
              <div :style="{ display: 'flex', alignItems: 'center' }">
                <a-avatar
                  :size="24"
                  :image-url="data.user?.userAvatar"
                  :style="{ marginRight: '8px' }"
                />
                <a-typography-text>{{ data.user?.userName }}</a-typography-text>
              </div>
            </a-space>
          </p>
          <p>
            创建时间: {{ dayjs(data.createTime).format("YYYY-MM-DD HH:mm:ss") }}
          </p>
          <a-space>
            <a-button type="primary" :href="`/answer/do/${id}`"
              >开始答题</a-button
            >
            <a-button>分享应用</a-button>
            <a-button v-if="isMy" :href="`/add/question/${id}`"
              >设置题目
            </a-button>
            <a-button v-if="isMy" :href="`/add/scoringResult/${id}`"
              >设置评分
            </a-button>
            <a-button v-if="isMy" :href="`/add/app/${id}`">修改应用</a-button>
          </a-space>
        </a-col>
        <a-col flex="320px">
          <a-image width="100%" :src="data.appIcon"></a-image>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, watchEffect, withDefaults } from "vue";
import { getAppVoByIdUsingGet } from "@/api/appController";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import dayjs from "dayjs";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constant/app";
import { useLoginUserStore } from "@/store/userStore";

interface Props {
  id: number;
}

const data = ref<API.AppVO>({});

//获取登录用户是否为本人创建的
const loginUserStore = useLoginUserStore();
let loginUserId = loginUserStore.loginUser?.id;

//为什么这里需要加computed呢
//因为要让变量的值发生改变的时候触发渲染 因为刚开始加载这个页面的时候可能没有登录
const isMy = computed(() => {
  return loginUserId && loginUserId === data.value.userId;
});

const props = withDefaults(defineProps<Props>(), {
  id: () => {
    return 0;
  },
});

const loadData = async () => {
  if (!props.id) {
    return;
  }
  const res = await getAppVoByIdUsingGet({ id: props.id });
  if (res.data.code === 0) {
    console.log(res);
    data.value = res.data.data || [];
  } else {
    message.error("获取题目失败" + res.data.message);
  }
};

watchEffect(() => {
  loadData();
});
</script>

<style scoped>
.content-wrapper > * {
  margin-bottom: 24px;
}
</style>
