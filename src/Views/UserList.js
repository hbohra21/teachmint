import React from 'react';
import { Card, Col, Row } from 'antd';
import useFetch from '../Helpers/useFetch';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const navigate = useNavigate();
    const [data, isLoading, getData] = useFetch(
        'https://jsonplaceholder.typicode.com/users',
        [],
        true
    );
    const [postsData, isPLoading, getPostsData] = useFetch(
        'https://jsonplaceholder.typicode.com/posts',
        [],
        true
    );

    const handleUserClick = (user) => {
        navigate(`/user/${user.id}`, { state: { user } });
    };

    return (
        <>
            <div className='directoryText'>
                <h1>Directory</h1>
            </div>

            <Row gutter={16}>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    data?.map((user) => (
                        <Col span={24} key={user.id}>
                            <Card
                                className='userCard'
                                onClick={() => handleUserClick(user)}
                            >
                                <div className='userCardContent'>
                                    <p className='userName'>{user.name}</p>
                                    <p className='userPosts'>{postsData?.filter(p => p.userId == user.id).length} Posts</p>
                                </div>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </>
    );
};

export default UserList;
