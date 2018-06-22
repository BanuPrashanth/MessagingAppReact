const instanceLocator = "v1:us1:55135e8f-684f-461f-924b-b93bff7fef8e";
const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/55135e8f-684f-461f-924b-b93bff7fef8e/token";
const username = "banuprashanth";
const roomId = 9942365;

class App extends React.Component{
	constructor(){
		super()
		this.state = {
			messages: []
		}
		this.sendMessage = this.sendMessage.bind(this)
	}
	componentDidMount(){
	const chatManager = new Chatkit.ChatManager({
		instanceLocator: instanceLocator,
		userId: username,
		tokenProvider: new Chatkit.TokenProvider({
			url: testToken
		})
	})
	chatManager.connect().then(currentUser => {
		this.currentUser = currentUser
		currentUser.subscribeToRoom({
			roomId: roomId,
			hooks: {
				onNewMessage: message => {
					this.setState({
						messages: [...this.state.messages, message]
					})
				}
			}
		})
	})
}
	sendMessage(text){
		this.currentUser.sendMessage({
			text,
			roomId: roomId
		})
	}
	render(){
		return (
			<div className="app">
				<Title />
				<MessageList messages={this.state.messages}/>
				<SendMessageForm sendMessage={this.sendMessage} />
			</div>
		)
	}
};

class MessageList extends React.Component{
	render(){
		return (
			<ul className="message-list">
				{this.props.messages.map(message =>{
					return (
						<li key={message.id}>
							<div>
								{message.senderId}
							</div>
							<div>
								{message.text}
							</div>
						</li>
					)
				})}
			</ul>
		)
	}
};

class SendMessageForm extends React.Component{
	constructor() {
		super()
		this.state={
			message:''
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	handleChange(e){
		this.setState({
			message: e.target.value
		})
	}
	handleSubmit(e){
		e.preventDefault()
		this.props.sendMessage(this.state.message)
		this.setState({
			message: ''
		})
	}
	render(){
		return(
			<form onSubmit={this.handleSubmit} className="send-message-from">
				<input
					onChange={this.handleChange}
					value={this.state.message}
					placeholder="Type your message and hit ENTER"
					type="text" />
			</form>
		)
	}
	
}

const Dummy_Data = [
	{
		senderId: "Banu",
		text: "I'm Great!!"
	},
	{
		senderId: "Sheela",
		text: "Im Simple!!"
	}
];

function Title(){
	return <p class="title"> My Awesome Chat App</p>
}

ReactDOM.render(
	<App />,
	document.getElementById("root")
	)