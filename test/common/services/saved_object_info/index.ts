/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { run } from '@kbn/dev-utils';
import { pipe } from 'fp-ts/function';
import { format, noop, areValid, print, expectedFlags } from './utils';
import { types } from './saved_object_info';

export { SavedObjectInfoService } from './saved_object_info';

export const runSavedObjInfoSvc = () =>
  run(
    async ({ flags, log }) => {
      const getTypesF = types(flags.esUrl as string);
      const getTypesNoFilter = getTypesF();
      const getTypesFiltered = getTypesF(flags.type);
      const exec = flags.type ? getTypesFiltered() : getTypesNoFilter();

      return areValid(flags) ? await pipe(await exec, format, print(log)()) : noop();
    },
    {
      description: `

Show information pertaining to the saved objects in the .kibana index

Examples:

See 'saved_objects_info_svc.md'

      `,
      flags: expectedFlags(),
    }
  );
