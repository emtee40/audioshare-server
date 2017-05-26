import React from 'react';
import MuComponent from '../../util/mushare-react-component';


class AvatarUploadModal extends MuComponent {

  constructor(props) {
    super(props);
    this.updateProgress = this.updateProgress.bind(this);
  }

  componentDidMount() {
    console.log('did mount');
    $('#avatar-upload-modal .progress').progress({
      percent: 0
    });
    this.props.eventEmitter.addListener('update-progress', this.updateProgress);
  }

  componentDidUpdate() {
    console.log('did update');
  }

  updateProgress(percent) {
    console.log(percent);
    $('#avatar-upload-modal .progress').progress('set percent', percent);
  }

  render() {
    return (
      <div className="ui small login modal" id="avatar-upload-modal">
        <div className="ui container">
          <div className="ui progress">
            <div className="bar">
              <div className="progress"></div>
            </div>
            <div className="label">正在上传...</div>
          </div>
        </div>
      </div>
    );
  }
}

class UpdateButton extends MuComponent {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.disabled) {
      return (
        <button
          className="ui button disabled"
          onClick={this.props.handleUpdate}>
          更新
        </button>
      );
    } else {
      return (
        <button
          className="ui primary button"
          onClick={this.props.handleUpdate}>
          更新
        </button>
      );
    }
  }
}

class Profile extends MuComponent {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      gender: '',
      mail: '',
      description: '',
      updateButtonDisabled: true,
    };
    this.eventEmitter = new EventEmitter();
    this.handleChange = this.handleChange.bind(this);
    this.loadUserProfile = this.loadUserProfile.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
  }

  componentDidMount() {
    var self = this;
    $('.profile .avatar .card .image').dimmer({
      on: 'hover'
    });
    $('.profile .form .ui.radio.checkbox').checkbox({
      onChecked: function () {
        console.log($(this).attr('name'));
        console.log($(this).val());
        self.setState({
          updateButtonDisabled: false,
          [$(this).attr('name')]: $(this).val()
        });
      }
    });
    this.loadUserProfile();
  }

  handleChange(event) {
    this.setState({
      updateButtonDisabled: false,
      [event.target.name]: event.target.value
    });
  }

  handleUpdate() {
    console.log('update profile');
  }

  loadUserProfile() {
    var self = this;
    console.log($('#token').val());
    fetch('/api/user/profile/get', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Authorization': $('#token').val()
      },
    })
      .then(self.checkStatus)
      .then(self.parseJSON)
      .then(function (data) {
        self.setState({
          name: data.body.name,
          mail: data.body.mail,
          description: data.body.description,
          gender: data.body.gender,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  uploadAvatar() {
    console.log('upload avatar');
    $('#avatar-upload-modal').modal('show');
    this.eventEmitter.emit('update-progress', 80);
  }

  render() {
    return (
      <div className="profile">
        <AvatarUploadModal
          eventEmitter={this.eventEmitter}/>
        <div className="ui medium header">
          公开信息
        </div>
        <div className="ui divider"></div>
        <div className="ui grid">
          <div className="twelve wide column">
            <div className="ui form">
              <div className="field name">
                <label>昵称 : </label>
                <div className="ui input">
                  <input type="text" name="name" value={this.state.name}
                         onChange={this.handleChange}/>
                </div>
              </div>
              <div className="inline fields">
                <label>性别: </label>
                <div className="field">
                  <div className="ui radio checkbox">
                    <input type="radio" name="gender" value="male"
                           checked={this.state.gender === 'male'}
                           className="hidden"/>
                    <label>男</label>
                  </div>
                </div>
                <div className="field">
                  <div className="ui radio checkbox">
                    <input type="radio" name="gender" value="female"
                           checked={this.state.gender === 'female'}
                           className="hidden"/>
                    <label>女</label>
                  </div>
                </div>
              </div>
              <div className="field mail">
                <label>邮箱: </label>
                <div className="input">
                  <input type="text" readOnly="" name="mail"
                         value={this.state.mail}/>
                </div>
              </div>
              <div className="field description">
                <label>简介: </label>
                <div className="description">
        <textarea
          placeholder="写点什么关于你自己"
          name="description"
          value={this.state.description}
          onChange={this.handleChange}>
        </textarea>
                </div>
              </div>
              <UpdateButton
                disabled={this.state.updateButtonDisabled}
                handleUpdate={this.handleUpdate}
              />
            </div>
          </div>
          <div className="four wide column">
            <div className="avatar">
              <div className="ui raised card">
                <div className="blurring small dimmable image">
                  <div className="ui dimmer">
                    <div className="content">
                      <div className="center">
                        <input type="file" name="file" id="file"
                               className="avatarfile"
                               onChange={this.uploadAvatar}/>
                        <label htmlFor="file">更换头像</label>
                      </div>
                    </div>
                  </div>
                  <img src="/image/avatar.png"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;