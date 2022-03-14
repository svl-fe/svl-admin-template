import type { Request, Response } from 'express';

const str = '这是一个321测试3名称，sdf新建56777文本文档不用管她就行哈哈哈哈哈哈哈哈';

const channels = {
  communication: '通讯类',
  feishu: '飞书',
  wechat_enterprise: '企业微信',
  dingding: '钉钉',
  cloud_drive: '网盘类',
  baidu_wangpan: '百度网盘',
  external_device: '外接设备',
  external_disk: 'U盘/硬盘/储存卡',
  optical_disk: '光盘',
  system_service: '系统服务',
  screenshot: '系统截屏',
  file_printing: '文件打印',
  remote_control: '远程控制',
  clipboard: '剪切板',
  file_sharing: '文件共享',
};
const channelsArr = Object.keys(channels);
function fakeRiskWarningList({ limit, type = '' }: { limit: number; type?: string }) {
  const list = [];

  for (let i = 0; i < 4; i += 1) {
    const buckets = [];
    for (let index = 0; index < limit; index++) {
      const value = type ? channelsArr[index] : index + '';
      buckets.push({
        name: type || 'time',
        value,
        count: Math.floor(Math.random() * 100000) + 1000000,
      });
    }
    list.push({
      name: 'risk_level',
      value: i + 1,
      count: Math.floor(Math.random() * 100000) + 10000000,
      buckets,
    });
  }

  return list;
}

function fakeList({ limit, type = '' }: { limit: number; type?: string }) {
  const list = [];

  for (let i = 0; i < limit; i += 1) {
    let value = i + '';
    if (type) {
      if (type === 'channel') {
        value = channelsArr[i];
      } else {
        value = str.substring(0, Math.floor(Math.random() * 30)) + '.txt';
      }
    }
    list.push({
      name: type || 'time',
      value,
      count: Math.floor(Math.random() * 100) + 40000000,
    });
  }

  return list;
}

// 获取规则列表
function getRiskLevelTimeList(req: Request, res: Response) {
  let { limit = 24 } = req.query;

  limit = Number(limit);

  const results = fakeRiskWarningList({ limit });

  return res.json({
    code: 0,
    data: results,
  });
}
// 获取规则列表
function getRiskLevelChannelList(req: Request, res: Response) {
  let { limit = 10 } = req.query;

  limit = Number(limit);

  const results = fakeRiskWarningList({ limit, type: 'channel' });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        res.json({
          code: 0,
          data: results,
        }),
      );
    }, 1000);
  });
}
function getRiskChannelList(req: Request, res: Response) {
  let { limit = 10 } = req.query;

  limit = Number(limit);

  const results = fakeList({ limit, type: 'channel' });

  return res.json({
    code: 0,
    data: results.sort((a, b) => b.count - a.count),
  });
}
function getRiskFileList(req: Request, res: Response) {
  let { limit = 30 } = req.query;

  limit = Number(limit);

  const results = fakeList({ limit });

  return res.json({
    code: 0,
    data: results,
  });
}
function getRiskFileTopList(req: Request, res: Response) {
  let { limit = 5 } = req.query;

  limit = Number(limit);

  const results = fakeList({ limit, type: 'file' });

  return res.json({
    code: 0,
    data: results,
  });
}

function getStatus(req: Request, res: Response) {
  return res.json({
    code: 0,
    data: {
      active_count: 700,
      deactive_count: 100,
      writtenoff_count: 3,
      count: 800,
    },
  });
}
// 忽略风险
function getTall(req: Request, res: Response) {
  return res.json({
    code: 0,
    data: {
      behavioral_operations: [
        {
          name: 'upload',
          display_name: '上传',
        },
        {
          name: 'download',
          display_name: '下载',
        },
        {
          name: 'outgoing',
          display_name: '外传',
        },
        {
          name: 'receive',
          display_name: '接收',
        },
      ],
      condition_categories: [
        {
          name: 'keywords',
          display_name: '关键词组',
          optional_data: {
            keys_count_limit: 150,
          },
        },
        {
          name: 'regexpr',
          display_name: '正则匹配',
          optional_data: {
            value_length_limit: 1000,
          },
        },
        {
          name: 'scripts',
          display_name: '脚本检测',
          optional_data: {
            value_length_limit: 5000,
          },
        },
      ],
      detect_positions: [
        {
          name: 'filename',
          display_name: '名称',
          children: [
            {
              name: 'filename',
              display_name: '文件名称',
            },
            {
              name: 'filename_suffix',
              display_name: '后缀名',
            },
          ],
        },
        {
          name: 'file',
          display_name: '文件',
          children: [
            {
              name: 'file_content',
              display_name: '文件内容',
            },
            {
              name: 'file_first_line',
              display_name: '首行文字',
            },
            {
              name: 'header_footer',
              display_name: '页眉页脚',
            },
          ],
        },
        {
          name: 'email',
          display_name: '邮件',
          children: [
            {
              name: 'email_title',
              display_name: '电子邮件标题',
            },
            {
              name: 'email_body',
              display_name: '电子邮件正文',
            },
          ],
        },
      ],
      transmission_channels: [
        {
          name: 'communication',
          display_name: '通讯类',
          children: [
            {
              name: 'feishu',
              display_name: '飞书',
            },
            {
              name: 'wechat_enterprise',
              display_name: '企业微信',
            },
            {
              name: 'dingding',
              display_name: '钉钉',
            },
          ],
        },
        {
          name: 'cloud_drive',
          display_name: '网盘类',
          children: [
            {
              name: 'baidu_wangpan',
              display_name: '百度网盘',
            },
          ],
        },
        {
          name: 'external_device',
          display_name: '外接设备',
          children: [
            {
              name: 'external_disk',
              display_name: 'U盘/硬盘/储存卡',
            },
            {
              name: 'optical_disk',
              display_name: '光盘',
            },
          ],
        },
        {
          name: 'system_service',
          display_name: '系统服务',
          children: [
            {
              name: 'screenshot',
              display_name: '系统截屏',
            },
            {
              name: 'file_printing',
              display_name: '文件打印',
            },
            {
              name: 'remote_control',
              display_name: '远程控制',
            },
            {
              name: 'clipboard',
              display_name: '剪切板',
            },
            {
              name: 'file_sharing',
              display_name: '文件共享',
            },
          ],
        },
      ],
      risk_levels: [
        {
          name: 'critical',
          risk_level: 1,
          display_name: '紧急',
        },
        {
          name: 'high',
          risk_level: 2,
          display_name: '高',
        },
        {
          name: 'medium',
          risk_level: 3,
          display_name: '中',
        },
        {
          name: 'low',
          risk_level: 4,
          display_name: '低',
        },
      ],
    },
  });
}

export default {
  'POST   /qzh/api/v1/statistic/device_status': getStatus,
  'POST   /qzh/api/v1/domaindata/action/getall': getTall,
  'POST   /qzh/api/v1/statistic/riskwarning/risklevelbytime': getRiskLevelTimeList,
  'POST   /qzh/api/v1/statistic/riskwarning/risklevelbychannel': getRiskLevelChannelList,
  'POST   /qzh/api/v1/statistic/riskwarning/channel': getRiskChannelList,
  'POST   /qzh/api/v1/statistic/userbehavior/outgoingfilebytime': getRiskFileList,
  'POST   /qzh/api/v1/statistic/userbehavior/outgoingfilebyname': getRiskFileTopList,
};
