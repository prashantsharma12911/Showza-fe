import { useState, type FormEvent } from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  Icon,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiFilm, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = login(username, password);
    if (ok) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <Center minH="100vh" bgGradient="linear(to-br, gray.900, blue.900)">
      <Box
        bg="white"
        p={10}
        rounded="xl"
        boxShadow="2xl"
        w="full"
        maxW="md"
        mx={4}
      >
        <Stack spacing={2} align="center" mb={8}>
          <Center bg="blue.600" rounded="full" boxSize={14}>
            <Icon as={FiFilm} boxSize={7} color="white" />
          </Center>
          <Heading size="lg" color="gray.800">
            Showza Admin
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Sign in to manage the platform
          </Text>
        </Stack>

        {error && (
          <Alert status="error" rounded="md" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword((s) => !s)}
                    tabIndex={-1}
                  >
                    <Icon as={showPassword ? FiEyeOff : FiEye} />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button type="submit" colorScheme="blue" size="lg" mt={2}>
              Sign In
            </Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
}
