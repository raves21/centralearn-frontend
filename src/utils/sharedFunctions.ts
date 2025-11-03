import { forOwn, isObject, isEqual, sortBy } from "lodash";

export function diffToFormData<T extends Record<string, any>>(
  obj1: T,
  obj2: T
): FormData {
  const formData = new FormData();

  forOwn(obj1, (value, key) => {
    if (!isEqual(value, obj2[key])) {
      // Handle nested objects or arrays by serializing them
      const val =
        isObject(value) &&
        !((value as any) instanceof File) &&
        !((value as any) instanceof Blob)
          ? JSON.stringify(value)
          : value;

      formData.append(key, val);
    }
  });

  return formData;
}

export function isArrayEqualRegardlessOfOrder(arr1: any, arr2: any) {
  return isEqual(sortBy(arr1), sortBy(arr2));
}
