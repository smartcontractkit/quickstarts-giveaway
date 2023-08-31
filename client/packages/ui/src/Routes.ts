export const Routes = {
  GiveawayList: '/',
  GiveawayDetail: '/giveaway/:id',
  GiveawayCreate: '/create',
  FAQ: '/faq',
  Disclaimer: '/disclaimer'
}

export const createRoute = ({ route, id }) => route.replace(':id', id)
