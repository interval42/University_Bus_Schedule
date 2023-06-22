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
  
  const futureMinamiBuses = function(judge, day, hourMin){
    // 引数:judgeSpecialDays関数の返り値, Number型の曜日, Number型の時分
    // 返り値:hourMin以降の南大沢のバススケジュールの配列
  
    const makeupFromMinami = [745,920,1030,1300,1440,1555,1730];
    const normalFromMinami = [745,840,920,950,1030,1220,1300,1350,1440,1530,1555,1700,1730,1845];
    
    if(judge == "0"){
      return [];
    }
    
    if(judge == "1"){
      for(let i = 0; i < makeupFromMinami.length; i++){
        if(hourMin <= makeupFromMinami[i]){
          return makeupFromMinami.slice(i)
        }
      }
    }
  
    if(judge == "2"){
      if(day !== 6 && day !== 0){
        for(let i = 0; i < normalFromMinami.length; i++){
          if(hourMin <= normalFromMinami[i]){
            return normalFromMinami.slice(i)
          }
        }
      }
    }
  
    return []
  }
  

const yearMonthDate = sessionStorage.getItem("selectedDate");

const judge = judgeSpecialDays(parseInt(yearMonthDate));

const hourMin = 300;

let date = new Date(yearMonthDate.slice(0,4)+"-"+yearMonthDate.slice(4,6)+"-"+yearMonthDate.slice(6));
const day = date.getDay();
document.getElementById("selectedDateDisplay").innerHTML = date.toDateString();

const hinoBusList = futureMinamiBuses(judge, day, hourMin);

//8:35のような時刻を08:35にして表示するための変換
hinoTime = [];
for (let i = 0; i < hinoBusList.length; i++) {
    if (hinoBusList[i] < 1000) {
        hinoTime[i] = "0" + hinoBusList[i].toString();
    }
    else {
        hinoTime[i] = hinoBusList[i].toString()
    }
}
if (hinoBusList.length == 0) {
    document.getElementById("hinoJudge").innerHTML = "この日はバスが運行していません";
} else {
    document.getElementById("hinoJudge").innerHTML = "この日のバス";
    for (let i = 0; i < hinoTime.length; i++) {
        let hour = hinoTime[i].slice(0, 2);
        let minute = hinoTime[i].slice(-2);
        let time_display = `
    <div class="row justify-content-center">
        <div class="col-3 col-lg-2">
            <p id = "nextHinoHour" style="font-size: 4rem; text-align: right;">${hour}</p>
        </div>
        <div class="col-1">
            <p id = "colonHino" style="font-size: 3.5rem;">:</p>
        </div>
        <div class="col-3 col-lg-2">
            <p id = "nextHinoMinute" style="font-size: 4rem; text-align: left;">${minute}</p>
        </div>
    </div>
    `
        //let time_display = '<p>test</p>'
        let timeContainer = document.getElementById("timeContainer");
        timeContainer.innerHTML += time_display;
    }
}

