import { useState } from 'react';
import { useRequest } from 'umi';
import { Form, Space, Input, Button, message, Switch } from 'antd';
import { Popconfirm } from 'svl-design';
import type { TablePaginationConfig, TableColumnProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Table } from '@/components/UiComponent';
import { addSerialNumber, DFT_PAGE_OPTION } from '@/utils/table';
import type { ITableQuery, ITableStatus } from '@/common';
import RiskRule from '../components/RiskRule';
import RiskType from '@/components/RiskType';
import {
  queryRiskRuleList,
  createRiskRule,
  queryRiskRuleDetail,
  deleteRiskRule,
  updateRiskRule,
  updateRiskRuleStatus,
} from '../service';
import type {
  IRiskRuleDetail,
  IRiskRuleCreateParams,
  IRiskRuleUpdateParams,
  IRiskRuleStatusChangeParams,
} from '../data';
import style from './index.less';
import EditRuleDrawer from '../components/EditRuleDrawer';

const { Search } = Input;

const SubRiskRules: React.FC = () => {
  const [status, setStatus] = useState<ITableStatus>('list');
  const [currentId, setCurrentId] = useState<string>('');
  const [form] = Form.useForm();
  const [editRuleVisible, setEditRuleVisible] = useState(false);
  const [filters, setFilters] = useState<ITableQuery>({
    ...DFT_PAGE_OPTION,
    limit: 100,
    page: 1,
    search: '',
  });

  const {
    loading,
    data: listData,
    refresh,
  } = useRequest(() => queryRiskRuleList(filters), {
    refreshDeps: [filters],
    formatResult: (res) => {
      return { ...res, results: addSerialNumber(res.results, filters) };
    },
  });
  const { run: createRun, loading: createLoading } = useRequest(
    (params: IRiskRuleCreateParams) => createRiskRule(params),
    { manual: true },
  );

  const { run: updateRun, loading: updateLoading } = useRequest(
    (params: IRiskRuleUpdateParams) => updateRiskRule(params),
    { manual: true },
  );

  const { run: updateRunStatus, loading: updateStatusLoading } = useRequest(
    (params: IRiskRuleStatusChangeParams) => updateRiskRuleStatus(params),
    { manual: true },
  );

  const { run: deleteRun } = useRequest((params) => deleteRiskRule(params), { manual: true });

  const { loading: queryLoading, data: ruleDetail = {} } = useRequest(
    (params: string) => queryRiskRuleDetail(params),
    {
      manual: true,
      formatResult: (res) => res,
    },
  );

  // const editItem = async (id: string) => {
  //   try {
  //     setStatus('edit');
  //     setCurrentId(id);

  //     await queryRun(id);
  //   } catch (e) {
  //     console.log('e:', e);
  //   }
  // };

  const createItem = async (values: IRiskRuleCreateParams) => {
    try {
      await createRun(values);
      setStatus('list');
      message.success('????????????');
      refresh();
    } catch (e) {
      console.log(e);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteRun(id);
      message.success('????????????');
      refresh();
    } catch (e) {
      console.log(e);
    }
  };

  const updateItem = async (values: IRiskRuleUpdateParams) => {
    try {
      await updateRun(values);
      setStatus('list');
      message.success('????????????');
      refresh();
    } catch (e) {
      console.log(e);
    }
  };

  const updateItemStatus = async (values: IRiskRuleStatusChangeParams) => {
    try {
      setCurrentId(values?.id);
      await updateRunStatus(values);
      message.success('????????????');
      refresh();
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = ({ current, pageSize }: TablePaginationConfig) => {
    setFilters({
      ...filters,
      page: current || filters.page,
      limit: pageSize || filters.limit,
    });
  };

  const handleCreate = () => {
    setStatus('create');
  };

  const handleOk = async (data: IRiskRuleCreateParams) => {
    if (status === 'create') {
      await createItem(data);
    } else {
      await updateItem({ id: currentId, ...data });
    }
  };
  const scopeName = {
    global: '????????????',
    common: '????????????',
  };
  const columns: TableColumnProps<IRiskRuleDetail>[] = [
    {
      title: '??????',
      dataIndex: '__serial_num',
      key: '__serial_num',
      width: 75,
    },
    {
      title: '????????????',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '????????????',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (text === 'added' ? '????????????' : '????????????'),
    },
    {
      title: '????????????',
      dataIndex: 'risk_name',
      key: 'risk_name',
    },
    {
      title: '????????????',
      dataIndex: 'risk_level',
      key: 'risk_level',
      render: (text) => {
        return <RiskType level={text} />;
      },
    },
    {
      title: '????????????',
      dataIndex: 'scope',
      key: 'scope',
      render: (text) => {
        return scopeName[text || ''];
      },
    },
    {
      title: '??????',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text, record) => (
        <Switch
          size="small"
          checked={text === 'activated'}
          loading={updateStatusLoading && record.uid === currentId}
          onChange={() =>
            updateItemStatus({
              id: record.uid,
              params: {
                operation: text === 'activated' ? 'deactivate' : 'activate',
              },
            })
          }
        />
      ),
    },
    {
      title: '??????',
      key: 'action',
      dataIndex: 'action',
      width: 160,
      render: (text, record) => (
        <Space className={style.action}>
          <span
            onClick={() => {
              setCurrentId(record.uid);
              setEditRuleVisible(true);
            }}
          >
            ??????
          </span>
          <Popconfirm
            title="???????????????????????????????????????"
            okText="??????"
            cancelText="??????"
            onConfirm={() => deleteItem(record.uid)}
          >
            <span>??????</span>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className={style.filterWrapper}>
        <Space className={style.filters}>
          <Search
            placeholder="?????????????????????"
            allowClear
            onSearch={(value) => setFilters({ search: value, ...DFT_PAGE_OPTION })}
          />
        </Space>
        <div className={style.opera}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            ????????????
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
      <RiskRule
        form={form}
        status={status}
        loading={createLoading || updateLoading}
        queryLoading={queryLoading}
        detailInfo={ruleDetail}
        onClose={() => setStatus('list')}
        createRiskRule={handleOk}
      />
      <EditRuleDrawer
        refresh={() => {
          setFilters({
            ...filters,
          });
        }}
        id={currentId}
        visible={editRuleVisible}
        onClose={() => {
          setEditRuleVisible(false);
        }}
      />
    </>
  );
};

export default SubRiskRules;
