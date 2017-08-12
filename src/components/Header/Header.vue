<template>
  <header>
    <nav>
      <div class="nav-wrapper top-nav blue-grey darken-2 col s12">
        <a class="brand-logo right hand-cursor">News</a>
        <SearchBox></SearchBox>
      </div>
    </nav>
  </header>
</template>

<script>
import SearchBox from './SearchBox.vue';
export default {
  components: {
    SearchBox
  }
}
</script>

<style lang="scss" scoped>
header {
  position: absolute;
  top: 0;
  width: 100%;
  height: 30px;
}

nav {
  height: 80px;
}

.brand-logo {
  padding-top: 10px !important;
  padding-right: 10px !important;
  font-size: 40px;
}
</style>
