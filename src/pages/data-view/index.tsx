import { useEffect, useMemo, useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Radio, Spin, Empty } from 'antd';
import { useRequest, useModel } from 'umi';
import type { CardItem } from '@/components/UiComponent/card';
import Card from '@/components/UiComponent/card';
import { InfoCard } from '@svl-ad/pro-components';
import Icon from '@/components/Icon';
import type { AreaConfig, ColumnConfig } from '@ant-design/charts';
import { Column, Pie, Bar } from '@ant-design/charts';
import { getRageTime } from '@/utils/time';
import { flatenData, formatNum, resolveOptions2Obj } from '@/utils/chart';
import { debounce } from 'lodash';

import { Area } from './components/charts';

import {
  loadingText,
  PIE_CFG,
  BAR_CFG,
  tooltipStyle,
  tooltipCrosshair,
  getTooltipLevel,
  getTooltip,
  config,
  colors,
  AREA_CONFIG,
} from './config';
import FileRank from './file-rank';
import type { Option, RiskParams } from './data';
import {
  // queryOptionsList,
  queryTotalData,
  queryRiskLevelData,
  queryRiskChannelData,
  queryRiskChannelTop10,
  queryRiskFile,
  queryRiskFileTop,
} from './service';

import styles from './index.less';

const data: CardItem[] = [
  {
    icon: <Icon type="icon-keshihua-shebei" />,
    label: '实时设备总量',
    value: '-',
    key: 'count',
    iconContainerClassName: styles.bgSuccess,
  },
  {
    icon: <Icon type="icon-keshihua-kai" />,
    label: '实时设备启用',
    value: '-',
    key: 'active_count',
    iconContainerClassName: styles.bgSuccess,
  },
  {
    icon: <Icon type="icon-keshihua-guan" />,
    label: '实时设备禁用',
    value: '-',
    key: 'deactive_count',
    iconContainerClassName: styles.bgFail,
  },
  {
    icon: <Icon type="icon-keshihua-zhuxiao" />,
    label: '实时注销数量',
    value: '-',
    key: 'writtenoff_count',
    iconContainerClassName: styles.bgDisable,
  },
];

const configRiskNum: AreaConfig = {
  ...config,
  tooltip: {
    ...tooltipStyle,
    ...tooltipCrosshair,
  },
};
const configRiskChannel: ColumnConfig = {
  ...config,
  tooltip: {
    ...tooltipStyle,
    customContent: getTooltipLevel(styles, false),
  },
};

