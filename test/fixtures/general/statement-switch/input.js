import { Flex, Button, Image, Feed } from '@tencent/comby-lib-mobile'

let ui = null

switch (ui) {
  case Flex:
    ui = 1
    break
  case Button:
    ui = 2
    break
  case Image:
    ui = 3
    break
  default:
    ui = 4
}

switch (Feed) {
  case Flex:
    ui = 1
    break
  case Button:
    ui = 2
    break
  default:
    ui = 4
}
