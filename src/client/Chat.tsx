import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IChatParams, IMessage } from './types';
import FriendInChat from './FriendInChat';
import Message from './Message';
import CurrentUser from './CurrentUser';
import { fetchMessages, saveMessage } from './utils/chatUtils';
import Logger from './Logger';

function Chat(data: IChatParams) {
  const emptyMessages: IMessage[] = [];
  const [messages, setMessages] = useState(emptyMessages);
  const [currentMessage, setCurrentMessage] = useState('');
  useEffect(() => {
    const renderMessages = async () => {
      if(! data.isFriendShown) return;
      
      try {
        const messages: IMessage[] = await fetchMessages(CurrentUser.get(), data.friendInChat);
        setMessages(messages);
      }
      catch(ex: any) {
        // console.log('Failed to fetch Messages', ex);
      }
    };
    
    renderMessages();
  }, [data]); // Pass data as arg to make sure the fetch is done only when a Friend is selected

  const sendMessage = async () => {
    if(currentMessage.length === 0) return;
    data.chatClient.handleSendButton(currentMessage);

    const message: IMessage = await saveMessage(currentMessage, CurrentUser.get().id, data.friendInChat.id);

    const list = [...messages, message];
    setMessages(list);
    setCurrentMessage('');
  };

  if (data.isFriendShown) {
    data.chatClient.connection.onmessage = (evt: any) => {
      var text = "";
      var msg = JSON.parse(evt.data);
      Logger.log("Message received: ");
      
      console.dir(msg);
      var time = new Date(msg.date);
      var timeStr = time.toLocaleTimeString();

      switch(msg.type) {
        case "id":
          data.chatClient.clientID = msg.id;
          let name = CurrentUser.get().nickname;
          data.chatClient.setUsername(name);
          data.chatClient.targetUsername = data.friendInChat.nickname;
          break;

        case "username":
          text = "<b>User <em>" + msg.name + "</em> signed in at " + timeStr + "</b><br>";
          break;

        case "message":
          text = "(" + timeStr + ") <b>" + msg.name + "</b>: " + msg.text + "<br>";
          const m = {
            id: msg.id,
            userId: data.friendInChat.id,
            recipeintId: CurrentUser.get().id,
            message: msg.text,
            isTo: true,
            isFrom: false,
            fromAvatar: data.friendInChat.avatar,
          };

          const list = [...messages, m];
          setMessages(list);
          break;

        case "rejectusername":
          break;

        // Signaling messages: these messages are used to trade WebRTC
        // signaling information during negotiations leading up to a video
        // call.
        case "video-offer":  // Invitation and offer to chat
          data.chatClient.handleVideoOfferMsg(msg);
          break;

        case "video-answer":  // Callee has answered our offer
          data.chatClient.handleVideoAnswerMsg(msg);
          break;

        case "new-ice-candidate": // A new ICE candidate has been received
          data.chatClient.handleNewICECandidateMsg(msg);
          break;

        case "hang-up": // The other peer has hung up the call
          data.chatClient.handleHangUpMsg(msg);
          break;

        // Unknown message; output to console for debugging.
        default:
          Logger.logError("Unknown message received:");
          Logger.logError(msg);
      }
    };
  }

  return (
    <div className="wrapper">
      <div>
        <a href="/profile" className="right logout">Profile</a>
      </div>
      <section className="chat-area">
        { data.isFriendShown ? <FriendInChat {...data.friendInChat} />  : <header></header> }

        <div className="chat-box">
            {messages.map((message: IMessage) => {
                return <Message key={message.id} {...message} />
            })}
        </div>

        { 
          data.isFriendShown ?
          <form action="#" className="typing-area" data-testid="message-form">
            <input
              value={currentMessage}
              onChange={ (evt) => { setCurrentMessage(evt.target.value) }}
              type="text"
              placeholder="Type a message"
            />
            <button onClick={(e) => { e.preventDefault(); sendMessage(); }}>
              <i className="fab fa-telegram-plane"></i>
            </button>
            <button onClick={ (e) => { e.preventDefault(); data.chatClient.invite(e) }}>
              <i className='fa fa-phone'></i>
            </button>
            <button onClick={ (e) => { e.preventDefault(); data.chatClient.invite(e) }}>
              <i className='fas fa-video'></i>
            </button>
          </form>
          :
          <div className='typing-area'></div>
        }
      </section>

    </div>
  );
}

export default Chat;
