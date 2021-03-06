/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { isEmpty } from 'lodash/fp';
import { EuiButton, EuiFlexItem, EuiPanel } from '@elastic/eui';
import numeral from '@elastic/numeral';
import { FormattedMessage } from '@kbn/i18n/react';
import React, { useMemo } from 'react';

import { DEFAULT_NUMBER_FORMAT } from '../../../../../../../../plugins/siem/common/constants';
import { ESQuery } from '../../../../../../../../plugins/siem/common/typed_json';
import {
  ID as OverviewHostQueryId,
  OverviewHostQuery,
} from '../../../../containers/overview/overview_host';
import { HeaderSection } from '../../../header_section';
import { useUiSetting$ } from '../../../../lib/kibana';
import { getHostsUrl } from '../../../link_to';
import { getOverviewHostStats, OverviewHostStats } from '../overview_host_stats';
import { manageQuery } from '../../../page/manage_query';
import { inputsModel } from '../../../../store/inputs';
import { InspectButtonContainer } from '../../../inspect';
import { useGetUrlSearch } from '../../../navigation/use_get_url_search';
import { navTabs } from '../../../../pages/home/home_navigations';

export interface OwnProps {
  startDate: number;
  endDate: number;
  filterQuery?: ESQuery | string;
  setQuery: ({
    id,
    inspect,
    loading,
    refetch,
  }: {
    id: string;
    inspect: inputsModel.InspectQuery | null;
    loading: boolean;
    refetch: inputsModel.Refetch;
  }) => void;
}

const OverviewHostStatsManage = manageQuery(OverviewHostStats);
export type OverviewHostProps = OwnProps;

const OverviewHostComponent: React.FC<OverviewHostProps> = ({
  endDate,
  filterQuery,
  startDate,
  setQuery,
}) => {
  const [defaultNumberFormat] = useUiSetting$<string>(DEFAULT_NUMBER_FORMAT);
  const urlSearch = useGetUrlSearch(navTabs.hosts);
  const hostPageButton = useMemo(
    () => (
      <EuiButton href={getHostsUrl(urlSearch)}>
        <FormattedMessage id="xpack.siem.overview.hostsAction" defaultMessage="View hosts" />
      </EuiButton>
    ),
    [urlSearch]
  );
  return (
    <EuiFlexItem>
      <InspectButtonContainer>
        <EuiPanel>
          <OverviewHostQuery
            data-test-subj="overview-host-query"
            endDate={endDate}
            filterQuery={filterQuery}
            sourceId="default"
            startDate={startDate}
          >
            {({ overviewHost, loading, id, inspect, refetch }) => {
              const hostEventsCount = getOverviewHostStats(overviewHost).reduce(
                (total, stat) => total + stat.count,
                0
              );
              const formattedHostEventsCount = numeral(hostEventsCount).format(defaultNumberFormat);

              return (
                <>
                  <HeaderSection
                    id={OverviewHostQueryId}
                    subtitle={
                      !isEmpty(overviewHost) ? (
                        <FormattedMessage
                          defaultMessage="Showing: {formattedHostEventsCount} {hostEventsCount, plural, one {event} other {events}}"
                          id="xpack.siem.overview.overviewHost.hostsSubtitle"
                          values={{
                            formattedHostEventsCount,
                            hostEventsCount,
                          }}
                        />
                      ) : (
                        <>{''}</>
                      )
                    }
                    title={
                      <FormattedMessage
                        id="xpack.siem.overview.hostsTitle"
                        defaultMessage="Host events"
                      />
                    }
                  >
                    {hostPageButton}
                  </HeaderSection>

                  <OverviewHostStatsManage
                    loading={loading}
                    data={overviewHost}
                    setQuery={setQuery}
                    id={id}
                    inspect={inspect}
                    refetch={refetch}
                  />
                </>
              );
            }}
          </OverviewHostQuery>
        </EuiPanel>
      </InspectButtonContainer>
    </EuiFlexItem>
  );
};

export const OverviewHost = React.memo(OverviewHostComponent);
