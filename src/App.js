import React, { Component } from 'react'
import { Container, Navbar, NavDropdown, Row, Col, Button, Modal, InputGroup, Form, FormControl, Alert, Card, ListGroup, ButtonGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faFileUpload, faFileDownload, faBroom, faTachometerAlt, faHeart, faShieldAlt, faDice, faDiceD20, faMedkit, faBurn, faTrash, faHourglassStart } from '@fortawesome/free-solid-svg-icons'

class NewCharacterWindow extends Component {
	constructor() {
		super()
		this.state = {
			name: undefined,
			initiative: undefined,
			hitpoints: undefined,
			ca: undefined
		}
	}

	isString = (value) => {
		return value !== undefined && (typeof value === 'string' || value instanceof String)
	}

	isNumber = (value) => {
		return value !== undefined && (typeof value === 'number' && isFinite(value))
	}

	fetchName = (value) => {
		this.setState({ name: value.target.value.trim() })
	}

	fetchInitiative = (value) => {
		this.setState({ initiative: value.target.value.trim() })
	}

	fetchHitPoints = (value) => {
		this.setState({ hitpoints: value.target.value.trim() })
	}

	fetchCA = (value) => {
		this.setState({ ca: value.target.value.trim() })
	}

	getData = () => {
		let result_state_name = this.isString(this.state.name) && this.state.name.length > 2
		let result_state_initiative = this.isNumber(parseInt(this.state.initiative))
		let result_state_hitpoints = this.isNumber(parseInt(this.state.hitpoints))
		let result_state_ca = this.isNumber(parseInt(this.state.ca))
		let result_state = result_state_name && result_state_initiative && result_state_hitpoints && result_state_ca
		
		return [result_state, this.state.name, parseInt(this.state.initiative), parseInt(this.state.hitpoints), parseInt(this.state.ca)]
	}


	render = () => {
		return (
			<Modal show={ this.props.show } onHide={ () => this.props.onHide({ msg: 'Cross Icon Clicked!' })} size="lg" centered>
				<Modal.Header>
					<Modal.Title id="contained-modal-title-vcenter">New Character</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputGroup className="mb-3" as={Row} controlId="name">
						<Form.Label column sm="2">Name: </Form.Label>
						<Col sm="10">
							<FormControl placeholder="name" aria-label="Name" onChange= { this.fetchName } />
						</Col>
					</InputGroup>
					<InputGroup className="mb-3" as={Row} controlId="initiative">
						<Form.Label column sm="2">Initiative: </Form.Label>
						<Col sm="10">
							<FormControl placeholder="initiative" aria-label="Initiative" onChange= { this.fetchInitiative }/>
						</Col>
					</InputGroup>
					<InputGroup className="mb-3" as={Row}>
						<Form.Label column sm="2">Hit Points: </Form.Label>
						<Col sm="10">
							<FormControl placeholder="hit points" aria-label="Hit Points" onChange= { this.fetchHitPoints }/>
						</Col>
					</InputGroup>
					<InputGroup className="mb-3" as={Row}>
						<Form.Label column sm="2">CA: </Form.Label>
						<Col sm="10">
							<FormControl placeholder="ca" aria-label="CA" onChange= { this.fetchCA }/>
						</Col>
					</InputGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="success" onClick={() => this.props.onClick( this.getData() )}  >Submit</Button>
					<Button variant="danger" onClick={() => this.props.onHide()} >Close</Button>
				</Modal.Footer>
			</Modal>
		)
	}
}

class UploadFileWindow extends Component {
	constructor() {
		super()
		this.state = {
			content: []
		}
	}


	render = () => {
		return (
			<Modal show={ this.props.show } onHide={ () => this.props.onHide({ msg: 'Cross Icon Clicked!' })} size="lg" centered>
				<Modal.Header>
					<Modal.Title id="contained-modal-title-vcenter">Upload character file</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.File id="character-file" label="Search for you character file..." custom/>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="success" onClick={() => this.props.onClick( this.getData() )}  >Submit</Button>
					<Button variant="danger" onClick={() => this.props.onHide()} >Close</Button>
				</Modal.Footer>
			</Modal>
		)
	}
}

class App extends Component {
	constructor() {
		super()
		this.state = {
			characters: [],
			newCharacterShow: false,
			uploadFileShow: false
		}
	}

	makeCharacter = (array) => {
		var x = {name: array[1], initiative: array[2], hp: array[3], ca: array[4], initRoll: 0, initTotal: array[2], thp: array[3], tca: array[4] }
		return [x]
	}

	discardNewCharacter = () => {
		this.setState({ newCharacterShow: false })
	}

	saveNewCharacter = (content) => {
		this.setState({ newCharacterShow: !content[0] })
		if(content[0]) {
			function compare(a, b) {
				if(a.initTotal < b.initTotal) {
					return 1
				} else if (a.initTotal > b.initTotal) {
					return -1
				} else {
					return 0
				}
			}
			var new_array = this.state.characters.concat(this.makeCharacter(content))
			new_array.sort(compare)
			this.setState({ characters: new_array })
		}
	}

	showNewCharacter = () => {
		this.setState({ newCharacterShow: true })
	}

