import React from 'react';
import ReactDOM from 'react-dom';

var _ =require('lodash');

var MainInterface = React.createClass({
	// this is initializing the state
	getInitialState: function() {
	    {/*aptBodyVisible is refering to interface add appointment*/}
	    return {
	    	aptBodyVisible: false,
	    	orderBy: 'petName',
	    	orderDir: 'asc',
	    	queryText:' ',
			myAppointments:[],
			comment: ''
	    }
	},

			componentDidMount: function() {
				// callback funtion 
			      this.serverRequest = $.get('data.json', function(results){
			      	var tempApts = results;
			      	this.setState({
			      		myAppointments: tempApts
			      	});
			      }.bind(this));
			},
				// this will cancel any outstanding request
				componentWillUnmount: function() {
				      this.serverRequest.abort();
				},

					deleteMessage: function(item){
						var allApts = this.state.myAppointments;
						var newApts = _.without(allApts, item);
						this.setState({
							myAppointments: newApts
						});
					},

						// this is setting the addAppointment button toggle between visible or not visible
						toggleAddDisplay: function(){
							var tempVisibility =!this.state.aptBodyVisible;
							this.setState({
								aptBodyVisible: tempVisibility
							});
						},

							addItem: function(tempItem){
								var tempApts = this.state.myAppointments;
								tempApts.push(tempItem);
								this.setState({
									myAppointments: tempApts
								});
							},
								reOrder: function(orderBy, orderDir){
									this.setState({
										orderBy: orderBy,
										orderDir: orderDir
									});
								},
									// for the seach bar
									searchApts(q){
										this.setState({
											queryText: q
										})
									},

	render: function(){
			var filteredApts = [];
			var orderBy = this.state.orderBy;
			var orderDir = this.state.orderDir;
			var queryText = this.state.queryText;
			var myAppointments = this.state.myAppointments;
			var comments =[];

			// using the search bar to populate results
			myAppointments.forEach(function(item){
				if(
					(item.petName.toLowerCase().indexOf(queryText)!=-1) ||
					(item.ownerName.toLowerCase().indexOf(queryText)!=-1) ||
					(item.aptDate.toLowerCase().indexOf(queryText)!=-1) ||
					(item.aptNotes.toLowerCase().indexOf(queryText)!=-1)
					
				){
					// adding the items to the filtered appointments 
					filteredApts.push(item);
				}

			});

				// this is using lodash to order the selection
			filteredApts = _.orderBy(filteredApts, function (item){
				return item[orderBy].toLowerCase();
			}, orderDir);

			// the .map method will iterate through an array of myAppointments
			// need to set up varible for each item with an index
			filteredApts = filteredApts.map(function(item, index){
				return(
				<AptList key = {index}
					singleItem = {item}
					whichItem = {item}
					onDelete ={this.deleteMessage} />
			)
				// need to bind THIS to map function
		}.bind(this));
	return (
		// to define a class you must use className and not class
		<div className="interface">
			{/*this is calling the AddAppointment function below*/}
			{/*handleToggle refers to the local copy of this function called toggleAddDisplay above*/}
			{/*addApt is going to find a local version of the method addItem and set the state above*/}
			<AddAppointment 
				bodyVisible = {this.state.aptBodyVisible}
				handleToggle = {this.toggleAddDisplay}
				addApt = {this.addItem}
			/>
			<SearchAppointments
				orderBy = {this.state.orderBy}
				orderDir = {this.state.orderDir}
				onReOrder = {this.reOrder}
				onSearch = {this.searchApts}
			 />
			<ul className="item-list media-list">{filteredApts}</ul>
			
		</div>

		)
	}
});

// *** erything below here can be a prop referring to the states and components above ***

// this will pass everything along to an onDelete method
// whichItem refers above to <AptList>
// the onDelete function calls above to onDelete property in <applist> which refers to the DeleteMessage function above
var AptList = React.createClass({
		handleDelete: function(){
			this.props.onDelete(this.props.whichItem)
		},


	render: function(){
		return(
			<li className="pet-info media">
				<div className="media-left">
					<button className="pet-delete btn btn-xs btn-danger" onClick={this.handleDelete}>
					<span className="glyphicon glyphicon-remove"></span></button>
				</div>
				<div className="pet-info media-list">
					<div className="pet-head">
						<span className="pet-name">{this.props.singleItem.petName}</span>
						<span className="apt-date pull right">{this.props.singleItem.aptDate}</span>
					</div>
					<div className="owner-name"><span className="label-item">Owner: </span>
					{this.props.singleItem.ownerName}</div>
					<div className="apt-notes">{this.props.singleItem.aptNotes}</div>
				</div>
			</li>
		)
	}
});


