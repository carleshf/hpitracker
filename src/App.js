import React, { Component } from 'react'
import { Container, Navbar, NavDropdown, Row, Col, Button, Modal, InputGroup, Form, FormControl, Alert, Card, ListGroup, ButtonGroup, ToggleButtonGroup, ToggleButton, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faFileUpload, faFileDownload, faBroom, faTachometerAlt, faHeart, faShieldAlt, faDice, faDiceD20, faMedkit, faBurn, faTrash, faHourglassStart, faPlus, faMinus, faUserTag, faSearch, faSkullCrossbones } from '@fortawesome/free-solid-svg-icons'

class NewCharacterWindow extends Component {
	constructor() {
		super()
		this.state = {
			name: undefined,
			initiative: undefined,
			hitpoints: undefined,
			ca: undefined,
			npc: false
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
		let x = [result_state, this.state.name, parseInt(this.state.initiative),
			parseInt(this.state.hitpoints), parseInt(this.state.ca),
			parseInt(this.state.initiative), parseInt(this.state.initiative),
			parseInt(this.state.hitpoints), parseInt(this.state.ca), 
			this.state.npc ? "true" : "false"
		]
		
		if(result_state) {
			this.setState({name: undefined,		initiative: undefined,
				hitpoints: undefined,				ca: undefined,
				npc: false
			})
		}
		console.log("getData => ", x, [result_state_name , result_state_initiative, result_state_hitpoints, result_state_ca ])
		return x
	}


	render = () => {
		return (
			<Modal show={ this.props.show } onHide={ () => this.props.onHide()} size="lg" centered>
				<Modal.Header>
					<Modal.Title id="contained-modal-title-vcenter">New Character</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputGroup className="mb-3" as={Row}>
						<Form.Label column sm={3}>Name: </Form.Label>
						<Col sm={9}>
							<FormControl placeholder="name" aria-label="Name" onChange= { this.fetchName } />
						</Col>
					</InputGroup>
					<InputGroup className="mb-3" as={Row}>
						<Form.Label column sm={3}>Initiative: </Form.Label>
						<Col sm={9}>
							<FormControl placeholder="initiative" aria-label="Initiative" onChange= { this.fetchInitiative }/>
						</Col>
					</InputGroup>
					<InputGroup className="mb-3" as={Row}>
						<Form.Label column sm={3}>Hit Points: </Form.Label>
						<Col sm={9}>
							<FormControl placeholder="hit points" aria-label="Hit Points" onChange= { this.fetchHitPoints }/>
						</Col>
					</InputGroup>
					<InputGroup className="mb-3" as={Row}>
						<Form.Label column sm={3}>CA: </Form.Label>
						<Col sm={9}>
							<FormControl placeholder="ca" aria-label="CA" onChange= { this.fetchCA }/>
						</Col>
					</InputGroup>
					<InputGroup className="mb-3" as={Row}>
						<Col></Col>
						<Col sm={2}>
							<Form.Group controlId="formBasicCheckbox">
								<Form.Check type="switch" id="custom-switch" label="NPC" onChange={() => this.setState({ npc: !this.state.npc })} />
							</Form.Group>
						</Col>
					</InputGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="success" onClick={() => this.props.onClick( this.getData() )}  >Add</Button>
					<Button variant="danger" onClick={() => this.props.onHide()} >Close</Button>
				</Modal.Footer>
			</Modal>
		)
	}
}

class RenameCharacterWindow extends Component {
	constructor() {
		super()
		this.state = {
			name: undefined
		}
	}

	isString = (value) => {
		return value !== undefined && (typeof value === 'string' || value instanceof String)
	}

	fetchName = (value) => {
		this.setState({ name: value.target.value.trim() })
	}

	getData = () => {
		let result_state_name = this.isString(this.state.name) && this.state.name.length > 2
		
		if(result_state_name) {
			this.setState({ name: undefined })
		}

		console.log("getData (rename) => ", this.state.name, [result_state_name])
		return [result_state_name, this.state.name]
	}


	render = () => {
		return (
			<Modal show={ this.props.show } onHide={() => this.props.onHide() } size="lg" centered>
				<Modal.Header>
					<Modal.Title id="contained-modal-title-vcenter">Rename Character</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputGroup className="mb-3" as={Row}>
						<Form.Label column sm={3}>Name: </Form.Label>
						<Col sm={9}>
							<FormControl placeholder="name" aria-label="Name" onChange= { this.fetchName } />
						</Col>
					</InputGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="success" onClick={() => this.props.onClick( this.getData() )}  >Rename</Button>
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
			content: [],
			submitEnable: true
		}
	}

