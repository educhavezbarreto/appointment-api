const parseGoogleDate = (d) => {
  const googleDate =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})([+-]\d{2}):(\d{2})/g;
  const [, year, month, day, hours, minutes, seconds] = googleDate.exec(d);
  return new Date(
    Date.UTC(+year, +month - 1, +day, +hours, +minutes, +seconds)
  );
};

const getDateValuesFromDateString = (dateStr) => {
  const [date, time] = dateStr.split("T");
  const [year, month, day] = date.split("-");
  const [hours, minutes] = time.split(":");

  return [+year, +month - 1, +day, +hours, +minutes];
};

const getDateFromDateString = (dateStr) => {
  return new Date(Date.UTC(...getDateValuesFromDateString(dateStr)));
};

module.exports = { parseGoogleDate, getDateFromDateString };
