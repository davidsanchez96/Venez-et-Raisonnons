import React, { PropTypes } from 'react'
import {
  Text,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

const styles = EStyleSheet.create({
  text: {
    color: 'blue',
    borderColor: 'blue',
    borderWidth: 2,
    borderStyle: 'solid',
    backgroundColor: 'yellow',
  },
})

const openModal = (ref) => {
  console.log(ref)
}

const BibleStrongRef = ({ reference }) => (
  <Text style={styles.text} onPress={() => openModal(reference)} >
    {reference}
  </Text>
)


BibleStrongRef.propTypes = {
  reference: PropTypes.number.isRequired
}

export default BibleStrongRef
