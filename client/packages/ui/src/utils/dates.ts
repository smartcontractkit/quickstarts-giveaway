export const formatDate = (
  date: string | number | Date,
  options?: Intl.DateTimeFormatOptions
) => {
  const defaultOptions = options || {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }
  return new Intl.DateTimeFormat('default', defaultOptions).format(
    new Date(date)
  )
}

export const formatUnixTs = (
  unixTs: string | number = 0,
  options?: Intl.DateTimeFormatOptions
) => formatDate(Number(unixTs) * 1000, options)

export const formatFinishDate = (
  unixTsStartDate: string,
  hours: number,
  options?: Intl.DateTimeFormatOptions
) => formatUnixTs(Number(unixTsStartDate) + hours * 3600, options)
