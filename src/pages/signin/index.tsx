import React, { useCallback, useRef } from 'react';
import {
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert
} from 'react-native';

import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core'
import getValidationErrors from '../../utils/getValidationErros';
import { useAuth } from '../../hooks/auth';

import Logo from '../../assets/logo.png';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

import Input from '../../components/Input'
import Button from '../../components/Button'

interface SignInFormData {
  email: string;
  password: string;
}

const Signin: React.FC = () => {

  const { signIn } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail Obrigatório')
            .email('Digite um email válido.'),
          password: Yup.string().required('Senha Obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });
      } catch (err) {

        console.log('err', err);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert('Erro na autenticação', 'Ocorreu um erro ao fazer login, cheque as credenciais.')
      }
    },
    [signIn],
  );

  return (
    <KeyboardAvoidingView
      style={{
        flex:1
      }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
      enabled
    >
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{flexGrow:1}}
      >
        <Container>
          <Image source={Logo}/>
          <Title>Faça seu Logon</Title>

          <Form
            ref={formRef}
            onSubmit={handleSignIn}
            style={{flex:1}}
          >
            <Input
              name='email'
              icon='mail'
              placeholder='E-mail'
              autoCorrect={false}
              autoCapitalize='none'
              keyboardType='email-address'
              returnKeyType='next'
              onSubmitEditing={() => {
                passwordInputRef.current.focus();
              }}
            />

            <Input
              name='password'
              ref={passwordInputRef}
              icon='lock'
              placeholder='Senha'
              secureTextEntry
              returnKeyType='send'
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
            />

            <Button onPress={() => {
              formRef.current?.submitForm();
            }}>
              Entrar
            </Button>
          </Form>

          <ForgotPassword>
            <ForgotPasswordText>
              Esqueci minha senha
            </ForgotPasswordText>
          </ForgotPassword>
        </Container>

        <CreateAccountButton onPress={() => { navigation.navigate('SignUp')}}>
          <CreateAccountButtonText>
            Criar conta
          </CreateAccountButtonText>
        </CreateAccountButton>
      </ScrollView>

    </KeyboardAvoidingView>

)};

export default Signin;
