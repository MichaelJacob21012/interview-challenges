const { groupEventsByDay, moveEventToDay } = require('./events');

var testEvent = {
  id: 101,
  startsAt: '2021-01-27T10:01:11Z',
  endsAt: '2021-01-27T15:01:11Z',
  title: 'Daily walk',
};

var testEvent2 = {
  id: 102,
  startsAt: '2021-01-27T14:01:11Z',
  endsAt: '2021-01-27T15:01:11Z',
  title: 'Daily walk',
};

var testEvent3 = {
  id: 103,
  startsAt: '2021-01-28T16:01:11Z',
  endsAt: '2021-01-28T19:01:11Z',
  title: 'Daily walk',
};

var testEvent4 = {
  id: 104,
  startsAt: '2021-01-29T13:01:11Z',
  endsAt: '2021-01-29T15:01:11Z',
  title: 'Daily walk',
};

var testEvent5 = {
  id: 105,
  startsAt: '2021-01-29T13:01:11Z',
  endsAt: '2021-01-29T15:01:11Z',
  title: 'Daily walk',
};

var testEvent6 = {
  id: 106,
  startsAt: '2021-01-31T10:01:11Z',
  endsAt: '2021-01-31T15:01:11Z',
  title: 'Daily walk',
};

var testEvent7 = {
  id: 107,
  startsAt: '2021-01-27T12:01:11Z',
  endsAt: '2021-01-27T15:01:11Z',
  title: 'Daily walk',
};

const testEventsGroup1 = [];
const testEventsGroup2 = [];
const testEventsGroup3 = [];
const testEventsGroup4 = [];
const testEventsGroup5 = [];
const testEventsGroup6 = [];
const testEventsGroup7 = [];
testEventsGroup1.push(testEvent);
testEventsGroup1.push(testEvent2);
testEventsGroup1.push(testEvent3);
testEventsGroup1.push(testEvent4);

testEventsGroup2.push(testEvent4);
testEventsGroup2.push(testEvent3);
testEventsGroup2.push(testEvent);
testEventsGroup2.push(testEvent2);

testEventsGroup3.push(testEvent2);
testEventsGroup3.push(testEvent);
testEventsGroup3.push(testEvent3);
testEventsGroup3.push(testEvent4);

testEventsGroup4.push(testEvent4);
testEventsGroup4.push(testEvent3);
testEventsGroup4.push(testEvent2);
testEventsGroup4.push(testEvent);

testEventsGroup5.push(testEvent);
testEventsGroup5.push(testEvent2);
testEventsGroup5.push(testEvent3);
testEventsGroup5.push(testEvent5);
testEventsGroup5.push(testEvent4);

testEventsGroup6.push(testEvent);
testEventsGroup6.push(testEvent2);
testEventsGroup6.push(testEvent3);
testEventsGroup6.push(testEvent4);
testEventsGroup6.push(testEvent6);

testEventsGroup7.push(testEvent);
testEventsGroup7.push(testEvent2);
testEventsGroup7.push(testEvent3);
testEventsGroup7.push(testEvent4);
testEventsGroup7.push(testEvent7);

