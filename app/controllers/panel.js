import Controller from '@ember/controller';
import musiclist from '../utils/musiclist';

export default Controller.extend({
  playlist: null,
  playing: null,
  ws: null,
  init() {
    this._super(...arguments);
    this.playlist = [];
    const ws = new WebSocket("wss://" + window.location.hostname + "", "karaoke");
    this.set('ws', ws);
    ws.onmessage = this.receivedMessage.bind(this);
  },
  receivedMessage(message) {
    message = JSON.parse(message.data);
    switch(message[1]) {
      case "playlist": {
        const list = message[1].reverse();
        let playtime = this.get('playing.song.duration') + 60;
        list.forEach((entry) => {
          entry.song = musiclist[entry.song];
          entry.forecast = playtime;
          playtime += 60 + entry.song.duration;
        });
        this.set('playlist', list);
        break;
      }
      case "playing": {
        const item = message[1];
        this.set('playing', {
          song: musiclist[item.song],
          name: item.name,
          id: item.id
        });
        break;
      }
    }
  }
});
