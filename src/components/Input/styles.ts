import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { TextInputProps } from 'react-native'

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: #232129;
  border-radius: 10px;
  margin-bottom: 8px;
  border-width: 2px;
  border-color: #232129;

  flex-direction: row;
  align-items: center;

  ${props => props.isErrored === true && css`
    border-color: #c53030;
  `}

  ${props => props.isFocused === true && css`
    border-color: #ff9000;
  `}
`;

export const TextInput = styled.TextInput.attrs((props: TextInputProps) => {})`
  flex: 1;
  color: #fff;
  font-size: 16px;
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 16px;
`;
