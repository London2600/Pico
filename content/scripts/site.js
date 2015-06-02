(function () {
    $.getJSON('/content/data/events.js', function (data) {
        var markup = '';
        data.events.sort(function (a, b) { return a.start_date.localeCompare(b.start_date); });
        for (var i = 0; i < Math.min(5, data.events.length); i ++) {
            var d = data.events[i];
            var date = new Date(d.start_date);
            markup += '<li>' + date.toDateString() + ' - <a href="' + d.url + '">' + d.name + '</a> - <em>' + d.location + '</em></li>';
        }
        markup = '<ul>' + markup + '</ul>';
        $('#events').html(markup);
    });
}) ();
