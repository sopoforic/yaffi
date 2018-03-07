Vue.component('fic-div', {
  props: ['fanfic', 'authors', 'sources', 'pairings', 'characters', 'categories'],
  template: `
  <div class="fanficDetails">
    <h3>{{fanfic.title}}<br /><small>by
      <ul class="commaList">
        <li v-for="a in fanfic.authors.slice().sort(function (a, b) {return authors[a].name.localeCompare(authors[b].name, {sensitivity: 'base'})})">
          <a :href="'#author-'.concat(a)">{{authors[a].name}}</a>
        </li>
      </ul></small></h3>
    <table>
        <tr>
            <th>Description</th>
            <td class="description" v-html="fanfic.description.concat(fanfic.notes !== null ? fanfic.notes : '')" />
        </tr>
        <tr>
            <th>Links</th>
            <td>
              <ul class="commaList">
                <li v-for="l in fanfic.links"><a :href="l.url">{{l.title}}</a></li>
              </ul>
            </td>
        </tr>
        <tr v-if="fanfic.categories.length > 0">
            <th>Categories</th>
            <td>
              <ul class="commaList">
                <li v-for="c in fanfic.categories.slice().sort(function (a, b) {return categories[a].name.localeCompare(categories[b].name, {sensitivity: 'base'})})">
                  <a :href="'#category-'.concat(c)">{{categories[c].name}}</a>
                </li>
              </ul>
            </td>
        </tr>
        <tr>
            <th>Source</th>
            <td>
              <ul class="commaList">
                <li v-for="s in fanfic.sources.slice().sort(function (a, b) {return sources[a].name.localeCompare(sources[b].name, {sensitivity: 'base'})})">
                  <a :href="'#source-'.concat(s)">{{sources[s].name}}</a>
                </li>
              </ul>
            </td>
        </tr>
        <tr v-if="fanfic.characters.length > 0">
            <th>Characters</th>
            <td>
              <ul class="commaList">
              <li v-for="c in fanfic.characters.slice().sort(function (a, b) {return characters[a].name.localeCompare(characters[b].name, {sensitivity: 'base'})})">
                <a :href="'#character-'.concat(c)">{{characters[c].name}}</a>
              </li>
              </ul>
            </td>
        </tr>
        <tr v-if="fanfic.pairings.length > 0">
            <th>Pairings</th>
            <td>
              <ul class="commaList">
              <li v-for="p in fanfic.pairings.slice().sort(function (a, b) {return pairings[a].name.localeCompare(pairings[b].name, {sensitivity: 'base'})})">
                <a :href="'#pairing-'.concat(p)">{{pairings[p].name}}</a>
              </li>
              </ul>
            </td>
        </tr>
        <tr v-if="fanfic.chapters > 0">
            <th>Length</th>
            <td>{{fanfic.chapters}} chapter{{fanfic.chapters > 1 ? 's' : ''}} ({{ fanfic.words }} words)</td>
        </tr>
        <tr>
            <th>Status</th>
            <td>{{fanfic.status}}</td>
        </tr>
        <tr v-if="fanfic.date_first !== null && fanfic.date_first !== fanfic.date_last">
            <th>First Update</th>
            <td>{{fanfic.date_first}}</td>
        </tr>
        <tr v-if="fanfic.date_last !== null">
            <th v-if="fanfic.date_first === fanfic.date_last">Published</th>
            <th v-else>Last Update</th>
            <td>{{fanfic.date_last}}</td>
        </tr>
    </table>
  </div>
`
});

var app = new Vue({
  data: {
    fanfics: [],
    authors: [],
    sources: [],
    characters: [],
    pairings: [],
    categories: [],
    view: 'index',
    number: null,
    weeks: {},
    stats: {},
    ficviews: ['fanfic', 'author', 'source', 'character', 'pairing', 'category', 'week'],
    intviews: ['fanfic', 'author', 'source', 'character', 'pairing', 'category'],
  },
  methods: {
    shouldDisplay(fanficId) {
      if (this.number === null || (this.view === 'fanfic' && this.number == fanficId)) {
        return true;
      }
      if (this.view === 'author' && this.fanfics[fanficId].authors.includes(this.number)) {
        return true;
      }
      if (this.view === 'source' && this.fanfics[fanficId].sources.includes(this.number)) {
        return true;
      }
      if (this.view === 'character' && this.fanfics[fanficId].characters.includes(this.number)) {
        return true;
      }
      if (this.view === 'pairing' && this.fanfics[fanficId].pairings.includes(this.number)) {
        return true;
      }
      if (this.view === 'category' && this.fanfics[fanficId].categories.includes(this.number)) {
        return true;
      }
      if (this.view === 'week' && this.fanfics[fanficId].week === this.number) {
        return true;
      }
      return false;
    },
  },
  created: function() {
    const viewmap = {
      fanfic: ['fanfics', 'title'],
      author: ['authors', 'name'],
      source: ['sources', 'name'],
      character: ['characters', 'name'],
      pairing: ['pairings', 'name'],
      category: ['categories', 'name']
    }

    function onHashchange() {
      hash = window.location.hash.substr(1);
      if (hash.length > 0) {
        app.view = hash.split('-')[0];
        if (hash.includes('-')) {
          if (app.intviews.includes(app.view)) {
            app.number = parseInt(hash.split('-')[1]);
          } else {
            app.number = hash.substr(hash.indexOf('-') + 1);
          }
        } else {
            app.number = null;
        }
      } else {
        app.view = 'index';
        app.number = null;
      }

      if (app.view === 'index') {
        document.title = 'Yet Another Fanfic Index - YAFFI';
      } else if (app.view === 'week') {
        if (app.number in app.weeks) {
          document.title = app.number.concat(' - YAFFI');
        }
        else {
          document.title = '404 - YAFFI';
        }
      } else if (app.view === 'list') {
        document.title = 'List '.concat(app.number).concat(' - YAFFI');
      } else if (app.view in viewmap) {
        if (app.number in app[viewmap[app.view][0]]) {
          document.title = app[viewmap[app.view][0]][app.number][viewmap[app.view][1]].concat(' - YAFFI');
        } else {
          document.title = '404 - YAFFI';
        }
      } else {
        document.title = '404 - YAFFI';
      }
    }

    window.addEventListener('hashchange', onHashchange);

    $.getJSON('/data.json', function(data) {
      app.fanfics = data.fanfics;
      app.authors = data.authors;
      app.sources = data.sources;
      app.characters = data.characters;
      app.pairings = data.pairings;
      app.categories = data.categories;
      app.weeks = data.weeks;
      app.stats = data.stats;
      onHashchange();
    });
  },
});

$( document ).ready(
  function() {
    app.$mount('#app');
  }
);
