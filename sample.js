nowTime = function() {
  const now = new Date();
  const year = now.getFullYear();
  const mon = now.getMonth()+1; // 0~11 Jan:0,Feb:1...
  const day = now.getDate();
  const week = now.getDay(); // 0~6 Sun:0,Mon:1...
  const dayWeek = new Array("日","月","火","水","木","金","土");
  const hour = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();
  
  const timelimit = new Date(2022, 10, 31, 12, 0, 0);
  
  // const s = year + "年" + mon + "月" + day + "日(" + dayWeek[week] + ")" + hour + "時" + min + "分" + sec + "秒"; 
  const s = now;
  return s;
}

busTime = function() {
  const s = new Date(2022,9,31,12,0,0);
  return s;
}

diffTime = function() {
  a = busTime();
  b = nowTime();
  c = a - b;
  const s = parseInt(c / 1000 / 60 / 60 / 24);
  return s;
}

setNowTime = function() {
  document.getElementById("now_time").innerHTML = nowTime();
}

setBusTime = function() {
  document.getElementById("bus_time").innerHTML = busTime();
}

setDiffTime = function() {
  document.getElementById("diff_time").innerHTML = diffTime();
}

setInterval('setNowTime()',500);
setBusTime();
setInterval('setDiffTime()',500);

Resources