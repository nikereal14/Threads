import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';

export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [inputs, setInputs] = useState({
		name: '',
		username: '',
		email: '',
		password: '',
	});

	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);

	const handleSignup = async () => {
		try {
			const res = await fetch('/api/users/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();

			if (data.error) {
				showToast('Ошибка', data.error, 'error');
				return;
			}

			localStorage.setItem('user-threads', JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast('Ошибка', error, 'error');
		}
	};

	return (
		<Flex align={'center'} justify={'center'}>
			<Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
				<Stack align={'center'}>
					<Heading fontSize={'4xl'} textAlign={'center'}>
						Регистрация
					</Heading>
				</Stack>
				<Box
					rounded={'lg'}
					bg={useColorModeValue('white', 'gray.dark')}
					boxShadow={'lg'}
					p={8}
				>
					<Stack spacing={4}>
						<HStack>
							<Box>
								<FormControl isRequired>
									<FormLabel>Полное имя</FormLabel>
									<Input
										type='text'
										onChange={e =>
											setInputs({ ...inputs, name: e.target.value })
										}
										value={inputs.name}
									/>
								</FormControl>
							</Box>
							<Box>
								<FormControl isRequired>
									<FormLabel>Логин</FormLabel>
									<Input
										type='text'
										onChange={e =>
											setInputs({ ...inputs, username: e.target.value })
										}
										value={inputs.username}
									/>
								</FormControl>
							</Box>
						</HStack>
						<FormControl isRequired>
							<FormLabel>Email</FormLabel>
							<Input
								type='email'
								onChange={e => setInputs({ ...inputs, email: e.target.value })}
								value={inputs.email}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Пароль</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? 'text' : 'password'}
									onChange={e =>
										setInputs({ ...inputs, password: e.target.value })
									}
									value={inputs.password}
								/>
								<InputRightElement h={'full'}>
									<Button
										variant={'ghost'}
										onClick={() =>
											setShowPassword(showPassword => !showPassword)
										}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Stack spacing={10} pt={2}>
							<Button
								loadingText='Регистрация'
								size='lg'
								bg={useColorModeValue('gray.600', 'gray.700')}
								color={'white'}
								_hover={{
									bg: useColorModeValue('gray.700', 'gray.800'),
								}}
								onClick={handleSignup}
							>
								Регистрация
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={'center'}>
								Уже зарегистрированы?{' '}
								<Link color={'blue.400'} onClick={() => setAuthScreen('login')}>
									Авторизация
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
