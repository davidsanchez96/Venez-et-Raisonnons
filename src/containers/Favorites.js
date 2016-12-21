import React, { PropTypes } from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import {
  View,
  Text,
} from 'react-native'
import {
  Header,
  QuestionsList,
} from '../components'

const getFavoritesIds = state => state.app.get('favorites')
const getQuestions = state => state.questions.get('questions')

const filterQuestionsByFavorites = createSelector(
  [getFavoritesIds, getQuestions],
  (ids, questions) => questions.filter(q => ids.find((v, k) => k === q.get('id')))
)

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

const IfQuestions = (questions) => {
  if (questions.isEmpty()) {
    return (
      <View>
        <Text>
          Pas de résultats
        </Text>
      </View>
    )
  }

  return (
    <QuestionsList
      questions={questions}
    />
  )
}

const Favorites = ({ questions }) => (
  <View style={styles.container}>
    <Header
      title="Favoris"
      hasBackButton={false}
    />
    {IfQuestions(questions)}
  </View>
)

Favorites.propTypes = {
  questions: PropTypes.object.isRequired,
}

export default connect(
  state => ({
    questions: filterQuestionsByFavorites(state),
  }),
)(Favorites)
