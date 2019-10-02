import Controller from '@ember/controller';
import musiclist from '../utils/musiclist';

export default Controller.extend({
  playlist: null,
  playing: null,
  ws: null,
  init() {
    this._super(...arguments);
    this.playlist = [];
    const ws = new WebSocket("wss://" + window.location.hostname + ":8080", "karaoke");
    this.set('ws', ws);
    ws.onmessage = this.receivedMessage.bind(this);
  },
  receivedMessage(message) {
    message = JSON.parse(message.data);
    switch(message.type) {
      case "playlist": {
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
    }
  },
});
