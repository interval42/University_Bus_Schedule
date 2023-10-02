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


const yearMonthDate = sessionStorage.getItem("selectedDate");

const judge = judgeSpecialDays(parseInt(yearMonthDate));

const hourMin = 300;

let date = new Date(yearMonthDate.slice(0,4)+"-"+yearMonthDate.slice(4,6)+"-"+yearMonthDate.slice(6));
const day = date.getDay();
document.getElementById("selectedDateDisplay").innerHTML = date.toDateString();

const minamiBusList = nextBus(judge, day, hourMin, scheduleToMinamiosawa);

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
    document.getElementById("minamiJudge").innerHTML = "この日はバスが運行していません";
  }
  else{
    document.getElementById("minamiJudge").innerHTML = "この日のバス";
    for (let i = 0; i < minamiTime.length; i++) {
        let hour = minamiTime[i].slice(0, 2);
        let minute = minamiTime[i].slice(-2);
        let time_display = `
    <div class="row justify-content-center">
        <div class="col-3 col-lg-2">
            <p id = "nextMinamiHour" style="font-size: 4rem; text-align: right;">${hour}</p>
        </div>
        <div class="col-1">
            <p id = "colonMinami" style="font-size: 3.5rem;">:</p>
        </div>
        <div class="col-3 col-lg-2">
            <p id = "nextMinamiMinute" style="font-size: 4rem; text-align: left;">${minute}</p>
        </div>
    </div>
    `
        //let time_display = '<p>test</p>'
        let timeContainer = document.getElementById("timeContainer");
        timeContainer.innerHTML += time_display;
    }
  }