import { WorkspaceitemSectionFormObject } from './workspaceitem-section-form.model';
import { WorkspaceitemSectionLicenseObject } from './workspaceitem-section-license.model';
import { WorkspaceitemSectionUploadObject } from './workspaceitem-section-upload.model';
import { isNotEmpty, isNotNull } from '../../../shared/empty.util';
import { AuthorityModel } from '../../integration/models/authority.model';
import { LanguageCode } from '../../../shared/form/builder/models/form-field-language-value.model';
import { FormFieldLanguageValueObject } from '../../../shared/form/builder/models/form-field-language-value.model';
import { WorkspaceitemSectionRecycleObject } from './workspaceitem-section-recycle.model';
import { WorkspaceitemSectionDeduplicationObject } from './workspaceitem-section-deduplication.model';

export class WorkspaceitemSectionsObject {
  [name: string]: WorkspaceitemSectionDataType;

}

export function isServerFormValue(obj: any): boolean {
  return (typeof obj === 'object'
    && obj.hasOwnProperty('value')
    && obj.hasOwnProperty('language')
    && obj.hasOwnProperty('authority')
    && obj.hasOwnProperty('confidence')
    && obj.hasOwnProperty('place'))
}

export function normalizeSectionData(obj: any) {
  let result: any = obj;
  if (isNotNull(obj)) {
    // If is an Instance of FormFieldMetadataValueObject normalize it
    if (typeof obj === 'object'
      && isServerFormValue(obj)) {
      // If authority property is set normalize as an AuthorityModel object
      /* NOTE: Data received from server could have authority property equal to null, but into form
         field's model is required an AuthorityModel object as field value, so double-check in
         field's parser and eventually instantiate it */
      if (isNotEmpty(obj.authority)) {
        const authorityValue: AuthorityModel = new AuthorityModel();
        authorityValue.id = obj.authority;
        authorityValue.value = obj.value;
        authorityValue.display = obj.value;
        authorityValue.language = obj.language;
        result = authorityValue;
      } else if (isNotEmpty(obj.language)) {
        const languageValue = new FormFieldLanguageValueObject(obj.value, obj.language);
        result = languageValue;
      } else {
        // Normalize as a string value
        result = obj.value;
      }
    } else if (Array.isArray(obj )) {
      result = [];
      obj.forEach((item, index) => {
          result[index] = normalizeSectionData(item);
      });
    } else if (typeof obj === 'object') {
      result = Object.create({});
      Object.keys(obj)
        .forEach((key) => {
          result[key] = normalizeSectionData(obj[key]);
      });
    }
  }
  return result;
}

export type WorkspaceitemSectionDataType
  = WorkspaceitemSectionUploadObject
  | WorkspaceitemSectionFormObject
  | WorkspaceitemSectionLicenseObject
  | WorkspaceitemSectionRecycleObject
  | WorkspaceitemSectionDeduplicationObject
  | string;
