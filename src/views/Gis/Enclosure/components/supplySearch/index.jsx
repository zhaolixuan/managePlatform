/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { Form, InputNumber } from '@jd/find-react';
import styles from './index.modules.less';

function SupplySearch(
  {
  handleRefresh = () => {},
  radiusConfig: {
    lifeRadius,
    deliverRadius
  },
  theme
}
) {
  const [form] = Form.useForm();
  const submit = () => {
    form.validateFields().then((values) => {
      handleRefresh(values);
      form.resetFields();
    })
  }
  return (
    <div className={styles.supply_search}>
      <Form
        form={form}
        name='register'
        initialValues={{
          lifeRadius: lifeRadius / 1000,
          deliverRadius: deliverRadius / 1000,
        }}
        scrollToFirstError
      >
        <Form.Item
          name='lifeRadius'
          label='生活圈'
          rules={[
            {
              required: true,
              message: '请输入生活圈范围',
            }
          ]}
        >
          <InputNumber addonAfter='公里' min={0} max={10} />
        </Form.Item>
        <Form.Item
          name='deliverRadius'
          label='配送圈'
          rules={[
            {
              required: true,
              message: '请输入配送圈范围',
            }
          ]}
        >
          <InputNumber addonAfter='公里' min={0} max={10} />
        </Form.Item>
      </Form>
      <div className={styles.refresh} onClick={submit}>
        <img src={require(`@/assets/images/${theme}/refresh.png`)} alt='' /> 
        <span>刷新</span>
      </div>
    </div>
  );
}

export default SupplySearch;
