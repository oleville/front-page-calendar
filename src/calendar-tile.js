import React, { Component } from 'react'
import moment from 'moment-timezone'

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

	isToday(m) {
		return m.isSame(this.state.now.clone().startOf('day'), 'd')
	}

	isTomorrow(m) {
		return m.isSame(this.state.now.clone().add(1, 'days').startOf('day'), 'd')
	}

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
			startDate: !overOneWeek ? DAYS_OF_WEEK[startMoment.day()] : startMoment.format('MMM Do'),
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

			console.log(this.state.today ? 'Today' : (this.state.tomorrow ? 'Tomorrow' : this.state.startDate))
			return (
				<div>
					<h1>{this.state.today ? 'Today' : (this.state.tomorrow ? 'Tomorrow' : this.state.startDate)} </h1>
					<h2>{this.props.title}</h2>
					<h3>{this.props.location}</h3>
					<p>{this.state.startTime} - {this.state.endTime}</p>
				</div>
			)
	}
}

export default CalendarTile
