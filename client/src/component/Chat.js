import React,{Component} from 'react'
import io from 'socket.io-client'
import Masseges from './Masseges'
import MessageHeading from './MessageHeading'
import MessageForm from './MessageForm'
import ChatTabs from './ChatTabs'
import axios from 'axios'
import SignInWithGoogle from './SignInWithGoogle'
import GiphyModal from './GiphyModal'
import notificationFunc from '../notification'


let socket;

export const ChatData = React.createContext('ChatData');

export class Chat extends Component{
    constructor(props){
        super(props)
        this.state={
            userObj:{},
            authentication:false,
            chatLogLoading:true,
            collection:[],
            username:'',
            loading:false,
            msg:'',
            list:[],
            privatemsg:'',
            receiver:{},
            users:[],
            currentUser:'',
            gif:[],
            searchGif:'',
            giphyModal:false,
            giphyType:'',
            giphyLoading:false,
            loginError:"",
            demo:true,
            totalUnreadMsg:0,
            mobile:false,
            messageArea:false
        }
        this.Masseges = React.createRef()
    }

    fetchAndAddEvent = async()=> {
        
        this.send()

        const {userObj} = this.state;
        const fetchChatLogs = await this.fetchChatLogs(userObj.username)
        if(!fetchChatLogs) return;

        return this.setState({
            ...this.state,
            collection:fetchChatLogs.chatLogs,
            chatLogLoading:false
        },()=>this.sortCollections())
    }

    checkIsMObile= ()=> {
        const isMobileDevice = window.innerWidth < 992
        this.setState({
            ...this.state,
            mobile:isMobileDevice ? true :false
        })
        
    }

    playNotificaionMusic =()=>{
        const audio = new Audio('sharp.mp3');
        audio.volume = 0.3
        audio.play()
    }
    
    componentDidMount = ()=>{

        this.checkIsMObile()
        window.onresize = this.checkIsMObile;

        document.body.onbeforeunload= ()=>{
            socket.emit('logout',this.state.userObj.username)
        }
        //window.addEventListener('load',this.send)
        
        socket = io("https://react-chat-appp.herokuapp.com/");
        
        socket.on('active users',newUser=>{
            let user = this.state.users.findIndex(singleUser=> singleUser.username === newUser.username)
           
            if(user !== -1) return;
            this.setState({
                ...this.state,
                users:[...this.state.users,newUser],
            })
        })

        socket.on('delete users',username=>{
            const{users} = this.state;
            const newUsers = users.filter(user=> user.username !== username )
            console.log(newUsers)
            this.setState({
                ...this.state,
                users:newUsers
            })
        })

        socket.on("user typing",(userId)=>{
            this.showTypingIndicator(userId,true)
        })

        socket.on("stop typing",(userId)=>{
            this.showTypingIndicator(userId,false)
        })
        
        socket.on('private',async(message)=>{
            const {collection,receiver,userObj} = this.state
            console.log(this.state)
            console.log('message')
            const userIndex = collection.findIndex(user => user.username === message.sender)
            
            if(userIndex === -1){
                const fetchMessages = await this.fetchMessages(userObj.username,message.sender)
                
                const msgInfo = {
                    read:false,
                    lastUpdated:message.createdAt,
                    unReadMsgs : [],
                    typing:false,
                    name:message.senderName,
                    username:message.sender,
                    photo:message.senderPhoto,
                    conversation:fetchMessages.msgs
                }
                const updateCollection = [...collection,msgInfo]
                return this.setState({
                    ...this.state,
                    collection:updateCollection,
                },()=>this.autoScrollToBottom() )
            }
            
            const currentUser = collection[userIndex];
            
            const previousConversation = currentUser.conversation
            let sendMsgSeenReq;

            if((message.sender || message.receiverUsername) === receiver.username ){
            
                sendMsgSeenReq = await this.sendMsgSeenReq(message.sender,message.receiverUsername)
                currentUser.conversation = [...previousConversation,message ]
                
            }else{
                message.anim = false;
                currentUser.conversation = [...previousConversation,message]
                currentUser.unReadMsgs.push(message._id)
            }

            currentUser.read = sendMsgSeenReq ? true : false;
            currentUser.lastUpdated = message.createdAt ;
            
            
            this.setState({
                ...this.state,
                collection,
            },()=>{
                this.playNotificaionMusic()
                this.autoScrollToBottom()
                setTimeout(()=>this.disableMessageAnim(userIndex),1000)
            })

            
        })
    
    }
    
