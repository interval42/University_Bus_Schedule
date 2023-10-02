const semesterStartDay = 20231002;
const semesterEndDay = 20242016;
const holidaysDate = [20231009,20231101,20231102,20231103,20231123,
                   20231229,20240101,20240102,20240103,20240108,
                   20240112,20240116,20240212];
const makeupDate = [20231226,20231227,20231228,
                    20240214,20240215,20240216];

const scheduleToMinamiosawa = {
  Monday:     [750,835,910,950,1030,1220,1300,1350,1435,1520,1620,1630,1800,1830],
  Tuesday:    [750,835,910,950,1030,1220,1300,1350,1435,1520,1620,1630,1800,1830],
  Wednesday:  [750,835,840,910,945,950,1030,1055,1220,1250,1300,1350,1435,1440,1520,1620,1630,1800,1805,1830],
  Thursday:   [750,835,910,950,1030,1220,1250,1300,1350,1435,1440,1520,1620,1630,1800,1805,1830],
  Friday:     [750,835,910,950,1030,1220,1300,1350,1435,1520,1620,1630,1800,1830],
  MakeUpDay:  [840,950,1220,1350,1520,1630,1830]
}

const scheduleToHino = {
  Monday:     [745,840,910,950,1030,1210,1300,1350,1440,1525,1555,1710,1730,1845],
  Tuesday:    [745,840,910,950,1030,1210,1300,1350,1440,1525,1555,1710,1730,1845],
  Wednesday:  [740,745,840,910,915,950,1025,1030,1210,1215,1300,1345,1350,1440,1525,1530,1555,1700,1710,1730,1845],
  Thursday:   [745,840,910,950,1030,1210,1215,1300,1345,1350,1440,1525,1530,1555,1700,1710,1730,1845],
  Friday:     [745,840,910,950,1030,1210,1300,1350,1440,1525,1555,1710,1730,1845],
  MakeUpDay:  [745,910,1030,1300,1440,1555,1730]
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
  //return 1800;
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

const judge = judgeSpecialDays(yearMonthDate);

setInterval(()=>{
  const hourMin = nowHourMin();

  const day = new Date().getDay();

  const minamiBusList =  nextBus(judge, day, hourMin, scheduleToMinamiosawa);

  //8:35のような時刻を08:35にして表示するための変換
  minamiTime=[];
  for (let i = 0; i < minamiBusList.length; i++){
    if (minamiBusList[i] < 1000){
      minamiTime[i] = "0" + minamiBusList[i].toString();
    }
    else{
      minamiTime[i] = minamiBusList[i].toString()
    }
  }

  if(minamiBusList.length == 0){
    document.getElementById("nextMinamiCountdown").innerHTML = "本日のバスはもうありません";
  }
  else{
    document.getElementById("nextMinamiHour").innerHTML = minamiTime[0].slice(0,2);
    document.getElementById("colonMinami").innerHTML = ":";
    document.getElementById("nextMinamiMinute").innerHTML = minamiTime[0].slice(-2);
    document.getElementById("nextMinamiCountdown").innerHTML = "あと" + timeSubtract(minamiBusList[0],hourMin);
  }

  if(minamiBusList.length == 1){
    document.getElementById("nextMinamiCountdown1").innerHTML = "最終便となります";
  }
  else if (minamiBusList.length >= 2){
    document.getElementById("divider1").innerHTML = "=====";
    document.getElementById("nextMinamiHour1").innerHTML = minamiTime[1].slice(0,2);
    document.getElementById("colonMinami1").innerHTML = ":";
    document.getElementById("nextMinamiMinute1").innerHTML = minamiTime[1].slice(-2);
    document.getElementById("nextMinamiCountdown1").innerHTML = "あと" + timeSubtract(minamiBusList[1],hourMin);
  }

  if(minamiBusList.length == 2){
    document.getElementById("nextMinamiCountdown2").innerHTML = "最終便となります";
  }
  else if (minamiBusList.length >= 3){
    document.getElementById("divider2").innerHTML = "=====";
    document.getElementById("nextMinamiHour2").innerHTML = minamiTime[2].slice(0,2);
    document.getElementById("colonMinami2").innerHTML = ":";
    document.getElementById("nextMinamiMinute2").innerHTML = minamiTime[2].slice(-2);
    document.getElementById("nextMinamiCountdown2").innerHTML = "あと" + timeSubtract(minamiBusList[2],hourMin);
  }

},1);