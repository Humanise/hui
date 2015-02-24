package dk.in2isoft.onlineobjects.ui;

import java.util.List;

import com.google.common.collect.Lists;

public class Blend {

	private List<String[]> paths = Lists.newArrayList();
	
	private String hash;
	
	public Blend(String hash) {
		this.hash = hash;
	}
	
	public void addPath(String...path) {
		paths.add(path);
	}
	
	public List<String[]> getPaths() {
		return paths;
	}
	
	public String getHash() {
		return hash;
	}

	public void addCoreCSS(String file) {
		addPath("WEB-INF","core","web","css",file);
	}

	public void addHUICSS(String file) {
		addPath("hui","css",file);
	}

	public void addBasicCSS() {
		addPath("hui","css","curtain.css");
		addPath("hui","css","button.css");
		addPath("hui","css","boundpanel.css");
		addPath("hui","css","checkbox.css");
		addPath("hui","css","formula.css");
		addPath("hui","css","message.css");
		addPath("hui","css","icon.css");
		addPath("hui","css","effects.css");
		addCoreCSS("oo_font.css");
		addCoreCSS("oo_body.css");
		addCoreCSS("oo_topbar.css");
		addCoreCSS("oo_layout.css");
		addCoreCSS("oo_footer.css");
		addCoreCSS("oo_link.css");
		addCoreCSS("oo_header.css");
		addCoreCSS("oo_icon.css");
	}
}
