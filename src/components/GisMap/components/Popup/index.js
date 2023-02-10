import { memo } from 'react';
import { Popup as DMapPopup } from '@/components/DmapglMap';
import PopupSimple from './popupSimple'
import PopupComplex from './popupComplex';
import * as popupColums from './constants'
import styles from './index.module.less'
/**
 * @param {Object}   data {*popupType} 组件数据
 * @param {Function} onPopupClose      组件关闭回调
 */
const Popup = memo((props) => {
    const { data, onPopupClose,theme } = props
    console.log(data);
    const renderPopup = () => {
        const title = `${data.typeName || data.type}详情`
        const columns = popupColums[`popupType${data.popupType}`]
        if(data.popupType === 4 || data.popupType === 6){
            return <PopupComplex title={title} columns={columns} detail={data} theme={theme} onPopupClose={onPopupClose}/>
        }
        return <PopupSimple title={title} columns={columns} detail={data} theme={theme} onPopupClose={onPopupClose}/>
    }
    
    return (
        data && data.lng && data.lat && data.lng != 'null' && data.lat != 'null' && !Number.isNaN(+data.lng) && !Number.isNaN(+data.lat) ? <DMapPopup
            key={Math.random()}
            className={styles['popup-wrapper']}
            html={renderPopup()}
            closeButton={true}
            LngLat={[+data.lng, +data.lat]}
            anchor='top-left'
            offset={ data?.popupType === 5 ? [45, -5] : [25, -5]}
            // close={() => onPopupClose()}
        />:<></>
    )
}, (preProps, nextProps)=>{
    const diff =  JSON.stringify({data: preProps.data, theme: preProps.theme}) === JSON.stringify({data: nextProps.data, theme: nextProps.theme})
    // Object.assign(nextProps, { oldValue: preProps.data})
    return diff
})
export default Popup