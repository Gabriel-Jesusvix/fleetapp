import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from 'styled-components';
import { Container, Input, Label } from './styles';
import { forwardRef } from 'react';

type Props = TextInputProps & {
  label: string;
}

export const LicensePlateInput = forwardRef<TextInput, Props>(({ label, ...rest }, ref) => {
  const { COLORS } = useTheme()

  return (
    <Container>
      <Label>
        {label}
      </Label>

      <Input
        maxLength={7}
        autoCapitalize='characters'
        placeholderTextColor={COLORS.GRAY_400}
        {...rest}
      />
    </Container>
  );
})