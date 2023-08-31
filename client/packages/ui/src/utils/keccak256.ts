import keccak256 from 'keccak256'

export const keccak = {
  string: (string) => keccak256(string).toString('hex'),
  buffer: (buffer) => keccak256(Buffer.from(buffer)).toString('hex')
}
