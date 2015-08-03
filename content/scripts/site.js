(function () {
    var nextMeetDate = new Date();
    nextMeetDate.setHours(18, 30, 0, 0);
    while (nextMeetDate.getDay() != 5)
        nextMeetDate.setDate(nextMeetDate.getDate() + 1);
    while (nextMeetDate.getDate() > 7)
        nextMeetDate.setDate(nextMeetDate.getDate() + 7);
    $(function () {
        $('#nextmeet span').html(nextMeetDate.toLocaleString());
    });
}) ();
