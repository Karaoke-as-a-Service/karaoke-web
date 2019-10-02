import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function waittime(params/*, hash*/) {
  const wait = moment.duration(params[0], 's');
  if (wait.hours()) {
    return `${wait.hours()}h ${("0" + wait.minutes()).slice(-2)}'`;
  } else {
    return `${("0" + wait.minutes()).slice(-2)}'`;
  }
});
