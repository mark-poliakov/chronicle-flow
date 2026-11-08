export const ConvertTimeToDate = (time: EpochTimeStamp) => {
  const dateTime = new Date(time);
  const dateTimeISO = dateTime.toISOString();
  const dateTimeISOSplitted = dateTimeISO.split('T');
  const resultDate = dateTimeISOSplitted[0];
  const resultTime = dateTimeISOSplitted[1].slice(0, 5);
  return resultDate + ' ' + resultTime;

  // const year = dateTime.getUTCFullYear();
  // let month = dateTime.getUTCMonth();
  // let day = dateTime.getUTCDate();

  // month += 1;
  // let monthString = month.toString();
  // if (monthString.length < 2) {
  //   monthString = '0' + monthString;
  // }

  // let dayString = day.toString();
  // if (dayString.length < 2) {
  //   dayString = '0' + dayString;
  // }
  // const dateString = `${year}-${monthString}-${dayString}`;
  // return dateString;
}

export const getLocalDateString = (date: Date = new Date()): string => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
}