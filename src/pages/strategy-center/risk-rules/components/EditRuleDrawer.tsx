import { useState, useEffect } from 'react';
import { useRequest } from 'umi';
import CheckboxTree from '@/components/UiComponent/checkboxTree';
import { convertTreeBy } from '@/utils/tree';
import { Form, Button, Space, Row, Col, message, Select, Divider, Radio, Input } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { Drawer } from 'svl-design';
import { InfoCard } from '@svl-ad/pro-components';
import type { ITreeData } from '@/common';
import { getFileRuleList, queryRiskRuleDetail, updateRule, editUseScope } from '../service';
import Icon from '@/components/Icon';
import { createRisk, queryRiskList } from '../service.risk';
import styles from './EditRuleDrawer.less';
import RiskType, { RiskWarnings } from '@/components/RiskType';
import { queryTransChannels } from '../service.domaindata';
import { flattenDeep, has } from 'lodash';
import NormalDeliveryScopeSelector from '@/components/NormalDeliveryScopeSelector';
import type { IRiskCategory } from '../data';
const scopeName = {
  global: '全局下发',
  common: '普通下发',
};
const { Option } = Select;
interface IRiskRuleProps {
  id: string;
  visible: boolean;
  onClose: () => void;
  refresh?: () => void;
  editFlag?: boolean;
}

