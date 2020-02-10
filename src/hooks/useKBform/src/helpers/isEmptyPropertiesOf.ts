import utils from '../utils/utils';

/* returns true if each property in object is empty */
export default function isEmptyPropertiesOf(obj: any) {
  return Object.values(obj).every(item => utils.isEmpty(item));
}
