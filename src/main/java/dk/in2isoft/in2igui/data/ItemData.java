package dk.in2isoft.in2igui.data;

import java.util.Collection;
import java.util.List;

import com.google.common.collect.Lists;

public class ItemData implements Option {
	private String text;
	private long id;
	private String icon;
	private Object value;
	private String badge;
	private String kind;

	public ItemData() {
	}
	
	public ItemData(Object value) {
		this.value = value;
	}

	public String getTitle() {
		return text;
	}

	@Deprecated
	public void setTitle(String text) {
		this.text = text;
	}

	@Override
	public String getText() {
		return text;
	}
	
	public void setText(String text) {
		this.text = text;
	}
	
	public ItemData withText(String text) {
		this.text = text;
		return this;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}
	
	public ItemData withIcon(String icon) {
		this.icon = icon;
		return this;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public void setBadge(String badge) {
		this.badge = badge;
	}

	public String getBadge() {
		return badge;
	}

	public void setKind(String kind) {
		this.kind = kind;
	}

	public String getKind() {
		return kind;
	}

	public static Collection<Long> getIds(List<ItemData> items) {
		Collection<Long> ids = Lists.newArrayList();
		if (items!=null) {
			for (ItemData itemData : items) {
				ids.add(itemData.getId());
			}
		}
		return ids;
	}
}