    changeHandelar = (event)=> {
        this.setState({
            ...this.state,
            [event.target.name] : event.target.value
        })
    }

    showTypingIndicator = (userId,display) =>{
        const{collection} = this.state
        const userIndex = collection.findIndex(user => user.username === userId)
        console.log(userIndex+ " " + userId)
        if(userIndex !== -1){
            const receiver= collection[userIndex]
            receiver.typing = display ? true : false
            this.setState({
                ...this.state,
                collection
            })
        }
    }
    googelSignIn = ()=>{
        this.setState({
            ...this.state,
            loginError:"",
            loading:true
        })
    }

    disableMessageAnim = (userIndex)=>{
        if(userIndex === -1) return;
        const list = this.state.collection;
        const user = list[0]
        const lstMsgIndex = user.conversation.length - 1;
        user.conversation[lstMsgIndex].anim = false;
        
        this.setState({
                ...this.state,
                demo:false,
                collection:list
        })
    }

    autoScrollToBottom =()=>{
        
       
        this.sortCollections()
        
        const MassegesElem = this.Masseges.current;
        if(MassegesElem.scrollHeight > MassegesElem.clientHeight){
            const scroll = MassegesElem.scrollHeight - MassegesElem.clientHeight
            MassegesElem.scrollTop = scroll
        }
    }

    submit = async(e,type='text-msg',gif) => {
        
        e.preventDefault()
        if(Object.keys(this.state.receiver).length === 0) return alert("Select a User");
        if(!this.state.userObj.username) return alert("username emty");
        if(type ==='text-msg' && !this.state.msg) return;

        this.setState({...this.state,msg:''})
        const {collection,receiver,userObj,msg} = this.state;

        const userIndex = collection.findIndex(user => user.username === receiver.username)
        const message   = this.createMessageObj(type,userObj,receiver,msg?msg:gif)
        let sendRequest =  await this.postMessage(message)
        

        const savedMsg = sendRequest.message
        savedMsg["anim"] = true
        
        const currentUser = collection[userIndex]
        if(!currentUser) return;
        const previousConversation  =   currentUser.conversation
        currentUser.conversation    =   [...previousConversation,savedMsg]
        currentUser.lastUpdated     =   sendRequest && savedMsg.createdAt ;

        
        this.setState({
            ...this.state,
            collection,
            giphyModal:false
        },()=>{
            this.autoScrollToBottom()
            setTimeout(()=>this.disableMessageAnim(userIndex),1000)
        })
        socket.emit('private',savedMsg)
        
        
       
    }

    totalUnreadMsg = ()=>{
        const {collection} = this.state
        const totalUnreadMsg = collection.filter(user => {
            if(user.read === false && user.conversation.length> 0) return true;
            return false
        })

        this.setState({
            ...this.setState,
            totalUnreadMsg:totalUnreadMsg.length
        }) 
    }

    sortCollections = () =>{
        const {collection} = this.state
        const sortedList = collection.sort((a,b)=>{
            const dateA     = new Date(a.lastUpdated).getTime()
            const dateB     = new Date(b.lastUpdated).getTime()

            return dateA  > dateB ? -1 : 1; 
        })
        const totalUnreadMsg = collection.filter(user => {
            if(user.read === false && user.conversation.length> 0) return true;
            return false
        })
        
        this.setState({
            ...this.setState,
            collection:sortedList,
            totalUnreadMsg:totalUnreadMsg.length
        })
    }
    onFailureLogin = (res)=>{
        const AlertMsg = !res.details? res.error:res.error+" "+res.details
        alert(AlertMsg)
        this.setState({
            ...this.state,
            loading:false,
            loginError :"error occured please try again"
        })
    }

    successLogin = async(res)=>{
        if(res.error) return;

        res.profileObj.username = res.googleId
        let sendRequest;
        try{
             sendRequest = await axios.post('/register',res.profileObj)
        }catch(err){
            return console.log(err)
        }
        
        this.setState({
            ...this.state,
            authentication:true,
            users:sendRequest.data.activeUsers,
            loginError:"",
            loading:false,
            userObj:sendRequest.data.user||res.profileObj
        },async()=> await this.fetchAndAddEvent())
        
        socket.emit('set username',sendRequest.data.user)
    
    }

