
const {in_interval} = require('./utilities')




// ---- TimeSlotAgenda ---- ---- ---- ---- ---- ---- ----
class TimeSlotAgenda {

    //
    constructor(day,index) {
        this.day = day
        this.index = index
        this.start_time = -Infinity
        this.end_time = Infinity
        this.all_day = {}
    }

    // set_start_and_end
    set_start_and_end(st,et) {
        this.start_time = st
        this.end_time = et
    }

    // ---- add_slot
    // returns a conflict if found (false otherwise)... 
    add_slot(a_slot) {
        if ( !a_slot ) return false
        //
        let conflicts = []
        //
        let ba = a_slot.begin_at 
        let ea = a_slot.end_at 

        for ( let sky in this.all_day ) {
            let slot = this.all_day[sky]
            if ( in_interval(slot.begin_at, ba,ea) || in_interval(slot.end_at, ba,ea) ) {
                conflicts.push(slot)
            } else if ( in_interval(ba,slot.begin_at,slot.end_at) || in_interval(ea,slot.begin_at, slot.end_at) ) {
                conflicts.push(slot)
            }
        }
        //
        if ( conflicts.length ) return conflicts
        else {
            this.all_day[a_slot.begin_at] = a_slot
        }
        return false
    }


    // ---- find_slot 
    find_slot(start_time) {
        let slot = this.all_day[start_time]
        if ( slot ) return slot
        for ( let sky in this.all_day ) {
            let slot = this.all_day[sky]
            if ( in_interval(start_time,slot.begin_at,slot.end_at)  ) return slot
        }
        return false
    }

    // ---- remove_slot
    remove_slot(a_slot) {
        if ( !a_slot ) return
        let st = a_slot.begin_at
        if ( this.all_day[st] ) {
            delete this.all_day[st]
        }
    }


    // ---- add_all_slots
    add_all_slots(slot_list) {
        let conflicts = []
        for ( let a_slot of slot_list ) {
            if ( a_slot ) {
                let conflict = this.add_slot(a_slot)
                if ( conflict ) {
                    conflicts.push(...conflict)
                }    
            }
        }
        if ( conflicts.length ) return conflicts
        return false
    }

}






module.exports = TimeSlotAgenda