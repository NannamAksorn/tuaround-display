const MONTHS = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAY_OF_WEEKS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
function showTime(){
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var dayOfWeek = DAY_OF_WEEKS[date.getDay()]
    var year = date.getFullYear()
    var month = MONTHS[date.getMonth()]
    var day = date.getDate()
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = `${h}:${m}:${s}`;
    var date_display = `${dayOfWeek}, ${day} ${month} ${year}`;
    document.getElementById("MyClockDisplay").innerText = time;
    document.getElementById("MyClockDisplay").textContent = time;
    document.getElementById("MyClockDisplay--date").textContent = date_display;
    
    setTimeout(showTime, 1000);
    
}

showTime();