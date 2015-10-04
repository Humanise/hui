package dk.in2isoft.commons.jsf;

import java.util.Set;

import com.google.common.collect.LinkedHashMultimap;
import com.google.common.collect.Multimap;
import com.google.common.collect.Sets;

public class DependencyGraph {
	private Multimap<Integer, String> scripts = LinkedHashMultimap.create();
	private Multimap<Integer, String> styles = LinkedHashMultimap.create();
	private Set<Class<?>> visited = Sets.newHashSet();

	public void markVisited(Class<?> cls) {
		visited.add(cls);
	}

	public boolean isVisited(Class<?> cls) {
		return visited.contains(cls);
	}

	public void addScripts(String[] js) {
		if (js != null) {
			for (int i = 0; i < js.length; i++) {
				if (!scripts.containsValue(js[i])) {
					scripts.put(i, js[i]);
				}
			}
		}

	}

	public void addStyles(String[] css) {
		if (css != null) {
			for (int i = 0; i < css.length; i++) {
				if (!styles.containsValue(css[i])) {
					styles.put(i, css[i]);
				}
			}
		}

	}

	public String[] getScripts() {
		return scripts.values().toArray(new String[] {});
	}

	public String[] getStyles() {
		return styles.values().toArray(new String[] {});
	}
}