import React, { useState } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Loader from '../../components/Loader';
import Post from '../../components/Post';
import EmptyList from '../../components/EmptyList';
import { POST_FRAGMENT } from '../../fragments';

export const FEED_QUERY = gql`
  {
    seeFeed {
      ...PostParts
    }
  }
  ${POST_FRAGMENT}
`;

export default () => {
  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery(FEED_QUERY);
  const refresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };
  return loading
    ? <Loader />
    : <FlatList
        data={data.seeFeed}
        renderItem={({ item }) => <Post {...item} />}
        ListEmptyComponent={() => <EmptyList caption="새로운 피드가 없습니다." />}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={refresh}
      />;
};