describe('groupEventsByDay', () => {
  test('groupEventsByDay basic test', () => {
    var result = groupEventsByDay(testEventsGroup1);
    expect(result).toStrictEqual({
      0: [testEvent, testEvent2],
      1: [testEvent3],
      2: [testEvent4],
    });
  });

  test('groupEventsByDay unordered groups', () => {
    var result = groupEventsByDay(testEventsGroup2);
    expect(result).toStrictEqual({
      0: [testEvent, testEvent2],
      1: [testEvent3],
      2: [testEvent4],
    });
  });

  test('groupEventsByDay unordered events', () => {
    var result = groupEventsByDay(testEventsGroup3);
    expect(result).toStrictEqual({
      0: [testEvent, testEvent2],
      1: [testEvent3],
      2: [testEvent4],
    });
  });

  test('groupEventsByDay unordered everything', () => {
    var result = groupEventsByDay(testEventsGroup4);
    expect(result).toStrictEqual({
      0: [testEvent, testEvent2],
      1: [testEvent3],
      2: [testEvent4],
    });
  });

  test('groupEventsByDay same time', () => {
    var result = groupEventsByDay(testEventsGroup5);
    expect(result).toStrictEqual({
      0: [testEvent, testEvent2],
      1: [testEvent3],
      2: [testEvent5, testEvent4],
    });
  });

  test('groupEventsByDay missing days', () => {
    var result = groupEventsByDay(testEventsGroup6);
    expect(result).toStrictEqual({
      0: [testEvent, testEvent2],
      1: [testEvent3],
      2: [testEvent4],
      4: [testEvent6],
    });
  });

  test('groupEventsByDay function exists', () => {
    expect(typeof groupEventsByDay).toEqual('function');
  });
});