// *******************************this is for the appointment form ************************
var AddAppointment = React.createClass({
			// handleToggle is being passed to toggleAptDisplay
			// this is passed through our props called handleToggle
		toggleAptDisplay: function(){
			this.props.handleToggle();
		},
			// this is to pass the value of "refs" from the forms
		handleAdd: function(e){
			var tempItem = {
				petName: this.refs.inputPetName.value,
				ownerName: this.refs.inputOwnerName.value,
				aptDate: this.refs.inputAptDate.value + ' ' +
					this.refs.inputAptTime.value,
				aptNotes: this.refs.inputAptNotes.value
			}
			e.preventDefault();
			// passing tempItem to the main component above
			this.props.addApt(tempItem);
		},

	render: function(){

			var displayAptBody = {
				// bodyVisible is going to be passed to this subcomponent as a prop
				display: this.props.bodyVisible ? 'block' : 'none'
			};
				// {this.toggleAptDisplay} is refering to above toggleAptDisplay function
		return(
			<div className="panel panel-primary">
			  <div className="panel-heading apt-addheading" onClick={this.toggleAptDisplay}>
			  <span className="glyphicon glyphicon-plus"></span> Add Appointment</div>
			  <div className="panel-body" style={displayAptBody}>
			    <form className="add-appointment form-horizontal"
			    	onSubmit={this.handleAdd}>
			      <div className="form-group">
			        <label className="col-sm-2 control-label" htmlFor="petName">Pet Name</label>
			        <div className="col-sm-10">
			          <input type="text" className="form-control"
			            id="petName" ref="inputPetName" placeholder="Pet's Name" />
			        </div>
			      </div>
			      <div className="form-group">
			        <label className="col-sm-2 control-label" htmlFor="petOwner">Pet Owner</label>
			        <div className="col-sm-10">
			          <input type="text" className="form-control"
			            id="petOwner" ref="inputOwnerName" placeholder="Owner's Name" />
			        </div>
			      </div>
			      <div className="form-group">
			        <label className="col-sm-2 control-label" htmlFor="aptDate">Date</label>
			        <div className="col-sm-4">
			          <input type="date" className="form-control"
			            id="aptDate" ref="inputAptDate" />
			        </div>
			        <label className="col-sm-2 control-label" htmlFor="aptTime">Time</label>
			        <div className="col-sm-4">
			          <input type="time" className="form-control"
			            id="aptTime" ref="inputAptTime" />
			        </div>

			      </div>
			      <div className="form-group">
			        <label className="col-sm-2 control-label" htmlFor="aptNotes">Apt. Notes</label>
			        <div className="col-sm-10">
			          <textarea className="form-control" rows="4" cols="50"
			            id="aptNotes" ref="inputAptNotes" placeholder="Appointment Notes"></textarea>
			        </div>
			      </div>
			      <div className="form-group">
			        <div className="col-sm-offset-2 col-sm-10">
			          <button type="submit" className="btn btn-primary pull-right">Add Appointment</button>
			        </div>
			      </div>
			    </form>
			  </div>
			</div>
			)
	}
});

//********************************* saerch component********************************

	var SearchAppointments = React.createClass({
		
		handleSort: function(e){
			this.props.onReOrder(e.target.id, this.props.orderDir);
		},

		handleOrder: function(e){
			this.props.onReOrder(this.props.orderBy, e.target.id );
		},

		handleSearch: function(e){
			this.props.onSearch(e.target.value);
		},

		render: function(){
			return(

				<div className="row search-appointments">
				  <div className="col-sm-offset-3 col-sm-6">
				    <div className="input-group">
				      <input id="SearchApts" onChange={this.handleSearch} placeholder="Search" type="text" className="form-control" aria-label="Search Appointments" />
				      <div className="input-group-btn">
				        <button type="button" className="btn btn-primary dropdown-toggle"
				          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Sort by: <span className="caret"></span></button>
				          <ul className="dropdown-menu dropdown-menu-right">
				            <li><a href="#" id="petName" onClick={this.handleSort}>Pet Name {(this.props.orderBy === "petName") ? <span className="glyphicon glyphicon-ok"></span> : null}</a></li>
				            <li><a href="#" id="aptDate" onClick={this.handleSort}>Date{(this.props.orderBy === "aptDate") ? <span className="glyphicon glyphicon-ok"></span> : null}</a></li>
				            <li><a href="#" id="ownerName" onClick={this.handleSort}>Owner{(this.props.orderBy === "ownerName") ? <span className="glyphicon glyphicon-ok"></span> : null}</a></li>
				            <li role="separator" className="divider"></li>
				            <li><a href="#" id="asc" onClick={this.handleOrder}>Asc{(this.props.orderDir === "asc") ? <span className="glyphicon glyphicon-ok"></span> : null}</a></li>
				            <li><a href="#" id="desc" onClick={this.handleOrder}>Desc{(this.props.orderDir === "desc") ? <span className="glyphicon glyphicon-ok"></span> : null}</a></li>
				          </ul>
				      </div>
				    </div>
				  </div>
				</div>
			)
		}
	});


// this is exporting MainInterdace to main.js
export default MainInterface;