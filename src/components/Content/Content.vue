<template>
  <main class="container">
    <div class="row">
      <NewsItem v-for="item in filteredFeed" :key="item.url" :item="item"></NewsItem>
      <div v-show="!filteredFeed.length && initialised">
        <NoContent></NoContent>
      </div>
    </div>
    <Pagination :feed="filteredFeed" v-show="filteredFeed.length"></Pagination>
  </main>
</template>

<script>
import NewsItem from './NewsItem.vue';
import Pagination from './Pagination.vue';
import NoContent from './NoContent.vue';

import axios from 'axios';

import _includes from 'lodash/includes';
import _uniqBy from 'lodash/uniqBy';
import _sortBy from 'lodash/sortBy';
import _reverse from 'lodash/reverse';
import _has from 'lodash/has';

import {sources, forceHttpImage} from '@/dataSources';
import {clean} from '@/utils/string';
import url from '@/utils/url';

/**
 * The main content section of the app.
 * Contains the news feed.
 */
export default {
  components: {
    NewsItem,
    NoContent,
    Pagination
  },
  data() {
    return {
      feed: [],
      search: '',
      perPage: app.bus.perPage,
      initialised: false,
    }
  },
  computed: {
    /**
     * Filter the main feed based on a search term
     */
    filteredFeed() {
      let feed = this.feed.filter(article => {
        if (this.search.length) {
          let search = clean(this.search);
          return clean(article.title).includes(search) ||
            clean(article.description).includes(search) ||
            clean(article.source).includes(search);
        }

        return true;
      });

      this.populateImageCache(feed.filter(article => !article.isHidden));
      return feed;
    }
  },
  methods: {
    /**
     * Make API call to newsapi.org
     * and store the results
     *
     * @param {string} source The news source
     */
    getFeed(source) {
      return axios.get('https://newsapi.org/v1/articles', {
          params: {
            source: source,
            sortBy: 'top',
            apiKey: '8171bf2614d7429a86a9b692b7b5e4c2'
          }
      })
      .then(response => {
        let articles = response.data.articles;

        articles.filter(article => article.publishedAt)
        .map(article => {
            article.source = '@'+response.data.source;
            article.timestamp = new Date(article.publishedAt).getTime();
            article.isHidden = true;

            if (!_includes(forceHttpImage, response.data.source) && article.urlToImage !== null) {
                article.urlToImage = article.urlToImage.replace("http://", "https://");
            }
        });

        this.feed.push(...articles);
        this.sortFeed();
        this.initialised = true;
      })
    },
    /**
     * Iterate through list of sources
     * and get each feed one by one
     *
     * @param {Number} i Index of the news source in the array of all sources
     */
    updateFeed(i = 0) {
      if (i < sources.length) {
          this.getFeed(sources[i]).then(this.updateFeed(i+1));
      }
    },
    /**
     * Sort feed so newest articles come first.
     * Some filtering also gets done here to make sure there are no duplicates
     * and there isn't any information missing from any of the articles.
     */
    sortFeed() {
      this.feed = this.feed.filter(
          article => article.source && article.author && article.source && article.timestamp && article.urlToImage
        );

      this.feed = _uniqBy(this.feed, 'url');
      this.feed = _sortBy(this.feed, 'timestamp');
      this.feed = _reverse(this.feed);
    },
    /**
     * Set the news feed to a page
     * @param {Number} newPage The page that the feed should be set to
     */
    setPage(newPage) {
      let lowerLimit = (newPage - 1) * this.perPage;
      let upperLimit = (this.perPage * newPage) - 1;
      this.hideArticles(lowerLimit, upperLimit);
      this.populateImageCache();
    },
    /**
     * Make articles outside of the given range as hidden
     *
     * @param {Number} min Hide all articles below this index
     * @param {Number} max Hide all articles above this index
     */
    hideArticles(min, max) {
      this.filteredFeed.forEach((article, i) => {
        let shouldHide = (i < min) || (i > max);
        article.isHidden = shouldHide;
      });
    },
    /**
     * Images are lazy loaded - src begins empty and is populated
     * when the image is first viewed.
     * This method updates the global bus with which images have been loaded.
     * @param {Array} articles articles that should have their images cached
     */
    populateImageCache(articles = []) {
      articles.forEach(article => {
        app.bus.imageCache[article.url] = article.urlToImage;
      });
    }
  },
  created() {
    this.updateFeed();

    let qs = url.decodeQueryString();

    if (_has(qs,'q')) { this.search = app.bus.search = qs['q']; }
    if (_has(qs,'page')) { this.page = app.bus.page = qs['page']; }

    app.bus.$on('page_changed', page => {
      this.setPage(page);
    });

    app.bus.$on('search_updated', search => {
      this.search = search;
      this.hideArticles(0, this.perPage - 1);
    });

    setTimeout(() => {this.setPage(app.bus.page)}, 750);
    setInterval(() => {this.updateFeed()}, 60000);
  }
}
</script>

<style lang="scss" scoped>
main {
  padding-top: 60px;
  flex: 1 0 auto;
}
</style>
