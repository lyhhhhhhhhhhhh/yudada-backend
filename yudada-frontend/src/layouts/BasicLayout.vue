<template>
  <div class="basicLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <GloableHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        by:<a href="https://github.com/lyhhhhhhhhhhhh" target="_blank">LKING</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
import GloableHeader from "@/components/GloableHeader.vue";
</script>

<style scoped>
.basicLayout {
}

.basicLayout {
  margin-bottom: 16px;
  box-shadow: #eee 1px 1px 1px;
}

.content {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 28px;
  padding: 20px;
}

.footer {
  background: #efefef;
  padding: 16px;
  text-align: center;
  text-decoration: none;
}
</style>
