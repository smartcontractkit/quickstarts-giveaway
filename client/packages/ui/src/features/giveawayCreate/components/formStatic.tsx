import React from 'react'
import { ethers } from 'ethers'
import { GridItem } from '@chakra-ui/react'
import { CSVUpload, Control } from '@ui/components'

export const initialStaticState = {
  participants: []
}

export const FormStatic = ({ update, validation }) => {
  const onCsvUpload = (data) => {
    const flatten = ([value]) => value
    const removeNull = (value) => value !== ''
    const hash = (participant) =>
      ethers.utils.solidityKeccak256(['string'], [participant])
    const participants = data.map(flatten).filter(removeNull).map(hash)
    update({ participants })
  }

  const downloadCSV = () => {
    const exampleCSV = 'john\nsteve\nbrad'
    const blob = new Blob([exampleCSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'example.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <GridItem colSpan={2}>
      <Control
        label="Participants"
        isInvalid={!!validation['participants']}
        errorMessage={validation['participants']}
        helper={
          <>
            <button onClick={downloadCSV}>Click here to download</button> CSV
            file example
          </>
        }>
        <CSVUpload
          callback={onCsvUpload}
          isInvalid={!!validation['participants']}
          details="Drop CSV file here or click to upload"
        />
      </Control>
    </GridItem>
  )
}
