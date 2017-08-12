<template>
  <div class="col s12 m6 offset-m3">
    <div class="card blue-grey darken-1">
      <div class="card-content white-text">
        <span class="card-title">No articles to show</span>
        <p v-if="search.length">There were no matches for your search. Perhaps you could try another search term.</p>
        <p v-else>Try refreshing the page</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: ''
    }
  },
  created() {
    app.bus.$on('search_updated', s => this.search = s);
  }
}
</script>

