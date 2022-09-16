// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
const fs = require('fs')


const TWENTY_FOUR = 24*3600*1000
const ONE_WEEK = 7*TWENTY_FOUR
const ONE_MONTH = 4*ONE_WEEK
const MIN15 = 15*60*1000

let TimeSlot = require('../lib/time-slot')
let TimeSlotAgenda = require('../lib/time-slot-agenda')
let MonthContainer = require('../lib/month-container')
let TimeLine = require('../lib/time-line')

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
let show_output = false
function traceMethodCalls(obj)
{
    return new Proxy(obj, {
        get(target, methodName, receiver) {
            // get origin method
            const originMethod = target[methodName];
            //
            return function(...args) {
                // write to file here
                let b = JSON.stringify(args,null,2)
                fs.appendFileSync("test-output.txt",b)
                // call origin method
                if ( show_output ) {
                    return originMethod.apply(this, args);
                } else {
                    return false
                }
            };
        }
    });
}

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

console = traceMethodCalls(console);

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

let test_date = new Date(1663347864879)
let ts_start = test_date.getTime()
let ts_end = ts_start + ONE_WEEK

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

let moc = new MonthContainer(ts_start)

let runtime = new Date()

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
let out = `TEST OF EVENT-DAYS ${runtime.toLocaleDateString()}`
fs.writeFileSync("test-output.txt",out)

// -- create multi day timeslot
let daily_dur = 2*3600*1000
let ts = new TimeSlot("big-test",TimeSlot.USE_AS_BLOCK,ts_start,ts_end,true,10,true,daily_dur)


console.log(
ts.start_time,
ts.end_time,
ts.break_apart,
ts.importance,
ts.weekends,
ts.use_case,
ts.label)
console.log(ts.each_day.length)
console.dir(ts.each_day)

// --- get_range
let rr = ts.get_range(ts_start,ts_start + TWENTY_FOUR*2)
console.dir(rr)

console.log("daily_duration: " + (ts.daily_duration)/(1000000))

// --- create agenda
let tsa = new TimeSlotAgenda(0,0)

let conflicts = tsa.add_all_slots(ts.each_day)
console.log(conflicts)

console.dir(tsa.all_day)

conflicts = tsa.add_all_slots(ts.each_day)
console.log(conflicts)

// --- find
let found = tsa.find_slot(ts.each_day[2].begin_at + 10)
console.dir(found)

// --- remove
tsa.remove_slot(found)

console.log(Object.keys(tsa.all_day))



// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----


console.dir(moc.cal)
console.log("TABLE ----")
console.dir(moc.cal.table)
console.log("---- ----")
moc.add_time_slot(ts)
console.log("MAP ----")
out = JSON.stringify(moc.cal.map,null,2)
fs.appendFileSync("test-output.txt",out)
//console.log(out)

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

let daily_dur2 = 0.5*3600*1000
let ts_start2 = (ts_start + daily_dur2 + MIN15)
let ts_end2 = ts_start2 + ONE_WEEK*6
let ts2 = new TimeSlot("big-test",TimeSlot.USE_AS_BLOCK,ts_start2,ts_end2,true,10,true,daily_dur2)

moc.add_time_slot(ts2)
console.log("MAP 2 ----")
out = JSON.stringify(moc.cal.map,null,2)
fs.appendFileSync("test-output.txt",out)

//console.log(out)

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

let daily_dur3 = 0.5*3600*1000
let ts_start3 = (ts_start - daily_dur3 - MIN15) - 3*ONE_WEEK
let ts_end3 = ts_start3 + ONE_WEEK*2
let ts3 = new TimeSlot("big-test",TimeSlot.USE_AS_BLOCK,ts_start3,ts_end3,true,10,true,daily_dur3)

moc.add_time_slot(ts3)
console.log("MAP 3 ----")
out = JSON.stringify(moc.cal.map,null,2)
//console.log(out)
fs.appendFileSync("test-output.txt",out)

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

let daily_dur4 = 0.5*3600*1000
let ts_start4 = (ts_start + 8*daily_dur3 + MIN15) - 3*ONE_WEEK
let ts_end4 = ts_start3 + ONE_WEEK*8
let ts4 = new TimeSlot("big-test",TimeSlot.USE_AS_BLOCK,ts_start4,ts_end4,true,10,true,daily_dur4)

moc.add_time_slot(ts4)
console.log("MAP 4 ----")
out = JSON.stringify(moc.cal.map,null,2)
//console.log(out)
fs.appendFileSync("test-output.txt",out)



// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

show_output = true
/*
    TimeLine
*/

console.log("Running Time Line Test")
let tl = new TimeLine({
    fetcher : {  // a class
        get : (start_time_list) => {
            console.log("fetching months")
            console.dir(start_time_list)
            let idx = start_time_list.indexOf(ts_start)
            console.log(`(${idx}) <---- fetched months`)
            //
            let mo_list = start_time_list.map((ts) => { return new MonthContainer(ts) })
            let mo_obj = {}
            for ( let mo of mo_list ) {
                mo_obj[mo.start_time] = mo
            }
            //
            return mo_obj 
        }
    },
    send_and_store : (a_month) => {
        console.log("Send a month to storage")
        console.dir(a_month)
    },
    window_size : 10,
    conflict_publisher : (conflicts) => {
        console.log("found these conflicts")
    }
})


//ONE_MONTH
async function test_time_line() {
    tl.in_app_month_store[moc.start_time] = moc
    tl.month_start_time_window = [moc.start_time] // the window of time that have been fetched or we want fetched
    
    let bb = tl.missing_adjacent_start_times(ts_start - ONE_MONTH*3)
    console.log(bb)
    
    show_output = false
    // 
    await tl.injest_month(bb[0])
    console.dir(tl.in_app_month_store)

    await tl.scroll_right(2)
    console.dir(tl.in_app_month_store)

    show_output = true

    await tl.scroll_left(2)
    console.dir(tl.in_app_month_store)

    await tl.scroll_right(10)
    console.dir(tl.in_app_month_store)
    console.dir(tl.month_start_time_window)
}


test_time_line()
