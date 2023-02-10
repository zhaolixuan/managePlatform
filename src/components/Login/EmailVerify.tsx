// 邮箱验证码
import React, { Component } from 'react';
import { Button, Form, Input, message } from '@jd/find-react';
import { LOGIN_ENCRY } from '@/config';
import cryptoEncrypt from '@/utils/cryptoEncrypt';
import loginAdapter from './loginAdapter';
import pluginConfig from './login.config';

const FormItem = Form.Item;

class EmailVerify extends Component<any, any> {
  timer: any;

  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      sendCodeDisabled: false,
      sendCodeText: '发送验证码',
    };
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  hasErrors = () => {
    const { form } = this.props;
    return (
      !form.isFieldsTouched(true) ||
      form.getFieldsError(['username', 'password']).filter(({ errors }) => errors.length).length
    );
  };

  countDown = () => {
    this.timer && clearInterval(this.timer);
    let restTime = 60;
    this.timer = setInterval(() => {
      if (restTime === 0) {
        clearInterval(this.timer);
        this.setState({
          sendCodeDisabled: false,
          sendCodeText: '发送验证码',
        });
      } else {
        this.setState({
          sendCodeText: `${restTime--}秒后重新发送`,
        });
      }
    }, 1000);
  };

  sendValidCode = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields(['username', 'password'], { force: true }).then((values) => {
      this.setState({ sendCodeDisabled: true });
      let params = values;
      if (pluginConfig.pwdEncrypt) {
        params = {
          ...params,
          password: cryptoEncrypt(params.password, LOGIN_ENCRY.key, LOGIN_ENCRY.iv),
        };
      }
      loginAdapter
        .post(pluginConfig.sendCodeApi, params)
        .then(() => {
          message.success('验证码已发送');
          this.countDown();
        })
        .catch((error) => {
          message.error(error.message);
          this.setState({
            sendCodeDisabled: false,
          });
        });
    });
  };

  render() {
    const { onPressEnter } = this.props;
    const { sendCodeDisabled, sendCodeText } = this.state;
    return (
      <div className='valid-code'>
        <FormItem
          label='验证码'
          name='email'
          rules={[
            {
              required: true,
              message: '请输入验证码',
            },
          ]}
          className='valid-code-input'
        >
          <Input placeholder='请输入验证码' onPressEnter={onPressEnter} />
        </FormItem>
        <Form.Item shouldUpdate className='valid-code-btn'>
          {() => (
            <Button disabled={this.hasErrors() || sendCodeDisabled} onClick={this.sendValidCode}>
              {sendCodeText}
            </Button>
          )}
        </Form.Item>
      </div>
    );
  }
}

export default EmailVerify;
