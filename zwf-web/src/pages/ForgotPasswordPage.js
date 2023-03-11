import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Input, Button, Form, Layout } from 'antd';
import { Logo } from 'components/Logo';
import { forgotPassword$ } from 'services/authService';
import { notify } from 'util/notify';
import { ForgotPasswordPanel } from './ForgotPasswordPanel';
import HomeFooter from 'components/HomeFooter';
import { useAssertRole } from 'hooks/useAssertRole';

const LayoutStyled = styled(Layout)`
margin: 0 auto;
padding: 0;
background-color: #ffffff;
text-align: center;
min-height: 100%;
`;

const ContainerStyled = styled.div`
margin: 1rem auto;
padding: 2rem 3rem;
text-align: center;
max-width: 400px;
// background-color: #ffffff;
border: 1px solid #E3E6EB;
border-radius: 8px;
`;

const LogoContainer = styled.div`
  margin-bottom: 2rem;
`;

const { Title } = Typography;
const ForgotPasswordPage = props => {
  useAssertRole(['guest']);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  }

  return <LayoutStyled>
    <Layout.Content style={{ padding: '3rem 1rem' }}>
      <LogoContainer><Logo /></LogoContainer>
      <Title level={2}>Forgot Password</Title>
      <ContainerStyled>
        <ForgotPasswordPanel onFinish={() => navigate('/')} />
        {/* <Form.Item >
          <Button block type="link" onClick={() => goBack()}>Cancel</Button>
        </Form.Item> */}
      </ContainerStyled>
    </Layout.Content>
    <HomeFooter />
  </LayoutStyled>;
}

ForgotPasswordPage.propTypes = {};

ForgotPasswordPage.defaultProps = {};

export default ForgotPasswordPage;
