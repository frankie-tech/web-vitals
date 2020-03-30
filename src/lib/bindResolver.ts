/*
 * Copyright 2020 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {PerformanceEntryHandler} from './observe.js';
import {Resolver} from './promisifyObserver.js';
import {Metric, ChangeHandler} from '../types.js';


export const bindResolver = (
    resolve: Resolver,
    metric: Metric,
    po: PerformanceObserver | undefined,
    entryHandler: PerformanceEntryHandler,
    onChange?: ChangeHandler,
) => {
  return () => {
    if (po) {
      po.takeRecords().map(entryHandler);
      po.disconnect();
    }
    if (typeof metric.value === 'number') {
      if (!metric.isFinal) {
        metric.isFinal = true;
        if (onChange) {
          onChange(metric);
        }
      }
      resolve(metric);
    }
  };
};
