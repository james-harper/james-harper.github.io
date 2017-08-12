<template>
<div class="row">
    <ul class="pagination center-align">
        <li :class="{disabled: page === 1, 'col s2': isMobile}">
            <a @click="previousPage()">
                <i class="material-icons">chevron_left</i>
            </a>
        </li>

        <li v-for="n in getTotalPages()" :class="{active: n === page, 'col s2': isMobile}">
            <a class="hand-cursor" @click="setPage(n)">{{n}}</a>
        </li>

        <li class="waves-effect" :class="{disabled: page === getTotalPages(), 'col s2': isMobile}">
            <a @click="nextPage()">
                <i class="material-icons">chevron_right</i>
            </a>
        </li>
    </ul>
</div>
</template>

<script>
/**
 * Pagination buttons
 */
export default {
  props: ['feed', 'active'],
  data() {
    return {
      page: app.bus.page,
      perPage: app.bus.perPage,
    }
  },
  computed: {
    isMobile() {
      return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }
  },
  methods: {
    setPage(newPage) {
      newPage = parseInt(newPage);
      app.bus.page = this.page = newPage;
    },
    nextPage() {
        if (this.page >= this.getTotalPages()) { return; }
        this.setPage(this.page + 1);
    },
    previousPage() {
        if (this.page <= 1) { return; }
        this.setPage(this.page - 1);
    },
    getTotalPages() {
      return Math.ceil(this.feed.length / this.perPage);
    }
  },
  created() {
    this.setPage(1);
    app.bus.$on('page_changed', page => this.page = page);

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowRight':
          e.ctrlKey ? this.setPage(this.getTotalPages()) : this.nextPage();
          break;
        case 'ArrowLeft':
          e.ctrlKey ? this.setPage(1) : this.previousPage();
          break;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
li {
  cursor: pointer;
  cursor: hand;
}

.active {
  background-color: #607d8b !important;
  color: #FFFFFF;
}
</style>
