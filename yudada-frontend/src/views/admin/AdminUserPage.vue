<template>
  <div id="adminUserPage">
    <a-form
      :model="searchParams"
      :style="{ marginBottom: '20px' }"
      label-align="left"
      layout="inline"
      auto-label-width
      @submit="doSearch"
    >
      <!--这里只要searchParams的值改变 就会自动触发查询 因为使用了watchEffect-->
      <a-form-item field="userName" label="用户名">
        <a-input
          v-model="fromSearchParams.userName"
          placeholder="请输入用户名"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="userProfile" label="用户简介">
        <a-input
          allow-clear
          v-model="fromSearchParams.userProfile"
          placeholder="请输入用户简介"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px"
          >搜索
        </a-button>
      </a-form-item>
    </a-form>
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total: total,
      }"
      @page-change="onPageChange"
    >
      <template #createTime="{ record }">
        {{ dayjs(record.createTime).format("YYYY-MM-DD HH:ss:mm") }}
      </template>
      <template #userAvatar="{ record }">
        <a-image width="64" :src="record.userAvatar" />
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" status="danger" @click="doDelete(record)"
            >删除
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import {
  deleteUserUsingPost,
  listUserVoByPageUsingPost,
} from "@/api/userController";
import { ref, watchEffect } from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import dayjs from "dayjs";

const fromSearchParams = ref<API.UserQueryRequest>({});
//初始化搜索条件(不应该被修改)
const initSearchParams = {
  current: 1,
  pageSize: 10,
};

const searchParams = ref<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
});

const dataList = ref<API.User[]>([]);
const total = ref<number>(0);

/**
 * 加载数据
 */
const loadData = async () => {
  const res = await listUserVoByPageUsingPost(searchParams.value);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    total.value = res.data.data?.total || 0;
  } else {
    message.error("获取数据失败" + res.data.message);
  }
};

/**
 * 执行搜索
 */
const doSearch = () => {
  searchParams.value = {
    ...initSearchParams,
    ...fromSearchParams.value,
  };
};

/**
 * 分页变化时 触发重新加载
 * @param pageNumber
 */
const onPageChange = (pageNumber: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: pageNumber,
  };
};
//删除
const doDelete = async (record: API.User) => {
  try {
    const res = await deleteUserUsingPost({
      id: record.id,
    });
    if (res.data.code === 0) {
      message.success("删除成功");
      loadData();
    }
  } catch (e) {
    message.error("删除失败" + e);
  }
};

/**
 * 监听 searchParams 变量 改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData();
});

const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "userName",
    dataIndex: "userName",
  },
  {
    title: "userRole",
    dataIndex: "userRole",
  },
  {
    title: "userAvatar",
    dataIndex: "userAvatar",
    slotName: "userAvatar",
  },
  {
    title: "userProfile",
    dataIndex: "userProfile",
  },
  {
    title: "createTime",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
</script>

<style scoped></style>