    successLogout = ()=>{
        socket.emit('logout',this.state.userObj.username)
        this.setState({
            userObj:{},
            authentication:false,
            chatLogLoading:true,
            collection:[],
            username:'',
            msg:'',
            list:[],
            privatemsg:'',
            receiver:{},
            users:[],
            currentUser:'',
            gif:[],
            searchGif:'',
            giphyModal:false,
            giphyType:''
        })
    }

    postMessage = async(message) => {
        let sendRequest;
        try{
            sendRequest = await axios.post('/addmessage',message)
       }catch(err){
           console.log(err)
       }
       return sendRequest.data
    }
    
    fetchMessages = async(firstId,secondId) => {
            let sendRequest
            const url = `/getmessages?firstId=${firstId}&secondId=${secondId}`
            try{
                sendRequest = await axios.get(url)
            }catch(err){
                return   console.log(err)
            }
            return sendRequest.data
    }

    fetchChatLogs= async(userId)=>{
        let sendRequest
            const url = `/chatlogs?userId=${userId}`
            try{
                sendRequest = await axios.get(url)
                console.log(sendRequest)
            }catch(err){

                console.log(err)
                return this.setState({
                    ...this.state,
                    chatLogLoading:false
                })
            }
            return sendRequest.data
    }

    sendMsgSeenReq = async(senderId,receiverId) => {
        
        let sendRequest
        //const url = `http://localhost:8000/readmessage?msgId=${msgId}`
        const url = `/readmessage`
        try{
            sendRequest = await axios.put(url,{senderId,receiverId})
        }catch(err){
            return   console.log(err)
        }
        return sendRequest.data
    }

    sendMultipleSeenReq = async (sender,receiver,index) => {
        const {collection} = this.state
        const sendMsgSeenReq = await this.sendMsgSeenReq(sender,receiver)
        const user = collection[index]
        user.read = sendMsgSeenReq ? true :false
    
       this.setState({
           ...this.state,
           collection
       },this.totalUnreadMsg) 
    }

    saveLogs = (logs)=>{
        this.setState({
            ...this.state,
            collection:logs
        })
    }

    fetchGiphy = (event,search)=>{
        event.persist()
        const {searchGif,giphyType} = this.state;
        if(!searchGif && !search) return;
        this.setState({
            ...this.state,
            giphyLoading:true,
            searchGif:''
        })
        const query = searchGif.split(" ").join('+')
        const url = `http://api.giphy.com/v1/${giphyType}/search?q=${search?search:query}&api_key=H8qjqo1k0Q8TlffR1ZFQ2BrnefgTN2I2`
    
        axios.get("https://cors-anywhere.herokuapp.com/"+url)
        .then(res=>{
            this.setState({
                ...this.state,
                gif:res.data.data,
                giphyLoading:false
            })
        })
        .catch(err => console.log(err))
    }

    showGiphyModal = (event,type)=>{
        this.setState({
            ...this.state,
            giphyModal:true,
            giphyType:type
        },()=> this.fetchGiphy(event,'hi'))
    }

    hideGiphyModal = (e)=>{
        e.preventDefault()
        this.setState({
            ...this.state,
            giphyModal:false,
        })
    }

    createMessageObj = (type,userObj,receiver,msg)=>{
        const message = {
            sender:userObj.username,
            senderName:userObj.name,
            senderPhoto:userObj.imageUrl,
            text:msg,
            type:type,
            read:false,
            receiver:receiver.name,
            receiverUsername:receiver.username,
        }
        return message
    }

