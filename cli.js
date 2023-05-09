#!/usr/bin/env node

import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));

const help_text = `Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n \
    -h            Show this help message and exit.\n \
    -n, -s        Latitude: N positive; S negative.\n \
    -e, -w        Longitude: E positive; W negative.\n \
    -z            Time zone: uses tz.guess() from moment-timezone by default.\n \
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n \
    -j            Echo pretty JSON from open-meteo API and exit.`

const help = args.h;
const json = args.j;
const timezone = args.z || moment.tz.guess();
const latitude = args.n || args.s * -1;
const longitude = args.e || args.w * -1;

var num_day;
if (args.d === undefined) {
	num_day = 1;
} else if (args.d === 0) {
	num_day = 0;
} else {
	num_day = args.d;
}

const URL = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&current_weather=true&timezone=' + timezone;
const response = await fetch(URL);
const data = await response.json();

function weather(data) {
	var date_log;
	if (num_day == 0) {
		date_log = " today.";
	} else if (num_day > 1) {
		date_log = ` in ${num_day} days.`;
	} else {
		
        date_log = " tomorrow.";
	}

	const precipitation = data.daily.precipitation_hours;	
	if (precipitation[num_day] >= 1) {
		console.log("You might need your galoshes" + date_log);
	} else {
		console.log("You will not need your galoshes" + date_log);
	}
}

if (help) {
	console.log(help_text);
	process.exit(0);
} else if (json) {
	console.log(data);
	process.exit(0);
} else {
	weather(data);
}