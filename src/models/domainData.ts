/**
 * 借助 @umijs/plugin-model 将普通定义的 hooks 状态变成全局状态，
 * 使原先 hooks 隔离的状态变成可以共享。
 */
import { useState, useEffect } from 'react';
import { queryOptionsList } from '@/pages/data-view/service';

export default function useDomainDataModel() {
  const [domainData, setDomainData] = useState<any>(null);

  const queryDomainData = () => {
    queryOptionsList()
      .then((res) => setDomainData(res))
      .catch((error) => {
        console.log('domain error:', error);
      });
  };

  useEffect(() => {
    queryDomainData();
  }, []);

  return {
    domainData,
    queryDomainData,
  };
}
