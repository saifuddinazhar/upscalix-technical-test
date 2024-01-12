import moment from "moment-timezone";
import { date } from "yup";

export default new class TimeEngine {
  findTimezoneAtGivenTime(hour: number, minute: number, date?: Date | undefined) {
    let allTimezones: string[] = moment.tz.names();
    let matchingTimezones: string[] = [];

    allTimezones.forEach(timezone => {
        const useDate = date ?? new Date();
        let currentTime = moment(useDate).tz(timezone);
        if (currentTime.hours() === hour && currentTime.minutes() === minute) {
            matchingTimezones.push(timezone);
        }
    });

    return matchingTimezones;
  }
}
