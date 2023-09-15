import { StyleSheet, Text, View, Alert, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Appbar, Card } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { ComponentNavigationProps, NewsData } from '../utils/types'; // Import the NewsData type
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardItem from '../components/CardItem'
const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('newsData');
    if (value !== null) {
      // value previously stored
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
    Alert.alert('Something went wrong...');
    return [];
  }
};

const storeData = async(value: string) =>{
  const data: NewsData[] = (await getData()) || [];
  const filtered = data.filter((news)=>news.title!==value)
  try {
    const jsonValue = JSON.stringify(filtered);
    await AsyncStorage.setItem("newData", jsonValue);
  } catch (e) {
    return Alert.alert("Something went wrong with storing data");
  }
};

const Saved = (props: ComponentNavigationProps) => {
  const [savedNews, setSavedNews] = useState<NewsData[]>([]); // Explicitly specify the type as NewsData[]

  const focused = useIsFocused();
  const deleteHandler = async(val: string) => {
    await storeData(val);
  };
  useEffect(() => {
    getData()
      .then((data) => setSavedNews(data))
      .catch(() => Alert.alert('Error Occurred'));
  }, [focused, deleteHandler]);

  

  

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Saved" />
      </Appbar.Header>
      <FlatList keyExtractor={(item)=> item.title} data={savedNews} renderItem= {({item})=>
       <CardItem 
       handleDelete={deleteHandler}
       navigation ={props.navigation}
      description={item.description || ""}
      image_url= {item.image_url}
      title= {item.title}
      content={item.content}
      />
      }
      />
      {/* {savedNews && savedNews.length > 0 && (
        savedNews.map((data) => (
          <CardItem
            content={data.content}
            description={data.description || ''}
            image_url={data.image_url}
            navigation={props.navigation}
            title={data.title}
            key={data.title}
          />
        ))
      )} */}
    </View>
  );
};

export default Saved;

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  flatList:{
    display: 'flex',
    flex: 1,
    height: "auto",
  },
});
