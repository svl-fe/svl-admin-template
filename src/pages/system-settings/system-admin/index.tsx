import { useState } from 'react';
import { useRequest } from 'umi';
import moment from 'moment';
import { Space, Button, Form, message } from 'antd';
import { Popconfirm } from 'svl-design';
import type { TablePaginationConfig, TableColumnProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { InfoCard } from '@svl-ad/pro-components';
import { Table } from '@/components/UiComponent';
import { addSerialNumber, DFT_PAGE_OPTION } from '@/utils/table';
import type { ITableQuery, ITableStatus } from '@/common';
import { querySysAdminList, createSysAdmin, deleteSysAdmin, updateSysAdmin } from './service';
import Admin from './components/Admin';
import { TIME_FMT } from '@/const/filters';
import type {
  ISystemAdmin,
  ICreateSystemAdmin,
  IUpdateSystemAdmin,
  ICreateSystemAdminForm,
} from './data';
import style from './index.less';

const SystemAdmin: React.FC = () => {
  const [status, setStatus] = useState<ITableStatus>('list');
  const [currentId, setCurrentId] = useState<string>('');
  const [filters, setFilters] = useState<ITableQuery>({
    ...DFT_PAGE_OPTION,
    search: '',
  });
  const [form] = Form.useForm();

  const {
    loading,
    data: listData,
    refresh,
  } = useRequest(() => querySysAdminList(filters), {
    refreshDeps: [filters],
    formatResult: (res) => {
      return { ...res, results: addSerialNumber(res.results, filters) };
    },
  });

  const { run: createRun, loading: createLoading } = useRequest(
    (params: ICreateSystemAdmin) => createSysAdmin(params),
    { manual: true },
  );

  const { run: updateRun, loading: updateLoading } = useRequest(
    (params: IUpdateSystemAdmin) => updateSysAdmin(params),
    { manual: true },
  );

  const { run: deleteRun } = useRequest((params) => deleteSysAdmin(params), { manual: true });

  const handleCreate = () => {
    setStatus('create');
    form.resetFields();
  };

  const handlePageChange = ({ current, pageSize }: TablePaginationConfig) => {
    setFilters({
      ...filters,
      page: current || filters.page,
      limit: pageSize || filters.limit,
    });
  };

  const editItem = async (data: ISystemAdmin) => {
    try {
      setStatus('edit');
      setCurrentId(data.uid);
      form.setFieldsValue({
        name: data.name,
        password: '',
        confirm: '',
      });
    } catch (e) {
      console.log('e:', e);
    }
  };

  const createItem = async (values: ICreateSystemAdmin) => {
    try {
      await createRun(values);
      message.success('创建成功');
      refresh();
    } catch (e) {
      console.log(e);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteRun(id);
      message.success('删除成功');
      refresh();
    } catch (e) {
      console.log(e);
    }
  };

  const updateItem = async (values: IUpdateSystemAdmin) => {
    try {
      await updateRun(values);
      setStatus('list');
      message.success('更新成功');
      refresh();
    } catch (e) {
      console.log(e);
    }
  };

  const handleOk = (data: ICreateSystemAdminForm) => {
    const { confirm, ...rest } = data;

    if (status === 'create') {
      createItem(rest);
      setStatus('list');
    } else {
      updateItem({ id: currentId, data: rest });
      setStatus('list');
    }
  };

  const columns: TableColumnProps<ISystemAdmin>[] = [
    {
      title: '序号',
      dataIndex: '__serial_num',
      key: '__serial_num',
      width: 75,
    },
    {
      title: '管理员用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (text) => (text === 'admin' ? '管理员' : '超级管理员'),
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text) => moment(text).format(TIME_FMT),
    },
    {
      title: '最近登录',
      key: 'last_login',
      dataIndex: 'last_login',
      render: (text) => (text ? moment(text).format(TIME_FMT) : '---'),
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      width: 160,
      render: (text, record) =>
        record.role === 'admin' || record.role === 'super_admin' ? (
          <Space className={style.action}>
            <span onClick={() => editItem(record)}>编辑</span>
            <Popconfirm
              title="确定删除该用户吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => deleteItem(record.uid)}
            >
              <span>删除</span>
            </Popconfirm>
          </Space>
        ) : null,
    },
  ];

  return (
    <PageContainer header={{ title: null }}>
      <InfoCard cardTitle="系统管理员">
        <div className={style.filterWrapper}>
          <div className={style.filters} />
          <div className={style.opera}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新增管理员
            </Button>
          </div>
        </div>

        <Table
          loading={loading}
          columns={columns}
          total={listData?.total || 0}
          rowKey={(record) => record.__serial_num}
          dataSource={listData?.results || []}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            showSizeChanger: false,
          }}
          onChange={handlePageChange}
        />

        <Admin
          form={form}
          status={status}
          loading={createLoading || updateLoading}
          onOk={handleOk}
          onClose={() => setStatus('list')}
        />
      </InfoCard>
    </PageContainer>
  );
};

export default SystemAdmin;
