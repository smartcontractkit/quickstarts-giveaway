import React from 'react'
import { Input, GridItem, Checkbox, Flex } from '@chakra-ui/react'

import { Control } from '@ui/components'

export const initialDynamicState = {
  hours: 24,
  automation: false,
  fee: 0
}

export const FormDynamic = ({
  state,
  onTextChange,
  onCheckboxChange,
  validation
}) => {
  return (
    <>
      <GridItem>
        <Control
          label="Automation"
          helper={
            <a
              href="https://automation.chain.link/"
              target="_blank"
              rel="noreferrer">
              What is Automation?
            </a>
          }>
          <Flex align="center" h="40px">
            <Checkbox
              checked={state.automation}
              onChange={onCheckboxChange('automation')}>
              Enabled
            </Checkbox>
          </Flex>
        </Control>
      </GridItem>

      {state.automation ? (
        <GridItem>
          <Control
            label="Duration (hours)"
            isInvalid={!!validation['hours']}
            errorMessage={validation['hours']}>
            <Input
              isInvalid={!!validation['hours']}
              type="number"
              value={state.hours}
              onChange={onTextChange('hours')}
            />
          </Control>
        </GridItem>
      ) : null}
    </>
  )
}
