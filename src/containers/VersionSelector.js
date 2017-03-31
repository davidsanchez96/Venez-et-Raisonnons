import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import * as BibleActions from '@src/redux/modules/bible'

import {
  View,
} from 'react-native'

import { Header, VersionSelectorItem, List } from '@src/components'

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 20,
  },
})

type Props = {
  version: string,
  navigator: object,
  setVersion: func,
}

const versions = fromJS({
  LSG: {
    id: 'LSG',
    name: 'Bible Second 1910',
  },
  STRONG: {
    id: 'STRONG',
    name: 'Bible Second 1910 Strong',
  },
  FRDBY: {
    id: 'FRDBY',
    name: 'Bible Darby en français'
  }
})

const setAndClose = (setVersion, navigator, vers) => {
  setVersion(vers)
  navigator.pop()
}

const VersionSelector = ({ version, setVersion, navigator }: Props) => (
  <View style={styles.container}>
    <Header title="Versions" />
    <List
      listItems={versions}
      renderRow={v =>
        <VersionSelectorItem
          onChange={vers => setAndClose(setVersion, navigator, vers)}
          version={v}
          isSelected={v.id === version}
        />
      }
      style={styles.list}
    />
  </View>
)

export default connect(null, BibleActions)(VersionSelector)
