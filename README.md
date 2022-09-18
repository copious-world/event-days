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


### [TimeSlot](#)

With ***node.js***
```
const {TimeSlot} = require('event-days')
```


### [TimeSlotAgenda](#)

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

* [`constructor(conf)`](timeline-constructor)
* [`async injest_month(start_time)`](timeline-injest-month)
* `async scroll_right(n)`
* `async scroll_left(n)`
* `remove_slot_everywhere(label)`
* `save_time_list(do_send_months)`


#### <u>TimeLine Constructor</u>

> Sets up the data structure for a line line. The configuration provides fields for the window size and for a number of functions which server to get and send the timeline and the month data structure. The kind of producers and consumers of the data structure is not determined. The parameters to the methods that call on them are required for operation. 
> 

Here is a list of definitions for the methods that should be supplied with the configuration.

#### <u>TimeLine injest month </u>

> TBD


### MonthContainer Methods

* [`constructor(conf)`](month-constructor)
* `add_agenda_list(day_agenda)`
* `add_time_slot(a_t_slot)`
* `remove_time_slot(start_time)`
* `remove_all_of_time_slot(a_t_slot)`

