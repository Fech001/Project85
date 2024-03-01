import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Platform,
	StatusBar,
	Image,
	Dimensions,
	TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';

import * as Font from 'expo-font';

import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

let customFonts = {
	'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class PostCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fontsLoaded: false,
		};
	}

	async _loadFontsAsync() {
		await Font.loadAsync(customFonts);
		this.setState({ fontsLoaded: true });
	}

	componentDidMount() {
		this._loadFontsAsync();
	}

	render() {
		if (this.state.fontsLoaded) {
			SplashScreen.hideAsync();
			return (
				<TouchableOpacity
					style={styles.container}
					onPress={() =>
						this.props.navigation.navigate('PostScreen', {
							post: this.props.post,
						})
					}>
					<View style={styles.cardContainer}>
						<Image
							source={require('../assets/post.jpeg')}
							style={styles.postImage}></Image>

						<View style={styles.captionContainer}>
							<Text style={styles.postCaptionText}>{this.props.post.caption}</Text>
							<Text style={styles.postAuthorText}>{this.props.post.author}</Text>
						</View>
						<View style={styles.actionContainer}>
							<View style={styles.likeButton}>
								<Ionicons name={'heart'} size={RFValue(30)} color={'white'} />
								<Text style={styles.likeText}>12k</Text>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	cardContainer: {
		margin: RFValue(13),
		backgroundColor: '#2f345d',
		borderRadius: RFValue(20),
	},
	postImage: {
		resizeMode: 'contain',
		width: '95%',
		alignSelf: 'center',
		height: RFValue(250),
	},
	captionContainer: {
		paddingLeft: RFValue(20),
		justifyContent: 'center',
	},
	postCaptionText: {
		fontSize: RFValue(25),
		fontFamily: 'Bubblegum-Sans',
		color: 'white',
	},
	postAuthorText: {
		fontSize: RFValue(18),
		fontFamily: 'Bubblegum-Sans',
		color: 'white',
	},
	actionContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: RFValue(10),
	},
	likeButton: {
		width: RFValue(160),
		height: RFValue(40),
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#eb3948',
		borderRadius: RFValue(30),
	},
	likeText: {
		color: 'white',
		fontFamily: 'Bubblegum-Sans',
		fontSize: RFValue(25),
		marginLeft: RFValue(5),
	},
});
