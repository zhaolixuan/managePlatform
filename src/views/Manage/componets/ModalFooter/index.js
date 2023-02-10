import { Button } from '@jd/find-react';
import styles from './index.module.less';

export default function ModalFooter({ handleCancel, handleOk, disabled, showMore }) {
  return (
    <div className={styles['footer-wrapper']}>
      {showMore ? 
        <Button type='default' onClick={() => handleCancel && handleCancel()}>
          关闭
        </Button> :
        <>
          <Button type='default' onClick={() => handleCancel && handleCancel()}>
            取消
          </Button>
          {!!handleOk &&
          <Button type='primary' onClick={() => handleOk && handleOk()} disabled={disabled}>
            确定
          </Button>}
        </>
      }
      
    </div>
  )
}
