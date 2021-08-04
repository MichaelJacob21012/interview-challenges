const moment = require('moment');
/**
  An event could look like this:
  ```
  {
    id: 107,
    startsAt: '2021-01-27T13:01:11Z',
    endsAt: '2021-01-27T15:01:11Z',
    title: 'Daily walk',
  }
  ```
*/

/**
  Take an array of events and return an object that is a  mapping from the 'day' to the events occuring on that day.
  The keys should be the day-difference to the earliest occuring event.
  Each days events should be sorted in ascending order of startsAt

  A result could look like:
  ```
  {
    0: [
      { id: 106, startsAt: '2021-01-27T13:01:11Z',  endsAt: '2021-01-27T15:01:11Z',  title: 'Daily walk' },
      { id: 156, startsAt: '2021-01-27T17:01:11Z',  endsAt: '2021-01-27T22:01:11Z',  title: 'Dinner' },
    ],
    2: [
      { id: 5676, startsAt: '2021-01-29T13:01:11Z',  endsAt: '2021-01-29T15:01:11Z',  title: 'Daily walk' },
    ]
  }
 ```

 Your solution should not modify any of the function arguments
*/
// Group a list of events with the day as the key
// Returns the grouped object
const groupEvents = (events) => {
  var groupedEvents = events.reduce(function (grouped, ungrouped) {
    grouped[ungrouped.startsAt.split('T')[0]] =
      grouped[ungrouped.startsAt.split('T')[0]] || [];
    grouped[ungrouped.startsAt.split('T')[0]].push(ungrouped);
    return grouped;
  }, {});
  return groupedEvents;
};

// Sort the events within a day in ascending order of startsAt
// Returns the sorted array
const sortEvents = (events) => {
  var sorted = events.sort(function (event1, event2) {
    var sort =
      moment(event1.startsAt, moment.ISO_8601) <
      moment(event2.startsAt, moment.ISO_8601)
        ? -1
        : 1;
    return sort;
  });
  return sorted;
};

// Sort the events within each group in ascending order of startsAt
const sortAllEvents = function (groups) {
  Object.keys(groups).forEach(function (key) {
    groups[key] = sortEvents(groups[key]);
  });
};

// Sort the groups in ascending order of key
// Returns the sorted object
const sortGroups = function (groups) {
  var sortedGroups = Object.keys(groups)
    .sort()
    .reduce((obj, key) => {
      obj[key] = groups[key];
      return obj;
    }, {});
  return sortedGroups;
};

// Change the keys of the groups from date to
// the date difference from the earliest date
const setDiffsAsKeys = function (groups) {
  var earliestDate = moment(Object.keys(groups)[0], moment.ISO_8601);
  Object.keys(groups).forEach(function (date, index) {
    var dateDiff = moment(date, moment.ISO_8601).diff(earliestDate, 'days');
    Object.defineProperty(
      groups,
      dateDiff,
      Object.getOwnPropertyDescriptor(groups, date),
    );
    delete groups[date];
  });
};

const groupEventsByDay = (events) => {
  var copy = JSON.parse(JSON.stringify(events));
  var groupedEvents = groupEvents(copy);
  sortAllEvents(groupedEvents);
  var sortedGroups = sortGroups(groupedEvents);
  setDiffsAsKeys(sortedGroups);
  return sortedGroups;
};

/**
  Adjust the start and end date of an event so it maintains its total duration, but is moved `toDay`.
  `eventsByDay` should be the same as the return value of `groupEventsByDay`
  `id` will be the event that should be moved
  `toDay` will be a number that indicates the key of `eventsByDay` that the target event should be moved to

  Example:
  ```
  moveEventToDay(
    {
      0: [
        { id: 106, startsAt: '2021-01-27T13:01:11Z',  endsAt: '2021-01-27T15:01:11Z',  title: 'Daily walk' },
      ],
      2: [
        { id: 5676, startsAt: '2021-01-29T13:01:11Z',  endsAt: '2021-01-29T15:01:11Z',  title: 'Daily walk' },
      ]
    },
    5676,
    3,
  )
  ```
  Should return something like
  ```
  {
    0: [
      { id: 106, startsAt: '2021-01-27T13:01:11Z',  endsAt: '2021-01-27T15:01:11Z',  title: 'Daily walk' },
    ],
    3: [
      { id: 5676, startsAt: '2021-01-30T13:01:11Z',  endsAt: '2021-01-30T15:01:11Z',  title: 'Daily walk' },
    ]
  },
  ```

  Your solution should not modify any of the function arguments
*/
//Returns the event with its date difference as key
const findEvent = (eventsByDay, id) => {
  for (day in Object.keys(eventsByDay)) {
    for (const existingEvent of eventsByDay[day]) {
      if (existingEvent.id == id) {
        return { [day]: existingEvent };
      }
    }
  }
};

