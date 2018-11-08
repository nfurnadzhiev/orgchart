import React, { Component } from "react";
import axios from "axios";

class App extends Component {
state = {
	data: [],
	id: 0,
	message: null,
	intervalIsSet: false,
	idToDelete: null,
	idToUpdate: null,
	objectToUpdate: null
};

// polling interval to check db for changes.
// change if you require less frequent checks.
componentDidMount() {
	this.getDataFromDb();
	if (!this.state.intervalIsSet) {
	let interval = setInterval(this.getDataFromDb, 1000);
	this.setState({ intervalIsSet: interval });
	}
}

componentWillUnmount() {
	if (this.state.intervalIsSet) {
	clearInterval(this.state.intervalIsSet);
	this.setState({ intervalIsSet: null });
	}
}

getDataFromDb = () => {
fetch("/api/getData")
	.then(data => data.json())
	.then(res => this.setState({ data: res.data }));
};

putDataToDB = message => {
	let currentIds = this.state.data.map(data => data.id);
	let idToBeAdded = 0;
	while (currentIds.includes(idToBeAdded)) {
	++idToBeAdded;
	}

	axios.post("/api/putData", {
	id: idToBeAdded,
	message: message
	});
};

deleteFromDB = idTodelete => {
	let objIdToDelete = null;
	this.state.data.forEach(dat => {
	if (dat.id === idTodelete) {
		objIdToDelete = dat._id;
	}
	});

	axios.delete("/api/deleteData", {
	data: {
		id: objIdToDelete
	}
	});
};

updateDB = (idToUpdate, updateToApply) => {
	let objIdToUpdate = null;
	this.state.data.forEach(dat => {
	if (dat.id === idToUpdate) {
		objIdToUpdate = dat._id;
	}
	});

	axios.post("/api/updateData", {
	id: objIdToUpdate,
	update: { message: updateToApply }
	});
};

render() {
const { data } = this.state;
return (
<div>
	<ul>
	{data.length <= 0
		? "No records"
		: data.map(dat => (
			<li style={{ padding: "10px" }} key={data.message}>
			data: <br />
			id: {dat.id} <br />
			{dat.message}
			</li>
		  ))}
	</ul>
	
	<div style={{ padding: "10px" }}>
	  <input
		type="text"
		onChange={e => this.setState({ message: e.target.value })}
		placeholder="Add message"
		style={{ width: "200px" }}
	/>
	<button onClick={() => this.putDataToDB(this.state.message)}>
		ADD Message
	</button>
	</div>
	
	<div style={{ padding: "10px" }}>
	<input
		type="text"
		style={{ width: "200px" }}
		onChange={e => this.setState({ idToDelete: e.target.value })}
		placeholder="ID to delete/leave empty to delete last"
	/>
	<button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
		DELETE
	</button>
	</div>
	
	<div style={{ padding: "10px" }}>
	<input
		type="text"
		style={{ width: "200px" }}
		onChange={e => this.setState({ idToUpdate: e.target.value })}
		placeholder="ID of item to update/empty for last"
	/>
	<input
		type="text"
		style={{ width: "200px" }}
		onChange={e => this.setState({ updateToApply: e.target.value })}
		placeholder="new message here"
	/>
	<button
		onClick={() =>
		this.updateDB(this.state.idToUpdate, this.state.updateToApply)
		}
	>
		UPDATE
	</button>
	</div>
</div>
);}}
export default App;