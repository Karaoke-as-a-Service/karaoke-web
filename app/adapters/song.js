import DS from 'ember-data';
import musiclist from '../utils/musiclist';
import { getProperties } from '@ember/object';

export default DS.Adapter.extend({
  findAll() {
    return {
      data: musiclist.map(song => ({
        id: song.id,
        type: 'song',
        attributes: getProperties(song, 'title', 'artist', 'language', 'year', 'duration'),
      })),
    };
  },
  query(_store, _type, query) {
    let data = [];
    let list = musiclist;
    let { page=1, per_page=25 } = query;
    page--;
    const { filter } = query;

    if(filter) {
      let text = filter.text.toLowerCase();
      list = list.filter((item) =>
          (item.title && item.title.toLowerCase().indexOf(text) !== -1) || (item.artist && item.artist.toLowerCase().indexOf(text) !== -1));
      const { languages } = filter;
      if(languages && languages.size) {
        list = list.filter((item) => languages.has(item.language));
      }
    }

    let end = Math.min(list.length, (page+1) * per_page);
    for(let idx = page * per_page; idx < end; ++idx) {
      let song = list[idx];
      data.push({
        id: song.id,
        type: 'song',
        attributes: getProperties(song, 'title', 'artist', 'language', 'year', 'duration'),
      });
    }
    return {
      data,
      meta: {
        total_pages: Math.ceil(list.length / per_page),
      },
    };
  },
});
