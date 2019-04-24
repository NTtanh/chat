import React from "react";
import io from "socket.io-client";

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            message: '',
            to: '',
            messages: [],
            isLogin: false,
            user: [],
            currentSearch: '',
            currentMess: [],
            currentUser: ''
        };
        const addMessage = data => {
            console.log(data);
            if (data.from === this.state.username) {
                data.user = data.to;
            }
            if (data.to === this.state.username) {
                data.user = data.from;
            }
            if (this.state.user.indexOf(data.user) === -1) {
                let list = [...this.state.user, data.user];
                this.setState({ user: list });
            }
            let l = [...this.state.messages, data]
            this.setState({ messages: l });
            console.log(this.state.messages);
        };

        this.created = ev => {
            ev.preventDefault();
            this.socket = io('localhost:5000?room=' + this.state.username);
            this.socket.on('MESS', function (data) {
                addMessage(data);
            });
            this.setState({ isLogin: true });
        }

        this.sendMessage = ev => {
            ev.preventDefault();
            this.socket.emit('SEND_MESSAGE', {
                from: this.state.username,
                to: this.state.currentUser,
                mess: this.state.message
            })
            this.setState({ message: '' });

        }

        this.addUser = ev => {
            ev.preventDefault();
            if (this.state.user.indexOf(this.state.currentSearch) !== -1) {
                alert('Da ton tai');
            } else {
                let list = [...this.state.user, this.state.currentSearch];
                this.setState({ user: list });
            }
        }
    }

    dangnhap() {
        return (
            <div>
                <p>Dang nhap</p>
                <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} className="form-control" />
                <button onClick={this.created} className="btn btn-primary form-control">Dang nhap</button>
            </div>
        );
    }

    dasboard() {
        return (
            // <div className="container">
            //     <div className="row">
            //         <div className="col-4">
            //             <div className="card">
            //                 <div className="card-body">
            //                     <div className="card-title">Global Chat</div>
            //                     <hr />
            //                     <div className="messages">
            //                         {this.state.messages.map(message => {
            //                             return (
            //                                 <div>{message}</div>
            //                             )
            //                         })}
            //                     </div>

            //                 </div>
            //                 <div className="card-footer">
            //                     <input type="text" placeholder="To" value={this.state.to} onChange={ev => this.setState({ to: ev.target.value })} className="form-control" />
            //                     <br />
            //                     <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
            //                     <br />
            //                     <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>

            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // </div>
            <div className='full'>
                <div className='nav-1'>
                    <div className='header-container'>
                        <input type="text" placeholder="Search" value={this.state.currentSearch} onChange={ev => this.setState({ currentSearch: ev.target.value })} className="form-control" />
                        <button onClick={this.addUser} className="btn btn-primary form-control">Add</button>
                        <br />
                    </div>
                    {this.state.user.map(i => {
                        return this.navUser(i)
                    })}
                </div>
                <div className='content'>
                    <div className='mess'>
                        {
                            this.state.messages.map(message => {
                                if (message.user === this.state.currentUser) {
                                    return (
                                        message.from === this.state.username ?
                                            <div className='active' key={message.mess}>{message.mess}</div>
                                            :
                                            <div key={message.mess}>{message.mess}</div>
                                    )
                                }
                            })
                        }
                    </div>
                    <div className='action'>
                        <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                        <br />
                        <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                    </div>
                </div>
            </div>
        );
    }

    navUser(user) {
        return (
            this.state.currentUser === user ?
                <div key={user} className='active' onClick={ev => {
                    ev.preventDefault();
                    this.setState({ currentUser: user })
                }}>
                    <p>{user}</p>
                </div>
                :
                <div key={user} onClick={ev => {
                    ev.preventDefault();
                    this.setState({ currentUser: user })
                }}>
                    <p>{user}</p>
                </div>
        );
    }
    render() {
        return (
            this.state.isLogin ? this.dasboard() : this.dangnhap()
        )
    }
}

export default Chat;