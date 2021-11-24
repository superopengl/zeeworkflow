import { Space, Card, Modal, Typography, Descriptions } from 'antd';
import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { PortfolioAvatar } from 'components/PortfolioAvatar';
import PropTypes from 'prop-types';
import { MailOutlined, MessageOutlined } from '@ant-design/icons';
import { UnreadMessageIcon } from './UnreadMessageIcon';
import { TaskIcon } from './entityIcon';
import { MdOpenInNew } from 'react-icons/md';
import Icon from '@ant-design/icons';
import { showTaskModal } from 'components/showTaskModal';
import { GlobalContext } from 'contexts/GlobalContext';
import { UserAvatar } from './UserAvatar';
import { TimeAgo } from './TimeAgo';
import { TaskStatus } from './TaskStatus';
import { TaskStatusTag } from './TaskStatusTag';

const { Link: TextLink, Paragraph, Text, Title } = Typography;

const StyledCard = styled(Card)`
position: relative;
box-shadow: 0 1px 2px rgba(0,0,0,0.1);
.ant-card-body {
  padding: 16px;
}

&.unread {
  background-color: rgb(255,255,220);
  font-weight: 600;
}
`;

export const TaskClientCard = React.memo(withRouter(props => {

  const { task } = props;
  const { id, name, description, orgName, createdAt, lastUpdatedAt, status } = task;

  const goToTask = (e, id) => {
    e.stopPropagation();
    props.history.push(`/task/${id}`);
  }

  return <StyledCard
    title={<Title>{name}</Title>}
    size="large"
    hoverable
    onClick={e => goToTask(e, id)}
    extra={<TaskStatusTag status={status}/>}
  // className={lastUnreadMessageAt ? 'unread' : ''}
  >
    <Space direction="vertical" style={{ width: '100%' }}>
      <Text type="secondary">issued by <strong>{orgName}</strong></Text>
      <Paragraph>{description}</Paragraph>
      <Descriptions title={null} column={1} >
        <Descriptions.Item label="Updated At">
          <TimeAgo value={lastUpdatedAt} direction="horizontal" showTime={false} />
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          <TimeAgo value={createdAt} direction="horizontal" showTime={false} />
        </Descriptions.Item>
      </Descriptions>
    </Space>
    {/* <pre>{JSON.stringify(task, null, 2)}</pre> */}
  </StyledCard>
}));

TaskClientCard.propTypes = {
  task: PropTypes.any.isRequired
};

TaskClientCard.defaultProps = {};
