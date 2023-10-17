import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';

const UserPage = () => {
	return (
		<>
			<UserHeader />
			<UserPost
				likes={1200}
				replies={481}
				postImg='/post1.png'
				postTitle="Let's talk about threads."
			/>
			<UserPost
				likes={325}
				replies={553}
				postImg='/post2.png'
				postTitle='Nice tutorial'
			/>
			<UserPost
				likes={1567}
				replies={123}
				postImg='/post3.png'
				postTitle='I love this guy.'
			/>
			<UserPost
				likes={532}
				replies={756}
				postTitle='This is my first thread.'
			/>
		</>
	);
};

export default UserPage;
