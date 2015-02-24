package dk.in2isoft.in2igui.data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableMap.Builder;
import com.google.common.collect.Maps;

public class ListData extends HashMap<String, Object> {

	private static final long serialVersionUID = 1L;

	public void setWindow(int total,int size, int page) {
		HashMap<String, Integer> map = Maps.newHashMap();
		map.put("total", total);
		map.put("size", size);
		map.put("page", page);
		this.put("window", map);
	}
	
	public void addHeader(String title) {
		List<Map<String,Object>> headers = getHeaders();
		Map<String, Object> map = Maps.newHashMap();
		map.put("title", title);
		headers.add(map);
	}
	
	public void newRow(Long id,String kind) {
		HashMap<String, Object> map = Maps.newHashMap();
		map.put("id", id);
		map.put("kind", kind);
		getRows().add(map);
	}
	
	public void newRow(Long id,String kind, Object data) {
		HashMap<String, Object> map = Maps.newHashMap();
		map.put("id", id);
		map.put("kind", kind);
		map.put("data", data);
		getRows().add(map);
	}
	
	public void newRow() {
		newRow(null, null);
	}
	
	@SuppressWarnings("unchecked")
	public void addCell(String text, String icon) {
		List<Map<String,Object>> rows = getRows();
		Map<String, Object> row = rows.get(rows.size()-1);
		if (!row.containsKey("cells")) {
			row.put("cells", new ArrayList<Map<String, Object>>());
		}
		ArrayList<Map<String, Object>> cells = (ArrayList<Map<String, Object>>) row.get("cells");
		Builder<String, Object> builder = ImmutableMap.builder();
		if (text!=null) builder.put("text", text);
		if (icon!=null) builder.put("icon", icon);
		cells.add(builder.build());
	}

	public void addCell(String text) {
		addCell(text,null);
	}

	public void addCell(boolean bool) {
		addCell(String.valueOf(bool));
	}
	
	@SuppressWarnings("unchecked")
	private List<Map<String,Object>> getRows() {
		if (!this.containsKey("rows")) {
			put("rows",new ArrayList<Map<String,Object>>());
		}
		return (List<Map<String, Object>>) get("rows");
	}
	
	@SuppressWarnings("unchecked")
	private List<Map<String,Object>> getHeaders() {
		if (!this.containsKey("headers")) {
			put("headers",new ArrayList<Map<String,Object>>());
		}
		return (List<Map<String, Object>>) get("headers");
	}

	public void addCell(Long number) {
		addCell(number==null ? null : number.toString());
	}
}
