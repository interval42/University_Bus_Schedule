//Scheduled date for 2nd semester 2024

const semesterStartDay = 20241001;
const semesterEndDay = 20250214;
const holidaysDate = [20241031,20241101,20250113,20250117,20250211];
const makeupDate = [20241224,20241225,20241226,20250212,20250213,20250214];

//General Schedule for 1st semester each year

// const scheduleToMinamiosawa = {
//   Monday:     [750,840,910,950,1040,1220,1300,1350,1440,1520,1620,1630,1805,1830],
//   Tuesday:    [750,840,910,950,1040,1220,1300,1350,1440,1520,1620,1630,1805,1830],
//   Wednesday:  [750,840,910,950,1040,1220,1300,1350,1440,1520,1620,1630,1805,1830],
//   Thursday:   [750,840,910,950,1040,1220,1300,1350,1440,1520,1620,1630,1805,1830],
//   Friday:     [750,840,910,950,1040,1220,1300,1350,1440,1520,1620,1630,1805,1830],
//   MakeUpDay:  [840,950,1220,1350,1520,1630,1830]
// }

// const scheduleToHino = {
//   Monday:     [745,840,920,950,1040,1220,1300,1350,1440,1530,1555,1700,1730,1845],
//   Tuesday:    [745,840,920,950,1040,1220,1300,1350,1440,1530,1555,1700,1730,1845],
//   Wednesday:  [745,840,920,950,1040,1220,1300,1350,1440,1530,1555,1700,1730,1845],
//   Thursday:   [745,840,920,950,1040,1220,1300,1350,1440,1530,1555,1700,1730,1845],
//   Friday:     [745,840,920,950,1040,1220,1300,1350,1440,1530,1555,1700,1730,1845],
//   MakeUpDay:  [745,920,1040,1300,1440,1555,1730]
// }

//General Schedule for 2nd semester each year

const scheduleToMinamiosawa = {
  Monday:     [750,835,910,950,1030,1220,1300,1350,1440,1520,1620,1630,1800,1830],
  Tuesday:    [750,835,910,950,1030,1220,1300,1350,1440,1520,1620,1630,1800,1830],
  Wednesday:  [750,835,840,910,945,950,1030,1100,1220,1250,1300,1350,1440,1445,1520,1620,1630,1800,1805,1830],
  Thursday:   [750,835,910,950,1030,1220,1250,1300,1350,1440,1445,1520,1620,1630,1800,1805,1830],
  Friday:     [750,835,910,950,1030,1220,1300,1350,1440,1520,1620,1630,1800,1830],
  MakeUpDay:  [840,950,1220,1350,1520,1630,1830]
}

const scheduleToHino = {
  Monday:     [745,840,910,950,1035,1210,1300,1350,1440,1525,1555,1710,1730,1845],
  Tuesday:    [745,840,910,950,1035,1210,1300,1350,1440,1525,1555,1710,1730,1845],
  Wednesday:  [740,745,840,910,915,950,1030,1035,1210,1220,1300,1345,1350,1440,1525,1530,1555,1700,1710,1730,1845],
  Thursday:   [745,840,910,950,1035,1210,1220,1300,1345,1350,1440,1525,1530,1555,1700,1710,1730,1845],
  Friday:     [745,840,910,950,1035,1210,1300,1350,1440,1525,1555,1710,1730,1845],
  MakeUpDay:  [745,910,1035,1300,1440,1555,1730]
}

const nowHourMin = function(){
  // 返り値:現在時刻をNumber型の時分にして返す
  // 例: 現在時刻が13時45分ならnowHourMin() -> 1345
  const now = new Date()
  let hour = String(now.getHours());
  let min = String(now.getMinutes());
  if(min.length < 2){
    min = "0" + min
  }
  return Number(hour + min);
  // return 1710;
}

const nowYearMonthDate = function(){
  // 返り値:現在の日付をNumber型の年月日にして返す
  // 例: 現在の日付が2022/8/2ならnowYearMonthDate() -> 20220802
  const today = new Date();
  const year = String(today.getFullYear());
  let month = String(today.getMonth()+1);
  if(month.length < 2){
    month = "0" + month
  }
  let date = String(today.getDate());
  if(date.length < 2){
    date = "0" + date
  }
  return Number(year + month + date);
}

const numToTime = function(hourMin){
  // 引数:Number型の時分
  // 引数を「x時x分」というString型で返す
  // 例: nowToTime(935) -> 9時35分
  const hour = Math.floor(hourMin / 100);
  const min = hourMin % 100;
  return String(hour) + "時" + String(min) + "分"
}

