const MonthContainer = require('./month-container')
const {lower_month_bounday,next_month_start} = require('./utilities')


// a list of month containers ... managed sliding window relative to a DB


// Time line has the conflicts publication...

const DEFAULT_MAX_WINDOW = 100

class TimeLine {
    // 
    constructor(conf) {
        //
        this.in_app_month_store = {}  // all the months that have been fetched or injested
        this.month_start_time_window = [] // the window of time that have been fetched or we want fetched
        //
        this.month_fetcher = conf.fetcher
        if ( (conf.fetcher === undefined) || typeof this.month_fetcher.get !== 'function' ) {
            this.month_fetcher = false
        }
        //
        this.month_sender = conf.send_and_store
        //
        this.window_size = conf.window_size ? conf.window_size :  DEFAULT_MAX_WINDOW
        this.conflict_publisher = conf.conflict_publisher
    }


    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    // send_month
    send_month(start_time) {
        let st = lower_month_bounday(start_time)
        let mo = this.in_app_month_store[st]
        if ( this.month_sender ) {
            this.month_sender(mo)
        }
    }

    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    // publish_conflicts
    publish_conflicts(conflicts) {
        if ( typeof this.conflict_publisher === 'function' ) {
            try {
                this.conflict_publisher(conflicts)
            } catch(e) {
                console.log(e)
            }
        }
    }

    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----


    // filter_existing_times
    #filter_existing_times(st_list) {
        let remaining = []
        for ( let st of st_list ) {
            if ( this.in_app_month_store[st] === undefined ) {
                remaining.push(st)
            }
        }
        return remaining
    }

    //
    // adjacent_start_times
    missing_adjacent_start_times(start_time) {
        let adj_list = []
        //
        if ( start_time < this.month_start_time_window[0] ) {
            let first_starter = this.month_start_time_window[0]
            adj_list.push(start_time)
            while ( start_time < first_starter ) {
                start_time = next_month_start(start_time)
                adj_list.push(start_time)
            }
        } else if ( start_time > this.month_start_time_window[this.month_start_time_window.length -1] ) {
            let first_starter = this.month_start_time_window[this.month_start_time_window.length -1]
            while ( start_time > first_starter ) {
                first_starter = next_month_start(first_starter)
                adj_list.push(first_starter)
            }
        }
        
        adj_list = this.#filter_existing_times(adj_list)
        return adj_list
    }


    // trim_to_window
    #trim_to_window(start_time) {   // mostly about trimming the time list (age out the map)
        let nm = this.month_start_time_window.length
        if ( nm < this.window_size ) return
        else {
            //
            let no2 = Math.floor(nm/2)
            let st = this.month_start_time_window[no2]
            if ( st > start_time ) {
                let delta = (nm - this.window_size)
                this.month_start_time_window.splice(0,delta)
            } else {
                let delta = (nm - this.window_size)
                let start = this.window_size
                this.month_start_time_window.splice(start,delta)
            }
            //
        }
    }

    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    //
    // injest_month
    async injest_month(start_time) {
        //
        if ( !(this.month_fetcher) ) return
        //
        if ( this.in_app_month_store[start_time] === undefined ) {
            //
            start_time = lower_month_bounday(start_time)
            //
            let window_based_list = this.missing_adjacent_start_times(start_time)  // return missing months as a list
            if ( window_based_list.length ) {
                let month_data = await this.month_fetcher.get(window_based_list)
                if ( month_data ) {
                    for ( let mo_moment in month_data ) {
                        //
                        let i_mo_moment = parseInt(mo_moment)
                        let moc = new MonthContainer(i_mo_moment)
                        this.in_app_month_store[mo_moment] = moc   /// only place the missing ones
                        this.month_start_time_window.push(i_mo_moment)
                        //
                        let mo = month_data[mo_moment]  // the data from the fetcher service (whatever that is)
                        let conflicts = moc.add_agenda_list(mo.agenda)
                        //
                        if ( conflicts && conflicts.length ) {
                            this.publish_conflicts(conflicts)
                        }
                    }
                    this.month_start_time_window.sort()
                    this.#trim_to_window(start_time)
                }
            }
        }
    }

    async scroll_right(n) {
        let st = 0
        if ( this.month_start_time_window.length === 0) {
            st = lower_month_bounday(Date.now())
        } else {
            st = this.month_start_time_window[this.month_start_time_window.length - 1]
        }
        while ( n-- ) {
            st = next_month_start(st)
        }
        await this.injest_month(st)
    }

    async scroll_left(n) {
        let st = 0
        if ( this.month_start_time_window.length === 0 ) {
            st = lower_month_bounday(Date.now())
        } else {
            st = this.month_start_time_window[0]
        }
        while ( n-- ) {
            st -= 3600*24  // go back a day
            st = lower_month_bounday(st)
        }
        await this.injest_month(st)
    }

    //
    remove_slot(a_t_slot) {
        let st = a_t_slot.start_time
        let et = a_t_slot.end_time

        st = lower_month_bounday(st)
        et = next_month_start(et)
        while ( st < et ) {
            let mo = this.in_app_month_store[st]
            mo.remove_all_of_time_slot(a_t_slot)
            st = next_month_start(st)
        }
    }

}



module.exports = TimeLine