describe('moveEvent', () => {
  test('moveEvent basic test', () => {
    var result = groupEventsByDay(testEventsGroup1);
    var result2 = moveEventToDay(result, 101, 2);
    expect(result).toStrictEqual({
      0: [testEvent, testEvent2],
      1: [testEvent3],
      2: [testEvent4],
    });

    expect(result2).toStrictEqual({
      0: [testEvent2],
      1: [testEvent3],
      2: [
        {
          id: 101,
          startsAt: '2021-01-29T10:01:11Z',
          endsAt: '2021-01-29T15:01:11Z',
          title: 'Daily walk',
        },
        testEvent4,
      ],
    });
  });
  test('moveEvent new group at the end', () => {
    var result = groupEventsByDay(testEventsGroup1);
    var result2 = moveEventToDay(result, 101, 4);
    expect(result2).toStrictEqual({
      0: [testEvent2],
      1: [testEvent3],
      2: [testEvent4],
      4: [
        {
          id: 101,
          startsAt: '2021-01-31T10:01:11Z',
          endsAt: '2021-01-31T15:01:11Z',
          title: 'Daily walk',
        },
      ],
    });
  });
  test('moveEvent new group at the beginning', () => {
    var result = groupEventsByDay(testEventsGroup6);
    var result2 = moveEventToDay(result, 101, -1);
    expect(result2).toStrictEqual({
      0: [
        {
          id: 101,
          startsAt: '2021-01-26T10:01:11Z',
          endsAt: '2021-01-26T15:01:11Z',
          title: 'Daily walk',
        },
      ],
      1: [testEvent2],
      2: [testEvent3],
      3: [testEvent4],
      5: [testEvent6],
    });
  });
  test('moveEvent new group in the middle', () => {
    var result = groupEventsByDay(testEventsGroup6);
    var result2 = moveEventToDay(result, 101, 3);
    expect(result2).toStrictEqual({
      0: [testEvent2],
      1: [testEvent3],
      2: [testEvent4],
      3: [
        {
          id: 101,
          startsAt: '2021-01-30T10:01:11Z',
          endsAt: '2021-01-30T15:01:11Z',
          title: 'Daily walk',
        },
      ],
      4: [testEvent6],
    });
  });
  test('moveEvent empty a group', () => {
    var result = groupEventsByDay(testEventsGroup1);
    var result2 = moveEventToDay(result, 103, 0);
    expect(result2).toStrictEqual({
      0: [
        testEvent,
        testEvent2,
        {
          id: 103,
          startsAt: '2021-01-27T16:01:11Z',
          endsAt: '2021-01-27T19:01:11Z',
          title: 'Daily walk',
        },
      ],
      2: [testEvent4],
    });
  });
  test('moveEvent empty the first group', () => {
    var result = groupEventsByDay(testEventsGroup1);
    var result2 = moveEventToDay(result, 101, 1);
    var result3 = moveEventToDay(result2, 102, 1);
    expect(result3).toStrictEqual({
      0: [
        {
          id: 101,
          startsAt: '2021-01-28T10:01:11Z',
          endsAt: '2021-01-28T15:01:11Z',
          title: 'Daily walk',
        },
        {
          id: 102,
          startsAt: '2021-01-28T14:01:11Z',
          endsAt: '2021-01-28T15:01:11Z',
          title: 'Daily walk',
        },
        testEvent3,
      ],
      1: [testEvent4],
    });
    var result4 = moveEventToDay(result, 101, 1);
    var result5 = moveEventToDay(result4, 102, 2);
    expect(result5).toStrictEqual({
      0: [
        {
          id: 101,
          startsAt: '2021-01-28T10:01:11Z',
          endsAt: '2021-01-28T15:01:11Z',
          title: 'Daily walk',
        },
        testEvent3,
      ],
      1: [
        testEvent4,
        {
          id: 102,
          startsAt: '2021-01-29T14:01:11Z',
          endsAt: '2021-01-29T15:01:11Z',
          title: 'Daily walk',
        },
      ],
    });
  });
  test('moveEvent earliest in new group', () => {
    var result = groupEventsByDay(testEventsGroup1);
    var result2 = moveEventToDay(result, 101, 1);
    expect(result2).toStrictEqual({
      0: [testEvent2],
      1: [
        {
          id: 101,
          startsAt: '2021-01-28T10:01:11Z',
          endsAt: '2021-01-28T15:01:11Z',
          title: 'Daily walk',
        },
        testEvent3,
      ],
      2: [testEvent4],
    });
  });
  test('moveEvent middle in new group', () => {
    var result = groupEventsByDay(testEventsGroup1);
    var result2 = moveEventToDay(result, 104, 0);
    expect(result2).toStrictEqual({
      0: [
        testEvent,
        {
          id: 104,
          startsAt: '2021-01-27T13:01:11Z',
          endsAt: '2021-01-27T15:01:11Z',
          title: 'Daily walk',
        },
        testEvent2,
      ],
      1: [testEvent3],
    });
  });
  test('moveEvent last in new group', () => {
    var result = groupEventsByDay(testEventsGroup1);
    var result2 = moveEventToDay(result, 103, 0);
    expect(result2).toStrictEqual({
      0: [
        testEvent,
        testEvent2,
        {
          id: 103,
          startsAt: '2021-01-27T16:01:11Z',
          endsAt: '2021-01-27T19:01:11Z',
          title: 'Daily walk',
        },
      ],
      2: [testEvent4],
    });
  });
  test('moveEvent earliest in old group', () => {
    var result = groupEventsByDay(testEventsGroup7);
    var result2 = moveEventToDay(result, 101, 1);
    expect(result2).toStrictEqual({
      0: [testEvent7, testEvent2],
      1: [
        {
          id: 101,
          startsAt: '2021-01-28T10:01:11Z',
          endsAt: '2021-01-28T15:01:11Z',
          title: 'Daily walk',
        },
        testEvent3,
      ],
      2: [testEvent4],
    });
  });
  test('moveEvent middle in old group', () => {
    var result = groupEventsByDay(testEventsGroup7);
    var result2 = moveEventToDay(result, 107, 1);
    expect(result2).toStrictEqual({
      0: [testEvent, testEvent2],
      1: [
        {
          id: 107,
          startsAt: '2021-01-28T12:01:11Z',
          endsAt: '2021-01-28T15:01:11Z',
          title: 'Daily walk',
        },
        testEvent3,
      ],
      2: [testEvent4],
    });
  });
  test('moveEvent last in old group', () => {
    var result = groupEventsByDay(testEventsGroup7);
    var result2 = moveEventToDay(result, 102, 1);
    expect(result2).toStrictEqual({
      0: [testEvent, testEvent7],
      1: [
        {
          id: 102,
          startsAt: '2021-01-28T14:01:11Z',
          endsAt: '2021-01-28T15:01:11Z',
          title: 'Daily walk',
        },
        testEvent3,
      ],
      2: [testEvent4],
    });
  });
});
