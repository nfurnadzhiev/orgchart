import React, { Component } from 'react'
import PeopleData from './data/people.json'

class PostData extends Component {
	render () {
		return (
			<div >
				<h1>Org chart</h1>
				{PeopleData.map((data, index)=>{
					return <h1>{data.name}</h1>
				})}
			</div>
		)
	}
}

export default PostData