import { DownOutlined, CloseOutlined } from '@ant-design/icons';
import { Tree, Input, Checkbox, List, Tag, Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import VirtualList from 'rc-virtual-list';
import styles from './index.less';
import { cloneDeep, remove } from 'lodash';
import { getTypeTree, getEquipmentList } from './service';
import { useRequest } from 'umi';
import type { ITableQuery } from '@/common';
import { addSerialNumber, DFT_PAGE_OPTION } from '@/utils/table';
import type { IEquipment } from './data';
import type { IDevice } from '@/pages/user-device/device-list/data';
const ContainerHeight = 444;
const { Search } = Input;

interface INormalDeliveryScopeSelectorProps {
  width: number;
  expandedHeight: number;
  isInitialExpand?: boolean; // 默认打开
  className: string;
  onConfirm?: (values: IDevice[]) => void;
  chosenData: [];
  rule_id?: string; // 规则ID
}
const topContainerHeight = 472;
const NormalDeliveryScopeSelector: React.FC<INormalDeliveryScopeSelectorProps> = (props) => {
  const { width, expandedHeight, onConfirm, chosenData, rule_id, isInitialExpand } = props;
  const [rightListDataRes, setRightListDataRes] = useState<any>({
    results: [],
  });
  const [isExpanded, setIsExpanded] = useState(isInitialExpand);
  const [checkedIds, setCheckedIds] = useState<IDevice[]>([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [leftListData, setLeftListData] = useState([]);
  const [filters, setFilters] = useState<ITableQuery>({
    ...DFT_PAGE_OPTION,
    limit: 20,
  });

  const { loading: leftLoading } = useRequest(
    () => getTypeTree({ scope: 'common', rule_id: rule_id }),
    {
      formatResult: (res) => {
        setLeftListData(res);
        return res;
      },
    },
  );
  const { loading: rightLoading } = useRequest(() => getEquipmentList(filters), {
    refreshDeps: [filters],
    formatResult: (res) => {
      res.results.forEach((o: IEquipment) => (o.category = 'device'));
      const newResult = addSerialNumber(
        filters.page !== 1 ? rightListDataRes.results.concat(res.results) : res.results,
        filters,
      );
      const resData = { ...res, results: newResult };
      setRightListDataRes(resData);
    },
  });
  useEffect(() => {
    if (chosenData) {
      chosenData?.forEach((o: IEquipment) => (o.category = 'device'));
      setCheckedIds(chosenData);
      setIndeterminate(chosenData?.length > 0);
    }
  }, [chosenData]);
  useEffect(() => {
    setCheckedIds(cloneDeep(chosenData || []));
  }, []);

  const appendData = () => {
    if (rightListDataRes.total === rightListDataRes.results.length) {
      return;
    }
    setFilters({
      ...filters,
      page: filters.page + 1,
    });
  };
  const onScroll = (e: any) => {
    if (Math.floor(e.target.scrollHeight - e.target.scrollTop) === ContainerHeight) {
      appendData();
    }
  };
  const handleCheckedAll = useCallback(
    (e) => {
      setIsCheckedAll(e.target.checked);
      setCheckedIds(e.target.checked ? rightListDataRes.results : []);
      setIndeterminate(false);
      onConfirm?.(e.target.checked ? rightListDataRes.results : []);
    },
    [rightListDataRes],
  );
  const handleClickRow = (obj: IDevice) => () => {
    const checkedArr = checkedIds;
    if (checkedIds.some((o: IDevice) => o.uid === obj.uid)) {
      remove(checkedArr, (checkedObj: any) => checkedObj.uid === obj.uid);
      setIndeterminate(
        checkedArr.length !== 0 && checkedArr.length < rightListDataRes?.results?.length,
      );
      onConfirm?.(checkedArr);
      setCheckedIds(cloneDeep(checkedArr));
    } else {
      checkedArr.push(obj);
      setIndeterminate(checkedArr.length !== rightListDataRes.results.length);
      setIsCheckedAll(checkedArr.length === rightListDataRes.results.length);
      onConfirm?.(checkedArr);
      setCheckedIds(cloneDeep(checkedArr));
    }
  };

  const handleClickEquipmentRow = () => () => {
    setFilters({
      ...filters,
      page: 1,
    });
  };

  const handleClickTag = (data: any) => (e: any) => {
    setCheckedIds((preData) => {
      remove(preData, (item: any) => data.uid === item.uid);
      setIndeterminate(preData.length > 0);
      onConfirm?.(preData);
      return cloneDeep(preData);
    });
    e.preventDefault();
  };
  const handleClickSearch = (val: string) => {
    setFilters({
      ...filters,
      page: 1,
      search: val,
    });
  };

  const handleClickRightIcon = (e: any) => {
    if (checkedIds.length) {
      setCheckedIds([]);
      setIsCheckedAll(false);
      onConfirm?.([]);
      e.stopPropagation();
    }
  };
  return (
    <div
      className={props.className}
      style={{
        width,
        minHeight: isExpanded ? expandedHeight : 32,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className={styles.selectorView}
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <div className={styles.wrapTagContainer}>
          {checkedIds.length !== 0 ? (
            checkedIds.map((data: any) => {
              return (
                <Tag
                  key={data.uid}
                  closable
                  onClose={handleClickTag(data)}
                  className={styles.tagView}
                >
                  {data.code}
                </Tag>
              );
            })
          ) : (
            <span className={styles.placeholderContainer}>请选择下发设备</span>
          )}
        </div>
        <div onClick={handleClickRightIcon}>
          {checkedIds.length ? (
            <CloseOutlined style={{ color: '#C8C9CC' }} />
          ) : (
            <DownOutlined style={{ color: '#C8C9CC' }} />
          )}
        </div>
      </div>
      <div className={styles.bottomWrapContainer} style={{ display: isExpanded ? 'flex' : 'none' }}>
        <div className={styles.topContainer} id={'topContainer'}>
          <div className={styles.topLeftContainer}>
            <Spin spinning={leftLoading}>
              <Tree
                height={topContainerHeight}
                treeData={leftListData as any[]}
                titleRender={(nodeData: any) => {
                  return (
                    <div
                      key={nodeData.category}
                      className={styles.equipmentItemContainer}
                      onClick={handleClickEquipmentRow()}
                    >
                      <div>{nodeData.category_name}</div>
                      <div>{`${
                        checkedIds.filter((o: any) => o.category === nodeData.category)?.length
                      }/ ${nodeData.total}`}</div>
                    </div>
                  );
                }}
              />
            </Spin>
          </div>
          <div className={styles.topRightContainer}>
            <Search
              placeholder="请搜索设备"
              style={{ height: 32, width: '100%' }}
              onSearch={handleClickSearch}
            />
            <div className={styles.checkAllContainer}>
              <Checkbox
                indeterminate={indeterminate}
                checked={isCheckedAll}
                onChange={handleCheckedAll}
              >
                全选
              </Checkbox>
            </div>
            <Spin spinning={rightLoading}>
              <div className={styles.wrapScrollView}>
                <List>
                  <VirtualList
                    data={rightListDataRes.results}
                    height={ContainerHeight}
                    itemHeight={32}
                    itemKey="uid"
                    onScroll={onScroll}
                  >
                    {(item: any) => {
                      return (
                        <div
                          key={item.uid}
                          style={{ height: 32, paddingLeft: 12 }}
                          className={styles.itemRow}
                          onClick={handleClickRow(item)}
                        >
                          <Checkbox
                            checked={checkedIds.some((o: any) => item.uid === o.uid) || false}
                            style={{ marginRight: '8px' }}
                          />
                          {item.code}
                        </div>
                      );
                    }}
                  </VirtualList>
                </List>
              </div>
            </Spin>
          </div>
        </div>
        {/* <div className={styles.bottomContainer}>
          <span className={styles.totalText}>{`已选中${checkedIds.length}个选项`}</span>
          <div>
            <Button style={{ marginRight: 24, width: 75, height: 32 }} onClick={handleClickCancel}>
              取消
            </Button>
            <Button style={{ width: 75, height: 32 }} type="primary" onClick={handleClickConfirm}>
              确定
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default NormalDeliveryScopeSelector;
