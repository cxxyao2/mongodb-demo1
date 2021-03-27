function convertStringToDate(dateIni, hhPart, mmPart, secondPart) {
  // formDate, toDate, format: yyyyMMdd
  const yearPart = Number(dateIni.slice(0, 4));
  const monthPart = Number(dateIni.slice(4, 6)) - 1; // monIndex = month -1
  const dayPart = Number(dateIni.slice(6, 8));
  return new Date(yearPart, monthPart, dayPart, hhPart, mmPart, secondPart);
}

// return a string  based today date, format: YYYY-MM-DD
 function getTodayYMD() {
  let currentDate = new Date();
  let currentYear = String(currentDate.getFullYear());
  let currentMonth = String(currentDate.getMonth() + 1);
  let currentDay = String(currentDate.getDate());
  if (currentMonth.length === 1) {
    currentMonth = "0".concat(currentMonth);
  }

  if (currentDay.length === 1) {
    currentDay = "0".concat(currentDay);
  }
  let todayDate = currentYear.concat("-", currentMonth, "-", currentDay); // YYYY-MM-DD
  return todayDate;
}

// return a string , format: YYYYMMDD
 function dateYMD(iniDate) {
  let currentDate;
  if (typeof iniDate === "string") currentDate = new Date(iniDate);
  if (typeof iniDate === "object") currentDate = iniDate;
  let currentYear = String(currentDate.getFullYear());
  let currentMonth = " ".concat(String(currentDate.getMonth() + 1));
  let currentDay = " ".concat(String(currentDate.getDate()));
  if (currentMonth.length === 1) {
    currentMonth = "0".concat(currentMonth);
  }

  if (currentDay.length === 1) {
    currentDay = "0".concat(currentDay);
  }
  let todayDate = currentYear.concat(currentMonth, currentDay);
  return todayDate;
}




module.exports.convertStringToDate = convertStringToDate;
