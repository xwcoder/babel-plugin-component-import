import comby from '@tencent/comby-lib-mobile'
import { Flex } from '@tencent/comby-lib-mobile'

ReactDOM.render(<div>
  <comby.Button type="primary">comby Button</comby.Button>
</div>)

function renderButton () {
  const comby = {
    Button () {}
  }

  ReactDOM.render(<div>
    <comby.Button type="primary">Button</comby.Button>
  </div>)
}

ReactDOM.render(<div>
  <Flex.FlexIcon type="primary">comby Button</Flex.FlexIcon>
</div>)

function renderFlex() {
  const Flex = {
    FlexIcon () {}
  }

  ReactDOM.render(<div>
    <Flex.FlexIcon type="primary">comby Button</Flex.FlexIcon>
  </div>)
}

