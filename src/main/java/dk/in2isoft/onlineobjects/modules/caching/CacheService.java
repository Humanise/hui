package dk.in2isoft.onlineobjects.modules.caching;

import java.io.Serializable;
import java.util.concurrent.Callable;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.onlineobjects.model.Entity;
import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;
import net.sf.ehcache.config.CacheConfiguration;
import net.sf.ehcache.config.PersistenceConfiguration;
import net.sf.ehcache.config.PersistenceConfiguration.Strategy;
import net.sf.ehcache.store.MemoryStoreEvictionPolicy;

public class CacheService implements InitializingBean {

	private CacheManager manager;
	private static final Logger log = LoggerFactory.getLogger(CacheService.class);	
	
	
	public <T> T getCached(Entity entity,Class<T> perspective, Callable<T> producer) {
		Cache cache = getCache(perspective);
		Serializable key = entity.getId();
		Element found = cache.get(key);
		if (found!=null) {
			Object value = found.getObjectValue();
			if (value!=null && perspective.isAssignableFrom(value.getClass())) {
				log.trace("Hit");
				return Code.cast(value);
			}
		}
		try {
			log.trace("Miss");
			T value = producer.call();
			Element element = new Element(key, value);
			log.trace("Added");
			cache.put(element);
			return value;
		} catch (Exception e) {
			log.error("Unable to produce object for cache", e);
			return null;
		}
	}
	
	private Cache getCache(Class<?> cls) {
		String cacheName = cls.getName();
		Cache cache = manager.getCache(cacheName);
		if (cache == null) {
			int maxEntriesLocalHeap = 10;
			cache = new Cache(new CacheConfiguration(cacheName, maxEntriesLocalHeap)
					.memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.LFU).eternal(false).timeToLiveSeconds(60*60)
					.timeToIdleSeconds(60*60)
					.persistence(new PersistenceConfiguration().strategy(Strategy.LOCALTEMPSWAP)));
			manager.addCache(cache);
		}
		return cache;
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
		manager = CacheManager.create(); 
	}

}
