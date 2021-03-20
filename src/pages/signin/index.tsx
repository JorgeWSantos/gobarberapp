import React from 'react';
import { Image } from 'react-native';

import Logo from '../../assets/logo.png';

import { Container, Title } from './styles';

const Signin: React.FC = () => {
  return (
  <Container>
    <Image source={Logo}/>
    <Title>Faça seu Logon</Title>
  </Container>
)};

export default Signin;
