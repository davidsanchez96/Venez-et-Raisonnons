import React, { PropTypes } from 'react';
import { Link } from 'react-router-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  Text,
  View
} from 'react-native';

import { List, QuestionItem } from '../components';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontFamily: '$font.title',
    fontSize: 34,
  },
  subTitleText: {
    fontFamily: '$font.title_italic',
    fontSize: 13,
    lineHeight: 13,
  },
  titleBorder: {
    marginTop: 20,
    marginBottom: 40,
    width: 35,
    height: 3,
    backgroundColor: '$color.primary',
  }
});

function renderHeader(headerTitle, questionsCount) {
  return function () {
    return (
      <View>
        <Text style={styles.titleText}>{headerTitle}</Text>
        <Text style={styles.subTitleText}>{`${questionsCount} questioens`}</Text>
        <View style={styles.titleBorder} />
      </View>
    );
  };
}

const QuestionsList = ({ questions, headerTitle, questionsCount, style, ...props }) =>
  <List
    listItems={questions}
    renderHeader={renderHeader(headerTitle, questionsCount)}
    renderRow={
      function ({ id, title }) {
        return (
          <QuestionItem
            id={id}
            title={title}
          />
        );
      }
    }
    style={[styles.container, style]}
    {...props}
  />
;

QuestionsList.propTypes = {
  questions: PropTypes.object.isRequired,
  questionsCount: PropTypes.number.isRequired,
  headerTitle: PropTypes.string.isRequired,
  style: PropTypes.number,
};

export default QuestionsList;
