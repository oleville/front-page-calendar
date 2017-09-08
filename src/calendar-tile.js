import React, { Component } from 'react'
import moment from 'moment-timezone'
import './calendar-tile.css'

// A list of the days of the week, so that we can tell the user that rather than the date (easier to read)
const DAYS_OF_WEEK = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday'
	]

class CalendarTile extends Component {
	state = {
		startDate: null,
		endDate: null,
		startTime: null,
		endTime: null,
		today: false,
		tomorrow: false,
		now: moment(),
		loading: true
	}

	// Is the event today?
	isToday(m) {
		return m.isSame(this.state.now.clone().startOf('day'), 'd')
	}

	// Is the event tomorrow?
	isTomorrow(m) {
		return m.isSame(this.state.now.clone().add(1, 'days').startOf('day'), 'd')
	}

	// If the event is over 1 week away, we want to tell the user the actual date, rather than the day of week.
	isOverOneWeek(m) {
		return m.isAfter(this.state.now.clone().add(7, 'days').startOf('day'), 'd')
	}

	componentWillMount() {
		// Compute information about this event
		const startMoment = moment(this.props.startTime)
		const endMoment = moment(this.props.endTime)
		const tDay = this.isToday(startMoment)
		const tmrDay = this.isTomorrow(startMoment)
		const overOneWeek = this.isOverOneWeek(startMoment)

		this.setState({
			startDate: !overOneWeek ? DAYS_OF_WEEK[startMoment.day()+1] : startMoment.format('MMM Do'),
			endDate: DAYS_OF_WEEK[startMoment.day()],
			startTime: `${startMoment.format('h:mmA')}`,
			endTime: `${endMoment.format('h:mmA')}`,
			today: tDay,
			tomorrow: tmrDay,
			loading: false
		})
	}

	render() {
			if (this.state.loading) {
				return
			}

			return (
				<div className="calendar-tile">
					<h1 className="bold calendar-dow">{this.state.today ? 'Today' : (this.state.tomorrow ? 'Tomorrow' : this.state.startDate)} </h1>
					<h2 className="font calendar-title">{this.props.title}</h2>
					<p className="font calendar-loc">{this.props.location}</p>
					<p className="font calendar-time">{this.state.startTime} - {this.state.endTime}</p>
				</div>
			)
	}
}

export default CalendarTile
