import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Routes } from '@ui/Routes'
import { GiveawayList } from '@ui/features/giveawayList'
import { GiveawayDetail } from '@ui/features/giveawayDetail'
import { GiveawayCreate } from '@ui/features/giveawayCreate'
import { AuthenticatedRoute, Hero, FAQ, Disclaimer } from '@ui/components'

export const App = () => (
  <>
    <Switch>
      <Route
        exact
        path={Routes.GiveawayList}
        render={(props) => (
          <>
            <Hero />
            <GiveawayList {...props} />
          </>
        )}
      />

      <Route
        path={Routes.GiveawayDetail}
        render={({ match }) => <GiveawayDetail id={match.params.id} />}
      />

      <Route path={Routes.FAQ} render={FAQ} />

      <Route path={Routes.Disclaimer} render={Disclaimer} />

      <Route exact path={Routes.GiveawayCreate}>
        <AuthenticatedRoute connected={true}>
          <GiveawayCreate />
        </AuthenticatedRoute>
      </Route>

      <Redirect to={Routes.GiveawayList} />
    </Switch>
  </>
)
