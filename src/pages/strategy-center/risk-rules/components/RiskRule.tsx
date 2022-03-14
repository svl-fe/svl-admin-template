import { useState, useEffect } from 'react';
import type { FC, ReactNode } from 'react';
import { useRequest } from 'umi';
import { Form, Spin, Steps, Button, Space } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { Drawer } from 'svl-design';
import type { ITableStatus } from '@/common';
import BaseInfo from './BaseInfo';
import DataIdentify from './DataIdentify';
import TransChannel from './TransChannel';
import RuleOverview from './RuleOverview';
import { arrayToNestObjByTree, convertTreeBy } from '@/utils/tree';
import type {
  IRiskRuleCreateParams,
  IDetectPositions,
  IRiskRuleSteps,
  TRiskRuleStepActions,
  TTransChannels,
  IRiskRuleFormValues,
  IRiskRuleDetail,
  IRiskCategory,
} from '../data';
import { queryTransChannels, queryDectPositions } from '../service.domaindata';
import { queryIdentifyCondList, getFileRuleList } from '../service';
import { queryRiskList } from '../service.risk';
import styles from './RiskRule.less';
import { relations, RiskRuleTitles } from '../const';

interface IRiskRuleProps {
  form: FormInstance;
  status: ITableStatus;
  loading: boolean;
  queryLoading: boolean;
  detailInfo: Partial<IRiskRuleDetail>;
  onClose: () => void;
  createRiskRule: (values: IRiskRuleCreateParams) => void;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const { Step } = Steps;

const RiskRule: FC<IRiskRuleProps> = (props) => {
  const { form, status, loading, queryLoading, onClose, createRiskRule, detailInfo } = props;

  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<Partial<IRiskRuleFormValues>>({});
  const [riskList, setRiskList] = useState<IRiskCategory[]>([]);

  useEffect(() => {
    if (status === 'query') {
      setCurrentStep(4);
    } else {
      setCurrentStep(0);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'create' || status === 'edit') {
      form.resetFields();
      setFormValues({});
    }
  }, [status, form]);

  const { data: condList } = useRequest(
    () => queryIdentifyCondList({ page: 1, limit: 1000, search: '' }),
    {
      formatResult: (res) => res,
    },
  );
  const { data: fileRuleList } = useRequest(
    () => getFileRuleList({ page: 1, limit: 1000, search: '' }),
    {
      formatResult: (res) => res,
    },
  );
  const { data: riskListInit } = useRequest(
    () => queryRiskList({ page: 1, limit: 100, search: '' }),
    {
      formatResult: (res) => res,
    },
  );
  useEffect(() => {
    if (riskListInit?.results?.length) {
      setRiskList(riskListInit.results);
    }
  }, [riskListInit?.results?.length]);

  const { data: positionList = [] } = useRequest(() => queryDectPositions(), {
    formatResult: (res) => convertTreeBy(res, { name: 'key', display_name: 'title' }),
  });

  const { data: channelList = [] } = useRequest(() => queryTransChannels(), {
    formatResult: (res) => convertTreeBy(res, { name: 'key', display_name: 'title' }),
  });

  useEffect(() => {
    if (status === 'query') {
      if (JSON.stringify(detailInfo) === '{}') {
        setFormValues({});
        return;
      }

      const { channels, positions, threshold, ...rest } = detailInfo;

      if (channelList?.length > 0 && positionList?.length > 0) {
        setFormValues({
          ...rest,
          channels: arrayToNestObjByTree(channels, channelList),
          positions: arrayToNestObjByTree(positions, positionList),
          threshold: threshold?.params?.gte,
        });
      }
    }

    if (status === 'edit') {
      if (JSON.stringify(detailInfo) === '{}') {
        setFormValues({});
        return;
      }

      const { channels, positions, threshold, ...rest } = detailInfo;
      if (channelList?.length > 0 && positionList?.length > 0) {
        const data = {
          ...rest,
          channels: arrayToNestObjByTree(channels, channelList),
          positions: arrayToNestObjByTree(positions, positionList),
          threshold: threshold.params.gte,
        };
        setFormValues(data);
        form.setFieldsValue(data);
        console.log('data:', data);
      }
    }
  }, [status, detailInfo, positionList, channelList]);

  const onPrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const onNext = () => {
    form
      .validateFields()
      .then((res) => {
        setFormValues({
          ...formValues,
          ...res,
        });
        setCurrentStep(currentStep + 1);
      })
      .catch(({ errorFields }: any) => {
        const [error] = errorFields || [];
        if (error && error?.name?.length) {
          const firstName = error.name[0];
          if (firstName) {
            form.scrollToField(firstName);
          }
        }
      });
  };

  const getAllValues = (obj: Record<string, string[]>) => {
    const data: string[] = [];
    if (!obj) return [];

    for (const key in obj) {
      obj[key].map((item) => data.push(item));
    }

    return data;
  };

  const onCreate = () => {
    const { channels, positions, threshold, ...rest } = formValues as IRiskRuleFormValues;
    createRiskRule({
      ...rest,
      channels: getAllValues(channels),
      positions: getAllValues(positions),
      threshold: {
        category: 'range',
        params: {
          gte: threshold,
        },
      },
    });
  };

  const steps: IRiskRuleSteps[] = [
    {
      title: '基本信息',
      content: (
        <BaseInfo form={form} status={status} riskList={riskList} updateRiskList={setRiskList} />
      ),
      actions: ['cancel', 'next'],
    },
    {
      title: '数据识别',
      content: (
        <DataIdentify
          form={form}
          condList={condList}
          relations={relations}
          positions={positionList as IDetectPositions[]}
          fileRuleList={fileRuleList}
          riskList={riskList}
          updateRiskList={setRiskList}
        />
      ),
      actions: ['cancel', 'previous', 'next'],
    },
    {
      title: '传输通道',
      content: <TransChannel channels={channelList as TTransChannels[]} />,
      actions: ['cancel', 'previous', 'next'],
    },
    {
      title: '规则概览',
      content: (
        <RuleOverview
          info={formValues}
          condList={condList}
          riskList={riskList}
          relations={relations}
          channels={channelList as TTransChannels[]}
          positions={positionList as IDetectPositions[]}
        />
      ),
      actions: ['cancel', 'previous', 'create'],
    },
    {
      content: (
        <RuleOverview
          info={formValues}
          condList={condList}
          riskList={riskList}
          relations={relations}
          channels={channelList as TTransChannels[]}
          positions={positionList as IDetectPositions[]}
        />
      ),
      actions: ['close'],
    },
  ];

  const handleOpera = (actionList: TRiskRuleStepActions[]) => {
    const OperaMap = {
      cancel: (
        <Button className={styles.button} key="cancel" onClick={onClose}>
          取消
        </Button>
      ),
      previous: (
        <Button className={styles.button} key="prev" onClick={onPrevious}>
          上一步
        </Button>
      ),
      next: (
        <Button className={styles.button} key="next" type="primary" onClick={onNext}>
          下一步
        </Button>
      ),
      create: (
        <Button
          className={styles.button}
          key="create"
          type="primary"
          onClick={onCreate}
          loading={loading}
        >
          {status === 'create' ? '创建' : '完成'}
        </Button>
      ),
      close: (
        <Button className={styles.button} key="create" type="primary" onClick={onClose}>
          关闭
        </Button>
      ),
    };

    return actionList.reduce((prev: ReactNode[], current) => {
      prev.push(OperaMap[current]);
      return prev;
    }, []);
  };

  return (
    <Drawer
      width={640}
      loading={loading}
      onClose={onClose}
      className={styles.ruleDrawer}
      visible={status === 'edit' || status === 'create' || status === 'query'}
      titleName={RiskRuleTitles[status] || ''}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>{handleOpera(steps[currentStep].actions)}</Space>
        </div>
      }
    >
      <Spin spinning={queryLoading}>
        {status === 'create' || status === 'edit' ? (
          <>
            <Steps
              labelPlacement="vertical"
              current={currentStep}
              size="small"
              className={styles.steps}
            >
              {steps.slice(0, 4).map((item) => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <Form
              form={form}
              {...layout}
              style={{
                height: 'calc(100vh - 234px)',
                overflowY: 'auto',
                marginBottom: -24,
              }}
            >
              <div className="steps-content">{steps[currentStep].content}</div>
            </Form>
          </>
        ) : null}

        {status === 'query' ? (
          <div className="steps-content">{steps[currentStep].content}</div>
        ) : null}
      </Spin>
    </Drawer>
  );
};

export default RiskRule;
