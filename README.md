# Event Days

This is a small set of classes that provide basic operations for managing calendar related data structures.


The data structures calendars, event day lists, time slots which may be within a day or across many days spanning a number of months. A time line data structure provides a relationship between a time window of months and methods use to fetch and updates monts for effective infinite scrolling.

## Install 

For use in node.js projects:

```
npm install i --save event-days
```

In your node.js program you can access classes in the following manner:

```
	const {EventDays} = require('event-days')

	let MonthContainer = EventDays.MonthContainer
```


## Web Page Use

A rollup.config.js file has been added to the package. The npm package should be released after running `npm run build`. (That is best effort.)

Builds that use rollup may simply include event-days in their devDependencies field within package.json. It may help to run a second npm install a such:

```
npm install i --save-dev event-days
```

**Example**: This class is being used in a Svelte project. The module is included in an App.svelte file as follows:

```
	import {EventDays} from 'event-days'

	let MonthContainer = EventDays.MonthContainer
```

From there, the **MonthContainer** may be created and used as needed by the application.


## Classes and Methods

### [TimeLine](#timeline-methods)

With ***node.js***
```
const {TimeLine} = require('event-days')
```


### [TimeSlot](#timeslot-methods)

> A **TimeSlot** instance manages one labled event for any number of days. Each day is represented by a **Slot** object, which has three fields: 1) begin\_at, end\_at, and label. A time slot keeps a list of  these slots where there is one slot for each day including its start time and end time and the days for the times in between. Intially, a **TimeSlot** is initialized with each **Slot** having a being\_at time which is the offset of **TimeSlot** start time from midnight of its first day the the start of the day belonging to the **Slot**.  Individual slots may have their times adjusted. Individual slots may be removed or added for a particulary day. 

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


#### *TimeLine* <u>Constructor</u>

> Sets up the data structure for a line line. The configuration provides fields for the window size and for a number of functions which server to get and send the timeline and the month data structure. The kind of producers and consumers of the data structure is not determined. The parameters to the methods that call on them are required for operation. 
> 

Here is a list of definitions for the methods that should be supplied with the configuration.

* **month\_sender**
* **month\_fetcher**
* **time\_line\_fetcher**
* **time\_line\_sender**
* **conflict\_publisher**

#### *TimeLine* <u>injest month</u>

> Given a start time for a month, this method will either create or locate a data structure. If the month was not previously fetched, the month will be fetched with the month fetcher method.

#### *TimeLine* <u>scrol right</u>

> Moves the window to the right (future time). If the the window size is full, the left more (least time) window will be cut out of the window list. (*Note*: the month data structure may still be within a map of previously fetched months depending on aging out and other space management strategies.) Every new month appearing in the window will be injested.

#### *TimeLine* <u>scroll left</u>

> Moves the window to the left (past time). If the the window size is full, the right more (greates time) window will be cut out of the window list. (*Note*: the month data structure may still be within a map of previously fetched months depending on aging out and other space management strategies.) Every new month appearing in the window will be injested.

#### *TimeLine* <u>remove slot everywhere</u>

> A time slot appearing wihin a day agenda in a month in the timeline window may be removed from the data base accessible via the configured methods. The slot will be removed in entirety. That is, given the slot has a time span greater than the timeline window, the entire span will be removed independent of what is in the window. (Note: this extent of this removal is up to the database application; however, this may be a recommendation that the database application removes the event in full.)

#### *TimeLine* <u>save time list</u>

> The time list will be sent to any consumer of the data structures provided by this module by calling time\_line\_sender found in the configuration. If the parameter do\_send\_months is set to true, the months will be sent as well with the methods send\_months.

### TimeSlot Methods

