<template>
<form>
  <div class="input-field left">
    <input id="search" type="search" v-model="search" ref="search">
    <label class="label-icon" for="search"><i class="material-icons">search</i></label>
    <i class="material-icons" @click="clearSearch()">close</i>
  </div>
</form>
</template>

<script>
/**
 * Search box in the header
 */
export default {
  data() {
    return {
      search: ''
    }
  },
  watch: {
    search: function() {
      app.bus.search = this.search;
    }
  },
  methods: {
    clearSearch() {
      this.search = '';
      document.getElementById('search').blur();
    }
  },
  created() {
    app.bus.$on('search_updated', s => this.search = s);
    document.addEventListener('keydown', (e) => {
      let searchBox = this.$refs.search;
      switch(e.key) {
        case 'Escape':
          this.clearSearch();
          break;
        case 'Enter':
          searchBox.blur();
          e.preventDefault();
          break;
        case 's':
          if (document.activeElement !== searchBox) {
            e.preventDefault();
          }
          searchBox.focus();
          break;
      }
    });
  }
}
</script>


<style lang="scss" scoped>
label {
  top: -10 !important;
}

.input-field {
  width: 400px;
}

i {
  margin-top: 6px;
}
</style>
