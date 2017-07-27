const vm = new Vue({
    el: '#app',
    data: {
        feed: [],
        filters: [],
        initialised: false,
        interval: null,
        lastUpdatedAt: null,
        search: '',
        sources: sources,
        perPage: 9,
        page: 0,
    },
    created() {     
        let qs = this.decodeQueryString();

        if (qs['q'] !== undefined) {
            this.search = qs['q'];
        }

        if (qs['page'] !== undefined) {
            this.page = qs['page'];
        } 

        this.updateFeed();
        this.interval = setInterval(() => {this.updateFeed()}, 60000);
    },
    beforeDestroy() {
        clearInterval(this.interval);
    },
    computed: {
        filteredFeed() {
            let feed = this.feed.filter(article => {
                if (this.search.length) {
                    let search = this.search.toLowerCase();
                    return article.title.toLowerCase().includes(search) ||
                        article.description.toLowerCase().includes(search) ||
                        article.source.toLowerCase().includes(search);
                }

                if (!this.filters.length) return true;

                return this.filters.indexOf(article.source) !== -1;
            });

            return feed;
        },
        totalPages() {
            return Math.ceil(this.filteredFeed.length / this.perPage);
        },
        isMobile() {
            return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        }
    },
    watch: {
        search: function() {
            this.setPage(1); 
            this.updateUrl();               
        }
    },
    methods: {
        updateUrl() {
            let url = window.location.origin + window.location.pathname;
            let qs = this.decodeQueryString();
            let toAppend = [];

            if (this.search.length) {                       
                toAppend.push('q='+this.search);                    
            }

            if (this.page != 1) {
                toAppend.push('page='+this.page);   
            }

            if (toAppend.length) {
                url += '?' + toAppend.join('&');
            }

            history.replaceState({}, document.title, url);
        },
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
                    article.publishedAt = moment(article.publishedAt);
                    article.timeAgo = article.publishedAt.fromNow();
                    article.urlToImage.replace("http://", "https://");
                });

                this.feed.push(...articles);
                this.feed.filter(function(article) {return !!article.source; });
                this.feed = _.uniqBy(this.feed, 'url');

                this.feed = this.feed.filter(article => article.author && article.source && article.publishedAt && article.urlToImage);

                this.feed = _.sortBy(this.feed, 'publishedAt').reverse();
                this.initialised = true;
                this.setPage(1);                        
                
                this.lastUpdatedAt = new Date().toLocaleTimeString();

            });
        },
        updateFeed(i = 0) {
            if (i < this.sources.length) {
                this.getFeed(this.sources[i]).then(this.updateFeed(i+1));
            }
        },
        toggleFilter(source) {
            if (this.filters.indexOf(source) >= 0) {
                this.clearSearch();
                this.filters = this.filters.filter(filter => filter !== source);
            } else {
                this.search = source;
                this.filters.push(source);
            }
        },
        clearSearch(resetPage = true) {
            this.search = '';
            this.filters = [];

            if (resetPage) {
                this.setPage(1);
            }            
        },
        nextPage() {
            console.log('tset')
            if (this.page >= this.totalPages) {
                return;
            }

            this.setPage(this.page + 1);
        },
        previousPage() {
            if (this.page <= 1) {
                return;
            }

            this.setPage(this.page - 1);
        },
        setPage(newPage) {
            let lowerLimit = (newPage - 1) * this.perPage;
            let upperLimit = (this.perPage * newPage) - 1;                  

            for (let i = 0; i < this.filteredFeed.length; i++) {
                let shouldHide = (i < lowerLimit) || (i > upperLimit);
                this.filteredFeed[i].isHidden = shouldHide;
            }

            this.page = newPage;
            this.updateUrl();
        },
        decodeQueryString() {
            let queryString = location.search&&location.search.substr(1).replace(/\+/gi," ").split("&");
            for (let i in queryString) {
                let s = queryString[i].split("=");
                queryString[i]  = queryString[unescape(s[0])] = unescape(s[1]);
            }

            return queryString;
        }
    }
});

const key = {
    enter: 13,
    escape: 27,
    leftArrow: 37,
    rightArrow: 39,
    s: 83
};

document.addEventListener('keydown', (e) => {
    let searchBox = document.getElementById('search');
    if (searchBox != document.activeElement) {
        switch (e.which) {
            case key.leftArrow:
                vm.previousPage(); 
                break;
            case key.rightArrow:
                vm.nextPage();
                break;
            case key.s:
                searchBox.focus();
                e.preventDefault();
                break;
            case key.escape:
                vm.clearSearch();
        }
    } else {
        if (e.which === key.enter) {
            // Enter
            e.preventDefault();
            searchBox.blur();
        }
    }    
});
