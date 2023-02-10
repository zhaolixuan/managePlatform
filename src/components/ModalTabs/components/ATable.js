import { Table, Button } from '@jd/find-react';
import { downloadExcel } from '@/utils/util'
import moment from 'moment';
import styles from './ATable.module.less';
import { toJS } from 'mobx';

const BiaoComp = ({ title = '', tableData = [], loading, downloadExecl, requestParams }) => {
  const columns = [
    {
      title: '序号',
      dataIndex: 'area',
      key: 'area',
      fixed: 'left',
      render: (_, record, index) => {
        if (record.siteName !== '合计') {
          return <>{index + 1}</>
        }
        return {
          children: <>{record.siteName}</>,
          props: {
            colSpan: 1,
          },
        }
      },
      align: 'center',
    },
    {
      title: '场所名称',
      dataIndex: 'siteName',
      key: 'siteName',
      width: 200,
      align: 'center',
      fixed: 'left',
      // render: text => <>{(text && text !== '合计') ? text : '-'}</>
      render: (text, record, index) => {
        if (index !== tableData.length - 1) {
          return <>{(text && text !== '合计') ? text : '-'}</>
        }
        return {
          children: <>-</>,
        }
      },
    },
    {
      title: '场所类型',
      dataIndex: 'siteType',
      key: 'siteType',
      align: 'center',
      width: 140,
      // fixed: 'left',
      // render: text => <>{text || '-'}</>
      render: (text, record, index) => {
        if (index !== tableData.length - 1) {
          return <>{(text && text !== '合计') ? text : '-'}</>
        }
        return {
          children: <>-</>,
        }
      },
    },
    {
      title: '联系人',
      dataIndex: 'linkman',
      key: 'linkman',
      width: 140,
      align: 'center',
      // render: text => <>{text || '-'}</>
      render: (text, record, index) => {
        if (index !== tableData.length - 1) {
          return <>{(text && text !== '合计') ? text : '-'}</>
        }
        return {
          children: <>-</>,
        }
      },
    },
    {
      title: '联系电话',
      dataIndex: 'linkPhone',
      key: 'linkPhone',
      width: 120,
      align: 'center',
      // render: text => <>{text || '-'}</>
      render: (text, record, index) => {
        if (index !== tableData.length - 1) {
          return <>{(text && text !== '合计') ? text : '-'}</>
        }
        return {
          children: <>-</>,
          // props: {
          //   colSpan: 0,
          // },
        }
      },
    },
    {
      title: '主食',
      children: [
        {
          title: '粮油',
          children: [
            {
              title: '大米',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['大米']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['大米']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['大米']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '面粉',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['面粉']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['面粉']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['面粉']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '食用油',
              children: [
                {
                  title: '进货量（公升）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['食用油']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公升）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['食用油']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公升）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['食用油']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '副食',
      children: [
        {
          title: '肉蛋',
          children: [
            {
              title: '猪肉',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['猪肉']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['猪肉']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['猪肉']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '牛肉',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['牛肉']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['牛肉']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['牛肉']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '羊肉',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['羊肉']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['羊肉']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['羊肉']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '鸡肉',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['鸡肉']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['鸡肉']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['鸡肉']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '鸡蛋',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['鸡蛋']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['鸡蛋']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['鸡蛋']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },

    {
      title: '蔬菜',
      children: [
        {
          title: '蔬菜',
          children: [
            // {
            //   title: '蔬菜',
            //   children: [
            //     {
            //       title: '进货量（公斤）',
            //       dataIndex: 'linkPhone',
            //       key: 'linkPhone',
            //       width: 120,
            //       align: 'center',
            //       render: (text, record) => <>{record['蔬菜']?.purchaseQuantity || '-'}</>
            //     },
            //     {
            //       title: '销售量（公斤）',
            //       dataIndex: 'linkPhone',
            //       key: 'linkPhone',
            //       width: 120,
            //       align: 'center',
            //       render: (text, record) => <>{record['蔬菜']?.salesVolume || '-'}</>
            //     },
            //     {
            //       title: '库存量（公斤）',
            //       dataIndex: 'linkPhone',
            //       key: 'linkPhone',
            //       width: 120,
            //       align: 'center',
            //       render: (text, record) => <>{record['蔬菜']?.stock || '-'}</>
            //     },
            //   ]
            // },
            {
              title: '豆椒菇',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['豆椒菇']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['豆椒菇']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['豆椒菇']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '根茎调味蔬菜',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['根茎调味蔬菜']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['根茎调味蔬菜']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['根茎调味蔬菜']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '瓜果结球蔬菜',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['瓜果结球蔬菜']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['瓜果结球蔬菜']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['瓜果结球蔬菜']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '加工菜',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['加工菜']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['加工菜']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['加工菜']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '叶菜',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['叶菜']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['叶菜']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['叶菜']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '牛奶',
      children: [
        {
          title: '牛奶',
          children: [
            {
              title: '牛奶',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['牛奶']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['牛奶']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['牛奶']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '水果',
      children: [
        {
          title: '水果',
          children: [
            {
              title: '水果',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['水果']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['水果']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['水果']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '海鲜',
      children: [
        {
          title: '海鲜',
          children: [
            {
              title: '海鲜',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['海鲜']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['海鲜']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['海鲜']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '奶粉',
      children: [
        {
          title: '奶粉',
          children: [
            {
              title: '婴幼儿奶粉',
              children: [
                {
                  title: '进货量（罐）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['婴幼儿奶粉']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（罐）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['婴幼儿奶粉']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（罐）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['婴幼儿奶粉']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '方便食品',
      children: [
        {
          title: '方便食品',
          children: [
            {
              title: '方便面',
              children: [
                {
                  title: '进货量（袋/桶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 140,
                  align: 'center',
                  render: (text, record) => <>{record['方便面']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（袋/桶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 140,
                  align: 'center',
                  render: (text, record) => <>{record['方便面']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（袋/桶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 140,
                  align: 'center',
                  render: (text, record) => <>{record['方便面']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '火腿肠',
              children: [
                {
                  title: '进货量（支）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['火腿肠']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（支）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['火腿肠']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（支）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['火腿肠']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '自热速食',
              children: [
                {
                  title: '进货量（袋/盒）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 140,
                  align: 'center',
                  render: (text, record) => <>{record['自热速食']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（袋/盒）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 140,
                  align: 'center',
                  render: (text, record) => <>{record['自热速食']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（袋/盒）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 140,
                  align: 'center',
                  render: (text, record) => <>{record['自热速食']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '面包',
              children: [
                {
                  title: '进货量（袋）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['面包']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（袋）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['面包']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（袋）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['面包']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '饼干',
              children: [
                {
                  title: '进货量（袋/盒）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 140,
                  align: 'center',
                  render: (text, record) => <>{record['饼干']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（袋/盒）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 140,
                  align: 'center',
                  render: (text, record) => <>{record['饼干']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（袋/盒）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 140,
                  align: 'center',
                  render: (text, record) => <>{record['饼干']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '预包装熟食',
              children: [
                {
                  title: '进货量（袋）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['预包装熟食']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（袋）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['预包装熟食']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（袋）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['预包装熟食']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '矿泉水',
      children: [
        {
          title: '矿泉水',
          children: [
            {
              title: '矿泉水',
              children: [
                {
                  title: '进货量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['矿泉水']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['矿泉水']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['矿泉水']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '速冻食品',
      children: [
        {
          title: '速冻食品',
          children: [
            {
              title: '速冻食品',
              children: [
                {
                  title: '进货量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['速冻食品']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['速冻食品']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（公斤）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['速冻食品']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '罐头',
      children: [
        {
          title: '罐头',
          children: [
            {
              title: '罐头',
              children: [
                {
                  title: '进货量（听）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['罐头']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（听）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['罐头']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（听）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['罐头']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '调味品',
      children: [
        {
          title: '调味品',
          children: [
            {
              title: '盐',
              children: [
                {
                  title: '进货量（袋）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['盐']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（袋）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['盐']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（袋）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['盐']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '糖',
              children: [
                {
                  title: '进货量（袋）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['糖']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（袋）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['糖']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（袋）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['糖']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '酱油',
              children: [
                {
                  title: '进货量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['酱油']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['酱油']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['酱油']?.stock || '-'}</>
                },
              ]
            },
            {
              title: '醋',
              children: [
                {
                  title: '进货量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['醋']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['醋']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['醋']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '纸品',
      children: [
        {
          title: '纸品',
          children: [
            {
              title: '纸品',
              children: [
                {
                  title: '进货量（提）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['纸品']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（提）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['纸品']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（提）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['纸品']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '洗发护发',
      children: [
        {
          title: '洗发护发',
          children: [
            {
              title: '洗发护发',
              children: [
                {
                  title: '进货量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['洗发护发']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['洗发护发']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['洗发护发']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '衣物清洁',
      children: [
        {
          title: '衣物清洁',
          children: [
            {
              title: '衣物清洁',
              children: [
                {
                  title: '进货量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['衣物清洁']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['衣物清洁']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['衣物清洁']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '家居清洁',
      children: [
        {
          title: '家居清洁',
          children: [
            {
              title: '家居清洁',
              children: [
                {
                  title: '进货量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['家居清洁']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['家居清洁']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（瓶）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['家居清洁']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '牙膏',
      children: [
        {
          title: '牙膏',
          children: [
            {
              title: '牙膏',
              children: [
                {
                  title: '进货量（支）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['牙膏']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（支）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['牙膏']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（支）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['牙膏']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    {
      title: '卫生棉',
      children: [
        {
          title: '卫生棉',
          children: [
            {
              title: '卫生棉',
              children: [
                {
                  title: '进货量（包）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['卫生棉']?.purchaseQuantity || '-'}</>
                },
                {
                  title: '销售量（包）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['卫生棉']?.salesVolume || '-'}</>
                },
                {
                  title: '库存量（包）',
                  dataIndex: 'linkPhone',
                  key: 'linkPhone',
                  width: 120,
                  align: 'center',
                  render: (text, record) => <>{record['卫生棉']?.stock || '-'}</>
                },
              ]
            },
          ]
        },
      ],
    },
    // {
    //   title: '主食库存（公斤）（米面）',
    //   dataIndex: 'stapleFood',
    //   key: 'stapleFood',
    //   width: 130,
    //   align: 'center'
    // },
    // {
    //   title: '副食库存（公斤）（猪肉，牛肉，羊肉，鸡肉，鸡蛋）',
    //   dataIndex: 'subsidiaryFood',
    //   key: 'subsidiaryFood',
    //   width: 130,
    //   align: 'center'
    // },
    // {
    //   title: '蔬菜水果库存（公斤）',
    //   dataIndex: 'vegetableFruit',
    //   key: 'vegetableFruit',
    //   width: 160,
    //   align: 'center'
    // },
    // {
    //   title: '订单数量（单）',
    //   dataIndex: 'orderNum',
    //   key: 'orderNum',
    //   width: 140,
    //   align: 'center'
    // },
    // {
    //   title: '昨日库存量（公斤）',
    //   dataIndex: 'yesterdayStock',
    //   key: 'yesterdayStock',
    // },
    // {
    //   title: '蔬菜日进货量（公斤）',
    //   dataIndex: 'yesterdayPurchase',
    //   key: 'yesterdayPurchase',
    // },
    // {
    //   title: '蔬菜库存量（公斤）',
    //   dataIndex: 'yesterdayVegetableStock',
    //   key: 'yesterdayVegetableStock',
    // },
    // {
    //   title: '蔬菜日销售量（公斤）',
    //   dataIndex: 'vegetableDayStock',
    //   key: 'vegetableDayStock',
    // },
    // {
    //   title: '建议对管控区补货量(公斤）',
    //   dataIndex: 'suggestReplenishment',
    //   key: 'suggestReplenishment',
    // },
  ];
  const download = async () => {
    const res = await downloadExecl({ streetName: title, ...requestParams });
    downloadExcel(res, `${title}管控区域保供指挥图-${moment().format('YYYY-MM-DD')}`)
  }
  return (
    <div className={styles.tabs_body_biao_night}>
      <div className={styles.top}>
        <div className={styles.title}>
          <h2>{title}管控区域保供指挥图</h2>
          <div className={styles.date}>
            <span>北京市商务局 /</span>
            <span>{moment().format('YYYY-MM-DD')}</span>
          </div>
        </div>
        <Button className={styles.down_btn} type='info' onClick={download}>导出</Button>
      </div>
      <Table
        rowClassName={(record, index) => {
          if (index % 2) {
            return styles.rows;
          }
          return styles.row;
        }}
        loading={loading}
        dataSource={tableData || []}
        columns={columns}
        scroll={{ x: 'max-content', y: '540px' }}
        pagination={false}
      />
    </div>
  );
};

export default BiaoComp;
