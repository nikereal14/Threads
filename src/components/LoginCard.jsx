import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
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

export default function LoginCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const setUser = useSetRecoilState(userAtom);
	const [loading, setLoading] = useState(false);

	const [inputs, setInputs] = useState({
		username: '',
		password: '',
	});
	const showToast = useShowToast();
	const handleLogin = async () => {
		setLoading(true);
		try {
			const res = await fetch('/api/users/login', {
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
		} finally {
			setLoading(false);
		}
	};
	return (
		<Flex align={'center'} justify={'center'}>
			<Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
				<Stack align={'center'}>
					<Heading fontSize={'4xl'} textAlign={'center'}>
						Авторизация
					</Heading>
				</Stack>
				<Box
					rounded={'lg'}
					bg={useColorModeValue('white', 'gray.dark')}
					boxShadow={'lg'}
					p={8}
					w={{
						base: 'full',
						sm: '400px',
					}}
				>
					<Stack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Логин</FormLabel>
							<Input
								type='text'
								value={inputs.username}
								onChange={e =>
									setInputs(inputs => ({ ...inputs, username: e.target.value }))
								}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Пароль</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? 'text' : 'password'}
									value={inputs.password}
									onChange={e =>
										setInputs(inputs => ({
											...inputs,
											password: e.target.value,
										}))
									}
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
								loadingText='Авторизация'
								size='lg'
								bg={useColorModeValue('gray.600', 'gray.700')}
								color={'white'}
								_hover={{
									bg: useColorModeValue('gray.700', 'gray.800'),
								}}
								onClick={handleLogin}
								isLoading={loading}
							>
								Авторизация
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={'center'}>
								Нет аккаунта?{' '}
								<Link
									color={'blue.400'}
									onClick={() => setAuthScreen('signup')}
								>
									Регистрация
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
