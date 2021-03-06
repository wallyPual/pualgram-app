import React, { useState, useEffect } from 'react';
import { Image, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import Loader from '../../components/Loader';
import constants from '../../constants';

const View = styled.View`flex: 1;`;
const Button = styled.TouchableOpacity`
  padding: 5px 20px;
  position: absolute;
  right: 5px;
  top: 15px;
  background-color: ${props => props.theme.blueColor};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;
const Text = styled.Text`
  color: white;
  font-weight: 600;
`;
const EmptyText = styled.Text`color: ${props => props.theme.blackColor};`;

export default ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [selected, setSelected] = useState();
  const [allPhotos, setAllPhotos] = useState();
  const changeSelected = photo => {
    setSelected(photo);
  };
  const getPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync();
      const [firstPhoto] = assets;
      setSelected(firstPhoto);
      setAllPhotos(assets);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === 'granted') {
        setHasPermission(true);
        getPhotos();
      }
    } catch (err) {
      console.log(err);
      setHasPermission(false);
    }
  };

  const handleSelected = () => {
    navigation.navigate('Upload', { photo: selected });
  };

  useEffect(() => {
    askPermission();
  }, []);

  return (
    <View>
      {loading
        ? <Loader />
        : hasPermission && allPhotos.length > 0
          ? <View>
              <Image
                style={{ width: constants.width, height: constants.height / 2 }}
                source={{ uri: selected.uri }}
              />
              <Button onPress={handleSelected}>
                <Text>Select Photo</Text>
              </Button>
              <ScrollView
                contentContainerStyle={{
                  flexDirection: 'row',
                  flexWrap: 'wrap'
                }}
              >
                {allPhotos.map(photo =>
                  <TouchableOpacity
                    onPress={() => changeSelected(photo)}
                    key={photo.id}
                  >
                    <Image
                      source={{ uri: photo.uri }}
                      style={{
                        width: constants.width / 3,
                        height: constants.height / 6,
                        opacity: photo.id === selected.id ? 0.5 : 1
                      }}
                    />
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          : <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <EmptyText>사진이 없습니다.</EmptyText>
            </View>}
    </View>
  );
};
