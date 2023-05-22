export function cacheConfigFunctions(prefixCacheKey: string) {
  function decoratorCacheConfig (target, name, descriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args) {
        const cacheKey = `${prefixCacheKey}_${args[0]}`;
        const cachedValue = await this.cacheManager.get(cacheKey);

        if (cachedValue) {
            return cachedValue;
        }
        const result = await original.apply(this, args);
        await this.cacheManager.set(cacheKey, result, 90);
        return result;
    };
    return descriptor;
  }

  return decoratorCacheConfig;
}
