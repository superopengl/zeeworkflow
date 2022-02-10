import { Button, Row, Space, Pagination, Radio, Tooltip, Drawer } from 'antd';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { searchTask$ } from '../../services/taskService';
import styled from 'styled-components';
import { Loading } from 'components/Loading';
import { catchError } from 'rxjs/operators';
import { HiOutlineViewBoards, HiOutlineViewList } from 'react-icons/hi';
import Icon, { FilterFilled, FilterOutlined, SyncOutlined } from '@ant-design/icons';
import { TaskBoardPanel } from './TaskBoardPanel';
import { TaskListPanel } from './TaskListPanel';
import { reactLocalStorage } from 'reactjs-localstorage';
import { IoRefreshOutline } from 'react-icons/io5';
import { TaskSearchDrawer } from './TaskSearchPanel';


const LayoutStyled = styled(Space)`
  margin: 0 auto 0 auto;
  // background-color: #ffffff;
  height: 100%;
  width: 100%;
`;

const DEFAULT_QUERY_INFO = {
  text: '',
  page: 1,
  size: 200,
  total: 0,
  status: ['todo', 'in_progress', 'pending_fix', 'pending_sign', 'signed', 'done'],
  orderField: 'lastUpdatedAt',
  orderDirection: 'DESC'
};

const TaskListPage = () => {
  const [loading, setLoading] = React.useState(true);
  const [taskList, setTaskList] = React.useState([]);
  const [viewMode, setViewMode] = React.useState('board');
  const [queryInfo, setQueryInfo] = React.useState(DEFAULT_QUERY_INFO)
  const [filterVisible, setFilterVisible] = React.useState(false);

  React.useEffect(() => {
    const subscription = reloadWithQueryInfo$(queryInfo)
    return () => subscription.unsubscribe()
  }, []);

  React.useEffect(() => {
    reactLocalStorage.setObject('query', queryInfo);
  }, [queryInfo]);

  const reloadWithQueryInfo$ = (queryInfo) => {
    setLoading(true);
    return searchTask$({ ...queryInfo, page: 1 })
      .pipe(
        catchError(() => setLoading(false))
      )
      .subscribe(resp => {
        setTaskList(resp.data);
        setQueryInfo(q => ({
          ...q,
          ...resp.pagination,
        }))
        setLoading(false);
      });
  }

  const onChangeViewMode = e => {
    setViewMode(e.target.value);
  }

  const handleReload = () => {
    reloadWithQueryInfo$(queryInfo)
  }

  const handlePaginationChange = (page, size) => {
    const newQueryInfo = {
      ...queryInfo,
      page,
      size
    }
    reloadWithQueryInfo$(newQueryInfo);
  }

  const handleFilterSearch = newQueryInfo => {
    setQueryInfo({...newQueryInfo});
    reloadWithQueryInfo$(newQueryInfo);
  }

  return (
    <Loading loading={loading} >
      <LayoutStyled direction="vertical" size="large">
        <Space style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '1rem' }}>
          <Tooltip title="Filters">
            <Button icon={<FilterFilled />} onClick={() => setFilterVisible(true)} >Filter</Button>
          </Tooltip>
          <Radio.Group buttonStyle="solid" onChange={onChangeViewMode} value={viewMode}>
            <Tooltip title="Board view">
              <Radio.Button value="board">
                <Icon component={() => <HiOutlineViewBoards />} />
              </Radio.Button>
            </Tooltip>
            <Tooltip title="List view">
              <Radio.Button value="list">
                <Icon component={() => <HiOutlineViewList />} />
              </Radio.Button>
            </Tooltip>
          </Radio.Group>
          <Tooltip title="Refresh">
            <Button icon={<SyncOutlined />} onClick={handleReload} />
          </Tooltip>

        </Space>
        {viewMode === 'board' && <TaskBoardPanel tasks={taskList} onChange={handleReload} searchText={queryInfo.text} />}
        {viewMode === 'list' && <TaskListPanel tasks={taskList} onChange={handleReload} searchText={queryInfo.text} />}
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Pagination size="small" onChange={handlePaginationChange}
            total={queryInfo.total} showSizeChanger={true} pageSize={queryInfo.size} />
        </Space>
      </LayoutStyled>
      <TaskSearchDrawer
        queryInfo={queryInfo}
        onChange={handleFilterSearch}
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />
    </Loading>
  )
}

TaskListPage.propTypes = {};

TaskListPage.defaultProps = {};

export default withRouter(TaskListPage);