	getData = (event) => {
		const input = event.target
		if ('files' in input && input.files.length > 0) {
			this.setState({ submitEnable: false })
			const reader = new FileReader()
			return new Promise((resolve, reject) => {
				reader.onload = event => resolve(event.target.result)
				reader.onerror = error => reject(error)
				reader.readAsText(input.files[0])
			})
			.then(content => {
				this.setState({ content: content, submitEnable: true })
			}).catch(error => {
				console.log(error)
				this.setState({ content: [], submitEnable: false })
			})
		}
	}

	render = () => {
		var submitButton = <Button variant="success" onClick={() => this.props.callbackData(this.state.content)} >Submit</Button>
		if(!this.state.submitEnable) {
			submitButton = <Button variant="success" onClick={() => this.props.callbackData(this.state.content)} disabled>Submit</Button>
		}
		return (
			<Modal show={ this.props.show } onHide={ () => this.props.onHide({ msg: 'Cross Icon Clicked!' })} size="lg" centered>
				<Modal.Header>
					<Modal.Title id="contained-modal-title-vcenter">Upload character file</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.File id="character-file" label="Search for you character file..." onChange={this.getData} />
					</Form>
				</Modal.Body>
				<Modal.Footer>
					{ submitButton }
					<Button variant="danger" onClick={() => this.props.onHide()} >Close</Button>
				</Modal.Footer>
			</Modal>
		)
	}
}

class UpdateWindow extends Component {
	constructor() {
		super()
		this.state = {
			increaseValue: 0,
			increaseDirection: 1
		}
	}

	fetchAmount = (value) => {
		this.setState({ increaseValue: parseInt(value.target.value.trim()) })
	}

	render = () => {
		return (
			<Modal show={ this.props.show } onHide={ () => this.props.onHide({ msg: 'Cross Icon Clicked!' })} size="lg" centered>
				<Modal.Header>
					<Modal.Title id="contained-modal-title-vcenter">{ this.props.title }</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col sm={1}></Col>
						<Col>Direction</Col>
						<Col sm={1}></Col>
						<Col>Amount</Col>
						<Col></Col>
					</Row>
					<Row>
						<Col sm={1}></Col>
						<Col>
							<ToggleButtonGroup type="radio" name="options" defaultValue={1}>
								<ToggleButton type="radio" name="radio" size="sm" value={-1} onClick={() => this.setState({increaseDirection: -1})}><FontAwesomeIcon icon={ faMinus } /></ToggleButton>
								<ToggleButton type="radio" name="radio" size="sm" value={1} onClick={() => this.setState({increaseDirection:  1})} defaultChecked ><FontAwesomeIcon icon={ faPlus } /></ToggleButton>
							</ToggleButtonGroup>
						</Col>
						<Col sm={1}></Col>
						<Col>
							<FormControl placeholder="absolute quantity" aria-label="Initiative" onChange= { this.fetchAmount }/>
						</Col>
						<Col></Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="success" onClick={() => this.props.callbackData([this.state.increaseValue, this.state.increaseDirection, this.props.selected])} >Submit</Button>
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
			uploadFileShow: false,
			updateHpShow: false,
			updateCaShow: false,
			updateRenameShow: false,
			selected: -1
		}
	}

