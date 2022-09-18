const {Calendar} = require('calendar-es6')
const TimeSlotAgenda = require('./time-slot-agenda')
const {first_day_of_month,calc_days} = require('./utilities')

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----


const g_cal = new Calendar(0)


const TWENTY_FOUR = (24*3600*1000)


// ---- overlap
function overlap(a_month,a_slot) {
    if ( (a_slot.end_time < a_month.start_time) || (a_month.end_time < a_slot.start_time) ) {
        return false
    }
    if ( (a_slot.start_time < a_month.start_time) && (a_slot.end_time < a_month.end_time) ) {
        return 1
    } else if ( a_month.start_time < a_slot.start_time ) {
        if ( a_month.end_time <= a_slot.end_time ) {
            return 2
        }
        return 3  // contained
    } else if ( (a_month.start_time >= a_slot.start_time) && (a_month.end_time <= a_slot.end_time) ) {
        return 4  // month is contained  ... condition check not stricly necessary
    }
    return false
}


// ---- MonthContainer
class MonthContainer {

    // ----
    constructor(start_time) {
        if ( Array.isArray(start_time) ) {
            this.date = new Date(...start_time)
        } else {
            this.date = new Date(start_time)
        }
        this.start_time = first_day_of_month(this.date)
        this.year = this.date.getFullYear()
        this.month = this.date.getMonth()
        if ( isNaN(this.year) || isNaN(this.month) ) throw "Nan for year or month in MontainContainer constructor"
        this.cal = g_cal.monthMap(this.year, this.month, TimeSlotAgenda)
        this.init_slot_times()
        this.end_time = this.last_day_time()
    }

    init_slot_times() {
        let st = this.start_time
        let access_tsa = this.cal.map
        let tsa_keys = Object.keys(access_tsa)
        tsa_keys.sort()
        for ( let key of tsa_keys ) {
            let tsa = access_tsa[key]
            if ( tsa ) {
                tsa.set_start_and_end(st,st + TWENTY_FOUR-1)
            }
            st += TWENTY_FOUR
        }
    }

    last_day_time()  {
        let lday_tsa = this.last_day()
        return lday_tsa ? lday_tsa.end_time : Infinity
    }


    last_day() {
        let d_list = this.cal.list
        if ( d_list ) {
            let idx = d_list.lastIndexOf(false)
            if ( (idx === -1) || (idx < 7) ) idx = d_list.length - 1
            let lday_ky = false
            while ( lday_ky === false ) {
                idx--
                lday_ky = d_list[idx]
            }
            
            d_list[idx-1]
            let lday = this.cal.map[lday_ky]
            return lday
        }
        return false
    }

    day_of(a_time) {
        let lapse = a_time - this.start_time
        return calc_days(lapse)
    }

    get_day_agenda(indx) {
        let da_ky = this.map.list[indx]
        if ( da_ky ) {
            let tsa = this.cal.map[da_ky]
            return tsa
        }
        return false
    }

    add_agenda_list(day_agenda) {   // for deserializing
        if ( day_agenda === undefined ) return false
        let idx = day_agenda.index
        let ts_agenda_ky = this.cal.list[idx]
        if ( ts_agenda_ky ) {
            let tsa = this.cal.map[ts_agenda_ky]
            if ( tsa === undefined ) {
                tsa = new TimeSlotAgenda(day_agenda.day,idx)
                this.cal.map[ts_agenda_ky] = tsa
            }
            //
            let conflicts = tsa.add_all_slots(day_agenda.slots)
            if ( conflicts ) return conflicts
        }
        return false
    }

    add_time_slot(a_t_slot) {
        let ovl = overlap(this,a_t_slot)
        if ( ovl !== false ) {
            //
            let slots = false
            //
            switch (ovl) {
                case 1: {
                    slots = a_t_slot.get_range(this.start_time,a_t_slot.end_time)
                    break; 
                }
                case 2: {
                    slots = a_t_slot.each_day
                    break;
                }
                case 3:  {
                    slots = a_t_slot.get_range(a_t_slot.start_time,a_t_slot.end_time)
                    break;
                }
                case 4:   {
                    slots = a_t_slot.get_range(this.start_time,this.end_time)
                    break;
                }
            }
            //
            if ( slots && slots.length ) {
                let conflicts = []
                let a_slot = slots[0]
                let mo_i = this.day_of(a_slot.begin_at)
                a_slot = slots[slots.length - 1]
                let mo_end = this.day_of(a_slot.end_at)
                while ( mo_i < mo_end ) {
                    let ts_agenda_ky = this.cal.list[mo_i]
                    let ts_agenda = this.cal.map[ts_agenda_ky]
                    if ( ts_agenda ) {
                        let slot_conflicts = ts_agenda.add_slot(a_slot)
                        if ( slot_conflicts ) {
                            conflicts = conflicts.push(...slot_conflicts)
                        }    
                    }
                    mo_i++
                }
                //
                if ( conflicts.length ) return conflicts
            }
            return true
        }
        return false
    }


    remove_time_slot(start_time) {
        let day = this.day_of(start_time)
        let da_ky = this.cal.list[day]
        if ( da_ky ) {
            let tsa = this.cal.map[da_ky]
            if ( tsa ) {
                let a_slot = tsa.find_slot(start_time)
                tsa.remove_slot(a_slot)
            }    
        }
    }


    remove_all_of_time_slot(a_t_slot) {
        let month_set = a_t_slot.get_range(this.start_time,this.end_time)
        for ( let a_slot of month_set ) {
            this.remove_time_slot(a_slot.begin_at)
        }
    }


}



module.exports = MonthContainer