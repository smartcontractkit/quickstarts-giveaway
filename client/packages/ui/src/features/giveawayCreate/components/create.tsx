import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Heading,
  Center,
  Text,
  Select,
  Input,
  Grid,
  GridItem,
  Button,
  Link
} from '@chakra-ui/react'
import { Routes } from '@ui/Routes'
import { Error, Control } from '@ui/components'
import { useAsyncManager, useStore } from '@ui/hooks'
import {
  createGiveaway,
  FormStatic,
  FormDynamic,
  initialStaticState,
  initialDynamicState
} from '@ui/features/giveawayCreate'
import { GiveawayType } from '@ui/models'

export const baseInitialState = {
  name: '',
  prizeName: '',
  totalWinners: 1
}

export const GiveawayCreate = () => {
  const { address } = useAccount()

  const store = useStore({
    ...baseInitialState,
    ...initialStaticState
  })

  const asyncManager = useAsyncManager()
  const history = useHistory()
  const [type, setType] = useState(GiveawayType.STATIC)
  const [validation, setValidation] = useState({})

  const { state, update } = store

  const componentDidMount = () => {
    if (!address) history.push(Routes.GiveawayList)
  }

  const componentDidUnmount = () => store.reset()

  useEffect(componentDidMount, [])
  useEffect(componentDidUnmount, [])

  const onTypeChange = (e) => {
    resetFormValidation()
    if (e.target.value == GiveawayType.STATIC) {
      setType(GiveawayType.STATIC)
      update({
        ...baseInitialState,
        ...initialStaticState,
        ...initialDynamicState,
        automation: false,
        fee: 0,
        hours: 24
      })
    }
    if (e.target.value == GiveawayType.DYNAMIC) {
      setType(GiveawayType.DYNAMIC)
      update({
        ...baseInitialState,
        ...initialDynamicState,
        ...initialStaticState,
        participants: []
      })
    }
  }

  const resetFormValidation = () => {
    setValidation({})
  }

  const isFormValid = () => {
    resetFormValidation()
    const invalidList = Object.keys(state).filter((name) => {
      if (
        (Array.isArray(state[name]) && state[name].length === 0) ||
        ((typeof state[name] === 'string' || state[name] instanceof String) &&
          state[name].trim().length === 0)
      ) {
        setValidation((state) => ({ ...state, [name]: 'Required Field' }))
        return true
      }
      return false
    })

    return (
      invalidList.filter((key) => {
        if (type == GiveawayType.DYNAMIC) {
          return !Object.keys(initialStaticState).includes(key)
        }
        if (type == GiveawayType.STATIC) {
          return !Object.keys(initialDynamicState).includes(key)
        }
        return key
      }).length === 0
    )
  }

  const onTextChange = (key) => (e) => update({ [key]: e.target.value })

  const onCheckboxChange = (key) => () => update({ [key]: !state[key] })

  const onSubmit = () => {
    if (isFormValid()) {
      createGiveaway({ state, asyncManager, history })
    }
  }

  return (
    <Container
      maxW="container.xl"
      my="20"
      p="10"
      pb="24"
      bg="brand.white"
      boxShadow="brand.base"
      borderRadius="base">
      <Error asyncManager={asyncManager} />

      <Center flexDirection="column" mb="14">
        <Heading size="2xl" fontWeight="700" mb="6">
          Create Giveaway
        </Heading>
        <Text fontSize="lg" color="brand.gray_70" fontWeight="600">
          Create dynamic or static giveaway
        </Text>
        <Link
          as={RouterLink}
          to={Routes.FAQ}
          color="brand.blue"
          textDecoration="underline">
          Need help? Check out our FAQ page.
        </Link>
      </Center>
      <Grid templateColumns="repeat(3, 1fr)" gap={14} rowGap={14} mb={12}>
        <GridItem>
          <Control label="Select Giveaway Type">
            <Select
              value={type}
              onChange={onTypeChange}
              data-testid="select-type">
              <option value={GiveawayType.STATIC}>Static</option>
              <option value={GiveawayType.DYNAMIC}>Dynamic</option>
            </Select>
          </Control>
        </GridItem>

        <GridItem>
          <Control
            label="Giveaway Name"
            helper="Max 40 characters"
            isInvalid={!!validation['name']}
            errorMessage={validation['name']}>
            <Input
              isInvalid={!!validation['name']}
              type="text"
              placeholder="Name"
              value={state.name}
              onChange={onTextChange('name')}
            />
          </Control>
        </GridItem>

        <GridItem>
          <Control
            label="Number of winners"
            helper="Max 200 winners"
            isInvalid={!!validation['totalWinners']}
            errorMessage={validation['totalWinners']}>
            <Input
              isInvalid={!!validation['totalWinners']}
              type="text"
              placeholder="Number"
              value={state.totalWinners}
              onChange={onTextChange('totalWinners')}
            />
          </Control>
        </GridItem>

        <GridItem>
          <Control
            label="Prize description"
            helper="Max 40 charcters"
            isInvalid={!!validation['prizeName']}
            errorMessage={validation['prizeName']}>
            <Input
              isInvalid={!!validation['prizeName']}
              type="text"
              placeholder="Name"
              value={state.prizeName}
              onChange={onTextChange('prizeName')}
            />
          </Control>
        </GridItem>
        {type == GiveawayType.STATIC ? (
          <FormStatic update={update} validation={validation} />
        ) : (
          <FormDynamic
            validation={validation}
            state={state}
            onTextChange={onTextChange}
            onCheckboxChange={onCheckboxChange}
          />
        )}
      </Grid>
      <Center>
        <Button
          variant="default"
          onClick={onSubmit}
          isLoading={asyncManager.loading || asyncManager.pending}
          loadingText={
            asyncManager.loading ? 'Submitting' : 'Pending Transaction'
          }>
          Create
        </Button>
      </Center>
    </Container>
  )
}
