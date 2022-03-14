import type { FC } from 'react';
import { Form } from 'antd';
import { InfoCard } from '@svl-ad/pro-components';
import CheckboxTree from '@/components/UiComponent/checkboxTree';
import type { TTransChannels } from '../data';

interface ITransChannelProps {
  channels: TTransChannels[];
}

const TransChannel: FC<ITransChannelProps> = (props) => {
  const { channels } = props;

  return (
    <>
      <InfoCard cardTitle={null} showHighLightIcon={false}>
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
          <CheckboxTree treeData={channels} />
        </Form.Item>
      </InfoCard>
    </>
  );
};

export default TransChannel;
