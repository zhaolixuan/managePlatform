import React from 'react';
import { Button, Form, Input, message } from '@jd/find-react';
import { parse } from 'qs';
import { useStore } from '@/hooks';
// import { LOGIN_ENCRY } from '@/config';
// import cryptoEncrypt from '@/utils/cryptoEncrypt';
import EmailVerify from './EmailVerify';
import loginAdapter from './loginAdapter';
import pluginConfig from './login.config';
import styles from './index.module.less';

const FormItem = Form.Item;

const LoginPage = ({ afterLogin }) => {
  const [form] = Form.useForm();
  const { setCurRegion } = useStore('gis');
  // const [, forceUpdate] = useState();
  // useEffect(() => {
  //   forceUpdate({});
  // }, []);

  // const hasErrors = () =>
  //   !form.isFieldsTouched(true) || form.getFieldsError().filter(({ errors }) => errors.length).length > 0;
  const hasErrors = () => form.getFieldsError().filter(({ errors }) => errors.length).length > 0;

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        let params = values;
        if (pluginConfig.pwdEncrypt) {
          params = {
            ...params,
            // password: cryptoEncrypt(params.password, LOGIN_ENCRY.key, LOGIN_ENCRY.iv),
          };
        }
        loginAdapter.post(pluginConfig.loginApi, params).then((res) => {
          afterLogin && afterLogin(res);
          // @ts-ignore
          const { accessToken, area } = res;
          sessionStorage.setItem('loginInfo', JSON.stringify(res));
          sessionStorage.setItem('token', accessToken);
          sessionStorage.setItem('area', area);
          setCurRegion(area || '北京');
          const serach = window.location.search.replace(/\/+$/, '/');
          const { redirectUrl } = parse(serach, { ignoreQueryPrefix: true });
          if (redirectUrl) {
            window.location.href = decodeURIComponent(redirectUrl && redirectUrl[0]);
            return;
          }
          window.location.hash = pluginConfig.redirectAfterLogin;
        });
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  return (
    <div className={styles['login-plugin']}>
      <div className={styles['login-bg-img']}>
        <div className={styles['login-part']}>
          <p className={styles['login-tip']}>登录</p>
          <Form className={styles['login-form']} form={form}>
            <FormItem
              label='账号'
              name='username'
              rules={[
                {
                  required: true,
                  message: '请输入账号',
                },
              ]}
            >
              <Input placeholder='请输入邮箱/ID' onPressEnter={handleOk} />
            </FormItem>
            <FormItem
              label='密码'
              name='password'
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input type='password' placeholder='请输入密码' onPressEnter={handleOk} />
            </FormItem>
            {pluginConfig.hasVerifyCode && <EmailVerify form={form} onPressEnter={handleOk} />}
            <Form.Item shouldUpdate>
              {() => (
                <Button type='primary' size='large' onClick={()=>handleOk()} style={{ width: 340 }} disabled={hasErrors()}>
                  登录
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
