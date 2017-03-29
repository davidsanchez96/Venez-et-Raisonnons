// @flow

import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { NavigationStyles } from '@expo/ex-navigation'
import ShowDown from 'showdown'
import {
  View,
  ScrollView,
  StatusBar,
} from 'react-native'
import {
  Header,
  StylizedHTMLView
} from '../components'

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 25,
  }
})

type ModalProps = {
  title: string,
  text: string,
}

const Modal = ({ title, text }: ModalProps) => {
  const converter = new ShowDown.Converter()
  const markdownToHtml = converter.makeHtml(text)

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        title={title}
        isLight
        isModal
      />
      <ScrollView contentContainerStyle={styles.content}>
        <StylizedHTMLView
          value={markdownToHtml}
        />
      </ScrollView>

    </View>
  )
}

Modal.route = {
  styles: {
    ...NavigationStyles.FloatVertical,
    gestures: null,
  }
}

export default Modal
