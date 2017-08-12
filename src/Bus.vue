<script>
import Vue from 'vue';
import _has from 'lodash/has';

import url from './utils/url';

export default new Vue({
  data: {
    page: 0,
    search: '',
    perPage: 9,
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
