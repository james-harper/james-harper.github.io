<script>
import Vue from 'vue';

import url from './utils/url';

/**
 * This is responsible for any values or events
 * that need to be accessed globally
 */
export default new Vue({
  data: {
    page: 0,
    search: '',
    perPage: 6,
  },
  watch: {
    page() {
      this.$emit('page_changed', this.page);
      url.update();
    },
    search() {
      this.$emit('search_updated', this.search);
      this.page = 1;
      url.update();
    }
  }
});
</script>