//Keeps track of whether the earliest group has just been emptied
var keysRecentlyChanged = false;

//Delete the event and removes its group if now empty
const deleteEvent = (eventsByDay, objectToDelete) => {
  const day = Object.keys(objectToDelete)[0];
  const eventToDelete = Object.values(objectToDelete)[0];
  var filtered = eventsByDay[day].filter((e) => e.id !== eventToDelete.id);
  eventsByDay[day] = filtered;
  if (filtered.length == 0) {
    delete eventsByDay[day];
    if (day == 0) {
      //adjust the keys for the new earliest date
      const earliest = Object.keys(eventsByDay)[0];
      Object.keys(eventsByDay).forEach(function (key, index) {
        Object.defineProperty(
          eventsByDay,
          key - earliest,
          Object.getOwnPropertyDescriptor(eventsByDay, key),
        );
        delete eventsByDay[key];
        keysRecentlyChanged = true;
      });
    }
  }
  return eventsByDay;
};

// Insert a new event into its correct place in the group
// Returns the updated group
const insertSort = (eventsOnDay, eventToAdd) => {
  var index = 0;
  for (existingEvent of eventsOnDay) {
    if (existingEvent.startsAt > eventToAdd.startsAt) {
      break;
    }
    index++;
  }
  eventsOnDay.splice(index, 0, eventToAdd);
  return eventsOnDay;
};

// Insert a new day into its correct place amongst the existing dates
// Returns the updated object
const insertSortDay = (eventsByDay, objectToAdd) => {
  const day = Object.keys(objectToAdd)[0];
  var index = 0;
  for (const [key, value] of Object.entries(eventsByDay)) {
    if (key > day) {
      break;
    }
    index++;
  }

  var entry = Object.entries(objectToAdd);
  var array = Object.entries(eventsByDay);
  array.splice(index, 0, ...entry);
  var toReturn = Object.fromEntries(array);
  if (day < 0) {
    //adjust keys to make the new entry the earliest with a key of zero
    for (var i = 0; i < array.length; i++) {
      array[i][0] -= day;
    }
  }
  return Object.fromEntries(array);
};

//Returns the updated object
const addEvent = (eventsByDay, objectToAdd, toDay) => {
  var oldDay = Object.keys(objectToAdd)[0];
  var eventToAdd = Object.values(objectToAdd)[0];
  var change = toDay - oldDay;
  eventToAdd.startsAt =
    moment(eventToAdd.startsAt, moment.ISO_8601)
      .add(change, 'days')
      .toISOString()
      .split('.')[0] + 'Z';
  eventToAdd.endsAt =
    moment(eventToAdd.endsAt, moment.ISO_8601)
      .add(change, 'days')
      .toISOString()
      .split('.')[0] + 'Z';
  if (keysRecentlyChanged) {
    toDay -= 1;
    keysRecentlyChanged = false;
  }
  updatedObject = { [toDay]: [eventToAdd] };
  if (!(toDay in eventsByDay)) {
    return insertSortDay(eventsByDay, updatedObject);
  }
  eventsOnDay = eventsByDay[toDay];
  updatedEvents = insertSort(eventsOnDay, Object.values(updatedObject)[0][0]);
  eventsByDay[toDay] = updatedEvents;
  return eventsByDay;
};

const moveEventToDay = (eventsByDay, id, toDay) => {
  var copy = JSON.parse(JSON.stringify(eventsByDay));
  var eventToMove = findEvent(copy, id);
  copy = deleteEvent(copy, eventToMove);
  copy = addEvent(copy, eventToMove, toDay);
  return copy;
};
module.exports = { groupEventsByDay, moveEventToDay };
