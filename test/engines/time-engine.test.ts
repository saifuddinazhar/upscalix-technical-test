import moment from "moment-timezone";
import timeEngine from "../../src/business-logic/engines/time-engine";

test('Find timezone at given time', async () => {
  const currentDate = moment();
  const currentDateTimeZoneOffset = currentDate.utcOffset();

  const timezones = timeEngine.findTimezoneAtGivenTime(currentDate.hour(), currentDate.minute());
  
  let isCorrect = true;
  for(const timezone of timezones) {
    var offset = moment().tz(timezone).utcOffset();
    if(offset !== currentDateTimeZoneOffset) {
      isCorrect = false;
      break;
    }
  }
  expect(isCorrect).toBe(true);
});


test('Find timezone at given time', async () => {
  const currentDate = moment();
  const currentDateTimeZoneOffset = currentDate.utcOffset();

  const timezones = timeEngine.findTimezoneAtGivenTime(currentDate.add(-1, 'hour').hour(), currentDate.minute(), moment().add(-1, 'hour').toDate());
  
  let isCorrect = true;
  for(const timezone of timezones) {
    var offset = moment().tz(timezone).utcOffset();
    if(offset !== currentDateTimeZoneOffset) {
      isCorrect = false;
      break;
    }
  }
  expect(isCorrect).toBe(true);
});
