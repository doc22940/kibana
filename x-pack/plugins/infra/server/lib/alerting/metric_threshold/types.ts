/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { MetricsExplorerAggregation } from '../../../../common/http_api/metrics_explorer';

export const METRIC_THRESHOLD_ALERT_TYPE_ID = 'metrics.alert.threshold';

export enum Comparator {
  GT = '>',
  LT = '<',
  GT_OR_EQ = '>=',
  LT_OR_EQ = '<=',
  BETWEEN = 'between',
}

export enum AlertStates {
  OK,
  ALERT,
  NO_DATA,
  ERROR,
}

export type TimeUnit = 's' | 'm' | 'h' | 'd';

interface BaseMetricExpressionParams {
  timeSize: number;
  timeUnit: TimeUnit;
  sourceId?: string;
  threshold: number[];
  comparator: Comparator;
}

interface NonCountMetricExpressionParams extends BaseMetricExpressionParams {
  aggType: Exclude<MetricsExplorerAggregation, 'count'>;
  metric: string;
}

interface CountMetricExpressionParams extends BaseMetricExpressionParams {
  aggType: 'count';
  metric: never;
}

export type MetricExpressionParams = NonCountMetricExpressionParams | CountMetricExpressionParams;
