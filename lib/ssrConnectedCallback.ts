export function ssrConnectedCallback(): ClassDecorator {
  return function (target: any) {
    // Legacy decorator: target is the constructor
    if (typeof target === 'function') {
      target.__ssrConnectedCallback = true;
    }
    // New decorator: target is a class descriptor
    else if (typeof target === 'object' && target?.kind === 'class') {
      return {
        ...target,
        finisher(clazz: any) {
          clazz.__ssrConnectedCallback = true;
        }
      };
    }
  };
}
