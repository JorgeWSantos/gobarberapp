import React, { useRef, useCallback } from 'react';
import {
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather'
import Logo from '../../assets/logo.png';
import api from '../../services/api';

import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErros';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core'

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText
} from './styles';
import Input from '../../components/Input'
import Button from '../../components/Button'

interface SignUpFormData {
  email: string;
  password: string;
  name: string;
}

const SignUp: React.FC = () => {

  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome Obrigatório.'),
          email: Yup.string()
            .required('E-mail Obrigatório')
            .email('Digite um email válido.'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        Alert.alert('Cadastro realizado com sucesso.', 'Você já pode fazer login na tela inicial.')

        navigation.navigate('SignIn')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert('Erro no cadastro', 'Ocorreu um erro ao fazer  o cadastro, cheque as credenciais.')
      }
    },
    [navigation],
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
          <Title>Crie sua conta</Title>
          <Form ref={formRef} onSubmit={handleSignUp}>

            <Input
              autoCapitalize='words'
              name='name'
              icon='user'
              placeholder='Nome'
              returnKeyType='next'
              onSubmitEditing={() => {
                emailInputRef.current.focus();
              }}
            />

            <Input
              ref={emailInputRef}
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
              textContentType='newPassword'
              icon='lock'
              placeholder='Senha'
              secureTextEntry
              returnKeyType='send'
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
            />

            <Button onPress={() => formRef.current?.submitForm()}>Cadastrar</Button>
          </Form>
        </Container>

        <BackToSignInButton onPress={() => { navigation.goBack()}}>
          <Icon name="arrow-left" size={20} color="#fff" />
          <BackToSignInButtonText>
            Voltar para o logon
          </BackToSignInButtonText>
        </BackToSignInButton>
      </ScrollView>

    </KeyboardAvoidingView>

)};

export default SignUp;
