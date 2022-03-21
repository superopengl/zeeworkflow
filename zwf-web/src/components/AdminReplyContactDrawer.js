import { Drawer, Button } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import 'react-chat-elements/dist/main.css';
import { listTaskTrackings$ } from 'services/taskService';
import { TaskTrackingPanel } from './TaskTrackingPanel';
import { TaskMessageForm } from './TaskMessageForm';
import { listMyContact$, listUserContact$, subscribeUserContactChange, sendContact$ } from 'services/contactService';
import { ContactMessageList } from 'components/ContactMessageList';
import { filter, finalize } from 'rxjs/operators';
import { ContactMessageInput } from './ContactMessageInput';
import { SyncOutlined } from '@ant-design/icons';



export const AdminReplyContactDrawer = React.memo((props) => {
  const { title, userId, visible, onClose, eventSource } = props;
  const [loading, setLoading] = React.useState(true);
  const [chatDataSource, setChatDataSource] = React.useState([]);

  React.useEffect(() => {
    if (!userId) {
      setLoading(false)
      return;
    }
    const sub$ = load$();

    return () => sub$.unsubscribe()
  }, [userId]);

  React.useEffect(() => {
    eventSource.pipe(
      filter(e => e.userId === userId)
    ).subscribe(event => {
      setChatDataSource(list => {
        return [...(list ?? []), event]
      });
    });
  }, []);

  const load$ = () => {
    setLoading(true)
    return listUserContact$(userId).pipe(
      finalize(() => setLoading(false))
    ).subscribe(setChatDataSource)
  }

  const handleSubmitMessage = (message) => {
    return sendContact$(message, null, userId);
  }

  const handleReload = () => {
    load$();
  }

  return <Drawer
    visible={visible}
    onClose={onClose}
    title={title}
    destroyOnClose
    closable={false}
    autoFocus
    maskClosable
    width={500}
    extra={<Button icon={<SyncOutlined />} onClick={handleReload} />}
    bodyStyle={{ padding: 0, height: 'calc(100vh - 55px)' }}
    footerStyle={{padding: 0}}
    footer={<ContactMessageInput loading={loading} onSubmit={handleSubmitMessage} />}
  >
    <ContactMessageList dataSource={chatDataSource} loading={loading} />
  </Drawer>
});

AdminReplyContactDrawer.propTypes = {
  userId: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  eventSource: PropTypes.object.isRequired,
};

AdminReplyContactDrawer.defaultProps = {
  visible: false,
  onClose: () => { },
};

