import type { Request, Response } from 'express';
import type { ITableQuery } from '@/common.d';

const rule_item = {
  uid: 'cab1c3d5-888e-4a74-a2cd-6ad5edf5a243',
  company_id: 'e3cf1c15-2046-4292-9e57-a5fbc18c6999',
  name: '客户订单数据',
  category: 'default',
  status: 'activated',
  scope: 'Global',
  risk_id: 'cab1c3d5-888e-4a74-a2cd-6ad5edf5a243',
  risk_level: 1,
  risk_name: 'External',
  risk_display_name: '外包人员泄密',
  created_time: '2021-12-11T16:35:21.932022+08:00',
  updated_time: '2021-12-12T16:35:21.932022+08:00',
};

function fakeRuleList(params: ITableQuery) {
  const list = [];

  for (let i = 0; i < params.limit; i += 1) {
    const current = (params.page - 1) * params.limit;
    list.push({
      ...rule_item,
      uid: `${rule_item.uid}${current + i}`,
    });
  }

  return list;
}

// 获取规则列表
function getRuleList(req: Request, res: Response) {
  let { page = 1, limit = 10 } = req.query;

  page = Number(page);
  limit = Number(limit);

  const results = fakeRuleList({ page, limit });

  return res.json({
    code: 0,
    data: {
      total: 100,
      page,
      results,
    },
  });
}

const condCategories = [
  {
    uid: 'a022c96e-4dc0-4fd2-abbf-8e4334b4585d',
    name: 'keywords',
    display_name: '关键词组',
    optional_data: {
      keys_count_limit: 150,
    },
  },
  {
    uid: '5613c6a1-2ec4-431a-b3fa-09fa16125ff7',
    name: 'regexpr',
    display_name: '正则匹配',
    optional_data: {
      value_length_limit: 1000,
    },
  },
  {
    uid: '7a73604b-6f9d-4b3a-88d7-4098c4ad4964',
    name: 'scripts',
    display_name: '脚本检测',
    optional_data: {
      value_length_limit: 5000,
    },
  },
];

// 获取条件类型种类
function getRuleCategories(req: Request, res: Response) {
  return res.json({
    code: 0,
    data: condCategories,
  });
}

const rule_detail = {
  uid: 'cab1c3d5-888e-4a74-a2cd-6ad5edf5a243',
  company_id: 'e3cf1c15-2046-4292-9e57-a5fbc18c6999',
  policy_id: 'policy1',
  name: '客户订单数据',
  category: 'default',
  status: 'activated',
  scope: 'Global',
  description: '一条DLP规则',
  action: 'notify',
  signature: 'aa',
  relation: 'all',
  threshold: {
    category: 'range',
    params: {
      gte: 4,
      lte: 1,
    },
  },
  position: ['email_title', 'file_content', 'filename_suffix'],
  channel: ['feishu', 'baidu_wangpan', 'file_printing'],
  risk_id: 'cab1c3d5-888e-4a74-a2cd-6ad5edf5a2430',
  risk_level: 1,
  risk_name: '外包人员泄密',
  created_time: '2021-12-11T16:35:21.932022+08:00',
  updated_time: '2021-12-12T16:35:21.932022+08:00',
  condition_ids: ['cab1c3d5-888e-4a74-a2cd-6ad5edf5a243'],
  conditions: [
    {
      uid: 'cab1c3d5-888e-4a74-a2cd-6ad5edf5a243',
      name: '研发文档',
      category_name: 'regexpr',
      category_display_name: '正则匹配',
    },
  ],
};

// 获取规则详情
function getRuleDetail(req: Request, res: Response) {
  return res.json({
    code: 0,
    data: rule_detail,
  });
}

// 创建规则
function createRiskRule(req: Request, res: Response) {
  return res.json({
    code: 0,
    data: rule_detail,
  });
}

// 更新规则
function updateRiskRule(req: Request, res: Response) {
  return res.json({
    code: 0,
    data: rule_detail,
  });
}

// 删除规则
function deleteRiskRule(req: Request, res: Response) {
  return res.json({
    code: 0,
    data: [],
  });
}

