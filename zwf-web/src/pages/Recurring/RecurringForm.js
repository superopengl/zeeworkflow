import { Button, Form, Select, Space, Typography, InputNumber, Checkbox, Switch } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
// import 'pages/AdminTask/node_modules/react-chat-elements/dist/main.css';

import { listTaskTemplate } from 'services/taskTemplateService';
import { getRecurring, saveRecurring } from 'services/recurringService';
import styled from 'styled-components';
import * as moment from 'moment';
import { DateInput } from 'components/DateInput';
import TaskTemplateSelect from 'components/TaskTemplateSelect';
import { ClientSelect } from 'components/ClientSelect';

const { Paragraph } = Typography;


const RecurringForm = (props) => {
  const { id } = props;
  // const { name, id, fields } = value || {};

  const [loading, setLoading] = React.useState(true);
  const [form] = Form.useForm();
  const [taskTemplateList, setTaskTemplateList] = React.useState([]);
  const [portfolioList, setPortfolioList] = React.useState([]);
  const [initialValues, setInitialValues] = React.useState();

  const loadEntity = async () => {
    setLoading(true);
    const taskTemplateList = await listTaskTemplate();
    const portfolioList = []//  await listPortfolio();
    if (id) {
      const recurring = await getRecurring(id);
      setInitialValues(recurring);
    }
    setTaskTemplateList(taskTemplateList);
    setPortfolioList(portfolioList);
    setLoading(false);
  }

  const handleSaveRecurring = async (values) => {
    const recurring = {
      id,
      ...values
    }

    await saveRecurring(recurring);
    props.onOk();
  }

  React.useEffect(() => {
    loadEntity();
  }, [id]);

  return <>
    {!loading && <Form layout="vertical" onFinish={handleSaveRecurring} form={form} initialValues={initialValues}>
      <Space direction="vertical" size="small">
        <Paragraph type="secondary">The recurring will happen at 5:00 am (Sydney time) on the specified day.</Paragraph>
        <Form.Item label="Client" name="clientId" rules={[{ required: true, message: ' ' }]}>
          <ClientSelect style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Task Template" name="taskTemplateId" rules={[{ required: true, message: ' ' }]}>
          <TaskTemplateSelect />
        </Form.Item>
        <Form.Item
          label="Start On (First Run)" name="firstRunOn" 
          extra="The recurring will happen at 5:00 am (Sydney time) on the specified day."
          rules={[{
            required: true, message: ' ', validator: async (rule, value) => {
              if (!value || !moment(value).isValid()) {
                throw new Error();
              }
            }
          }]}
        >
          <DateInput placeholder="DD/MM/YYYY" style={{ display: 'block' }} />
        </Form.Item>
        <Form.Item
          label="Repeat Every" name="every" rules={[{ required: true, message: ' ' }]}
        // help={`Preview: ${cornPreview}`}
        >
          {/* <Input autoSize={{ minRows: 3, maxRows: 20 }} maxLength={20} placeholder="Type here ..." allowClear disabled={loading} /> */}
          <InputNumber min={1} max={52} />
        </Form.Item>
        <Form.Item
          label="Repeat Period" name="period" rules={[{ required: true, message: ' ' }]}
        // help={`Preview: ${cornPreview}`}
        >
          {/* <Input autoSize={{ minRows: 3, maxRows: 20 }} maxLength={20} placeholder="Type here ..." allowClear disabled={loading} /> */}
          <Select>
            <Select.Option value="year">Yearly</Select.Option>
            <Select.Option value="month">Monthly</Select.Option>
            <Select.Option value="week">Weekly</Select.Option>
            <Select.Option value="day">Daily</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item style={{ marginTop: '1rem' }}>
          <Button type="primary" block htmlType="submit" disabled={loading} >Save</Button>
        </Form.Item>
      </Space>
    </Form>}
  </>;
};

RecurringForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

RecurringForm.defaultProps = {
  visible: false,
};

export default RecurringForm;