export default function DataView() {
  const [currentDate, setCurrentDate] = useState(1);
  const [channels, setChannels] = useState<Option>({});
  const [risks, setRisks] = useState<Option>({});
  const [totalData, setTotalData] = useState(data);
  const [riskChannelData, setRiskChannelData] = useState([]);
  const [riskChannelTopData, setRiskChannelTopData] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [legendData, setLegendData] = useState([] as any[]);
  const [fileData, setFileData] = useState([]);
  const [fileRiskData, setFileRiskData] = useState({});
  const [canvasWidth, setCanvasWidth] = useState(233);
  const { domainData, queryDomainData } = useModel('domainData', (model) => ({
    domainData: model.domainData,
    queryDomainData: model.queryDomainData,
  }));

  useEffect(() => {
    const getWidth = () => {
      const dom = document.querySelector('#rightPartContainer');
      let width = 281;
      if (dom) {
        width = dom.clientWidth;
      }
      setCanvasWidth(width - 48);
    };
    getWidth();
    const getWidthLodash = debounce(getWidth, 1000);
    window.addEventListener('resize', getWidthLodash);
    return () => window.removeEventListener('resize', getWidthLodash);
  }, []);

  const { run: riskLevelRun, loading: riskLevelLoding } = useRequest(
    (params: RiskParams) => queryRiskLevelData(params),
    {
      manual: true,
      formatResult: (res) => res,
    },
  );
  const { run: riskChannelRun, loading: riskChannelLoding } = useRequest(
    (params: RiskParams) => queryRiskChannelData(params),
    { manual: true, formatResult: (res) => res },
  );
  const { run: riskChannelTopRun, loading: riskChannelTopLoding } = useRequest(
    (params: RiskParams) => queryRiskChannelTop10(params),
    { manual: true, formatResult: (res) => res },
  );
  const { run: riskFileRun, loading: riskFileLoding } = useRequest(
    (params: RiskParams) => queryRiskFile(params),
    { manual: true, formatResult: (res) => res },
  );
  const { run: riskFileTopRun, loading: riskFileTopLoding } = useRequest(
    (params: RiskParams) => queryRiskFileTop(params),
    { manual: true, formatResult: (res) => res },
  );

  // 解析传输渠道风险提示数据
  const riskDataR = useMemo(() => {
    if (risks && riskData.length) {
      return flatenData(riskData, risks, {});
    }
    return { data: [] } as any;
  }, [risks, riskData]);
  // 解析传输渠道风险提示数据
  const riskRadioDataR = useMemo(() => {
    if (risks && riskData.length) {
      const riskRadio = flatenData(riskData, risks);
      const { data: riskPie = [] } = riskRadio;
      const legendDataR = riskPie.map((each) => {
        const { risk_level, count } = each;
        const countR = formatNum(count as number);
        return {
          name: risk_level,
          value: `${countR} 件`,
        };
      });
      setLegendData(legendDataR);
      const total = riskPie.reduce((pre, next: any) => pre + next.count, 0);
      const maxLen = (total + '').length;
      let fontSize = 36;
      const MAX_SIZE = 100;
      // 总数最大宽度为120，并且数字占据宽度为fontSize/1.5
      if (maxLen) {
        const size = Math.floor((MAX_SIZE / maxLen) * 1.5);
        fontSize = Math.max(Math.min(36, size), 12);
      }
      // @ts-ignore
      PIE_CFG.statistic!.title!.content = total + '';
      // @ts-ignore
      PIE_CFG.statistic!.title!.style!.fontSize = `${fontSize}px`;
      // PIE_CFG.tooltip.customContent = getTooltipRisk(styles, total);
      // @ts-ignore
      PIE_CFG.tooltip.customItems = (originalItems: any[]) => {
        return originalItems.map((item) => {
          item.percent = total ? ((item.value / total) * 100).toFixed(2) + '%' : '0%';
          return item;
        });
      };
      return riskRadio;
    }
    return { data: [] };
  }, [risks, riskData]);
  // 解析传输渠道风险提示数据
  const riskChannelDataR = useMemo(() => {
    if (channels && risks && riskChannelData.length) {
      return flatenData(riskChannelData, risks, channels);
    }
    return { data: [] };
  }, [channels, risks, riskChannelData]);

  // 解析传输渠道top10数据
  const riskChannelTopR = useMemo(() => {
    if (channels && riskChannelTopData.length) {
      const { xField, yField, data: dataTop } = flatenData(riskChannelTopData, channels);
      let max = 100;
      const annotations: any[] = dataTop.map((item, index) => {
        const val = item[yField] as number;
        if (index === 0 && val) {
          max = val;
        }
        const lessFlag = val / max < 0.1;
        const threePx = (3 * max) / 100;
        return {
          type: 'text',
          content: val,
          position: lessFlag ? [item[xField], val + threePx] : [item[xField], threePx],
          style: {
            fontSize: 14,
            fill: '#323233',
            fontWeight: 500,
            textBaseline: 'middle',
          },
        };
      });
      return {
        yField: xField,
        xField: yField,
        data: dataTop,
        annotations,
      };
    }
    return { data: [] };
  }, [channels, riskChannelTopData]);

  const getData = (date?: number) => {
    const result: any = getRageTime(date || currentDate);
    const params = { time_range: result };
    riskLevelRun(params).then((res: any) => {
      setRiskData(res);
    });
    riskChannelRun(params).then((res: any) => {
      setRiskChannelData(res);
    });
    riskChannelTopRun(params).then((res: any) => {
      setRiskChannelTopData(res);
    });
    riskFileRun(params).then((res: any) => {
      const ridkFileR = flatenData(res);

      setFileRiskData(ridkFileR);
    });
    riskFileTopRun(params).then((res: any) => {
      const fileResult = res.map((item: { value: string; count: number }) => {
        const { value = '', count } = item;
        const index = value.lastIndexOf('.');
        let type = '';
        let name = value;
        if (index !== -1) {
          type = value.substring(index + 1);
          name = value.substring(0, index);
        }
        return {
          name,
          type,
          count,
        };
      });
      setFileData(fileResult);
    });
  };
  useEffect(() => {
    // 获取渠道枚举
    if (!domainData) {
      queryDomainData();
    } else {
      const channelObj = resolveOptions2Obj(domainData.transmission_channels);
      const risksObj = resolveOptions2Obj(domainData.risk_levels, 'risk_level');
      setChannels(channelObj);
      setRisks(risksObj);
    }
  }, [domainData]);
  // 初始化
  useEffect(() => {
    // 获取总数据
    queryTotalData().then((res) => {
      const dataR: any = totalData.map((each) => ({
        ...each,
        value: res[each.key],
      }));
      setTotalData(dataR);
    });
    // 获取图表数据
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeDate: (e: RadioChangeEvent) => void = (e) => {
    const newDate = e.target.value;
    getData(newDate);
    setCurrentDate(newDate);
  };

  return (
    <div className={styles.container}>
      <div className={styles.totalInfo}>
        <Card data={totalData} />
      </div>
      <div className={styles.datePart}>
        <Radio.Group value={currentDate} onChange={changeDate}>
          <Radio.Button value={1}>过去24小时</Radio.Button>
          <Radio.Button value={7}>1周内</Radio.Button>
          <Radio.Button value={14}>2周内</Radio.Button>
        </Radio.Group>
      </div>
      <div className={styles.chartGrid}>
        <div className={styles.mainPart}>
          <InfoCard className={styles.chartMain} cardTitle="风险提示数量">
            <Spin spinning={riskLevelLoding || false} tip={loadingText}>
              <div className={styles.chartUnit}>单位(件)</div>
              <Area
                customContent={getTooltipLevel}
                hasMinute={currentDate === 1}
                dataCfg={riskDataR}
                baseCfg={configRiskNum}
              />
            </Spin>
          </InfoCard>
          <InfoCard className={styles.chartMain} cardTitle="传输通道风险提示数量">
            <Spin spinning={riskChannelLoding || false} tip={loadingText}>
              <div className={styles.chartUnit}>单位(件)</div>
              <Column isStack maxColumnWidth={16} {...riskChannelDataR} {...configRiskChannel} />
            </Spin>
          </InfoCard>
          <InfoCard className={styles.chartMain} cardTitle="文件外传数量">
            <Spin spinning={riskFileLoding || false} tip={loadingText}>
              <div className={styles.chartUnit} style={{ position: 'relative', marginBottom: 16 }}>
                单位(件)
              </div>
              <Area
                customContent={getTooltip}
                hasMinute={currentDate === 1}
                dataCfg={fileRiskData}
                baseCfg={AREA_CONFIG}
              />
            </Spin>
          </InfoCard>
        </div>
        <div className={styles.rightPart} id="rightPartContainer">
          <InfoCard className={styles.chartRisk} cardTitle="风险占比">
            <Spin spinning={riskLevelLoding || false} tip={loadingText}>
              <Pie height={174} {...PIE_CFG} {...riskRadioDataR} />
              <div className={styles.legend}>
                {legendData.map((legend, index) => {
                  const { name, value } = legend;
                  const color = colors[index] || colors[0];
                  return (
                    <div className={styles.legendItem} key={name}>
                      <div className={styles.marker} style={{ background: color }} />
                      <div className={styles.name}>{name}</div>
                      <div className={styles.value}>{value}</div>
                    </div>
                  );
                })}
              </div>
            </Spin>
          </InfoCard>
          <InfoCard className={styles.chartChannel} cardTitle="传输渠道TOP 10">
            <Spin spinning={riskChannelTopLoding || false} tip={loadingText}>
              {riskChannelTopR.data?.length ? (
                <Bar height={304} {...BAR_CFG} {...riskChannelTopR} />
              ) : (
                <Empty description="暂无数据" />
              )}
            </Spin>
          </InfoCard>
          <InfoCard className={styles.chartFile} cardTitle="传输文件排行榜">
            <Spin spinning={riskFileTopLoding || false} tip={loadingText}>
              {fileData?.length ? (
                <FileRank width={canvasWidth} data={fileData} />
              ) : (
                <Empty description="暂无数据" />
              )}
            </Spin>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
