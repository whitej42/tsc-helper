# TSCTools

A side project for Train Simulator Classic scenario builders.

TSCTools is built to make Train Simulator Classic scenario building a little less painful. In one place you'll find destination board codes, a headcode generator, route and line information, and a live TfL and National Rail status board. Everything you'd otherwise spend forty minutes hunting across six different forum threads and a PDF from 2009.

**[tsctools.co.uk](https://tsctools.co.uk)**

---

## Features

- **Destination Boards** — Look up destination board codes by locomotive class. No more cross-referencing spreadsheets, forum posts, or that one wiki page that hasn't been updated since 2014.
- **Headcode Generator** — Generate authentic UK rail headcodes for your services. Gets the format right so you don't have to think about it.
- **Live Status Board** — Real-time TfL and National Rail service status. Technically useful for scenario inspiration. Mostly just fun to have.
- **Routes** *(coming soon)* — Browse route and line information to help build more believable services.
- **Guides** *(coming soon)* — Tips, notes, and the occasional rabbit hole for scenario builders.

---

## What's coming (when I find the time)

No promises, no roadmap, no board. Just a list of things I'd like to build eventually:

- Expanded destination code coverage across more locomotive classes and eras
- Saved / favourited headcodes so you don't have to regenerate the same ones every session
- A proper scenario checklist — stock, headcodes, destinations, consists, all in one place
- More route detail, including historical timetable data for period-accurate scenarios
- Maybe a consist builder. We'll see.

---

## A note on UK-centricity

Yes, this site is entirely focused on UK rail. The destination board codes, the headcodes, the routes, the live status — all of it is very much a British problem for British trains. It is a .co.uk site, so really you were warned at the URL.

---

## Getting Started

```bash
git clone https://github.com/whitej42/ts-dest-codes.git
cd ts-dest-codes
npm install
npm start
```

Built with React. Live data sourced from the [Unified TfL API](https://api-portal.tfl.gov.uk/apis).
