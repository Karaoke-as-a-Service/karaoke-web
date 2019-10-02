import Controller from '@ember/controller';
import EmberObject, { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce, later } from '@ember/runloop';
import musiclist from '../utils/musiclist';

export default Controller.extend({
  infinity: service(),
  store: service(),
  playlist: null,
  playing: null,
  ws: null,
  enabledLanguages: null,
  init() {
    this._super();
    this.playlist = [];
    this.enabledLanguages = new Set();
    const ws = new WebSocket("ws://" + window.location.hostname + ":8080", "karaoke");
    this.ws = ws;
    ws.onmessage = this.receivedMessage.bind(this);
  },
  async debouncedFilter() {
    // this needs a few bug workarounds in infinity
    this.infinity.infinityModels.removeObject(this.model);
    this.set('model', await this.infinity.model('song', {
      filter: {
        text: this.searchText,
        languages: new Set([...this.enabledLanguages]),
      },
    }));
    later(() => this.infinity.loadNextPage(this.model));
  },
  filterChanged: observer('searchText', 'enabledLanguages', function() {
    debounce(this, "debouncedFilter", 500);
  }),
  languages: computed('model', 'enabledLanguages', function() {
    const { enabledLanguages } = this;
    const languages = new Set(musiclist.map((item) => item.language || ""));
    return Array.from(languages).map((name, idx) => EmberObject.create({
      id: "lang-" + idx,
      name: name,
      selected: enabledLanguages.has(name)
    })).sort((a, b) => a.name.localeCompare(b.name));
  }),
  dismissAddDialog() {
    document.getElementById('searchField').focus();
    later(() => {
      this.setProperties({
        nameText: "",
        selection: null,
      });
    });
  },
  actions: {
    selectSong(song) {
      this.set('selection', song);
    },
    cancelSongRequest() {
      this.dismissAddDialog();
    },
    submitSongRequest() {
      this.ws.send(JSON.stringify({
        'song': this.get('selection.id'),
        'name': this.get('nameText'),
        'command': 'add'
      }));
      this.set('searchText', "");
      this.dismissAddDialog();
    },
    updateLanguages() {
      let select = document.getElementById('languages');
      let selectedLanguages = new Set();
      for(let option of [...select.options]) {
        if(option.selected) {
          selectedLanguages.add(option.dataset.name);
        }
      }
      this.set('enabledLanguages', selectedLanguages);
      return true;
    },
    blurSearch() {
      document.getElementById('searchField').blur();
      return false;
    },
  },
  receivedMessage(message) {
    message = JSON.parse(message.data);
    if (message.type === "playlist") {
      const playing = message.playlist.shift();
      this.set('playing', {
        song: musiclist[playing.song],
        name: playing.singer,
        id: playing.id
      });
      let playtime = this.get('playing.song.duration') + 60;
      message.playlist.forEach((entry) => {
        entry.song = musiclist[entry.song];
        entry.forecast = playtime;
        entry.name = entry.singer;
        if (entry.song) {
          playtime += 60 + entry.song.duration;
        }
      });
      this.set('playlist', message.playlist);
    }
  },
});
