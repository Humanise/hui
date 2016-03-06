package dk.in2isoft.onlineobjects.modules.caching;

import java.util.Collection;
import java.util.Set;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Sets;

import dk.in2isoft.onlineobjects.core.events.AnyModelChangeListener;
import dk.in2isoft.onlineobjects.core.events.EventService;
import dk.in2isoft.onlineobjects.model.Item;

public abstract class CachedDataProvider<T> implements InitializingBean {

	public enum state {
		empty, ok, dirty, busy
	};

	private EventService eventService;
	private Set<Runnable> listeners = Sets.newHashSet();

	private String key;

	private T data;

	private long buildTime = -1;
	private long changeTime = 0;

	@Override
	public void afterPropertiesSet() throws Exception {
		eventService.addModelEventListener(new AnyModelChangeListener(getObservedTypes()) {
			@Override
			public void itemWasChanged(Item item) {
				changeTime = System.currentTimeMillis();
				tell();
			}
		});
	}

	protected abstract Collection<Class<? extends Item>> getObservedTypes();

	public T getData() {
		if (data == null) {
			buildTime = System.currentTimeMillis();
			data = buildData();
			tell();
		} else if (changeTime >= buildTime) {
			rebuild();
		}
		return data;
	}

	private void rebuild() {
		buildTime = System.currentTimeMillis();
		Runnable job = new Runnable() {

			@Override
			public void run() {
				data = buildData();
				tell();
			}

		};
		Thread t = new Thread(job);
		t.start();
	}
	
	private void tell() {
		for (Runnable runnable : listeners) {
			runnable.run();
		}
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	protected abstract T buildData();


	public void addListener(Runnable listener) {
		listeners.add(listener);
	}

	// Wiring ...

	public void setEventService(EventService eventService) {
		this.eventService = eventService;
	}
}
