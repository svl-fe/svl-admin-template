import { PageContainer } from '@ant-design/pro-layout';
import { InfoCard } from '@svl-ad/pro-components';
import style from './index.less';
import SubRiskRules from './subRiskRule';

const RiskRules: React.FC = () => {
  return (
    <PageContainer header={{ title: null }}>
      <InfoCard cardTitle="风险监测规则" className={style.container}>
        <SubRiskRules />
      </InfoCard>
    </PageContainer>
  );
};

export default RiskRules;
