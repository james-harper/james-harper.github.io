<template>
  <div id="app">
      <PageHeader></PageHeader>
      <PageContent></PageContent>
  </div>
</template>

<script>
import PageHeader from './components/Header/Header.vue';
import PageContent from './components/Content/Content.vue';
// import PageFooter from './components/Footer/Footer.vue';

export default {
  name: 'app',
  components: {
      PageHeader,
      PageContent,
      // PageFooter
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}

body {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
