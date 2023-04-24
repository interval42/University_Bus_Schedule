//git subtree push --prefix Apps origin gh-pages

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
  // return 800;
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

  if(yearMonthDate >= 20230915 || yearMonthDate <= 20230404){
    return "0";
  }

  noBusDate = [ 20230503,20230504,20230505,20230717]
  if (noBusDate.includes(yearMonthDate)){
    console.log("special day")
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
    if(day !== 6 && day !== 0){
      for(let i = 0; i < normalFromHino.length; i++){
        if(hourMin <= normalFromHino[i]){
          return normalFromHino.slice(i)
        }
      }
    }
  }

  return [];
}

const futureMinamiBuses = function(judge, day, hourMin){
  // 引数:judgeSpecialDays関数の返り値, Number型の曜日, Number型の時分
  // 返り値:hourMin以降の南大沢のバススケジュールの配列

  const makeupFromMinami = [745,920,1030,1300,1440,1555,1730];
  const normalFromMinami = [745,840,920,950,1030,1230,1300,1350,1440,1530,1555,1700,1730,1845];
  
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

//export {futureHinoBuses,futureMinamiBuses};
/*----------------------------------------------------------------------------- */


const yearMonthDate = nowYearMonthDate();
// const yearMonthDate = 20230504;

const judge = judgeSpecialDays(yearMonthDate);

setInterval(()=>{
  const hourMin = nowHourMin();

  const day = new Date().getDay();

  const hinoBusList =  futureMinamiBuses(judge, day, hourMin);

  if(hinoBusList.length == 0){
    document.getElementById("nextHinoCountdown").innerHTML = "本日のバスはもうありません";
  }
  else{
    //8:35のような時刻を08:35にして表示するための変換
    if (hinoBusList[0] < 1000){
      hinoTime = "0" + hinoBusList[0].toString();
    }
    else{
      hinoTime = hinoBusList[0].toString()
    }
    
    document.getElementById("nextHinoHour").innerHTML = hinoTime.slice(0,2);//時   
    document.getElementById("colonHino").innerHTML = ":";//：    
    document.getElementById("nextHinoMinute").innerHTML = hinoTime.slice(-2);//分
    document.getElementById("nextHinoCountdown").innerHTML = "あと" + timeSubtract(hinoBusList[0],hourMin);//残り時間
  }

},1);

setInterval(()=>{
  const hourMin = nowHourMin();

  const day = new Date().getDay();

  const minamiBusList =  futureHinoBuses(judge, day, hourMin);

  if(minamiBusList.length == 0){
    document.getElementById("nextMinamiCountdown").innerHTML = "本日のバスはもうありません";
  }
  else{
    //8:35のような時刻を08:35にして表示するための変換
    if (minamiBusList[0] < 1000){
      minamiTime = "0" + minamiBusList[0].toString();
    }
    else{
      minamiTime = minamiBusList[0].toString()
    }
    document.getElementById("nextMinamiHour").innerHTML = minamiTime.slice(0,2);//時
    document.getElementById("colonMinami").innerHTML = ":";//： 
    document.getElementById("nextMinamiMinute").innerHTML = minamiTime.slice(-2);//分
    document.getElementById("nextMinamiCountdown").innerHTML = "あと" + timeSubtract(minamiBusList[0],hourMin);//残り時間
  }

},1);