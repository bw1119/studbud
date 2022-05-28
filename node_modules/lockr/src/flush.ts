import keys from './keys';
import PREFIX, { getPrefixedKey } from './prefix';

export default function flush() {
  if (PREFIX.length > 0) {
    keys().forEach(key => {
      localStorage.removeItem(getPrefixedKey(key));
    });
  } else {
    localStorage.clear();
  }
}
