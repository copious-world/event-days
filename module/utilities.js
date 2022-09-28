
//
export function hours_of(lapse) {
    let hrs = ((lapse/1000)/3600)
    return hrs
}

//
export function calc_days(t_time) {
    let days = Math.trunc((t_time/1000)/3600/24)
    return days
}

//
export function same_day(t1,t2) {
    return (new Date(t1).getDate() === (new Date(t2).getDate()))
}

//
export function first_day_of_month(a_date) {
    // a_date should be a Date object
    let mo = a_date.getMonth()
    let year = a_date.getFullYear()

    let nd = new Date(year,mo)
    let t = nd.getTime()
    return t
}


export function first_day_of_next_month(a_date) {
    // a_date should be a Date object
    let mo = a_date.getMonth()
    let year = a_date.getFullYear()

    mo = (mo + 1) % 12
    if ( mo === 0 ) year++

    let nd = new Date(year,mo)
    let t = nd.getTime()
    return t
}


export function lower_month_bounday(a_time) {
    let arg_date = new Date(a_time)
    return first_day_of_month(arg_date)
}

export function next_month_start(a_time) {
    let arg_date = new Date(a_time)
    return first_day_of_next_month(arg_date)
}

//
export function in_interval(instant,t_start,t_end) {
    //console.log("in_interval",instant,t_start,t_end)
    if ( (t_start <= instant) && (instant <= t_end) ) return true
    return false
}


export function first_day_of_relative_month(a_date,mo_offset) {
    // a_date should be a Date object
    let mo = a_date.getMonth()
    let year = a_date.getFullYear()
    //
    if ( mo_offset !== 0 ) {
        let mm = mo + mo_offset
        if ( mo_offset > 0 ) {
            if ( mm > 12 ) {
                let yoffset = Math.trunc((mm - 12)/12) + 1
                year += yoffset
                mo = mm % 12
            } else {
                mo = mm
            }
        } else {
            if ( mm < 0 ) {
                mo = (mm % 12) + 12
                let yoffset = Math.trunc((mo_offset - mo)/12)
                year += yoffset
            } else {
                mo = mm
            }
        }
    }
    
    let nd = new Date(year,mo)
    let t = nd.getTime()
    return t
}