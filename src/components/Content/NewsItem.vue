<template>
<div class="col s12 m4 card-container" :class="{hidden: item.isHidden}">
  <div class="card medium z-depth-1 blue-grey darken-1">
    <span class="time-ago">{{timeAgo}}</span>

    <a :href="item.url" :title="item.description" target="_blank">
      <div class="card-image">
        <img :src="imageCache[item.url]" class="s12">
      </div>

      <div class="card-content white-text">
        <h6 class="title center-align" v-html="item.title"></h6>
      </div>
    </a>

    <div class="card-action right-align">
      <div @click="toggleFilter(item.source)" class="chip hand-cursor">{{item.source}}</div>
    </div>

  </div>
</div>
</template>

<script>
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

/**
 * An individual news item
 */
export default {
  data() {
    return {
      imageCache: app.bus.imageCache
    }
  },
  computed: {
    timeAgo() {
      return distanceInWordsToNow(this.item.publishedAt) + ' ago';
    }
  },
  methods: {
    toggleFilter(filter) {
      if (app.bus.search === filter) {
        return app.bus.search = '';
      }

      return app.bus.search = filter;
    }
  },
  props: ['item']
}
</script>


<style lang="scss" scoped>
.hidden {
  display: none;
}

img {
  max-height: 200px;
}

.chip {
  cursor: pointer;
}

.time-ago {
  text-align: left;
  margin-left:3px;
  color: #ddd;
  font-size: 13px;
  font-style: italic;
}

.title {
  font-weight: 300;
  font-size: 20px;
}

.card-content {
  padding-top: 10px;
}

.card-action {
  padding: 12px;
}
</style>
