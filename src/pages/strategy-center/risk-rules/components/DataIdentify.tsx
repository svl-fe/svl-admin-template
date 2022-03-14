import type { FC } from 'react';
import { useState } from 'react';
import type { FormInstance } from 'antd';
import { Form, Select, message, Radio, Space, Divider } from 'antd';
import { InfoCard } from '@svl-ad/pro-components';
import type { ITableResult } from '@/common';
import type {
  IDetectPositions,
  IRiskCategory,
  IRiskCategoryCreateParams,
  IRiskRelation,
} from '../data';
import type { IConditionDetail, IFileRule } from '../../data-identify/data';
import { createRisk } from '../service.risk';
import styles from './RiskRule.less';
import RiskType, { RiskWarnings } from '@/components/RiskType';
import { useRequest } from 'umi';
const { Option } = Select;

interface IDataIdentifyProps {
  positions: IDetectPositions[];
  condList: ITableResult<IConditionDetail> | undefined;
  relations: IRiskRelation[];
  fileRuleList: ITableResult<IFileRule> | undefined;
  riskList?: IRiskCategory[];
  updateRiskList: (params: IRiskCategory[]) => void;
  form: FormInstance;
}

const DataIdentify: FC<IDataIdentifyProps> = (props) => {
  const { fileRuleList, riskList, updateRiskList, form } = props;
  const [searchValue, setSearchValue] = useState('');
  const { run: createRun } = useRequest((params: IRiskCategoryCreateParams) => createRisk(params), {
    manual: true,
    formatResult: (res) => res,
  });

  const createItem = async (level: string) => {
    if (!searchValue) {
      message.error('创建新风险类型内容不能为空');
      return;
    } else if (searchValue.length > 30) {
      message.error('风险类型名称不能超过30个字符');
      return;
    }

    try {
      const res = await createRun({
        name: searchValue,
        level: level,
      });
      updateRiskList([...riskList, res]);
      form?.setFieldsValue({
        risk_id: res.uid,
      });
      message.success('创建成功');
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <InfoCard cardTitle="" showHighLightIcon={false}>
        <Form.Item name="filerule_ids" label="文件规则名称" rules={[{ required: true }]}>
          <Select
            allowClear
            showSearch
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择数据识别条件"
          >
            {fileRuleList?.results?.map((item) => (
              <Option key={item.uid} value={item.uid}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </InfoCard>
      <InfoCard cardTitle="风险类型&响应" showHighLightIcon={false}>
        <Form.Item name="risk_id" label="风险类型" rules={[{ required: true }]}>
          <Select
            allowClear
            showSearch
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
            {riskList?.map((category) => (
              <Option key={category.uid} value={category.uid}>
                {category.name}&nbsp;
                <RiskType level={category.level} />
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="响应动作"
          name="action"
          initialValue="notify"
          style={{ marginBottom: '0' }}
          rules={[{ required: true, message: '请选择下发范围' }]}
        >
          <Radio.Group>
            <Space>
              <Radio.Button value="notify">风险提示</Radio.Button>
              <Radio.Button value="block" disabled>
                外传阻断
              </Radio.Button>
            </Space>
          </Radio.Group>
        </Form.Item>
      </InfoCard>
      {/* <InfoCard cardTitle="条件配置" showHighLightIcon={false}> */}
      {/* <Form.Item name="condition_ids" label="数据识别条件" rules={[{ required: true }]}>
          <Select
            allowClear
            showSearch
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择数据识别条件"
            onChange={onChange}
          >
            {condList?.results?.map((item) => (
              <Option key={item.uid} value={item.uid}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item> */}

      {/* <Form.Item
          label={
            <div>
              <span className="required-error">*</span>条件阈值
            </div>
          }
          labelAlign="left"
          labelCol={{ span: 4 }}
        >
          <span>至少&nbsp;</span>
          <Form.Item
            name="threshold"
            noStyle
            initialValue={1}
            rules={[{ required: true, message: '请选择条件阈值' }]}
          >
            <InputNumber min={1} step={1} formatter={(value) => `${value && Math.floor(value)}`} />
          </Form.Item>
          <span>&nbsp;个数据匹配中时</span>
        </Form.Item> */}

      {/* <Form.Item
          label={
            <div>
              <span className="required-error">*</span>条件关系
            </div>
          }
          labelAlign="left"
          labelCol={{ span: 4 }}
          style={{ marginBottom: 0 }}
        >
          <span>当选中的条件&nbsp;</span>
          <Form.Item
            name="relation"
            noStyle
            rules={[{ required: true, message: '请选择条件关系' }]}
          >
            <Select allowClear style={{ width: 80 }}>
              {relations.map((item) => {
                return (
                  <Option key={item.key} value={item.key}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <span>&nbsp;满足时</span>
        </Form.Item> */}
      {/* </InfoCard> */}

      {/* <InfoCard cardTitle={null} showHighLightIcon={false}>
        <Form.Item
          name="positions"
          label={
            <div className="flex-center">
              扫描文件识别位置
              <Tooltip title="请至少选择一项">
                <MyIcon type="icon-wenzitishi" className={styles.toolTip} />
              </Tooltip>
            </div>
          }
          rules={[
            { required: true, message: '扫描文件识别位置不能为空' },
            () => ({
              validator(_, value) {
                if (!value) return Promise.resolve();
                if (JSON.stringify(value) === '{}') {
                  return Promise.reject('扫描文件识别位置不能为空');
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          {/* @ts-ignore */}
      {/* <CheckboxTree treeData={positions} /> */}
      {/* </Form.Item> */}
      {/* </InfoCard> */}
    </>
  );
};

export default DataIdentify;