const timeSubtract = function(hourMin1, hourMin2){
  // 引数:Number型の時分
  // 返り値:「２つの引数の時間差をx時間x分」または「x分」という形で返す
  // 例: timeSubtract(713,845) -> 1時間32分
  const min1 = Math.floor((hourMin1 / 100)) * 60 + (hourMin1 % 100);
  const min2 = Math.floor((hourMin2 / 100)) * 60 + (hourMin2 % 100);

  const diffHour = Math.floor((min1 - min2) / 60);
  const diffMin = (min1 - min2) % 60;

  if(diffHour == 0){
    return String(diffMin) + "分"
  }

  return String(diffHour) + "時間" + String(diffMin) + "分"
} 

const judgeSpecialDays = function(yearMonthDate){
  /*
  yearMonthDate: YYYYMMDD in number format

  return values:
    0: days with no bus or not in current semester
    1: days that belongs to "Make-up days"
    2: any other normal days (weekends are not judged here)
  */

  //judge if the date is outside the time span of current semester
  if(yearMonthDate > semesterEndDay || yearMonthDate < semesterStartDay){
    return "0";
  }

  //judge if the date is public school holidays
  if (holidaysDate.includes(yearMonthDate)){
    return "0";
  }

  //judge if the date is "Make-up days"
  if(makeupDate.includes(yearMonthDate)){
    return "1";
  }

  //any other days
  return "2"
}

//A helper function to find subsequent buses on given schedule
const findNextBus = function(hourMin, schedule){
  for(let i = 0; i < schedule.length; i++){
    if(hourMin <= schedule[i]){
      return schedule.slice(i)
    }
  }
  return [];
}

const nextBus = function(judge, day, hourMin, schedule){
  // 引数:judgeSpecialDays関数の返り値, Number型の曜日, Number型の時分
  // 返り値:hourMin以降の日野のバススケジュールの配列
  /*
  Parameters:
  judge:    return value from judgeSpecialDays
  day:      day of the week in number format
  hourMin:  hour and minute in number format

  Return Value:
  array of subsequent buses
  */
  
  if(judge == "0"){
    return [];
  }

  if(judge == "1"){
    return findNextBus(hourMin,schedule.MakeUpDay)
  }

  if(judge == "2"){
    switch(day){
      case 1:
        return findNextBus(hourMin,schedule.Monday)
      case 2:
        return findNextBus(hourMin,schedule.Tuesday)
      case 3:
        return findNextBus(hourMin,schedule.Wednesday)
      case 4:
        return findNextBus(hourMin,schedule.Thursday)
      case 5:
        return findNextBus(hourMin,schedule.Friday)
    }
  }

  return [];
}


/*----------------------------------------------------------------------------- */


const yearMonthDate = nowYearMonthDate();
// const yearMonthDate = 20230405;


const judge = judgeSpecialDays(yearMonthDate);

setInterval(()=>{
  const hourMin = nowHourMin();

  const day = new Date().getDay();

  const hinoBusList =  nextBus(judge, day, hourMin, scheduleToHino);
  
  //8:35のような時刻を08:35にして表示するための変換
  hinoTime=[];
  for (let i = 0; i < hinoBusList.length; i++){
    if (hinoBusList[i] < 1000){
      hinoTime[i] = "0" + hinoBusList[i].toString();
    }
    else{
      hinoTime[i] = hinoBusList[i].toString()
    }
  }

  if(hinoBusList.length == 0){
    document.getElementById("nextHinoCountdown").innerHTML = "本日のバスはもうありません";
  }
  else{
    document.getElementById("nextHinoHour").innerHTML = hinoTime[0].slice(0,2);
    document.getElementById("colonHino").innerHTML = ":";
    document.getElementById("nextHinoMinute").innerHTML = hinoTime[0].slice(-2);
    document.getElementById("nextHinoCountdown").innerHTML = "あと" + timeSubtract(hinoBusList[0],hourMin);
  }

  if(hinoBusList.length == 1){
    document.getElementById("nextHinoCountdown1").innerHTML = "最終便となります";
  }
  else if(hinoBusList.length >= 2){
    document.getElementById("divider1").innerHTML = "=====";
    document.getElementById("nextHinoHour1").innerHTML = hinoTime[1].slice(0,2);
    document.getElementById("colonHino1").innerHTML = ":";
    document.getElementById("nextHinoMinute1").innerHTML = hinoTime[1].slice(-2);
    document.getElementById("nextHinoCountdown1").innerHTML = "あと" + timeSubtract(hinoBusList[1],hourMin);
  }

  if(hinoBusList.length == 2){
    document.getElementById("nextHinoCountdown2").innerHTML = "最終便となります";
  }
  else if (hinoBusList.length >= 3){
    document.getElementById("divider2").innerHTML = "=====";
    document.getElementById("nextHinoHour2").innerHTML = hinoTime[2].slice(0,2);
    document.getElementById("colonHino2").innerHTML = ":";
    document.getElementById("nextHinoMinute2").innerHTML = hinoTime[2].slice(-2);
    document.getElementById("nextHinoCountdown2").innerHTML = "あと" + timeSubtract(hinoBusList[2],hourMin);
  }

},1);



