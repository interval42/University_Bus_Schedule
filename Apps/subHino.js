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
  //return 1810;
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
  // 引数:Number型の年月日
  // バスがない日や補講日の特殊日かどうか判定
  // バスがない日の特殊日なら"0"を返す
  // 補講日の特殊日なら"1"を返す
  // バスがない日と補講日にも当てはまらなければ"2"を返す

  noBusDate = [ 20221010,20221102,20221103,20221104,20221123,20221229,20221230,20230102,20230103,20230109,20230113,20230117,]

  makeUpDate = [20221222,20221227,20221228,20230213,20230214,20230215]

  if(yearMonthDate >= 20230216 && yearMonthDate<=20230331){
    return "0";
  }

  for(let i = 0; i<noBusDate.length; i++){
    if (yearMonthDate == noBusDate[i]){
      return "0";
    }
  }

  for(let i = 0; i<makeUpDate.length; i++){
    if (yearMonthDate == makeUpDate[i]){
      return "1";
    }
  }
  return "2"
}

const futureMinamiBuses = function(judge, day, hourMin){
  // 引数:judgeSpecialDays関数の返り値, Number型の曜日, Number型の時分
  // 返り値:hourMin以降の南大沢のバススケジュールの配列

  const makeupFromMinami = [745,910,1020,1300,1440,1555,1730];
  const normalFromMinami = [745,840,910,950,1020,1210,1300,1350,1440,1525,1555,1710,1730,1845];
  const wedFromMinami = [740,745,840,910,915,950,1020,1025,1210,1215,1300,1345,1350,1440,1525,1530,1555,1700,1710,1730,1845];
  const thuFromMinami = [745,840,910,950,1020,1210,1215,1300,1345,1350,1440,1525,1530,1555,1700,1710,1730,1845];

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
    if(day == 3){
      for(let i = 0; i < wedFromMinami.length; i++){
        if(hourMin <= wedFromMinami[i]){
          return wedFromMinami.slice(i)
        }
      }
    }
    if(day == 4){
      for(let i = 0; i < thuFromMinami.length; i++){
        if(hourMin <= thuFromMinami[i]){
          return thuFromMinami.slice(i)
        }
      }
    }
    if(day == 1 || day == 2 || day == 5){
      for(let i = 0; i < normalFromMinami.length; i++){
        if(hourMin <= normalFromMinami[i]){
          return normalFromMinami.slice(i)
        }
      }
    }
  }

  return []
}


/*----------------------------------------------------------------------------- */


const yearMonthDate = nowYearMonthDate();

const judge = judgeSpecialDays(yearMonthDate);

setInterval(()=>{
  const hourMin = nowHourMin();

  const day = new Date().getDay();

  const hinoBusList =  futureMinamiBuses(judge, day, hourMin);
  
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
  else{
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

