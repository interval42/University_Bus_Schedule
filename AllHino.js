const judgeSpecialDays = function (yearMonthDate) {
    // 引数:Number型の年月日
    // バスがない日や補講日の特殊日かどうか判定
    // バスがない日の特殊日なら"0"を返す
    // 補講日の特殊日なら"1"を返す
    // バスがない日と補講日にも当てはまらなければ"2"を返す

    noBusDate = [20221010, 20221102, 20221103, 20221104, 20221123, 20221229, 20221230, 20230102, 20230103, 20230109, 20230113, 20230117,]

    makeUpDate = [20221222, 20221227, 20221228, 20230213, 20230214, 20230215]

    if (yearMonthDate >= 20230216 && yearMonthDate <= 20230331) {
        return "0";
    }

    for (let i = 0; i < noBusDate.length; i++) {
        if (yearMonthDate == noBusDate[i]) {
            return "0";
        }
    }

    for (let i = 0; i < makeUpDate.length; i++) {
        if (yearMonthDate == makeUpDate[i]) {
            return "1";
        }
    }
    return "2"
}

const futureMinamiBuses = function (judge, day, hourMin) {
    // 引数:judgeSpecialDays関数の返り値, Number型の曜日, Number型の時分
    // 返り値:hourMin以降の南大沢のバススケジュールの配列

    const makeupFromMinami = [745, 910, 1020, 1300, 1440, 1555, 1730];
    const normalFromMinami = [745, 840, 910, 950, 1020, 1210, 1300, 1350, 1440, 1525, 1555, 1710, 1730, 1845];
    const wedFromMinami = [740, 745, 840, 910, 915, 950, 1020, 1025, 1210, 1215, 1345, 1300, 1350, 1440, 1525, 1530, 1555, 1700, 1710, 1730, 1845];
    const thuFromMinami = [745, 840, 910, 950, 1020, 1210, 1215, 1345, 1300, 1350, 1440, 1525, 1530, 1555, 1700, 1710, 1730, 1845];

    if (judge == "0") {
        return [];
    }

    if (judge == "1") {
        for (let i = 0; i < makeupFromMinami.length; i++) {
            if (hourMin <= makeupFromMinami[i]) {
                return makeupFromMinami.slice(i)
            }
        }
    }

    if (judge == "2") {
        if (day == 3) {
            for (let i = 0; i < wedFromMinami.length; i++) {
                if (hourMin <= wedFromMinami[i]) {
                    return wedFromMinami.slice(i)
                }
            }
        }
        if (day == 4) {
            for (let i = 0; i < thuFromMinami.length; i++) {
                if (hourMin <= thuFromMinami[i]) {
                    return thuFromMinami.slice(i)
                }
            }
        }
        if (day == 1 || day == 2 || day == 5) {
            for (let i = 0; i < normalFromMinami.length; i++) {
                if (hourMin <= normalFromMinami[i]) {
                    return normalFromMinami.slice(i)
                }
            }
        }
    }

    return []
}

const yearMonthDate = sessionStorage.getItem("selectedDate");

const judge = judgeSpecialDays(yearMonthDate);

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
        <div class="col-2 col-sm-4 text-end">
            <p id = "nextHinoHour" style="font-size: 4rem; text-align: right;">${hour}</p>
        </div>
        <div class="col-1">
            <p id = "colonHino" style="font-size: 3.5rem;">:</p>
        </div>
        <div class="col-2 col-sm-4 text-start">
            <p id = "nextHinoMinute" style="font-size: 4rem; text-align: left;">${minute}</p>
        </div>
    </div>
    `
        //let time_display = '<p>test</p>'
        let timeContainer = document.getElementById("timeContainer");
        timeContainer.innerHTML += time_display;
    }
}