const EditRuleDrawer: React.FC<IRiskRuleProps> = (props) => {
  const { onClose, visible, id, refresh, editFlag = true } = props;
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState('');
  const [, setScope] = useState('');
  const { data: channelList = [], run: getTransformChannelsRun }: any = useRequest(
    queryTransChannels,
    {
      manual: true,
      formatResult: (res) => convertTreeBy(res, { name: 'key', display_name: 'title' }),
    },
  );
  const { data: fileRuleList, run: getFileRuleListRun } = useRequest(
    () => getFileRuleList({ page: 1, limit: 1000, search: '' }),
    {
      manual: true,
      formatResult: (res) => res,
    },
  );
  const { run: getRiskTypeList } = useRequest(
    () => queryRiskList({ page: 1, limit: 100, search: '' }),
    {
      manual: true,
      formatResult: (res) => {
        form.setFieldsValue({
          riskList: res.results,
        });
        return res;
      },
    },
  );
  const { run: createRun } = useRequest(createRisk, {
    manual: true,
    formatResult: (res) => res,
  });
  const {
    run: queryRun,
    loading: queryLoading,
    data: ruleDetail = {},
  }: any = useRequest(queryRiskRuleDetail, {
    manual: true,
    formatResult: (res) => {
      return res;
    },
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
      form.setFieldsValue({
        riskList: [...form.getFieldValue('riskList'), res],
      });
      form?.setFieldsValue({
        risk_id: res.uid,
      });
      message.success('创建成功');
    } catch (e) {
      console.log(e);
    }
  };
  const { run: updateRuleData } = useRequest(updateRule, {
    manual: true,
    formatResult: (res) => {
      return res;
    },
  });
  const { run: editUseScopeData } = useRequest(editUseScope, {
    manual: true,
    formatResult: (res) => {
      return res;
    },
  });
  const actionName = {
    notify: '风险提示',
    block: '外传阻断',
  };

  useEffect(() => {
    if (visible && id) {
      queryRun(id);
      getTransformChannelsRun();
      if (editFlag) {
        getFileRuleListRun();
        getRiskTypeList();
      }
    }
  }, [visible, id]);
  const saveData = (key: string) => {
    let params;
    if (key === 'basic') {
      params = form.getFieldsValue(['name', 'description']);
    } else if (key === 'fileRecognize') {
      params = form.getFieldsValue(['action', 'risk_id', 'filerule_ids']);
    } else if (key === 'riskSource') {
      params = {
        channels: flattenDeep(Object.values(form.getFieldValue('channels') || {})),
      };
    } else if (key === 'deliverRule') {
      if (form.getFieldValue('scope') === 'common') {
        params = form.getFieldsValue(['device_ids', 'scope']);
      } else {
        params = form.getFieldsValue(['scope']);
      }
      editUseScopeData({ id, body: params }).then((res) => {
        if (!has(res, 'code')) {
          message.success('更新成功');
          form.setFieldsValue({
            currentEdit: undefined,
          });
          refresh?.();
          queryRun(id);
        }
      });
      return;
    }
    updateRuleData({ id, params }).then((res) => {
      if (!has(res, 'code')) {
        queryRun(id);
        message.success('更新成功');
        refresh?.();
        form.setFieldsValue({
          currentEdit: undefined,
        });
      }
    });
  };
  const renderRow = (title: string, value: string) => {
    return (
      <Row className={styles.detailItem}>
        <div className={styles.infoLabel}>{title}</div>
        <Col span={20}>{value}</Col>
      </Row>
    );
  };
  const getTags = (values: string[], originData: (ITreeData & Record<string, any>)[]) => {
    const tags: string[] = [];
    originData?.map((o: any) => {
      o.children.map((item: any) => {
        if (values.includes(item.key)) {
          tags.push(item.title);
        }
      });
    });
    return tags;
  };

  const showRisk = () => {
    return (
      <div style={{ marginBottom: '12px' }}>
        {ruleDetail?.risk_name}&nbsp;
        {ruleDetail?.risk_level && <RiskType level={ruleDetail?.risk_level} />}
      </div>
    );
  };

  const renderRiskSource = (innerForm: FormInstance) => {
    const { getFieldValue, setFieldsValue } = innerForm;
    if (getFieldValue('currentEdit') === 'riskSource') {
      return (
        <InfoCard
          cardTitle={
            <div className={styles.infoCardTitleContainer}>
              <div>风险来源</div>
              <Space>
                <Button
                  className={styles.saveButton}
                  onClick={() => setFieldsValue({ currentEdit: undefined })}
                >
                  取消
                </Button>
                <Button
                  className={styles.saveButton}
                  type="primary"
                  onClick={() => saveData('riskSource')}
                >
                  保存
                </Button>
              </Space>
            </div>
          }
          showHighLightIcon={false}
          className={styles.cardContainer}
        >
          <Form.Item
            name="channels"
            label="传输通道"
            rules={[
              { required: true, message: '传输通道不能为空' },
              () => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  if (JSON.stringify(value) === '{}') {
                    return Promise.reject('传输通道不能为空');
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <CheckboxTree treeData={channelList} />
          </Form.Item>
        </InfoCard>
      );
    }

    return (
      <InfoCard
        cardTitle={
          <div className={styles.infoCardTitleContainer}>
            <div>
              风险来源
              {editFlag && (
                <Icon
                  className={styles.editIcon}
                  type="icon-bianji"
                  onClick={() => {
                    const channelObj = {};
                    channelList?.forEach((item: any) => {
                      const arr: any = [];
                      item.children.forEach((subItem: any) => {
                        if (ruleDetail?.channels?.includes(subItem.key)) {
                          arr.push(subItem.key);
                        }
                      });
                      if (arr.length) {
                        channelObj[item.key] = arr;
                      }
                    });
                    setFieldsValue({
                      currentEdit: 'riskSource',
                      channels: channelObj,
                    });
                  }}
                />
              )}
            </div>
          </div>
        }
        showHighLightIcon={false}
        className={styles.cardContainer}
        style={{ pointerEvents: editFlag ? 'auto' : 'none' }}
      >
        <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>传输通道</div>
          <Col span={20}>
            {ruleDetail.channels &&
              getTags(ruleDetail.channels, channelList).map((item) => (
                <span key={item} className={styles.tag}>
                  {item}
                </span>
              ))}
          </Col>
        </Row>
      </InfoCard>
    );
  };
  const renderFileRecognize = (innerForm: FormInstance) => {
    const { getFieldValue, setFieldsValue } = innerForm;
    if (getFieldValue('currentEdit') === 'fileRecognize') {
      return (
        <InfoCard
          cardTitle={
            <div className={styles.infoCardTitleContainer}>
              <div>文件识别</div>
              <Space>
                <Button
                  className={styles.saveButton}
                  onClick={() => setFieldsValue({ currentEdit: undefined })}
                >
                  取消
                </Button>
                <Button
                  className={styles.saveButton}
                  type="primary"
                  onClick={() => saveData('fileRecognize')}
                >
                  保存
                </Button>
              </Space>
            </div>
          }
          showHighLightIcon={false}
          className={styles.cardContainer}
        >
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
              {getFieldValue('riskList')?.map((category: IRiskCategory) => (
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
      );
    }
    return (
      <InfoCard
        cardTitle={
          <div className={styles.infoCardTitleContainer}>
            <div>
              文件识别
              {editFlag && (
                <Icon
                  className={styles.editIcon}
                  type="icon-bianji"
                  onClick={() => {
                    setFieldsValue({
                      currentEdit: 'fileRecognize',
                      action: ruleDetail.action,
                      risk_id: ruleDetail.risk_id,
                      // 修复issue bug
                      filerule_ids: ruleDetail?.file_rules?.map((o: any) => o.uid),
                    });
                  }}
                />
              )}
            </div>
          </div>
        }
        showHighLightIcon={false}
        className={styles.cardContainer}
        style={{ pointerEvents: editFlag ? 'auto' : 'none' }}
      >
        {renderRow('规则名称', ruleDetail?.file_rules?.map((o: any) => o.name).join(','))}
        <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>风险类型</div>
          <Col span={20}>{ruleDetail.risk_id && showRisk()}</Col>
        </Row>
        {renderRow('响应动作', actionName[ruleDetail.action || ''])}
      </InfoCard>
    );
  };
  const renderDeliverRule = (innerForm: FormInstance) => {
    const { getFieldValue, setFieldsValue } = innerForm;
    if (getFieldValue('currentEdit') === 'deliverRule') {
      return (
        <InfoCard
          cardTitle={
            <div className={styles.infoCardTitleContainer}>
              <div>下发规则</div>
              <Space>
                <Button
                  className={styles.saveButton}
                  onClick={() => setFieldsValue({ currentEdit: undefined })}
                >
                  取消
                </Button>
                <Button
                  className={styles.saveButton}
                  type="primary"
                  onClick={() => saveData('deliverRule')}
                >
                  保存
                </Button>
              </Space>
            </div>
          }
          showHighLightIcon={false}
          className={styles.cardContainer}
        >
          <Form.Item
            label="下发范围"
            name="scope"
            style={{ marginBottom: '0' }}
            rules={[{ required: true, message: '请选择下发范围' }]}
          >
            <Radio.Group onChange={(e) => setScope(e.target.value)}>
              <Space>
                <Radio.Button value="global">全局下发</Radio.Button>
                <Radio.Button value="common">普通下发</Radio.Button>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={'device_ids'}
            style={{ display: getFieldValue('scope') === 'common' ? 'block' : 'none' }}
          >
            <NormalDeliveryScopeSelector
              chosenData={getFieldValue('device')}
              isInitialExpand
              className={
                getFieldValue('scope') === 'common' ? styles.normalDeleverContainer : styles.hidden
              }
              rule_id={ruleDetail?.uid}
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
        </InfoCard>
      );
    }
    return (
      <InfoCard
        cardTitle={
          <div className={styles.infoCardTitleContainer}>
            <div>
              下发规则
              {editFlag && (
                <Icon
                  className={styles.editIcon}
                  type="icon-bianji"
                  onClick={() => {
                    setFieldsValue({
                      currentEdit: 'deliverRule',
                      scope: ruleDetail.scope,
                      device_ids: ruleDetail?.common_devices.map((o: any) => o.uid),
                      device: ruleDetail?.common_devices,
                    });
                  }}
                />
              )}
            </div>
          </div>
        }
        showHighLightIcon={false}
        className={styles.cardContainer}
        style={{ pointerEvents: editFlag ? 'auto' : 'none' }}
      >
        {renderRow('规则名称', scopeName[ruleDetail.scope || ''])}
        {ruleDetail?.common_devices?.length > 0 && (
          <div className={styles.commonDeliveryWrap}>
            {ruleDetail?.common_devices?.map((o: any) => {
              return (
                <div key={o.uid} className={styles.tagContainer}>
                  {o.code}
                </div>
              );
            })}
          </div>
        )}
      </InfoCard>
    );
  };

  const renderBasicInfo = (innerForm: FormInstance) => {
    const { getFieldValue, setFieldsValue } = innerForm;
    if (getFieldValue('currentEdit') === 'basic') {
      return (
        <InfoCard
          cardTitle={
            <div className={styles.infoCardTitleContainer}>
              <div>基本信息</div>
              <Space>
                <Button
                  className={styles.saveButton}
                  onClick={() => setFieldsValue({ currentEdit: undefined })}
                >
                  取消
                </Button>
                <Button
                  className={styles.saveButton}
                  type="primary"
                  onClick={() => saveData('basic')}
                >
                  保存
                </Button>
              </Space>
            </div>
          }
          showHighLightIcon={false}
          className={styles.cardContainer}
        >
          <Form.Item name="name" rules={[{ required: true }]} label="规则名字">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="规则描述">
            <Input />
          </Form.Item>
        </InfoCard>
      );
    } else {
      return (
        <InfoCard
          cardTitle={
            <div className={styles.infoCardTitleContainer}>
              <div>
                基本信息
                {editFlag && (
                  <Icon
                    className={styles.editIcon}
                    type="icon-bianji"
                    onClick={() => {
                      setFieldsValue({
                        currentEdit: 'basic',
                        name: ruleDetail.name,
                        description: ruleDetail.description,
                      });
                    }}
                  />
                )}
              </div>
            </div>
          }
          showHighLightIcon={false}
          className={styles.cardContainer}
          style={{ pointerEvents: editFlag ? 'auto' : 'none' }}
        >
          {renderRow('规则名称', ruleDetail.name)}
          {renderRow('规则描述', ruleDetail.description)}
        </InfoCard>
      );
    }
  };
  const handleClose = () => {
    onClose();
    setScope('');
    form.resetFields();
  };
  return (
    <Drawer
      width={640}
      loading={queryLoading}
      onClose={handleClose}
      className={styles.editRuleDrawer}
      visible={visible}
      titleName={'规则详情'}
      footer={
        <Button className={styles.button} onClick={handleClose}>
          关闭
        </Button>
      }
    >
      <Form form={form} name="control-hooks" layout="vertical">
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.mode !== currentValues.mode}
        >
          {(formInner: FormInstance) => {
            return renderBasicInfo(formInner);
          }}
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.mode !== currentValues.mode}
        >
          {(formInner: FormInstance) => {
            return renderDeliverRule(formInner);
          }}
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.mode !== currentValues.mode}
        >
          {(formInner: FormInstance) => {
            return renderFileRecognize(formInner);
          }}
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.mode !== currentValues.mode}
        >
          {(formInner: FormInstance) => {
            return renderRiskSource(formInner);
          }}
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditRuleDrawer;
