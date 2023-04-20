const reminder = function(string) {
    const dateInput = new Date(2023, 3, 24, 20, 40);
    const curDate = new Date()

    if (dateInput.getTime() === curDate.getTime()) {
        // console.log('rabotaeb');
    } else {
        // console.log('ne rabotaet');
    }
    // console.log(dateInput);
    // console.log(curDate);
}

export default reminder;