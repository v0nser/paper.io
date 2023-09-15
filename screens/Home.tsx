//@ts-nocheck
import { StyleSheet, Text, View, FlatList } from 'react-native'
import { Appbar, Chip, Button, ProgressBar, MD3Colors } from 'react-native-paper';
import React, { useState } from 'react'
import { useTheme } from "react-native-paper";
import { NewsData } from '../utils/types';
import CardItem from '../components/CardItem'

const categories = ["Technology", "Sports", "Politics", "Entertainment", "Business"];
const API_KEY = "pub_290280a0d3a2033f121884b7ced1451b3d154";
// https://newsdata.io/api/1/news?apikey=pub_290280a0d3a2033f121884b7ced1451b3d154&category=business,entertainment,politics,sports,technology 

const Home = (props: ComponentNavigationProps) => {
  const [newsData, setNewsData] = useState<NewsData[]>([]);
  const [nextPage, setNextPage] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const handleSelect = (val: string) => {
    setSelectedCategories((prev: string[]) =>
        prev.find((p) => p === val)
            ? prev.filter((cat) => cat !== val)
            : [...prev, val]
    );
};
const handlePress = async () => {
  const URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en,hi${selectedCategories.length >0 ? `&category=${selectedCategories.join()}` : ""}${nextPage?.length > 0 ? `&page-${nextPage}` : ""}`;
  try { 
    setIsLoading(true)
    await fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      setNewsData((prev)=>[...prev, ...data.results]);
      setNextPage(data.nextPage);
    });
    setIsLoading(false);
  } catch(err) {
    console.log(err);
  }
};

// console.log(Object.keys(newsData[0]));
// if (newsData && newsData.length > 0) {
//   console.log(Object.keys(newsData[0]));
// } else {
//   console.log("newsData is undefined or empty");
// }
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Home"></Appbar.Content>
      </Appbar.Header>
      <View style={styles.filtersContainer}>
        {categories.map((cat) => <Chip key={cat} mode="outlined" style={styles.chipItem} textStyle={{fontWeight: "400", color: "white", padding: 1 }} showSelectedOverlay selected={selectedCategories.find((c) => cat===c) ? true : false} onPress={()=>handleSelect(cat)}>{cat}</Chip>)}
      <Button mode="contained" style={styles.button} labelStyle={{fontSize: 14, margin: "auto", color: theme.colors.onPrimary}} icon={"sync"} onPress={handlePress}>Refresh</Button>
      </View>
      <ProgressBar visible={isLoading} indeterminate color={MD3Colors.error50} />

      <FlatList keyExtractor={(item)=> item.title}onEndReached={()=>handlePress()} style={styles.flatList} data={newsData} renderItem= {({item})=>
       <CardItem 
       navigation ={props.navigation}
      description={item.description}
      image_url= {item.image_url}
      title= {item.title}
      content={item.content}
      />
      }
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  chipItem:{
    marginHorizontal: 5,
    marginVertical: 5,
  }, 
  button: {
    maxWidth: 400,
    padding: 0,
    maxHeight: 40,
  },
  flatList: {
    flex: 1,
    height: "auto"
  }
})