import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function duration(params/*, hash*/) {
  const dur = moment.duration(params[0], 's');
  return `${dur.minutes()}' ${("0" + dur.seconds()).slice(-2)}"`;
});
