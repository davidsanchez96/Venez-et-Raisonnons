/* global fetch */
import React, { PropTypes, Component } from 'react'
import {
  View,
  Text,
  ScrollView
} from 'react-native'
import {
  ScrollableHeader,
  // Share,
  LinkToStudy,
  MarkAsRead,
  AddToFavorites,
  LikeCount,
  VerseModal,
  StylizedHTMLView,
  PrevNext,
} from '@src/components'
import { loadBible, range } from '@src/helpers'
import { Title } from '@src/styled'
import styles, { setDynamicFontSize } from './styles'
import Livres from '../../helpers/livres'

const Books = require('../../helpers/books.json')

export default class QuestionSimple extends Component {
  static propTypes = {
    fromStudy: PropTypes.bool,
    question: PropTypes.object.isRequired,
    topic: PropTypes.object.isRequired,
    markAsRead: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.onLinkPress = ::this.onLinkPress
  }

  state = {
    verseIsLoading: false,
    verse: {
      title: '',
      text: '',
    }
  }

  onLinkPress(url) {
    const { navigator } = this.props
    const { book, chapter, verses } = this.parseUrl(url)
    const bookIndex = Object.keys(Books).find(key => (
      Books[key][0] === book
      || Books[key][1] === book
      || Books[key][2] === book
    ))
    const bookObject = Livres[bookIndex - 1]
    navigator.push('bible', {
      book: bookObject,
      chapter: Number(chapter),
      arrayVerses: {
        verses,
        book: bookObject,
        chapter: Number(chapter),
      },
    })
  }

  /*
  * @example - genese.1.4 - genese.1.4-8 - genese.1.4,8
   */
  parseUrl(url) {
    const [book, chapter, verses] = url.split('.')
    let versesArray

    if (verses.includes('-')) {
      const [vStart, vEnd] = verses.split('-')
      versesArray = range(Number(vStart), Number(vEnd) + 1)
    } else if (verses.includes(',')) {
      const [vStart, vEnd] = verses.split(',')
      versesArray = [vStart, vEnd]
    } else {
      versesArray = [Number(verses)]
    }

    return {
      book,
      chapter,
      verses: versesArray
    }
  }

  render() {
    const {
      question,
      topic,
      markAsRead,
      fromStudy,
    } = this.props

    return (
      <View style={styles.container}>
        <ScrollableHeader
          title={question.get('title')}
          onScrollViewEnd={() => markAsRead(question.get('id'))}
          header={(
            <View style={styles.header}>
              <Text style={styles.topic}>{ topic.get('title') }</Text>
              <Title reverse secondaryFont style={setDynamicFontSize(question.get('title'))}>{ question.get('title') }</Title>
            </View>
          )}
          rightComponent={(
            <AddToFavorites
              id={question.get('id')}
              hasIconOnly
            />
          )}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.responseContainer}>
              <Text style={styles.subTitle}>Réponse</Text>
              <StylizedHTMLView
                value={question.get('description')}
                onLinkPress={this.onLinkPress}
              />
            </View>
            {
              (!!question.get('parent') && !fromStudy) &&
              <LinkToStudy id={question.get('parent')} />
            }
            <View style={styles.shareWrapper}>
              {/* <Share id={question.get('id')} /> */}
              <MarkAsRead id={question.get('id')} />
              <AddToFavorites id={question.get('id')} />
            </View>
            <LikeCount count={question.get('likeCount')} id={question.get('id')} />
            {
              !!question.get('parent') &&
              <PrevNext
                parentId={question.get('parent')}
                questionId={question.get('id')}
              />
            }
          </ScrollView>
        </ScrollableHeader>
        <VerseModal
          refValue={(c) => { this.modal = c }}
          isLoading={this.state.verseIsLoading}
          title={this.state.verse.title}
          text={this.state.verse.text}
        />
      </View>
    )
  }
}