	loadFileCharacters = (content) => {
		console.log("loadFileCharacters")
	}

	downloadFileCharacters = () => {
		function convertToCSV(arr) {
			if(arr.length > 0) {
				const array = [Object.keys(arr[0])].concat(arr)
				return array.map(it => {
					return Object.values(it).toString()
				}).join('\n')
			} else {
				return ""
			}
		}

		if(this.state.characters.length > 0) {
			var content = convertToCSV(this.state.characters)
			const url = window.URL.createObjectURL(new Blob([content]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', `characters.csv`)
			document.body.appendChild(link)
			link.click()
			link.parentNode.removeChild(link)
		} else {
			alert("No characters available for this session");
		}
	}


	createListOfCharacters = () => {
		if(this.state.characters.length < 1) {
			return <Row className="text-center">
					<Col>
						<i>There are no characters in this session</i>
					</Col>
				</Row>
		} else {
			var list = this.state.characters.map( (char, idx) => { return (
				<ListGroup.Item>
					<Row>
						<Col sm={8}><h5>[ { idx + 1 } ] - { char.name }</h5></Col>
						<Col sm={4} className="text-right">
							<ButtonGroup>
								<Button size="sm" variant="outline-danger" onClick={() => console.log("remove")} ><FontAwesomeIcon icon={ faTrash } /> Remove</Button>
								<Button size="sm" variant="outline-dark" onClick={() => console.log("update hp")} ><FontAwesomeIcon icon={ faMedkit } /> Update</Button>
								<Button size="sm" variant="outline-dark" onClick={() => console.log("update ca")} ><FontAwesomeIcon icon={ faBurn } /> Update</Button>
							</ButtonGroup>
						</Col>
					</Row>
					<Row>
						<Col sm={2}><FontAwesomeIcon icon={ faTachometerAlt } /> Initiative:</Col>
						<Col sm={2}>{ char.initiative }</Col>
						<Col sm={1}></Col>
						<Col sm={2}><FontAwesomeIcon icon={ faDice } /> Initiative:</Col>
						<Col sm={2}>{ char.roll }</Col>
						<Col sm={3}></Col>
					</Row>
					<Row>
						<Col sm={2}><FontAwesomeIcon icon={ faHeart } /> Hit Points:</Col>
						<Col sm={2}>{ char.hp }</Col>
						<Col sm={1}></Col>
						<Col sm={2}><FontAwesomeIcon icon={ faHourglassStart } /> Current:</Col>
						<Col sm={2}>{ char.thp }</Col>
						<Col sm={1}></Col>
					</Row>
					<Row>
						<Col sm={2}><FontAwesomeIcon icon={ faShieldAlt }/> CA:</Col>
						<Col sm={2}>{ char.ca }</Col>
						<Col sm={1}></Col>
						<Col sm={2}><FontAwesomeIcon icon={ faHourglassStart } /> Current:</Col>
						<Col sm={2}>{ char.tca }</Col>
						<Col sm={1}></Col>
					</Row>
				</ListGroup.Item>
        	) } )
        	
			return <Row className="text-left">
					<Col>
						<Card>
							<ListGroup variant="flush">
								{ list }
							 </ListGroup>
						</Card>
					</Col>
				</Row>
		}
	}

	render = () => {
		return (
			<div>
				<Navbar expand="lg" variant="light" bg="light">
				<Navbar.Brand href="#">Hit Points & Initiative Tracker</Navbar.Brand>
				<NavDropdown title="Menu" id="basic-nav-dropdown" className="navbar-nav ml-auto" drop="left">
					<NavDropdown.Item onClick={ this.showNewCharacter }><FontAwesomeIcon icon={ faUserPlus } /> Add new character</NavDropdown.Item>
					<NavDropdown.Divider />
					<NavDropdown.Item onClick={() => { this.setState({ uploadFileShow: true })}}><FontAwesomeIcon icon={ faFileUpload } /> Load file</NavDropdown.Item>
					<NavDropdown.Item onClick={this.downloadFileCharacters}><FontAwesomeIcon icon={ faFileDownload } /> Save file</NavDropdown.Item>
					<NavDropdown.Divider />
					<NavDropdown.Item href="#"><FontAwesomeIcon icon={ faBroom } /> Clear board</NavDropdown.Item>
				</NavDropdown>
			</Navbar>
			<Container>
				<Row>&nbsp;</Row>
				<Row><Col><Alert variant="info"><h4>List of characters</h4></Alert></Col></Row>
				<Row><Col sm={10}></Col><Col sm={2} className="text-right"><Button size="sm" variant="outline-dark" onClick={() => console.log("roll initiative")} ><FontAwesomeIcon icon={ faDiceD20 } /> Roll initiative</Button></Col></Row>
				<Row>&nbsp;</Row>
				{ this.createListOfCharacters() }
			</Container>
			<NewCharacterWindow show={this.state.newCharacterShow} onClick={this.saveNewCharacter} onHide={this.discardNewCharacter} />
			<UploadFileWindow show={this.state.uploadFileShow} onClick={this.loadFileCharacters} onHide={() => { this.setState({ uploadFileShow: false })}} />
			
			</div>
		)
	}
}


export default App
