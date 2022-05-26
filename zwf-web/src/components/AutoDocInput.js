
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Typography, Row, Col, Tooltip, Space } from 'antd';
import * as moment from 'moment';
import { DocTemplatePreviewPanel } from './DocTemplatePreviewPanel';
import { saveDocTemplate, getDocTemplate$ } from 'services/docTemplateService';
import { Loading } from './Loading';
import { finalize } from 'rxjs/operators';
import { DocTemplateIcon } from './entityIcon';
import { EditOutlined, EyeOutlined, FileAddFilled, FileAddOutlined, SyncOutlined } from '@ant-design/icons';
import { MdOpenInNew } from 'react-icons/md';
import Icon from '@ant-design/icons';
import { showDocTemplatePreviewModal } from './showDocTemplatePreviewModal';
import { VarTag } from './VarTag';
import { generateAutoDoc$, getTaskDocDownloadUrl } from 'services/taskService';
import { FileIcon } from './FileIcon';
import { GlobalContext } from 'contexts/GlobalContext';
import { TaskFileName } from './TaskFileName';
import styled from 'styled-components';
import { FaSignature } from 'react-icons/fa';
import { showSignTaskFileModal } from './showSignTaskFileModal';

const { Link, Paragraph } = Typography;

const Container = styled.div`
border: 1px solid #D9D9D9;
border-radius: 4px;
width: 100%;
padding: 12px;
`;

export const AutoDocInput = (props) => {
  const { value, mode, fieldId, onChange } = props;
  const { docTemplateId } = value || {};
  const form = Form.useFormInstance();

  const [loading, setLoading] = React.useState(!!docTemplateId);
  const [docTemplate, setDocTemplate] = React.useState({});
  const context = React.useContext(GlobalContext);

  const { role } = context;

  const isClient = role === 'client';

  const validateMissingSiblingFields = () => {
    const allFields = form.getFieldsValue();
  }

  // React.useEffect(() => {
  //   const allFields = form.getFieldsValue();
  //   debugger;
  // });

  React.useEffect(() => {
    if (docTemplateId) {
      const sub$ = getDocTemplate$(docTemplateId)
        .pipe(
          finalize(() => setLoading(false))
        )
        .subscribe(d => {
          setDocTemplate(d);
        });
      return () => sub$.unsubscribe();
    }
  }, [docTemplateId]);

  const handlePreview = () => {
    showDocTemplatePreviewModal(docTemplate, { allowTest: true });
  }

  if (!docTemplateId) {
    return 'docTemplate is not specified';
  }

  const hasGenerated = !!value.fileId;
  const canGenerateDoc = !hasGenerated && !isClient && !value.signedAt;
  const canRegenerateDoc = hasGenerated && !isClient && !value.signedAt;
  const canRequestSign = hasGenerated && !isClient && !value.signedAt;
  const canClientSign = isClient && value.requiresSign && !value.signedAt

  const handleGenerateDoc = () => {
    setLoading(true);
    generateAutoDoc$(fieldId).subscribe((result) => {
      onChange({
        ...value,
        ...result,
      })
      setLoading(false);
    })
  }

  const handleToggleRequireSign = () => {
    onChange({
      ...value,
      requiresSign: !value.requiresSign
    });
  }

  const handleSignTaskDoc = () => {
    showSignTaskFileModal(value, {
      onOk: () => {
        value.signedAt = new Date();
        onChange({...value});
      },
    })
  }

  return <Loading loading={loading}>
    <Container>
      <Row wrap={false} align="top" justify="space-between">
        {hasGenerated ? <Col>
          <TaskFileName taskFile={value} />
        </Col> : <Col>
          <Link onClick={handlePreview}>
            {/* <DocTemplateIcon /> */}
            <Space>
              <FileIcon name={'.pdf'} type="pending" />
              {docTemplate.name}
            </Space>
          </Link>
          {mode === 'taskTemplate' &&
            <Link href={`/doc_template/${docTemplate.id}`} target="_blank">
              <Button type="link" icon={<Icon component={MdOpenInNew} />} />
            </Link>}
        </Col>}
        <Col>
          <Space size="small">
          {canClientSign && <Tooltip title="Sign this document">
          <Button
            type="primary"
            danger
            icon={<Icon component={FaSignature} />}
            onClick={handleSignTaskDoc}
          >Sign</Button>
        </Tooltip>}
            {canRequestSign && <Tooltip title={value.requiresSign ? 'Click to cancel the signature request' : 'Ask client to sign this doc'}>
              <Button shape="circle"
                type={value.requiresSign ? 'primary' : 'default'}
                icon={<Icon component={FaSignature} />}
                onClick={handleToggleRequireSign}
              />
            </Tooltip>}
            {canGenerateDoc && <Tooltip title="Generate document">
              <Button type="primary" shape="circle" icon={<FileAddFilled />} onClick={handleGenerateDoc}></Button>
            </Tooltip>}
            {canRegenerateDoc && <Tooltip title="Re-generate document">
              <Button type="primary" shape="circle" icon={<SyncOutlined />} onClick={handleGenerateDoc}></Button>
            </Tooltip>}
          </Space>
        </Col>
      </Row>
      {/* <Button type="link" icon={<EyeOutlined/>}/> */}
      {/* <DocTemplatePreviewPanel value={docTemplate} /> */}
      <small>
        <Paragraph type="secondary" style={{ margin: '4px 0 0 0' }}>
          Depending on fields {docTemplate.refFields?.map(f => <VarTag key={f}>{f}</VarTag>)}
        </Paragraph>
      </small>
      {/* <em>{JSON.stringify(value, null, 2)}</em> */}
    </Container>
  </Loading>
}

AutoDocInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  fieldId: PropTypes.string,
  // mode: PropTypes.string,
};

AutoDocInput.propTypes = {
  onChange: () => { },
  // mode: 'task'
};