	makeCharacter = (array, idx = 1) => {
		var x = { name: array[0 + idx],			initiative: parseInt(array[1 + idx]), 
			hp: parseInt(array[2 + idx]), 		ca: parseInt(array[3 + idx]), 
			initRoll: parseInt(array[4 + idx]), initTotal: parseInt(array[5 + idx]), 
			thp: parseInt(array[6 + idx]), 		tca: parseInt(array[7 + idx]),
			npc: array[8 + idx].toLowerCase() }
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
		this.setState({ uploadFileShow: false })
		content = content.split("\n")
		console.log("loadFileCharacters", content)
		if(content.length >= 2) {
			console.log(content.length)
			var new_array = []
			for(var ii = 1; ii < content.length; ii++) {
				new_array = new_array.concat(this.makeCharacter(content[ii].split(","), 0))
			}
			new_array = this.state.characters.concat(new_array)

			function compare(a, b) {
				if(a.initTotal < b.initTotal) {
					return 1
				} else if (a.initTotal > b.initTotal) {
					return -1
				} else {
					return 0
				}
			}
			new_array.sort(compare)

			this.setState({ characters: new_array })
		}
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

	clearBoard = () => {
		var res = window.confirm("Are you sure you want to clear the board?")
		if(res === true) {
			this.setState({ characters: [] })
		}
	}

	removeCharacter = (idx) => {
		var new_array = this.state.characters
		new_array.splice(idx, 1)
		this.setState({ characters: new_array })
	}

	rollInitiative = () => {
		console.log("rollInitiative")
		var new_array = this.state.characters
		for(var ii = 0; ii < new_array.length; ii++) {
			let dice = Math.floor((Math.random() * 20) + 1)
			let init = parseInt(new_array[ii].initiative)
			let res = dice + init 
			new_array[ii].initTot = res
			new_array[ii].initRoll = res + " (" + dice + ")"
		}

		function compare(a, b) {
			if(a.initTot < b.initTot) {
				return 1
			} else if (a.initTot > b.initTot) {
				return -1
			} else {
				return 0
			}
		}
		new_array.sort(compare)

		this.setState({ characters: new_array })
	}

	saveRenameCharacter = (content) => {
		this.setState({ updateRenameShow: !content[0] })
		if(content[0]) {
			var new_array = this.state.characters
			new_array[this.state.selected].name = content[1]
			this.setState({ characters: new_array })
		}

	}
	discardRenameCharacter = () => {
		this.setState({ updateRenameShow: false })
	}


	createListOfCharacters = () => {
		if(this.state.characters.length < 1) {
			return <Row className="text-center">
					<Col>
						<i>There are no characters in this session</i>
					</Col>
				</Row>
		} else {
			var list = this.state.characters.map( (char, idx) => { 
				console.log("Character: ", char)
				var death = ""
				if(char.thp <= 0) {
					death = <FontAwesomeIcon icon={ faSkullCrossbones } />
				}
				if(char.npc === "true") {
					var tpca = <Tooltip id="tooltip"><strong>Temp CA: { char.tca }, (CA: {char.ca})</strong></Tooltip>
					var tpin = <Tooltip id="tooltip"><strong>Initiative: { char.initiative }; Roll: { char.initRoll }</strong></Tooltip>
					return (
						<ListGroup.Item key={idx}>
							<Row>
								<Col sm={6}><h5>[ { idx + 1 } ] - { char.name } (NPC)</h5></Col>
								<Col sm={6} className="text-right">
									<ButtonGroup>
										<Button size="sm" variant="outline-danger" onClick={() => this.removeCharacter(idx)} ><FontAwesomeIcon icon={ faTrash } /> Remove</Button>
										<Button size="sm" variant="outline-info" onClick={() => this.setState({ updateRenameShow: true, selected: idx })} ><FontAwesomeIcon icon={ faUserTag } /> Rename</Button>
										<Button size="sm" variant="outline-dark" onClick={() => this.setState({ updateHpShow: true, selected: idx })} ><FontAwesomeIcon icon={ faMedkit } /> Update</Button>
										<Button size="sm" variant="outline-dark" onClick={() => this.setState({ updateCaShow: true, selected: idx })} ><FontAwesomeIcon icon={ faBurn } /> Update</Button>
									</ButtonGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={3}><FontAwesomeIcon icon={ faDice } /> Initiative:</Col>
								<Col sm={3}>
									{ char.initTot } <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={ tpin }>
										<Button size="sm" variant="outline-info"><FontAwesomeIcon icon={ faSearch } /></Button>
									</OverlayTrigger>
								</Col>
								<Col></Col>
							</Row>
							<Row>
								<Col sm={3}><FontAwesomeIcon icon={ faHeart } /> Hit Points:</Col>
								<Col sm={3}>{ char.hp - char.thp }{  death }</Col>
								<Col></Col> 
							</Row>
							<Row>
								<Col sm={3}><FontAwesomeIcon icon={ faShieldAlt }/> CA:</Col>
								<Col sm={3}>
									<OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={ tpca }>
										<Button size="sm" variant="outline-info"><FontAwesomeIcon icon={ faSearch } /></Button>
									</OverlayTrigger>
								</Col>
								<Col></Col>
							</Row>
						</ListGroup.Item>
					)
				} else {
					return (
						<ListGroup.Item key={idx}>
							<Row>
								<Col sm={6}><h5>[ { idx + 1 } ] - { char.name }</h5></Col>
								<Col sm={6} className="text-right">
									<ButtonGroup>
										<Button size="sm" variant="outline-danger" onClick={() => this.removeCharacter(idx)} ><FontAwesomeIcon icon={ faTrash } /> Remove</Button>
										<Button size="sm" variant="outline-info" onClick={() => this.setState({ updateRenameShow: true, selected: idx })} ><FontAwesomeIcon icon={ faUserTag } /> Rename</Button>
										<Button size="sm" variant="outline-dark" onClick={() => this.setState({ updateHpShow: true, selected: idx })} ><FontAwesomeIcon icon={ faMedkit } /> Update</Button>
										<Button size="sm" variant="outline-dark" onClick={() => this.setState({ updateCaShow: true, selected: idx })} ><FontAwesomeIcon icon={ faBurn } /> Update</Button>
									</ButtonGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={3}><FontAwesomeIcon icon={ faTachometerAlt } /> Initiative:</Col>
								<Col sm={2}>{ char.initiative }</Col>
								<Col></Col>
								<Col sm={3}><FontAwesomeIcon icon={ faDice } /> Initiative:</Col>
								<Col sm={2}>{ char.initRoll }</Col>
								<Col></Col>
							</Row>
							<Row>
								<Col sm={3}><FontAwesomeIcon icon={ faHeart } /> Hit Points:</Col>
								<Col sm={2}>{ char.hp }</Col>
								<Col></Col>
								<Col sm={3}><FontAwesomeIcon icon={ faHourglassStart } /> Current:</Col>
								<Col sm={2}>{ char.thp }{ death }</Col>
								<Col></Col>
							</Row>
							<Row>
								<Col sm={3}><FontAwesomeIcon icon={ faShieldAlt }/> CA:</Col>
								<Col sm={1}>{ char.ca }</Col>
								<Col></Col>
								<Col sm={3}><FontAwesomeIcon icon={ faHourglassStart } /> Current:</Col>
								<Col sm={1}>{ char.tca }</Col>
								<Col></Col>
							</Row>
						</ListGroup.Item>
					)
				}
			} )

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

	isNumber = (value) => {
		return value !== undefined && (typeof value === 'number' && isFinite(value))
	}

	updateHpValue = (content) => {
		this.setState({ updateHpShow: false })
		
		var value = parseInt(content[0])
		var direc = parseInt(content[1])
		var charc = parseInt(content[2])

		if(this.isNumber(value)) {
			var new_array = this.state.characters
			new_array[charc].thp += value * direc
		}
	}

	updateCaValue = (content) => {
		this.setState({ updateCaShow: false })
		
		var value = parseInt(content[0])
		var direc = parseInt(content[1])
		var charc = parseInt(content[2])

		if(this.isNumber(value)) {
			var new_array = this.state.characters
			new_array[charc].tca += value * direc
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
					<NavDropdown.Item onClick={this.clearBoard}><FontAwesomeIcon icon={ faBroom } /> Clear board</NavDropdown.Item>
				</NavDropdown>
			</Navbar>
			<Container>
				<Row>&nbsp;</Row>
				<Row><Col><Alert variant="info"><h4>List of characters</h4></Alert></Col></Row>
				<Row><Col sm={10}></Col><Col sm={2} className="text-right"><Button size="sm" variant="outline-dark" onClick={this.rollInitiative} ><FontAwesomeIcon icon={ faDiceD20 } /> Roll initiative</Button></Col></Row>
				<Row>&nbsp;</Row>
				{ this.createListOfCharacters() }
			</Container>
			<NewCharacterWindow show={this.state.newCharacterShow} onClick={this.saveNewCharacter} onHide={this.discardNewCharacter} />
			<UploadFileWindow show={this.state.uploadFileShow} callbackData={this.loadFileCharacters} onHide={() => { this.setState({ uploadFileShow: false })}} />
			<UpdateWindow show={this.state.updateHpShow} selected={this.state.selected} onHide={() => this.setState({ updateHpShow: false })} callbackData={this.updateHpValue} title="Update Hit Points"/>
			<UpdateWindow show={this.state.updateCaShow} selected={this.state.selected} onHide={() => this.setState({ updateCaShow: false })} callbackData={this.updateCaValue} title="Update CA" />
			<RenameCharacterWindow show={this.state.updateRenameShow} onClick={this.saveRenameCharacter} onHide={this.discardRenameCharacter} />
			</div>
		)
	}
}


export default App
