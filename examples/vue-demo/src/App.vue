<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <button @click="toggleTheme({ scopeName: 'dark' })">切换黑色主题</button>&nbsp;
    <button @click="toggleTheme({ scopeName: 'light' })">切换白色主题</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  methods: {
    toggleTheme({ scopeName }) {
      // 切换主题
      document.documentElement.setAttribute('data-theme', scopeName);
    }
  }
}
</script>

<style lang="scss">
@import './style/common.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $type-900;
  margin-top: 60px;
}

body {
  background-color: $mono-400-light-white;
}
</style>
