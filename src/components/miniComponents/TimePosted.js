import React from 'react'

function sortTime(time) {
    if (time.length > 5) {
        return time;
    }
    var curr_time = new Date().getTime();
    var time_diff = (((curr_time - time) / 1000) / 60).toFixed(0);
    if ((time_diff / 60) >= 24) {
        time = ((time_diff / 60) / 24).toFixed(0) + " days ago";
    } else {
        time = (time_diff / 60).toFixed(0) + " Hours ago";
    }
    // } else {
    //     time = time_diff + " Minutes ago";
    // }
    return time;
}

function TimePosted(props) {
    const { time } = props;
    console.log(time);
    // console.log(time);
    return (
        <h4 class={props.className}>{sortTime(time)}</h4>
    )
}

export default TimePosted