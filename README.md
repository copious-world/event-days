# Event Days

This is a small set of classes that provide basic operations for managing calendar related data structures.


The data structures calendars, event day lists, time slots which may be within a day or across many days spanning a number of months. A time line data structure provides a relationship between a time window of months and methods use to fetch and updates monts for effective infinite scrolling.

## Install 

```
npm install i --save event-days
```

## Classes and Methods

### [TimeLine](#timeline-methods)

With ***node.js***
```
const {TimeLine} = require('event-days')
```


### [TimeSlot](#timeslot-methods)

With ***node.js***
```
const {TimeSlot} = require('event-days')
```


### [TimeSlotAgenda](#timeslotagenda-methods)

With ***node.js***
```
const {TimeSlotAgenda} = require('event-days')
```


### [MonthContainer](#monthcontainer-methods)

With ***node.js***
```
const {MonthContainer} = require('event-days')
```



## Methods

### TimeLine Methods

* [`constructor(conf)`](#timeline-constructor)
* [`async injest_month(start_time)`](#timeline-injest-month)
* [`async scroll_right(n)`](#timeline-scroll-right)
* [`async scroll_left(n)`](#timeline-scroll-left)
* [`remove_slot_everywhere(label)`](#timeline-remove-slot-everywhere)
* [`save_time_list(do_send_months)`](#timeline-save-time-list)


#### <u>TimeLine Constructor</u>

> Sets up the data structure for a line line. The configuration provides fields for the window size and for a number of functions which server to get and send the timeline and the month data structure. The kind of producers and consumers of the data structure is not determined. The parameters to the methods that call on them are required for operation. 
> 

Here is a list of definitions for the methods that should be supplied with the configuration.

#### *TimeLine* <u>injest month</u>

> Given a start time for a month, this method will either create or locate a data structure. If the month was not previously fetched, the month will be fetched with the month fetcher method.

#### *TimeLine* <u>scrol right</u>

> Moves the window to the right (future time). If the the window size is full, the left more (least time) window will be cut out of the window list. (*Note*: the month data structure may still be within a map of previously fetched months depending on aging out and other space management strategies.) Every new month appearing in the window will be injested.

#### *TimeLine* <u>scroll left</u>

> Moves the window to the left (past time). If the the window size is full, the right more (greates time) window will be cut out of the window list. (*Note*: the month data structure may still be within a map of previously fetched months depending on aging out and other space management strategies.) Every new month appearing in the window will be injested.


#### *TimeLine* <u>remove slot everywhere</u>

> A time slot appearing wihin a day agenda in a month in the timeline window may be removed from the data base accessible via the configured methods. The slot will be removed in entirety. That is, given the slot has a time span greater than the timeline window, the entire span will be removed independent of what is in the window. (Note: this extent of this removal is up to the database application; however, this may be a recommendation that the database application removes the event in full.)

#### *TimeLine* <u>save time list </u>

> The time list will be sent to any consumer of the data structures provided by this module by calling time\_line\_sender found in the configuration. If the parameter do\_send\_months is set to true, the months will be sent as well with the methods send\_months.


### TimeSlot Methods

* [`constructor(conf)`](#monthcontainer-constructor)


### TimeSlotAgenda Methods

* [`constructor(conf)`](#monthcontainer-constructor)


### MonthContainer Methods

* [`constructor(conf)`](#monthcontainer-constructor)
* [`add_agenda_list(day_agenda)`](#monthcontainer-constructor)
* [`add_time_slot(a_t_slot)`](#monthcontainer-constructor)
* [`remove_time_slot(start_time)`](#monthcontainer-constructor)
* [`remove_all_of_time_slot(a_t_slot)`](#monthcontainer-constructor)

#### <u> MonthContainer Constructor</u>

