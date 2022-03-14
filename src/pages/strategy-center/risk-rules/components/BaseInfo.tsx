import { useState } from 'react';
import type { FC } from 'react';
import type { FormInstance } from 'antd';
import { Input, Form, Radio, Space } from 'antd';
import { InfoCard } from '@svl-ad/pro-components';
import type { ITableStatus } from '@/common';
import type { IRiskCategory } from '../data';
import NormalDeliveryScopeSelector from '@/components/NormalDeliveryScopeSelector';
import { checkSpecialChars } from '@/utils/regex';
import styles from './BaseInfo.less';

interface IBaseInfoProps {
  status: ITableStatus;
  riskList?: IRiskCategory[];
  updateRiskList: (params: IRiskCategory[]) => void;
  form?: FormInstance;
}

const BaseInfo: FC<IBaseInfoProps> = (props) => {
  const { status, form } = props;
  const [, setScope] = useState('global');

  // const createItem = async (level: string) => {
  //   if (!searchValue) {
  //     message.error('创建新风险类型内容不能为空');
  //     return;
  //   } else if (searchValue.length > 30) {
  //     message.error('风险类型名称不能超过30个字符');
  //     return;
  //   }

  //   try {
  //     const res = await createRun({
  //       risk_name: searchValue,
  //       risk_level: level,
  //     });
  //     updateRiskList([...riskList, res]);
  //     form?.setFieldsValue({
  //       risk_id: res.uid,
  //     });
  //     message.success('创建成功');
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  return (
    <>
      <InfoCard cardTitle="规则信息" showHighLightIcon={false}>
        <Form.Item
          name="name"
          label="规则名称"
          rules={[
            { required: true },
            () => ({
              validator(_, value) {
                if (!value) return Promise.resolve();
                if (checkSpecialChars(value)) {
                  return Promise.reject(
                    new Error('规则名称不能包含除了中英文及数字之外的特殊字符!'),
                  );
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input disabled={status !== 'create'} placeholder="30个字符以内" maxLength={30} />
        </Form.Item>
        <Form.Item name="description" label="规则描述">
          <Input placeholder="50个字符以内" maxLength={50} />
        </Form.Item>
        <Form.Item
          label="下发范围"
          name="scope"
          initialValue="global"
          style={{ marginBottom: '0' }}
          rules={[{ required: true, message: '请选择下发范围' }]}
        >
          <Radio.Group
            onChange={(e) => {
              setScope(e.target.value);
            }}
          >
            <Space>
              <Radio.Button value="global">全局下发</Radio.Button>
              <Radio.Button value="common">普通下发</Radio.Button>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.mode !== currentValues.mode}
        >
          {({ getFieldValue }) => {
            return (
              <Form.Item
                name={'device_ids'}
                style={{ display: getFieldValue('scope') === 'common' ? 'block' : 'none' }}
              >
                <NormalDeliveryScopeSelector
                  chosenData={getFieldValue('device')}
                  className={
                    getFieldValue('scope') === 'common'
                      ? styles.normalDeleverContainer
                      : styles.hidden
                  }
                  width={544}
                  expandedHeight={590}
                  onConfirm={(val) => {
                    form?.setFieldsValue({
                      device_ids: val.map((o: any) => o.uid),
                      device: val,
                    });
                  }}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
      </InfoCard>
      {/* <InfoCard cardTitle="风险类型&响应" showHighLightIcon={false}>
        <Form.Item name="risk_id" label="风险类型" rules={[{ required: true }]}>
          <Select
            allowClear
            showSearch
            style={{ width: 240 }}
            placeholder="请搜索或创建风险类型"
            onSearch={setSearchValue}
            optionFilterProp="children"
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div className={styles.extraOpera}>
                  <div style={{ marginBottom: '12px' }}>+ 选择风险等级并创建</div>
                  <Space>
                    {Object.keys(RiskWarnings).map((level) => {
                      return (
                        <RiskType
                          hover
                          key={level}
                          level={level}
                          onClick={() => createItem(level)}
                        />
                      );
                    })}
                  </Space>
                </div>
              </>
            )}
          >
            {riskList.map((category) => (
              <Option key={category.uid} value={category.uid}>
                {category.name}&nbsp;
                <RiskType level={category.level} />
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="action"
          label="响应动作"
          initialValue="notify"
          style={{ marginBottom: '0' }}
        >
          <Radio.Group disabled>
            <Radio.Button value="notify">风险提示</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </InfoCard> */}
    </>
  );
};

export default BaseInfo;
