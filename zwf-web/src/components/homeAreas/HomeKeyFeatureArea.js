import React from 'react';
import { Typography, Col, Row, Image } from 'antd';
import styled from 'styled-components';

const { Title, Paragraph, Text } = Typography;

const Container = styled.div`
justify-content: center;
margin: 5rem 0 0;
width: 100%;

// text-align: center;
// background: #fafafa;
// background: rgb(240, 242, 245);

.ant-table {
  font-size: 14px;
}
`;

const InnerContainer = styled.div`
width: 100%;
// max-width: 800px;
// background-color:  #F1F2F5;
// background-image: linear-gradient(5deg, #F1F2F5, #F1F2F5 50%, #ffffff 50%, #ffffff 100%);
padding: 0;
margin: 0 auto;
display: flex;
flex-direction: column;
align-items: center;

h2 {
  font-size:24px;
  font-weight:700;
}

.ant-row {
  margin: 0 auto;
  padding: 3rem 0;
}

.ant-col {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  align-items: center;
}

div.ant-typography {
  font-size: 16px;
  max-width: 100vw;
  width: 400px;
}
`;


const span = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12,
  xxl: 12
}

export const HomeKeyFeatureArea = () => {
  return (
    <Container>
      <InnerContainer>
        <Title style={{ textAlign: 'center' }}>Key Features</Title>
        <Row gutter={[48, 24]} justify='center' style={{ maxWidth: 800 }}>
          <Col {...span}>
            <Title level={2}><Text style={{ color: '#0FBFC4' }}>Task</Text> Template</Title>
            <Paragraph>Task management description. Task management description. Task management description. Task management description. </Paragraph>
          </Col>
          <Col {...span} >
            <Image src="/images/feature-task-template.svg" preview={false} />
          </Col>
        </Row>
        <Row gutter={[24, 24]} justify='center'>
          <Col span={24}>
            <Title level={2}><Text style={{ color: '#0051D9' }}>Doc</Text> Template</Title>
            <Paragraph style={{ width: 600 }}>Task management description. Task management description. Task management description. Task management description. </Paragraph>
          </Col>
          <Col span={24} style={{ display: 'flex', justifyContent: 'center', minWidth: 800, maxWidth: 1200 }}>
            <Image src="/images/feature-doc-template.svg" preview={false} />
          </Col>
        </Row>
        <Row gutter={[48, 24]} justify='center' style={{ maxWidth: 800 }}>
          <Col {...span}>
            <Title level={2}>Doc <Text style={{ color: '#F77234' }}>Sign</Text></Title>
            <Paragraph>Task management description. Task management description. Task management description. Task management description. </Paragraph>
          </Col>
          <Col {...span}>
            <Image src="/images/feature-doc-sign.svg" preview={false} />
          </Col>
        </Row>
          <Row gutter={[48, 24]} justify='center' style={{ maxWidth: 800 }}>
            <Col {...span}>
              <Image src="/images/feature-timeline.svg" preview={false} />
            </Col>
            <Col {...span}>
              <Title level={2}><Text style={{ color: '#0FBFC4' }}>Timeline</Text></Title>
              <Paragraph>Task management description. Task management description. Task management description. Task management description. </Paragraph>
            </Col>
          </Row>
        <Row justify='center' style={{ width: '100%', height: '3rem', backgroundImage: 'linear-gradient(to top left, #F6F7F9, #F6F7F9 50%, #ffffff 50%, #ffffff 100%)', paddingBottom: '5rem' }}>
        </Row>
        <Row gutter={[24, 24]} justify='center' style={{ width: '100%', backgroundColor: '#F6F7F9' }}>
          <Col span={24}>
            <Title level={2}>Task management</Title>
            <Paragraph style={{ width: 600 }}>Task management description. Task management description. Task management description. Task management description. </Paragraph>
          </Col>
          <Col span={24} style={{ display: 'flex', justifyContent: 'center', minWidth: 600, maxWidth: 1000 }}>
            <Image src="/images/feature-task-management.svg" preview={false} />
          </Col>
        </Row>
      </InnerContainer>
    </Container>
  )
}

HomeKeyFeatureArea.propTypes = {
};

HomeKeyFeatureArea.defaultProps = {
};
