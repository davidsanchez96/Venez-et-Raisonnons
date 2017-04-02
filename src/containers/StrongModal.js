import React, { PropTypes, Component } from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { NavigationStyles, withNavigation } from '@expo/ex-navigation'
import { Button } from 'react-native-elements'
import {
  View,
  Text,
  StatusBar,
  ScrollView,
} from 'react-native'
import getDB from '@src/helpers/database'
import { capitalize } from '@src/helpers'
import {
  Header,
  Loading,
  StylizedHTMLView,
  ConcordanceList,
} from '@src/components'

const concordanceLimit = 30

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
  },
  mot: {
    fontFamily: '$font.title',
    fontSize: 22,
  },
  type: {
    fontFamily: '$font.title_italic',
    color: '$color.darkGrey'
  },
  phonetique: {
    fontFamily: '$font.text',
    fontSize: 16,
    color: '$color.darkGrey'
  },
  item: {
    marginTop: 25,
  },
  subtitle: {
    fontFamily: '$font.heading',
    fontSize: 20,
    marginBottom: 5,
  },
  line: {
    fontSize: 16,
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleBorder: {
    marginTop: 20,
    marginBottom: 20,
    width: 35,
    height: 3,
    backgroundColor: '$color.secondary',
  },
  button: {
    marginTop: 20,
    backgroundColor: '$color.primary',
  }
})

@withNavigation
export default class StrongModal extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
  }

  static route = {
    styles: {
      ...NavigationStyles.FloatVertical,
      gestures: null,
    }
  }

  constructor(props) {
    super(props)

    this.linkToStrong = ::this.linkToStrong
  }

  state = {
    isLoading: true,
    isConcordanceLoading: true,
  }

  componentWillMount() {
    this.DB = getDB()
    this.loadStrong()
    setTimeout(() => this.loadConcordance(), 500)
  }

  loadStrong() {
    const { route: { params: { reference, book } } } = this.props
    this.strongRef = []
    this.setState({ isLoading: true })
    const part = book > 39 ? 'Grec' : 'Hebreu'
    this.DB.executeSql(`SELECT * FROM ${part} WHERE Code = ${reference}`)
      .then(([results]) => {
        const len = results.rows.length
        for (let i = 0; i < len; i += 1) { this.strongRef.push(results.rows.item(i)) }
        this.setState({ isLoading: false })
      })
  }

  loadConcordance() {
    const { route: { params: { reference, book } } } = this.props
    this.concordancesTexts = []
    this.setState({ isConcordanceLoading: true })
    const part = book > 39 ? 'LSGSNT2' : 'LSGSAT2'
    this.DB.executeSql(`SELECT Livre, Chapitre, Verset, Texte FROM ${part} WHERE Texte LIKE '% ${reference}%' OR Texte LIKE '%(${reference}%' ORDER BY Livre ASC LIMIT ${concordanceLimit}`)
      .then(([results]) => {
        const len = results.rows.length
        for (let i = 0; i < len; i += 1) { this.concordancesTexts.push(results.rows.item(i)) }
        this.setState({ isConcordanceLoading: false })
      })
  }

  linkToStrong(ref) {
    const {
      navigator,
      route: { params: { book } },
    } = this.props
    navigator.push('strongModal', { ref: ref.replace(/\D/g, ''), book })
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Loading />
      )
    }

    const {
      route: { params: { reference, book } },
      navigator,
    } = this.props
    const { isConcordanceLoading } = this.state
    const {
      Hebreu,
      Grec,
      Mot,
      Phonetique,
      Definition,
      Origine,
      Type,
      LSG,
    } = this.strongRef[0]

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header
          isLight
          isModal
          title={`Strong ${reference}`}
        />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.mot}>
            {capitalize(Mot)}
            {
              !!Phonetique &&
              <Text style={styles.phonetique}> {Phonetique}</Text>
            }
          </Text>
          {
            !!Type &&
            <Text style={styles.type}>{Type}</Text>
          }
          <View style={styles.titleBorder} />
          {
            !!Hebreu &&
            <View>
              <Text style={styles.line}>
                Hébreu:&nbsp;
                <Text style={styles.word}>{Hebreu}</Text>
              </Text>
            </View>
          }
          {
            !!Grec &&
            <View>
              <Text style={styles.line}>
                Grec:
                <Text style={styles.word}>{Grec}</Text>
              </Text>
            </View>
          }
          {
            !!Definition &&
            <View style={styles.item}>
              <Text style={styles.subtitle}>Définition</Text>
              <StylizedHTMLView
                value={Definition}
                onLinkPress={this.linkToStrong}
              />
            </View>
          }
          {
            !!LSG &&
            <View style={styles.item}>
              <Text style={styles.subtitle}>Généralement traduit par</Text>
              <Text style={styles.line}>{LSG}</Text>
            </View>
          }
          {
            !!Origine &&
            <View style={styles.item}>
              <Text style={styles.subtitle}>Origine du mot</Text>
              <StylizedHTMLView
                value={Origine}
                onLinkPress={this.linkToStrong}
              />
            </View>
          }
          <View style={styles.item}>
            <Text style={styles.subtitle}>Concordance</Text>
            {
              !isConcordanceLoading &&
              <View>
                <ConcordanceList
                  concordanceFor={reference}
                  list={this.concordancesTexts}
                  navigator={navigator}
                />
                {
                  !(this.concordancesTexts.length < concordanceLimit) &&
                  <Button
                    title="Voir tous les versets"
                    buttonStyle={styles.button}
                    onPress={() => navigator.push('concordance', { reference, book })}
                  />
                }
              </View>
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}
