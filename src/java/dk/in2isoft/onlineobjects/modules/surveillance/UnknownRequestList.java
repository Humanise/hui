package dk.in2isoft.onlineobjects.modules.surveillance;

import java.util.Collections;
import java.util.Comparator;
import java.util.SortedSet;
import java.util.TreeSet;

import org.apache.commons.lang.math.NumberUtils;

import dk.in2isoft.onlineobjects.ui.Request;

public class UnknownRequestList {
	private SortedSet<RequestInfo> set;
	
	public UnknownRequestList() {
		TreeSet<RequestInfo> s = new TreeSet<RequestInfo>(new Comparator<RequestInfo>() {

			public int compare(RequestInfo o1, RequestInfo o2) {
				return NumberUtils.compare(o2.getAverageRunningTime(), o1.getAverageRunningTime());
			}
		});
		this.set = Collections.synchronizedSortedSet(s);
	}
	
	public void register(Request request) {
		synchronized (set) {
			RequestInfo existing = getInfoByPath(request);
			if (existing!=null) {
				set.remove(existing);
				existing.merge(request);
				set.add(existing);
			} else {
				if (set.size()>=60) {
					RequestInfo last = set.last();
					if (last.getAverageRunningTime()<request.getRunningTime()) {
						set.remove(set.last());
						set.add(new RequestInfo(request));
					}
				} else {
					set.add(new RequestInfo(request));
				}
			}
		}
	}
	
	private RequestInfo getInfoByPath(Request request) {
		for (RequestInfo info : set) {
			if (info.getUri().equals(request.getRequest().getRequestURI())) {
				return info;
			}
		}
		return null;
	}

	public SortedSet<RequestInfo> getSet() {
		return set;
	}
}
