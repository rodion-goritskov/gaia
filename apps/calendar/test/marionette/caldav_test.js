'use strict';

var Calendar = require('./lib/calendar'),
    Radicale = require('./lib/radicale'),
    assert = require('chai').assert,
    dateFormat = require('dateformat');

var ACCOUNT_USERNAME = 'firefox-os',
    TITLE = 'Go for a dream',
    DATE_PATTERN = 'yyyymmdd"T"HHMMssZ';

marionette('configure CalDAV accounts', function() {
  var client = marionette.client(),
      serverHelper = new Radicale(),
      app = null;

  setup(function(done) {
    app = new Calendar(client);
    app.launch({ hideSwipeHint: true });

    serverHelper.start(null, function(port) {
      var accountUrl = 'http://localhost:' + port + '/' + ACCOUNT_USERNAME,
          startDate = new Date(),
          endDate = new Date(),
          event = {};

      app.createCalDavAccount({
        user: ACCOUNT_USERNAME,
        fullUrl: accountUrl
      });

      // Make sure we have a event item
      // in the top of event-list view in month view.
      startDate.setMinutes(0);
      endDate.setMinutes(59);
      event = {
        startDate: dateFormat(startDate, DATE_PATTERN),
        endDate: dateFormat(endDate, DATE_PATTERN),
        title: TITLE
      };
      serverHelper.addEvent(ACCOUNT_USERNAME, event);

      app.syncCalendar();
      // Make sure we start the server before the setup is ended.
      done();
    });
  });

  teardown(function(done) {
    // No matter how, we close the server in the end.
    try {
      serverHelper.removeAllEvents();
    } catch (error) {
      console.error(error.message);
    } finally {
      serverHelper.close(done);
    }
  });

  test('should show a event', function() {
    var event = app.monthDay.events[0];

    // Scroll so that the first one is in view and click it.
    app.monthDay.scrollToEvent(event);
    event.click();

    assertEvent(ACCOUNT_USERNAME, TITLE);
  });

  function assertEvent(username, title) {
    app.readEvent.waitForDisplay();

    assert.deepEqual(
      app.readEvent.title,
      title,
      'event should have correct title'
    );
    // Make sure the event is created in the CalDAV username.
    assert.deepEqual(
      app.readEvent.calendar,
      username,
      'event should be created by the correct user'
    );
  }
});