* [`constructor(label,use_case,start_time,end_time,break_apart,importance,weekends,daily_dur)`](#timeslot-constructor)
* [`get_range(start_time,end_time)`](#timeslot-get-range)
* [`merge_with(a_time_slot)`](#timeslot-merge-with)
* [`set_one_begining(index,a_time)`](#timeslot-set-one-begining)
* [`set_one_ending(index,a_time)`](#timeslot-set-one-ending)
* [`merge_with(a_time_slot)`](#timeslot-merge-with)
* [`grow_sooner_days(num_days)`](#timeslot-grow-sooner-days)
* [`split(start_of_split,end_of_split)`](#timeslot-split)
* [`shift_slots(delta)`](#timeslot-shift-slots)
* [`drop_by_pattern(pat_fun)`](#timeslot-drop-by-pattern)
* [`merge_with_overlap(a_time_slot)`](#timeslot-merge-with-overlap)



#### *TimeSlot* <u>Constructor</u>

> Creates the each\_day list with a Slot for each day. Each Slot will have a begin\_at time which is set to the preceding midnight plus the difference between the first midnight and the start time passed to the constructor.  Each Slot will have an end\_at time which is the slots start time plus the constructor parameter daily\_dur.
> 
> The label is determined by the application. The use\_case parameter is determind by the application as well. However, a few use_cases are provided in case the application want to use them. They are the following:
>
>* `TimeSLot.USE_AS_BLOCK`
>* `TimeSLot.USE_AS_MEET`
>* `TimeSLot.USE_AS_ACTIVITY`
>* `TimeSLot.USE_AS_OPEN`
>

#### *TimeSlot* <u>get range</u>

> Takes parameters start\_time and end\_time. This returns a list of slots from within the range.

#### *TimeSlot* <u>merge with</u>

> Takes parameters start\_time and end\_time. This returns a list of slots from within the range.


#### *TimeSlot* <u>set one beginning</u>

> Takes the index of the slot in the list each\_day. Sets the start time, start\_at, of the Slot for that index.

#### *TimeSlot* <u>set one ending</u>

> Takes the index of the slot in the list each\_day. Sets the end time, end\_at,  of the Slot for that index.


#### *TimeSlot* <u>merge with</u>

> Given another time slot as a parameter, puts all the events of that time slot into the each\_day list of the calling TimeSlot. If there is a space in time between then, then each day inbetween is generated with the start\_at and end_\at relative times in terms of the last Slot in the each\_day list of the calling slot. This discards the overlap of days, keeping the days of the calling TimeSlot.

#### *TimeSlot* <u>grow sooner days</u>

>Prepends the list, each\_day, with the copies of the first day of the list for the number of days specified in the parameter.

#### *TimeSlot* <u>grow later days</u>

>Appends the list, each\_day, with the copies of the last day of the list for the number of days specified in the parameter.


#### *TimeSlot* <u>grow later days</u>

>Appends the list, each\_day, with the copies of the last day of the list for the number of days specified in the parameter.


#### *TimeSlot* <u>split</u>

>Splits a TimeSlot into two TimeSlots and returns them. If the times `start_of_split` and `end_of_split`, cover a spot in the middle of the TimeSlot's original expanse two new TimeSlots are returned as a pair `[earlier,later]`.  If the times cut off the a section at the beginning, then earlier of the pair will be false. If the end is cut off, then later of the pair will be false.


#### *TimeSlot* <u>merge with overlap</u>

>Given a TimeSlot parameter, appends all the Slots of the given TimeSlot to the calling TimeSlot and then sorst the result each\_day list by start time.

#### *TimeSlot* <u>shift slots</u>

>The parameter to this method is a time delta which is added both to the `begin_at` and the `end_at` fields of every Slot in the eadh\_day list.

#### *TimeSlot* <u>drop by pattern</u>

> The parameter to this method is a function (lambda) returning true if a given slot matches a pattern, false otherwise. The lambda parameter is passed to the JavaScript Array.filter method. 



### TimeSlotAgenda Methods

* [`constructor(day,index)`](#timeslotagenda-constructor)
* [`set_start_and_end(st,et)`](#timeslotagenda-set-start-and-end)
* [`add_slot(a_slot)`](#timeslotagenda-add-slot)
* [`find_slot(start_time)`](#timeslotagenda-find-slot)
* [`remove_slot(start_time)`](#timeslotagenda-remove-slot)
* [`add_all_slots(slot_list)`](#timeslotagenda-add-all-slots)


#### *TimeSlotAgenda* <u>Constructor</u>

> The day and index parameters correspond to day and index parametes required by the npm package, calendar-es6. In particular, the method getMap, constructs objects such as a TimeSlotAgenda. The constructor sets start time and end times to inifity values. A call to `set_start_and_end` will set the time to be the for the day specified by an application. Typically, this the times are midnight the previous day and at the end of the day. 

#### *TimeSlotAgenda* <u>set-start-and-end</u>

> The application sets the start and end times for the agenda, wich limits the slots that may be placed into it.

#### *TimeSlotAgenda* <u>add slot</u>

> This method expects a Slot object which may be obtained from a TimeSlot. The Slot may only be added if it does not conflict with pre-existing TimeSlots in the TimeSlotAgenda list all\_day.
> 
> If this conflicts are found, this method will return a list of conflicting Slots.

#### *TimeSlotAgenda* <u>find slot</u>

> Given a time, this will look into the list, all\_day and search for an event that either starts with the time or includes the time. (Note: a very small amount of extra time is needed to search for inclusive times.)
> 
> The method returns the slot if it is found false otherwise.
 

#### *TimeSlotAgenda* <u>remove slot</u>

>This method takes a Slot as its parameter. The slot will be removed from its lists.

#### *TimeSlotAgenda* <u>add_all slots</u>

>Given a list of Slots, this method will attempt to add all of them to the list, all\_day. This method acrues the list of conflicts for each Slot in the parameter list and returns final list. It will add the Slots for which there is no conflict.

### MonthContainer Methods

* [`constructor(start_time)`](#monthcontainer-constructor)
* [`get_day_agenda(indx)`](#monthcontainer-get-day-agenda)
* [`add_agenda_list(day_agenda)`](#monthcontainer-add-agenda-list)
* [`add_time_slot(a_t_slot)`](#monthcontainer-add-time-slot)
* [`remove_time_slot(start_time)`](#monthcontainer-remove-time-slot)
* [`remove_all_of_time_slot(a_t_slot)`](#monthcontainer-remove=-all-of-time-slot)

#### *MonthContainer* <u>Constructor</u>

> The MonthContainer constructor takes a parameter that may either be a timestamp, such as the one returbed by Date.now(), or it may take a list (array) of parametes corresponding to the parameters for new Date(...parameters).
> 
> This constructor calls upon the methods of the npm package '`calendar-es6`. It creates the month data structure needed for the MonthContainer's bookkeeping.


#### *MonthContainer* <u>get day agenda</u>

>Given an index of a day into the MonthCatainer's cal.list of day keys, this method returns a TimeSlotAgenda for the given day.

#### *MonthContainer* <u>add agenda list</u>

> Given a TimeSlotAgenda with Slots in its list, all\_day, this method attempts to put all the Slots into the all\_day list of the TimeSlotAgenda mapped to the same day as that of the parameter. All Slots are added unless there are conflicsts. A list of conflicts is returned. 

#### *MonthContainer* <u>add time slot</u>

> This method, given a TimeSlot, adds all the Slots of each day that match a day in the MonthContainer

#### *MonthContainer* <u>remove time slot</u>

>This method removes all the slots from the MonthContainer that match the begin\_at times of the Slots matching the timestamp passed in the parameter. This method removes the slots from the TimeSlotAgendas in the the map of days belonging to the MonthContainer. Usually just one Slot matches the timestamp.

#### *MonthContainer* <u>remove all of time slot</u>

> This method removes all slots from a MonthContainer that match with Slot begin\_at times belonging to the Slots stored in the TimeSlot each\_day list.
> 

## Customization

There are a few classes that may be basic to an application's information storage requirements. These are the following:

* **Slot**
* **TimeSlotAgenda**

These classes offer basic fields and methods for their use within the context of MonthContainers and TimeLines.

By extending these classes, an application can store all the information needed to fit its requirements. The extending class can be passed as a last parameter to constructors. Passing the last parameter will provide the use of the extending class only if it actually extends the classes. The constructors default to the basic verion if the classes passed are not descendants of these classes. 

For example, an application can extend a Slot:

```
import {EventDays} from 'event-days'

const Slot = EventDays.Slot

class SpecialSlot extends Slot {
	constructor(label,start_time,end_time) {
		super(label,start_time,end_time)
		
		this.special_field = "special value"
	}
}

```

Next, the SpecialSlot class can be used in the creation of a TimeSlot.

```
const TimeSlot = EventDays. TimeSlot

let a_t_slot = new TimeSlot("label", TimeSLot.USE_AS_OPEN,
                              start_time, end_time, false, 1.0, false,
                              daily_dur, false, SpecialSlot)
```