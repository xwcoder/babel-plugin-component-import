import { Button, Flex as FlexV } from '@tencent/comby-lib-mobile'
import * as comby2 from '@tencent/comby-lib-mobile'
import comby from '@tencent/comby-lib-mobile'
import comby3 from '@tencent/comby-lib-mobile'

const a = [Button, FlexV]
const b = { 'test': [Button] }
;[Button].map(function(){})
const t = ['1', '2', Button, Button.Image, comby]

function render () {

  const FlexV = {}

  const a = [Button, FlexV]
  const b = { 'test': [Button] }
    ;[Button].map(function () { })
  const t = ['1', '2', Button, Button.Image, comby, comby2]
  t.forEach(item => {})
}
