import jinjiPng from '@/asserts/jinji.png';
import highPng from '@/asserts/high.png';
import middlePng from '@/asserts/middle.png';
import lowPng from '@/asserts/low.png';
import type { AreaConfig, BarConfig, PieConfig } from '@ant-design/charts';

export const colors = ['#E86A5D', '#F4A261', '#FFC759', '#2A9D8F'];
export const loadingText = '加载中...';
export const barColors = [
  'rgba(42, 157, 143, 1)',
  'rgba(42, 157, 143, 0.9)',
  'rgba(42, 157, 143, 0.8)',
  'rgba(42, 157, 143, 0.7)',
  'rgba(42, 157, 143, 0.6)',
  'rgba(42, 157, 143, 0.5)',
  'rgba(42, 157, 143, 0.4)',
  'rgba(42, 157, 143, 0.3)',
  'rgba(42, 157, 143, 0.2)',
  'rgba(42, 157, 143, 0.1)',
];

export const TYPE_CFG = {
  1: {
    className: 'jinji',
    img: jinjiPng,
  },
  2: {
    className: 'high',
    img: highPng,
  },
  3: {
    className: 'middle',
    img: middlePng,
  },
  4: {
    className: 'low',
    img: lowPng,
  },
};

export const tooltipCrosshair = {
  showCrosshairs: true,
  crosshairs: {
    line: {
      style: {
        lineDash: [4, 2],
        stroke: '#969799',
      },
    },
  },
};
export const tooltipStyle = {
  domStyles: {
    'g2-tooltip': {
      'box-shadow': '0px 2px 8px 1px rgba(200, 201, 204, 0.5)',
    },
  },
};

export const tooltipPieStyle = {
  domStyles: {
    'g2-tooltip': {
      'box-shadow': '0px 2px 8px 1px rgba(200, 201, 204, 0.5)',
    },
    'g2-tooltip-value': {
      'margin-left': '8px',
      'font-weight': 500,
    },
    'g2-tooltip-item': {
      display: 'flex',
      'align-item': 'center',
      'padding-bottom': '12px',
    },
    'g2-tooltip-marker': {
      width: '7px',
      height: '7px',
      'border-radius': '50%',
    },
  },
};

export const gridDashY = {
  yAxis: {
    // title: {
    //   text: '单位(件)',
    // },
    grid: {
      line: {
        style: {
          lineDash: [4, 2],
          stroke: '#DCDEE0',
        },
      },
    },
  },
};

export const PIE_CFG: PieConfig = {
  data: [],
  padding: 10,
  angleField: 'count',
  colorField: 'risk_level',
  color: colors,
  radius: 1,
  innerRadius: 0.8,
  legend: false,
  tooltip: {
    ...tooltipPieStyle,
    itemTpl: `<div class="g2-tooltip-item">
      <div class="g2-tooltip-marker" style="background: {color}"></div>
        <div class="g2-tooltip-name">{name}</div>
        <div class="g2-tooltip-value">{value}</div>
        <div class="g2-tooltip-name" style="margin-left: 16px">占比</div>
        <div class="g2-tooltip-value">{percent}</div>
      </div>`,
  },
  label: undefined,
  interactions: [
    {
      type: 'element-active',
    },
  ],
  pieStyle: {
    lineWidth: 0,
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  },
  state: {
    // 设置 active 激活状态的样式
    active: {
      // @ts-ignore
      animate: { duration: 100, easing: 'easeLinear' },
      style: (data: any) => {
        const { color = 'white' } = data?.model || {};
        return {
          lineWidth: 5,
          stroke: color,
        };
      },
    },
  },
  statistic: {
    title: {
      content: '0',
      style: {
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '36px',
        color: '#323233',
        fontWeight: 'blod',
      },
      offsetY: 10,
    },
    content: {
      style: {
        fontSize: '14px',
        color: '#969799',
        fontWeight: 400,
      },
      content: '风险总数',
      offsetY: 20,
    },
  },
};

export const BAR_CFG: BarConfig = {
  data: [],
  yField: 'channel',
  xField: 'count',
  // barWidthRatio: 0.8,
  color: barColors,
  seriesField: 'channel',
  legend: false,
  maxBarWidth: 20,
  tooltip: false,
  xAxis: {
    grid: null,
    line: null,
    tickLine: null,
    label: null,
  },
  yAxis: {
    grid: null,
    line: null,
    tickLine: null,
    label: {
      style: {
        fill: '#323233',
        fontWeight: 400,
      },
    },
  },
};

export const getTooltipLevel = (styles: any, showMinute: boolean) => {
  return (title: any, showData: any) => {
    const result = showData.map((item: any) => {
      const { name, value, data } = item;
      const key = data.risk_level_origin;
      const { className, img } = TYPE_CFG[key] || {};

      return `<div class="${styles.tooltipItem}">
          <div class="${styles.tooltipName} ${styles[className]}">
              <img class="${styles.img}" src=${img} />
              ${name}
          </div>
          <div class="${styles.tooltipValue}">
              ${value}
          </div>
      </div>`;
    });
    return `<div class="${styles.tooltip}">
      <div class="${styles.title}">${title}${showMinute ? ':00' : ''}</div>
      ${result.join('')}
    </div>`;
  };
};

export const getTooltip = (styles: any, showMinute: boolean) => {
  return (title: any, showData: any) => {
    const { value } = showData?.[0] || {};
    return `<div class="${styles.tooltip}">
      <div class="${styles.title}" style="text-align: center">
      ${title}${showMinute ? ':00' : ''}</div>
      <div class="${styles.tooltipValue}" style="text-align: center">
        ${value} <span class="${styles.tooltipUnit}">件</span>
      </div>
    </div>`;
  };
};
export const getTooltipRisk = (styles: any, total: number) => {
  return (title: any, showData: any) => {
    const { value, color } = showData?.[0] || {};
    const percent = ((value / total) * 100).toFixed(2) + '%';
    return `<div class="${styles.tooltipRisk}">
      <div class="${styles.circle}" style="background-color: ${color}"></div>
      <div class="${styles.riskInfoItem}">
      ${title}<span class="${styles.riskValue}">${value}</span>
      </div>
      <div class="${styles.riskInfoItem}">
      占比<span class="${styles.riskValue}">${percent}</span>
      </div>
    </div>`;
  };
};

export const config: any = {
  color: colors,
  height: 231,
  legend: {
    layout: 'horizontal',
    position: 'top-right',
    marker: {
      symbol: 'circle',
      style: (style: any) => {
        style.r = 3.5;
        style.fillOpacity = 1;
        return style;
      },
    },
    itemName: {
      style: {
        fill: '#969799',
      },
    },
  },
  ...gridDashY,
  xAxis: {
    tickCount: 13,
  },
};

// 面积图配置
export const AREA_CONFIG: AreaConfig = {
  data: [],
  xField: 'day',
  yField: 'count',
  color: '#2A9D8F',
  height: 200,
  ...gridDashY,
  xAxis: {
    tickCount: 13,
    top: true,
    line: {
      style: {
        strokeOpacity: 1,
        stroke: '#DCDEE0',
      },
    },
  },
  areaStyle: () => {
    return {
      fill: 'l(270) 0:#fff 1:rgba(42, 157, 143, 1)',
    };
  },
  tooltip: {
    ...tooltipStyle,
    ...tooltipCrosshair,
  },
};
