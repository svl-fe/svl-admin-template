import type { FC } from 'react';
import { Input, Form, Button } from 'antd';
import type { FormInstance } from 'antd';
import { Modal } from 'svl-design';
import type { ITableStatus } from '@/common';
import type { ICreateSystemAdminForm } from '../data';
import { NAME_REG, PASSWORD_REG } from '@/utils/regex';

const { Password } = Input;

interface IAdminProps {
  form: FormInstance<any>;
  status: ITableStatus;
  loading: boolean;
  onClose: () => void;
  onOk: (values: ICreateSystemAdminForm) => void;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const Admin: FC<IAdminProps> = (props) => {
  const { form, status, loading, onOk, onClose } = props;

  const onSubmit = () => form.submit();

  return (
    <Modal
      width={560}
      titleName={status === 'create' ? '新增管理员' : '编辑管理员'}
      visible={status === 'edit' || status === 'create'}
      onCancel={onClose}
      onOk={onSubmit}
      footer={[
        <Button size="large" key="back" onClick={onClose}>
          取消
        </Button>,
        <Button size="large" key="complete" type="primary" onClick={onSubmit} loading={loading}>
          完成
        </Button>,
      ]}
    >
      <Form form={form} name="control-hooks" onFinish={onOk} {...layout}>
        <Form.Item
          name="name"
          label="管理员用户名"
          rules={[
            { required: true },
            {
              pattern: NAME_REG,
              message: '用户名长度至少3位，只能包含大小写字母、数字，且首位不能为数字',
            },
          ]}
        >
          <Input disabled={status === 'edit'} placeholder="30个字符以内" maxLength={30} />
        </Form.Item>
        <Form.Item
          name="password"
          label="设置密码"
          rules={[
            { required: true },
            {
              pattern: PASSWORD_REG,
              message:
                '密码需包含大小写字母、特殊字符、数字中的三种，长度不得少于8位，且不能超过16位',
            },
          ]}
        >
          <Password placeholder="密码长度至少为8位，且需包含大小写字母、特殊字符、数字中的三种" />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="确认密码"
          dependencies={['password']}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('密码与确认密码不一致!'));
              },
            }),
          ]}
        >
          <Password placeholder="请输入确认密码" minLength={8} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Admin;
