import React, { Component } from "react";
import {View, StyleSheet, Image} from "react-native";

import { getAuth } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import db from '../config';

import {
    drawerContentScrollView,
    DrawerItemList,
} from "@react-navigation/drawer"

export default class CustomSideBarMenu extends Component{
  constructor(props) {
    super(props);
    this.state = {
      light_theme: true
    };
  }

  componentDidMount(){
    let theme;
    const auth = getAuth();
    const userId = auth.currentUser.userId
    
    onValue(ref(db, '/users/' + userId), (snapshot) =>{
      theme= snapshot.val().current_theme;
      this.setState({
        light_theme: theme === 'light' ? true:false,
      });
    });
  }
}