import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
dayjs.extend(relativeTime);
dayjs.extend(tz);
dayjs.extend(utc);
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);

export const setLocale = (locale: 'vi' | 'en' | null) => {
  return dayjs.locale(locale as string);
};
setLocale('vi');
const dayjsTz = dayjs.tz;
export default dayjsTz;
