import React,{Component,useContext} from 'react' 
import Tabs from './Tabs'
import Panel from './Panel'
import ActiveUsers from './ActiveUsers'
import SingleLog from './SingleLog'
import Spinner from './Spinner'
import Profile from './Profile'



class ChatTabs extends Component {
    constructor(props){
        super(props)
        this.state={
            selected:{
                index:0,
            }
        }
    }
    handleChange = async(index)=>{
        if(this.props.isMobile) this.props.close()
        this.setState({
            ...this.state,
            selected:index,
        })
    }
    render(){
        const {chatLog,loading} = this.props
        console.log(chatLog)
        const {selected:{index,title}} = this.state
        const chatHistory = chatLog && chatLog.map(singleLog=> <SingleLog data={singleLog}/>) 
        return(
            <div>
                 <Tabs selected={this.state.selected} handleChange={this.handleChange}>
                    <Panel icon="fa fa-envelope xMargin"title="Messages">
                        { loading ? <Spinner/>:chatHistory }
                    </Panel>
                    <Panel fade icon="online xMargin"title="Active Users">
                        <ActiveUsers/>
                    </Panel>
                    <Panel icon="fa fa-user"title="Account">
                        <Profile/>
                    </Panel>
                </Tabs>
            </div>
        )
    }
}

export default ChatTabs;