



//
function hours_of(lapse) {
    let hrs = ((lapse/1000)/3600)
    return hrs
}

//
function calc_days(t_time) {
    let days = Math.trunc((t_time/1000)/3600/24)
    return days
}

//
function same_day(t1,t2) {
    return (new Date(t1).getDate() === (new Date(t2).getDate()))
}

//
function first_day_of_month(a_date) {
    // a_date should be a Date object
    let mo = a_date.getMonth()
    let year = a_date.getFullYear()

    let nd = new Date(year,mo)
    let t = nd.getTime()
    return t
}


function first_day_of_next_month(a_date) {
    // a_date should be a Date object
    let mo = a_date.getMonth()
    let year = a_date.getFullYear()

    mo = (mo + 1) % 12
    if ( mo === 0 ) year++

    let nd = new Date(year,mo)
    let t = nd.getTime()
    return t
}


function lower_month_bounday(a_time) {
    let arg_date = new Date(a_time)
    return first_day_of_month(arg_date)
}

function next_month_start(a_time) {
    let arg_date = new Date(a_time)
    return first_day_of_next_month(arg_date)
}

//
function in_interval(instant,t_start,t_end) {
    //console.log("in_interval",instant,t_start,t_end)
    if ( (t_start <= instant) && (instant <= t_end) ) return true
    return false
}



//
module.exports.hours_of = hours_of
module.exports.calc_days = calc_days
module.exports.same_day = same_day
module.exports.first_day_of_month = first_day_of_month
module.exports.in_interval = in_interval
module.exports.next_month_start = next_month_start
module.exports.lower_month_bounday = lower_month_bounday
//