// 更新规则状态
function updateRiskRuleStatus(req: Request, res: Response) {
  return res.json({
    code: 0,
    data: [],
  });
}

const risk_item = {
  uid: 'cab1c3d5-888e-4a74-a2cd-6ad5edf5a243',
  company_id: 'e3cf1c15-2046-4292-9e57-a5fbc18c6999',
  risk_name: '外包人员泄密',
  risk_level: 1,
  created_time: '2021-12-11T16:35:21.932022+08:00',
  updated_time: '2021-12-12T16:35:21.932022+08:00',
};

function fakeRiskList() {
  const list = [];

  for (let i = 0; i < 4; i += 1) {
    list.push({
      ...risk_item,
      uid: `${risk_item.uid}${i}`,
      risk_name: `${risk_item.risk_name}${i}`,
    });
  }

  return list;
}

// 获取风险列表
function getRiskList(req: Request, res: Response) {
  const results = fakeRiskList();

  return res.json({
    code: 0,
    data: {
      total: 100,
      page: 1,
      results,
    },
  });
}

const risk_category_detail = {
  uid: 'cab1c3d5-888e-4a74-a2cd-6ad5edq5a211',
  company_id: 'e3cf1c15-2046-4292-9e57-a5fbc18c6999',
  risk_name: '测试case',
  risk_level: 1,
  created_time: '2021-12-11T16:35:21.932022+08:00',
  updated_time: '2021-12-12T16:35:21.932022+08:00',
};

// 创建风险类型
function createRiskCategory(req: Request, res: Response) {
  return res.json({
    code: 0,
    data: risk_category_detail,
  });
}

// 获取扫描识别位置
function getDetectPositions(req: Request, res: Response) {
  return res.json({
    code: 0,
    data: [
      {
        name: 'name',
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
  });
}

// 获取传输通道
function getTransmissionChannels(req: Request, res: Response) {
  return res.json({
    code: 0,
    data: [
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
  });
}

// 获取条件列表
function getCondList(req: Request, res: Response) {
  return res.json({
    code: 0,
    data: {
      total: 1,
      page: 1,
      results: [
        {
          uid: 'cab1c3d5-888e-4a74-a2cd-6ad5edf5a243',
          company_id: 'e3cf1c15-2046-4292-9e57-a5fbc18c6999',
          name: '身份证',
          source: 'default',
          status: 'activated',
          category_id: 'cab1c3d5-888e-4a74-a2cd-6ad5edf5a243',
          category_name: 'regexpr',
          category_display_name: '正则匹配',
          description: '文档中身份证匹配',
          value:
            '/^[1-9]d{7}((0d)|(1[0-2]))(([0|1|2]d)|3[0-1])d{3}$|^[1-9]d{5}[1-9]d{3}((0d)|(1[0-2]))(([0|1|2]d)|3[0-1])d{3}([0-9]|X)$/',
          created_time: '2021-12-11T16:35:21.932022+08:00',
          updated_time: '2021-12-12T16:35:21.932022+08:00',
        },
      ],
    },
  });
}

export default {
  'POST  /qzh/api/v1/rule/list': getRuleList,
  'POST  /qzh/api/v1/rule/action/getrulecategories': getRuleCategories,
  'POST  /qzh/api/v1/rule': createRiskRule,
  'POST  /qzh/api/v1/rule/:id': updateRiskRule,
  'POST  /qzh/api/v1/rule/:id/remove': deleteRiskRule,
  'POST  /qzh/api/v1/rule/:id/detail': getRuleDetail,
  'POST  /qzh/api/v1/rule/:id/action': updateRiskRuleStatus,
  'POST  /qzh/api/v1/risk/list': getRiskList,
  'POST  /qzh/api/v1/risk': createRiskCategory,
  'POST  /qzh/api/v1/rule/condition/list': getCondList,
  'POST  /qzh/api/v1/domaindata/action/getdetectpositions': getDetectPositions,
  'POST  /qzh/api/v1/domaindata/action/gettransmissionchannels': getTransmissionChannels,
};
