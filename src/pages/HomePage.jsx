import { Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import Post from '../components/Post';
import useShowToast from '../hooks/useShowToast';

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();
	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch('/api/posts/feed');
				const data = await res.json();
				if (data.error) {
					showToast('Ошибка', data.error, 'error');
					return;
				}
				console.log(data);
				setPosts(data);
			} catch (error) {
				showToast('Ошибка', error.message, 'error');
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);

	return (
		<>
			{!loading && posts.length === 0 && (
				<h1>Подпишитесь на пользователей, чтобы увидеть ленту</h1>
			)}

			{loading && (
				<Flex justify='center'>
					<Spinner size='xl' />
				</Flex>
			)}

			{posts.map(post => (
				<Post key={post._id} post={post} postedBy={post.postedBy} />
			))}
		</>
	);
};

export default HomePage;
