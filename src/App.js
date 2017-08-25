import React, { Component } from 'react'
import moment from 'moment-timezone'
import qs from 'querystring'
import CalendarTile from './calendar-tile'
import './App.css'

const TIMEZONE = 'America/Winnipeg'
const GOOGLE_CALENDAR_API_KEY = 'AIzaSyBc_UI5aaMwTPmfut2rEK_2ElOfpZp-wQI'
const CALENDAR_ID = 'stolaf.edu_fvulqo4larnslel75740vglvko@group.calendar.google.com'

class App extends Component {
	state = {
		events: [],
		loaded: false,
		error: null,
		now: moment.tz(TIMEZONE)
	}

	componentWillMount() {
		this.refresh()
	}

	buildCalendarUrl(calendarId: string) {
		let calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`
		let params = {
			maxResults: 5,
			orderBy: 'startTime',
			showDeleted: false,
			singleEvents: true,
			timeMin: new Date().toISOString(),
			key: GOOGLE_CALENDAR_API_KEY,
		}
		return `${calendarUrl}?${qs.stringify(params)}`
	}

	convertEvents(data, now) {
		return data.map(event => {
			const startTime = moment(event.start.date || event.start.dateTime)
			const endTime = moment(event.end.date || event.end.dateTime)
			return {
				startTime,
				endTime,
				summary: event.summary || '',
				location: event.location || '',
				isOngoing: startTime.isBefore(now, 'day'),
				extra: {type: 'google', data: event},
			}
		})
	}

	getEvents = async (now = moment.tz(TIMEZONE)) => {
		let url = this.buildCalendarUrl(CALENDAR_ID)

		let data = []
		try {
			let result = await fetch(url)
				.then((res) => {
					return res.json()
				})
			const error = result.error
			if (error) {
				this.setState({error: error})
			}

			data = result.items
		} catch (err) {
			this.setState({error: err.message})
			console.warn(err)
		}

		this.setState({
			loaded: true,
			events: this.convertEvents(data, now),
		})
	}

	refresh = async () => {
		let start = Date.now()
		this.setState({refreshing: true})

		await this.getEvents()

		this.setState({refreshing: false})
	}

	render() {
		if (!this.state.loaded) {
			return null
		}

		console.log(this.state.events)
		return (
				<div>
					{this.state.events.map((eventInfo) => {
						return <CalendarTile
							location={eventInfo.location}
							title={eventInfo.summary}
							startTime={eventInfo.startTime}
							endTime={eventInfo.endTime}
						/>
					})}

				</div>
		)
	}
}

export default App
