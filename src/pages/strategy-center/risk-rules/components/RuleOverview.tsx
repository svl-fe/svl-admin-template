import type { FC } from 'react';
import { Row, Col } from 'antd';
import { InfoCard } from '@svl-ad/pro-components';
import RiskType from '@/components/RiskType';
import type { ITableResult, ITreeData } from '@/common';
import type { IConditionDetail } from '@/pages/strategy-center/data-identify/data';
import type {
  IDetectPositions,
  IRiskCategory,
  IRiskRelation,
  IRiskRuleFormValues,
  TTransChannels,
} from '../data';
import styles from './RuleOverview.less';

interface IRuleOverviewProps {
  info: Partial<IRiskRuleFormValues>;
  relations: IRiskRelation[];
  channels: TTransChannels[];
  positions: IDetectPositions[];
  condList: ITableResult<IConditionDetail> | undefined;
  riskList?: IRiskCategory[];
}

const RuleOverview: FC<IRuleOverviewProps> = (props) => {
  const { info = {}, channels, riskList = [] } = props;
  const scopeName = {
    global: '全局下发',
    common: '普通下发',
  };
  const actionName = {
    notify: '风险提示',
    block: '外传阻断',
  };
  const getTags = (
    values: Record<string, string[]>,
    originData: (ITreeData & Record<string, any>)[],
  ) => {
    const tags: string[] = [];

    for (const key in values) {
      const orgItem = originData.find((item) => item.key === key);

      if (orgItem?.children) {
        orgItem.children.map((childItem) => {
          if (values[key].includes(childItem.key)) tags.push(childItem.title);
        });
      }
    }

    return tags;
  };

  // const getContentList = (
  //   values: string[],
  //   originData: Record<string, any>[],
  //   key: string,
  //   name: string,
  // ): string[] => {
  //   const content: string[] = [];

  //   originData.map((item) => {
  //     if (values.includes(item[key])) {
  //       content.push(item[name]);
  //     }
  //   });

  //   return content;
  // };

  const showRisk = () => {
    const riskItem = riskList?.find((item) => item.uid === info.risk_id);

    return (
      <div style={{ marginBottom: '12px' }}>
        {riskItem?.name}&nbsp;
        {riskItem?.level && <RiskType level={riskItem.level} />}
      </div>
    );
  };

  return (
    <>
      <InfoCard cardTitle="基本信息" showHighLightIcon={false}>
        <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>规则名称</div>
          <Col span={20}>{info.name}</Col>
        </Row>
        <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>规则描述</div>
          <Col span={20}>{info.description}</Col>
        </Row>
        <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>下发范围</div>
          <Col span={20}>{scopeName[info.scope || '']}</Col>
        </Row>
        {/* <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>规则应用</div>
          <Col span={20}>{info.scope === 'global' ? '全局应用' : ''}</Col>
        </Row>
        <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>风险类型</div>
          <Col span={20}>{info.risk_id && showRisk()}</Col>
        </Row>
        <Row className={styles.detailItem} style={{ marginTop: 0 }}>
          <div className={styles.infoLabel}>响应动作</div>
          <Col span={20}>{info.action === 'notify' ? '风险提示' : ''}</Col>
        </Row> */}
      </InfoCard>

      <InfoCard cardTitle="文件识别" showHighLightIcon={false} style={{ paddingBottom: 12 }}>
        <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>规则名称</div>
          <Col span={20}>{info.name}</Col>
        </Row>
        <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>风险类型</div>
          <Col span={20}>{info.risk_id && showRisk()}</Col>
        </Row>
        <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>响应动作</div>
          <Col span={20}>{actionName[info.action || '']}</Col>
        </Row>
        {/* <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>识别条件</div>
          <Col span={20}>
            {info.condition_ids &&
              getContentList(info.condition_ids, condList?.results || [], 'uid', 'name').map(
                (item) => (
                  <div key={item} style={{ marginBottom: '12px' }}>
                    {item}
                  </div>
                ),
              )}
          </Col>
        </Row>
        <Row className={styles.detailItem} style={{ marginTop: 0 }}>
          <div className={styles.infoLabel}>条件关系</div>
          <Col span={20}>
            当选中的条件{relations?.find((item) => item.key === info.relation)?.name}满足时
          </Col>
        </Row>
        <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>条件阈值</div>
          <Col span={20}>至少{info.threshold}个数据匹配中时</Col>
        </Row>
        <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>文件扫描</div>
          <Col span={20}>
            {info.positions &&
              getTags(info.positions, positions).map((item) => (
                <span key={item} className={styles.tag}>
                  {item}
                </span>
              ))}
          </Col>
        </Row> */}
      </InfoCard>
      <InfoCard cardTitle="风险来源" showHighLightIcon={false} style={{ paddingBottom: 12 }}>
        <Row className={styles.detailItem}>
          <div className={styles.infoLabel}>传输通道</div>
          <Col span={20}>
            {info.channels &&
              getTags(info.channels, channels).map((item) => (
                <span key={item} className={styles.tag}>
                  {item}
                </span>
              ))}
          </Col>
        </Row>
      </InfoCard>
    </>
  );
};

export default RuleOverview;
