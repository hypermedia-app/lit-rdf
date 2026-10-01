export type GraphProps<Key extends string = ''> = {
  [key in `graph${Key}`]: string | URL;
}