    currentUser = async (user)=> {
        const {collection,userObj,mobile} = this.state;
        const userIndex = collection.findIndex(userr => userr.username === user.username)
        const msgReceiver = collection[userIndex];
        
        if(userIndex === -1){
            const fetchMessages = await this.fetchMessages(userObj.username,user.username)
            const lstMsg = fetchMessages.msgs[fetchMessages.msgs.length - 1]
            
            const msgInfo = {
                read:true,
                unReadMsgs : [],
                name:user.name,
                username:user.username,
                typing:false,
                photo:user.imageUrl,
                conversation:fetchMessages.msgs
            }
            const updateCollection = [...this.state.collection,msgInfo]
            console.log(updateCollection)

            this.setState({
                ...this.state,
                receiver:{username:user.username,name:user.name},
                collection:updateCollection,
            },()=>{this.autoScrollToBottom()})

            if(lstMsg && lstMsg.sender !== userObj.username && !msgReceiver.read){
                this.sendMultipleSeenReq(lstMsg.sender,lstMsg.receiverUsername,userIndex)
            }
            return;
        }
        
        const lstMsg = msgReceiver.conversation[msgReceiver.conversation.length - 1]
         
        this.setState({
            ...this.state,
            receiver:{username:user.username,name:user.name},
            messageArea:mobile && true,
            collection,
        },()=>this.autoScrollToBottom())

        if(lstMsg && lstMsg.sender !== userObj.username && !msgReceiver.read){
            return this.sendMultipleSeenReq(lstMsg.sender,lstMsg.receiverUsername,userIndex)
        }
    }

    closeMessageArea = ()=>{
        this.setState({
            ...this.state,
            messageArea:false,
            receiver:{}
        })
    }

    typingIndicator= (typingState)=>{
        console.log('focused')
        const {receiver,userObj} = this.state
        if(!receiver.username) console.log("user not selected")

        socket.emit(typingState,{
            receiver:receiver.username,
            sender  :userObj.username
        })
    }
    send = ()=>{
        notificationFunc(this.state.userObj.username)
    }
    render(){
        const {userObj:{username},collection,receiver,messageArea,mobile,
        msg,authentication,searchGif,gif,chatLogLoading,loading,loginError} = this.state;

        if(!authentication) return (
            <SignInWithGoogle 
            successLogin={this.successLogin}
            failureLogin = {this.onFailureLogin}
            login={this.googelSignIn} 
            loading={loading}
            errorMessage={loginError}
            isMobile={mobile}/>
        )
        
        const currentUser = collection.find(singleUser => singleUser.username === receiver.username);
        const currentUserconversation = currentUser ? currentUser.conversation : [];
        const value={
            state:this.state,
            setCurrentUser:this.currentUser,
            successLogout:this.successLogout,
            closeMessageArea:this.closeMessageArea
        }
        
        return(
            <ChatData.Provider value={value}>
                <div className={`container  ${mobile && "fixedHeight"}`}>
                    <div className="row">
                        <div className="col-xl-5 col-lg-6 offset-lg-0 col-md-10 offset-md-1 col-sm-12 col-xs-12 no_padding">
                            <ChatTabs chatLog={collection} 
                            fetchChatLogs={this.fetchChatLogs}
                            username={username}
                            saveLogs={this.saveLogs}
                            loading={chatLogLoading}
                            isMobile={mobile}
                            close={this.closeMessageArea}/>

                            {this.state.totalUnreadMsg > 0 &&(
                                <div className="message_count">{this.state.totalUnreadMsg}</div>
                            )}
                        </div>
                        <div className="col-xs-6 col-lg-6 offset-lg-0 col-md-10 offset-md-1 col-sm-12 col-xs-12" style={{height:"80%"}}>
                            <div className={` message_area ${messageArea && "Active "} ${mobile && "opacityZero"}`}>
                                <MessageHeading receiver={receiver} mobile={mobile} collection={collection}/>
                                <Masseges msgs={currentUserconversation} username={username} ref={this.Masseges}/>

                                <MessageForm 
                                submit={this.submit} 
                                changeHandelar={this.changeHandelar}
                                msg={msg}
                                showGiphyModal={this.showGiphyModal}
                                typingIndicator={this.typingIndicator}
                                />
                                
                                {this.state.giphyModal && (
                                    <GiphyModal 
                                    searchGif={searchGif}
                                    fetchGif={this.fetchGiphy}
                                    GifList={gif}
                                    submit={this.submit}
                                    changeHandelar={this.changeHandelar}
                                    hideGiphyModal={this.hideGiphyModal}
                                    loading={this.state.giphyLoading}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div onClick={this.send}>NOTIFY</div>
                </div>
            </ChatData.Provider>
        )
    }
}
