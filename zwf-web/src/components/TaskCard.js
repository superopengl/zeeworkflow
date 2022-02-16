import { Space, Card, Typography, Row, Col, Tooltip, Grid } from 'antd';
import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { UnreadMessageIcon } from './UnreadMessageIcon';
import { MdOpenInNew } from 'react-icons/md';
import Icon from '@ant-design/icons';
import { UserAvatar } from './UserAvatar';
import { UserDisplayName } from './UserDisplayName';
import { getUserDisplayName } from 'util/getDisplayName';
import { TagSelect } from './TagSelect';
import {HighlightingText} from 'components/HighlightingText';

const { Link: TextLink } = Typography;

const { useBreakpoint } = Grid;

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

export const TaskCard = withRouter((props) => {

  const { task, searchText } = props;
  const { id, name, givenName, surname, email, lastUnreadMessageAt, tags } = task;
  
  const screens = useBreakpoint();

  const goToTask = (e, id) => {
    e.stopPropagation();
    props.history.push(`/task/${id}`);
  }
  const tagIds = React.useMemo(() => tags.map(t => t.id), [tags]);

  return <StyledCard
    title={<Tooltip title={name} placement="bottom"><HighlightingText value={name} search={searchText}></HighlightingText></Tooltip>}
    extra={<TextLink onClick={e => goToTask(e, id)}><Icon component={() => <MdOpenInNew />} /></TextLink>}
    size="small"
    hoverable
    onClick={() => props.history.push(`/task/${id}`)}
    className={lastUnreadMessageAt ? 'unread' : ''}
  >
    <Space direction='vertical' size="middle" style={{width: '100%'}}>
      {lastUnreadMessageAt && <UnreadMessageIcon style={{ position: 'absolute', right: 16, top: 16 }} />}
      {/* <Paragraph type="secondary" style={{lineHeight: 0.8}}><small>{taskTemplateName}</small></Paragraph> */}
      <Tooltip title={getUserDisplayName(email, givenName, surname)} placement='bottom'>
        <Row gutter={10} wrap={false} style={{ width: '100%' }}>
          {screens?.xxl === true && <Col>
            <UserAvatar value={task.avatarFileId} color={task.avatarColorHex} size={40} />
          </Col>}
          <Col flex='auto'>
            <UserDisplayName
              email={email}
              surname={surname}
              givenName={givenName}
              searchText={searchText}
            />
          </Col>
        </Row>
      </Tooltip>
      {/* <pre>{JSON.stringify(task, null, 2)}</pre> */}
      {tagIds.length > 0 && <TagSelect readonly={true} value={tagIds} />}
    </Space>

  </StyledCard>
});

TaskCard.propTypes = {
  task: PropTypes.any.isRequired,
  searchText: PropTypes.string,
};

TaskCard.defaultProps = {};
