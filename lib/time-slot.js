
const {hours_of,calc_days,same_day} = require('./utilities')


const TWENTY_FOUR = 24*3600*1000


class Slot {

    constructor(label,begin_t,end_t) {
        this.begin_at = begin_t ? begin_t : 0
        this.end_at = end_t ? end_t : 0
        this.label = label
    }

    adjust_start(lapse) {     // may be negative
        this.begin_at += lapse
    }

    adjust_end(lapse) {     // may be negative
        this.end_at += lapse
    }

}


class TimeSlot {

    static USE_AS_BLOCK = "blog"
    static USE_AS_MEET = "meeting"
    static USE_AS_ACTIVITY = "activity"
    static USE_AS_OPEN = "open"

    constructor(label,use_case,start_time,end_time,break_apart,importance,weekends,daily_dur,filler) {
        this.start_time = start_time    // may be months apart
        this.end_time = end_time
        this.break_apart = break_apart
        this.importance = importance
        this.weekends = weekends
        this.use_case = use_case
        this.daily_duration = daily_dur ? daily_dur : ((same_day(start_time,end_time)) ? (end_time - start_time) : 0)
        this.label = label
        this.each_day = []   /// constructed finally in init...
        this.init(filler)
    }

    init(filler) {
        this.lapse = (this.end_time - this.start_time)
        this.lapse_sec  = (this.lapse)/1000
        this.lapse_hr = this.lapse_sec/3600
        this.lapse_days = this.lapse_hr/24
        this.lapse_mo = this.lapse_days/30 /// this approximate
        //
        if ( filler === undefined ) {
            this.each_day = []
            for ( let i = 0; i < this.lapse_days; i++ ) {
                this.each_day.push(new Slot(this.label))
            }            
        } else {
            this.each_day = Array.from(Array(this.lapse_days),filler);    
        }

        this.set_beginnings()
        this.set_endings()
    }

    split(start_of_split,end_of_split) {
        if ( ( this.start_time <= start_of_split ) && (this.end_time >= end_of_split) ) {
            let s_day_index = calc_days(start_of_split - this.start_time)
            let e_day_index = calc_days(this.end_time - end_of_split) + 1
            for ( let i = s_day_index; i < e_day_index; i++ ) {
                let a_slot = this.each_day[i]
                if ( (a_slot.begin_at < start_of_split) && (hours_of((start_of_split - a_slot.begin_at)) < 24) ) {
                    a_slot.adjust_start(start_of_split -  a_slot.begin_at)
                    this.start_time = a_slot.begin_at
                } else if ( a_slot.end_at > end_of_split && (hours_of((a_slot.end_at - end_of_split)) < 24) ) {
                    a_slot.adjust_end(end_of_split -  a_slot.end_at)
                    this.end_time = a_slot.end_at
                } else {
                    this.each_day[i] = false  // remove the event
                }
            }
        }

        let first_start_time = false
        let first_end_time = false
        //
        let second_start_time = false
        let second_end_time = false

        let part_1 = []
        let part_2 = []

        for ( let a_day of  this.each_day ) {
            if ( a_day && (first_start_time === false) ) {
                first_start_time = a_day.begin_at
                part_1.push(a_day)
            } else if ( a_day && (first_end_time === false) ) {
                first_end_time = a_day.end_at
                part_1.push(a_day)
            } else if ( a_day && (second_start_time === false)  ) {
                second_start_time = a_day.begin_at
                part_2.push(a_day)
            } else if ( a_day && (second_end_time === false)  ) {
                second_end_time = a_day.end_at
                part_2.push(a_day)
            }
        }

        let early = false
        let later = false

        if ( first_end_time ) {
            let start_time = first_start_time
            let end_time = first_end_time
            let use_case = this.use_case
            let break_apart = this.break_apart
            let importance = this.importance
            let weekends = this.weekends
            let label = this.label
            early = new TimeSlot(label,use_case,start_time,end_time,break_apart,importance,weekends)
            let n = early.each_day.length
            for ( let i = 0; i < n; i++ ) {
                early.each_day[i] = part_1.shift()
            }

        }

        if ( second_start_time ) {
            let start_time = second_start_time
            let end_time = second_end_time
            let break_apart = this.break_apart
            let importance = this.importance
            let weekends = this.weekends
            let label = this.label
            later = new TimeSlot(label,use_case,start_time,end_time,break_apart,importance,weekends)
            for ( let i = 0; i < n; i++ ) {
                later.each_day[i] = part_2.shift()
            }
        }

        return [early,later]
    }


    grow_sooner_days(num_days) {
        let first_day = this.each_day[0]
        for ( let i = 0; i < num_days; i++ ) {
            let a_slot = new Slot(this.label,first_day.begin_at,first_day.end_at)
            this.each_day.unshift(a_slot)
        }
    }

    grow_later_days(num_days) {
        let last_day = this.each_day[this.each_day.length-1]
        for ( let i = 0; i < num_days; i++ ) {
            let a_slot = new Slot(this.label,last_day.begin_at,last_day.end_at)
            a_slot.begin_at = last_day.begin_at
            a_slot.end_at = last_day.end_at
            this.each_day.push(a_slot)
        }
    }

    set_beginnings() { // a time from Date calculation
        let day_start = this.start_time
        for ( let a_slot of this.each_day ) {
            a_slot.begin_at = day_start
            day_start += TWENTY_FOUR
        }
    }

    set_endings() {  // a time is seconds into the day
        this.each_day.forEach((a_slot) => {
            a_slot.end_at = a_slot.begin_at + this.daily_duration
        })
    }

    set_one_begining(index,a_time) {
        let a_slot = this.each_day[index]
        if ( a_slot ) {
            a_slot.begin_at = a_time
        }
    }

    set_one_ending(index,a_time) {
        let a_slot = this.each_day[index]
        if ( a_slot ) {
            a_slot.end_at = a_time
        }
    }

    #merge_first(first_t_slot,second_t_slot) {
        let between_time = (second_t_slot.start_time-first_t_slot.end_time)
        if ( between_time > 0 ) {
            let days_between = (((second_t_slot.start_time-first_t_slot.end_time)/1000)/3600)/24
            first_t_slot.grow_later_days(days_between)
            for ( let a_slot of second_t_slot.each_day ) {
                first_t_slot.each_day.push(a_slot)
            }
        } else {
            let days_overlap = (((second_t_slot.start_time-first_t_slot.end_time)/1000)/3600)/24
            if ( second_t_slot.lapse_days  > days_overlap ) {
                let day_1 = second_t_slot.lapse_days - days_overlap
                while ( day_1 < second_t_slot.lapse_days ) {
                    let a_slot = second_t_slot.each_day[day_1++]
                    first_t_slot.each_day.push(a_slot)
                }
            }
        }
    }

    merge_with(a_time_slot) {
        if ( a_time_slot.start_time < this.start_time ) {
            this.#merge_first(a_time_slot,this)
        } else {
            this.#merge_first(this,a_time_slot)
        }
    }

    get_range(start_time,end_time) {
        if ( (start_time >= this.start_time) && (end_time <= this.end_time) ) {
            let day_offset = calc_days(start_time - this.start_time)
            let e_day_offset = (this.lapse_days - calc_days(this.end_time - end_time)) + 1
            let slots = this.each_day.slice(day_offset,e_day_offset)
            return slots
        }
        return []
    }

}


module.exports = TimeSlot