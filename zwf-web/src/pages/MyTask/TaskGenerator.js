
import React from 'react';
import styled from 'styled-components';
import { Radio, Space, Typography, Button, Steps, Form, Divider, Row, Col, Input, Alert, List } from 'antd';
import { PortfolioAvatar } from 'components/PortfolioAvatar';
import { listTaskTemplate } from 'services/taskTemplateService';
import { listPortfolio } from 'services/portfolioService';
import StepWizard from 'react-step-wizard';
import { Loading } from 'components/Loading';
import PropTypes from 'prop-types';
import TaskTemplateSelect from 'components/TaskTemplateSelect';
import ClientSelect from 'components/ClientSelect';
import { convertTaskTemplateFieldsToFormFieldsSchema } from '../../util/convertTaskTemplateFieldsToFormFieldsSchema';
import { getTaskTemplate$ } from 'services/taskTemplateService';
import FormBuilder from 'antd-form-builder'
import { catchError } from 'rxjs/operators';
import { DoubleRightOutlined, EyeFilled, EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import FinalReviewStep from './FinalReviewStep';
import { getUserDisplayName } from 'util/getDisplayName';
import { createNewTask$ } from 'services/taskService';
import { DocTemplateIcon } from 'components/entityIcon';

const { Title, Text, Paragraph } = Typography;

const DocListItem = styled(List.Item)`
padding-left: 12px;
padding-right: 12px;

&:hover {
  cursor: pointer;
  background-color: #F5F5F5;

  &:after {
    content: "click to view";
    color: #8abcd1;
  }
}
`;

const StyledDescription = props => <div style={{ marginTop: '0.5rem' }}><Text type="secondary">{props.value}</Text></div>

export const TaskGenerator = props => {
  const [taskTemplateId, setTaskTemplateId] = React.useState(props.taskTemplateId);
  const [clientInfo, setClientInfo] = React.useState(null);
  const [fields, setFields] = React.useState([]);
  const [taskTemplate, setTaskTemplate] = React.useState();
  const [taskName, setTaskName] = React.useState();
  const [current, setCurrent] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [clientFieldSchema, setClientFieldSchema] = React.useState([]);
  const [agentFieldSchema, setAgentFieldSchema] = React.useState([]);
  const formRef = React.createRef();

  React.useEffect(() => {
    if (clientInfo && taskTemplate) {
      const userName = getUserDisplayName(clientInfo.email, clientInfo.givenName, clientInfo.surname);
      const name = `${taskTemplate.name} for ${userName}`;
      setTaskName(name);
    }
  }, [clientInfo, taskTemplate])

  React.useEffect(() => {
    if (taskTemplate) {
      const clientFields = convertTaskTemplateFieldsToFormFieldsSchema(taskTemplate.fields, false);
      clientFields.fields.forEach(f => {
        f.required = false;
      });
      setClientFieldSchema(clientFields);
      const agentFields = convertTaskTemplateFieldsToFormFieldsSchema(taskTemplate.fields, true);
      setAgentFieldSchema(agentFields);
    }

  }, [taskTemplate])

  const handleTaskTemplateChange = taskTemplateIdValue => {
    // wizardRef.current.nextStep();
    setTaskTemplateId(taskTemplateIdValue);

    getTaskTemplate$(taskTemplateIdValue)
      .pipe(
        catchError(() => setLoading(false))
      )
      .subscribe(taskTemplate => {
        setTaskTemplate(taskTemplate)
        setLoading(false)
      })
  }

  const handleClientChange = client => {
    setClientInfo(client);
  }

  const handleStepChange = step => {
    setCurrent(step);
  }

  const handleFormValueChange = (changeValues, allValues) => {
    setFields(allValues.fields);
  }

  const handleNameEnter = (e) => {
    const name = e.target.value?.trim();
    setTaskName(name);
  }

  const handleCreateEmptyTask = () => {
    createTaskWithFields();
  }

  const handleCreateTask = () => {
    createTaskWithFields(fields);
  }

  const createTaskWithFields = (fields = {}) => {
    const payload = {
      clientEmail: clientInfo.email,
      taskTemplateId,
      taskName,
      fields,
    };

    setLoading(true);
    createNewTask$(payload).subscribe(() => {
      setLoading(false);
      props.onCreated();
    })
  }

  const handlePreviewDocTemplate = docId => {
    alert(docId);
  }
  const steps = [
    {
      title: 'Setup',
      content: <Space size="middle" direction="vertical" style={{ width: '100%' }}>
        <StyledDescription value="Choose existing client or type in a new client's email address." />
        <ClientSelect style={{ width: '100%' }}
          onChange={handleClientChange}
          onLoadingChange={setLoading}
          value={clientInfo?.email} />
        <StyledDescription value="Choose a task template to begin with." />
        <TaskTemplateSelect style={{ width: '100%' }} onChange={handleTaskTemplateChange} showIcon={true} value={taskTemplateId} />
        {taskTemplate?.docs.length > 0 && <>
          <StyledDescription value="Associated docs that will be auto-generated based on the form fields." />
          <List
            size="small"
            bordered
            rowKey="id"
            dataSource={taskTemplate.docs}
            renderItem={doc => <DocListItem onClick={() => handlePreviewDocTemplate(doc.id)}>
              <div><DocTemplateIcon /><Text>{doc.name}</Text></div>
            </DocListItem>}
          />
        </>}
        <StyledDescription value="Input a meaningful task name. This name will appear in the emails to the client." />
        <Input style={{ height: 50 }}
          placeholder="Task name"
          onPressEnter={handleNameEnter}
          value={taskName}
          onChange={e => setTaskName(e.target.value)} />
      </Space>
    },
    {
      title: 'Prefill fields',
      disabled: !clientInfo || !taskTemplate || !taskName,
      content: <Space size="middle" direction="vertical" style={{ width: '100%' }}>
        <Form
          ref={formRef}
          onValuesChange={handleFormValueChange}
          layout="horizontal"
          colon={false}
        // initialValues={{ name: taskTemplate.name }}
        >
          <Title level={5} type="secondary" style={{ marginTop: 20 }}>Client fields</Title>
          <Paragraph type="secondary">
            You can prefill some fileds on behalf of the client if you already have some of the information for this task.
          </Paragraph>
          <Divider style={{ marginTop: 4 }} />
          <FormBuilder meta={clientFieldSchema} form={formRef} />
          {agentFieldSchema?.fields?.length > 0 && <>
            <Title level={5} type="secondary" style={{ marginTop: 40 }}>Official only fields</Title>
            <Paragraph type="secondary">
              These fields are not visible to clients.
            </Paragraph>
            <Divider style={{ marginTop: 4 }} />
            <FormBuilder meta={agentFieldSchema} form={formRef} />
          </>}
        </Form>
      </Space>
    },
  ]

  return (
    <Loading loading={loading}>
      <Space direction='vertical' style={{ width: '100%', marginTop: 20 }} size="large">
        <Steps
          type="navigation"
          size="small"
          current={current}
          onChange={handleStepChange}
        >
          {/* <Steps progressDot current={currentStep}>
        <Steps.Step title="Choose task type" />
        <Steps.Step title="Choose portfolio" />
      </Steps> */}
          <>

            {steps.map(item => (
              <Steps.Step key={item.title} title={item.title} disabled={item.disabled} />
            ))}
          </>
        </Steps>
        <div>
          {steps[current].content}
        </div>
        <Divider style={{ margin: '10px 0' }} />
        {/* <Button block icon={<LeftOutlined />} disabled={current === 0} onClick={() => setCurrent(x => x - 1)}></Button> */}
        {/* <Button block icon={<RightOutlined />} disable={current === steps.length - 1} onClick={() => setCurrent(x => x + 1)}></Button> */}
        <Row justify='space-between'>
          <Button type="text" danger onClick={props.onCancel}>Cancel</Button>
          <Space>
            {current === 0 && <Button type="primary" ghost
              disabled={!clientInfo || !taskTemplate || !taskName}
              onClick={() => setCurrent(x => x + 1)}
              icon={<RightOutlined />}
            >Prefill Fields</Button>}
            {current === 0 && <Button type="primary"
              disabled={!clientInfo || !taskTemplate || !taskName}
              onClick={handleCreateEmptyTask}>Create Empty Task</Button>}
            {/* {current === steps.length - 1 && <Button type="primary" ghost disabled={current !== steps.length - 1}>Create Task & Another</Button>} */}
            {current === steps.length - 1 && <Button type="primary"
              onClick={handleCreateTask}
              disabled={current !== steps.length - 1}
            >Create Task</Button>}
          </Space>
        </Row>
      </Space>
    </Loading>
  );
};


TaskGenerator.propTypes = {
  taskTemplateId: PropTypes.string,
  onCancel: PropTypes.func,
  onCreated: PropTypes.func,
};

TaskGenerator.defaultProps = {
  onCancel: () => { },
  onCreated: () => { },
};