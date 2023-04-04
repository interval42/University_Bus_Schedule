const judgeSpecialDays = function(yearMonthDate){
  // 引数:Number型の年月日
  // バスがない日や補講日の特殊日かどうか判定
  // バスがない日の特殊日なら"0"を返す
  // 補講日の特殊日なら"1"を返す
  // バスがない日と補講日にも当てはまらなければ"2"を返す

  if(yearMonthDate >= 20230915 || yearMonthDate <= 20230404){
    return "0";
  }

  noBusDate = [ 20230503,20230504,20230505,20230717]
  if (noBusDate.includes(yearMonthDate)){
    return "0";
  }

  if(yearMonthDate >= 20230807 && yearMonthDate <= 20230915){
    if(yearMonthDate >= 20230811 && yearMonthDate <= 20230903){
      return "0";
    }
    else{
      return "1";
    }
  }

  return "2"
}

const futureHinoBuses = function(judge, day, hourMin){
  // 引数:judgeSpecialDays関数の返り値, Number型の曜日, Number型の時分
  // 返り値:hourMin以降の日野のバススケジュールの配列

  const makeupFromHino = [840,950,1220,1350,1520,1630,1830];
  const normalFromHino = [750,840,910,950,1030,1220,1300,1350,1440,1520,1620,1630,1805,1830];
  
  if(judge == "0"){
    return [];
  }

  if(judge == "1"){
    for(let i = 0; i < makeupFromHino.length; i++){
      if(hourMin <= makeupFromHino[i]){
        return makeupFromHino.slice(i)
      }
    }
  }

  if(judge == "2"){
    if(day !== 6 && day !== 7){
      for(let i = 0; i < normalFromHino.length; i++){
        if(hourMin <= normalFromHino[i]){
          return normalFromHino.slice(i)
        }
      }
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

const minamiBusList = futureHinoBuses(judge, day, hourMin);

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