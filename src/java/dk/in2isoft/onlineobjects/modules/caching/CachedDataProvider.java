package dk.in2isoft.onlineobjects.modules.caching;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.core.events.AnyModelChangeListener;
import dk.in2isoft.onlineobjects.core.events.EventService;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Word;

public abstract class CachedDataProvider<T> implements InitializingBean {

	public enum state {empty,ok,dirty,busy};
	
	private EventService eventService;
	
	private String key;
	
	private T data;
	
	private long buildTime = -1;
	private long changeTime = 0;
	
	@Override
	public void afterPropertiesSet() throws Exception {
		eventService.addModelEventListener(new AnyModelChangeListener(Word.class) {
			@Override
			public void itemWasChanged(Item item) {
				changeTime = System.currentTimeMillis();
			}
		});
	}
	
	public T getData() {
		if (data==null) {
			buildTime = System.currentTimeMillis();
			data = buildData();
		} else if (changeTime>=buildTime) {
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
			}
			
		};
		Thread t = new Thread(job);
        t.start();
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
	
	public abstract T buildData();
	
	
	// Wiring ...
		
	public void setEventService(EventService eventService) {
		this.eventService = eventService;
	}
}
