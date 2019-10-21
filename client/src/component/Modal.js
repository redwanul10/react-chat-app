import React,{Component} from 'react'
import PostForm from './PostForm'

class Modal extends Component{
    constructor(props){
      super(props)
      this.state={
        title:this.props.Data.title,
        description:this.props.Data.description
      }
    }
    handleChange(event){
        this.setState({
            [event.target.name]:event.target.value
        })
    }
    render(){
      const {title,description} = this.state
      const {Data} = this.props;
      Data.title = title;
      Data.description = description
      return(
        <div className="modal-bc" style={style.modal}>
          
          <div class="modal-dialog" role="document" style={style.removeBlur}>
            <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Edit Tweet</h5>
                  <button onClick={this.props.close}type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div style={{width: '25rem',margin:"10px auto"}}>
                    <div class="form-group">
                        <label >Enter Title</label>
                        <input  onChange={event=>{this.handleChange(event)}}type="email" class="form-control" name='title' placeholder="Enter Title" value={title}/>
                    </div>
                    <div class="form-group">
                        <label >Example textarea</label>
                        <textarea onChange={event=>{this.handleChange(event)}} name='description' placeholder="Enter Description"class="form-control"  rows="3" value={description}></textarea>
                    </div>
                </div>
              </div>
              <div class="modal-footer">
                <button onClick={()=>{this.props.update(Data)}}type="button" class="btn btn-primary">Save changes</button>
              </div>
            </div>
        </div>
      
        </div>    
      )
    }
}

export default Modal;

const style ={
  modal:{
    position: "fixed",
    zIndex: "1",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.4)",
  },
  removeBlur:{backfaceVisibility: "hidden"}
}