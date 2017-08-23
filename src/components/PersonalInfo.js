import React, {Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {findDOMNode} from 'react-dom';
import axios from 'axios';
import {RaisedButton, TextField} from "material-ui";
import SimpleDialog from "./utils/SimpleDialog";

const style = {
  container: {
    textAlign: 'center',
  },
  avatar: {},
  fieldContainer: {
    marginLeft: '400px',
    marginTop: '80px'
  },
  ok: {
    marginTop: '60px',
    marginLeft: '-40px',
    marginBottom: '100px'
  },
  text: {
    textAlign: 'center',
    fontSize: '50px',
    marginTop: '200px'
  },
  fileInput: {
    marginTop: '20px'
  },
  left: {
    position: 'absolute',
    top: '180px',
    left: '330px',
    display: 'flex',
    flexDirection: 'column'
  }
};

class PersonalInfo extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      name: '',
      account: '',
      date: '',
      address: '',
      hobby: '',
      mobile: '',
      nameCheck: true,
      mobileCheck: true,
      addressCheck: true,
      hobbyCheck: true,
    };
  }

  check = (e, type) => {
    if (e.target.value === '') {
      this.setState({[type]: false});
      return;
    }
    this.setState({[type]: true});
  };

  sendRequest = () => {
    console.log(this.state);
    axios
      .put('/UpdateUserInfo', {
        account: this.props.userInfo.account,
        name: this.state.name,
        mobile: this.state.mobile,
        address: this.state.address,
        hobby: this.state.hobby,
        birthday: this.state.date,
      })
      .then(response => alert(response.data));
  };

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  componentDidMount() {

  }

  render() {
    return (
      <div style={style.container}>
        <div style={style.left}>
          {
            this.props.userInfo.avatar
              ?
              <img ref="avatar" height="200px" src={this.props.userInfo.avatar + `?s=120&d=identicon`}/>
              :
              ''
          }
          <input style={style.fileInput} id="file-upload" ref="fileInput" type="file"/>
        </div>
        <div style={style.fieldContainer}>
          <TextField
            onBlur={e => this.check(e, 'nameCheck')}
            hintText="暱稱"
            floatingLabelText="暱稱"
          />
          <br/>
          <TextField
            hintText="手機"
            floatingLabelText="手機"
          />
          <br/>
          <TextField
            hintText="地址"
            floatingLabelText="地址"
          />
          <br/>
          <TextField
            hintText="興趣"
            floatingLabelText="興趣"
          />
          <br/>
          <TextField
            hintText=""
            floatingLabelText=""
          />
          <br/>
        </div>
        <RaisedButton
          label="設定完成" primary={true}
          style={style.ok}
        />
        {this.state.dialog ? <SimpleDialog content={this.state.dialogText} context={this}/> : ''}
      </div>
    );
  }

}

const mapStateToProps = state => ({
  userInfo: state.userInfo
});

export default connect(mapStateToProps, {})(PersonalInfo);