import { Avatar } from '@chakra-ui/avatar';
import { Box, Flex, Link, Text, VStack } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { Portal } from '@chakra-ui/portal';
import { Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { CgMoreO } from 'react-icons/cg';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';

const UserHeader = ({ user }) => {
	const toast = useToast();
	const currentUser = useRecoilValue(userAtom);
	const [following, setFollowing] = useState(
		user.followers.includes(currentUser?._id)
	);
	const showToast = useShowToast();
	const [updating, setUpdating] = useState(false);

	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: 'Успешно',
				status: 'success',
				description: 'Ссылка на профиль скопирована.',
				duration: 3000,
				isClosable: true,
			});
		});
	};

	const handleFollowUnfollow = async () => {
		if (!currentUser) {
			showToast('Ошибка', 'Авторизуйтесь чтобы подписаться.', 'error');
			return;
		}
		if (updating) return;

		setUpdating(true);
		try {
			const res = await fetch(`/api/users/follow/${user._id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const data = await res.json();
			if (data.error) {
				showToast('Ошибка', data.error, 'error');
				return;
			}

			if (following) {
				showToast('Успешно', `Отписались от ${user.name}`, 'success');
				user.followers.pop();
			} else {
				showToast('Успешно', `Подписались на ${user.name}`, 'success');
				user.followers.push(currentUser?._id);
			}
			setFollowing(!following);

			console.log(data);
		} catch (error) {
			showToast('Ошибка', error, 'error');
		} finally {
			setUpdating(false);
		}
	};

	return (
		<VStack gap={4} alignItems={'start'}>
			<Flex justifyContent={'space-between'} w={'full'}>
				<Box>
					<Text fontSize={'2xl'} fontWeight={'bold'}>
						{user.name}
					</Text>
					<Flex gap={2} alignItems={'center'}>
						<Text fontSize={'sm'}>{user.username}</Text>
					</Flex>
				</Box>
				<Box>
					{user.profilePic && (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: 'md',
								md: 'xl',
							}}
						/>
					)}
					{!user.profilePic && (
						<Avatar
							name={user.name}
							src='https://bit.ly/broken-link'
							size={{
								base: 'md',
								md: 'xl',
							}}
						/>
					)}
				</Box>
			</Flex>

			<Text>{user.bio}</Text>

			{currentUser?._id === user._id && (
				<Link as={RouterLink} to='/update'>
					<Button size={'sm'}>Редактировать профиль</Button>
				</Link>
			)}
			{currentUser?._id !== user._id && (
				<Button size={'sm'} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? 'Unfollow' : 'Follow'}
				</Button>
			)}
			<Flex w={'full'} justifyContent={'space-between'}>
				<Flex gap={2} alignItems={'center'}>
					<Text color={'gray.light'}>{user.followers.length} подписчиков</Text>
				</Flex>
				<Flex>
					<Box className='icon-container'>
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={'pointer'} />
							</MenuButton>
							<Portal>
								<MenuList bg={'gray.dark'}>
									<MenuItem bg={'gray.dark'} onClick={copyURL}>
										Копировать ссылку
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>

			<Flex w={'full'}>
				<Flex
					flex={1}
					borderBottom={'1.5px solid white'}
					justifyContent={'center'}
					pb='3'
					cursor={'pointer'}
				>
					<Text fontWeight={'bold'}> Записи</Text>
				</Flex>
				<Flex
					flex={1}
					borderBottom={'1px solid gray'}
					justifyContent={'center'}
					color={'gray.light'}
					pb='3'
					cursor={'pointer'}
				>
					<Text fontWeight={'bold'}> Комментарии</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;
