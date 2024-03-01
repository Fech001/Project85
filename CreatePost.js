import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	Platform,
	StatusBar,
	Image,
	ScrollView,
	TextInput,
	Dimensions,
	Button,
	Alert,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Font from 'expo-font';

import { getAuth } from 'firebase/auth';
import { ref, onValue, set } from 'firebase/database';
import db from '../config';

import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

let customFonts = {
	'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class CreatePost extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fontsLoaded: false,
			previewImage: 'image_1',
			dropdownHeight: 40,
			light_theme: false,
		};
	}

	async _loadFontsAsync() {
		await Font.loadAsync(customFonts);
		this.setState({ fontsLoaded: true });
	}

	componentDidMount() {
		this._loadFontsAsync();
		this.fetchUser();
	}

	async fetchUser() {
		let theme;
		const auth = getAuth();
		const userId = auth.currentUser.uid;

		onValue(ref(db, '/users/' + userId), (snapshot) => {
			theme = snapshot.val().current_theme;
			this.setState({
				light_theme: theme === 'light' ? true : false,
			});
		});
	}

	async addPost() {
		if (
			this.state.caption
		) {
			var d = new Date();

			const auth = getAuth();
			const userId = auth.currentUser.uid;

			let postData = {
				preview_image: this.state.previewImage,
				caption: this.state.caption,
				likes: 0,
			};
			console.log(postData);

			const dbRef = ref(db, '/posts/' + Math.random().toString(36).slice(2));

			set(dbRef, postData);

			this.props.setUpdateToTrue();
			this.props.navigation.navigate('Feed');
		} else {
			Alert.alert(
				'Error',
				'All fields are required!',
				[{ text: 'OK', onPress: () => console.log('OK Pressed') }],
				{ cancelable: false }
			);
		}
	}

	render() {
		if (this.state.fontsLoaded) {
			SplashScreen.hideAsync();
			let preview_images = {
				image_1: require('../assets/image_1.jpg'),
				image_2: require('../assets/image_2.jpg'),
				image_3: require('../assets/image_3.jpg'),
				image_4: require('../assets/image_4.jpg'),
				image_5: require('../assets/image_5.jpg'),
				image_6: require('../assets/image_6.jpg'),
				image_7: require('../assets/image_7.jpg'),
			};
			return (
				<View
					style={this.state.light_theme ? styles.containerLight : styles.container}>
					<SafeAreaView style={styles.droidSafeArea} />
					<View style={styles.appTitle}>
						<View style={styles.appIcon}>
							<Image
								source={require('../assets/logo.png')}
								style={styles.iconImage}></Image>
						</View>
						<View style={styles.appTitleTextContainer}>
							<Text
								style={
									this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText
								}>
								New Post
							</Text>
						</View>
					</View>
					<View style={styles.fieldsContainer}>
						<Image
							source={preview_images[this.state.previewImage]}
							style={styles.previewImage}></Image>
						<View style={{ height: RFValue(this.state.dropdownHeight) }}>
							<DropDownPicker
								items={[
									{ label: 'Image 1', value: 'image_1' },
									{ label: 'Image 2', value: 'image_2' },
									{ label: 'Image 3', value: 'image_3' },
									{ label: 'Image 4', value: 'image_4' },
									{ label: 'Image 5', value: 'image_5' },
									{ label: 'Image 6', value: 'image_6' },
									{ label: 'Image 7', value: 'image_7' },
								]}
								defaultValue={this.state.previewImage}
								open={this.state.dropdownHeight == 170 ? true : false}
								onOpen={() => {
									this.setState({ dropdownHeight: 170 });
								}}
								onClose={() => {
									this.setState({ dropdownHeight: 40 });
								}}
								style={{
									backgroundColor: 'transparent',
									borderWidth: 1,
									borderColor: this.state.light_theme ? 'black' : 'white',
									color: 'red',
								}}
								textStyle={{
									color: this.state.dropdownHeight == 170 ? 'black' : 'white',
									fontFamily: 'Bubblegum-Sans',
								}}
								onSelectItem={(item) =>
									this.setState({
										previewImage: item.value,
									})
								}
							/>
						</View>
						<ScrollView>
							<TextInput
								style={
									this.state.light_theme ? styles.inputFontLightText : styles.inputFont
								}
								onChangeText={(caption) => this.setState({ caption })}
								placeholder={'Caption'}
								placeholderTextColor='white'
							/>

							
							<View style={styles.submitButton}>
								<Button
									onPress={() => this.addPost()}
									title='Submit'
									color='#841584'
								/>
							</View>
						</ScrollView>
					</View>
					<View style={{ flex: 0.08 }} />
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
	},
	containerLight: {
		flex: 1,
		backgroundColor: 'white',
	},
	droidSafeArea: {
		marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
	},
	appTitle: {
		flex: 0.07,
		flexDirection: 'row',
	},
	appIcon: {
		flex: 0.2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
	appTitleTextContainer: {
		flex: 0.8,
		justifyContent: 'center',
	},
	appTitleText: {
		color: 'white',
		fontSize: RFValue(28),
		fontFamily: 'Bubblegum-Sans',
	},
	appTitleTextLight: {
		color: 'black',
		fontSize: RFValue(28),
		fontFamily: 'Bubblegum-Sans',
	},
	fieldsContainer: {
		flex: 0.85,
	},
	previewImage: {
		width: '93%',
		height: RFValue(250),
		alignSelf: 'center',
		borderRadius: RFValue(10),
		marginVertical: RFValue(10),
		resizeMode: 'contain',
	},
	inputFont: {
		height: RFValue(40),
		marginTop: RFValue(40),
		borderColor: 'white',
		borderWidth: RFValue(1),
		borderRadius: RFValue(10),
		paddingLeft: RFValue(10),
		color: 'white',
		fontFamily: 'Bubblegum-Sans',
	},
	inputFontLightText: {
		height: RFValue(40),
		borderWidth: RFValue(1),
		borderRadius: RFValue(10),
		paddingLeft: RFValue(10),
		color: 'black',
		borderColor: 'black',
		fontFamily: 'Bubblegum-Sans',
	},
	inputFontExtra: {
		marginTop: RFValue(15),
	},
	inputTextBig: {
		textAlignVertical: 'top',
		padding: RFValue(5),
	},
	submitButton: {
		marginTop: RFValue(20),
		alignItems: 'center',
		justifyContent: 'center',
	},
});
