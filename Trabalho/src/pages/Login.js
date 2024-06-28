import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onInputEmail = (event) => {
    setEmail(event.target.value);
  };

  const onInputPassword = (event) => {
    setPassword(event.target.value);
  };

  const onClickButton = () => {
    if (!password || !email) return alert('Todos os campos devem ser preenchidos.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return alert('Por favor, insira um email válido.');
    }
    if (password.length < 8) return alert('Senha deve ter mais de 8 caracteres.');

    navigate('/');
  };

  return (
    <Box bg="gray.100" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="md" bg="white" p="8" borderRadius="lg" boxShadow="lg">
        <Heading as="h1" mb="6" textAlign="center">Tela de Login</Heading>
        <Stack spacing="4">
          <FormControl id="email">
            <FormLabel>E-Mail</FormLabel>
            <Input
              type="email"
              placeholder="Digite o e-mail"
              value={email}
              onChange={onInputEmail}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Senha</FormLabel>
            <Input
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={onInputPassword}
            />
          </FormControl>
          <Button colorScheme="blue" onClick={onClickButton}>
            Entrar
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Login;
